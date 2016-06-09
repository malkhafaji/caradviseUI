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

class Saved extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.savedContainer}>

              <Text style={styles.textHd}>Saved Maintenance</Text>

              <View style={styles.savedList}>

                  <View style={styles.savedRow}>
                    <Text style={styles.savedItem}>Brake Pads</Text>

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

                    <View style={styles.savedPriceContainer}>
                      <Text style={styles.savedPriceHd}>PRICE</Text>
                      <Text style={styles.savedPrice}>$50</Text>
                    </View>
                  </View>

                  <View style={styles.savedRow}>
                    <Text style={styles.savedItem}>Air Filter</Text>

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

                    <View style={styles.savedPriceContainer}>
                      <Text style={styles.savedPriceHd}>PRICE</Text>
                      <Text style={styles.savedPrice}>$35</Text>
                    </View>
                  </View>

              </View>

              {/*<View>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
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
              </View>*/}

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
  savedContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  savedList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  savedRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    marginBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  savedItem: {
    flex: 2,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#11325F',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  savedPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  savedPriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  savedPrice: {
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  savedRange: {
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
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 3,
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
    width: 150,
    height: 30,
  },
  btnSave: {
    width: 150,
    height: 30,
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginTop: 18,
    marginBottom: 20,
  },
  newTotal: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
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

module.exports = Saved;
