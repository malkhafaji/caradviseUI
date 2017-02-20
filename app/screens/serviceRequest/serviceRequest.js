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
import storage from '../../utils/storage';
import { postJSON } from '../../utils/fetch';
import { flatMap, capitalize } from 'lodash';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/services';
var CREATE_ORDER_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/create_order_by_app';

class ServiceRequest extends Component {

  constructor(props) {
    super(props);

    let oilServiceName = 'Oil Change';
    if (props.oilType)
      oilServiceName += ` - ${capitalize(props.oilType)}`;

    this.state = Object.assign({
      shop:null,
      services:null,
      total:0,
      visible: false,
      datetime: null,
      isLoading: false
    }, cache.get('serviceRequest-fields') || {});

    this.removeService = this.removeService.bind(this);
    this.createServiceRow = this.createServiceRow.bind(this);
  }

  componentDidMount() {
    if (this.state.services === null)
      this.getMaintenance();

    storage.get('caradvise:shop')
      .then(shop => shop && this.setState({ shop }));
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
      fetch(MAINTENANCE_URL.replace('?', this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
        .then((response) => response.json())
        .then((responseData) => {
          var total = 0;
          var services = responseData.vehicles.filter(({ status, service_id }) => (status == 0 || status == 2) && service_id);

          this.setState({
            services,
            total: '$' + total.toFixed(2)
          }, () => this.setupDefaultOilType());
        })
        .done();
    }
  }

  setupDefaultOilType() {
    const oilType = this.props.oilType;
    if (!oilType) return;

    const oilService = this.state.services.find(s => s.service_id === 108);
    if (!oilService) return;

    const serviceOptions = cache.get('serviceDetail-serviceOptions') || {}
    if (serviceOptions[oilService.service_id]) return;

    const options = {
      'EURO-SYNTHETIC': 1630,
      'FULL-SYNTHETIC': 1629,
      'SYNTHETIC-BLEND': 1628,
      'CONVENTIONAL': 1627
    }
    const service_option_item_id = options[oilType]
    if (!service_option_item_id) return;

    serviceOptions[oilService.service_id] = {
      parts: [{ service_option_id: '416', service_option_item_id }]
    };

    cache.set('serviceDetail-serviceOptions', serviceOptions);
  }

  render() {
    if (!this.state.services || this.state.isLoading) {
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
    return (service.status == 0 || service.status == 1 && service.service_type == 'Service');
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
    this.setState({ isLoading: true });

    let services = flatMap(this.state.services, a => a.service_id || a.app_services.map(b => b.service_id))
      .map(service_id => ({
        service_id,
        ...((cache.get('serviceDetail-serviceOptions') || {})[service_id] || {})
      }));

    let response = await postJSON(
      CREATE_ORDER_URL.replace('?', this.props.vehicleId),
      {
        shop_id: this.state.shop.id,
        services: JSON.stringify(services),
        appointment_datetime: this.state.datetime
      },
      { 'Authorization': this.props.authentication_token }
    )

    this.setState({ isLoading: false });

    if (response.error) {
      Alert.alert('Error', response.error);
    } else {
      cache.remove('serviceRequest-fields');
      cache.remove('serviceDetail-serviceOptions');
      this.props.navigator.push({ indent:'RequestSubmitted', passProps: { datetime: this.state.datetime }})
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

          <Text style={styles.textHd}>Book a Shop</Text>

          {this.state.shop &&
          <View style={styles.selectedShop}>
            <Text style={styles.shopInfo}><Text style={styles.textBld}>{this.state.shop.name} - {this.state.shop.city}</Text>{'\n'}{`${this.state.shop.address_line1}`}</Text>
            <View style={styles.changeContainer}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
                <Image
                  source={require('../../../images/btn-change.png')}
                  style={styles.btnChange} />
              </TouchableOpacity>
            </View>
          </View>}

          {!this.state.shop &&
          <View style={styles.selectShop}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'FindShop' })}>
              <Image
                resizeMode={'contain'}
                source={require('../../../images/btn-browseShops.png')}
                style={styles.btnSelectShop} />
            </TouchableOpacity>
          </View>}

          <View style={styles.stepContainer}>
            <View style={styles.dotContainer}>
              <Image
                source={require('../../../images/dot1.png')}
                style={styles.dot} />
            </View>
            <Text style={styles.stepText}>SELECT SERVICES</Text>
          </View>

          {maintenanceServices.length ?
            maintenanceServices.map(this.createServiceRow) :
            null}

          {savedServices.length ?
            savedServices.map(this.createServiceRow) :
            null}

          {addedServices.length ?
            addedServices.map(this.createServiceRow) :
            null}

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices', passProps: { returnTo: 'ServiceRequest' } })}>
              <Image
                source={require('../../../images/btn-addService.png')}
                style={styles.btnAddService} />
            </TouchableOpacity>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.dotContainer}>
              <Image
                source={require('../../../images/dot2.png')}
                style={styles.dot} />
            </View>
            <Text style={styles.stepText}>SCHEDULE A TIME</Text>
          </View>

