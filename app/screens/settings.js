'use strict';
var TopBar = require('../components/main/topBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

var width = Dimensions.get('window').width - 20;

class Settings extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <View style={styles.settingsContainer}>
              <Text style={styles.textHd}>Settings</Text>

              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>FIRST NAME</Text>
                <TextInput
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  placeholderTextColor={'#11325F'}
                  value={'Jane'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>LAST NAME</Text>
                <TextInput
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  placeholderTextColor={'#11325F'}
                  value={'Doe'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>EMAIL</Text>
                <TextInput
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  placeholderTextColor={'#11325F'}
                  value={'jane.doe@gmail.com'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>PASSWORD</Text>
                <TextInput
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  placeholderTextColor={'#11325F'}
                  value={'XXXXXX'} />
              </View>

              <View>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-save-blue.png')}
                    style={styles.btnSave} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsContainer: {
    alignItems: 'center',
    marginBottom: 200,
    marginLeft: 10,
    marginRight: 10,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  settingsRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F4F4F4',
  },
  fldName: {
    flex: 1,
    color: '#11325F',
    fontSize: 12,
  },
  textFld: {
    flex: 3,
    height: 16,
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  btnSave: {
    width: 169,
    height: 34,
    marginTop: 15,
  },
});

module.exports = Settings;
