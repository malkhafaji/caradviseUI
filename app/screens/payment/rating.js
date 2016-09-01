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

import StarRating from 'react-native-star-rating';

var width = Dimensions.get('window').width - 20;

class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starCount: 0
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
                <Text>Your opinion is important to us. Please rate your overall shop experience from 1-5 stars.</Text>
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
                <TouchableOpacity onPress={() => this.props.navigator.popToTop()}>
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

module.exports = Rating;
