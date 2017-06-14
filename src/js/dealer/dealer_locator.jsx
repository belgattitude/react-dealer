import React from 'react';
import DealerService from './dealer_service';
import DealerMapMarker from './dealer_map_marker';
import DealerLocale from './dealer_locale';
import DealerList from './dealer_list';
import 'whatwg-fetch';
import '../../css/dealer/dealer_locator.scss';
//import 'font-awesome/css/font-awesome.css';


export default class DealerLocator extends React.Component {

    static propTypes = {
        // Required
        initialCenter: React.PropTypes.shape({
            lat: React.PropTypes.number.isRequired,
            lng: React.PropTypes.number.isRequired
        }),
        source: React.PropTypes.string.isRequired,
        locale: React.PropTypes.string,
        display_dealer_stats: React.PropTypes.bool,

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
        locale: 'en_US',
        mapRefName: 'mapCanvas',
        nbContactZoomBounds: 0,
        searchDistance: 25,
        searchLimit: 100,
        mapTypeControl: false,
        mapStyle: {
            width: '100%',
            height: '50%'
        },
        display_dealer_stats: false,
        mapControlPosition: google.maps.ControlPosition.TOP_RIGHT,
        mapStylers: [
            {'saturation': -30}
        ]
    }



    dealerService = null;
    dealerMapMarker = null;
    dealerLocale = null;
    markers = [];
    homeMarker = null;
    infoWindow = null;
    center = null;



    constructor(props) {
        super(props);

        this.dealerLocale = new DealerLocale(this.props.locale);

        this.dealerService = new DealerService({
            language: this.dealerLocale.getLanguage(),
            source: props.source
        });

        this.dealerMapMarker = new DealerMapMarker();

        this.infoWindow = new google.maps.InfoWindow();
        this.state = {
            isInputAddressValid: true,
            isLoading: false
        };


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
            // Set types to geocode to prevent results with
            // business addresses as well
            //types: ['geocode'],
            language: this.language
            //componentRestrictions: {country: 'fr'}
        };

        // init autocomplete
        this.autocomplete = new google.maps.places.Autocomplete(pac_input, acOptions);

