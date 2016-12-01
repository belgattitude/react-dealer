import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../../css/product/_fonts';
import '../../css/product/product_search.scss';
import { ProductSearchService, ProductSearchParams } from  './product_search_service';
import { ProductPictureService } from  '../openstore/product_picture_service';


import * as Models from './product_search_model';
import { ProductSearchResults } from './product_search_results';
import { debounce, includes } from 'lodash';
import { IJsonResult } from "../core/soluble_flexstore";

export { ProductSearchService, ProductPictureService };

export interface ProductSearchProps {
    productSearchService: ProductSearchService;
    productPictureService: ProductPictureService;



    locale?: string;
    pricelist: string;
    language: string;
    searchDebounceTime?: number;
    searchInputTarget?: string;
    hideSearchInput: boolean;
    initialSearchText?: string;

    searchLimit?: number;
    // window || scrollintoview
    scrollTopMethod?: string;
}

export interface ProductSearchState {
    products: Array<Models.ProductSearchModel>;
    searchParams: ProductSearchParams;
    total: number;
    hasMore: number;
}

export class ProductSearch extends React.Component<ProductSearchProps, ProductSearchState> {
    protected debouncedSearch: any;
    protected searchDebounceTime: number = 400;
    protected searchLimit: number = 50;
    protected scrollTopMethod: string = 'window';
    protected locale: string = 'fr-FR';

    protected isLoading: boolean = false;

    protected searchCount: number = 0;

    protected previousSearchParams: ProductSearchParams;

    protected loaderContainer: any;


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

        if (props.scrollTopMethod) {
            this.scrollTopMethod = props.scrollTopMethod;
        };


        this.state = {
            products: [],
            searchParams: this.getSearchParams(this.props.initialSearchText || ''),
            total: 0,
            hasMore: 0,

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

        this.showLoader();

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
                        this.scrollTop();
                    }

                    let total: number = response.total;
                    let start: number = response.start;
                    let limit: number = response.limit;
                    let hasMore: number = Math.max(total - (start + limit), 0);

                    this.hideLoader();
                    this.setState({
                        products: data,
                        total: total,
                        hasMore: hasMore,

                    } as ProductSearchState);
                }
            }
        ).catch((ex: Error) => {
            console.log('Promise has been cancelled not need to re-render product results', ex);
            this.hideLoader();
        });
    }

    protected scrollTop() {
        // If the component is inside a complex
        // layout prefer scrollIntoView()
        if (this.scrollTopMethod == 'scrollintoview') {
            let element = ReactDOM.findDOMNode(this) as HTMLElement;
            element.scrollIntoView(true);
        } else {
            window.scrollTo(0, 0);
        }
    }

    componentDidMount() {


        this.searchProducts(this.state.searchParams);

        if (this.props.searchInputTarget) {
            let target = document.getElementById(this.props.searchInputTarget);
            target.focus();
            let searchInput = this.refs['searchInput'] as HTMLInputElement;
            target.addEventListener('input', (evt: Event) => {
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

        let input = <input type="text" ref="searchInput" onInput={(evt: any) => this.debouncedSearch(evt.target.value) }/>;
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


        let hasMore = this.state.hasMore;
        let displayMoreProducts = ((this.searchCount > 0) && productsCount > 0 && (hasMore > 0));
        let displayNoResults = (productsCount == 0 && this.searchCount > 0);


        return (
            <div className="product-search-container">
                <div style={ searchInputStyle }>
                    { input }
                </div>

                <div className="product-search-loader-container disabled"
                     ref={(loaderContainer) => { this.loaderContainer = loaderContainer; }}>
                    <span className="loader-circle">
                    </span>
                </div>

                <ProductSearchResults products={this.state.products}
                                      productPictureService={this.props.productPictureService}
                                      locale={this.locale}

                />


                { displayMoreProducts && moreProductDiv() }

                { displayNoResults && noResults()}

            </div>
        );

    }

    protected hideLoader(className: string = 'disabled') {
        this.isLoading = false;
        let el = this.loaderContainer;
        if (el.classList) {
            el.classList.add(className);
        } else { // < IE10
            el.className += ' ' + className;
        }
    }

    protected showLoader(className: string = 'disabled') {
        this.isLoading = true;
        let el = this.loaderContainer;
        if (el.classList) {
            el.classList.remove(className);
        } else { // < IE10
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

}