          <DatePicker
            style={styles.selectTime}
            date={this.state.datetime}
            mode="datetime"
            placeholder="SELECT DATE & TIME"
            format="MM-DD-YYYY HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minuteInterval={15}
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

          <View style={styles.stepContainer}>
            <View style={styles.dotContainer}>
              <Image
                source={require('../../../images/dot3.png')}
                style={styles.dot} />
            </View>
            <Text style={styles.stepText}>SUBMIT REQUEST</Text>
          </View>

          {!this.state.shop || !this.state.datetime ? (
            <Image
              source={require('../../../images/btn-requestAppointment-grey.png')}
              style={styles.btnRequest} />
          ) : null }

          {this.state.shop && this.state.services && this.state.datetime &&
          <TouchableOpacity onPress={() => this.createOrder()}>
            <Image
              source={require('../../../images/btn-requestAppointment.png')}
              style={styles.btnRequest} />
          </TouchableOpacity>}

          <View style={styles.guaranteeContainer}>
            <Text style={styles.guaranteeText}>Prices and shop avialability are subject to change. Please allow up to 4 hours for CarAdvise to confirm your order.</Text>
          </View>

          {/*<View style={styles.guaranteeContainer}>
            <Text style={styles.guaranteeText}>No unnecessary work will be quoted or performed. All work done within our fair price, or we will pay the difference. Every repair guaranteed for 12 Months, 12,000 miles.</Text>
          </View>
          <View style={styles.guaranteeBadge}>
            <Image
              source={require('../../../images/guarantee.png')}
              style={styles.guarantee} />
          </View>*/}

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
        onPress={() => {
          let service = this.props.service.service || ((this.props.service.app_services || [])[0] || {}).service || {};
          this.props.navigator.push({ indent:'ServiceRequestDetail',
            passProps:{
              name:this.props.service.name || this.props.service.literal_name,
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
              whatIsIt:service.what_is_this,
              whatIf:service.what_if_decline,
              whyDoThis:service.why_do_this,
              factors:service.factors_to_consider,
              parts:this.props.service.motor_vehicle_service_parts,
              partDetail:'',
              partName:''
            }});
        }}>
          <Text style={styles.serviceItem}>{this.props.service.name || this.props.service.literal_name}</Text>
          {this.props.service.low_fair_cost !== undefined && this.props.service.high_fair_cost !== undefined &&
          <View style={styles.fairPriceContainer}>
            <Text style={styles.fairPriceText}>FAIR PRICE</Text>
            <View style={styles.fairPriceRange}>
              <Text style={styles.fairPrice}>${Number(this.props.service.low_fair_cost).toFixed(0)}</Text>
              <Image
                source={require('../../../images/arrow-range.png')}
                style={styles.fairPriceArrow} />
              <Text style={styles.fairPrice}>${Number(this.props.service.high_fair_cost).toFixed(0)}</Text>
            </View>
          </View>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => this.props.onRemove(this.props.service)}>
        <View style={styles.deleteContainer}>
          <Image
            source={require('../../../images/btn-delete-circle.png')}
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
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  textBld: {
    fontWeight: 'bold',
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: '#002d5e',
    width: width,
    padding: 10,
    alignItems: 'flex-start',
    marginBottom: 5
  },
  dot: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    marginTop: 2
  },
  btnSelectShop: {
    width: 149,
    height: 30,
    marginTop: 10,
    marginBottom: 15
  },
  selectedShop: {
    flexDirection: 'row',
    width: width,
    borderWidth: 2,
    borderColor: '#efefef',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  shopInfo: {
    flex: 4,
    color: '#002d5e',
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
    color: '#002d5e',
    width: width,
    textAlign: 'center',
  },
  deleteContainer: {
    flex: 1,
  },
  btnDelete: {
    width: 25,
    height: 28,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 149,
    height: 30,
    margin: 15,
  },
  selectTime: {
    width: 200,
    marginTop: 10,
    marginBottom: 15
  },
  btnRequest: {
    width: 280,
    height: 40,
    marginTop: 15,
    marginBottom: 15,
  },
  bookIt: {
    alignItems: 'center',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
  guaranteeContainer: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10
  },
  guaranteeText: {
    color: '#999',
    fontSize: 11
  },
  guaranteeBadge: {
    marginTop: 15
  },
  guarantee: {
    width: 167,
    height: 47
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
    miles : user.vehicles[0].miles,
    oilType: user.vehicles[0].oil_type_name
  };
}

module.exports = connect(mapStateToProps)(ServiceRequest);
