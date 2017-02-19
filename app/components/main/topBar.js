'use strict';

import React from 'react';
import {
    Text,
    View,
    Component,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

class topBar extends Component {
  render() {
    return (
      <View style={styles.topContainer}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            {this.props.showMenu ? this._renderBurger() : this._renderBack()}
          </View>
          <View style={styles.topBarMid}>
            <Image
              resizeMode="contain"
              source={require('../../../images/logo-topbar.png')}
              style={styles.logoTop} />
          </View>
          <View style={styles.topBarRight}></View>
        </View>
      </View>
      );
  }

  _renderBack() {
    if (!this.props.navigator)
      return null;

    return (
      <TouchableOpacity onPress={() => {
        const routes = this.props.navigator.getCurrentRoutes();
        const prevRoute = routes[routes.length - 2];

        if (prevRoute && prevRoute.indent === 'Main')
          this.props.navigator.replacePreviousAndPop({ indent: 'Main' });
        else
          this.props.navigator.pop();
      }}>
        <Image
          resizeMode="contain"
          source={require('../../../images/btn-back.png')}
          style={styles.burger} />
      </TouchableOpacity>
    );
  }

  _renderBurger() {
    return (
      <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'SideMenu' })}>
        <Image
          resizeMode="contain"
          source={require('../../../images/icon-burger.png')}
          style={styles.burger} />
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#002d5e',
    alignItems: 'center',
  },
  topBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 45,
  },
  logoTop: {
    width: 80,
  },
  burger: {
    width: 15,
    marginLeft: 20,
  },
  topBarLeft: {
    flex: 3,
  },
  topBarMid: {
    flex: 3,
    alignItems: 'center',
  },
  topBarRight: {
    flex: 3,
  },
});

module.exports = topBar;
