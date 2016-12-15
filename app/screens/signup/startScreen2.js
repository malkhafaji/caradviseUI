import React from 'react';
import {
  Component,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import TopBar from '../../components/main/topBar';
import ActivityIndicator from '../../components/activityIndicator';
import MapView from 'react-native-maps';
import { getJSON } from '../../utils/fetch';
import cache from '../../utils/cache';
import storage from '../../utils/storage';

const FIND_SHOPS_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_zip';
const FIND_SHOPS_BY_COORDINATES_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_coordinates';

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

function getRegion(shop) {
  return {
    latitude: shop.latitude,
    longitude: shop.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  };
}

class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zip: '',
      shops: [],
      selectedShop: null,
      isLoading: false,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    navigator.geolocation.getCurrentPosition(
      position => this.fetchShopsByCoords(position.coords),
      error => this.setState({ isLoading: false }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  async fetchShops() {
    dismissKeyboard();
    this.setState({ isLoading: true, shops: [] });

    let response = await getJSON(
      FIND_SHOPS_URL,
      { zip: this.state.zip }
    );

    let shops = response.result && response.result.shops ? response.result.shops : [];
    this.setState({
      shops,
      region: shops[0] ? getRegion(shops[0]) : this.state.region,
      isLoading: false
    });
  }

  async fetchShopsByCoords({ latitude, longitude }) {
    this.setState({ isLoading: true, shops: [] });

    let response = await getJSON(
      FIND_SHOPS_BY_COORDINATES_URL,
      { latitude, longitude }
    );

    let shops = response.result && response.result.shops ? response.result.shops : [];
    this.setState({
      shops,
      region: shops[0] ? getRegion(shops[0]) : this.state.region,
      isLoading: false
    });
  }

  render() {
    return (
      <View style={styles.base}>
        <TopBar />
        <View style={styles.body}>
          <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChange={region => this.setState({ region })}
          >
            {this.state.shops.map(shop => (
              <MapView.Marker
                key={shop.id}
                identifier={String(shop.id)}
                coordinate={shop}
                image={shop === this.state.selectedShop ?
                  require('../../../images/map-pin-orange.png') :
                  require('../../../images/map-pin-blue.png')}
                onPress={() => this.setState({ selectedShop: this.state.selectedShop === shop ? null : shop })}
              />
            ))}
          </MapView>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="SEARCH BY ZIP"
              placeholderTextColor="#002d5e"
              keyboardType="numeric"
              value={this.state.zip}
              onChangeText={zip => this.setState({ zip })}
              style={styles.searchFld}
            />
            <TouchableOpacity style={styles.searchTouchable} disabled={this.state.isLoading} onPress={() => this.fetchShops()}>
              {this.state.isLoading ?
                <ActivityIndicator color="orange" /> :
                <Image
                  source={require('../../../images/map-search.png')}
                  style={styles.searchBtn}
                />
              }
            </TouchableOpacity>
          </View>
          {this.state.selectedShop ? this.renderShopDetail() : this.renderLogin()}
        </View>
      </View>
    );
  }

  renderLogin() {
    return (
      <View style={styles.login}>
        <Image
          source={require('../../../images/map-logp.png')}
          style={styles.loginLogo}
        />
        <View style={styles.loginTextRow}>
          <Text style={styles.loginText}>Bringing Trust & Confidence to Car Maintenance & Repair.</Text>
          <Text style={styles.loginTextBold}>Book a shop today!</Text>
        </View>
        <View style={styles.loginBtnRow}>
          <TouchableOpacity style={styles.loginTouchable} onPress={() => this.props.navigator.push({ indent:'Login' })}>
            <Image
              source={require('../../../images/map-btn-signin.png')}
              style={styles.loginBtn}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginTouchable} onPress={() => this.props.navigator.push({ indent:'AccountDetails' })}>
            <Image
              source={require('../../../images/map-btn-signup.png')}
              style={styles.loginBtn}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderShopDetail() {
    const shop = this.state.selectedShop;
    const logo = Object.keys(LOGOS).find(logo => shop.name.indexOf(logo) >= 0)

    return (
      <View style={styles.shopDetail}>
        <View style={styles.shopDetailBox}>
          {logo ? <Image source={LOGOS[logo]} style={styles.shopLogo} /> : null}
          <View>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopAddress}>{shop.address_line1}</Text>
            <Text style={styles.shopDistance}>{Number(shop.distance).toFixed(1)} miles away</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {
          cache.set('selectShop-fields', { shop });
          storage.set('caradvise:shop', shop);
          this.props.navigator.push({ indent:'AccountDetails' });
        }}>
          <Image
            source={require('../../../images/map-btn-bookshop.png')}
            style={styles.bookShopBtn}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'column'
  },
  body: {
    flex: 1
  },
  map: {
    flex: 1
  },
  searchBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    shadowColor: '#888',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'orange'
  },
  searchFld: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#002d5e'
  },
  searchTouchable: {
    height: 45,
    width: 55,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchBtn: {
    height: 45,
    width: 55
  },
  login: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    padding: 10,
    flexDirection: 'column',
    borderWidth: 5,
    borderColor: '#eee',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  loginLogo: {
    width: 120,
    resizeMode: 'contain'
  },
  loginTextRow: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  loginText: {
    color: '#002d5e',
    fontFamily: 'RobotoCondensed-Light',
  },
  loginTextBold: {
    color: '#002d5e',
    fontFamily: 'RobotoCondensed-Light',
    fontWeight: 'bold'
  },
  loginBtnRow: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  loginTouchable: {
    flex: 1,
    flexDirection: 'row'
  },
  loginBtn: {
    marginHorizontal: 5,
    flex: 1,
    resizeMode: 'contain'
  },
  shopDetail: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: 'column',
    borderWidth: 5,
    borderColor: '#eee',
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  shopDetailBox: {
    borderColor: '#002d5e',
    borderWidth: 1,
    padding: 10,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  shopLogo: {
    width: 35,
    height: 35,
    marginRight: 10
  },
  shopName: {
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    color: '#002d5e',
  },
  shopAddress: {
    fontFamily: 'RobotoCondensed-Light',
    color: '#002d5e',
  },
  shopDistance: {
    fontFamily: 'RobotoCondensed-Light',
    color: '#002d5e',
  },
  bookShopBtn: {
    width: 180,
    resizeMode: 'contain'
  },
});

module.exports = StartScreen;
