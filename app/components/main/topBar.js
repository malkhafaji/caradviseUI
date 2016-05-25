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
    return (
      <TouchableOpacity onPress={() => {
        var routes = this.props.navigator.getCurrentRoutes().reverse();
        var main = routes.find(({ indent }) => indent === 'Main');
        main ? this.props.navigator.popToRoute(main) : this.props.navigator.pop();
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
    marginTop: 2,
    backgroundColor: '#11325F',
    alignItems: 'center',
  },
  topBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 65,
  },
  logoTop: {
    width: 80,
    marginTop: 20,
  },
  burger: {
    width: 15,
    marginTop: 20,
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
