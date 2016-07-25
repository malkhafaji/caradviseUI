'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');

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
  NativeAppEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { partition, minBy, maxBy, sumBy } from 'lodash';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/active_order_by_vehicle_number?vehicleNumber=';
var UPDATE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/orders/update_order_service';
var BULK_UPDATE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/orders/update_order_services';

class Approvals extends Component {

    constructor(props) {
      super(props);
      this.state = {
        orderStatus:0,
        services:null,
        total:0,
        tax:0,
        discount:0,
        finalTotal:0,
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
        service => service.motor_vehicle_service.service_type === 'Inspect');

      if (inspections.length > 0) {
        let serviceLow = minBy(inspections, 'motor_vehicle_service.low_fair_cost');
        let serviceHigh = maxBy(inspections, 'motor_vehicle_service.high_fair_cost');
        let totalCost = sumBy(inspections, ({ totalCost }) => Number(totalCost));

        otherServices.unshift({
          groupedServices: inspections,
          status: inspections[0].status,
          serviceName: 'Inspections',
          totalCost: totalCost,
          motor_vehicle_service: {
            low_fair_cost: serviceLow.motor_vehicle_service.low_fair_cost,
            high_fair_cost: serviceHigh.motor_vehicle_service.high_fair_cost
          }
        });
      }

      return otherServices;
    }

    refreshServices(services, orderStatus, finalTotal, taxAmount, partLow, partHigh, laborLow, laborHigh, fees, misc, totalDiscount, taxRate)
    {
      var total = 0;
      var showCheckout = false;

       var approved = services.filter(this.filterApprovedServices.bind(this));
       for (var i = 0; i < approved.length; i++) {
         var cost = approved[i].totalCost;
         if(typeof cost !== "undefined")
         {
           total += Number(cost);
         }
       }
       var discount = totalDiscount;
       var fees = fees;
       var subtotal = total + fees + misc - discount;

       if(orderStatus == 1)
       {
         showCheckout = true;
         this.state.showTotals = true;
       }
      this.setState({
        services:null
      });
      this.setState({
        services: services,
        showCheckout: showCheckout,
        total: total.toFixed(2),
        discount: discount,
        totalDiscount: Number(totalDiscount).toFixed(2),
        taxRate: taxRate,
        fees: fees.toFixed(2),
        misc: misc.toFixed(2),
        partLow: partLow,
        partHigh: partHigh,
        taxAmount: Number(taxAmount).toFixed(2),
        finalTotal: Number(finalTotal).toFixed(2),
      });
    }

