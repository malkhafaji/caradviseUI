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

class RequestSubmitted extends Component {

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Service Request Confirmation</Text>

          <View style={styles.shopInfoContainer}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>Your service request has been submitted!</Text>{'\n'}{'\n'}You will be notified as soon as the shop has reviewed and responded to your request.</Text>
          </View>

          <View style={styles.bookShop}>
            <TouchableOpacity onPress={() => this.props.navigator.popToTop()}>
              <Image
                source={require('../../../images/btn-done.png')}
                style={styles.btnDone} />
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  shopInfoContainer: {
    width: width,
    alignItems: 'center',
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#EFEFEF',
  },
  shopInfo: {
    textAlign: 'center',
    color: '#006699',
  },
  btnDone: {
    width: 149,
    height: 33,
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

module.exports = connect(mapStateToProps)(RequestSubmitted);
