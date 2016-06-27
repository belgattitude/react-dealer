import 'whatwg-fetch';
import { Promise } from 'es6-promise';
import { observable } from 'mobx';

class DealerService {

    @observable dealers = [];
    @observable isLoading = false;

    options = {
        language: 'en'
    };
    
    constructor(options) {
        this.options = options;
        this.dealers = [];
        this.isLoading = false;
    }
    
    /**
     * Search dealers
     *
     * @param place
     * @param distance
     * @param limit
     * @param brand
     * @returns {Promise<T>|*|Promise|Promise<U>|Promise.<T>}
     */
    searchDealers(place, distance, limit, brand) {
        let promise = this.searchAsyncDealers(place, distance, limit, brand);
        this.isLoading = true;
        promise.then(dealers =>  {
            this.dealers = dealers.data;
            this.isLoading = false;
        });
        return promise;
    }

    /**
     *
     * @param place
     * @param distance
     * @param limit
     * @param brand
     * @returns {Promise<T>|*|Promise|Promise<U>|Promise.<T>}
     */
    searchAsyncDealers(place, distance, limit, brand) {
        var source = this.options.source;
        var params = {
            lat: place.lat,
            lng: place.lng,
            distance: distance,
            brand: brand,
            limit: limit,
            language: this.options.language
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
                    resolve(jsonResponse);
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
            /*
            .then(dealers => {
                this.isLoading = false;
                console.log('SETTING DEALERS', dealers.data);
                this.dealers = dealers.data
            })*/
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    }
}

export default DealerService;