        // Add listener for changed place
        this.autocomplete.addListener('place_changed', () => {
            this.setState({isInputAddressValid: true})
            this.onAutocompletePlaceChanged(this.autocomplete);
        });

    }

    onAutocompletePlaceChanged(autocomplete) {

        // Step 1: Get the place and test if ok
        let autocompletePlace = autocomplete.getPlace();
        if (!autocompletePlace.geometry) {
            console.log('No geometry, user didn\'t select an item from the autosuggested places');
            this.setState({isInputAddressValid:  false});
            //window.alert('Autocomplete\'s returned place contains no geometry');
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

        // When a new search is called, let's clear all
        // previous markers
        this.clearLocations();

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

        this.setState({isLoading: true});
        this.dealerService.searchDealers(place, distance, limit, brand).then(
            (dealers) => {
                this.setState({isLoading: false});
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

/*
            let svgIconTemplate = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="23px" height="32px" viewBox="0 0 23 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 41.1 (35376) - http://www.bohemiancoding.com/sketch -->
        <title>Pin</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Dealer-Locator" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="DealerLocator" transform="translate(-635.000000, -306.000000)">
        <g id="Group">
        <g id="DealerLocator">
        <g id="GoogleMap">
        <g id="Pin" transform="translate(635.000000, 306.000000)">
        <path d="M11.2119,18.4238 C7.2349,18.4238 3.9999,15.1878 3.9999,11.2118 C3.9999,7.2358 7.2349,3.9998 11.2119,3.9998 C15.1889,3.9998 18.4239,7.2358 18.4239,11.2118 C18.4239,15.1878 15.1889,18.4238 11.2119,18.4238 M11.2119,-0.0002 C5.0209,-0.0002 -0.0001,5.0198 -0.0001,11.2118 C-0.0001,11.6858 0.0379,12.1478 0.0959,12.6058 C1.0539,21.3618 10.4829,31.4578 10.4829,31.4578 C10.6509,31.6448 10.8139,31.7638 10.9699,31.8478 C10.9719,31.8498 10.9759,31.8498 10.9779,31.8518 C11.0859,31.9078 11.1919,31.9498 11.2919,31.9498 C11.3919,31.9498 11.4979,31.9078 11.6069,31.8518 C11.6079,31.8498 11.6119,31.8498 11.6139,31.8478 C11.7709,31.7638 11.9329,31.6448 12.1009,31.4578 C12.1009,31.4578 21.3959,21.3478 22.3299,12.5878 C22.3859,12.1358 22.4239,11.6778 22.4239,11.2118 C22.4239,5.0198 17.4029,-0.0002 11.2119,-0.0002" id="Fill-1" fill-opacity="0.75" fill="#000000"></path>
        <path d="M13.877,14.9854 C13.267,15.5064 12.405,15.7674 11.292,15.7674 C10.154,15.7674 9.261,15.5104 8.609,14.9974 C7.957,14.4834 7.632,13.7774 7.632,12.8794 L9.355,12.8794 C9.41,13.2734 9.521,13.5684 9.684,13.7634 C9.982,14.1194 10.495,14.2974 11.221,14.2974 C11.655,14.2974 12.009,14.2504 12.28,14.1564 C12.795,13.9764 13.052,13.6424 13.052,13.1544 C13.052,12.8694 12.926,12.6484 12.674,12.4924 C12.422,12.3394 12.022,12.2054 11.475,12.0884 L10.54,11.8824 C9.62,11.6794 8.989,11.4594 8.646,11.2204 C8.064,10.8224 7.773,10.1994 7.773,9.3514 C7.773,8.5784 8.057,7.9354 8.627,7.4234 C9.196,6.9124 10.032,6.6564 11.136,6.6564 C12.057,6.6564 12.843,6.8974 13.493,7.3804 C14.144,7.8624 14.485,8.5624 14.517,9.4804 L12.782,9.4804 C12.75,8.9614 12.518,8.5914 12.085,8.3734 C11.797,8.2284 11.439,8.1564 11.01,8.1564 C10.533,8.1564 10.153,8.2504 9.869,8.4374 C9.585,8.6254 9.442,8.8864 9.442,9.2224 C9.442,9.5314 9.583,9.7614 9.863,9.9144 C10.043,10.0154 10.426,10.1344 11.011,10.2714 L12.526,10.6294 C13.19,10.7854 13.689,10.9944 14.02,11.2564 C14.534,11.6624 14.792,12.2504 14.792,13.0194 C14.792,13.8084 14.487,14.4644 13.877,14.9854 M11.212,4.7224 C7.634,4.7224 4.722,7.6334 4.722,11.2124 C4.722,14.7904 7.634,17.7024 11.212,17.7024 C14.79,17.7024 17.702,14.7904 17.702,11.2124 C17.702,7.6334 14.79,4.7224 11.212,4.7224" id="Fill-4" fill-opacity="0.5" fill="#020302"></path>
            </g>
            </g>
            </g>
            </g>
            </g>
            </g>
            </svg>`;
*/

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

                },
                //labelContent: '<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
                //labelAnchor: new google.maps.Point(22, 50),
                icon: icon
//                icon: { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgIconTemplate) }

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

        let homepage = dealer.homepage;
        let prefixed_homepage = homepage;
        if (!/^https?:\/\//i.test(homepage)) {
            prefixed_homepage = 'http://' + homepage;
        }

        let street = dealer.street;
        if (dealer.street_number !== null) {
            street = dealer.street_number + ' ' + street;
         }


        var html = `
            <div class="dealer_marker_popup">
                <div class="dealer_marker_popup_name">
                    ${ dealer.contact_name }
                </div>
                <div class="dealer_marker_popup_address">${street}, ${dealer.city}</div>
                <div class="dealer_marker_popup_phone">
                    <a>${dealer.phone}</a>
                </div>
                
                <div class="dealer_marker_popup_email">
                    <a href="mailto:${ dealer.email }">${dealer.email}</a>
                </div>
                <div class="dealer_marker_popup_homepage">
                    <a target="_blank" href="${prefixed_homepage}">${homepage}</a>
                </div>
            </div>    
        `;
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
        let placeHolder = this.dealerLocale.translate('enter_location');
        let inputAddressErrorClass = this.state.isInputAddressValid ? '' : 'error';


        let isLoading = this.state.isLoading;
        let placeIcon =
                <svg viewBox="0 0 14 20" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                     <path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C5.62 9.5 4.5 8.38 4.5 7S5.62 4.5 7 4.5 9.5 5.62 9.5 7 8.38 9.5 7 9.5z"/>
                </svg>;

        let loadingIcon =
                <svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="uil-spin"><rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect><g transform="translate(50 50)"><g transform="rotate(0) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="0s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(45) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="0.25s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.25s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(90) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="0.5s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.5s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(135) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="0.75s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.75s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(180) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="1s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="1s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(225) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="1.25s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="1.25s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(270) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="1.5s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="1.5s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(315) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#000"><animate attributeName="opacity" from="1" to="0.1" begin="1.75s" dur="2s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="1.75s" dur="2s" repeatCount="indefinite"></animateTransform></circle></g></g></svg>


        return (
            <div className="dealer_locator_widget">
                <div className="dealer_locator_widget_controls" ref="dealer_locator_widget_controls">
                    <input id="dealer_locator_control_autocomplete" ref="pac_input"
                           className={'controls dealer_locator_control_autocomplete ' + inputAddressErrorClass} type="text"
                           placeholder={ placeHolder } />
                    <button type="button" className="ac-input-icon ac-input-icon-pin">
                        { isLoading ? loadingIcon : placeIcon }
                    </button>

                </div>
                <div ref="map" style={ this.props.mapStyle }>I should be a map!</div>


                <DealerList dealerService={ dealerService }
                            onDealerClick={ (dealer) => { this.handleDealerListClick(dealer) } }
                            display_dealer_stats={ this.props.display_dealer_stats }
                            dealerLocale={ this.dealerLocale }>
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

//export default DealerLocator;