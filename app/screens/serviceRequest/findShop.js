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
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var fldWidth = Dimensions.get('window').width - 100;
var width = Dimensions.get('window').width - 20;

class FindShop extends Component {

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Find a Shop</Text>

          <View style={styles.searchShop}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="characters"
              placeholder={'ENTER ZIP CODE'}
              style={styles.searchFld}
              keyboardType={'phone-pad'}
              placeholderTextColor={'#666'} />
            <TouchableOpacity>
              <Image
                source={require('../../../images/btn-submit-orange.png')}
                style={styles.btnSubmit} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ShopDetail' })}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceItem}><Text style={styles.textBld}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ShopDetail' })}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceItem}><Text style={styles.textBld}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ShopDetail' })}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceItem}><Text style={styles.textBld}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine</Text>
            </View>
          </TouchableOpacity>

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
  searchShop: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchFld: {
    width: fldWidth,
    height: 45,
    borderWidth: 3,
    borderColor: '#FF9900',
    textAlign: 'center',
    backgroundColor: '#EFEFEF',
  },
  btnSubmit: {
    width: 80,
    height: 45,
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
    color: '#006699',
    alignItems: 'center',
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

module.exports = connect(mapStateToProps)(FindShop);
