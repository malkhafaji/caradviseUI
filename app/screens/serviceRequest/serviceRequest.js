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
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker';
import cache from '../../utils/cache';
import { postJSON } from '../../utils/fetch';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/?/services';
var CREATE_ORDER_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/?/create_order_by_app';

class ServiceRequest extends Component {

constructor(props) {
  super(props);
  this.state = Object.assign({
    shop:null,
    services:null,
    total:0,
    visible: false,
    datetime: null,
  }, cache.get('serviceRequest-fields') || {});

  this.removeService = this.removeService.bind(this);
  this.createServiceRow = this.createServiceRow.bind(this);
}

componentDidMount() {
  if (this.state.services === null)
    this.getMaintenance();
}

componentDidUpdate() {
  cache.set('serviceRequest-fields', this.state);
}

removeService(service) {
  const services = [...this.state.services];
  services.splice(services.indexOf(service), 1);
  this.setState({ services });
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
  return this.renderServices(services);
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

filterAddedServices(service)
{
  return service.status == 'ADDED';
}

async createOrder()
{
  let response = await postJSON(
    CREATE_ORDER_URL.replace('?', this.props.vehicleId),
    {
      shop_id: this.state.shop.id,
      services: this.state.services.map(({ id }) => id),
      appointment_datetime: this.state.datetime
    },
    { 'Authorization': this.props.authentication_token }
  )

  if (response.error) {
    Alert.alert('Error', response.error);
  } else {
    cache.remove('serviceRequest-fields');
    this.props.navigator.push({ indent:'RequestSubmitted' })
  }
}

renderServices(services) {
    var maintenanceServices = services.filter(this.filterMaintenanceServices.bind(this));
    var savedServices = services.filter(this.filterSavedServices.bind(this));
    var addedServices = services.filter(this.filterAddedServices.bind(this));
    return (

      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView
          style={styles.scrollView}>
        <View style={styles.container}>

          <Text style={styles.textHd}>Service Request</Text>

          {this.state.shop &&
          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>{this.state.shop.name}</Text>{'\n'}{this.state.shop.address}</Text>
            <View style={styles.changeContainer}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
                <Image
                  source={require('../../../images/btn-change.png')}
                  style={styles.btnChange} />
              </TouchableOpacity>
            </View>
          </View>}

          <View style={styles.selectShop}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
              <Image
                resizeMode={'contain'}
                source={require('../../../images/btn-selectshop.png')}
                style={styles.btnSelectShop} />
            </TouchableOpacity>
          </View>

          <Text style={styles.textHd}>Recommended Services ({this.props.miles} miles)</Text>
          {maintenanceServices.length ?
            maintenanceServices.map(this.createServiceRow) :
            <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>No recommended services</Text></View></View>}

          <Text style={styles.textHd}>Saved Services</Text>
          {savedServices.length ?
            savedServices.map(this.createServiceRow) :
            <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>No saved services</Text></View></View>}

          <Text style={styles.textHd}>Added Services</Text>
          {addedServices.length ?
            addedServices.map(this.createServiceRow) :
            <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>No added services</Text></View></View>}

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
              <Image
                source={require('../../../images/btn-add-service.png')}
                style={styles.btnAddService} />
            </TouchableOpacity>
          </View>

          <DatePicker
            style={{width: 200}}
            date={this.state.datetime}
            mode="datetime"
            placeholder="SELECT DATE & TIME"
            format="MM-DD-YYYY HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36,
                borderColor: '#CCC',
                borderWidth: 1,
              }
            }}
            onDateChange={(datetime) => {this.setState({datetime: datetime});}}
          />

          {this.state.shop && this.state.services && this.state.datetime &&
          <TouchableOpacity onPress={() => this.createOrder()}>
            <Image
              source={require('../../../images/btn-submitServiceRequest.png')}
              style={styles.btnRequest} />
          </TouchableOpacity>}

        </View>
        </ScrollView>
      </View>

    );
}

createServiceRow(service, i) {
  return <Service key={service.id} service={service} navigator={this.props.navigator} onRemove={this.removeService} />;
}

}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
  return false;
},
render: function() {
  return (

    <View style={styles.serviceRow}>

      <TouchableOpacity
        style={styles.serviceContainer}
        onPress={() => this.props.navigator.push({ indent:'ServiceRequestDetail',
          passProps:{
            name:this.props.service.name,
            fairLow:this.props.service.low_fair_cost,
            fairHigh:this.props.service.high_fair_cost,
            time:this.props.service.base_labor_time,
            timeInterval:this.props.service.labor_time_interval,
            intervalMile:this.props.service.interval_mile,
            intervalMonth:this.props.service.interval_month,
            laborLow:this.props.service.labor_low_cost,
            laborHigh:this.props.service.labor_high_cost,
            partLow:this.props.service.part_low_cost,
            partHigh:this.props.service.part_high_cost,
            whatIsIt:this.props.service.what_is_it,
            whatIf:this.props.service.what_if_decline,
            whyDoThis:this.props.service.why_do_this,
            factors:this.props.service.factors_to_consider,
            parts:this.props.service.motor_vehicle_service_parts,
            partDetail:'',
            partName:''
          }})}>
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
      </TouchableOpacity>

      <TouchableOpacity onPress={() => this.props.onRemove(this.props.service)}>
        <View style={styles.deleteContainer}>
          <Image
            source={require('../../../images/btn-delete.png')}
            style={styles.btnDelete} />
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
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    flexDirection: 'column',
    width: width,
    alignItems: 'center',
    paddingBottom: 50
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
  serviceContainer: {
    flex: 8,
    flexDirection: 'row',
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
  noServicesBg: {
    width: width,
    backgroundColor: '#EFEFEF',
    marginBottom: 2,
  },
  noServicesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  noServices: {
    color: '#006699',
    width: width,
    textAlign: 'center',
  },
  deleteContainer: {
    flex: 1,
  },
  btnDelete: {
    width: 15,
    height: 15,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
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
    marginTop: 20,
    marginBottom: 50,
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
