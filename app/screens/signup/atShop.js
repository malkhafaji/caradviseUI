'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Component
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import Spinner from 'react-native-loading-spinner-overlay';
import cache from '../../utils/cache';
import storage from '../../utils/storage';
import { connect } from 'react-redux';
import { signUp } from '../../actions/user';

class AtShop extends Component {
  constructor(props) {
    super(props);
    this.state = { pushid: '' };
    storage.get('caradvise:pushid').then(value => {
      if (value) {
        this.state.pushid = value;
      }
    });
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      let [currentRoute] = this.props.navigator.getCurrentRoutes().reverse();
      if (currentRoute.indent === 'AtShop') {
        cache.remove('accountDetails-fields');
        cache.remove('vehicleDetails-fields');
        cache.remove('vin-fields');

        this.props.navigator.immediatelyResetRouteStack([
          { indent: 'Main' },
          { indent: 'NotAtShopDone' }
        ]);
      }
    }
  }

  render() {
    if (this.props.isLoading)
      return <Spinner visible={true} />;

    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Are you currently at a car care shop?</Text>
          <View style={styles.btnCol}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'SelectShop' })}>
              <Image
                resizeMode='contain'
                source={require('../../../images/btn-yes.png')}
                style={styles.btn} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.signUp()}>
              <Image
                resizeMode='contain'
                source={require('../../../images/btn-no.png')}
                style={styles.btn} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  signUp() {
    let accountDetailsFields = cache.get('accountDetails-fields');
    let vehicleDetailsFields = cache.get('vehicleDetails-fields');
    let data = {
      firstName: accountDetailsFields.firstName.value,
      lastName: accountDetailsFields.lastName.value,
      email: accountDetailsFields.email.value,
      cellPhone: accountDetailsFields.cellPhone.value,
      password: accountDetailsFields.password.value,
      miles: vehicleDetailsFields.miles.value,
      pushid: this.state.pushid
    };

    let vinFields = cache.get('vin-fields');
    if (vinFields) {
      data.vin = vinFields.vin.value;
    } else {
      data.year = vehicleDetailsFields.year.value;
      data.make = vehicleDetailsFields.make.value;

      let models = cache.get('vehicleDetails-models') || [];
      let model = models.find(({ value }) => value === vehicleDetailsFields.model.value) || {};
      data.model_id = model.key;
      data.model = model.originalValue;

      let engines = cache.get('vehicleDetails-engines') || [];
      let engine = engines.find(({ value }) => value === vehicleDetailsFields.engine.value) || {};
      data.vehicle_type_extension_engine_id = engine.key;
    }

    this.props.signUp(data);
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  textStep: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  btnCol: {
    marginTop: 30
  },
  btn: {
    width: 190,
    height: 60
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading
  };
}

module.exports = connect(mapStateToProps, { signUp })(AtShop);
