import * as React from 'react';
import '../../css/product/_fonts';
import '../../css/product/product_search.scss';
import * as Models from './product_search_model';
import { ProductSearchCard } from './product_search_card';
import { ProductPictureService } from  '../openstore/product_picture_service';

export interface ProductSearchResultsProps {
    locale?: string;
    products: Array<Models.ProductSearchModel>;
    productPictureService: ProductPictureService;
}

export interface ProductSearchResultsState {
    products: Array<Models.ProductSearchModel>;
    total: number;
    hasMore: number;
    isLoading: boolean;
}


export class ProductSearchResults extends React.Component<ProductSearchResultsProps, ProductSearchResultsState> {

    protected locale: string = 'fr-FR';

    constructor(props: ProductSearchResultsProps) {

        super(props);

        if (props.locale) {
            this.locale = props.locale;
        };


        this.state = {
            products: [],
            total: 0,
            hasMore: 0,
            isLoading: false
        } as ProductSearchResultsState;

    }


    componentDidMount() {


    }


    render() {

        const products = this.props.products;
        const productsCount = products.length;


        const noResults = () => {
            return (
                <div className="product-search-no-result">
                    No results, please refine your search...
                </div>
            );
        };

        /*
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
*/
        return (
                <div className="product-list-container">
                    {products.map((product) => {
                        console.log('rendering product ', product.product_id);
                            return (<ProductSearchCard key={product.product_id}
                                                       product={product}
                                                       productPictureService={this.props.productPictureService}
                                                       locale={this.locale}/>);
                        }
                    )
                    }
                </div>
        );
    }

}

