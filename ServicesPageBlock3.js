/**
 * Created by mnace on 8/7/2018.
 */
var $ = require('./assets/js/jquery.min');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var Icons = require('glyphicons');

Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
class ServicesPageBlock3 extends React.Component {

    constructor(props) {
        super(props);
        this.state = { confFile: require('./backend.json'), temporarySubscription: { plan: this.props.selectedPlan(), customer: this.props.selectedCustomer(), metaData: this.props.metaData() }, modalText: '' };
        this.computeTaxPercent = this.computeTaxPercent.bind(this);
        this.parseMetaData = this.parseMetaData.bind(this);
        this.purchase = this.purchase.bind(this);
        this.getCurrentDate = this.getCurrentDate.bind(this);
        this.calculateEndDate = this.calculateEndDate.bind(this);
        this.proformaFlow=this.proformaFlow.bind(this);
        this.invoiceFlow=this.invoiceFlow.bind(this);
        this.createSubscription=this.createSubscription.bind(this);
        this.activateSubscription=this.activateSubscription.bind(this);
        this.redirectToSubscriptionsPage=this.redirectToSubscriptionsPage.bind(this);
    }

    componentDidMount() {
        console.log("Temporary subscription", this.state.temporarySubscription);
        document.getElementById("triger").style.display = 'none';
        this.parseMetaData();
        this.calculateEndDate(new Date("01/31/2012"), 'month', 1);
        this.calculateEndDate(new Date("01/31/2012"), 'year',  1);
    }

    computeTaxPercent() {
        var me = this;
        if (this.state.temporarySubscription.customer.sales_tax_percent == null) {
            return 0;
        }
        else {
            return parseInt(this.state.temporarySubscription.customer.sales_tax_percent);
        }
    }

    getFormattedDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    getCurrentDate(date) {
        var today = new Date();
        return today;
    }

    calculateEndDate(startDate, interval, intervalCount){
        if (interval == 'month') {
            //console.log(startDate.addMonths(intervalCount));
            return startDate.addMonths(intervalCount);
        }
        else if (interval == 'year') {
            var year = parseInt(startDate.getFullYear());
            var month = parseInt(startDate.getMonth());
            var date = parseInt(startDate.getDate());
            var newDate = new Date(year + intervalCount, month, date);
            //console.log(newDate.toString());
            return newDate;
        }
    }

    parseMetaData() {
        var arrayOfKeyValuePairs = [];
        console.log(this.state.temporarySubscription.metaData);
        console.log(typeof this.state.temporarySubscription.metaData);
        var arrayKeys = Object.keys(this.state.temporarySubscription.metaData);
        var arrayValues = Object.values(this.state.temporarySubscription.metaData);
        for (var i = 0; i < arrayKeys.length; i++) {
            if (arrayValues[i] == "") {
                arrayOfKeyValuePairs.push(<p><small>{arrayKeys[i]} : none</small><br /></p>);
                // console.log("" + arrayKeys[i] + ": " + "NaN");
            }
            else {
                if (typeof arrayValues[i] == 'object') {
                    var arrayKeysNested = Object.keys(arrayValues[i]);
                    var arrayValuesNested = Object.values(arrayValues[i]);
                    var checked = [];
                    for (var j = 0; j < arrayValuesNested.length; j++) {
                        if (arrayValuesNested[j] == true) {
                            checked.push(arrayKeysNested[j]);
                        }
                    }
                    if (checked.toString() == '') {
                        arrayOfKeyValuePairs.push(<p><small>{arrayKeys[i]} : none</small><br /></p>);
                    }
                    else {
                        arrayOfKeyValuePairs.push(<p><small>{arrayKeys[i]} : {checked.toString()}</small><br /></p>);
                    }
                    // console.log("" + arrayKeys[i] + ": " + checked.toString());
                }
                else {
                    arrayOfKeyValuePairs.push(<p><small>{arrayKeys[i]} : {String(arrayValues[i])}</small> <br /></p>);
                    // console.log("" + arrayKeys[i] + ": " + String(arrayValues[i]));
                }
            }

        }

        return arrayOfKeyValuePairs;
    }

