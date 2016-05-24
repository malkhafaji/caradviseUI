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
  Navigator,
  TouchableOpacity,
} from 'react-native';

class AddServices extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.servicesContainer}>
              <Text style={styles.textHd}>Select Maintenance</Text>

              <View style={styles.servicesList}>
                <Text style={styles.servicesItem}>Oil Change Services</Text>
                <Image
                  resizeMode="contain"
                  source={require('../../images/arrow-blue.png')}
                  style={styles.arrow} />
              </View>
              <View style={styles.servicesList}>
                <Text style={styles.servicesItem}>Tire Services</Text>
                <Image
                  resizeMode="contain"
                  source={require('../../images/arrow-blue.png')}
                  style={styles.arrow} />
              </View>
              <View style={styles.servicesList}>
                <Text style={styles.servicesItem}>Brake Services</Text>
                <Image
                  resizeMode="contain"
                  source={require('../../images/arrow-blue.png')}
                  style={styles.arrow} />
              </View>
              <View style={styles.servicesList}>
                <Text style={styles.servicesItem}>Battery Services</Text>
                <Image
                  resizeMode="contain"
                  source={require('../../images/arrow-blue.png')}
                  style={styles.arrow} />
              </View>
              <View style={styles.servicesList}>
                <Text style={styles.servicesItem}>Diagnostic Services</Text>
                <Image
                  resizeMode="contain"
                  source={require('../../images/arrow-blue.png')}
                  style={styles.arrow} />
              </View>

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
  servicesContainer: {
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: '#666666',
  },
  servicesList: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: 360,
    padding: 15,
    marginBottom: 2,
  },
  servicesItem: {
    width: 325,
    color: '#666666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    width: 8,
    height: 13,
    marginTop: 5,
  },
});

module.exports = AddServices;
