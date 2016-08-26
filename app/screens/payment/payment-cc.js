'use strict';
var TopBar = require('../../components/main/topBar');
var CarBar = require('../../components/main/carBar');

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
import CheckBox from 'react-native-checkbox';

var width = Dimensions.get('window').width - 20;
var fldWidth = Dimensions.get('window').width - 40;

class CreditCard extends Component {

  constructor() {
      super()
      this.state = {
        amount:null,
        cardNumber:null,
        expMonth:null,
        expYear:null,
        cvv:null,
        savePaymentMethod:false
      };
  }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator}/>
            <CarBar />
            <ScrollView
              style={styles.scrollView}
               keyboardDismissMode={'on-drag'}
              keyboardShouldPersistTaps={true}>
            <View style={styles.billingContainer}>

              <Text style={styles.textHd}>Payment Info</Text>

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
                  maxLength={2}
                  placeholder={'Exp. Month (MM)'} />
                <TextInput
                  onChangeText={(expYear) => this.setState({expYear})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  maxLength={2}
                  placeholder={'Exp. Year (YY)'} />
                <TextInput
                  onChangeText={(cvv) => this.setState({cvv})}
                  keyboardType="numeric"
                  style={styles.textFld}
                  maxLength={4}
                  placeholderTextColor={'#666'}
                  placeholder={'Security Code'} />
              </View>

              <View style={styles.checkboxContainer}>
                <CheckBox
                  label='SAVE PAYMENT METHOD'
                  labelStyle={styles.check}
                  checked={this.state.savePaymentMethod}
                  checkedImage={require('../../../images/icon-checked-gray.png')}
                  uncheckedImage={require('../../../images/icon-uncheck-gray.png')}
                  onChange={(savePaymentMethod) => this.setState({savePaymentMethod})}
                />
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'PaymentConfirm', passProps:{amount:this.state.amount, cardNumber:this.state.cardNumber, expMonth:this.state.expMonth, expYear:this.state.expYear, cvv:this.state.cvv, savePaymentMethod:this.state.savePaymentMethod} })}>
                  <Image
                    source={require('../../../images/btn-next-big.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>

              <View style={styles.braintreeBadgeContainer}>
                  <Image
                    resizeMode={'contain'}
                    source={require('../../../images/braintree-badge.png')}
                    style={styles.braintreeBadge} />
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
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
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
    paddingVertical: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  check: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 20,
  },
  braintreeBadgeContainer: {
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  braintreeBadge: {
    width: 200,
    marginLeft: 3,
  },
});

module.exports = CreditCard;
