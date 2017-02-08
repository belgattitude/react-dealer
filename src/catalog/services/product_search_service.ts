
import axios  from 'axios';
import AxiosRequestConfig from 'axios';

export interface ProductSearchParams {
    pricelist: string;
    language: string;
    limit: number;
    query: string;

}

export interface IPromiseResult {
    
}

export class ProductSearchService {

    protected sourceUrl: string;

    protected requestId: number = 1;

    constructor(sourceUrl: string) {
        this.sourceUrl = sourceUrl;
    }

    async fetch(params: ProductSearchParams): Promise<any> {

        let requestConfig = {
            method: 'get',
            url: this.sourceUrl,
            params: {
                pricelist: params.pricelist,
                language: params.language,
                query: params.query,
                limit: 100,
                requestId: this.requestId
            }
        };

        let promise = axios(requestConfig)
            .then((response: any) => {
                let remote_request_id = response.data.request_id;
                let local_request_id = requestConfig.params.requestId;
                if (local_request_id != remote_request_id ) {
                    let error = new Error("Skipping: returned remote request_id " + remote_request_id + " is different from local " + local_request_id);
                    throw error;
                }
                return response;
            }).then(
                    (response: any) => {

                        //console.log('axios response', json);
                        if (response.hasOwnProperty('data')) {
                            //console.log('json has data');
                            return response.data.data;

                            /*
                            try {

                                //const data = json.data;
                                //console.log('data', data);
                                //this.products = data.data;
                                //console.log('this.products', this.products);
                                //this.products.replace(data.data);
                            } catch (e) {
                                //throw e;
                            }*/
                        } else {
                            throw Error('missing data param');
                        }
                    }
            )
            .catch((ex: Error) => {
                //console.log('ex', ex.toString());
                console.log('ex', ex);
                //throw ex;
            });

        return promise;
    }

}