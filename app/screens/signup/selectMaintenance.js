'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Component,
  ScrollView,
  Alert
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import cache from '../../utils/cache';
import { postJSON } from '../../utils/fetch';
import { flatMap } from 'lodash';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/services';
var CREATE_ORDER_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/create_order_by_app';

class SelectMaintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      services: cache.get('selectMaintenance-services') || [],
      addedServices: cache.get('selectMaintenance-addedServices') || [],
      selectedServiceIds: cache.get('selectMaintenance-selectedServiceIds') || []
    }
  }

  componentDidMount() {
    if (this.state.services.length === 0)
      this.getMaintenance();
  }

  getMaintenance() {
    if (this.props.isLoggedIn && this.props.vehicleId) {
      this.setState({ isLoading: true });
      fetch(MAINTENANCE_URL.replace("?", this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
        .then((response) => response.json())
        .then((responseData) => {
          let services = [];
          let defaultServices = [
            { service_id: 108, name: 'Oil Change' },
            { service_id: 375, name: 'Tire Rotation' },
            { service_id: 14, name: 'Engine Air Filter' }
          ];

          if (responseData.vehicles) {
            services = responseData.vehicles.filter(service => service.service_id);
          }

          defaultServices = defaultServices.filter(service => {
            return services.every(s => s.service_id != service.service_id);
          });
          services.unshift(defaultServices);

          this.setState({ isLoading: false, services });
          cache.set('selectMaintenance-services', services);
        })
    }
  }

  render() {
    if (this.state.isLoading)
      return <Spinner visible={true} />;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Based on your mileage, the following maintenance is highly recommended. Please select the work you would like to get a quote for.</Text>
          <View style={styles.maintenanceHd}>
            <Text style={styles.maintenanceTxt}>{this.props.miles} MILES</Text>
          </View>

          {this.state.services.map(service => (
            <TouchableOpacity
              key={service.service_id}
              style={styles.maintenanceItem}
              onPress={() => this.toggleService(service.service_id)}>
              <View style={styles.maintenanceCheckContainer}>
                <Image
                  resizeMode='contain'
                  source={this.state.selectedServiceIds.indexOf(service.service_id) >= 0 ?
                    require('../../../images/checkbox-on.png') :
                    require('../../../images/checkbox-off.png')}
                  style={styles.checkboxOn} />
              </View>
              <View style={styles.maintenanceNameContainer}>
                <Text style={styles.maintenanceName}>{service.name || service.literal_name}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.textHd}>Added Services</Text>
          { this.state.addedServices.length > 0 ?
            this.state.addedServices.map(this.renderServiceRow) :
            <View style={styles.noServicesBg}>
              <View style={styles.noServicesContainer}><Text style={styles.noServices}>No added services</Text></View>
            </View>
          }

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices', passProps: { returnTo: 'SelectMaintenance' } })}>
              <Image
                source={require('../../../images/btn-addService.png')}
                style={styles.btnAddService} />
            </TouchableOpacity>
          </View>

          <View style={styles.btnCol}>
            <TouchableOpacity onPress={() => this.createOrder()}>
              <Image
                resizeMode='contain'
                source={require('../../../images/btn-next-med.png')}
                style={styles.btn} />
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
    );
  }

  renderServiceRow = service => (
    <View key={service.id} style={styles.serviceRow}>
      <View style={styles.serviceContainer}>
        <Text style={styles.serviceItem}>{service.name}</Text>
      </View>
      <TouchableOpacity onPress={() => this.removeAddedService(service)}>
        <View style={styles.deleteContainer}>
          <Image
            source={require('../../../images/btn-delete.png')}
            style={styles.btnDelete} />
        </View>
      </TouchableOpacity>
    </View>
  )

  removeAddedService(service) {
    let addedServices = [...this.state.addedServices];
    addedServices.splice(addedServices.indexOf(service), 1);
    this.setState({ addedServices });
    cache.set('selectMaintenance-addedServices', addedServices);
  }

  toggleService(id) {
    let selectedServiceIds = [...this.state.selectedServiceIds];
    let index = selectedServiceIds.indexOf(id);

    if (index >= 0)
      selectedServiceIds.splice(index, 1);
    else
      selectedServiceIds.push(id);

    this.setState({ selectedServiceIds });
    cache.set('selectMaintenance-selectedServiceIds', selectedServiceIds);
  }

  async createOrder() {
    this.setState({ isLoading: true });

    let services = this.state.selectedServiceIds.concat(
      flatMap(this.state.addedServices, a => a.app_services.map(b => b.service_id))
    ).map(service_id => ({
      service_id,
      ...((cache.get('serviceDetail-serviceOptions') || {})[service_id] || {})
    }));

    let selectShopFields = cache.get('selectShop-fields');
    let response = await postJSON(
      CREATE_ORDER_URL.replace('?', this.props.vehicleId),
      {
        shop_id: selectShopFields.shop.id,
        services: JSON.stringify(services),
        appointment_datetime: ''
      },
      { 'Authorization': this.props.authentication_token }
    );

    this.setState({ isLoading: false });

    if (response.error) {
      Alert.alert('Error', response.error);
    } else {
      cache.remove('selectShop-fields');
      cache.remove('selectMaintenance-selectedServiceIds');
      cache.remove('selectMaintenance-services');
      cache.remove('selectMaintenance-addedServices');
      cache.remove('serviceDetail-serviceOptions');
      this.props.navigator.replace({ indent: 'SelectShopDone' });
    }
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
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
  textStep: {
    marginTop: 30,
    marginBottom: 30,
    color: '#002d5e',
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: 'center'
  },
  maintenanceHd: {
    width: width,
    backgroundColor: '#0099ff',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 3
  },
  maintenanceTxt: {
    width: width,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },
  maintenanceItem: {
    width: width,
    flexDirection: 'row',
    backgroundColor: '#efefef',
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  maintenanceCheckContainer: {
    flex: 1,
    marginLeft: 15
  },
  maintenanceNameContainer: {
    flex: 6
  },
  maintenanceName: {
    color: '#002d5e',
    fontWeight: 'bold'
  },
  checkboxOn: {
    width: 25,
    marginRight: 5
  },
  checkboxOff: {
    width: 25,
    marginRight: 5
  },
  btnCol: {
    marginTop: 10
  },
  btn: {
    width: 190,
    height: 60
  },
  rowAddService: {
    alignItems: 'center',
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
  btnAddService: {
    width: 145,
    height: 29,
    marginTop: 20,
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
    flex: 1,
    margin: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  deleteContainer: {
    flex: 1,
  },
  btnDelete: {
    width: 15,
    height: 15,
    margin: 10,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  let vehicle = user.vehicles && user.vehicles[0] || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : vehicle.id,
    miles : vehicle.miles,
  };
}

module.exports = connect(mapStateToProps)(SelectMaintenance);
