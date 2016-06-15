import 'whatwg-fetch';
import {Promise} from 'es6-promise';


class DealerService {

    options = {
        language: 'en',
        
    };
    
    constructor(options) {
        this.options = options;

    }

    /**
     *
     * @param place
     * @param distance
     * @param limit
     * @param brand
     * @returns {Promise<T>|*|Promise|Promise<U>|Promise.<T>}
     */
    findDealers(place, distance, limit, brand) {

        var source = this.options.source;
        var params = {
            lat: place.lat,
            lng: place.lng,
            distance: distance,
            brand: brand,
            limit: limit,
            language: this.options.language,
        };

        // Setting url with search params
        var url = new URL(source);
        var searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
                searchParams.append(key, params[key])
            }
        );
        url.search = searchParams.toString();
        var api_url = url.toString();

        var checkStatus = function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }

        var parseJson = function(response) {
            return new Promise((resolve) => {
                response.json().then(jsonResponse => {
                    resolve(jsonResponse.data);
                });
            });
        }

        var fetchParams = {
            // mode: 'no-cors',
            // credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        };

        return fetch(api_url, fetchParams)
            .then(checkStatus)
            .then(parseJson)
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    }

}

export default DealerService;

