import * as React from 'react';
import '../../css/product/product.scss';
import ProductSearchService from  './product_search_service';
import * as Models from './product_search_model';
import ProductSearchCard from './product_search_card';

import {debounce} from 'lodash';
import {IJsonResult} from "../core/soluble_flexstore";


export interface ProductSearchProps {
    source: string;
    pricelist: string;
    language: string;
    searchDebounceTime?: number;
    searchInputTarget?: string;
    hideSearchInput: boolean;
    locale?: string;
    searchLimit?: number;

}

export interface ProductSearchState {
    products: Array<Models.ProductSearchModel>;
    query?: string;
}

export interface ProductSearchParams {
    pricelist: string;
    language: string;
    query: string;
    limit: number;
}

class ProductSearch extends React.Component<ProductSearchProps, ProductSearchState> {

    productSearchService?: ProductSearchService;

    debouncedSearch: any;
    searchDebounceTime: number = 400;
    searchLimit: number = 50;
    locale: string = 'fr-FR';

    searchCount: number = 0;



    constructor(props: ProductSearchProps) {

        super(props);

        if (props.searchDebounceTime) {
            this.searchDebounceTime = props.searchDebounceTime;
        }

        if (props.searchLimit) {
            this.searchLimit = props.searchLimit;
        }


        if (props.locale) {
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

        }, this.searchDebounceTime);
    }

    searchProducts(query?: string, append: boolean=false) {
        if (!query) query = '';
        this.searchCount++;
        this.productSearchService.searchProducts(this.props.pricelist, this.props.language, query, this.searchLimit).then(
            (response?: IJsonResult) => {
                if (response) {
                    let data = response.data;
                    if (append) {


                    }

                    this.setState({
                        products: data
                    });
                }
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


        let moreProduct = () => {
            return (
                <div className="">
                    <button className="btn btn-secondary">Load more ... </button>
                </div>
            );

        }

        let searchInputStyle = {
            display: this.props.hideSearchInput ? 'none' : 'block'
        };

        const noResults = () => {
            return (
                <div className="no-results">
                    No result...
                </div>
            );
        };

        let displayMoreProducts = this.searchCount > 0 && productsCount > 0 && false;
        let displayNoResults = productsCount == 0 && this.searchCount > 0;

        return (
            <div>
                <div style={ searchInputStyle }>
                    { input }
                </div>
                        <div className="product-list-container">
                            {products.map((product) =>
                                <ProductSearchCard key={product.product_id}
                                                   product={product}
                                                   locale={this.locale} />
                            )

                            }
                        </div>

                        { (displayMoreProducts) && moreProduct() }

                        { displayNoResults && noResults()}

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