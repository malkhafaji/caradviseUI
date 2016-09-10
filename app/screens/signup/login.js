'use strict';

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import { connect } from 'react-redux';
import { signIn } from '../../actions/user';

var fldWidth = Dimensions.get('window').width - 40;

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {
          email: { name: 'Email', value: '', invalid: false, validators:['_isPresent'] },
          password: { name: 'Password', value: '', invalid: false, validators:['_isPresent'] }
        }
      };
    }

    componentWillReceiveProps({ error }) {
      if (error)
        Alert.alert('Error', error);
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn)
        this.props.navigator.resetTo({ indent: 'Main' });
    }

    render() {
        return (
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
          <TopBar navigator={this.props.navigator} />
          <View style={styles.formContainer}>
            <View style={styles.emailContainer}>
              <TextInput
                ref='email'
                style={[styles.fldEmail, this.state.fields.email.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.email.name}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus
                value={this.state.fields.email.value}
                onChangeText={value => this._onFieldChange('email', value)} />
            </View>
            <View style={styles.pwdContainer}>
              <TextInput
                ref='password'
                style={[styles.fldPwd, this.state.fields.password.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.password.name}
                secureTextEntry
                value={this.state.fields.password.value}
                onChangeText={value => this._onFieldChange('password', value)} />
            </View>
            <TouchableOpacity
              disabled={this.props.isLoading}
              onPress={() => {
                this._validateFields(() => {
                  this.props.signIn({
                    email: this.state.fields.email.value,
                    password: this.state.fields.password.value
                  })
                });
              }}
            >
              <Image
                resizeMode='contain'
                source={require('../../../images/btn-submit-login.png')}
                style={styles.btnLogin} />
            </TouchableOpacity>

          </View>
          </ScrollView>
        );
    }

    _isPresent(value) {
      return !!value;
    }

    _setAndValidateField(key, value) {
      let field = this.state.fields[key];
      let validators = field.validators || [];
      let invalid = validators.some(validator => !this[validator](value));

      return { ...field, value, invalid };
    }

    _onFieldChange(key, value) {
      this.setState({
        fields: {
          ...(this.state.fields),
          [key]: this._setAndValidateField(key, value.trim())
        }
      });
    }

    _validateFields(callback) {
      let fields = {};
      let firstInvalidKey = null;

      Object.keys(this.state.fields).forEach(key => {
        let field = this.state.fields[key];
        fields[key] = field = this._setAndValidateField(key, field.value);
        if (!firstInvalidKey && field.invalid)
          firstInvalidKey = key;
      });

      this.setState({ fields }, () => {
        if (firstInvalidKey)
          this.refs[firstInvalidKey].focus();
        else if (callback)
          callback();
      });
    }
}

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 300,
  },
  bgLogin: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: 750,
  },
  logo: {
    width: 180,
    height: 29,
    marginTop: 80,
    marginBottom: 80,
  },
  emailContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: '#FFF',
    marginTop: 50,
  },
  pwdContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: '#FFF',
  },
  fldEmail: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
  },
  fldPwd: {
    height: 40,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
  },
  btnLogin: {
    width: 190,
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
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

module.exports = connect(mapStateToProps, { signIn })(Login);
