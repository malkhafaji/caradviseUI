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
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

class MaintenanceDetail extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        id: passProps.category,
        name:passProps.name,
        lowCost:Number(passProps.lowCost).toFixed(0),
        highCost:Number(passProps.highCost).toFixed(0),
        time:passProps.time,
        timeInterval:passProps.timeInterval,
        intervalMile:passProps.intervalMile,
        intervalMonth:passProps.intervalMonth,
        position:passProps.position,
        desc:passProps.desc,
        partLowCost:passProps.partLowCost,
        partName:passProps.partName,
        partPrice:passProps.partPrice,
        parts:passProps.parts
      };
    }

    renderParts()
    {
        if (this.state.parts.length != 0) {
            return (
              <View style={styles.partList}>
                <View>
                  <Text style={styles.textHd}>Part Replacement Estimate</Text>
                  {this.state.parts.length ?
                    this.state.parts.map(this.createPartsRow) :
                    <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>None</Text></View></View>}

                </View>
              </View>
            );
        } else {
            return null;
        }
    }

    render() {
      return (
        <View style={styles.base}>
          <TopBar navigator={this.props.navigator} />
          <CarBar />
          <View style={styles.maintenanceContainer}>

            <ScrollView style={styles.scrollView}>
            <Text style={styles.textHd}>Maintenance Detail</Text>

            <View style={styles.maintenanceList}>
              <View>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceItem}>{this.state.name} {this.state.position}</Text>

                  <View style={styles.fairPriceContainer}>
                    <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                    <View style={styles.fairPriceRange}>
                      <Text style={styles.fairPrice}>${this.state.lowCost}</Text>
                      <Image
                        source={require('../../images/arrow-range.png')}
                        style={styles.fairPriceArrow} />
                      <Text style={styles.fairPrice}>${this.state.highCost}</Text>
                    </View>
                  </View>

                </View>
                <View style={styles.maintenanceTime}>
                  <Text style={styles.maintenanceTimeText}>TIME ESTIMATE:  <Text style={styles.textBold}>{this.state.time} {this.state.timeInterval}</Text></Text>
                </View>
                <View style={styles.maintenanceReco}>
                  <Text style={styles.maintenanceRecoText}>RECOMMENDED EVERY <Text style={styles.textBold}>{this.state.intervalMonth} MONTHS</Text> OR <Text style={styles.textBold}>{this.state.intervalMile} MILES</Text></Text>
                </View>
                <View style={styles.maintenanceDesc}>
                  <Text style={styles.maintenanceDescText}>{this.state.desc}</Text>
                </View>
              </View>
            </View>

            {this.renderParts()}

            </ScrollView>

          </View>

        </View>
      );
    }

    createPartsRow = (part, i) => <Part key={i} part={part}/>;
}

var Part = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  render: function() {
      return(
        <View style={styles.partRow}>
          <Text style={styles.partItem}>{this.props.part.name}</Text>
          <Text style={styles.partPrice}>${Number(this.props.part.price).toFixed(2)}</Text>
        </View>
      );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  maintenanceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  maintenanceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
  },
  maintenanceItem: {
    flex: 2,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  maintenanceTime: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceTimeText: {
    backgroundColor: '#FFF',
    marginRight: 5,
    marginLeft: 5,
    padding: 10,
    textAlign: 'center',
    color: '#006699',
    fontSize: 12,
  },
  maintenanceReco: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceRecoText: {
    backgroundColor: '#FFF',
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    padding: 10,
    textAlign: 'center',
    color: '#006699',
    fontSize: 12,
  },
  maintenanceDesc: {
    width: width,
    backgroundColor: '#EFEFEF',
    marginBottom: 10,
  },
  maintenanceDescText: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 10,
    color: '#006699',
    fontSize: 12,
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#006699',
  },
  partList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  partRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 2,
  },
  partItem: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  partPrice: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#006699',
    textAlign: 'right',
  },
  priceContainer: {
    flex: 1,
    marginTop: 15,
    marginRight: 10,
  },
  priceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  price: {
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#006699',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006699',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#FF9900',
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
    fontSize: 14,
    color: '#006699',
    fontWeight: 'bold',
  },
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  bookIt: {
    alignItems: 'center',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
  textBold: {
    fontWeight: 'bold',
  },
  noServicesBg: {
    backgroundColor: '#F4F4F4',
    width: width,
  },
  noServicesContainer: {
    margin: 10,
  },
  noServices: {
    color: '#006699',
    width: width,
    textAlign: 'center',
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
    miles : user.vehicles[0].miles,
  };
}

module.exports = connect(mapStateToProps)(MaintenanceDetail);
