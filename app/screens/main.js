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

class Main extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} showMenu />
            <CarBar />
            <ScrollView>
            <View>
              <Image
                source={require('../../images/img-vehicle.png')}
                style={styles.vehicle} />

              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Maintenance' })}>
                <View style={styles.btnRow}>
                  <Image
                    source={require('../../images/icon-schedule.png')}
                    style={styles.icon} />
                  <Text style={styles.btnText}>Schedule Maintenance</Text>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>
                      <Image
                        source={require('../../images/arrow-blue.png')}
                        style={styles.arrowBlue} />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Approvals' })}>
                <View style={styles.btnRow}>
                  <Image
                    source={require('../../images/icon-check.png')}
                    style={styles.icon} />
                  <Text style={styles.btnText}>Services To Approve</Text>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>
                      <Image
                        source={require('../../images/arrow-blue.png')}
                        style={styles.arrowBlue} />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
            </ScrollView>
          </View>
        );
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
    marginBottom: 12,
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#11325F',
    borderWidth: 1,
    backgroundColor: '#FFF',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  btnText: {
    flex: 3,
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
});

module.exports = Main;
