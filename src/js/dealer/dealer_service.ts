import "babel-polyfill";
import 'whatwg-fetch';
import { Promise } from 'core-js';
import { observable } from 'mobx';
import { IJsonResult } from './../core/soluble-flexstore';
import * as _ from 'lodash';

export class PlaceSearchParams {
    lat: number;
    lng: number;
    country: string;
}

export default class DealerService {

    @observable dealers = [];
    @observable isLoading = false;

    options = {
        language: 'en',
        source: null
    };
    
    constructor(options) {
        this.options = options;
        this.dealers = [];
        this.isLoading = false;
    }
    

    /**
     *
     * @param place
     * @param distance
     * @param limit
     * @param brand
     * @returns {Promise<IJsonResult>}
     */
    searchDealers(place: PlaceSearchParams, distance: number, limit: number, brand: string): Promise<IJsonResult> {
        let promise = this.searchAsyncDealers(place, distance, limit, brand);
        this.isLoading = true;
        promise.then((response: IJsonResult) =>  {
            this.dealers = response.data;
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
     * @returns {Promise<TResult>}
     */
    searchAsyncDealers(place: PlaceSearchParams, distance: number, limit: number, brand: string): Promise<IJsonResult> {
        //document.getElementById('dealer_spinner').style.display = 'block';
        var source = this.options.source;
        var params = {
            lat: place.lat,
            lng: place.lng,
            country: place.country,
            distance: distance,
            brand: brand,
            limit: limit,
            language: this.options.language
        };

        // Setting url with search params
        var url = new URL(source);

        //var searchParams = new URLSearchParams();
        var parts = [];
        Object.keys(params).forEach((key) => {
                if (params.hasOwnProperty(key)) {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
                }
            }
        );

        //url.search = searchParams.toString();
        url.search = parts.join('&');
        var api_url = url.toString();

        var checkStatus = function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                //error = response
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

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let fetchParams = {
            // mode: 'no-cors',
            // credentials: 'same-origin',
            method: 'get',
            headers: headers
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
                this.isLoading = false;
                console.log('parsing failed', ex)
            });
    }
}


