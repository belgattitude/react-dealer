import React from 'react';
import {observable} from 'mobx';
import DealerService from './dealer_service';
import DealerList from './dealer_list';
import '../../css/dealer/dealer_locator.scss';

class DealerLocator extends React.Component {

    static propTypes = {
        // Required
        initialCenter: React.PropTypes.shape({
            lat: React.PropTypes.number.isRequired,
            lng: React.PropTypes.number.isRequired
        }),
        source: React.PropTypes.string.isRequired,
        // Map style
        mapStyle: React.PropTypes.shape({
            width: React.PropTypes.string,
            height: React.PropTypes.string
        }),
        // Optional
        googleMap: React.PropTypes.objectOf(google.maps.Map),
        mapRefName: React.PropTypes.string,
        nbContactZoomBounds: React.PropTypes.number,
        searchDistance: React.PropTypes.number,
        searchLimit: React.PropTypes.number,
        brandFilter: React.PropTypes.string
    }

    static defaultProps = {
        googleMap: null,
        mapRefName: 'mapCanvas',
        nbContactZoomBounds: 0,
        searchDistance: 25,
        searchLimit: 100,
        mapStyle: {
            width: '100%',
            height: '50%'
        }
    }


    language = 'en';
    dealerService = null;
    markers = [];
    infoWindow = null;
    center = null;

    constructor(props) {
        super(props);

        this.dealerService = new DealerService({
            language: this.language,
            source: props.source
        });

        this.infoWindow = new google.maps.InfoWindow();
    }


    componentDidMount() {

        this.initializeMap();

        // Add autocomplete input and controls to the Map
        var pac_input = /** @type {!HTMLInputElement} */
            this.refs.pac_input;
        var controls = this.refs.dealer_locator_widget_controls;
        this.initializeAutocomplete(pac_input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(controls);

        // Set center location
        let center = this.getCenter();
        this.searchDealers({
            place: {
                lat: center.lat,
                lng: center.lng
            }
        });
    }


    initializeMap() {
        if (this.props.googleMap !== null) {
            this.map = this.props.googleMap;
        } else {

            this.map = new google.maps.Map(this.refs.map, {
                center: this.getCenter(),
                zoom: 16,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_RIGHT
                }
            })
        }
    }


    /**
     *
     * @param {!HTMLInputElement} pac_input
     */
    initializeAutocomplete(pac_input) {
        let acOptions = {
            types: ['geocode'],
            language: this.language
            //componentRestrictions: {country: 'fr'}
        };

        // init autocomplete
        this.autocomplete = new google.maps.places.Autocomplete(pac_input, acOptions);

        // Add listener for changed place
        this.autocomplete.addListener('place_changed', () => {
            // Get to the place
            let autocompletePlace = this.autocomplete.getPlace();

            let place = {
                lat: autocompletePlace.geometry.location.lat(),
                lng: autocompletePlace.geometry.location.lng()
            };
            this.setCenter(place);
            this.updateCentralPlace(autocompletePlace);
            this.searchDealers({place: place});

        });

    }

    /**
     * Trigger dealer search around a place
     * @param {Object} params
     */
    searchDealers(params) {

        let place = params.place;
        let distance = this.props.searchDistance,
            brand = this.props.brandFilter,
            limit = this.props.searchLimit;

        this.dealerService.searchDealers(place, distance, limit, brand).then(
            (dealers) => {
                this.updateMapMarkers(dealers.data);
            }
        );

    }


    /**
     * Update map markers
     * @param Array dealers
     */
    updateMapMarkers(dealers) {

        this.clearLocations();

        let center = this.getCenter();
        let zoomBounds = new google.maps.LatLngBounds(new google.maps.LatLng(
            center.lat,
            center.lng
        ));

        let nbContactZoomBounds = this.props.nbContactZoomBounds;
        console.log('nbContactZoomBounds', nbContactZoomBounds);

        dealers.forEach((dealer, i) =>  {
            let latlng = new google.maps.LatLng(
                parseFloat(dealer.latitude),
                parseFloat(dealer.longitude)
            );

            if (nbContactZoomBounds == 0 || i < nbContactZoomBounds) {
                console.log('adding zoom bounds to ', i, dealer.distance_from_place);
                zoomBounds.extend(latlng);
            }

            var marker = new google.maps.Marker({
                map: this.map,
                position: latlng
            });
            /*
            var html = "<b>" + dealer.contact_name + "</b> <br />" + dealer.city;
            google.maps.event.addListener(marker, 'click', () => {
                this.infoWindow.setContent(html);
                this.infoWindow.open(this.map, marker)
            });*/
            google.maps.event.addListener(marker, 'click', () => {
                this.openMarkerInfoWindow(marker, dealer);
            });
            this.markers[dealer.contact_id] = marker;
        })

        if (dealers.length > 0) {
            console.log('Fitbounds');
            this.map.fitBounds(zoomBounds);
        } else {
            // todo set the zoom somewhere else
        }
    }

    openMarkerInfoWindow(marker, dealer) {
        var html = '<b>' + dealer.contact_name + '</b> <br />' + dealer.city;
        //google.maps.event.addListener(marker, 'click', () => {
        this.infoWindow.setContent(html);
        this.infoWindow.open(this.map, marker)
        //});

    }

    /**
     * Clear previous markers from the map
     */
    clearLocations() {
        this.infoWindow.close();
        this.markers.forEach(marker => {
            marker.setMap(null);
        })
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

    setCenter(center) {
        this.center = center;
    }

    getCenter() {
        if (this.center === null) {
            this.center = this.props.initialCenter;
        }
        return this.center;
    }

    render() {
        let dealerService = this.dealerService;
        return (
            <div className="dealer_locator_widget">
                <div className="dealer_locator_widget_controls" ref="dealer_locator_widget_controls">
                    <input id="dealer_locator_control_autocomplete" ref="pac_input"
                           className="controls dealer_locator_control_autocomplete" type="text"
                           placeholder="Enter a location"/>
                </div>
                <div ref="map" style={this.props.mapStyle}>I should be a map!</div>
                <DealerList dealerService={dealerService}
                            onDealerClick={ (dealer) => { this.handleDealerListClick(dealer) } }>
                </DealerList>
            </div>
        );
    }

    handleDealerListClick(dealer) {
        let contact_id = dealer.contact_id;
        if (this.markers[contact_id]) {
            this.openMarkerInfoWindow(this.markers[contact_id], dealer);
        }
    }

    // clean up event listeners when component unmounts
    componentDidUnMount() {
        google.maps.event.clearListeners(this.autocomplete, 'place_changed');
    }
}

export default DealerLocator;