/**
 * Created by mnace on 8/2/2017.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');



class FeaturesPageBlock2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {features: [], confFile: require('./backend.json')};
        this.showFeatures=this.showFeatures.bind(this);

    }

    componentDidMount(){
         var me = this;

        fetch(me.state.confFile.url + '/va_saas/get_features/?company_name=' + me.state.confFile.company_name)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                var response = myJson;
                me.setState({
                    features: response.data
                });
                console.log(myJson);
            });

    }

    showFeatures(){
        var feature_elements=this.state.features.map(function(feature, index){
            
        });
    }

    render() {
        return (
                    <div className="container">
                        <div id="features">
                            <div className="row">
                                <div className="col-md-12">
                                    <section className="section">
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-dark w-70px"><i className="icon-mobile"></i></div>
                                                <div className="media-body">
                                                    <h5>Responsive</h5>
                                                    <p>Your website works on any device: desktop, tablet or mobile.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-primary w-70px"><i className="icon-gears"></i></div>
                                                <div className="media-body">
                                                    <h5>Customizable</h5>
                                                    <p>You can easily read, edit, and write your own code, or change everything.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-info w-70px"><i className="icon-tools"></i></div>
                                                <div className="media-body">
                                                    <h5>UI Kit</h5>
                                                    <p>There is a bunch of useful and necessary elements for developing your website.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-warning w-70px"><i className="icon-layers"></i></div>
                                                <div className="media-body">
                                                    <h5>Lego Base</h5>
                                                    <p>You can find our code well organized, commented and readable.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-danger w-70px"><i className="icon-recycle"></i></div>
                                                <div className="media-body">
                                                    <h5>Clean Code</h5>
                                                    <p>As you can see in the source code, we provided a clean code.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4">
                                            <div className="media">
                                                <div className="lead-6 line-height-1 text-success w-70px"><i className="icon-chat"></i></div>
                                                <div className="media-body">
                                                    <h5>Support</h5>
                                                    <p>When you purchase this template, you'll freely receive future updates.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
        );
    }
}

module.exports = FeaturesPageBlock2;