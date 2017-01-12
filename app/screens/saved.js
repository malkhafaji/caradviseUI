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

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/services';

class Saved extends Component {

    constructor(props) {
      super(props);
      this.state = {
        services:null,
        total:0,
        visible: false,
      };
    }

    componentDidMount() {
      this.getMaintenance();
    }

    getMaintenance() {
      if(this.props.isLoggedIn && this.props.vehicleId)
      {
        fetch(MAINTENANCE_URL.replace("?", this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
          .then((response) => response.json())
          .then((responseData) => {
            var total = 0;
            /*for (var i = 0; i < responseData.vehicles.length; i++) {
              var cost = responseData.vehicles[i].Service.TotalPartCost;
              if(typeof cost !== "undefined")
              {
                total += Number(cost.replace("$", ""));
              }
            }*/
            this.setState({
              services: responseData.vehicles,
              total: "$" + total.toFixed(2)
            });
          })
          .done();
      }
    }

    _renderScene(route, navigator) {
      var globalNavigatorProps = {navigator}

      switch(route.indent) {
        case 'Main':
          return (
            <Main {...globalNavigatorProps} />
          )
        case 'Approvals':
          return (
            <Approvals {...globalNavigatorProps} />
          )
        default:
          return (
            <Text>EPIC FAIL</Text>
          )
      }
    }

    render() {
      if (!this.state.services) {
        return this.renderLoadingView();
      }
      var services = this.state.services;
      return this.renderServices(services);
    }

    renderLoadingView() {
      return (
        <View>
          <Spinner visible={true} />
        </View>
      );
    }

    filterSavedServices(service)
    {
      return service.status == 2;
    }

    renderServices(services) {
        var savedServices = services.filter(this.filterSavedServices.bind(this));
        return (

          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.maintenanceContainer}>

              <ScrollView style={styles.scrollView}>
              <Text style={styles.textHd}>Saved Maintenance</Text>

              <View style={styles.maintenanceList}>
              {savedServices.map(createServiceRow)}
              </View>

              {/*
              <View style={styles.total}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalPrice}>{this.state.total}</Text>
              </View>

              <View style={styles.rowAddService}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.bookIt}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    source={require('../../images/btn-bookit-big.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>
              */}

              </ScrollView>

            </View>

          </View>

        );
    }
}

var createServiceRow = (service, i) => <Service key={i} service={service} />;

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <View>
        <View style={styles.maintenanceRow}>
          <Text style={styles.maintenanceItem}>{this.props.service.name}</Text>
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
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
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
  fairPriceContainer: {
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
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

module.exports = connect(mapStateToProps)(Saved);
