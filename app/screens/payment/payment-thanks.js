'use strict';
var TopBar = require('../../components/main/topBar');
var CarBar = require('../../components/main/carBar');
var BTClient = require('react-native-braintree');

import React from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  Navigator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/most_recent_order';
var UPDATE_ORDER_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/orders/?/update_order';

class PaymentThanks extends Component {

  constructor(props) {
      super(props)
      var props = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        orderId:0,
        orderStatus:null,
        services:null,
        total:0,
        tax:0,
        finalTotal:0,
        visible: false
      };
  }

  componentDidMount() {
    this.getServices();
  }

  filterCompletedServices(service)
  {
    return (service.status == 5 && service.group_id == null);
  }

  getServices() {
    if(this.props.isLoggedIn && this.props.vehicleId)
    {
      fetch(MAINTENANCE_URL.replace('?', this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
        .then((response) => response.json())
        .then((responseData) => {
          var services = (responseData.order != undefined) ? responseData.order.order_services : [];
          var total = 0;
          var orderId = responseData.order.id;
          var orderStatus = responseData.order.status;
          var finalTotal = (responseData.order != undefined) ? responseData.order.post_tax_total : 0;
          var taxAmount = (responseData.order != undefined) ? responseData.order.tax_amount : 0;
          var caradviseDiscount = (responseData.order != undefined) ? responseData.order.caradvise_discount : 0;
          var couponDiscount = (responseData.order != undefined) ? responseData.order.total_coupon_discount : 0;
          var percentDiscount = (responseData.order != undefined) ? responseData.order.percent_shop_discount : 0;
          var totalDiscount = (responseData.order != undefined) ? responseData.order.total_shop_discount : 0;
          var fees = (responseData.order != undefined) ? responseData.order.shop_fees : 0;
          var misc = (responseData.order != undefined) ? responseData.order.other_misc_fees : 0;
          var taxRate = (responseData.order != undefined) ? responseData.order.tax_rate : 0;
          if(responseData.order != undefined)
          {
             services = services.filter(this.filterCompletedServices.bind(this));
             for (var i = 0; i < services.length; i++) {
               var cost = services[i].totalCost;
               if(typeof cost !== "undefined")
               {
                 total += Number(cost);
               }
             }
          }
          var discount = totalDiscount;
          var subtotal = total + fees + misc - discount;

          this.setState({
            orderId: orderId,
            orderStatus: orderStatus,
            services: services,
            taxRate: taxRate,
            misc: misc.toFixed(2),
            fees: fees.toFixed(2),
            caradviseDiscount: caradviseDiscount,
            percentDiscount: percentDiscount,
            couponDiscount: couponDiscount,
            totalDiscount: Number(totalDiscount).toFixed(2),
            taxAmount: Number(taxAmount).toFixed(2),
            finalTotal: Number(finalTotal).toFixed(2),
          });
        })
        .done();
    }
  }

  renderFees()
  {
    if (this.state.fees != 0) {
        return (
          <View style={styles.taxRow}>
            <Text style={styles.taxItem}>Shop Fees</Text>
            <Text style={styles.taxPrice}>${this.state.fees}</Text>
          </View>
        );
    } else {
        return null;
    }
  }

  renderCaradviseDiscount()
  {
    if (this.state.caradviseDiscount != 0) {
        return (
          <View style={styles.taxRow}>
            <Text style={styles.taxItem}>CarAdvise Discount</Text>
            <Text style={styles.taxPrice}>-${this.state.caradviseDiscount.toFixed(2)}</Text>
          </View>
        );
    } else {
        return null;
    }
  }

  renderCouponDiscount()
  {
    if (this.state.couponDiscount != 0) {
        return (
          <View style={styles.taxRow}>
            <Text style={styles.taxItem}>Coupon Discount</Text>
            <Text style={styles.taxPrice}>-${this.state.couponDiscount.toFixed(2)}</Text>
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
          <View style={styles.taxRow}>
            <Text style={styles.taxItem}>Shop Discount</Text>
            <Text style={styles.taxPrice}>-${this.state.totalDiscount}</Text>
          </View>
        );
    } else {
        return null;
    }
  }

  renderPercentDiscount()
  {
    if (this.state.percentDiscount != null && this.state.percentDiscount != 0) {
        return (
          <View style={styles.taxRow}>
            <Text style={styles.taxItem}>Shop Discount</Text>
            <Text style={styles.taxPrice}>{this.state.percentDiscount}% off</Text>
          </View>
        );
    } else {
        return null;
    }
  }

  updateOrderComplete(orderId)
  {
    if (this.state.orderStatus != 4) {
      fetch(UPDATE_ORDER_URL.replace("?", orderId) +'?status=3',
        {
          method:"PUT",
          headers: {'Authorization': this.props.authentication_token},
        }
      )
      .done();
    } else {
        return null;
    }
  }

  processCreditCard=()=>
  {
    this.setState({
        visible: true
      });
    var top = this;
    var nav = this.props.navigator;
    var amount = this.state.finalTotal;
    var orderId = this.state.orderId;
    var orderStatus = this.state.orderStatus;
    fetch('https://caradvise.herokuapp.com/get_token', {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      var clientToken = responseData.clientToken;
      BTClient.setup(clientToken);

      BTClient.getCardNonce(this.state.cardNumber, this.state.expMonth, this.state.expYear, this.state.cvv)
       .then(function(nonce) {
         //console.log("got nonce", nonce);
         fetch('https://caradvise.herokuapp.com/pay',
           {
             method: 'POST',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               payment_method_nonce: nonce,
               amount: amount,
               options: {
                  submitForSettlement: true
                },
             })
           })
           .then((response) => response.json())
           .then((responseData) => {
             if(responseData.success == true)
             {
               top.updateOrderComplete(orderId);
               top.setState({
                  visible: false
                 });
               nav.push({ indent:'PaymentThanks' });
             } else {
               Alert.alert(
                   'Error',
                   responseData.message,
                   [
                     {text: "OK", onPress: () => nav.pop()},
                   ]
                 );
             }
           });
       })
       .catch(function(err) {
         Alert.alert(
             'Error',
             "An error occurred, please try again.",
           )
       });
      this.state = {visible: false};
    })
    .done();
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

    renderServices(services) {
        var orderId = this.state.orderId;
        var orderStatus = this.state.orderStatus;
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView} keyboardDismissMode={'on-drag'}>
            <View style={styles.confirmContainer}>
              <Text style={styles.textHd}>Receipt</Text>
              <View style={styles.thanksContainer}>
                <Text style={styles.thanksTxt}>Thanks for using CarAdvise!{'\n'}
                You are all paid and can be on your way!</Text>
              </View>
              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerTxt}>Please note that on your credit card statement the transaction will show as: CARADVISE</Text>
              </View>

              {services.map(this.createServiceRow)}

              <View style={styles.lineRow}><Text> </Text></View>

              {this.renderFees()}
              {this.renderCaradviseDiscount()}
              {this.renderCouponDiscount()}
              {this.renderDiscount()}
              {this.renderPercentDiscount()}

              <View style={styles.taxRow}>
                <Text style={styles.taxItem}>Tax</Text>
                <Text style={styles.taxPrice}>${this.state.taxAmount}</Text>
              </View>

              <View style={styles.lineRow}><Text> </Text></View>

              <View style={styles.taxRow}>
                <Text style={styles.totalHd}>Total</Text>
                <Text style={styles.totalAmount}>${this.state.finalTotal}</Text>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'Rating', passProps: { orderId } })}>
                  <Image
                    source={require('../../../images/btn-done.png')}
                    style={styles.btnDone} />
                </TouchableOpacity>
              </View>

              {this.updateOrderComplete(orderId)}

            </View>
            </ScrollView>
            <View>
              <Spinner visible={this.state.visible} />
            </View>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={i} service={service}/>;
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  render: function() {
    return(
      <View style={styles.serviceRow}>
        <Text style={styles.serviceItem}>{this.props.service.name}</Text>
        <Text style={styles.servicePrice}>${Number(this.props.service.override_total).toFixed(2)}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 100,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
  },
  thanksContainer: {
    width: width,
    borderWidth: 2,
    borderColor: '#002d5e',
    marginBottom: 5,
  },
  thanksTxt: {
    margin: 10,
    fontSize: 14,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  disclaimerContainer: {
    width: width,
    backgroundColor: '#ff0000',
    marginBottom: 15,
  },
  disclaimerTxt: {
    margin: 10,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    width: width,
    padding: 5,
    marginBottom: 2,
  },
  serviceItem: {
    flex: 3,
    color: '#002d5e',
  },
  servicePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
  },
  taxRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    width: width,
    padding: 5,
    marginBottom: 2,
  },
  taxItem: {
    flex: 3,
    color: '#002d5e',
  },
  taxPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
  },
  orderTotal: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
  },
  orderTotalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  orderTotalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
  totalContainer: {
    borderWidth: 5,
    borderColor: '#EFEFEF',
    padding: 20,
    width: width,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalHd: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d5e',
  },
  totalAmount: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lineRow: {
    width: width,
    height: 1,
    backgroundColor: '#002d5e',
  },
  btnDone: {
    width: 135,
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

module.exports = connect(mapStateToProps)(PaymentThanks);
