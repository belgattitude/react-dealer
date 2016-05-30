import React from 'react';
import DealerMap from './dealer_map.jsx';
import DealerService from './dealer_service';
import '../../css/dealer/dealer_locator.css';

const ARC_DE_TRIOMPHE_POSITION = {
    lat: 48.873947,
    lng: 2.295038
};

const EIFFEL_TOWER_POSITION = {
    lat: 48.858608,
    lng: 2.294471
};

class DealerLocator extends React.Component {
    constructor(props) {
        super(props);
        this.dealerService = new DealerService();

        this.panToArcDeTriomphe = this.panToArcDeTriomphe.bind(this);


    }


    initializeMap() {

        this.map = new google.maps.Map(this.refs.map, {
            center: EIFFEL_TOWER_POSITION,
            zoom: 16
        });

    }

    initializeAutocomplete(input) {
        this.autocomplete = new google.maps.places.Autocomplete(input);
        //this.autocomplete.bindTo('bounds', this.map);
        this.autocomplete.addListener('place_changed', () => {
            var place = this.autocomplete.getPlace();
            var dealers = this.dealerService.findDealers();

            

            console.log('dealers', dealers);
            this.updatePlace(place);
        });


        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    }

    componentDidMount() {

        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('dealer-locator-autocomplete'));

        this.initializeMap();
        this.initializeAutocomplete(input);

    }

    updatePlace(place) {



        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
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


    panToArcDeTriomphe() {
        console.log(this)
        this.map.panTo(ARC_DE_TRIOMPHE_POSITION);
    }

    render() {
        const mapStyle = {
            width: 500,
            height: 350,
            border: '1px solid black'
        };

        var center = this.getCenter();

        return (
            <div>
                <button onClick={this.panToArcDeTriomphe}>Go to Arc De Triomphe</button>

                <input id="dealer-locator-autocomplete" class="controls" type="text" placeholder="Enter a location" />
                <div ref="map" style={mapStyle}>I should be a map!</div>
            </div>
        );

        return (
            <div>
                <button onClick={this.panToArcDeTriomphe}>Go to Arc De Triomphe</button>

                <input id="dealer-locator-autocomplete" class="controls" type="text" placeholder="Enter a location" />
                <DealerMap initialCenter={center}
                           mapRefName="dealer-google-map"
                           googleMap={this.map}
                />
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