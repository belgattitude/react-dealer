
import { ProductSearchParams } from './product_search_service';


export class ProductSearchState
{

    protected productSearchParams: ProductSearchParams;

    constructor(productSearchParams: ProductSearchParams) {
        this.productSearchParams = productSearchParams;
    }


    getProductSearchParams(): ProductSearchParams {
        return this.productSearchParams;
    }

    hasQuery(): boolean {
        return (this.productSearchParams.query != '');
    }

    hasBrand(): boolean {
        return (this.productSearchParams.brand != '');
    }

    hasCategory(): boolean {
        return (this.productSearchParams.category != '');
    }

    isFiltered(): boolean {
        return (this.hasQuery() || this.hasBrand() || this.hasCategory());
    }

}


