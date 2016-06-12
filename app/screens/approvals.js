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
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/active_order_by_vehicle_number?vehicleNumber=';
var UPDATE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/orders/update_order_service';

class Approvals extends Component {

    constructor(props) {
      super(props);
      this.state = {
        services:null,
        total:0,
        visible: false,
        showCheckout: false,
      };
    }

    componentDidMount() {
      this.getApprovals();
    }

    getApprovals() {
      if(this.props.isLoggedIn && this.props.vehicleNumber)
      {
        fetch(MAINTENANCE_URL + this.props.vehicleNumber, {headers: {'Authorization': this.props.authentication_token}})
          .then((response) => response.json())
          .then((responseData) => {
            var services = (responseData.order != undefined) ? responseData.order.order_services : [];
            var total = 0;
            var showCheckout = false;
            if(responseData.order != undefined)
            {
               var approved = services.filter(this.filterApprovedServices.bind(this));
               for (var i = 0; i < approved.length; i++) {
                 var cost = approved[i].TotalCost;
                 if(typeof cost !== "undefined")
                 {
                   total += Number(cost.replace("$", ""));
                 }
                 if(approved[i].status == 5)
                 {
                   showCheckout = true;
                 }
               }
            }
            this.setState({
              services: services,
              total: "$" + total.toFixed(2),
              showCheckout: showCheckout
            });
          })
          .done();
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

    filterUnapprovedServices(service)
    {
      return service.status == 0;
    }

    filterApprovedServices(service)
    {
      return (service.status == 2 || service.status == 5);
    }

    renderCheckout()
    {
        if (this.state.showCheckout) {
            return (
              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'CreditCard' })}>
                  <Image
                    source={require('../../images/btn-checkout.png')}
                    style={styles.btnCheckout} />
                </TouchableOpacity>
              </View>
            );
        } else {
            return null;
        }
    }

    renderServices(services) {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.approvalsContainer}>

              <Text style={styles.textHd}>Services To Approve</Text>

              <View style={styles.newServicesList}>
              {services.filter(this.filterUnapprovedServices.bind(this)).map(this.createServiceRow)}
              </View>

              <Text style={styles.textHd}>Approved Services</Text>
             {services.filter(this.filterApprovedServices.bind(this)).map(this.createServiceRow)}

              {/*<View>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AddServices' })}>
                  <Image
                    source={require('../../images/btn-add-service.png')}
                    style={styles.btnAddService} />
                </TouchableOpacity>
              </View>*/}

              {this.renderCheckout()}

            </View>
            </ScrollView>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={i} service={service} isLoggedIn={this.props.isLoggedIn} authentication_token={this.props.authentication_token} approvals={this}/>;
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  updateStatus:function(status)
  {
    if(this.props.isLoggedIn)
    {
        fetch(UPDATE_URL + '?order_service_id='+ this.props.service.id +'&status=' + status,
          {
            method:"PUT",
            headers: {'Authorization': this.props.authentication_token},
          }
        )
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.order_service != undefined)
          {
            this.props.approvals.getApprovals();
          }
        })
        .done();
    }

  },

  render: function() {
    if(this.props.service.status == 0)
    {
      return (
        <View>
        <View style={styles.newServicesRow}>
          <Text style={styles.newServiceItem}>{this.props.service.serviceName}</Text>

          <View style={styles.newServicePriceContainer}>
            <Text style={styles.newServicePriceHd}>PRICE</Text>
            <Text style={styles.newServicePrice}>${this.props.service.totalCost}</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnLeft}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(3) }}>
            <Image
              source={require('../../images/btn-save.png')}
              style={styles.btnSave} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnRight}
            underlayColor='#dddddd'
            onPress={() => { this.updateStatus(2) }}>
            <Image
              source={require('../../images/btn-approve-orange.png')}
              style={styles.btnApprove} />
          </TouchableOpacity>
        </View>
        </View>
      );
    }
    else if (this.props.service.status == 2 || this.props.service.status == 5) {
      return(
        <View style={styles.approvedRow}>
          <Text style={styles.approvedItem}>{this.props.service.serviceName}</Text>
          <Text style={styles.approvedPrice}>${this.props.service.totalCost}</Text>
        </View>
      );
    }
    else {
      return null;
    }
  }
});

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
  approvalsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  newServicesList: {
    flexDirection: 'column',
    width: width,
  },
  newServicesRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
  },
  newServiceItem: {
    flex: 3,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#11325F',
    alignItems: 'center',
  },
  newServicePriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 5,
  },
  btnLeft: {
    flex: 2,
    alignItems: 'center',
  },
  btnRight: {
    flex: 2,
    alignItems: 'center',
  },
  btnApprove: {
    width: 145,
    height: 29,
  },
  btnSave: {
    width: 145,
    height: 29,
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  approvedRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 1,
  },
  approvedItem: {
    flex: 3,
    color: '#11325F',
    fontWeight: 'bold',
  },
  approvedPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  newTotal: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#FEF1DC',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  newTotalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11325F',
  },
  newTotalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnCheckout: {
    width: 300,
    height: 40,
    marginTop: 20,
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleNumber : user.vehicles[0].vehicleNumber,
  };
}

module.exports = connect(mapStateToProps)(Approvals);
