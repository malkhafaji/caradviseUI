'use strict';

import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { signUp } from '../actions/user';

var fldWidth = Dimensions.get('window').width - 40;
var firstNameWidth = fldWidth / 2 - 15;
var lastNameWidth = fldWidth / 2;

class GetStarted extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        cellPhone: ''
      };
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn)
        this.props.navigator.push({ indent: 'Step2' });
    }

    render() {
        return (
          <ScrollView>
          <View style={styles.formContainer}>
            <Image
              resizeMode='cover'
              source={require('../../images/bg-login.png')}
              style={styles.bgSteps} />

            <View>
              <Image
                resizeMode="contain"
                source={require('../../images/logo.png')}
                style={styles.logo} />
            </View>

            <View>
              <Text style={styles.textStep}>Enter your account details to get started.</Text>
            </View>

            <View style={styles.fields}>
              <View style={styles.nameRow}>
                <TextInput
                  style={styles.firstNameFld}
                  placeholderTextColor={'#666'}
                  placeholder={'First Name'}
                  autoCorrect={false}
                  autoFocus
                  value={this.state.firstName}
                  onChangeText={firstName => this.setState({ firstName })} />
                <TextInput
                  style={styles.lastNameFld}
                  placeholderTextColor={'#666'}
                  placeholder={'Last Name'}
                  autoCorrect={false}
                  value={this.state.lastName}
                  onChangeText={lastName => this.setState({ lastName })} />
              </View>
              <TextInput
                style={styles.textFld}
                keyboardType={'email-address'}
                placeholderTextColor={'#666'}
                placeholder={'Email'}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.email}
                onChangeText={email => this.setState({ email })} />
              <TextInput
                style={styles.textFld}
                keyboardType={'phone-pad'}
                placeholderTextColor={'#666'}
                placeholder={'Phone Number'}
                value={this.state.cellPhone}
                onChangeText={cellPhone => this.setState({ cellPhone })} />
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Password'}
                secureTextEntry
                value={this.state.password}
                onChangeText={password => this.setState({ password })} />
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Confirm Password'}
                secureTextEntry
                value={this.state.confirmPassword}
                onChangeText={confirmPassword => this.setState({ confirmPassword })} />
              <TouchableOpacity
                disabled={this.props.isLoading}
                onPress={() => {
                  this.props.signUp({
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    cellPhone: this.state.cellPhone
                  });
                }}
              >
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-next.png')}
                  style={styles.btnNext} />
              </TouchableOpacity>
            </View>

          </View>
          </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bgSteps: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: 750,
  },
  logo: {
    width: 80,
    marginTop: 30,
  },
  textStep: {
    marginTop: 50,
    color: '#FFF',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  fields: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  firstNameFld: {
    height: 40,
    marginTop: 15,
    width: firstNameWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
    marginRight: 15,
  },
  lastNameFld: {
    height: 40,
    marginTop: 15,
    width: lastNameWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  btnNext: {
    width: 120,
    marginTop: 10,
  },
  nameRow: {
    flexDirection: 'row',
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading,
    error: user.error
  };
}

module.exports = connect(mapStateToProps, { signUp })(GetStarted);
