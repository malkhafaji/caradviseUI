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
  ScrollView
} from 'react-native';

var width = Dimensions.get('window').width - 20;

class Maintenance extends Component {

    _renderScene(route, navigator) {
      var globalNavigatorProps = {navigator}

      switch(route.indent) {
        case 'Main':
          return (
            <Main {...globalNavigatorProps} />
          )
        case 'Approvals':
          return (
            <Approvals {...globalNavigatorProps} />
          )
        default:
          return (
            <Text>EPIC FAIL</Text>
          )
      }
    }

    render() {
        return (
          <ScrollView>
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.maintenanceContainer}>

              <Text style={styles.textHd}>Maintenance</Text>

              <View style={styles.maintenanceRow}>
                <Text style={styles.maintenanceItem}>Oil Change</Text>
                <Text style={styles.maintenancePrice}>$45</Text>
              </View>
              <View style={styles.maintenanceRow}>
                <Text style={styles.maintenanceItem}>Tire Rotation</Text>
                <Text style={styles.maintenancePrice}>$30</Text>
              </View>

              <View style={styles.total}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalPrice}>$45</Text>
              </View>

              <View>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Billing' })}>
                  <Image
                    source={require('../../images/btn-bookit-big.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
          </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maintenanceContainer: {
    alignItems: 'center',
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 1,
  },
  maintenanceItem: {
    flex: 3,
    color: '#11325F',
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
});

module.exports = Maintenance;
