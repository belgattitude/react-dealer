import React from 'react';
import ReactDom from 'react-dom';
import DealerService from './dealer_service';
import '../../css/dealer/dealer_locator.scss';


const EIFFEL_TOWER_POSITION = {
    lat: 48.858608,
    lng: 2.294471
};

class DealerLocator extends React.Component {

    static propTypes = {
        initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
        mapRefName: React.PropTypes.string,
        googleMap: React.PropTypes.objectOf(google.maps.Map),
        apiUrl: React.PropTypes.string
    }

    static defaultProps = {
        mapRefName: 'mapCanvas'
    }

    language = 'en';
    dealerService = null;
    markers = [];
    infoWindow = null;

    constructor(props) {
        super(props);

        this.dealerService = new DealerService({
            language: this.language,
            url: props.apiUrl
        });

        this.infoWindow = new google.maps.InfoWindow();
    }


    initializeMap() {
        this.map = new google.maps.Map(this.refs.map, {
            center: EIFFEL_TOWER_POSITION,
            zoom: 16
        });
    }
/*
    getCurrentBounds() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                return circle.getBounds();

            });
        } else {
            return false;
        }

    }
*/
    initializeAutocomplete(input) {

        var acOptions = {
            types: ['geocode'],
            language: this.language,
            //componentRestrictions: {country: 'fr'}
        };

        this.autocomplete = new google.maps.places.Autocomplete(input, acOptions);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        //this.autocomplete.bindTo('bounds', this.map);
        this.autocomplete.addListener('place_changed', () => {
            // Get to the place
            var place = this.autocomplete.getPlace();
            this.updateCentralPlace(place);

            // Get dealers and add markers
            var loc = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  distance: 25,
                  brand: 'STAG'
            };

            var dealerPromise = this.dealerService.findDealers(loc);
            dealerPromise.then(dealers => this.updateDealers(dealers))

        });

    }

    /**
     * Update dealer list
     * @param Array dealers
     */
    updateDealers(dealers) {

        this.clearLocations();

        var bounds = new google.maps.LatLngBounds();
        var map = this.map;
        var infoWindow = this.infoWindow;
        var markers = this.markers;

        dealers.forEach(function(dealer) {
            //console.log('dealer', dealer);

            var latlng = new google.maps.LatLng(
                parseFloat(dealer.latitude),
                parseFloat(dealer.longitude));

            bounds.extend(latlng);

            var marker = new google.maps.Marker({
                map: map,
                position: latlng
            });
            var html = "<b>" + dealer.contact_name + "</b> <br />" + dealer.city;
            google.maps.event.addListener(marker, 'click', function() {
               infoWindow.setContent(html);
               infoWindow.open(map, marker)
            });
            markers.push(marker);

        })

        //this.map.fitBounds(bounds);
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


    componentDidMount() {

        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('dealer-locator-autocomplete'));

        this.initializeMap();
        this.initializeAutocomplete(input);

    }

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
            this.map.setZoom(17);  // Why 17? Because it looks good.
        }


        var infowindow = new google.maps.InfoWindow();
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

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(this.map, marker);

    }

    getCenter() {
        var initialCenter = { lng: -90.1056957, lat: 29.9717272 }
        return initialCenter;
    }


    render() {
        const mapStyle = {
            width: '100%',
            height: '100%',
            border: '1px solid black'
        };

        var center = this.getCenter();

        return (
            <div>
                <input id="dealer-locator-autocomplete" class="controls" type="text" placeholder="Enter a location" />
                <div ref="map" style={mapStyle}>I should be a map!</div>
            </div>
        );

    }

    // clean up event listeners when component unmounts
    componentDidUnMount() {
        google.maps.event.clearListeners(this.autocomplete, 'place_changed');
    }
}

export default DealerLocator;