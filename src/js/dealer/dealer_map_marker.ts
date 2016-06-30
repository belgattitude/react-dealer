import "babel-polyfill";

export default class DealerMapMarker {


    constructor() {
    }

    getDealerMarkerProps(i: number, dealer: Object) : Object {
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var length = labels.length;

        var icon = {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: '#1998F7',
            fillOpacity: 0.6,
            scale: 0.7,
            strokeColor: '#1998F7',
            strokeWeight: 4
        };

        return {
            icon: icon,
            label: (i < length) ? labels[i % labels.length] : '*'
        };
    }


}


