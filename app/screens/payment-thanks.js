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
  TextInput,
} from 'react-native';

var width = Dimensions.get('window').width - 20;

class PaymentThanks extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.thanksContainer}>


              <Text style={styles.textHd}>Thank you for your purchase!</Text>
              <Text style={styles.textHd}>Your feedback is very important to us. Please rate your experience from 1 to 5 stars.</Text>

              <View style={styles.starRow}>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/icon-star-off.png')}
                    style={styles.star} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/icon-star-off.png')}
                    style={styles.star} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/icon-star-off.png')}
                    style={styles.star} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/icon-star-off.png')}
                    style={styles.star} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/icon-star-off.png')}
                    style={styles.star} />
                </TouchableOpacity>
              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Main' })}>
                  <Image
                    source={require('../../images/btn-done.png')}
                    style={styles.btnDone} />
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
  thanksContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  star: {
    width: 38,
    height: 37,
  },
  btnDone: {
    width: 150,
    height: 30,
    marginTop: 20,
  },
});

module.exports = PaymentThanks;
