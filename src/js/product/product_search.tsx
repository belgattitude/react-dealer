import * as React from 'react';
import '../../css/product/product.scss';
import ProductSearchService from  './product_search_service';
import * as Models from './product_search_model';
import ProductSearchCard from './product_search_card';
import {debounce} from 'lodash';


export interface ProductSearchProps {
    source: string,
    searchInputTarget?: string,
    locale?: string
}

export interface ProductSearchState {
    products: Array<Models.ProductSearchModel>,
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
    locale: string;

    debouncedSearch: any;


    constructor(props: ProductSearchProps) {
        super(props);

        if (!props.locale) {
            this.locale = 'fr-FR';
        } else {
            this.locale = props.locale;
        };

        this.productSearchService = new ProductSearchService({
            source: props.source,
            locale: this.locale
        });

        this.state = {
            products: [],
            query: null
        };
        this.debouncedSearch = debounce((str: string) => {
            this.searchProducts(str);
        }, 300);
    }

    searchProducts(query?: string) {
        if (!query) query = '';
        this.productSearchService.searchProducts('BE', 'en', query, 50).then(
            (products) => {
                this.setState({ products : products.data} );
            }
        );
    }

    componentDidMount() {

        this.searchProducts();

        if (this.props.searchInputTarget) {
            let target = document.getElementById(this.props.searchInputTarget);
            target.focus();
            let searchInput = this.refs['searchInput'] as HTMLInputElement;
            target.addEventListener('keyup', (evt: any) => {
                searchInput.value = evt.target.value;

                /*
                var event = new Event('change');
                searchInput.dispatchEvent(event);
                */

                this.debouncedSearch(evt.target.value)
            });
        }

    }


    render() {

        let input = <input type="text" ref="searchInput" onChange={(evt: any) => this.debouncedSearch(evt.target.value) }/>;
        let products = this.state.products;
        let productsCount = products.length;

        return (
            <div>

                <div>
                    { input }
                </div>
                <div>
                    { (productsCount > 0) &&
                        <div className="product-list-container">
                            {products.map((product) =>
                                <ProductSearchCard key={product.product_id}
                                                   product={product}
                                                   locale={this.locale} />
                            )
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }

}
/*

 { (productsCount > 0) &&
 { products.map((product) => {
 return <ProductSearchCard key={product.product_id} product={product}/>
 })
 }
 }

 */

export default ProductSearch;