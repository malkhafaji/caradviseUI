'use strict';
var TopBar = require('../../components/main/topBar');

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
import { connect } from 'react-redux';

var width = Dimensions.get('window').width - 20;

class Coupon extends Component {

  constructor(props) {
    super(props);
    var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
    this.state = {
      starCount: 0,
      //orderId: passProps.orderId
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />

            <ScrollView
              style={styles.scrollView}>
            <View style={styles.container}>

              <Text style={styles.textCouponHd}>Do you have a coupon?</Text>
              <View>
                <Image
                  source={require('../../../images/icon-coupon.png')}
                  style={styles.coupon} />
              </View>
              <Text style={styles.textCoupon}>If so, please present it to the shop{'\n'}before you proceed to payment.</Text>
              <View>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next-med.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>
            </ScrollView>
          </View>
        );
    }

  submitRating = () => {
    if (this.state.orderId && this.props.authentication_token) {
      postJSON(
        RATE_ORDER_URL.replace('?', this.state.orderId),
        { rating: this.state.starCount, option_selected: 'none' },
        { 'Authorization': this.props.authentication_token }
      )
    }

    this.props.navigator.popToTop();
  }

}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    flexDirection: 'column',
    width: width,
    alignItems: 'center',
    paddingBottom: 50,
  },
  textCouponHd: {
    fontSize: 24,
    color: '#002d5e',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  textCoupon: {
    fontSize: 18,
    color: '#002d5e',
    textAlign: 'center',
    marginBottom: 20
  },
  coupon: {
    width: 75,
    height: 75,
    marginBottom: 30
  },
  btnNext: {
    width: 190,
    marginTop: 10,
    marginLeft: 5,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    authentication_token: user.authentication_token
  };
}

module.exports = connect(mapStateToProps)(Coupon);
