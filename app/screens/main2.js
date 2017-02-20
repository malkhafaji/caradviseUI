import React from 'react';
import {
  Component,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import TopBar from '../components/main/topBar';
import CarBar from '../components/main/carBar';
import ActivityIndicator from '../components/activityIndicator';
import MapView from 'react-native-maps';
import { getJSON, postJSON } from '../utils/fetch';
import callPhone from '../utils/callPhone';
import storage from '../utils/storage';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

const MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/most_recent_order';
const FIND_SHOPS_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_zip';
const FIND_SHOPS_BY_COORDINATES_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v1/shops/shops_by_coordinates';
const CANCEL_APPOINTMENT_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/cancel_active_order';

const LOGOS = {
  'CarX': require('../../images/logo-carx.png'),
  'Valvoline': require('../../images/logo-valvoline.png'),
  'Midas': require('../../images/logo-midas.png'),
  'Firestone': require('../../images/logo-firestone.png'),
  'Jiffy Lube': require('../../images/logo-jiffylube.png'),
  'Meineke': require('../../images/logo-meineke.png'),
  'Ntb': require('../../images/logo-ntb.png'),
  'Pep Boys': require('../../images/logo-pepboys.png'),
  'Sears Auto Center': require('../../images/logo-sears.png')
};

function getUrl(url, vehicleId) {
  return url.replace('?', vehicleId);
}

function getRegion(shop) {
  return {
    latitude: shop.latitude,
    longitude: shop.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  };
}

function formatDateTime(dateStr) {
  let date = new Date(dateStr);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return {
    date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
    time: `${hours}:${minutes} ${ampm}`
  };
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
      hasActiveOrders: false,
      finalTotal: 0,
      services: [],
      shopName: null,
      shopAddress: null,
      shopCity: null,
      shopZip: null,
      shopTime: null,
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

  async componentDidMount() {
    if (!this.props.vehicleId || !this.props.authentication_token)
      return;

    let response = await getJSON(
      getUrl(MAINTENANCE_URL, this.props.vehicleId), {},
      { 'Authorization': this.props.authentication_token }
    );

    let hasActiveOrders = ((response.result || {}).order || {}).status === 0;

    if (hasActiveOrders) {
      let shopInfo = response.result.order.shop_info || {};
      this.setState({
        hasActiveOrders,
        finalTotal: response.result.order.post_tax_total,
        view: 'services',
        services: response.result.order.order_services || [],
        shopName: shopInfo.name,
        shopAddress: shopInfo.address_line1,
        shopCity: shopInfo.city,
        shopState: shopInfo.state,
        shopZip: shopInfo.zip,
        shopTime: response.result.order.appointment_datetime
      });
    } else {
      this.showMap();
    }
  }

  showMap() {
    this.setState({ view: 'map', isLoading: true });

    navigator.geolocation.getCurrentPosition(
      position => this.fetchShopsByCoords(position.coords),
      error => this.setState({ isLoading: false }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  async fetchShops() {
    dismissKeyboard();
    this.setState({ isLoading: true, shops: [] });

    let response = await getJSON(FIND_SHOPS_URL, { zip: this.state.zip });
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
        <TopBar navigator={this.props.navigator} showMenu />
        <CarBar />
        {
          this.state.view === 'services' ? this.renderServices() :
          this.state.view === 'map' ? this.renderMap() : (
            <View style={styles.body}>
              <ActivityIndicator style={styles.bodyLoading} />
            </View>
          )
        }
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btn}>
            <Image
              source={require('../../images/btn-main-dashboard.png')}
              style={styles.btnImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => this.props.navigator.push({ indent:'Approvals' })}>
            <Image
              source={this.state.finalTotal ?
                require('../../images/btn-main-approvals-alert.png') :
                require('../../images/btn-main-approvals.png')}
              style={styles.btnImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => this.props.navigator.push({ indent:'Maintenance' })}>
            <Image
              source={require('../../images/btn-main-maintenance.png')}
              style={styles.btnImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => callPhone('18449238473')}>
            <Image
              source={require('../../images/btn-main-call.png')}
              style={styles.btnImg} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderServices() {
    return (
      <ScrollView style={styles.body}>
        {this.renderAppointment()}
        <View style={styles.nextMaintenance}>
          <Text style={styles.nextMaintenanceText}>Scheduled Maintenance</Text>
        </View>
        <View style={styles.maintenanceContainer}>
          {this.state.services.map(service => (
            <View key={service.id} style={styles.maintenanceRow}>
              <Text style={styles.maintenanceItem}>{service.name}</Text>
              { service.vehicle_service.low_fair_cost || service.vehicle_service.high_fair_cost ? (
                <View style={styles.fairPriceContainer}>
                  <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                  <View style={styles.fairPriceRange}>
                    <Text style={styles.fairPrice}>${service.vehicle_service.low_fair_cost.toFixed(0)}</Text>
                    <Image
                      source={require('../../images/arrow-range.png')}
                      style={styles.fairPriceArrow} />
                    <Text style={styles.fairPrice}>${service.vehicle_service.high_fair_cost.toFixed(0)}</Text>
                  </View>
                </View>
              ) : null }
            </View>
          ))}
          <TouchableOpacity style={styles.btn} onPress={() => this.cancelAppointmentAlert()}>
            <Image
              source={require('../../images/btn-cancel.png')}
              style={styles.btnImg} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  renderAppointment() {
      const { date, time } = formatDateTime(this.state.shopTime);

      return (
        <View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentInfoText}>Appointment Details</Text>
          </View>
          <View style={styles.scheduledContainer}>
            <View style={styles.scheduledDate}>
              <View style={styles.scheduledDateIcon}>
                <Image
                  source={require('../../images/icon-cal.png')}
                  style={styles.iconCal} />
              </View>
              <View style={styles.scheduledDateInfo}>
                <Text style={styles.scheduledDateText}>{date}</Text><Text style={styles.scheduledTimeText}>{time}</Text>
              </View>
            </View>
            <View style={styles.scheduledShop}>
              <Text style={styles.scheduledShopText}>{this.state.shopName}</Text>
              <Text style={styles.scheduledAddressText}>{this.state.shopAddress} {this.state.shopCity}, {this.state.shopZip}</Text>
            </View>
          </View>
        </View>
      );
  }

  renderMap() {
    return (
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
                require('../../images/map-pin-orange.png') :
                require('../../images/map-pin-blue.png')}
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
                source={require('../../images/map-search.png')}
                style={styles.searchBtn}
              />
            }
          </TouchableOpacity>
        </View>
        {this.state.selectedShop ? this.renderShopDetail() : null}
      </View>
    );
  }

  renderShopDetail() {
    const shop = this.state.selectedShop;
    const logo = Object.keys(LOGOS).find(logo => shop.name.indexOf(logo) >= 0)

    return (
      <View style={styles.shopDetail}>
        <View style={styles.shopDetailBox}>
          {logo ? <Image source={LOGOS[logo]} style={styles.shopLogo} /> : null}
          <View style={styles.shopDetailLeft}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopAddress}>{shop.address_line1}</Text>
            <Text style={styles.shopDistance}>{Number(shop.distance).toFixed(1)} miles away</Text>
          </View>
          <View style={styles.shopDetailRight}>
            <Image
              source={require('../../images/stars.png')}
              style={styles.stars} />
          </View>
        </View>
        <TouchableOpacity onPress={() => {
          storage.set('caradvise:shop', shop);
          this.props.navigator.push({ indent:'ServiceRequest' });
        }}>
          <Image
            source={require('../../images/map-btn-bookshop.png')}
            style={styles.bookShopBtn}
          />
        </TouchableOpacity>
      </View>
    )
  }

  cancelAppointmentAlert() {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel your current appointment?',
      [
        { text: 'Yes', onPress: () => this.cancelAppointment() },
        { text: 'No', style: 'cancel' }
      ]
    )
  }

  async cancelAppointment() {
    if (!this.props.vehicleId || !this.props.authentication_token)
      return;

    this.setState({ view: null });

    let response = await postJSON(
      getUrl(CANCEL_APPOINTMENT_URL, this.props.vehicleId), {},
      { 'Authorization': this.props.authentication_token }
    );

    if (response.error) {
      this.setState({ view: 'services' });
      Alert.alert(
        'Error',
        'There was an error during the cancellation of your appointment. Please try again.'
      );
    } else {
      this.setState({ hasActiveOrders: false });
      this.showMap();
    }
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    flexDirection: 'column'
  },
  body: {
    flex: 1
  },
  bodyLoading: {
    marginTop: 20
  },
  map: {
    flex: 1
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
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
  shopDetail: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
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
  shopDetailLeft: {
    flex: 2
  },
  shopDetailRight: {
    flex: 1,
    alignItems: 'flex-end'
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
  stars: {
    width: 75,
    height: 15,
    marginTop: 15,
    marginRight: 10
  },
  bookShopBtn: {
    width: 180,
    resizeMode: 'contain'
  },
  btnRow: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  btn: {
    flex: 1
  },
  btnImg: {
    width: null,
    alignSelf: 'stretch',
    height: 60,
    resizeMode: 'contain'
  },
  meterContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  meter: {
    resizeMode: 'contain',
    width: 200,
    height: 140,
    marginTop: 1,
    marginBottom: 10,
  },
  meterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d5e'
  },
  appointmentInfo: {
    backgroundColor: '#002d5e',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    alignItems: 'center'
  },
  appointmentInfoText: {
    color: '#fff'
  },
  nextMaintenance: {
    backgroundColor: '#002d5e',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    alignItems: 'center'
  },
  nextMaintenanceText: {
    color: '#fff'
  },
  maintenanceContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceItem: {
    flex: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    alignItems: 'center',
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#f8991d',
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
    color: '#002d5e',
    fontWeight: 'bold',
  },
  btnBookContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'stretch'
  },
  btnBook: {
    flex: 1,
  },
  btnBookImg: {
    alignSelf: 'stretch',
    resizeMode: 'contain',
    width: null,
    height: 60,
    marginTop: 10,
  },
  scheduledContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#002d5e',
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10
  },
  scheduledDate: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#efefef'
  },
  scheduledDateIcon: {
    paddingTop: 10,
    paddingLeft: 10
  },
  iconCal: {
    width: 16,
    height: 18
  },
  scheduledDateInfo: {
    padding: 10
  },
  scheduledDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002d5e'
  },
  scheduledTimeText: {
    fontSize: 12,
    color: '#002d5e'
  },
  scheduledShop: {
    flex: 3,
    borderLeftWidth: 1,
    borderColor: '#002d5e',
    padding: 10
  },
  scheduledShopText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002d5e'
  },
  scheduledAddressText: {
    fontSize: 12,
    color: '#002d5e'
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    authentication_token: user.authentication_token,
    vehicleId: user.vehicles ? user.vehicles[0].id : null
  };
}

module.exports = connect(mapStateToProps)(Main);
