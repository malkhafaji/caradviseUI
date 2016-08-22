'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  Navigator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { findLastIndex } from 'lodash';
import cache from '../utils/cache';

var width = Dimensions.get('window').width - 20;

class ServiceDetail extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        id: passProps.category,
        name:passProps.name,
        whatIsIt:passProps.whatIsIt,
        whyDoThis:passProps.whyDoThis,
        whatIf:passProps.whatIf,
        factors:passProps.factors,
        service:passProps.service
      };
    }

    renderWhat()
    {
        if (this.state.whatIsIt) {
            return (
              <View>
                <Text style={styles.textHd}>What is it?</Text>
                <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whatIsIt}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderWhy()
    {
        if (this.state.whyDoThis) {
            return (
              <View>
              <Text style={styles.textHd}>Why do this?</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whyDoThis}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderWhatIf()
    {
        if (this.state.whatIf) {
            return (
              <View>
              <Text style={styles.textHd}>What if I decline?</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whatIf}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderFactors()
    {
        if (this.state.factors) {
            return (
              <View>
              <Text style={styles.textHd}>Factors to consider</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.factors}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }

    addService() {
      const fields = cache.get('serviceRequest-fields');
      if (!fields) return;

      fields.services.push({ ...this.state.service, status: 'ADDED' });
      cache.set('serviceRequest-fields', fields);

      const route = { indent: 'ServiceRequest' };
      const routes = this.props.navigator.getCurrentRoutes();
      this.props.navigator.replaceAtIndex(route, findLastIndex(routes, route));
      this.props.navigator.popToRoute(route);
    }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.serviceContainer}>

              <Text style={styles.textHd}>Service Detail</Text>

              <View style={styles.serviceList}>

                  <View style={styles.serviceRow}>
                    <Text style={styles.serviceItem}>{this.state.name}</Text>

                    {this.state.lowCost !== undefined && this.state.highCost !== undefined &&
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>${this.state.lowCost}</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>${this.state.highCost}</Text>
                      </View>
                    </View>}

                  </View>

              </View>

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.addService()}>
                  <Image
                    source={require('../../images/btn-add.png')}
                    style={styles.btnAdd} />
                </TouchableOpacity>
              </View>

              {this.renderWhat()}
              {this.renderWhy()}
              {this.renderWhatIf()}
              {this.renderFactors()}

            </View>
            </ScrollView>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: width,
    height: Dimensions.get('window').height,
    marginLeft: 10,
    marginRight: 10,
  },
  serviceContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  serviceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceItem: {
    flex: 2,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  servicePriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  servicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  servicePrice: {
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  },
  serviceRange: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#F49D11',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fairPriceArrow: {
    width: 22,
    height: 10,
    marginTop: 4,
    marginLeft: 2,
    marginRight: 2,
  },
  fairPrice: {
    color: '#006699',
    fontWeight: 'bold',
  },
  serviceDescContainer: {
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  serviceDesc: {
    backgroundColor: '#FFF',
    padding: 10,
  },
  btnAdd: {
    width: 300,
    height: 40,
    marginTop: 15,
  },
  whatContainer: {
    backgroundColor: '#EFEFEF',
    width: width,
  },
  whatTxtContainer: {
    margin: 5,
    backgroundColor: '#FFF',
  },
  whatTxt: {
    backgroundColor: '#FFF',
    margin: 10,
    color: '#006699',
    fontSize: 12,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
  };
}

module.exports = connect(mapStateToProps)(ServiceDetail);
