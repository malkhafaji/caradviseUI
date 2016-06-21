'use strict';

import React from 'react';
import {
  Component,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { signOut } from '../actions/user';

class SideMenu extends Component {
  componentWillReceiveProps({ error }) {
    if (error)
      Alert.alert('Error', error);
  }

  componentDidUpdate() {
    if (this.props.isLoggedOut)
      this.props.navigator.resetTo({ indent: 'GetStarted' });
  }

  render() {
    return (
      <View style={styles.base}>
        <View style={styles.menu}>
          {this._renderItem({ text: 'SETTINGS', indent: 'Settings' })}
          {this._renderItem({ text: 'SAVED MAINTENANCE', indent:  'Saved' })}
          {this._renderItem({ text: 'VIEW INTRO', indent: 'Intro' })}
          <TouchableOpacity
            style={styles.item}
            disabled={this.props.isLoading}
            onPress={this.props.signOut}
          >
            <Text style={styles.text}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.toggle} onPress={() => this.props.navigator.pop()}>
          <Image
            resizeMode="contain"
            source={require('../../images/icon-burger.png')}
            style={styles.burger} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderItem({ text, indent }) {
    return (
      <TouchableOpacity style={styles.item} onPress={() => {
        var routes = this.props.navigator.getCurrentRoutes();
        routes.splice(-1, 1); // remove current route
        this.props.navigator.immediatelyResetRouteStack(routes);
        this.props.navigator.push({ indent });
      }}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row'
  },
  menu: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff'
  },
  item: {
    marginTop: -1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderColor: '#999',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  text: {
    fontSize: 16,
    letterSpacing: 1,
    color: '#555'
  },
  toggle: {
    backgroundColor: '#006699'
  },
  burger: {
    width: 15,
    margin: 20,
    marginTop: 15
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedOut: !user.authentication_token,
    isLoading: !!user.loading,
    error: user.error
  };
}

module.exports = connect(mapStateToProps, { signOut })(SideMenu);