    getApprovals() {
      if(this.props.isLoggedIn && this.props.vehicleNumber)
      {
        //console.log("token is", this.props.authentication_token);
        fetch(MAINTENANCE_URL + this.props.vehicleNumber, {headers: {'Authorization': this.props.authentication_token}})
          .then((response) => response.json())
          .then((responseData) => {
            var orderStatus = (responseData.order != undefined) ? responseData.order.status : 0;
            var totalDiscount = (responseData.order != undefined) ? responseData.order.totalDiscount : 0;
            var taxRate = (responseData.order != undefined) ? responseData.order.tax_rate : 0;
            var fees = (responseData.order != undefined) ? responseData.order.shop_fees : 0;
            var misc = (responseData.order != undefined) ? responseData.order.other_misc : 0;
            var finalTotal = (responseData.order != undefined) ? responseData.order.post_tax_total : 0;
            var taxAmount = (responseData.order != undefined) ? responseData.order.tax_amount : 0;
            var partLow = (responseData.order != undefined) ? responseData.order.order_services.low_part_cost : 0;
            var partHigh = (responseData.order != undefined) ? responseData.order.order_services.high_part_cost : 0;
            var laborLow = (responseData.order != undefined) ? responseData.order.order_services.low_labor_cost : 0;
            var laborHigh = (responseData.order != undefined) ? responseData.order.order_services.high_labor_cost : 0;
            var services = (responseData.order != undefined && orderStatus != 3) ? responseData.order.order_services : [];
            this.refreshServices(services, orderStatus, taxAmount, finalTotal, partLow, partHigh, laborLow, laborHigh, fees, misc, totalDiscount, taxRate);
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
      return service.status == 0;
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
              <Text style={styles.extrasPrice}>${this.state.fees}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderMisc()
    {
      if (this.state.misc != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Other Misc.</Text>
              <Text style={styles.extrasPrice}>${this.state.misc}</Text>
            </View>
          );
      } else {
          return null;
      }
    }

    renderDiscount()
    {
      if (this.state.totalDiscount != 0) {
          return (
            <View style={styles.extrasRow}>
              <Text style={styles.extrasItem}>Discount</Text>
              <Text style={styles.extrasPrice}>-${this.state.totalDiscount}</Text>
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
            {this.renderMisc()}
            {this.renderDiscount()}

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
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    source={require('../../images/btn-proceed.png')}
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

            </View>
            </ScrollView>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={i} service={service} nav={this.props.navigator} isLoggedIn={this.props.isLoggedIn} authentication_token={this.props.authentication_token} approvals={this}/>;
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
          url = `${BULK_UPDATE_URL}?order_service_ids=${ids}&status=${status}`;
        } else {
          url = `${UPDATE_URL}?order_service_id=${this.props.service.id}&status=${status}`;
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
            var taxAmount = (responseData.order != undefined) ? responseData.order.tax_amount : 0;
            var finalTotal = (responseData.order != undefined) ? responseData.order.post_tax_total : 0;
            var totalDiscount = (responseData.order != undefined) ? responseData.order.totalDiscount : 0;
            var partLow = (responseData.order != undefined) ? responseData.order.order_services.low_part_cost : 0;
            var partHigh = (responseData.order != undefined) ? responseData.order.order_services.high_part_cost : 0;
            var laborLow = (responseData.order != undefined) ? responseData.order.order_services.low_labor_cost : 0;
            var laborHigh = (responseData.order != undefined) ? responseData.order.order_services.high_labor_cost : 0;
            var services = responseData.order.order_services;

            if(Platform.OS === 'android'){
              this.props.approvals.setState({
                showSpinner:false
              });
            }

            this.props.approvals.refreshServices(services, orderStatus, finalTotal, taxAmount, partLow, partHigh, laborLow, laborHigh, fees, misc, totalDiscount, taxRate);

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
      this.props.nav.push({
        indent:'ApprovalDetail',
        passProps:{
          category:this.props.service.id,
          miles:this.props.miles,
          name:this.props.service.serviceName,
          desc:this.props.service.motor_vehicle_service.required_skills_description,
          time:this.props.service.motor_vehicle_service.base_labor_time,
          timeInterval:this.props.service.motor_vehicle_service.labor_time_interval,
          intervalMile:this.props.service.motor_vehicle_service.interval_mile,
          intervalMonth:this.props.service.motor_vehicle_service.interval_month,
          position:this.props.service.motor_vehicle_service.position,
          whatIsIt:this.props.service.motor_vehicle_service.what_is_it,
          whatIf:this.props.service.motor_vehicle_service.what_if_decline,
          whyDoThis:this.props.service.motor_vehicle_service.why_do_this,
          factors:this.props.service.motor_vehicle_service.factors_to_consider,
          fairLow:this.props.service.motor_vehicle_service.low_fair_cost,
          fairHigh:this.props.service.motor_vehicle_service.high_fair_cost,
          parts:this.props.service.motor_vehicle_service,
          partDetail:this.props.service.motor_vehicle_service.motor_vehicle_service_parts,
        }
      });
    }
  },

  render: function() {
    var totalLow = this.props.service.motor_vehicle_service.low_fair_cost;
    var totalHigh = this.props.service.motor_vehicle_service.high_fair_cost;
    if(this.props.service.status == 0)
    {
      return (
        <View>
        <TouchableOpacity
          style={styles.newServicesRow}
          onPress={() => this.openDetail()}>
              <Text style={styles.newServiceItem}>{this.props.service.serviceName}</Text>
              <View style={styles.fairPriceContainer}>
                <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                <View style={styles.fairPriceRange}>
                  <Text style={styles.fairPrice}>${totalLow.toFixed(0)}</Text>
                  <Image
                    source={require('../../images/arrow-range.png')}
                    style={styles.fairPriceArrow} />
                  <Text style={styles.fairPrice}>${totalHigh.toFixed(0)}</Text>
                </View>
              </View>
              <View style={styles.newServicePriceContainer}>
                <Text style={styles.newServicePriceHd}>PRICE</Text>
                <Text style={styles.newServicePrice}>${Number(this.props.service.totalCost).toFixed(2)}</Text>
              </View>
          </TouchableOpacity>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnLeft}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(3) }}>
            <Image
              source={require('../../images/btn-save.png')}
              style={styles.btnSave} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnRight}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(2) }}>
            <Image
              source={require('../../images/btn-approve-orange.png')}
              style={styles.btnApprove} />
          </TouchableOpacity>
        </View>
        </View>
      );
    }
    else if (this.props.service.status == 2 || this.props.service.status == 5) {
      return(
        <TouchableOpacity
          style={styles.approvedRow}
          onPress={() => this.openDetail()}>
          <Text style={styles.approvedItem}>{this.props.service.serviceName}</Text>
          <Text style={styles.approvedPrice}>${Number(this.props.service.totalCost).toFixed(2)}</Text>
        </TouchableOpacity>
      );
    }
    else {
      return null;
    }
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
    marginBottom: 250,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
  },
  noServicesBg: {
    backgroundColor: '#F4F4F4',
    marginBottom: 2,
  },
  noServicesContainer: {
    margin: 10,
  },
  noServices: {
    color: '#006699',
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
  },
  newServiceItem: {
    flex: 5,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#FF9900',
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
    color: '#006699',
    fontWeight: 'bold',
  },
  newServicePriceContainer: {
    flex: 2,
    marginTop: 10,
    marginRight: 10,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    color: '#006699',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 5,
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
    color: '#006699',
    fontWeight: 'bold',
  },
  approvedPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#006699',
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
    color: '#006699',
  },
  extrasPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#006699',
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
    color: '#006699',
  },
  newTotalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#006699',
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleNumber : user.vehicles[0].vehicleNumber,
  };
}

module.exports = connect(mapStateToProps)(Approvals);
