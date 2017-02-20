'use strict';
var TopBar = require('../../components/main/topBar');
var CarBar = require('../../components/main/carBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  Navigator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  NativeAppEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { partition, minBy, maxBy, sumBy, flatMap } from 'lodash';
import callPhone from '../../utils/callPhone';

var width = Dimensions.get('window').width - 20;
var commentWidth = Dimensions.get('window').width - 40;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/most_recent_order';
var UPDATE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/orders/?/update_order_service';
var BULK_UPDATE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/orders/?/update_order_services';

class Approvals extends Component {

    constructor(props) {
      super(props);
      this.state = {
        orderStatus:0,
        services:null,
        total:0,
        tax:0,
        discount:0,
        percentDiscount:0,
        couponDiscount:0,
        caradviseDiscount:0,
        totalDiscount:0,
        finalTotal:0,
        fees:0,
        showSpinner: false,
        showCheckout: false,
        showTotals: false,
        partLow:null,
        partHigh:null,
      };
    }

    componentDidMount() {
      this.getApprovals();

      this.refreshApprovals = NativeAppEventEmitter.addListener(
        'RefreshApprovals', () => this.getApprovals()
      );
    }

    componentWillUnmount() {
      this.refreshApprovals && this.refreshApprovals.remove();
    }

    groupServices(services) {
      let [inspections, otherServices] = partition(services,
        service => !!(service.vehicle_service.service || {}).inspection && !service.group_id);

      if (inspections.length > 0) {
        let serviceLow = minBy(inspections, 'vehicle_service.low_fair_cost');
        let serviceHigh = maxBy(inspections, 'vehicle_service.high_fair_cost');
        let override_total = sumBy(inspections, ({ override_total }) => Number(override_total));

        otherServices.unshift({
          groupedServices: inspections,
          group_id: null,
          group_list: null,
          status: inspections[0].status,
          name: 'Inspections',
          override_total,
          vehicle_service: {
            low_fair_cost: serviceLow.vehicle_service.low_fair_cost,
            high_fair_cost: serviceHigh.vehicle_service.high_fair_cost
          }
        });
      }

      if (otherServices.length > 0) {
        let [individualServices, groupedServices] = partition(otherServices, { group_id: null });

        individualServices.forEach(service => {
          if (!service.group_list) return;

          service.groupedServices = service.group_list
            .map(({ motor_service_id }) => groupedServices
              .find(service => motor_service_id === service.vehicle_service.service_id))
            .filter(service => !!service);

          if (service.groupedServices.length > 0) {
            let serviceLow = minBy(service.groupedServices, 'vehicle_service.low_fair_cost');
            let serviceHigh = maxBy(service.groupedServices, 'vehicle_service.high_fair_cost');

            service.vehicle_service = service.vehicle_service || {};
            service.vehicle_service.low_fair_cost = serviceLow.vehicle_service.low_fair_cost;
            service.vehicle_service.high_fair_cost = serviceHigh.vehicle_service.high_fair_cost;
          }
        })

        otherServices = individualServices;
      }

      return otherServices;
    }

    refreshServices(services, orderStatus, totalDiscount, couponDiscount, percentDiscount, caradviseDiscount, fees, finalTotal, taxAmount, partLow, partHigh, laborLow, laborHigh, misc, taxRate)
    {
      var total = 0;
      var showCheckout = false;

       var approved = services.filter(this.filterApprovedServices.bind(this));
       for (var i = 0; i < approved.length; i++) {
         var cost = approved[i].override_total;
         if(typeof cost !== "undefined")
         {
           total += Number(cost);
         }
       }
       var discount = totalDiscount;
       var fees = fees;
       var subtotal = total + fees + misc - discount;

       var approvedServices = services.filter(this.filterApprovedServices.bind(this));
       var unapprovedServices = services.filter(this.filterUnapprovedServices.bind(this));
       var approvedTotal = approvedServices.length;
       var unapprovedTotal = unapprovedServices.length;

       if(orderStatus == 4)
       {
         this.props.navigator.push({ indent: 'PaymentThanks' });
       }

       if(orderStatus == 1)
       {
         showCheckout = true;
         this.state.showTotals = true;
       }
      this.setState({
        services:null
      });
      this.setState({
        orderStatus: orderStatus,
        services: services,
        showCheckout: showCheckout,
        total: total.toFixed(2),
        percentDiscount: percentDiscount,
        caradviseDiscount: caradviseDiscount,
        discount: discount,
        couponDiscount: couponDiscount,
        totalDiscount: Number(totalDiscount).toFixed(2),
        taxRate: taxRate,
        fees: fees,
        misc: misc,
        partLow: partLow,
        partHigh: partHigh,
        taxAmount: Number(taxAmount).toFixed(2),
        finalTotal: Number(finalTotal).toFixed(2),
      });

      if (this.state.orderStatus == 0 && unapprovedTotal == 0 && approvedTotal != 0) {
        Alert.alert('Hey there!','All work has been approved. You will be notified as soon as work has been completed by the shop.');
      }
    }

    getApprovals() {
      if(this.props.isLoggedIn && this.props.vehicleId)
      {
        //console.log("token is", this.props.authentication_token);
        fetch(MAINTENANCE_URL.replace('?', this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
          .then((response) => response.json())
          .then((responseData) => {
            var orderStatus = (responseData.order != undefined) ? responseData.order.status : 0;
            var caradviseDiscount = (responseData.order != undefined) ? responseData.order.caradvise_discount : 0;
            var percentDiscount = (responseData.order != undefined) ? responseData.order.percent_shop_discount : 0;
            var couponDiscount = (responseData.order != undefined) ? responseData.order.total_coupon_discount : 0;
            var totalDiscount = (responseData.order != undefined) ? responseData.order.total_shop_discount : 0;
            var taxRate = (responseData.order != undefined) ? responseData.order.tax_rate : 0;
            var fees = (responseData.order != undefined) ? responseData.order.shop_fees : 0;
            var misc = (responseData.order != undefined) ? responseData.order.other_misc_fees : 0;
            var finalTotal = (responseData.order != undefined) ? responseData.order.post_tax_total : 0;
            var taxAmount = (responseData.order != undefined) ? responseData.order.tax_amount : 0;
            var services = (responseData.order != undefined && orderStatus != 2 && orderStatus != 3 && finalTotal != 0) ? responseData.order.order_services : [];
            this.refreshServices(services, orderStatus, totalDiscount, couponDiscount, percentDiscount, caradviseDiscount, fees, taxAmount, finalTotal, misc, taxRate);
          })
          .done();

      }
    }

    render() {
      if (!this.state.services) {
        return this.renderLoadingView();
      }
      var services = this.state.services;
      return this.renderServices(services);
    }

    renderLoadingView() {
      return (
        <View>
          <Spinner visible={true} />
        </View>
      );
    }

    filterUnapprovedServices(service)
    {
      return (service.status == 0 || service.status == 1);
    }

    filterApprovedServices(service)
    {
      return (service.status == 2 || service.status == 5);
    }

    renderFees()
    {
      if (this.state.fees != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Shop Fees</Text>
              <Text style={styles.extrasPrice}>${this.state.fees.toFixed(2)}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderCaradviseDiscount()
    {
      if (this.state.caradviseDiscount != null && this.state.caradviseDiscount != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>CarAdvise Discount</Text>
              <Text style={styles.extrasPrice}>-${this.state.caradviseDiscount.toFixed(2)}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderCouponDiscount()
    {
      if (this.state.couponDiscount != null && this.state.couponDiscount != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Coupon Discount</Text>
              <Text style={styles.extrasPrice}>-${this.state.couponDiscount.toFixed(2)}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderDiscount()
    {
      if (this.state.totalDiscount != null && this.state.totalDiscount != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Shop Discount</Text>
              <Text style={styles.extrasPrice}>-${this.state.totalDiscount}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderDiscountPercent()
    {
      if (this.state.percentDiscount != null && this.state.percentDiscount != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Shop Discount</Text>
              <Text style={styles.extrasPrice}>{this.state.percentDiscount}% off</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderSubtotal()
    {
        if (this.state.showTotals == false) {
            return (
              <View>
                <View style={styles.subtotalRow}>
                  <Text style={styles.subtotalItem}>Subtotal</Text>
                  <Text style={styles.subtotalPrice}>${this.state.total}</Text>
                </View>
                {/*<View style={styles.checkoutMessageContainer}>
                  <View style={styles.checkoutMessage}><Text style={styles.checkoutMessageTxt}>Once your order is complete, you will be able to proceed to checkout here.</Text></View>
                </View>*/}
              </View>
            );
        } else {
            return null;
        }
    }

    renderTotals()
    {
      if (this.state.showTotals == true) {
          return (
            <View>
            {this.renderFees()}
            {this.renderCaradviseDiscount()}
            {this.renderCouponDiscount()}
            {this.renderDiscount()}
            {this.renderDiscountPercent()}

            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Sales Tax</Text>
              <Text style={styles.extrasPrice}>${this.state.finalTotal}</Text>
            </View>
            <View style={styles.newTotal}>
              <Text style={styles.newTotalText}>Total</Text>
              <Text style={styles.newTotalPrice}>${this.state.taxAmount}</Text>
            </View>
            </View>
          );
      } else {
          return null;
      }
    }

    renderCheckout()
    {
        if (this.state.showCheckout) {
            return (
              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Coupon' })}>
                  <Image
                    source={require('../../../images/btn-proceed.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>
            );
        } else {
            return null;
        }
    }

    renderServices(services) {
        var unapprovedServices = services.filter(this.filterUnapprovedServices.bind(this));
        var approvedServices = services.filter(this.filterApprovedServices.bind(this));

        unapprovedServices = this.groupServices(unapprovedServices);
        approvedServices = this.groupServices(approvedServices);

        return (
          <View style={styles.base}>
            <View>
              <Spinner visible={this.state.showSpinner} />
            </View>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.approvalsContainer}>

              <Text style={styles.textHd}>Services To Approve</Text>

              <View style={styles.newServicesList}>
              {unapprovedServices.length ?
                unapprovedServices.map(this.createServiceRow) :
                <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>No services to approve</Text></View></View>}
              </View>

              <View style={styles.approvedList}>
              <Text style={styles.textHd}>Approved Services</Text>
                {approvedServices.length ? approvedServices.map(this.createServiceRow) :
                <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>No approved services</Text></View></View>}
                {this.renderSubtotal()}
                {this.renderTotals()}
              </View>

              {/*<View>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>*/}

              {this.renderCheckout()}

              <TouchableOpacity onPress={() => callPhone('18449238473')}>
                <Image
                  source={require('../../../images/btn-call-caradvise.png')}
                  style={styles.btnCallCarAdvise} />
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={i} vehicleId={this.props.vehicleId} service={service} nav={this.props.navigator} isLoggedIn={this.props.isLoggedIn} orderStatus={this.state.orderStatus} authentication_token={this.props.authentication_token} approvals={this}/>;
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  updateStatus:function(status)
  {
    if(this.props.isLoggedIn)
    {
        let url;
        if (this.props.service.groupedServices) {
          let ids = this.props.service.groupedServices.map(s => s.id).join(',');
          if (this.props.service.group_list)
            ids += `,${this.props.service.id}`
          url = `${BULK_UPDATE_URL.replace("?", this.props.vehicleId)}?order_service_ids=${ids}&status=${status}`;
        } else {
          url = `${UPDATE_URL.replace("?", this.props.vehicleId)}?order_service_id=${this.props.service.id}&status=${status}`;
        }

        this.props.approvals.setState({
          showSpinner:true
        });
        fetch(url,
          {
            method:"PUT",
            headers: {'Authorization': this.props.authentication_token},
          }
        )
        .then((response) => response.json())
        .then((responseData) => {
            var orderStatus = (responseData.order != undefined) ? responseData.order.status : 0;
            var taxRate = (responseData.order != undefined) ? responseData.order.tax_rate : 0;
            var fees = (responseData.order != undefined) ? responseData.order.shop_fees : 0;
            var misc = (responseData.order != undefined) ? responseData.order.other_misc : 0;
            var couponDiscount = (responseData.order != undefined) ? responseData.order.total_coupon_discount : 0;
            var percentDiscount = (responseData.order != undefined) ? responseData.order.percent_shop_discount : 0;
            var caradviseDiscount = (responseData.order != undefined) ? responseData.order.caradvise_discount : 0;
            var taxAmount = (responseData.order != undefined) ? responseData.order.tax_amount : 0;
            var finalTotal = (responseData.order != undefined) ? responseData.order.post_tax_total : 0;
            var totalDiscount = (responseData.order != undefined) ? responseData.order.total_shop_discount : 0;
            //var partLow = (responseData.order != undefined) ? responseData.order.order_services.vehicle_service.part_low_cost : 0;
            //var partHigh = (responseData.order != undefined) ? responseData.order.order_services.vehicle_service.part_high_cost : 0;
            //var laborLow = (responseData.order != undefined) ? responseData.order.order_services.vehicle_service.low_labor_cost : 0;
            //var laborHigh = (responseData.order != undefined) ? responseData.order.order_services.vehicle_service.high_labor_cost : 0;
            var services = responseData.order.order_services;

            if(Platform.OS === 'android'){
              this.props.approvals.setState({
                showSpinner:false
              });
            }

            this.props.approvals.refreshServices(services, orderStatus, fees, couponDiscount, percentDiscount, caradviseDiscount, totalDiscount, finalTotal, taxAmount, misc, taxRate);

            if(Platform.OS === 'ios'){
              this.props.approvals.setState({
                showSpinner:false
              });
            }

        })
        .done();
    }

  },

  openDetail: function() {
    if (this.props.service.groupedServices) {
      this.props.nav.push({
        indent: 'ApprovalGroupDetail',
        passProps: { services: this.props.service.groupedServices }
      });
    } else {
      var service = this.props.service.vehicle_service.service || {};
      this.props.nav.push({
        indent:'ApprovalDetail',
        passProps:{
          category:this.props.service.id,
          orderId:this.props.service.order_id,
          miles:this.props.miles,
          name:this.props.service.name,
          comments:this.props.service.shopComments,
          desc:this.props.service.vehicle_service.required_skills_description,
          time:this.props.service.vehicle_service.base_labor_time,
          timeInterval:this.props.service.vehicle_service.labor_time_interval,
          intervalMile:this.props.service.vehicle_service.frequency_mile,
          intervalMonth:this.props.service.vehicle_service.frequency_month,
          position:this.props.service.vehicle_service.position,
          oneLiner:service.one_liner,
          whatIsIt:service.what_is_this,
          whatIf:service.what_if_decline,
          whyDoThis:service.why_do_this,
          factors:service.factors_to_consider,
          fairLow:this.props.service.vehicle_service.low_fair_cost,
          fairHigh:this.props.service.vehicle_service.high_fair_cost,
          laborLow:this.props.service.vehicle_service.labor_low_cost,
          laborHigh:this.props.service.vehicle_service.labor_high_cost,
          partLow:this.props.service.vehicle_service.part_low_cost,
          partHigh:this.props.service.vehicle_service.part_high_cost,
          parts:this.props.service.vehicle_service,
          partDetail:this.props.service.vehicle_service.motor_vehicle_service_parts,
          fluidDetail:this.props.service.vehicle_service.motor_vehicle_service_fluids,
          orderServiceOptions:this.props.service.order_service_options
        }
      });
    }
  },

  render: function() {
    if(this.props.service.status == 0 || this.props.service.status == 1)
    {
      return (
        <View>
        <TouchableOpacity
          onPress={() => this.openDetail()}>
            <View style={styles.newServicesRow}>
              <Text style={styles.newServiceItem}>{this.getServiceName()}</Text>
              { this.props.service.vehicle_service.low_fair_cost || this.props.service.vehicle_service.high_fair_cost ? (
                <View style={styles.fairPriceContainer}>
                  <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                  <View style={styles.fairPriceRange}>
                    <Text style={styles.fairPrice}>${this.props.service.vehicle_service.low_fair_cost.toFixed(0)}</Text>
                    <Image
                      source={require('../../../images/arrow-range.png')}
                      style={styles.fairPriceArrow} />
                    <Text style={styles.fairPrice}>${this.props.service.vehicle_service.high_fair_cost.toFixed(0)}</Text>
                  </View>
                </View>
              ) : null }
              { Number(this.props.service.override_total) ? (
                <View style={styles.newServicePriceContainer}>
                  <Text style={styles.newServicePriceHd}>PRICE</Text>
                  <Text style={styles.newServicePrice}>${Number(this.props.service.override_total).toFixed(2)}</Text>
                </View>
              ) : null }
            </View>

            { (this.props.service.vehicle_service.service || {}).one_liner ? (
            <View style={styles.oneLinerContainer}>
              <View style={styles.oneLiner}>
                <Text style={styles.oneLinerTxt}>{this.props.service.vehicle_service.service.one_liner}</Text>
              </View>
            </View> ) : null }

            <View style={styles.shopComments}>
              <View style={styles.commentWrapper}>
                <View style={styles.iconCommentContainer}>
                  <Text style={styles.commentHd}><Image
                    source={require('../../../images/icon-comment.png')}
                    style={styles.iconComment} />  VIEW DETAILS AND RECOMMENDATION</Text></View>
                </View>
            </View>
          </TouchableOpacity>

        <View style={styles.btnRowContainer}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnLeft}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(3) }}>
            <Image
              source={require('../../../images/btn-save.png')}
              style={styles.btnSave} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnRight}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(2) }}>
            <Image
              source={require('../../../images/btn-approve-orange.png')}
              style={styles.btnApprove} />
          </TouchableOpacity>
        </View>
        </View>
        </View>
      );
    }
    else if (this.props.service.status == 2 || this.props.service.status == 5) {
      return(
        <TouchableOpacity
          style={styles.approvedRow}
          onPress={() => this.openDetail()}>
          <Text style={styles.approvedItem}>{this.props.service.name}</Text>
          <Text style={styles.approvedPrice}>${Number(this.props.service.override_total).toFixed(2)}</Text>
        </TouchableOpacity>
      );
    }
    else {
      return null;
    }
  },

  getServiceName() {
    let { service } = this.props;
    let options = flatMap(service.order_service_options || [], o => o.order_service_option_items || []);
    let option = options.find(o => o.quantity);

    return option ? `${service.name} (Qty. ${option.quantity})` : service.name;
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10
  },
  approvalsContainer: {
    alignItems: 'center',
    marginBottom: 400,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
  },
  noServicesBg: {
    width: width,
    backgroundColor: '#F4F4F4',
    marginBottom: 2,
  },
  noServicesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  noServices: {
    color: '#002d5e',
    width: width,
    textAlign: 'center',
  },
  newServicesList: {
    flexDirection: 'column',
    width: width,
    alignItems: 'center',
  },
  newServicesRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newServiceItem: {
    flex: 5,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#002d5e',
  },
  fairPriceContainer: {
    flex: 3,
    marginTop: 10,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 5,
    alignItems: 'center',
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#f8991d',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fairPriceArrow: {
    width: 22,
    height: 10,
    marginTop: 4,
    marginLeft: 2,
    marginRight: 2,
  },
  fairPrice: {
    color: '#002d5e',
    fontWeight: 'bold',
  },
  newServicePriceContainer: {
    flex: 2,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    color: '#002d5e',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  oneLinerContainer: {
    backgroundColor: '#EFEFEF'
  },
  oneLiner: {
    backgroundColor: '#FFF',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10
  },
  oneLinerTxt: {
    color: '#002d5e',
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    fontSize: 12
  },
  shopComments: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF'
  },
  commentHd: {
    width: commentWidth,
    backgroundColor: '#FFF',
    color: '#f8991d',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shopCommentsTxt: {
    width: commentWidth,
    marginLeft: 5,
    marginRight: 5,
    marginBottom:5,
    padding: 5,
    fontSize: 12,
    color: '#002d5e',
  },
  commentWrapper: {
    backgroundColor: '#FFF',
    marginTop: 2,
    marginLeft: 10,
  },
  iconCommentContainer: {
    backgroundColor: '#FFF',
    marginTop: 5,
    marginBottom: 5,
  },
  iconComment: {
    width: 10,
    height: 10,
  },
  btnRowContainer: {
    backgroundColor: '#EFEFEF',
    marginBottom: 5,
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginTop: 10,
  },
  btnLeft: {
    flex: 2,
    alignItems: 'center',
  },
  btnRight: {
    flex: 2,
    alignItems: 'center',
  },
  btnApprove: {
    width: 145,
    height: 29,
  },
  btnSave: {
    width: 145,
    height: 29,
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  approvedList: {
    alignItems: 'center',
  },
  approvedRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 2,
  },
  approvedItem: {
    flex: 3,
    color: '#002d5e',
    fontWeight: 'bold',
  },
  approvedPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  extrasRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
  },
  extrasItem: {
    flex: 3,
    color: '#002d5e',
  },
  extrasPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
  },
  subtotalRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF0D9',
    width: width,
    padding: 10,
    marginBottom: 2,
  },
  subtotalItem: {
    flex: 3,
    color: '#002d5e',
    fontWeight: 'bold',
  },
  subtotalPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  checkoutMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#f8991d',
    marginTop: 15,
    width: width,
  },
  checkoutMessage: {
    margin: 10,
    flex: 1,
  },
  checkoutMessageTxt: {
    color: '#f8991d',
    fontWeight: 'bold',
  },
  newTotal: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FFF0D9',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  newTotalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d5e',
  },
  newTotalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#002d5e',
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 10,
  },
  btnCallCarAdvise: {
    width: 150,
    height: 30,
    marginTop: 20,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId: user.vehicles ? user.vehicles[0].id : null
  };
}

module.exports = connect(mapStateToProps)(Approvals);
