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
  Alert
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import cache from '../../utils/cache';
import { postJSON } from '../../utils/fetch';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/services';
var CREATE_ORDER_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/?/create_order_by_app';

class SelectMaintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      services: [],
      selectedServiceIds: []
    }
  }

  componentDidMount() {
    this.getMaintenance();
  }

  getMaintenance() {
    if (this.props.isLoggedIn && this.props.vehicleId) {
      this.setState({ isLoading: true });
      fetch(MAINTENANCE_URL.replace("?", this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
        .then((response) => response.json())
        .then((responseData) => {
          let services = responseData.vehicles.filter(service => service.service_id);
          if (services.length > 0) {
            this.setState({ isLoading: false, services });
          } else {
            this.createOrder();
          }
        })
    }
  }

  render() {
    if (this.state.isLoading)
      return <Spinner visible={true} />;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Based on your mileage, the following maintenance is highly recommended. Please select the work you would like to get done.</Text>
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
          <View style={styles.noServicesBg}>
            <View style={styles.noServicesContainer}><Text style={styles.noServices}>No added services</Text></View>
          </View>

          <View style={styles.rowAddService}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
              <Image
                source={require('../../../images/btn-add-service.png')}
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
      </View>
    );
  }

  toggleService(id) {
    let selectedServiceIds = [...this.state.selectedServiceIds];
    let index = selectedServiceIds.indexOf(id);

    if (index >= 0)
      selectedServiceIds.splice(index, 1);
    else
      selectedServiceIds.push(id);

    this.setState({ selectedServiceIds });
  }

  async createOrder() {
    this.setState({ isLoading: true });

    let selectShopFields = cache.get('selectShop-fields');
    let response = await postJSON(
      CREATE_ORDER_URL.replace('?', this.props.vehicleId),
      {
        shop_id: selectShopFields.shop.id,
        //services: this.state.selectedServiceIds.join(','),
        services: '[{"service_id":108},{"service_id":375}]',
        appointment_datetime: ''
      },
      { 'Authorization': this.props.authentication_token }
    );

    this.setState({ isLoading: false });

    if (response.error) {
      Alert.alert('Error', response.error);
    } else {
      cache.remove('selectShop-fields');
      this.props.navigator.replace({ indent: 'SelectShopDone' });
    }
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: 'white'
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
    paddingLeft: 20,
    paddingRight: 20,
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
    marginTop: 20
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
    width: 110,
    height: 10,
    margin: 20,
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
