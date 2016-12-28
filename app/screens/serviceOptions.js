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
import cache from '../utils/cache';

var width = Dimensions.get('window').width - 20;

class ServiceOptions extends Component {

  constructor(props) {
    super(props);
    var passProps = this.props.navigator._navigationContext._currentRoute.passProps || {};
    this.state = {
      service: passProps.service,
      options: passProps.options,
      optionIndex: passProps.optionIndex
    };
  }

  render() {
    let options = this.state.options[this.state.optionIndex].values;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView>
          <View style={styles.servicesContainer}>
            <Text style={styles.textHd}>Select Service Options</Text>
            {options.map(option => this.renderOption(option))}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderOption(option) {
    return (
      <TouchableOpacity
        key={option.value}
        style={styles.servicesList}
        onPress={() => this.selectOption(option)}
      >
        <View style={styles.servicesItem}>
          <Text style={styles.servicesItemText}>{option.label}</Text>
          {option.subLabel ?
            <Text style={styles.servicesItemSubText}>{option.subLabel}</Text> : null}
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>
            <Image
              resizeMode="contain"
              source={require('../../images/arrow-blue.png')}
              style={styles.arrowBlue}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  selectOption(option) {
    let options = this.state.options;
    let optionIndex = this.state.optionIndex;

    options[optionIndex].selected = option;
    optionIndex += 1;

    if (optionIndex < this.state.options.length) {
      this.props.navigator.push({
        indent: 'ServiceOptions',
        passProps: {
          service: this.state.service,
          options,
          optionIndex
        }
      })
    } else {
      this.props.navigator.push({
        indent: 'ServiceDetail',
        passProps: {
          name: this.state.service.name,
          whatIsIt: this.state.service.what_is_this,
          whatIf: this.state.service.what_if_decline,
          whyDoThis: this.state.service.why_do_this,
          factors: this.state.service.factors_to_consider,
          service: this.state.service,
          options
        }
      });
    }
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
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
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
  },
  servicesItemText: {
    color: '#002d5e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicesItemSubText: {
    color: '#002d5e',
    fontSize: 12
  },
  arrowContainer: {

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

module.exports = ServiceOptions;
