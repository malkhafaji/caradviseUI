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
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import { findLastIndex } from 'lodash';
import cache from '../../utils/cache';

var fldWidth = Dimensions.get('window').width - 100;
var width = Dimensions.get('window').width - 20;

class ShopDetail extends Component {

constructor(props) {
  super(props);
  var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
  this.state = { ...passProps.shop };
}

bookShop() {
  const fields = cache.get('serviceRequest-fields');
  if (!fields) return;

  fields.shop = { ...this.state };
  cache.set('serviceRequest-fields', fields);

  const route = { indent: 'ServiceRequest' };
  const routes = this.props.navigator.getCurrentRoutes();
  this.props.navigator.replaceAtIndex(route, findLastIndex(routes, route));
  this.props.navigator.popToRoute(route);
}

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Shop Detail</Text>

          {this.state.region ?
            <MapView style={styles.map} region={this.state.region} /> : null
          }

          <View style={styles.shopInfoContainer}>
            <Text style={styles.shopInfo}><Text style={styles.textBig}>{this.state.name}</Text>{'\n'}{`${this.state.address_line1}`}{'\n'}{`${this.state.city}, ${this.state.state} ${this.state.zip}`}</Text>
          </View>

          <View style={styles.bookShop}>
            <TouchableOpacity onPress={() => this.bookShop()}>
              <Image
                source={require('../../../images/btn-bookshop.png')}
                style={styles.btnBook} />
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
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  textBig: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  map: {
    width: width,
    height: 200,
    marginBottom: 15,
  },
  btnSelectShop: {
    width: width,
    height: 130,
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
  shopInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  shopInfo: {
    textAlign: 'center',
    color: '#002d5e',
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
    color: '#002d5e',
    alignItems: 'center',
  },
  btnBook: {
    width: width,
    height: 46,
    marginTop: 10,
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

module.exports = connect(mapStateToProps)(ShopDetail);
