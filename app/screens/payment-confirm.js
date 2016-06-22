'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');
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

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/active_order_by_vehicle_number?vehicleNumber=';
var UPDATE_ORDER_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/orders/?/update_order';

class PaymentConfirm extends Component {

  constructor(props) {
      super(props)
      var props = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        orderId:0,
        services:null,
        total:0,
        tax:0,
        finalTotal:0,
        cardNumber: props.cardNumber,
        expMonth:props.expMonth,
        expYear:props.expYear,
        cvv:props.cvv,
        visible: false
      };
  }

  componentDidMount() {
    this.getServices();
  }

  filterCompletedServices(service)
  {
    return service.status == 5;
  }

  getServices() {
    if(this.props.isLoggedIn && this.props.vehicleNumber)
    {
      fetch(MAINTENANCE_URL + this.props.vehicleNumber, {headers: {'Authorization': this.props.authentication_token}})
        .then((response) => response.json())
        .then((responseData) => {
          var services = (responseData.order != undefined) ? responseData.order.order_services : [];
          var total = 0;
          var orderId = responseData.order.id;
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
          var tax = total * .07;
          var discount = 5;
          this.setState({
            orderId: orderId,
            services: services,
            total: total.toFixed(2),
            tax: tax.toFixed(2),
            finalTotal: (total + tax - discount).toFixed(2)
          });
        })
        .done();
    }
  }

  updateOrderComplete(orderId)
  {
    fetch(UPDATE_ORDER_URL.replace("?", orderId) +'?status=3',
      {
        method:"PUT",
        headers: {'Authorization': this.props.authentication_token},
      }
    )
    .done();
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
    fetch('https://caradvise.herokuapp.com/get_token', {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      var clientToken = responseData.clientToken;
      //console.log("token is", clientToken);
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
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.confirmContainer}>
              <Text style={styles.textHd}>Confirm Order</Text>

              {services.map(this.createServiceRow)}

              <View style={styles.taxRow}>
                <Text style={styles.taxItem}>Sales Tax</Text>
                <Text style={styles.taxPrice}>${this.state.tax}</Text>
              </View>

              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalText}>CarAdvise Promo</Text>
                <Text style={styles.orderTotalPrice}>-$5.00</Text>
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalHd}>TOTAL</Text>
                <Text style={styles.totalAmount}>${this.state.finalTotal}</Text>
              </View>

              <View>
                <TouchableOpacity onPress={this.processCreditCard.bind(this)}>
                  <Image
                    source={require('../../images/btn-submit-payment.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>

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
        <Text style={styles.serviceItem}>{this.props.service.serviceName}</Text>
        <Text style={styles.servicePrice}>${this.props.service.totalCost}</Text>
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
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 2,
  },
  serviceItem: {
    flex: 3,
    color: '#11325F',
    fontWeight: 'bold',
  },
  servicePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  taxRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: width,
    padding: 10,
    marginBottom: 2,
  },
  taxItem: {
    flex: 3,
    color: '#11325F',
  },
  taxPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
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
    fontSize: 28,
    color: '#11325F',
    fontFamily: 'RobotoCondensed-Light',
  },
  totalAmount: {
    fontSize: 28,
    color: '#11325F',
    fontFamily: 'RobotoCondensed-Light',
    fontWeight: 'bold',
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleNumber : user.vehicles[0].vehicleNumber,
  };
}

module.exports = connect(mapStateToProps)(PaymentConfirm);
