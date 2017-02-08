import {
    observable, computed, runInAction, action, useStrict, extendObservable, IObservableArray
} from 'mobx';
import { ProductSearchParams } from './product_search_service';
import { ProductStoreParams} from './product_store_params';
import axios  from 'axios';
import AxiosRequestConfig from 'axios';

useStrict(true);

export class ProductStore {

    // Model with ref observability
    // to prevent deep observability (performance)
    // see https://mobx.js.org/refguide/modifiers.html
    @observable.shallow
    products: Array<any> = [];

    // State
    @observable
    loading: boolean = false;

    @observable
    pendingRequestCount: number = 0;

    @observable
    searchQuery?: string = '';

    protected requestId: number = 1;

    protected params: ProductStoreParams;

/*
    @computed get searchParams(): ProductSearchParams {
        return {
            query: this.searchQuery,
            pricelist: 'BE',
            language: 'en'
        } as ProductSearchParams;
    }
*/
    constructor(params: ProductStoreParams) {
        this.params = params;
    }


    incrementRequestId() {
        this.requestId++;
    }


    @action protected loadProducts = async () => {
    //@action protected loadProducts() {
        this.incrementRequestId();
        this.loading = true;
        this.pendingRequestCount++;

        let sourceUrl = this.params.sourceUrl;


        let requestConfig = {
            method: 'get',
            url: sourceUrl,
            params: {
                pricelist: this.params.pricelist,
                language: this.params.language,
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
                                const data = json.data;
                                //console.log('data', data);
                                this.products = data.data;
                                //console.log('this.products', this.products);
                                //this.products.replace(data.data);
                            } catch (e) {
                                //throw e;
                            }
                        }
                        this.loading = false;
                        this.pendingRequestCount--;
                    }
                )
            )
            .catch((ex: Error) => {
                action(() => { this.loading = false; });
                //console.log('ex', ex.toString());
                console.log('ex', ex);
                //throw ex;
            });

        //});
    }

    @action search(searchParams: ProductSearchParams, append: boolean = false): void {
        this.searchQuery = searchParams.query;
        this.loadProducts();
    }

}