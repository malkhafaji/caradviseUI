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

class PaymentConfirm extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.confirmContainer}>
              <Text style={styles.textHd}>Confirm Order</Text>

              <View style={styles.serviceRow}>
                <Text style={styles.serviceItem}>Oil Change</Text>
                <Text style={styles.servicePrice}>$45</Text>
              </View>

              <View style={styles.serviceRow}>
                <Text style={styles.serviceItem}>Tire Rotation</Text>
                <Text style={styles.servicePrice}>$50</Text>
              </View>

              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalText}>Tax</Text>
                <Text style={styles.orderTotalPrice}>$5</Text>
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalHd}>TOTAL</Text>
                <Text style={styles.totalAmount}>$150.00</Text>
              </View>

              <View>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-submit-payment.png')}
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
  confirmContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
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

module.exports = PaymentConfirm;
