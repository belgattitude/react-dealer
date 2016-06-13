import React from 'react';
import ReactDOM from 'react-dom';
import DealerLocator from './dealer/dealer_locator.jsx';
//import DealerMap from './dealer/dealer_map';

var dealerLoc = React.createElement(DealerLocator, {
    apiUrl: 'http://localhost/emdmusic_server/public/api/v1/dealer'
}, null);
ReactDOM.render(
    dealerLoc,
    document.getElementById('root')
);