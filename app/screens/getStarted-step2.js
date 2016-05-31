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
  ScrollView
} from 'react-native';

var fldWidth = Dimensions.get('window').width - 40;

class Step2 extends Component {

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
              <Text style={styles.textStep}>Enter your customer number or VIN below. If you don't have them then proceed to the next step.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Customer Number'} />
              <Text style={styles.textOr}>OR</Text>
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'VIN'} />
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Step3' })}>
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
    marginBottom: 50,
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
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  btnNext: {
    width: 120,
    marginTop: 10,
  },
});

module.exports = Step2;