    async invoiceFlow(){
        var me=this;
        console.log('INVOICE FLOW');
        var created_subscription = await me.createSubscription();

        const subscription_id=created_subscription.id;
        const customer_id=me.state.temporarySubscription.customer.id;
        var activated_subscription = await me.activateSubscription(customer_id, subscription_id);
        console.log('Activated subscription', activated_subscription);

        me.redirectToSubscriptionsPage();
    }

    async proformaFlow(){
        console.log('PROFORMA FLOW');
        var me=this;
        var created_proforma = await me.createProforma();
        console.log("CREATED PROFORMA", created_proforma);
    }

    async createProforma(){
        var me=this;
        var url = me.state.confFile.url + '/silver/proformas/'; 
        var token = localStorage.getItem("token");
        //Logic for calculation of transaction_xe_rate
         var data = {
            "transaction_xe_rate": 61.5,
            "currency": "MKD",
            "customer": me.state.confFile.url + '/silver/customers/' + String(me.state.temporarySubscription.customer.id) + '/',
            "issue_date": me.getFormattedDate(me.getCurrentDate()),
            "proforma_entries":[
                {
                    "description": "Subscription",
                    "product_code": "daily-plan",
                    "prorated": "false",
                    "quantity": 1,
                    "start_date": me.getFormattedDate(me.getCurrentDate()),
                    "unit": "subscription",
                    "unit_price": me.state.temporarySubscription.plan.amount
                }
            ],
            "provider": me.state.confFile.url + '/silver/providers/' + String(me.state.temporarySubscription.plan.plan_provider.id) + '/',
            "sales_tax_name": "VAT",
            "sales_tax_percent": 0,
            "state": "issued"
        };

        //Request for creating subscription (Silver endpoint)

        var response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + token
                }
            }).then(function (response) {
                if (response.status == 201) {
                    
                    me.setState({modalText: "Succesfully created proforma !!!"});
                    document.getElementById("triger").click();
                }
                    return response.json();
                })
             .then(function (response) {
                    //console.log('RESPONSE', response);
                    return response;
            })
            .catch(function(error){
                me.setState({modalText: "Unsuccesfully created proforma !!!"});
                document.getElementById("modalText").classList.remove('text-success');
                document.getElementById("modalText").classList.add('text-danger');
                document.getElementById("triger").click();
            });
            const json=await response;
            console.log('RESPONSE', json);
            return json;
    }

    async createSubscription(){
        var me=this;
        var url = me.state.confFile.url + '/silver/customers/' + String(this.state.temporarySubscription.customer.id) + '/subscriptions/';
        var token = localStorage.getItem("token");
         var data = {
            "plan": me.state.confFile.url + '/silver/plans/' + String(this.state.temporarySubscription.plan.id) + '/',
            "customer": me.state.confFile.url + '/silver/customers/' + String(this.state.temporarySubscription.customer.id) + '/',
            "start_date": me.getFormattedDate(me.getCurrentDate()),
            "meta": this.state.temporarySubscription.metaData
        };

        //Request for creating subscription (Silver endpoint)

        var response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + token
                }
            }).then(function (response) {
                if (response.status == 201) {
                    //console.log("Succesfully created subscription");
                    me.setState({modalText: "Succesfully created subscription !!!"});
                    document.getElementById("triger").click();
                }
                    return response.json();
                })
             .then(function (response) {
                    //console.log('RESPONSE', response);
                    return response;
            })
            .catch(function(error){
                me.setState({modalText: "Unsuccesfully created subscription !!!"});
                document.getElementById("modalText").classList.remove('text-success');
                document.getElementById("modalText").classList.add('text-danger');
                document.getElementById("triger").click();
            });
            const json=await response;
            console.log('RESPONSE', json);
            return json;
    }

   async activateSubscription(customerId, subscriptionId){
        var me=this;
        var url = me.state.confFile.url + '/silver/customers/' + String(customerId) + '/subscriptions/'+String(subscriptionId)+"/activate/";
        var token = localStorage.getItem("token");
         var data = {
            "start_date": me.getFormattedDate(me.getCurrentDate()),
        };

        //Request for activating subscription (Silver endpoint)

        var response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + token
                }
            }).then(function (response) {
                console.log('Response status', response.status);
                if (response.status == 200) {
                   // console.log("Succesfully activated subscription");
                    me.setState({modalText: "Succesfully created and activated subscription !!!"});
                    //document.getElementById("triger").click();
                }
                    return response.json();
                })
             .then(function (response) {
                    //console.log('RESPONSE', response);
                    return response;
            })
            .catch(function(error){
                me.setState({modalText: "Unsuccesfully activated subscription !!!"});
                document.getElementById("modalText").classList.remove('text-success');
                document.getElementById("modalText").classList.add('text-danger');                
                document.getElementById("triger").click();
            });
            const json=await response;
            console.log('RESPONSE', json);
            return json;
    }

    redirectToSubscriptionsPage(){
        setTimeout(function () {
            document.location.replace("/#/Services");
            document.location.reload(true);
        }, 2500);
    }


    purchase() {
        var me=this;
        if(me.state.temporarySubscription.plan.plan_provider.flow == "invoice"){
            me.invoiceFlow();
        }
        else{
            me.proformaFlow();
        }
    }
    render() {
        return (

            <div>
                <main className="main-content">

                    <section className="section">
                        <div className="container">

                            <div className="col-lg-8">

                                <table className="table table-cart">
                                    <tbody style={{ vAlign: 'middle' }}>


                                        <tr>

                                            <td>
                                                <a>
                                                    <img className="rounded" src={this.state.confFile.url + this.state.temporarySubscription.plan.feature.plan_image} alt="..." />
                                                </a>
                                            </td>

                                            <td>
                                                <h4>Company: {this.state.temporarySubscription.customer.company}</h4>
                                                <h4>Plan: {this.state.temporarySubscription.plan.name}</h4>
                                                <h4 style={{ fontSize: '0.9em', textDecoration: 'underline' }}>Meta data </h4>
                                                {this.parseMetaData()}
                                            </td>

                                            <td>
                                                <h2 className="price">{parseFloat(this.state.temporarySubscription.plan.amount).toFixed(2)} {this.state.temporarySubscription.plan.currency}</h2>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>

                            </div>


                            <div className="col-lg-4">
                                <div className="cart-price">
                                    <div className="flexbox">
                                        <div>
                                            <p><strong>Subtotal:</strong></p>
                                            <p><strong>Tax ({this.computeTaxPercent()}%):</strong></p>
                                        </div>

                                        <div>
                                            <p>{Math.round(parseFloat(this.state.temporarySubscription.plan.amount) * (1 - this.computeTaxPercent() / 100))} {this.state.temporarySubscription.plan.currency}</p>
                                            <p>{parseFloat(this.state.temporarySubscription.plan.amount).toFixed(2) - Math.round(parseFloat(this.state.temporarySubscription.plan.amount) * (1 - this.computeTaxPercent() / 100))} {this.state.temporarySubscription.plan.currency}</p>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="flexbox">
                                        <div>
                                            <p><strong>Total:</strong></p>
                                        </div>

                                        <div>
                                            <p className="fw-600">{parseFloat(this.state.temporarySubscription.plan.amount).toFixed(2) * (1 - this.computeTaxPercent() / 100) + parseFloat(this.state.temporarySubscription.plan.amount).toFixed(2) * (this.computeTaxPercent() / 100)} {this.state.temporarySubscription.plan.currency}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-12">
                                        <button className="btn btn-block btn-primary" type="submit" onClick={() => this.purchase()}>Purchase <i className="ti-angle-right fs-9"></i></button>
                                    </div>
                                </div>

                            </div>



                        </div>
                    </section>

                </main>
                <button id="triger" className="btn btn-primary" type="button" data-toggle="popup" data-target="#popup-slide-down">Slide Down</button>
                <div id="popup-slide-down" className="popup col-6 col-md-4" data-position="top-right" data-animation="slide-down">
                    <button type="button" className="close" data-dismiss="popup" aria-label="Close" onClick={() => this.handleNotificationClose()}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div className="media">
                        <div className="media-body">
                            <h3>Add subscription (Final step)</h3>
                            <p id="modalText" className="mb-1 text-success" style={{ fontSize: '1.2em' }}>{this.state.modalText}</p>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

module.exports = ServicesPageBlock3;
