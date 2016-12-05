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

        return (
                <div className="product-search-results-container">
                    {products.map((product) => {
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

