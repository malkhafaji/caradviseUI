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
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { getJSON } from '../utils/fetch';

var HISTORY_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/orders/orders_history_by_vehicle_id';

var width = Dimensions.get('window').width - 20;

function formatDate(date) {
  let dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

class MaintenanceHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false
    };
  }

  async getHistory() {
    if (!this.props.isLoggedIn || !this.props.vehicleId)
      return;

    this.setState({ isLoading: true });

    let response = await getJSON(
      HISTORY_URL,
      { vehicle_id: this.props.vehicleId },
      { 'Authorization': this.props.authentication_token }
    );

    this.setState({ isLoading: false });

    if (response.result) {
      const orders = (response.result.orders || []).filter(({ status }) => status == 3);
      this.setState({ orders });
    }
  }

  componentDidMount() {
    this.getHistory();
  }

  render() {
    if (this.state.isLoading)
      return <Spinner visible />;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Maintenance History</Text>

          {this.state.orders.map(order => this.renderOrder(order))}

        </View>
        </ScrollView>
      </View>
    );
  }

  renderOrder(order) {
    return (
      <View key={order.id}>
        <View style={styles.selectedShop}>
          <Text style={styles.shopInfo}><Text style={styles.textBld}>{order.shop.name}</Text>{'\n'}{order.shop.address}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.serviceDate}>{formatDate(order.created)}</Text>
            <Text style={styles.serviceDate}>Total: ${Number(order.total).toFixed(2)}</Text>
          </View>
        </View>
        {order.orders_services.map((service, index) => this.renderService(service, index))}
      </View>
    );
  }

  renderService(service, index) {
    return (
      <View key={index} style={styles.maintenanceRow}>
        <Text style={styles.maintenanceItem}>{service.service_name}</Text>
        <View style={styles.newServicePriceContainer}>
          <Text style={styles.newServicePriceHd}>PRICE</Text>
          <Text style={styles.newServicePrice}>${Number(service.totalCost).toFixed(2)}</Text>
        </View>
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
    paddingHorizontal: 10
  },
  maintenanceContainer: {
    flex: 1,
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
  dateContainer: {
    flex: 2,
  },
  serviceDate: {
    fontSize: 11,
    textAlign: 'right',
  },
  maintenanceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 3,
  },
  maintenanceItem: {
    flex: 5,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  newServicePriceContainer: {
    flex: 2,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    color: '#002d5e',
    textAlign: 'right',
    fontWeight: 'bold',
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
    color: '#002d5e',
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
    color: '#002d5e',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#002d5e',
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
    color: '#002d5e',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
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

module.exports = connect(mapStateToProps)(MaintenanceHistory);
