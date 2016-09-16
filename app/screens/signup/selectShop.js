'use strict';

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
import cache from '../../utils/cache';
import TopBar from '../../components/main/topBar';
import ActivityIndicator from '../../components/activityIndicator';
import { getJSON } from '../../utils/fetch';

var fldWidth = Dimensions.get('window').width - 100;
var width = Dimensions.get('window').width - 20;

var FIND_SHOPS_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/shops/shops_by_zip';
var FIND_SHOPS_BY_COORDINATES_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/shops/shops_by_coordinates';

class SelectShop extends Component {

  constructor(props) {
    super(props);
    this.state = { zip: '', isLoading: false, shops: [] };
  }

  async fetchShops() {
    this.setState({ isLoading: true, shops: [] });

    let response = await getJSON(
      FIND_SHOPS_URL,
      { zip: this.state.zip }
    );

    let shops = response.result ? response.result : [];
    this.setState({ shops, isLoading: false });
  }

  async fetchShopsByCoords({ latitude, longitude }) {
    this.setState({ isLoading: true, shops: [] });

    let response = await getJSON(
      FIND_SHOPS_BY_COORDINATES_URL,
      { latitude, longitude }
    );

    let shops = response.result ? response.result : [];
    this.setState({ shops, isLoading: false });
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    navigator.geolocation.getCurrentPosition(
      position => this.fetchShopsByCoords(position.coords),
      error => this.setState({ isLoading: false }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 20000 }
    );
  }

  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <ScrollView
          style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
        <View style={styles.container}>

          <Text style={styles.textStep}>Which shop are you at?</Text>

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

          {this.state.shops.map(shop => (
            <TouchableOpacity key={shop.id} onPress={() => this.selectShop(shop)}>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceItem}><Text style={styles.textBld}>{shop.name}</Text>{'\n'}{shop.address_line1}, {shop.city} ({shop.distance.toFixed(2)} miles away)</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'NotListed' })}>
            <Image
              resizeMode='contain'
              source={require('../../../images/btn-notListed.png')}
              style={styles.btn} />
          </TouchableOpacity>

        </View>
        </ScrollView>
      </View>
    );
  }

  selectShop = shop => {
    cache.set('selectShop-fields', { shop });
    this.props.navigator.push({ indent: 'SelectShopDone' });
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
  textStep: {
    marginTop: 30,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  textBld: {
    fontWeight: 'bold',
  },
  searchShop: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 15,
  },
  searchFld: {
    width: fldWidth,
    height: 45,
    borderWidth: 3,
    borderColor: '#f8991d',
    textAlign: 'center',
    backgroundColor: '#EFEFEF',
    fontSize: 18
  },
  btnSubmit: {
    width: 80,
    height: 45,
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
  btn: {
    width: 190,
    marginTop: 10
  }
});

module.exports = SelectShop;
