'use strict';

import React from 'react';
import {
    Text,
    View,
    Component,
    Image,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

class carBar extends Component {
  render() {
    return (
      <View style={styles.carContainer}>
        <View style={styles.carType}>
          <Text style={styles.carMake}>{this.props.vehicleYear} </Text>
          <Text style={styles.carModel}>{this.props.vehicleMake} {this.props.vehicleModel}</Text>
        </View>
      </View>
      );
  }
}

var styles = StyleSheet.create({
  carContainer: {
    marginTop: 2,
    backgroundColor: '#0099FF',
    alignItems: 'center',
  },
  carType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carMake: {
    color: 'white',
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15,
  },
  carModel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 15,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  let vehicle = user.vehicles && user.vehicles[0] || {};
  return {
    vehicleYear: vehicle.year,
    vehicleMake: vehicle.make,
    vehicleModel: vehicle.model,
  };
}

module.exports = connect(mapStateToProps)(carBar);
