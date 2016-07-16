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
import Spinner from 'react-native-loading-spinner-overlay';
import Swiper from 'react-native-swiper';
import ActivityIndicator from '../components/activityIndicator';
import { getJSON } from '../utils/fetch';
import { findIndex } from 'lodash';

var width = Dimensions.get('window').width - 20;
var swiperHeight = Dimensions.get('window').height - 160;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/?/maintenance';
var INTERVALS_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/?/vehicle_intervals';
var SERVICES_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/?/services_by_interval';

function getUrl(url, vehicleId) {
  return url.replace('?', vehicleId);
}

let subscriptions = {};

function subscribe(key, callback) {
  subscriptions[key] = callback;
  return () => subscriptions[key] = null;
}

function publish(key) {
  subscriptions[key] && subscriptions[key]();
}

function clearSubscriptions() {
  subscriptions = {};
}

class Maintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervals: null,
      currentInterval: null
    };
  }

  componentDidUpdate() {
    if (this.state.intervals)
      publish(this.state.intervals[this.state.currentInterval]);
  }

  componentDidMount() {
    clearSubscriptions();
    this.getMaintenanceIntervals();
  }

  componentWillUnmount() {
    clearSubscriptions();
  }

  async getMaintenanceIntervals() {
    if (!this.props.isLoggedIn || !this.props.vehicleId)
      return;

    let response = await getJSON(
      getUrl(INTERVALS_URL, this.props.vehicleId), {},
      { 'Authorization': this.props.authentication_token }
    );

    if (response.error) {
      Alert.alert('Error', response.error);
    } else if (response.result) {
      let intervals = response.result.vehicles || [];
      let index = findIndex(intervals, interval => Number(interval) > this.props.miles);

      this.setState({
        intervals,
        currentInterval: Math.max(0, index - 1)
      });
    }
  }

  render() {
    if (!this.state.intervals)
      return <View><Spinner visible={true} /></View>;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <View style={styles.maintenanceContainer}>
          <Text style={styles.textHd}>Maintenance Schedule</Text>
          <Swiper
            style={styles.maintenanceSwiper}
            buttonWrapperStyle={styles.maintenanceSwiperButtons}
            nextButton={<Image style={styles.swiperButton} source={require('../../images/arrow-right.png')} />}
            prevButton={<Image style={styles.swiperButton} source={require('../../images/arrow-left.png')} />}
            onMomentumScrollEnd={(e, state) => publish(this.state.intervals[state.index])}
            index={this.state.currentInterval}
            height={swiperHeight}
            showsButtons={true}
            loop={false}
            showsPagination={false}>
            {this.state.intervals.map((miles, i) =>
              <MaintenanceCard
                key={i}
                miles={miles}
                vehicleId={this.props.vehicleId}
                authentication_token={this.props.authentication_token}
                navigator={this.props.navigator} />)}
          </Swiper>
        </View>
      </View>
    );
  }
}

class MaintenanceCard extends Component {
  constructor(props) {
    super(props);
    this.state = { services: [], isLoading: false };
  }

  componentDidMount() {
    this.unsubscribe = subscribe(this.props.miles, () => this.getServices());
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  async getServices() {
    if (this.state.isLoading)
      return;

    this.setState({ isLoading: true });

    let response = await getJSON(
      getUrl(SERVICES_URL, this.props.vehicleId), { interval: this.props.miles },
      { 'Authorization': this.props.authentication_token }
    );

    this.setState({ isLoading: false });

    if (response.error) {
      Alert.alert('Error', response.error);
    } else if (response.result) {
      this.setState({ services: response.result.vehicles || [] });
      this.unsubscribe && this.unsubscribe();
    }
  }

  render() {
    return (
      <View style={styles.maintenanceCard}>
        <ScrollView style={styles.maintenanceList}>
          <Text style={styles.miles}>
            <Text style={styles.milesValue}>{this.props.miles}</Text>
            {' '}MILES
          </Text>
          {this.state.isLoading && <ActivityIndicator color="#006699" />}
          {this.state.services.map((service, i) =>
            <Service key={i} service={service} nav={this.props.navigator} />)}
        </ScrollView>
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
      <View>
        <TouchableOpacity
          style={styles.maintenanceRow}
          onPress={() => this.props.nav.push({
            indent:'MaintenanceDetail',
            passProps:{
              category:this.props.service.id,
              miles:this.props.miles,
              name:this.props.service.name,
              lowCost:this.props.service.labor_low_cost,
              highCost:this.props.service.labor_high_cost,
              desc:this.props.service.required_skills_description,
              time:this.props.service.base_labor_time,
              timeInterval:this.props.service.labor_time_interval,
              intervalMile:this.props.service.interval_mile,
              intervalMonth:this.props.service.interval_month,
              partLowCost:this.props.service.part_low_cost,
              position:this.props.service.position,
              parts:this.props.service.motor_vehicle_service_parts
            }})}>
          <Text style={styles.maintenanceItem}>{this.props.service.name} {this.props.service.position}</Text>

          <View style={styles.fairPriceContainer}>
            <Text style={styles.fairPriceText}>FAIR PRICE</Text>
            <View style={styles.fairPriceRange}>
              <Text style={styles.fairPrice}>${Number(this.props.service.labor_low_cost).toFixed(0)}</Text>
              <Image
                source={require('../../images/arrow-range.png')}
                style={styles.fairPriceArrow} />
              <Text style={styles.fairPrice}>${Number(this.props.service.labor_high_cost).toFixed(0)}</Text>
            </View>
          </View>

        </TouchableOpacity>
      </View>
    );
  }
});

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
  maintenanceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  maintenanceSwiper: {
    flex: 1
  },
  maintenanceSwiperButtons: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  swiperButton: {
    marginBottom: 6,
    height: 40,
    resizeMode: 'contain'
  },
  maintenanceCard: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 70,
    backgroundColor: '#EFEFEF',
    borderColor: '#fff',
    borderWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 }
  },
  maintenanceList: {
    flex: 1,
    padding: 5
  },
  miles: {
    paddingTop: 10,
    paddingBottom: 15,
    fontFamily: 'RobotoCondensed-Light',
    fontSize: 18,
    textAlign: 'center',
    color: '#006699'
  },
  milesValue: {
    fontWeight: 'bold'
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 3,
  },
  maintenanceItem: {
    flex: 5,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  maintenanceDesc: {
    width: width,
    backgroundColor: '#EFEFEF',
    marginBottom: 10,
  },
  maintenanceDescText: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 5,
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#006699',
  },
  priceContainer: {
    flex: 1,
    marginTop: 15,
    marginRight: 10,
  },
  priceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  price: {
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#006699',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006699',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
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
    color: '#FF9900',
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
    color: '#006699',
    fontWeight: 'bold',
  },
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  bookIt: {
    alignItems: 'center',
  },
  btnCheckout: {
    width: 300,
    height: 40,
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

module.exports = connect(mapStateToProps)(Maintenance);
