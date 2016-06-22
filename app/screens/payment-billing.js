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
  TextInput,
} from 'react-native';

var width = Dimensions.get('window').width - 20;
var fldWidth = Dimensions.get('window').width - 40;

class Billing extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.billingContainer}>


              <Text style={styles.textHd}>Billing Info</Text>

              <View style={styles.billingCol}>
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'First Name'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Last Name'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Street Address'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Apt. # (optional)'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'City'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'State'} />
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Zip Code'} />
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    source={require('../../images/btn-next-big.png')}
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
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
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
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 20,
  },
});

module.exports = Billing;
