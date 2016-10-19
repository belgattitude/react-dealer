import "babel-polyfill";
import 'whatwg-fetch';
import { Promise } from 'core-js';
import { IJsonResult } from './../core/soluble_flexstore';

export default class ProductSearchService {

    results = [];
    isLoading = false;

    options = {
        language: 'en',
        source: null
    };
    
    constructor(options) {
        this.options = options;
        this.results = [];
        this.isLoading = false;
    }

    searchProducts(pricelist: string, language: string, query: string, limit: number): Promise<IJsonResult> {
        let promise = this.searchAsyncProducts(pricelist, language, query, limit);
        this.isLoading = true;
        promise.then((response: IJsonResult) =>  {
            this.results = response.data;
            this.isLoading = false;
        }).catch((ex: Error) => {
            console.log("ERROR: " + ex.toString());
            this.isLoading = false;
        });
        return promise;
    }

    searchAsyncProducts(pricelist: string, language: string, query: string, limit: number): Promise<IJsonResult> {
        var source = this.options.source;
        var params = {
            pricelist: pricelist,
            language: language,
            query: query,
            limit: limit
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
                let error = new Error(response.statusText)
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
            .catch((ex: Error) => {
                this.isLoading = false;
                console.log('ex', ex.toString());
                throw new Error("Response cannot be parsed (" + ex.toString() + ")");
                //console.log('parsing failed', ex)
            });
    }


}


