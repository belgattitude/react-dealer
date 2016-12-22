import {observable, computed, action, useStrict} from 'mobx';
import { ProductSearchParams } from './product_search_service';

useStrict(true);

export class CatalogState {

    @observable public productSearchParams: ProductSearchParams = null;

    @action
    setProductSearchParams(productSearchParams: ProductSearchParams): void {
        this.productSearchParams = productSearchParams;
    }
}