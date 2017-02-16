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
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { getJSON } from '../utils/fetch';
import callPhone from '../utils/callPhone';

var btnWidth = Dimensions.get('window').width;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/most_recent_order';

function getUrl(url, vehicleId) {
  return url.replace('?', vehicleId);
}

class Main extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasActiveOrders: false,
        services: [],
        shopName: null,
        shopAddress: null,
        shopCity: null,
        shopZip: null,
        shopTime: null
      };
    }

    componentDidMount() {
      this.getMaintenance();
    }

    async getMaintenance() {
      if (!this.props.isLoggedIn || !this.props.authentication_token)
        return;

      let response = await getJSON(
        getUrl(MAINTENANCE_URL, this.props.vehicleId), {},
        { 'Authorization': this.props.authentication_token }
      );

      if (response.error) {
        let [currentRoute] = this.props.navigator.getCurrentRoutes().reverse();
        if (currentRoute.indent === 'Main')
          Alert.alert('Hey there!', response.error);
      } else if (response.result && response.result.order) {
        let services = response.result.order.order_services || [];
        this.setState({
          hasActiveOrders: response.result.order.status === 0,
          shopName: response.result.order.shop_info.name,
          shopAddress: response.result.order.shop_info.address_line1,
          shopCity: response.result.order.shop_info.city,
          shopState: response.result.order.shop_info.state,
          shopZip: response.result.order.shop_info.zip,
          shopTime: response.result.order.appointment_datetime
        });
      }
    }

    renderAppointment()
    {
      var newDate = this.state.shopTime;
      function formatDate(date) {
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
      }
      function formatTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }

      var d = new Date(newDate);
      var theDate = formatDate(d);
      var theTime = formatTime(d);

      if (!this.state.shopTime) {
          return (
            <View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentInfoText}>Your Scheduled Appointment</Text>
              </View>
              <View style={styles.scheduledContainer}>
                <View style={styles.scheduledDate}>
                  <View style={styles.scheduledDateIcon}>
                    <Image
                      source={require('../../images/icon-cal.png')}
                      style={styles.iconCal} />
                  </View>
                  <View style={styles.scheduledDateInfo}>
                    <Text style={styles.scheduledDateText}>{theDate}</Text><Text style={styles.scheduledTimeText}>{theTime}</Text>
                  </View>
                </View>
                <View style={styles.scheduledShop}><Text style={styles.scheduledShopText}>{this.state.shopName}</Text><Text style={styles.scheduledAddressText}>{this.state.shopAddress} {this.state.shopCity}, {this.state.shopZip}</Text></View>
              </View>
            </View>
          );
      } else {
          return (
            <View style={styles.btnBookContainer}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ServiceRequest' })}>
                <Image
                  source={require('../../images/btn-main-bookashop.png')}
                  style={styles.btnBook} />
              </TouchableOpacity>
            </View>
          );
      }
    }

    filterMaintenanceServices(service)
    {
      return (service.status == 0 || service.status == 1 && service.service_type == 'Service');
    }

    render(services) {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} showMenu />
            <CarBar />
              <ScrollView style={styles.sview}>
                <View style={styles.meterContainer}>
                  <Image
                    source={require('../../images/meter.png')}
                    style={styles.meter} />
                  <Text style={styles.meterText}>CarAdvise Maintenance Meter</Text>
                </View>

                {this.renderAppointment()}

                <View style={styles.nextMaintenance}>
                  <Text style={styles.nextMaintenanceText}>Next Recommended Maintenance</Text>
                </View>

                <View style={styles.maintenanceContainer}>


                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceItem}>Tire Rotation</Text>
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>$50</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceItem}>Oil Change</Text>
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>$50</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceItem}>Tire Rotation</Text>
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>$50</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceItem}>Oil Change</Text>
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>$50</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.maintenanceRow}>
                    <Text style={styles.maintenanceItem}>Cabin Air Filter</Text>
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>$50</Text>
                      </View>
                    </View>
                  </View>
                </View>

              </ScrollView>

              <View style={styles.btnRow}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-main-dashboard.png')}
                    style={styles.btnMain} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Approvals' })}>
                  <Image
                    source={this.state.hasActiveOrders ?
                      require('../../images/btn-main-approvals-alert.png') :
                      require('../../images/btn-main-approvals.png')}
                    style={styles.btnMain} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Maintenance' })}>
                  <Image
                    source={require('../../images/btn-main-maintenance.png')}
                    style={styles.btnMain} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => callPhone('18449238473')}>
                  <Image
                    source={require('../../images/btn-main-call.png')}
                    style={styles.btnMain} />
                </TouchableOpacity>
              </View>

          </View>
        );
    }
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (

      <View style={styles.maintenanceRow}>
        <Text style={styles.maintenanceItem}>{this.props.service.name || this.props.service.literal_name}</Text>
        <View style={styles.fairPriceContainer}>
          <Text style={styles.fairPriceText}>FAIR PRICE</Text>
          <View style={styles.fairPriceRange}>
            <Text style={styles.fairPrice}>${Number(this.props.service.low_fair_cost).toFixed(0)}</Text>
            <Image
              source={require('../../images/arrow-range.png')}
              style={styles.fairPriceArrow} />
            <Text style={styles.fairPrice}>${Number(this.props.service.high_fair_cost).toFixed(0)}</Text>
          </View>
        </View>
      </View>

    );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  sview: {
    flex: 1
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
    marginBottom: 70
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
    marginRight: 10
  },
  btnBook: {
    resizeMode: 'contain',
    width: btnWidth - 20,
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
  btnRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  btnContainer: {
    alignItems: 'center',
  },
  btnMain: {
    width: btnWidth / 4,
    height: 60,
    resizeMode: 'contain'
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId: user.vehicles ? user.vehicles[0].id : null
  };
}

module.exports = connect(mapStateToProps)(Main);
