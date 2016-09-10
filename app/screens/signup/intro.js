'use strict';

import React from 'react';
import {
  Component,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

class Intro extends Component {
  render() {
    return (
      <ScrollView
        style={styles.base}
        contentContainerStyle={styles.container}
        horizontal
        pagingEnabled
        directionalLockEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../../../images/intro-step1.png')} style={styles.page}>
          {this._renderTopSection()}
        </Image>
        <Image source={require('../../../images/intro-step2.png')} style={styles.page}>
          {this._renderTopSection()}
        </Image>
        <Image source={require('../../../images/intro-step3.png')} style={styles.page}>
          {this._renderTopSection()}
        </Image>
        <Image source={require('../../../images/intro-step4.png')} style={styles.page}>
          {this._renderTopSection()}
        </Image>
        <TouchableOpacity onPress={() => {
          this.props.navigator.replacePreviousAndPop({ indent: this.props.isLoggedIn ? 'Main' : 'Step1' });
        }}>
          <Image source={require('../../../images/intro-step5.png')} style={styles.page}>
            {this._renderTopSection()}
          </Image>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  _renderTopSection() {
    return (
      <View style={styles.section}>
        <TouchableOpacity onPress={() => this.props.navigator.pop()} style={styles.closeButton}>
          <Image source={require('../../../images/icon-close-blue.png')} style={styles.close} />
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  page: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: null,
    resizeMode: 'cover',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionBottom: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 200,
    height: 50,
  },
  closeButton: {
    alignSelf: 'flex-end'
  },
  close: {
    width: 15,
    height: 15,
    marginTop: 5,
    resizeMode: 'contain'
  },
  logo: {
    width: 200,
    height: 35,
    resizeMode: 'cover',
    marginTop: 65
  },
  text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 26,
    marginBottom: 100,
    fontFamily: 'RobotoCondensed-Light'
  },
  text2: {
    marginBottom: 35
  },
  bold: {
    fontWeight: 'bold'
  },
  getStarted: {
    width: 200,
    resizeMode: 'contain',
  },
  step: {
    height: 12,
    resizeMode: 'contain'
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return { isLoggedIn: !!user.authentication_token };
}

module.exports = connect(mapStateToProps)(Intro);
