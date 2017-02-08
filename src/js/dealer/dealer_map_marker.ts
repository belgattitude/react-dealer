import "babel-polyfill";

export default class DealerMapMarker {


    constructor() {

    }

    /**
     *
     * @param i
     * @param dealer
     * @returns {{icon: {path: string, fillColor: string, fillOpacity: number, scale: number, strokeColor: string, strokeWeight: number}, label: string}}
     */
    getDealerMarkerProps(i: number, dealer: Object) : Object {
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let length = labels.length;
        // See the http://map-icons.com/ website
        // check for the marker called MAP_PIN

        let icon = {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: '#1998F7',
            fillOpacity: (i < length) ? 0.6 : 0.3,
            scale: 0.7,
            strokeColor: '#1998F7',
            strokeWeight: (i < length) ? 4 : 2
        };

        return {
            icon: icon,
            label: (i < length) ? labels[i % labels.length] : ' '
        };
    }


}


