import React from 'react';
import ReactDOM from 'react-dom';
import DealerLocator from './dealer/dealer_locator';

const EIFFEL_TOWER_POSITION = {
    lat: 48.858608,
    lng: 2.294471
};



var dealerLoc = React.createElement(DealerLocator, {
    initialCenter: EIFFEL_TOWER_POSITION,
    source: 'http://localhost/emdmusic_server/public/api/v1/dealer',
    brandFilter: 'STAG',
    mapStyle: {
        width: '100%',
        height: '50%'
    },
    searchDistance: 200,
    searchLimit: 100,
    nbContactZoomBounds: 5,
    zoomBoundsMaxDistance: 5
}, null);
ReactDOM.render(
    dealerLoc,
    document.getElementById('dealer_map')
);