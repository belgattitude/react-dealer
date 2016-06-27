import React from 'react';
import {observer} from 'mobx-react';
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

    static defaultProps = {
        onDealerClick: null
    }


    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        let dealers = this.props.dealerService.dealers;
        return (
            <div className="dealer_locator_list">
                <ul>
                    {
                        dealers.map((dealer) => {
                            let boundClick = this.fireDealerClick.bind(this, dealer);
                            return (
                                <li key={ dealer.contact_id } onClick={boundClick}>
                                    <div className="distance">
                                        <p>{dealer.distance_from_place}</p>
                                        <p>{dealer.total}</p>
                                    </div>
                                    <img src="http://lorempixum.com/100/100/nature/1"/>
                                    <h3>{dealer.dealer_name}</h3>
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