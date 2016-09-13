import React from 'react';
import { observer } from 'mobx-react';
import DealerMapMarker from './dealer_map_marker';
import '../../css/dealer/dealer_locator_spinner.scss';
import '../../css/dealer/dealer_locator_list.scss';


@observer
class DealerList extends React.Component {


    static propTypes = {
        dealerService: React.PropTypes.shape({
            /**
             * MobX Observable Array
             */
            dealers: React.PropTypes.object.isRequired,
            isLoading: React.PropTypes.bool
        }),
        onDealerClick: React.PropTypes.func
    }

    dealerMapMarker;

    static defaultProps = {
        onDealerClick: null
    }

    constructor(props) {
        super(props);
        this.dealerMapMarker = new DealerMapMarker();
    }

    componentDidMount() {

    }

    componentWillReact() {
        //console.log("I will re-render, since the dealers or isLoading has changed.");
    }

    render() {

        let dealers = this.props.dealerService.dealers;

        return (
            <div className="dealer_locator_list">
                { this.props.dealerService.isLoading ?
                    <div id="dealer_spinner">
                        <div id="dealer_spinner_1" className="dealer_spinner"></div>
                        <div id="dealer_spinner_2" className="dealer_spinner"></div>
                        <div id="dealer_spinner_3" className="dealer_spinner"></div>
                        <div id="dealer_spinner_4" className="dealer_spinner"></div>
                        <div id="dealer_spinner_5" className="dealer_spinner"></div>
                        <div id="dealer_spinner_6" className="dealer_spinner"></div>
                        <div id="dealer_spinner_7" className="dealer_spinner"></div>
                        <div id="dealer_spinner_8" className="dealer_spinner"></div>
                    </div>
                    :
                    <ul>
                        {
                            dealers.map((dealer, i) => {
                                let boundClick = this.fireDealerClick.bind(this, dealer);
                                let markerProps = this.dealerMapMarker.getDealerMarkerProps(i, dealer);
                                let svg_path = markerProps.icon.path;
                                //console.log('svg_path', svg_path);
                                //svg_path = "M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C5.62 9.5 4.5 8.38 4.5 7S5.62 4.5 7 4.5 9.5 5.62 9.5 7 8.38 9.5 7 9.5z";

                                return (
                                    <li key={ dealer.contact_id } onClick={boundClick}>

                                        <div className="dealer_map_marker">
                                            <a href="#">{ markerProps.label }</a>
                                        </div>

                                        <div className="dealer_distance">
                                            Distance: <span>{ Math.round(dealer.distance_from_place * 10) / 10 }
                                            miles</span>
                                        </div>

                                        <p className="dealer_address" typeof="schema:PostalAddress">
                                            <span className="dealer_name"
                                                  property="schema:name">{dealer.contact_name}</span>
                                            <br />
                                            { dealer.is_country_distributor == 1 ?
                                                <button type="button" className="btn btn-primary btn-xs">
                                                    Official distributor in { dealer.country_name }
                                                </button>
                                                :
                                                ''
                                            }

                                            <span className="dealer_street" property="schema:streetAddress">
                                                { dealer.street }
                                                { dealer.street_number ? ',' + dealer.street_number : '' }
                                            </span><br />
                                            <abbr className="dealer_state" title={ dealer.state_name }
                                                  property="schema:addressRegion">{dealer.state_reference}</abbr>
                                            <span className="dealer_zipcode"
                                                  property="schema:postalCode">{dealer.zipcode}</span>&nbsp;
                                            <span className="dealer_city"
                                                  property="schema:addressLocality">{dealer.city}</span><br />
                                            <abbr className="dealer_country"
                                                  property="schema:addressCountry">{dealer.country_name}</abbr>
                                        </p>


                                        <div className="dealer_contact">
                                            <div className="dealer_homepage">
                                                Homepage: <span><a target="_blank"
                                                                   href={ 'http://' + dealer.homepage }> {dealer.homepage}</a></span>
                                            </div>

                                            <div className="dealer_email">
                                                Email: <span><a href={ 'mailto://' + dealer.email }>{ dealer.email }</a></span>
                                            </div>
                                            <div className="dealer_phone">
                                                Phone: <span>{ dealer.phone }</span>
                                            </div>
                                        </div>
                                    </li>

                                );

                            })
                        }
                    </ul>
                }
            </div>
        );
    }

    /**
     *
     * @param {Object} dealer
     * @param {event} e
     */
    fireDealerClick(dealer, e) {
        if (this.props.onDealerClick != null) {
            this.props.onDealerClick(dealer, e);
        }
    }

}

export default DealerList;