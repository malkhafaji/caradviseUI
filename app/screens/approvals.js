'use strict';
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

class Approvals extends Component {

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
            <CarBar />
            <View style={styles.approvalsContainer}>
              <Text style={styles.textHd}>Approved Services</Text>

              <View style={styles.approvedServicesList}>
                <Text style={styles.approvedServiceItem}>Tire Rotation</Text>
                <Text style={styles.approvedServicePrice}>$45</Text>
              </View>
              <View style={styles.approvedServicesList}>
                <Text style={styles.approvedServiceItem}>Brake Pads</Text>
                <Text style={styles.approvedServicePrice}>$50</Text>
              </View>
              <View style={styles.approvedServicesList}>
                <Text style={styles.approvedServiceItem}>Air Filter</Text>
                <Text style={styles.approvedServicePrice}>$35</Text>
              </View>

              <Text style={styles.textHd}>New Services To Approve</Text>

              <View style={styles.newServicesList}>

                <TouchableOpacity
                  underlayColor='#dddddd'>
                  <View style={styles.newServicesRow}>
                    <Image
                      source={require('../../images/icon-question.png')}
                      style={styles.iconQuestion} />
                    <Text style={styles.newServiceItem}>Oil Change</Text>

                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text>$50</Text>
                      </View>
                    </View>

                    <View style={styles.newServicePriceContainer}>
                      <Text style={styles.newServicePriceHd}>PRICE</Text>
                      <Text style={styles.newServicePrice}>$45</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  underlayColor='#dddddd'>
                  <View style={styles.newServicesRow}>
                    <Image
                      source={require('../../images/icon-question.png')}
                      style={styles.iconQuestion} />
                    <Text style={styles.newServiceItem}>Wheel Alignment</Text>

                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text>$30</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text>$50</Text>
                      </View>
                    </View>

                    <View style={styles.newServicePriceContainer}>
                      <Text style={styles.newServicePriceHd}>PRICE</Text>
                      <Text style={styles.newServicePrice}>$45</Text>
                    </View>
                  </View>
                </TouchableOpacity>

              </View>

              <View>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.newTotal}>
                <Text style={styles.newTotalText}>New Total: $210.00</Text>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-approve.png')}
                    style={styles.btnApprove} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-decline.png')}
                    style={styles.btnDecline} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  approvalsContainer: {
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: '#666666',
  },
  approvedServicesList: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: 360,
    padding: 10,
    marginBottom: 2,
  },
  approvedServiceItem: {
    width: 280,
    color: '#11325F',
  },
  approvedServicePrice: {
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
    color: '#11325F',
  },
  newServicesList: {
    flexDirection: 'column',
  },
  newServicesRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: 360,
    marginBottom: 2,
  },
  iconQuestion: {
    width: 16,
    height: 16,
    marginLeft: 10,
    marginTop: 18,
    marginRight: 10,
  },
  newServiceItem: {
    width: 140,
    marginTop: 18,
    fontWeight: 'bold',
    color: '#11325F',
  },
  fairPriceContainer: {
    width: 100,
    margin: 10,
    alignItems: 'center',
  },
  newServicePriceContainer: {
    width: 55,
    marginTop: 10,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  newServiceRange: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#F49D11',
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
  newServicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  btnAddService: {
    width: 110,
    height: 10,
    margin: 20,
  },
  newTotal: {
    flexDirection: 'row',
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    marginBottom: 20,
  },
  newTotalText: {
    width: 330,
    fontSize: 16,
    fontWeight: 'bold',
    margin: 15,
    color: '#11325F',
    textAlign: 'center',
  },
  approveDecline: {
    flexDirection: 'row',
  },
  btnApprove: {
    width: 158,
    height: 35,
    marginRight: 3,
  },
  btnDecline: {
    width: 158,
    height: 35,
    marginLeft: 3,
  },
});

module.exports = Approvals;
