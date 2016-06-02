'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');
var ApprovalRequest = require('../components/main/approvalRequest');


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

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/?/maintenance';

class Maintenance extends Component {

    constructor(props) {
      super(props);
      this.state = {
        services:null,
        total:0,
        visible: false,
      };
    }

    componentDidMount() {
      this.getMaintenance();
    }

    getMaintenance() {
      if(this.props.isLoggedIn && this.props.vehicleId)
      {
        fetch(MAINTENANCE_URL.replace("?", this.props.vehicleId), {headers: {'Authorization': this.props.authentication_token}})
          .then((response) => response.json())
          .then((responseData) => {
            var total = 0;
            for (var i = 0; i < responseData.Maintenance_Services.length; i++) {
              var cost = responseData.Maintenance_Services[i].Service.TotalPartCost;
              if(typeof cost !== "undefined")
              {
                total += Number(cost.replace("$", ""));
              }
            }
            this.setState({
              services: responseData.Maintenance_Services,
              total: "$" + total.toFixed(2)
            });
          })
          .done();
      }
    }

    _renderScene(route, navigator) {
      var globalNavigatorProps = {navigator}

      switch(route.indent) {
        case 'Main':
          return (
            <Main {...globalNavigatorProps} />
          )
        case 'Approvals':
          return (
            <Approvals {...globalNavigatorProps} />
          )
        default:
          return (
            <Text>EPIC FAIL</Text>
          )
      }
    }

    render() {

      if (!this.state.services) {
        return this.renderLoadingView();
      }
      var services = this.state.services;
      return this.renderServices(services);
    }

    renderLoadingView() {
      return (
        <View>
          <Spinner visible={true} />
        </View>
      );
    }

    renderServices(services) {
        return (

          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <View style={styles.maintenanceContainer}>

              <ScrollView style={styles.scrollView}>
              <Text style={styles.textHd}>Maintenance</Text>

              {services.map(createServiceRow)}

              <View style={styles.total}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalPrice}>{this.state.total}</Text>
              </View>

              <View style={styles.rowAddService}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>

              <View style={styles.bookIt}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    source={require('../../images/btn-bookit-big.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>
              </ScrollView>

            </View>

          </View>

        );
    }
}

var createServiceRow = (service, i) => <Service key={i} service={service.Service} />;

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <View style={styles.maintenanceRow}>
        <Text style={styles.maintenanceItem}>{this.props.service.Name}</Text>
        <Text style={styles.maintenancePrice}>{this.props.service.TotalPartCost}</Text>
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
    height: Dimensions.get('window').height - 125,
  },
  maintenanceContainer: {
    alignItems: 'center',
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
    textAlign: 'center',
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 1,
  },
  maintenanceItem: {
    flex: 3,
    color: '#11325F',
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
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
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
  };
}

module.exports = connect(mapStateToProps)(Maintenance);
