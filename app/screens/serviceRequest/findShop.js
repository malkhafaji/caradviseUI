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
import ActivityIndicator from '../../components/activityIndicator';
import { getJSON } from '../../utils/fetch';

var fldWidth = Dimensions.get('window').width - 100;
var width = Dimensions.get('window').width - 20;

var FIND_SHOPS_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_zip';
var FIND_SHOPS_BY_COORDINATES_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_coordinates';

const LOGOS = {
  'CarX': require('../../../images/logo-carx.png'),
  'Valvoline': require('../../../images/logo-valvoline.png'),
  'Midas': require('../../../images/logo-midas.png'),
  'Firestone': require('../../../images/logo-firestone.png'),
  'Jiffy Lube': require('../../../images/logo-jiffylube.png'),
  'Meineke': require('../../../images/logo-meineke.png'),
  'Ntb': require('../../../images/logo-ntb.png'),
  'Pep Boys': require('../../../images/logo-pepboys.png'),
  'Sears Auto Center': require('../../../images/logo-sears.png')
}

class FindShop extends Component {

constructor(props) {
  super(props);
  this.state = { zip: '', isLoading: false, shops: [] };
}

async fetchShops() {
  this.setState({ isLoading: true, shops: [] });

  let response = await getJSON(
    FIND_SHOPS_URL,
    { zip: this.state.zip },
    { 'Authorization': this.props.authentication_token }
  );

  let shops = response.result.shops ? response.result.shops : [];
  this.setState({ shops, isLoading: false });
}

async fetchShopsByCoords({ latitude, longitude }) {
  this.setState({ isLoading: true, shops: [] });

  let response = await getJSON(
    FIND_SHOPS_BY_COORDINATES_URL,
    { latitude, longitude },
    { 'Authorization': this.props.authentication_token }
  );

  let shops = response.result.shops ? response.result.shops : [];
  this.setState({ shops, isLoading: false });
}

componentDidMount() {
  this.setState({ isLoading: true });

  navigator.geolocation.getCurrentPosition(
    position => this.fetchShopsByCoords(position.coords),
    error => this.setState({ isLoading: false }),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
}

render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Find a Shop</Text>

          <View style={styles.searchShop}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="characters"
              placeholder={'SEARCH BY ZIP CODE'}
              style={styles.searchFld}
              keyboardType={'phone-pad'}
              placeholderTextColor={'#666'}
              value={this.state.zip}
              onChangeText={zip => this.setState({ zip })} />
            <TouchableOpacity onPress={() => this.fetchShops()}>
              <Image
                source={require('../../../images/btn-submit-orange.png')}
                style={styles.btnSubmit} />
            </TouchableOpacity>
          </View>

          {this.state.isLoading && <ActivityIndicator color="#002d5e" />}

          {this.state.shops.map(shop => {
            const logo = Object.keys(LOGOS).find(logo => shop.name.indexOf(logo) >= 0)

            return (
              <TouchableOpacity key={shop.id} onPress={() => this.props.navigator.push({ indent:'ShopDetail', passProps: { shop } })}>
                <View style={styles.serviceRow}>
                  {logo ?
                    <View>
                      <Image
                        source={LOGOS[logo]}
                        style={styles.shopLogo} />
                    </View> : null
                  }
                  <Text style={styles.serviceItem}><Text style={styles.textBld}>{shop.name}</Text>{'\n'}<Text style={styles.address}>{shop.address_line1}, {shop.city}{'\n'}</Text><Text style={styles.address}>{shop.distance.toFixed(2)} miles away</Text></Text>
                  <View>
                    <Image
                      source={require('../../../images/stars.png')}
                      style={styles.stars} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}

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
    borderColor: '#f8991d',
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
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 3,
  },
  shopLogo: {
    width: 35,
    height: 35,
    marginTop: 15,
    marginLeft: 10
  },
  serviceItem: {
    flex: 5,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    color: '#002d5e',
    alignItems: 'center',
  },
  address: {
    fontSize: 12
  },
  stars: {
    width: 75,
    height: 15,
    marginTop: 15,
    marginRight: 10
  }
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
