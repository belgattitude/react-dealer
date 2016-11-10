import "babel-polyfill";
import 'whatwg-fetch';
import { Promise } from 'core-js';
import * as Models from './product_search_model';
import { IJsonResult } from './../core/soluble_flexstore';

export interface ProductSearchParams {
    pricelist: string;
    language: string;
    query: string;
    limit: number;
}


export default class ProductSearchService {

//    results: Array<Models.ProductSearchModel> = [];

    isLoading: boolean = false;

    options = {
        language: 'en',
        source: null
    };

    protected requestId: number = 1;
    
    constructor(options) {
        this.options = options;
//        this.results = [];
        this.isLoading = false;

    }

    incrementRequestId() {
        this.requestId++;
    }

    //searchProducts(pricelist: string, language: string, query: string, limit: number): Promise<IJsonResult> {
    searchProducts(searchParams: ProductSearchParams): Promise<IJsonResult> {
        this.incrementRequestId();
        let promise = this.searchAsyncProducts(searchParams);
        this.isLoading = true;
        promise.then((response: IJsonResult) =>  {
            //this.results = response.data;

            this.isLoading = false;
        }).catch((ex: Error) => {
            console.log("ERROR: " + ex.toString());
            this.isLoading = false;
        });
        return promise;
    }

    searchAsyncProducts(searchParams: ProductSearchParams): Promise<IJsonResult> {
        let source = this.options.source;
        let query = searchParams.query;
        if (!query) {
            query = '';
        }

        let params = {
            pricelist: searchParams.pricelist,
            language: searchParams.language,
            query: query,
            limit: searchParams.limit,
            requestId: this.requestId
        };
        if (!query) query = '';
        // Setting url with search params
        let url = new URL(source);

        //var searchParams = new URLSearchParams();
        let parts = [];
        Object.keys(params).forEach((key) => {
                if (params.hasOwnProperty(key)) {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
                }
            }
        );

        //url.search = searchParams.toString();
        url.search = parts.join('&');
        let api_url = url.toString();

        let checkStatus = function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                let error = new Error(response.statusText)
                //error = response
                throw error;
            }
        }

        let parseJson = function(response) {
            return new Promise((resolve) => {
                response.json().then(jsonResponse => {
                    resolve(jsonResponse);
                });
            });
        }

        let checkRequestId = (response: IJsonResult) => {
            let request_id = response.request_id;
            if (request_id != this.requestId) {
                let error = new Error("Skipping: returned request_id " + request_id + " is different from " + this.requestId);
                throw error;
            }
            return response;
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
            })
            .then(checkRequestId)
            .catch((ex: Error) => {
                this.isLoading = false;
                console.log('ex', ex.toString());
            });
    }

}


