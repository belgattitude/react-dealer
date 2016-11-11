import * as React from 'react';
//import * as MediaHelper from '../openstore/product_media_helper';
import * as Models from './product_search_model';
import ProductDescription from './product_description';
import '../../css/product/product_card.scss';


export interface ProductSearchCardBackProps {
    product: Models.ProductSearchModel;
    flipBackHandler: any;
}

export interface ProductSearchCardBackState {

}

export default class ProductSearchCardBack extends React.Component<ProductSearchCardBackProps, ProductSearchCardBackState> {

    constructor(props) {
        super(props);
        this.state = {};

    }


    flipCard() {
        this.props.flipBackHandler();
    }

    render() {

        let product = this.props.product;
        let descriptionCount = product.description.length;

        const inner_menu = ()  => {
            let inner_menu =
                <div className="inner-menu">
                    <div className="btn-group-vertical">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={(evt) => this.flipCard() }><i className="fa fa-repeat"></i></button>
                        <button type="button" className="btn btn-secondary btn-sm"><i className="fa fa-search-plus"></i></button>
                        <button type="button" className="btn btn-secondary btn-sm disabled"><i className="fa fa-heart"></i></button>
                    </div>
                </div>;
            return inner_menu;
        };


        return (
            <div className="product-card-back" onClick={(evt) => this.props.flipBackHandler() }>

                { inner_menu() }

                <div>
                    {product.category_breadcrumb}
                </div>
                <div className="product-card-title">
                    <span className="product-reference">
                        {product.reference}
                    </span>
                    <span className="product-brand">
                                    {product.brand_title}
                    </span>
                    <div className="product-title">
                        {product.title}
                    </div>
                </div>

                <ProductDescription description={product.description} characteristic={product.characteristic} />

            </div>

        );
    }

}

