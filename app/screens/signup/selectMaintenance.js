'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Component
} from 'react-native';
import TopBar from '../../components/main/topBar.js';

var width = Dimensions.get('window').width - 20;

class SelectMaintenance extends Component {
  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Based on your mileage, the following maintenance is highly recommended. Please select the work you would like to get done.</Text>
          <View style={styles.maintenanceHd}>
            <Text style={styles.maintenanceTxt}>45000 MILES</Text>
          </View>
          <TouchableOpacity style={styles.maintenanceItem}>
            <Image
              resizeMode='contain'
              source={require('../../../images/checkbox-on.png')}
              style={styles.checkboxOn} />
            <Text style={styles.maintenanceName}>Tire Rotation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.maintenanceItem}>
            <Image
              resizeMode='contain'
              source={require('../../../images/checkbox-off.png')}
              style={styles.checkboxOff} />
            <Text style={styles.maintenanceName}>Cabin Air Filter Replacement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.maintenanceItem}>
            <Image
              resizeMode='contain'
              source={require('../../../images/checkbox-off.png')}
              style={styles.checkboxOff} />
            <Text style={styles.maintenanceName}>Drive Belt Replacement</Text>
          </TouchableOpacity>

          <View style={styles.btnCol}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'VehicleDetails' })}>
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
  }
});

module.exports = SelectMaintenance;
