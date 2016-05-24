'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');
var ApprovalRequest = require('../components/main/approvalRequest');


import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

class Main extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View>
              <Image
                source={require('../../images/img-vehicle.png')}
                style={styles.vehicle} />

              <TouchableOpacity>
                <View style={styles.btnRow}>
                  <Text style={styles.btnText}>Schedule Maintenance</Text>
                  <Image
                    source={require('../../images/arrow-blue.png')}
                    style={styles.arrowBlue} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.btnRow}>
                  <Text style={styles.btnText}>Services To Approve</Text>
                  <Image
                    source={require('../../images/arrow-blue.png')}
                    style={styles.arrowBlue} />
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
  vehicle: {
    height: 250,
    width: Dimensions.get('window').width,
    marginTop: 1,
    marginBottom: 10,
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#E0483E',
    backgroundColor: '#EFEFEF',
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  btnText: {
    width: 285,
    color: '#11325F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowBlue: {
    width: 8,
    height: 13,
    marginTop: 2,
    marginLeft: 30,
  },
});

module.exports = Main;
