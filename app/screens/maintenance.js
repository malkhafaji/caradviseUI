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

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/?/maintenance';

class Maintenance extends Component {

  constructor(props) {
    super(props);
    var category = this.props.navigator._navigationContext._currentRoute.passProps ? this.props.navigator._navigationContext._currentRoute.passProps.category : null;
    this.state = {
      category: category,
      services:null,
      visible: false,
    };
  }

  componentDidMount() {
    this.getMaintenance();
  }

  filterServices(service)
  {
    return service.parent_id == this.state.category;
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
        case 'MaintenaceDetail':
          return (
            <MaintenanceDetail {...globalNavigatorProps} />
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

    renderServices(services) {
        return (

          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.maintenanceContainer}>

              <ScrollView style={styles.scrollView}>
              <Text style={styles.textHd}>Maintenance Schedule ({this.props.miles} miles)</Text>

              <View style={styles.maintenanceList}>
              {services.map(this.createServiceRow)}
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
    createServiceRow = (service, i) => <Service key={i} service={service} nav={this.props.navigator} />;

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
              position:this.props.service.position}})}>
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

          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>
              <Image
                resizeMode="contain"
                source={require('../../images/arrow-blue.png')}
                style={styles.arrowBlue} />
            </Text>
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
    marginRight: 3,
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
  arrowContainer: {
    flex: 1,
  },
  arrow: {
    textAlign: 'right',
    marginTop: 20,
    marginRight: 10,
  },
  arrowBlue: {
    width: 8,
    height: 13,
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
