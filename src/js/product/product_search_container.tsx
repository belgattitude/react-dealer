import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../../css/product/_fonts';
import '../../css/product/product_search.scss';
import { ProductSearchService, ProductSearchParams } from  './product_search_service';
import { ProductPictureService, ProductPictureServiceProps } from '../openstore/product_picture_service';
import * as Models from './product_search_model';
import { ProductSearchCard } from './product_search_card';
import { debounce, includes } from 'lodash';
import {IJsonResult} from "../core/soluble_flexstore";



export interface ProductSearchProps {
    productSearchService: ProductSearchService;
    productPictureService: ProductPictureService;
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
    total: number;
    hasMore: number;
    isLoading: boolean;
}


export class ProductSearch extends React.Component<ProductSearchProps, ProductSearchState> {

    protected productSearchService: ProductSearchService;


    protected debouncedSearch: any;
    protected searchDebounceTime: number = 400;
    protected searchLimit: number = 50;
    protected locale: string = 'fr-FR';

    protected searchCount: number = 0;

    protected previousSearchParams: ProductSearchParams;


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


        this.state = {
            products: [],
            total: 0,
            hasMore: 0,
            isLoading: false
        } as ProductSearchState;

        this.debouncedSearch = debounce((query: string) => {
            this.searchProducts(this.getSearchParams(query));
        }, this.searchDebounceTime);
    }

    getSearchParams(query?: string) : ProductSearchParams {

        let searchParams = {
            pricelist: this.props.pricelist,
            language: this.props.language,
            query: query,
            limit: this.searchLimit
        };
        return searchParams;

    }

    loadMore() {
        let searchParams = this.previousSearchParams;
        let previousOffset = (this.previousSearchParams.offset) ? this.previousSearchParams.offset : 0;
        searchParams.offset = this.props.searchLimit + previousOffset;
        this.searchProducts(searchParams, true);
    }

    searchProducts(searchParams: ProductSearchParams, append: boolean=false) {

        this.searchCount++;
        this.previousSearchParams = searchParams;

        this.setState({isLoading: true} as ProductSearchState);

        this.props.productSearchService.searchProducts(searchParams).then(
            (response?: IJsonResult) => {
                if (response) {
                    let data = [];
                    if (append) {
                        let newData = this.state.products;
                        let currentIds = this.state.products.map((item) => {
                            return item.product_id;
                        });
                        // Add only if product is not yet displayed
                        response.data.forEach(function(record, index) {
                            if (!includes(currentIds, record.product_id)) {
                                newData.push(record);
                            }
                        });
                        data = newData;
                    } else {
                        data = response.data;
                    }

                    let total: number = response.total;
                    let start: number = response.start;
                    let limit: number = response.limit;
                    let hasMore: number = Math.max(total - (start + limit), 0);

                    if (this.searchCount < 100) {

                        this.setState({
                            products: data,
                            total: total,
                            hasMore: hasMore,
                            isLoading: false
                        } as ProductSearchState);

                    } else {
                        this.setState({
                            isLoading: false
                        } as ProductSearchState);

                    }
                    this.scrollTop();

                }
            }
        ).catch((ex: Error) => {
            console.log('Promise has been cancelled not need to re-render product results');
        });


    }

    protected scrollTop() {

        // Bugs here,
        //  - ReactDOM.findDOMNode(this).scrollIntoView();
        //  - ReactDOM.findDOMNode(this).scrollTop = 0;
        // So let's make a window.scrollTo(0,0)
        window.scrollTo(0, 0);

    }

    componentDidMount() {

        this.searchProducts(this.getSearchParams());

        if (this.props.searchInputTarget) {
            let target = document.getElementById(this.props.searchInputTarget);
            target.focus();
            let searchInput = this.refs['searchInput'] as HTMLInputElement;
            target.addEventListener('keyup', (evt: Event) => {
                let target = evt.target as HTMLInputElement;
                searchInput.value = target.value;
                /*
                 var event = new Event('change');
                 searchInput.dispatchEvent(event);
                 */
                this.debouncedSearch(target.value)
            });
        }

    }


    render() {

        let input = <input type="text" ref="searchInput" onChange={(evt: any) => this.debouncedSearch(evt.target.value) }/>;
        let products = this.state.products;
        let productsCount = products.length;

        let searchInputStyle = {
            display: this.props.hideSearchInput ? 'none' : 'block'
        };

        const noResults = () => {
            return (
                <div className="product-search-no-result">
                    No results, please refine your search...
                </div>
            );
        };

        let moreProductDiv = () => {
            return (

                <div className="product-search-load-more">
                    <button className="btn btn-secondary" onClick={(evt) => this.loadMore() }>
                        Load more... (total {this.state.total} products, has still {this.state.hasMore}...).
                    </button>
                </div>
            );
        }

        let loaderBar = () => {

            return (
                <div className="product-search-loader-container">
                    <span className="loader loader-quart">

                    </span>
                </div>
            );
        }

        let hasMore = this.state.hasMore;
        let displayMoreProducts = ((this.searchCount > 0) && productsCount > 0 && (hasMore > 0));
        let displayNoResults = (productsCount == 0 && this.searchCount > 0);

        return (
            <div className="product-search-container">
                <div style={ searchInputStyle }>
                    { input }
                </div>
                { this.state.isLoading && loaderBar() }

                { (productsCount > 0) ?
                    <div className="product-list-container">
                        {products.map((product) => {
                                console.log('rendering product ', product.product_id);
                                return (<ProductSearchCard key={product.product_id}
                                                           product={product}
                                                           locale={this.locale}
                                                           productPictureService={this.props.productPictureService}
                                        />);
                            }
                        )
                        }
                    </div>
                    : ''
                }

                { displayMoreProducts && moreProductDiv() }

                { displayNoResults && noResults()}

            </div>
        );
    }

}

