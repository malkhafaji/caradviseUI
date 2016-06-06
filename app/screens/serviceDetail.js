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
} from 'react-native';
import { connect } from 'react-redux';

var width = Dimensions.get('window').width - 20;

class ServiceDetail extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.serviceContainer}>

              <Text style={styles.textHd}>Service Detail</Text>

              <View style={styles.serviceList}>

                  <View style={styles.serviceRow}>
                    <Text style={styles.serviceItem}>Brake Pads</Text>

                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text>$50</Text>
                      </View>
                    </View>

                    <View style={styles.servicePriceContainer}>
                      <Text style={styles.servicePriceHd}>PRICE</Text>
                      <Text style={styles.servicePrice}>$50</Text>
                    </View>
                  </View>
                  <View style={styles.serviceDescContainer}>
                    <Text style={styles.serviceDesc}>Tires should be rotated every 6,000 miles. Tires should be rotated every 6,000 miles. Tires should be rotated every 6,000 miles. Tires should be rotated every 6,000 miles. Tires should be rotated every 6,000 miles.</Text>
                  </View>

              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-add.png')}
                    style={styles.btnAdd} />
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
  serviceContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  serviceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceItem: {
    flex: 2,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#11325F',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  servicePriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  servicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  servicePrice: {
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  serviceRange: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#F49D11',
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
  serviceDescContainer: {
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  serviceDesc: {
    backgroundColor: '#FFF',
    padding: 10,
  },
  btnAdd: {
    width: 300,
    height: 40,
    marginTop: 15,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    //vehicleId : user.vehicles[0].id,
  };
}

module.exports = connect(mapStateToProps)(ServiceDetail);
