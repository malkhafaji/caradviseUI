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
import StarRating from 'react-native-star-rating';
import { postJSON } from '../../utils/fetch';

var width = Dimensions.get('window').width - 20;

var RATE_ORDER_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/orders/?/rate_order';

class Rating extends Component {

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

              <Text style={styles.textHd}>Rate Your Experience</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingTxt}>Your opinion is important to us. Please rate your overall shop experience from 1-5 stars.</Text>
                <View style={styles.rating}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starColor="#f8991d"
                    emptyStarColor="#f8991d"
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={this.submitRating}>
                  <Image
                    source={require('../../../images/btn-done.png')}
                    style={styles.btnDone} />
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
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  ratingContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  ratingTxt: {
    color: '#002d5e',
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  rating: {
    marginTop: 40,
    width: 250,
  },
  btnDone: {
    width: 135,
    height: 30,
    marginTop: 40,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    authentication_token: user.authentication_token
  };
}

module.exports = connect(mapStateToProps)(Rating);
