import React from 'react';
import ReactDOM from 'react-dom';
//import MainView from './mainView';
//import MyMap from './map/maps';
import DealerLocator from './dealer/dealer_locator.jsx';

//var mainView = React.createElement(MainView,{name:'there'},null);
//ReactDOM.render(mainView, document.getElementById('main'));

//var myMap = React.createElement(MyMap, {}, null);
var dealerLoc = React.createElement(DealerLocator, {}, null);

ReactDOM.render(
    dealerLoc,
    document.getElementById('root')
);