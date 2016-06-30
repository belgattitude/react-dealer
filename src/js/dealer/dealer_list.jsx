import React from 'react';
import { observer } from 'mobx-react';
import DealerMapMarker from './dealer_map_marker';
import '../../css/dealer/dealer_locator.scss';


@observer
class DealerList extends React.Component {


    static propTypes = {
        dealerService: React.PropTypes.shape({
            /**
             * MobX Observable Array
             */
            dealers: React.PropTypes.object.isRequired
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

    render() {

        let dealers = this.props.dealerService.dealers;
        return (
            <div className="dealer_locator_list">
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
                                    <div className="distance">
                                        <p>{dealer.distance_from_place}</p>
                                        <p>{dealer.total}</p>
                                    </div>
                                    <img src="http://lorempixum.com/100/100/nature/1"/>
                                    <h3>
                                        <svg viewBox="0 0 14 20" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
                                            <path d={ svg_path } />
                                        </svg>
                                        { markerProps.label } - {dealer.contact_name}
                                    </h3>
                                    <address>
                                        {dealer.street}<br />
                                        {dealer.city}, {dealer.state_reference} {dealer.zipcode}<br />
                                        <abbr title="Phone">Phone:</abbr> {dealer.phone}<br />
                                        <a href="mailto:{dealer.email}">{dealer.email}</a>
                                    </address>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    /**
     *
     * @param {Object} dealer
     * @param {event} e
     */
    fireDealerClick(dealer) {
        if (this.props.onDealerClick != null) {
            this.props.onDealerClick(dealer);
        }
    }

}

export default DealerList;