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
  ScrollView
} from 'react-native';

class MaintenanceGroupDetail extends Component {
  constructor(props) {
    super(props);
    var passProps = props.navigator._navigationContext._currentRoute.passProps || {};
    this.state = {
      services: passProps.services || []
    };
  }

  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView style={styles.maintenanceList}>
          <Text style={styles.textHd}>Services</Text>
          {this.state.services.map((service, i) =>
            <Service key={i} service={service} nav={this.props.navigator} />)}
        </ScrollView>
      </View>
    );
  }
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  openDetail: function() {
    this.props.nav.push({
      indent: 'MaintenanceDetail',
      passProps: {
        category:this.props.service.id,
        miles:this.props.miles,
        name:this.props.service.name,
        lowCost:this.props.service.low_fair_cost,
        highCost:this.props.service.high_fair_cost,
        desc:this.props.service.required_skills_description,
        time:this.props.service.base_labor_time,
        timeInterval:this.props.service.labor_time_interval,
        intervalMile:this.props.service.interval_mile,
        intervalMonth:this.props.service.interval_month,
        partLowCost:this.props.service.part_low_cost,
        position:this.props.service.position,
        parts:this.props.service.motor_vehicle_service_parts
      }
    });
  },
  render: function() {
    return (
      <View>
        <TouchableOpacity
          style={styles.maintenanceRow}
          onPress={() => this.openDetail()}>
          <Text style={styles.maintenanceItem}>{this.props.service.name} {this.props.service.position}</Text>

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
      </View>
    );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maintenanceList: {
    flex: 1,
    paddingHorizontal: 10
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
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    marginBottom: 3,
  },
  maintenanceItem: {
    flex: 5,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
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
  }
});

module.exports = MaintenanceGroupDetail;
