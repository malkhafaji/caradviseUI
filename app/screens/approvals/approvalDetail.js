'use strict';
var TopBar = require('../../components/main/topBar');
var CarBar = require('../../components/main/carBar');

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
        partCost:passProps.partCost,
        fairLow:passProps.fairLow,
        fairHigh:passProps.fairHigh,
        comments:passProps.comments,
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
        laborLow:passProps.laborLow,
        laborHigh:passProps.laborHigh,
        partLow:passProps.partLow,
        partHigh:passProps.partHigh,
        parts:passProps.parts,
        partDetail:passProps.partDetail,
        partName:passProps.partName,
      };
    }

    renderLabor()
    {
        if (this.state.laborLow) {
            return (
              <Text><Text>LABOR ESTIMATE:</Text><Text style={styles.textBold}>  ${this.state.laborLow.toFixed(0)}-${this.state.laborHigh.toFixed(0)}{"\n"}</Text></Text>
            );
        } else {
            return null;
        }
    }
    renderComments()
    {
        if (this.state.comments) {
            return (
              <View>
                <Text style={styles.textHdComments}>Shop Notes</Text>
                <View style={styles.commentContainer}>
                  <View style={styles.comment}><Text style={styles.commentTxt}>{this.state.comments}</Text></View>
                </View>
              </View>
            );
        } else {
            return null;
        }
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

    renderTime()
    {
        if (this.state.intervalMonth != 0) {
            return (
                <Text style={styles.textBold}>{this.state.intervalMonth} MONTHS</Text>
            );
        } else {
            return null;
        }
    }
    renderOr()
    {
        if (this.state.intervalMonth != 0 && this.state.intervalMile != 0) {
            return (
                <Text> OR </Text>
            );
        } else {
            return null;
        }
    }
    renderMile()
    {
        if (this.state.intervalMile != 0) {
            return (
                <Text style={styles.textBold}>{this.state.intervalMile} MILES</Text>
            );
        } else {
            return null;
        }
    }
    renderMaintenance()
    {
        if (this.state.intervalMile != 0) {
            return (
              <View style={styles.maintenanceTime}>
                <View style={styles.maintenanceTimeTextContainer}><Text style={styles.maintenanceTimeText}>{this.renderLabor()}TIME ESTIMATE:  <Text style={styles.textBold}>{this.state.time} {this.state.timeInterval}</Text>{"\n"}RECOMMENDED EVERY {this.renderTime()}{this.renderOr()}{this.renderMile()}</Text></View>
              </View>
            );
        } else {
            return null;
        }
    }

    renderParts()
    {
        if (this.state.partDetail.length != 0) {
            return (
              <View style={styles.partList}>
                <View>
                  <Text style={styles.textHd}>Part Replacement Estimate</Text>
                  {this.state.partDetail.length ?
                    this.state.partDetail.map(this.createPartsRow) :
                    <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>None</Text></View></View>}

                </View>
              </View>
            );
        } else {
            return null;
        }
    }

    render() {
      var totalLow = this.state.fairLow;
      var totalHigh = this.state.fairHigh;
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
                  { totalLow || totalHigh ? (
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>${totalLow.toFixed(0)}</Text>
                        <Image
                          source={require('../../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>${totalHigh.toFixed(0)}</Text>
                      </View>
                    </View>
                  ) : null }
                </View>
                {this.renderMaintenance()}
              </View>

              {this.renderComments()}
              {this.renderParts()}
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
    createPartsRow = (part, i) => <Part key={i} part={part} partDetail={this.state.partDetail} laborLow={this.state.laborLow} laborHigh={this.state.laborHigh} partLow={this.state.partLow} partHigh={this.state.partHigh} fairLow={this.state.fairLow} fairHigh={this.state.fairHigh}/>;
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
          <Text style={styles.partItem}>{this.props.part.name} {this.props.part.qualifier_name}</Text>
          { this.props.partLow || this.props.partHigh ? (
            <View style={styles.fairPriceContainer}>
              <Text style={styles.fairPriceText}>FAIR PRICE</Text>
              <View style={styles.fairPriceRange}>
                <Text style={styles.fairPrice}>${this.props.partLow.toFixed(0)}</Text>
                <Image
                  source={require('../../../images/arrow-range.png')}
                  style={styles.fairPriceArrow} />
                <Text style={styles.fairPrice}>${this.props.partHigh.toFixed(0)}</Text>
              </View>
            </View>
          ) : null }
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
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  textHdComments: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#f8991d',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  maintenanceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginBottom: 50,
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceItem: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  commentContainer: {
    width: width,
    backgroundColor: '#f8991d',
  },
  comment: {
    margin: 2,
    backgroundColor: '#FFF',
  },
  commentTxt: {
    backgroundColor: '#FFF',
    margin: 10,
    color: '#002d5e',
    fontSize: 12,
  },
  maintenanceTime: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceTimeTextContainer: {
    margin: 5,
    backgroundColor: '#FFF',
  },
  maintenanceTimeText: {
    backgroundColor: '#FFF',
    margin: 10,
    textAlign: 'center',
    color: '#002d5e',
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
    color: '#002d5e',
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
    color: '#002d5e',
    fontSize: 12,
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  partItem: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  partPrice: {
    flex: 1,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#002d5e',
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
    color: '#002d5e',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#002d5e',
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
    color: '#002d5e',
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
    color: '#f8991d',
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
    color: '#002d5e',
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
  whatTxtContainer: {
    margin: 5,
    backgroundColor: '#FFF',
  },
  whatTxt: {
    backgroundColor: '#FFF',
    margin: 10,
    color: '#002d5e',
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
    color: '#002d5e',
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
