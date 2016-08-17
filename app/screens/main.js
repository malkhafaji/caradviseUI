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
  Linking,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { getJSON } from '../utils/fetch';

var btnWidth = Dimensions.get('window').width - 40;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/active_order_by_vehicle_number';

class Main extends Component {
    constructor(props) {
      super(props);
      this.state = { hasActiveOrders: false };
    }

    componentDidMount() {
      this.getMaintenance();
    }

    async getMaintenance() {
      if (!this.props.isLoggedIn || !this.props.authentication_token)
        return;

      let response = await getJSON(
        MAINTENANCE_URL,
        { vehicleNumber: this.props.vehicleNumber },
        { 'Authorization': this.props.authentication_token }
      );

      if (response.error) {
        Alert.alert('Hey there!', response.error);
      } else if (response.result && response.result.order) {
        this.setState({ hasActiveOrders: response.result.order.status === 0 });
      }
    }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} showMenu />
            <CarBar />
            <ScrollView>
            <View style={styles.btnContainer}>
              <Image
                source={require('../../images/img-vehicle.png')}
                style={styles.vehicle} />

              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Maintenance' })}>
                <View style={styles.btnRow}>
                  <Image
                    resizeMode={'contain'}
                    source={require('../../images/btn-view-maintenance.png')}
                    style={styles.btnMain} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'ServiceRequest' })}>
                <View style={styles.btnRow}>
                  <Image
                    resizeMode={'contain'}
                    source={require('../../images/btn-servicerequest.png')}
                    style={styles.btnMain} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Approvals' })}>
                <View style={styles.btnRow}>
                  <Image
                    resizeMode={'contain'}
                    source={this.state.hasActiveOrders ?
                      require('../../images/btn-services-alert.png') :
                      require('../../images/btn-services.png')}
                    style={styles.btnMain} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this._callPhone('18449238473')}>
                <View style={styles.btnRow}>
                  <Image
                    resizeMode={'contain'}
                    source={require('../../images/btn-call.png')}
                    style={styles.btnMain} />
                </View>
              </TouchableOpacity>

            </View>
            </ScrollView>
          </View>
        );
    }

    _callPhone(number) {
      let url = `tel:${number}`;

      Linking.canOpenURL(url).then(supported => {
        if (supported)
          Linking.openURL(url);
        else
          Alert.alert(`Call ${number}`);
      });
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  vehicle: {
    height: 250,
    width: Dimensions.get('window').width,
    marginTop: 1,
    marginBottom: 20,
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  btnText: {
    flex: 4,
    color: '#11325F',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  arrowContainer: {
    flex: 1,
    paddingTop: 6,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  arrow: {
    textAlign: 'right',
  },
  arrowBlue: {
    width: 8,
    height: 13,
  },
  btnContainer: {
    alignItems: 'center',
  },
  btnMain: {
    width: btnWidth,
    height: 60,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleNumber: user.vehicles ? user.vehicles[0].vehicleNumber : null
  };
}

module.exports = connect(mapStateToProps)(Main);
