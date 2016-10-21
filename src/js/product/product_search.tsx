import * as React from 'react';
import '../../css/product/product.scss';
import ProductSearchService from  './product_search_service';
import ProductSearchCard from './product_search_card';
import {debounce} from 'lodash';


export interface ProductSearchProps {
    source: string;
}

export interface ProductSearchState {
    products: any,
    query?: string
}

export interface ProductSearchParams {
    pricelist: string,
    language: string,
    query: string,
    limit: number
}


class ProductSearch extends React.Component<ProductSearchProps, ProductSearchState> {

    productSearchService?: ProductSearchService;
    debouncedSearch: any;

    constructor(props: ProductSearchProps) {
        super(props);
        this.productSearchService = new ProductSearchService({
            source: props.source
        });

        this.state = {
            products: [],
            query: null
        };

        this.debouncedSearch = debounce((str) => {
            this.searchProducts(str);
        }, 300);

        this.searchProducts();

    }

    searchProducts(query?: string) {
        if (!query) query = '';
        this.productSearchService.searchProducts('BE', 'en', query, 50).then(
            (products) => {
                this.setState({ products : products.data} );
            }
        );
    }
    componentWillMount() {
    }

    render() {
        //<input type="text" ref="input" onChange={(evt) => this.searchProducts(evt.target.value) }  />
        return (
            <div>
                <div>
                    <input type="text" ref="input" onChange={(evt: any) => this.debouncedSearch(evt.target.value) }/>
                </div>
                <div className="product-list-container">
                    {this.state.products.map((product) => {
                        return <ProductSearchCard key={product.product_id} data={product} />
                    })}
                </div>
            </div>
        );
    }

}

export default ProductSearch;