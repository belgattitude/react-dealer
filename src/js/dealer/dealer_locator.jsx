import React from 'react';
import DealerService from './dealer_service';
import DealerMapMarker from './dealer_map_marker';
import DealerList from './dealer_list';
import 'whatwg-fetch';
import '../../css/dealer/dealer_locator.scss';
import 'font-awesome/css/font-awesome.css';


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
        mapTypeControl: React.PropTypes.bool,
        // Optional
        googleMap: React.PropTypes.objectOf(google.maps.Map),
        mapRefName: React.PropTypes.string,
        nbContactZoomBounds: React.PropTypes.number,
        searchDistance: React.PropTypes.number,
        searchLimit: React.PropTypes.number,
        brandFilter: React.PropTypes.string,
        mapControlPosition: React.PropTypes.number,
        mapStylers: React.PropTypes.array
    }

    static defaultProps = {
        googleMap: null,
        mapRefName: 'mapCanvas',
        nbContactZoomBounds: 0,
        searchDistance: 25,
        searchLimit: 100,
        mapTypeControl: false,
        mapStyle: {
            width: '100%',
            height: '50%'
        },
        mapControlPosition: google.maps.ControlPosition.TOP_RIGHT,
        mapStylers: [
            {'saturation': -30}
        ]
    }


    language = 'en';
    dealerService = null;
    dealerMapMarker = null;
    markers = [];
    homeMarker = null;
    infoWindow = null;
    center = null;

    constructor(props) {
        super(props);


        this.dealerService = new DealerService({
            language: this.language,
            source: props.source
        });

        this.dealerMapMarker = new DealerMapMarker();

        this.infoWindow = new google.maps.InfoWindow();

    }


    /**
     * Set map to default position
     *
     */
    setDefaultPosition() {
        // Set center location
        let center = this.getCenter();
        this.searchDealers({
            place: {
                lat: center.lat,
                lng: center.lng
            },
            country: null
        });
    }


    componentDidMount() {

        this.initializeMap();

        // Add autocomplete input and controls to the Map
        var pac_input = /** @type {!HTMLInputElement} */
            this.refs.pac_input;
        var controls = this.refs.dealer_locator_widget_controls;
        this.initializeAutocomplete(pac_input);

        this.map.controls[this.props.mapControlPosition].push(controls);

        this.requestCurrentPosition();

    }


    initializeMap() {
        if (this.props.googleMap !== null) {
            this.map = this.props.googleMap;
        } else {

            this.map = new google.maps.Map(this.refs.map, {
                center: this.getCenter(),
                zoom: 16,
                scrollwheel: false,
                mapTypeControl: this.props.mapTypeControl,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.VERTICAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_RIGHT
                },
                styles: [{
                    'stylers': this.props.mapStylers
                }]
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
            this.onAutocompletePlaceChanged(this.autocomplete);
        });

    }

    onAutocompletePlaceChanged(autocomplete) {

        // Step 1: Get the place and test if ok
        let autocompletePlace = autocomplete.getPlace();
        if (!autocompletePlace.geometry) {
            window.alert('Autocomplete\'s returned place contains no geometry');
            return;
        }

        // Step 2: Create a marker and center map around
        if (autocompletePlace.geometry.viewport) {
            // Some places may have a viewport, let's use it if any
            // to center the map
            this.map.fitBounds(autocompletePlace.geometry.viewport);
        } else {
            // Otherwise it's a regular place, let's center the map
            this.map.setCenter(autocompletePlace.geometry.location);
            //   this.map.setZoom(17);  // Why 17? Because it looks good.
        }

        var homeIcon = {
            path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
            fillColor: 'yellow',
            fillOpacity: 0.8,
            scale: 1,
            strokeColor: 'gold',
            strokeWeight: 14
        };


        if (this.homeMarker === null) {

            this.homeMarker = new google.maps.Marker({
                map: this.map,
                anchorPoint: new google.maps.Point(0, -29),
                icon: {
                    //url: autocompletePlace.icon,
                    path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                    fillColor: 'yellow',
                    fillOpacity: 0.8,
                    scale: 0.5,
                    strokeColor: 'gold',
                    strokeWeight: 6
                }
            });


        }
        this.homeMarker.setPosition(autocompletePlace.geometry.location);
        this.homeMarker.setVisible(true);


        // Get the country (optional)
        let country = '';
        for (var i = 0; i < autocompletePlace.address_components.length; i++) {
            let addressType = autocompletePlace.address_components[i].types[0];
            if (addressType == 'country') {
                country = autocompletePlace.address_components[i].short_name;
            }
        }

        let place = {
            lat: autocompletePlace.geometry.location.lat(),
            lng: autocompletePlace.geometry.location.lng()
        };
        this.searchDealers({place: place, country: country});

    }

    /**
     * Trigger dealer search around a place
     * @param {Object} params
     */
    searchDealers(params) {

        let place = params.place;
        let country = params.country;
        let distance = this.props.searchDistance,
            brand = this.props.brandFilter,
            limit = this.props.searchLimit;

        place.country = country;

        this.setCenter({
            lat: place.lat,
            lng: place.lng
        });

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
        //console.log('nbContactZoomBounds', nbContactZoomBounds);

        dealers.forEach((dealer, i) => {
            let latlng = new google.maps.LatLng(
                parseFloat(dealer.latitude),
                parseFloat(dealer.longitude)
            );

            if (nbContactZoomBounds == 0 || i < nbContactZoomBounds) {
                //console.log('adding zoom bounds to ', i, dealer.distance_from_place);
                zoomBounds.extend(latlng);
            }

            var markerProps = this.dealerMapMarker.getDealerMarkerProps(i, dealer);

            var icon = markerProps.icon;
            icon.labelOrigin = new google.maps.Point(0, -24);
            icon.anchor = new google.maps.Point(9,35);


            var marker = new google.maps.Marker({
                map: this.map,
                //draggable: true,
                //raiseOnDrag: true,
                position: latlng,

                label: {
                    text: markerProps.label,
                    color: 'black',
                    fontSize: '15px',
                    fontFamily: 'Roboto'
                    /*fontWeight: 'bold'*/
                },
                //labelContent: '<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
                //labelAnchor: new google.maps.Point(22, 50),
                icon: icon

            });
            google.maps.event.addListener(marker, 'click', () => {
                this.openMarkerInfoWindow(marker, dealer);
            });
            this.markers[dealer.contact_id] = marker;
        })

        if (dealers.length > 0) {
            //console.log('Fitbounds');
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
        let placeHolder = 'Enter your location';
        return (
            <div className="dealer_locator_widget">
                <div className="dealer_locator_widget_controls" ref="dealer_locator_widget_controls">
                    <input id="dealer_locator_control_autocomplete" ref="pac_input"
                           className="controls dealer_locator_control_autocomplete" type="text"
                           placeholder={ placeHolder }/>
                    <button type="button" className="ac-input-icon ac-input-icon-pin">
                        <svg viewBox="0 0 14 20" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C5.62 9.5 4.5 8.38 4.5 7S5.62 4.5 7 4.5 9.5 5.62 9.5 7 8.38 9.5 7 9.5z"/>
                        </svg>
                    </button>
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


    /**
     * Request current navigator position
     *
     */
    requestCurrentPosition() {
        //
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                //console.log('My position = ', position);
                //let center = this.getCenter();
                this.searchDealers({
                    place: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    country: null
                });
            }, (positionError) => {
                //console.log('positionError', positionError);
                // Firefox seems to doesn't work
                // Let's try with the freegeoip
                //

                this.setDefaultPosition();
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            console.log('Setting default position, not supported');
            this.setDefaultPosition();
        }
    }

    /*
     requestPositionFromIp() {
     let headers = new Headers();
     headers.append('Accept', 'application/json');
     fetch("https://freegeoip.net/json/", {method: 'get', headers: headers})
     .then((response) => {
     if (response.status >= 200 && response.status < 300) {
     return response
     } else {
     var error = new Error(response.statusText)
     //error = response
     throw error
     }
     })
     .then((response) => {
     return response.json();
     })
     .then((json) => {
     let place = {
     lat: json.latitude,
     lng: json.longitude,
     country: json.country_code
     }
     console.log('freedata', json);
     })
     .catch(function (ex) {
     console.log('Cannot get ', ex)
     });

     }
     */

}

export default DealerLocator;