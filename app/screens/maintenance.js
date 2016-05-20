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
} from 'react-native';

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

    constructor(props){
      super(props);
    }

    _navigateToApprovals(){
      this.props.navigator.push({
        ident: 'Approvals',
      })
    }

    render() {
        return (
          <View>
            <TopBar />
            <CarBar />
            <View>
              <Image
                resizeMode="contain"
                source={require('../../images/bg-home.png')}
                style={styles.canvas} />

              <ApprovalRequest />

              <View style={styles.nextService}><Text style={styles.nextServiceText}>NEXT SERVICE 65K MILES</Text></View>
              <View style={styles.serviceListHd}>
                <Text style={styles.serviceItemHd}>SERVICE</Text>
                <Text style={styles.serviceRangeHd}>FAIR PRICE RANGE</Text>
                <Text style={styles.servicePriceHd}>PRICE</Text>
              </View>
              <View style={styles.nextServiceList}>
                <Text style={styles.serviceItem}>Tire Rotation</Text>
                <Text style={styles.serviceRange}>$30-$50</Text>
                <Text style={styles.servicePrice}>$45</Text>
              </View>
              <View style={styles.nextServiceList}>
                <Text style={styles.serviceItem}>Brake Pads</Text>
                <Text style={styles.serviceRange}>$40-$60</Text>
                <Text style={styles.servicePrice}>$50</Text>
              </View>
              <View style={styles.nextServiceList}>
                <Text style={styles.serviceItem}>Air Filter</Text>
                <Text style={styles.serviceRange}>$30-$50</Text>
                <Text style={styles.servicePrice}>$35</Text>
              </View>
              <View style={styles.totalPrice}><Text style={styles.totalPriceText}>Total Price: $130</Text></View>

              <View style={styles.bookitRow}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-bookit.png')}
                    style={styles.btnBookIt} />
                </TouchableOpacity>
                <TouchableOpacity onPress={(event) => this._navigateToApprovals()}>
                  <Image
                    source={require('../../images/btn-details.png')}
                    style={styles.btnDetails} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  nextService: {
    backgroundColor: '#F49D11',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  nextServiceText: {
    color: 'white',
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  totalPriceText: {
    color: '#11325F',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceListHd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  serviceItemHd: {
    color: '#F49D11',
    fontSize: 12,
    width: 85,
  },
  serviceRangeHd: {
    color: '#F49D11',
    fontSize: 12,
    paddingLeft: 40,
    paddingRight: 40,
  },
  servicePriceHd: {
    color: '#F49D11',
    fontSize: 12,
  },
  nextServiceList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  serviceItem: {
    width: 120,
  },
  serviceRange: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  servicePrice: {
    fontWeight: 'bold',
  },
  bookitRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 25,
  },
  btnBookIt: {
    width: 158,
    height: 35,
    marginRight: 3,
  },
  btnDetails: {
    width: 158,
    height: 35,
    marginLeft: 3,
  },
});

module.exports = Maintenance;
