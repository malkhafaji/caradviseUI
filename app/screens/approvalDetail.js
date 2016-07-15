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

class ApprovalDetail extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        id: passProps.category,
        name:passProps.name,
        lowCost:passProps.lowCost,
        highCost:passProps.highCost,
        time:passProps.time,
        timeInterval:passProps.timeInterval,
        intervalMile:passProps.intervalMile,
        intervalMonth:passProps.intervalMonth,
        position:passProps.position,
        desc:passProps.desc,
        partPrice:passProps.partPrice,
        whatIsIt:passProps.whatIsIt,
        whyDoThis:passProps.whyDoThis,
        whatIf:passProps.whatIf,
        factors:passProps.factors,
        partLow:passProps.partLow,
        partHigh:passProps.partHigh,
        parts:passProps.parts,
        partDetail:passProps.partDetail,
      };
    }

    renderWhat()
    {
        if (this.state.whatIsIt) {
            return (
              <View>
                <Text style={styles.textHd}>What is it?</Text>
                <View style={styles.whatContainer}><Text style={styles.whatTxt}>{this.state.whatIsIt}</Text></View>
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
              <View style={styles.whatContainer}><Text style={styles.whatTxt}>{this.state.whyDoThis}</Text></View>
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
              <View style={styles.whatContainer}><Text style={styles.whatTxt}>{this.state.whatIf}</Text></View>
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
              <View style={styles.whatContainer}><Text style={styles.whatTxt}>{this.state.factors}</Text></View>
              </View>
            );
        } else {
            return null;
        }
    }

    render() {
      var totalLow = this.state.partLow + this.state.lowCost;
      var totalHigh = this.state.partHigh + this.state.highCost;
      return (
        <View style={styles.base}>
          <TopBar navigator={this.props.navigator} />
          <CarBar />
          <View style={styles.maintenanceContainer}>

            <ScrollView style={styles.scrollView}>
            <Text style={styles.textHd}>Service Detail</Text>

            <View style={styles.maintenanceList}>
              <View>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceItem}>{this.state.name} {this.state.position}</Text>

                  <View style={styles.fairPriceContainer}>
                    <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                    <View style={styles.fairPriceRange}>
                      <Text style={styles.fairPrice}>${totalLow.toFixed(0)}</Text>
                      <Image
                        source={require('../../images/arrow-range.png')}
                        style={styles.fairPriceArrow} />
                      <Text style={styles.fairPrice}>${totalHigh.toFixed(0)}</Text>
                    </View>
                  </View>

                </View>
                <View style={styles.maintenanceTime}>
                  <Text style={styles.maintenanceTimeText}>TIME ESTIMATE:  <Text style={styles.textBold}>{this.state.time} {this.state.timeInterval}</Text>{"\n"}RECOMMENDED EVERY <Text style={styles.textBold}>{this.state.intervalMile} MILES</Text></Text>
                </View>
              </View>

              <View style={styles.partList}>
                <View>
                  <Text style={styles.textHd}>Part Replacement Estimate</Text>
                  {this.state.partDetail.length ?
                    this.state.partDetail.map(this.createPartsRow) :
                    <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>None</Text></View></View>}

                </View>
              </View>

              {this.renderWhat()}
              {this.renderWhy()}
              {this.renderWhatIf()}
              {this.renderFactors()}

            </View>

            </ScrollView>

          </View>

        </View>
      );
    }
    createPartsRow = (part, i) => <Part key={i} part={part} lowCost={this.state.lowCost} highCost={this.state.highCost}/>;
}

var Part = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  render: function() {
    //var totalLow = this.props.parts.part_low_cost + this.props.lowCost;
    //var totalHigh = this.props.partDetail.price + this.props.highCost;
      return(
        <View style={styles.partRow}>
          <Text style={styles.partItem}>{this.props.part.name}</Text>
          <Text style={styles.partPrice}>${this.props.part.price.toFixed(0)}</Text>
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
    marginBottom: 5,
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
    margin: 5,
    padding: 10,
    textAlign: 'center',
    color: '#006699',
    fontSize: 12,
  },
  maintenanceDesc: {
    width: width,
    backgroundColor: '#EFEFEF',
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
  },
  partItem: {
    flex: 2,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  partPrice: {
    flex: 1,
    marginTop: 15,
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
  whatContainer: {
    backgroundColor: '#EFEFEF',
    width: width,
  },
  whatTxt: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 10,
    color: '#006699',
    fontSize: 12,
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

module.exports = connect(mapStateToProps)(ApprovalDetail);
