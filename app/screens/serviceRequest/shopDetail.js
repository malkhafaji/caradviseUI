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

var fldWidth = Dimensions.get('window').width - 100;
var width = Dimensions.get('window').width - 20;

class ShopDetail extends Component {

constructor(props) {
  super(props);
  this.state = {
    region: {
      latitude: 42.0464058,
      longitude: -88.0987167,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };
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

          <MapView style={styles.map}
            region={this.state.region}
          />

          <View style={styles.shopInfoContainer}>
            <Text style={styles.shopInfo}><Text style={styles.textBig}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine, IL 60011{'\n'}Hours: 7am-6pm</Text>
          </View>

          <View style={styles.bookShop}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ServiceRequest' })}>
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
    color: '#006699',
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
    borderColor: '#006699',
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
    color: '#006699',
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
