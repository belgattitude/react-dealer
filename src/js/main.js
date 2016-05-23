import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './mainView';
import MyMap from './map/maps';

var mainView = React.createElement(MainView,{name:'there'},null);

ReactDOM.render(mainView, document.getElementById('main'));


var myMap = React.createElement(MyMap, {}, null);


ReactDOM.render(
    myMap,
    document.getElementById('root')
);