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

          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine</Text>
            <View style={styles.changeContainer}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
                <Image
                  source={require('../../../images/btn-change.png')}
                  style={styles.btnChange} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.selectShop}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
              <Image
                source={require('../../../images/btn-selectshop.png')}
                style={styles.btnSelectShop} />
            </TouchableOpacity>
          </View>

          <Text style={styles.textHd}>Recommended Services (45000 miles)</Text>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceItem}>Tire Rotation</Text>
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
          <View style={styles.serviceRow}>
            <Text style={styles.serviceItem}>Cabin Air Filter R&R</Text>
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

          <Text style={styles.textHd}>Saved Services</Text>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceItem}>Oil Change - Synthetic Blend</Text>
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

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
              <Image
                source={require('../../../images/btn-add-service.png')}
                style={styles.btnAddService} />
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
  textBld: {
    fontWeight: 'bold',
  },
  btnSelectShop: {
    width: width,
    height: 130,
  },
  selectedShop: {
    flexDirection: 'row',
    width: width,
    borderWidth: 2,
    borderColor: '#006699',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopInfo: {
    flex: 4,
    color: '#006699',
    fontSize: 12,
  },
  changeContainer: {
    flex: 1,
  },
  btnChange: {
    width: 56,
    height: 22,
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 3,
  },
  serviceItem: {
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
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 110,
    height: 10,
    margin: 20,
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
