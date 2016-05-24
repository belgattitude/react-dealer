import React from 'react';
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
        this.panToArcDeTriomphe = this.panToArcDeTriomphe.bind(this);
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.refs.map, {
            center: EIFFEL_TOWER_POSITION,
            zoom: 16
        });
    }

    panToArcDeTriomphe() {
        console.log(this)
        this.map.panTo(ARC_DE_TRIOMPHE_POSITION);
    }

    render() {
        const mapStyle = {
            width: 500,
            height: 300,
            border: '1px solid black'
        };

        return (
            <div>
                <button onClick={this.panToArcDeTriomphe}>Go to Arc De Triomphe</button>
                <input id="pac-input" class="controls" type="text" placeholder="Enter a location" />
                <div id="type-selector" class="controls">
                    <input type="radio" name="type" id="changetype-all" checked="checked"/>
                    <label for="changetype-all">All</label>

                    <input type="radio" name="type" id="changetype-establishment"/>
                    <label for="changetype-establishment">Establishments</label>

                    <input type="radio" name="type" id="changetype-address"/>
                    <label for="changetype-address">Addresses</label>

                    <input type="radio" name="type" id="changetype-geocode"/>
                    <label for="changetype-geocode">Geocodes</label>
                </div>

                <div ref="map" style={mapStyle}>I should be a map!</div>
            </div>
        );
    }
}

export default DealerLocator;