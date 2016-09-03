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
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

class MaintenanceHistory extends Component {

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Maintenance History</Text>

          <View>

          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>SHOP NAME</Text>{'\n'}123 Main St.</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.serviceDate}>2016-01-09</Text>
              <Text style={styles.serviceDate}>Total: $69.00</Text>
            </View>
          </View>

          <View style={styles.maintenanceRow}>
            <Text style={styles.maintenanceItem}>Tire Rotation</Text>
            <View style={styles.newServicePriceContainer}>
              <Text style={styles.newServicePriceHd}>PRICE</Text>
              <Text style={styles.newServicePrice}>$20.00</Text>
            </View>
          </View>
          <View style={styles.maintenanceRow}>
            <Text style={styles.maintenanceItem}>Oil Change - Synthetic Blend</Text>
            <View style={styles.newServicePriceContainer}>
              <Text style={styles.newServicePriceHd}>PRICE</Text>
              <Text style={styles.newServicePrice}>$49.00</Text>
            </View>
          </View>

          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>SHOP NAME</Text>{'\n'}123 Main St.</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.serviceDate}>2016-01-09</Text>
              <Text style={styles.serviceDate}>Total: $69.00</Text>
            </View>
          </View>

          <View style={styles.maintenanceRow}>
            <Text style={styles.maintenanceItem}>Tire Rotation</Text>
            <View style={styles.newServicePriceContainer}>
              <Text style={styles.newServicePriceHd}>PRICE</Text>
              <Text style={styles.newServicePrice}>$20.00</Text>
            </View>
          </View>
          <View style={styles.maintenanceRow}>
            <Text style={styles.maintenanceItem}>Oil Change - Synthetic Blend</Text>
            <View style={styles.newServicePriceContainer}>
              <Text style={styles.newServicePriceHd}>PRICE</Text>
              <Text style={styles.newServicePrice}>$49.00</Text>
            </View>
          </View>

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
    marginLeft: 10,
    marginRight: 10,
  },
  maintenanceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  textBld: {
    fontWeight: 'bold',
  },
  selectedShop: {
    flexDirection: 'row',
    width: width,
    borderWidth: 2,
    borderColor: '#002d5e',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopInfo: {
    flex: 4,
    color: '#002d5e',
    fontSize: 12,
  },
  dateContainer: {
    flex: 2,
  },
  serviceDate: {
    fontSize: 11,
    textAlign: 'right',
  },
  maintenanceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 3,
  },
  maintenanceItem: {
    flex: 5,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
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
  maintenanceDesc: {
    width: width,
    backgroundColor: '#EFEFEF',
    marginBottom: 10,
  },
  maintenanceDescText: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 5,
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
  },
  priceContainer: {
    flex: 1,
    marginTop: 15,
    marginRight: 10,
  },
  priceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  price: {
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#002d5e',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d5e',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  bookIt: {
    alignItems: 'center',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
    miles : user.vehicles[0].miles,
  };
}

module.exports = connect(mapStateToProps)(MaintenanceHistory);
