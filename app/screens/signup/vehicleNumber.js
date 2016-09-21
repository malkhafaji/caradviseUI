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
  ScrollView,
  Alert
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import { connect } from 'react-redux';
import { signUp } from '../../actions/user';
import cache from '../../utils/cache';
import storage from '../../utils/storage';

var fldWidth = Dimensions.get('window').width - 40;

class VehicleNumber extends Component {
    constructor(props) {
      super(props);

      storage.get('caradvise:pushid').then(value => {
         if (value) {
           this.state.pushid = value;
         }
       });

      this.state = {
        isLoading: false,
        fields: Object.assign({
          vehicleNumber: { name: 'Vehicle Number', value: '', invalid: false }
        }, cache.get('step2a-fields') || {}),
        pushid: ""
      };
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        cache.remove('step1-fields');
        cache.remove('step2a-fields');
        cache.remove('step2b-fields');
        cache.remove('step3-fields');
        cache.remove('step4-fields');
        this.props.navigator.resetTo({ indent: 'Main' });
      }
    }

    render() {
        return (
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
          <TopBar navigator={this.props.navigator} />
          <View style={styles.formContainer}>

            <View>
              <Text style={styles.textStep}>The shop will provide you with your Vehicle Number. Enter it below:</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                autoCorrect={false}
                autoCapitalize="characters"
                style={[styles.textFld, this.state.fields.vehicleNumber.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.vehicleNumber.name}
                value={this.state.fields.vehicleNumber.value}
                onChangeText={value => this._onFieldChange('vehicleNumber', value)} />
              <View style={styles.btnRow}>
                <TouchableOpacity disabled={this.props.isLoading || this.state.isLoading} onPress={() => this._onClickNext()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          </ScrollView>
        );
    }

    _onFieldChange(key, value) {
      let field = this.state.fields[key];
      this.setState({
        fields: {
          ...(this.state.fields),
          [key]: { ...field, value: value.trim(), invalid: false }
        }
      }, () => cache.set('step2a-fields', this.state.fields));
    }

    _onClickNext() {
      if (this.state.fields.vehicleNumber.value) {
        let step1Fields = cache.get('step1-fields');
        this.props.signUp({
          firstName: step1Fields.firstName.value,
          lastName: step1Fields.lastName.value,
          email: step1Fields.email.value,
          cellPhone: step1Fields.cellPhone.value,
          password: step1Fields.password.value,
          vehicleNumber: this.state.fields.vehicleNumber.value,
          pushid: this.state.pushid,
        });
      } else {
        alert("A car care professional will provide you with your Vehicle Number.")
        //this.props.navigator.push({ indent: 'Step2b' });
      }
    }
}

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#000',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 400,
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
    width: 180,
    height: 29,
    marginTop: 50,
  },
  textStep: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  textOr: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 15,
  },
  fields: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 21,
    paddingVertical: 0,
  },
  btnBack: {
    width: 120,
    marginTop: 10,
    marginRight: 5,
  },
  btnNext: {
    width: 120,
    marginTop: 10,
    marginLeft: 5,
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  },
  btnRow: {
    flexDirection: 'row',
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading
  };
}

module.exports = connect(mapStateToProps, { signUp })(VehicleNumber);
