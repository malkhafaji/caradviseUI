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
  Dimensions,
} from 'react-native';

var width = Dimensions.get('window').width - 20;

class AddServices extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.servicesContainer}>
              <Text style={styles.textHd}>Select Maintenance</Text>

              <TouchableOpacity style={styles.servicesList}>
                <Text style={styles.servicesItem}>Oil Change Services</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>
                    <Image
                      resizeMode="contain"
                      source={require('../../images/arrow-blue.png')}
                      style={styles.arrowBlue} />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.servicesList}>
                <Text style={styles.servicesItem}>Tire Services</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>
                    <Image
                      resizeMode="contain"
                      source={require('../../images/arrow-blue.png')}
                      style={styles.arrowBlue} />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.servicesList}>
                <Text style={styles.servicesItem}>Brake Services</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>
                    <Image
                      resizeMode="contain"
                      source={require('../../images/arrow-blue.png')}
                      style={styles.arrowBlue} />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.servicesList}>
                <Text style={styles.servicesItem}>Battery Services</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>
                    <Image
                      resizeMode="contain"
                      source={require('../../images/arrow-blue.png')}
                      style={styles.arrowBlue} />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.servicesList}>
                <Text style={styles.servicesItem}>Diagnostic Services</Text>
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
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: width,
    padding: 15,
    marginBottom: 2,
  },
  servicesItem: {
    flex: 3,
    color: '#666666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flex: 1,
  },
  arrow: {
    textAlign: 'right',
    paddingTop: 5,
  },
  arrowBlue: {
    width: 8,
    height: 13,
  },
});

module.exports = AddServices;
