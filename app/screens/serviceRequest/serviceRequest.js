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
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/?/services';

class ServiceRequest extends Component {

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Service Request</Text>
          <View style={styles.selectShop}>
          <Image
            source={require('../../../images/btn-selectshop.png')}
            style={styles.btnSelectShop} />
          </View>

          <Text style={styles.textHd}>Recommended Services (45000 miles)</Text>
          <View style={styles.maintenanceRow}>
            <Text style={styles.maintenanceItem}>Tire Rotation</Text>
            <View style={styles.fairPriceContainer}>
              <Text style={styles.fairPriceText}>FAIR PRICE</Text>
              <View style={styles.fairPriceRange}>
                <Text style={styles.fairPrice}>$30</Text>
                <Image
                  source={require('../../../images/arrow-range.png')}
                  style={styles.fairPriceArrow} />
                <Text style={styles.fairPrice}>$50</Text>
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
  container: {
    flexDirection: 'column',
    width: width,
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  btnSelectShop: {
    width: width,
    height: 120,
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
    color: '#006699',
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
    color: '#006699',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#006699',
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
    color: '#006699',
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

module.exports = connect(mapStateToProps)(ServiceRequest);
