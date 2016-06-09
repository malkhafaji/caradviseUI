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

var width = Dimensions.get('window').width - 20;

class Approvals extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.approvalsContainer}>

              <Text style={styles.textHd}>Services To Approve</Text>

              <View style={styles.newServicesList}>

                  <View style={styles.newServicesRow}>
                    <Text style={styles.newServiceItem}>Brake Pads</Text>

                    <View style={styles.newServicePriceContainer}>
                      <Text style={styles.newServicePriceHd}>PRICE</Text>
                      <Text style={styles.newServicePrice}>$50</Text>
                    </View>
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      style={styles.btnLeft}
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-save.png')}
                        style={styles.btnSave} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnRight}
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-approve-orange.png')}
                        style={styles.btnApprove} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.newServicesRow}>
                    <Text style={styles.newServiceItem}>Air Filter</Text>

                    <View style={styles.newServicePriceContainer}>
                      <Text style={styles.newServicePriceHd}>PRICE</Text>
                      <Text style={styles.newServicePrice}>$35</Text>
                    </View>
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      style={styles.btnLeft}
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-save.png')}
                        style={styles.btnSave} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnRight}
                      underlayColor='#dddddd'>
                      <Image
                        source={require('../../images/btn-approve-orange.png')}
                        style={styles.btnApprove} />
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
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
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
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: width,
    height: Dimensions.get('window').height,
    marginLeft: 10,
    marginRight: 10,
  },
  approvalsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  newServicesList: {
    flexDirection: 'column',
    width: width,
  },
  newServicesRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
  },
  newServiceItem: {
    flex: 3,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#11325F',
    alignItems: 'center',
  },
  newServicePriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 5,
  },
  btnLeft: {
    flex: 2,
    alignItems: 'center',
  },
  btnRight: {
    flex: 2,
    alignItems: 'center',
  },
  btnApprove: {
    width: 145,
    height: 29,
  },
  btnSave: {
    width: 145,
    height: 29,
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  approvedRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 1,
  },
  approvedItem: {
    flex: 3,
    color: '#11325F',
  },
  approvedPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
  },
  newTotal: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  newTotalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  newTotalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
});

module.exports = Approvals;
