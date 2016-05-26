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

var width = Dimensions.get('window').width - 20;
var fldWidth = Dimensions.get('window').width - 40;



class CreditCard extends Component {

  constructor() {
      super()

      this.state = {
        amount: 45,
        cardNumber: "378282246310005",
        expMonth:"11",
        expYear:"17",
        cvv:"5554"
      };
  }

  processCreditCard()
  {
    var amount = this.state.amount;
    fetch('http://localhost:3000/get_token', {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      var clientToken = responseData.clientToken;
      BTClient.setup(clientToken);

      BTClient.getCardNonce(this.state.cardNumber, this.state.expMonth, this.state.expYear, this.state.cvv)
      .then(function(nonce) {
        fetch('http://localhost:3000/pay',
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
              Alert.alert(
                  'Success!',
                  "Your payment was successful.",
                );
            } else {
              Alert.alert(
                  'Error',
                  responseData.message,
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
    })
    .done();
  }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.billingContainer}>

              <Text style={styles.textHd}>Credit Card Info</Text>

              <View style={styles.billingCol}>
                <TextInput
                  onChangeText={(cardNumber) => this.setState({cardNumber})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Credit Card #'} />
                <TextInput
                  onChangeText={(expMonth) => this.setState({expMonth})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Exp. Month (MM)'} />
                <TextInput
                  onChangeText={(expYear) => this.setState({expYear})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Exp. Year (YY)'} />
                <TextInput
                  onChangeText={(cvv) => this.setState({cvv})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Security Code'} />
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={this.processCreditCard.bind(this)}>
                  <Image
                    source={require('../../images/btn-checkout.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>

            </View>
            </ScrollView>
          </View>
        );
    }
}


var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: width,
    height: Dimensions.get('window').height,
    marginLeft: 10,
    marginRight: 10,
  },
  billingContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  billingCol: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: 1,
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 20,
  },
});

module.exports = CreditCard;
