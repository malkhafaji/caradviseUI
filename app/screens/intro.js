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
        <Image source={require('../../images/bg-step1.png')} style={styles.page}>
          {this._renderTopSection()}
          <View style={styles.section}>
            <Text style={styles.text}>Bringing <Text style={styles.bold}>TRUST</Text> & <Text style={styles.bold}>CONFIDENCE</Text> to maintain and repair</Text>
            <Image source={require('../../images/icon-step1.png')} style={styles.step} />
          </View>
        </Image>
        <Image source={require('../../images/bg-step2.png')} style={styles.page}>
          {this._renderTopSection()}
          <View style={styles.section}>
            <Text style={[styles.text, styles.text2]}><Text style={styles.bold}>APPROVE</Text> maintenance/repair work <Text style={styles.bold}>WITH CONFIDENCE</Text></Text>
            <TouchableOpacity onPress={() => this.props.navigator.replacePreviousAndPop({ indent: 'Step1' })}>
              <Image source={require('../../images/btn-intro-getstarted.png')} style={styles.getStarted} />
            </TouchableOpacity>
            <Image source={require('../../images/icon-step2.png')} style={styles.step} />
          </View>
        </Image>
      </ScrollView>
    );
  }

  _renderTopSection() {
    return (
      <View style={styles.section}>
        <TouchableOpacity onPress={() => this.props.navigator.replacePreviousAndPop({ indent: 'GetStarted' })} style={styles.closeButton}>
          <Image source={require('../../images/icon-close.png')} style={styles.close} />
        </TouchableOpacity>
        <Image source={require('../../images/logo-intro.png')} style={styles.logo} />
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
    backgroundColor: 'red',
    width: Dimensions.get('window').width,
    height: null,
    resizeMode: 'cover',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  closeButton: {
    alignSelf: 'flex-end'
  },
  close: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  logo: {
    width: 180,
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
    marginBottom: 35,
    resizeMode: 'contain'
  },
  step: {
    height: 12,
    resizeMode: 'contain'
  }
});

module.exports = Intro;
