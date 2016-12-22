import {
    observable, computed, runInAction, action, useStrict, extendObservable, IObservableArray

} from 'mobx';
import { ProductSearchParams } from './product_search_service';
import axios  from 'axios';
import AxiosRequestConfig from 'axios';

useStrict(true);

export class ProductStore {

    // Model
    @observable
    products: Array<any> = [];

    // State
    @observable
    loading: boolean = false;

    @observable
    pendingRequestCount: number = 0;

    @observable
    searchQuery?: string = '';

    //@observable
    pricelist: string;

    //@observable
    language: string;

    protected requestId: number = 1;

/*
    @computed get searchParams(): ProductSearchParams {
        return {
            query: this.searchQuery,
            pricelist: 'BE',
            language: 'en'
        } as ProductSearchParams;
    }
*/
    constructor() {
        //this.loadProducts();
    }


    incrementRequestId() {
        this.requestId++;
    }


    @action protected loadProducts = async () => {
    //@action protected loadProducts() {
        this.incrementRequestId();
        this.loading = true;
        this.pendingRequestCount++;
        var sourceUrl = 'http://localhost/emdmusic_server/public/api/v1/catalog/search';
        var locale = 'fr-FR';
        var language = 'en';
        var pricelist = 'FR';

        let requestConfig = {
            method: 'get',
            url: sourceUrl,
            params: {
                pricelist: pricelist,
                language: language,
                query: this.searchQuery,
                limit: 100,
                requestId: this.requestId
            }
        };


        //await runInAction("Loading products", () => {
            axios(requestConfig)
                .then((response: any) => {
                    let remote_request_id = response.data.request_id;
                    let local_request_id = requestConfig.params.requestId;
                    if (local_request_id != remote_request_id ) {
                        let error = new Error("Skipping: returned remote request_id " + remote_request_id + " is different from local " + local_request_id);
                        throw error;
                    }
                    return response;
                })
                .then(
                    action(
                        (json: any) => {
                            //console.log('axios response', json);
                            if (json.hasOwnProperty('data')) {
                                //console.log('json has data');
                                try {
                                    let data = json.data;
                                    //console.log('data', data);
                                    this.products = data.data;

                                    //this.products.replace(data.data);
                                } catch (e) {

                                }
                            }
                            this.loading = false;
                            this.pendingRequestCount--;
                        }
                    )
                )
                .catch((ex: Error) => {
                    action(() => { this.loading = false; });
                    console.log('ex', ex.toString());
                    //throw ex;
                })


        //});
    }

    @action search(searchParams: ProductSearchParams, append: boolean = false): void {
        this.searchQuery = searchParams.query;
        this.loadProducts();
    }


}