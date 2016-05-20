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
  ScrollView,
  Dimensions,
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
            <TopBar />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.approvalsContainer}>

              <Text style={styles.textHd}>Services To Approve</Text>

              <View style={styles.newServicesList}>

                  <View style={styles.newServicesRow}>
                    <Text style={styles.newServiceItem}>Brake Pads</Text>

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
                      <Text style={styles.newServicePrice}>$50</Text>
                    </View>
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-approve-blue.png')}
                        style={styles.btnApprove} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-save.png')}
                        style={styles.btnSave} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.newServicesRow}>
                    <Text style={styles.newServiceItem}>Air Filter</Text>

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
                      <Text style={styles.newServicePrice}>$35</Text>
                    </View>
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-approve-blue.png')}
                        style={styles.btnApprove} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-save.png')}
                        style={styles.btnSave} />
                    </TouchableOpacity>
                  </View>

              </View>

              <Text style={styles.textHd}>Approved Services</Text>

              <View style={styles.approvedRow}>
                <Text style={styles.approvedItem}>Oil Change</Text>
                <Text style={styles.approvedPrice}>$45</Text>
              </View>

              <View style={styles.newTotal}>
                <Text style={styles.newTotalText}>Total:</Text>
                <Text style={styles.newTotalPrice}>$45</Text>
              </View>

              <View>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-checkout.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>

            </View>
            </ScrollView>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  approvalsContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: '#666666',
  },
  newServicesList: {
    flexDirection: 'column',
  },
  newServicesRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: 360,
  },
  newServiceItem: {
    width: 190,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#11325F',
    alignItems: 'center',
  },
  fairPriceContainer: {
    width: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  newServicePriceContainer: {
    width: 45,
    marginTop: 10,
    marginRight: 5,
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
  btnRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 3,
  },
  btnApprove: {
    width: 169,
    height: 34,
    marginLeft: 8,
    marginRight: 6,
  },
  btnSave: {
    width: 169,
    height: 34,
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  approvedRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: 360,
    padding: 10,
  },
  approvedItem: {
    width: 280,
    color: '#11325F',
  },
  approvedPrice: {
    width: 60,
    textAlign: 'right',
    color: '#11325F',
  },
  newTotal: {
    flexDirection: 'row',
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  newTotalText: {
    width: 280,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  newTotalPrice: {
    width: 60,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnCheckout: {
    width: 350,
    height: 46,
  },
});

module.exports = Approvals;
