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
  Dimensions,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/?/services';

class ServiceRequest extends Component {

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
        this.setState({
          services: responseData.vehicles,
          total: "$" + total.toFixed(2)
        });
      })
      .done();
  }
}

render() {
  if (!this.state.services) {
    return this.renderLoadingView();
  }
  var services = this.state.services;
  var nav = this.props.navigator;
  return this.renderServices(services,nav);
}

renderLoadingView() {
  return (
    <View>
      <Spinner visible={true} />
    </View>
  );
}

filterMaintenanceServices(service)
{
  return (service.status == 0 && service.service_type == 'Service');
}

filterSavedServices(service)
{
  return service.status == 2;
}

renderServices(services) {
    var maintenanceServices = services.filter(this.filterMaintenanceServices.bind(this));
    var savedServices = services.filter(this.filterSavedServices.bind(this));
    return (

      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Service Request</Text>

          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>JIFFY LUBE</Text>{'\n'}1217 Main St. Palatine</Text>
            <View style={styles.changeContainer}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
                <Image
                  source={require('../../../images/btn-change.png')}
                  style={styles.btnChange} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.selectShop}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
              <Image
                source={require('../../../images/btn-selectshop.png')}
                style={styles.btnSelectShop} />
            </TouchableOpacity>
          </View>

          <Text style={styles.textHd}>Recommended Services (45000 miles)</Text>
          {maintenanceServices.map(createServiceRow)}

          <Text style={styles.textHd}>Saved Services</Text>
          {savedServices.map(createServiceRow)}

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
              <Image
                source={require('../../../images/btn-add-service.png')}
                style={styles.btnAddService} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'RequestSubmitted' })}>
            <Image
              source={require('../../../images/btn-submitServiceRequest.png')}
              style={styles.btnRequest} />
          </TouchableOpacity>

        </View>
        </ScrollView>
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
  <TouchableOpacity
    onPress={() => this.props.navigator.push({ indent:'ServiceRequestDetail' })}>
    <View style={styles.serviceRow}>
      <Text style={styles.serviceItem}>{this.props.service.name}</Text>
      <View style={styles.fairPriceContainer}>
        <Text style={styles.fairPriceText}>FAIR PRICE</Text>
        <View style={styles.fairPriceRange}>
          <Text style={styles.fairPrice}>${Number(this.props.service.low_fair_cost).toFixed(0)}</Text>
          <Image
            source={require('../../../images/arrow-range.png')}
            style={styles.fairPriceArrow} />
          <Text style={styles.fairPrice}>${Number(this.props.service.high_fair_cost).toFixed(0)}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
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
  textBld: {
    fontWeight: 'bold',
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
  shopInfo: {
    flex: 4,
    color: '#006699',
    fontSize: 12,
  },
  changeContainer: {
    flex: 1,
  },
  btnChange: {
    width: 56,
    height: 22,
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceItem: {
    flex: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
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
    margin: 20,
  },
  btnRequest: {
    width: width,
    height: 46,
    marginTop: 10,
    marginBottom: 100,
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

module.exports = connect(mapStateToProps)(ServiceRequest);
