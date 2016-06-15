import React from 'react';
import ReactDom from 'react-dom';
import DealerService from './dealer_service';
import '../../css/dealer/dealer_locator.scss';


class DealerLocator extends React.Component {

    static propTypes = {
        initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
        mapRefName: React.PropTypes.string,
        googleMap: React.PropTypes.objectOf(google.maps.Map),
        source: React.PropTypes.string,
        nbContactZoomBounds: React.PropTypes.number,
        searchDistance: React.PropTypes.number,
        searchLimit: React.PropTypes.number,
        brandFilter: React.PropTypes.string

    }

    static defaultProps = {
        mapRefName: 'mapCanvas',
        nbContactZoomBounds: 0,
        searchDistance: 25,
        searchLimit: 100
    }

    language = 'en';
    dealerService = null;
    markers = [];
    infoWindow = null;
    center;

    constructor(props) {
        super(props);
        this.state = {
            dealers: []
        };

        this.center = this.props.initialCenter;
        this.dealerService = new DealerService({
            language: this.language,
            source: props.source
        });

        this.infoWindow = new google.maps.InfoWindow();
    }

    componentDidMount() {

        /**
        var pac_input =
            document.getElementById('dealer_locator_control_autocomplete'));
        */
        var pac_input = /** @type {!HTMLInputElement} */
            this.refs.pac_input;

        var controls = this.refs.dealer_locator_widget_controls;
        //dealer_locator_control_autocomplete
        this.initializeMap();
        this.initializeAutocomplete(pac_input);
        // Adding input controls to the map
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(controls);

        var loc = {
            lat: this.getCenter().lat,
            lng: this.getCenter().lng

        };
        var distance = this.props.searchDistance;
        var brand = this.props.brandFilter;
        var limit = this.props.searchLimit;

        // Set new center
        this.center = {lat: this.getCenter().lat, lng: this.getCenter().lng};


        // Search
        var dealerPromise = this.dealerService.findDealers(loc, distance, limit, brand);
        dealerPromise.then(dealers => this.updateDealers(dealers))


    }

    initializeMap() {
        this.map = new google.maps.Map(this.refs.map, {
            center: this.getCenter(),
            zoom: 16,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });
    }


    /**
     *
     * @param {!HTMLInputElement} pac_input
     */
    initializeAutocomplete(pac_input) {

        var acOptions = {
            types: ['geocode'],
            language: this.language,
            //componentRestrictions: {country: 'fr'}
        };

        // init autocomplete
        this.autocomplete = new google.maps.places.Autocomplete(pac_input, acOptions);

        // Add listener for changed place
        this.autocomplete.addListener('place_changed', () => {
            // Get to the place
            var place = this.autocomplete.getPlace();
            this.updateCentralPlace(place);

            // Get dealers and add markers
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            var loc = {
                lat: lat,
                lng: lng,
                distance: this.props.searchDistance,
                brand: this.props.brandFilter
            };
            this.center = { lat: lat, lng: lng};
            //console.log('this.Center', this.center);
            var distance = this.props.searchDistance;
            var brand = this.props.brandFilter;
            var limit = this.props.searchLimit;
            var dealerPromise = this.dealerService.findDealers(loc, distance, limit, brand);
            dealerPromise.then(dealers => this.updateDealers(dealers))
        });

    }

    /**
     * Update dealer list
     * @param Array dealers
     */
    updateDealers(dealers) {
        this.setState({
            dealers: dealers
        });

        this.clearLocations();
        //var bounds = new google.maps.LatLngBounds();
        var map = this.map;
        var infoWindow = this.infoWindow;
        var markers = this.markers;

        let zoomBounds = new google.maps.LatLngBounds(this.center);
        let nbContactZoomBounds = this.props.nbContactZoomBounds;
        console.log('nbContactZoomBounds', nbContactZoomBounds);

        dealers.forEach(function (dealer, i) {

            var latlng = new google.maps.LatLng(
                parseFloat(dealer.latitude),
                parseFloat(dealer.longitude));

            if (nbContactZoomBounds == 0 || i < nbContactZoomBounds) {
                console.log('adding zoom bounds to ', i, dealer.distance_from_place);
                zoomBounds.extend(latlng);
            }

            var marker = new google.maps.Marker({
                map: map,
                position: latlng
            });
            var html = "<b>" + dealer.contact_name + "</b> <br />" + dealer.city;
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(html);
                infoWindow.open(map, marker)
            });
            markers.push(marker);

        })

        if (dealers.length > 0) {
            console.log('Fitbounds');
            this.map.fitBounds(zoomBounds);
        } else {
            // todo set the zoom somewhere else
        }
    }

    /**
     * Clear previous markers from the map
     */
    clearLocations() {
        this.infoWindow.close();
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers.length = 0;
    }


    /**
     * Query dealers around central place
     * @param {Object} place
     */
    updateCentralPlace(place) {

        if (!place.geometry) {
            window.alert('Autocomplete\'s returned place contains no geometry');
            return;
        }


        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);

        } else {
            this.map.setCenter(place.geometry.location);
         //   this.map.setZoom(17);  // Why 17? Because it looks good.
        }


        //var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: this.map,
            anchorPoint: new google.maps.Point(0, -29)
            //anchorPoint: EIFFEL_TOWER_POSITION
        });

        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
/*
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(this.map, marker);*/
    }

    getCenter() {
        var initialCenter = this.props.initialCenter;
        console.log('initialCenter', initialCenter);
        return initialCenter;
    }

    render() {
        const mapStyle = {
            width: '100%',
            height: '50%'
        };

        var center = this.getCenter();

        return (
            <div className="dealer_locator_widget">
                <div className="dealer_locator_widget_controls" ref="dealer_locator_widget_controls">
                    <input id="dealer_locator_control_autocomplete" ref="pac_input" className="controls dealer_locator_control_autocomplete" type="text" placeholder="Enter a location"/>
                </div>
                <div ref="map" style={mapStyle}>I should be a map!</div>
                <div className="dealer_locator_list">
                    <ul>
                        {this.state.dealers.map(function(dealer) {
                            return (

                                <li key={dealer.contact_id}>
                                    <div className="distance">
                                        <p>{dealer.distance_from_place}</p>
                                        <p>{dealer.total}</p>
                                    </div>
                                    <img src="http://lorempixum.com/100/100/nature/1" />
                                    <h3>{dealer.contact_name}</h3>
                                    <address>
                                        {dealer.street}<br />
                                        {dealer.city}, {dealer.state_reference} {dealer.zipcode}<br />
                                        <abbr title="Phone">Phone:</abbr> {dealer.phone}<br />
                                        <a href="mailto:{dealer.email}">{dealer.email}</a>
                                    </address>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );

    }

    // clean up event listeners when component unmounts
    componentDidUnMount() {
        google.maps.event.clearListeners(this.autocomplete, 'place_changed');
    }
}

export default DealerLocator;