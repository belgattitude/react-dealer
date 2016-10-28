import * as React from 'react';
import * as MediaHelper from '../openstore/product_media_helper';
import * as Models from './product_search_model';
import '../../css/product/product.scss';



export interface ProductSearchCardBackProps {
    product: Models.ProductSearchModel;
}

export interface ProductSearchCardBackState {
    //flipped?: boolean;
}

export default class ProductSearchCardBack extends React.Component<ProductSearchCardBackProps, ProductSearchCardBackState> {

    constructor(props) {
        super(props);
    }

    render() {

        let product = this.props.product;
        let description = product.description;
        let descriptionCount = product.description.length;
        return (
            <div className="product-card-back">

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

                { (descriptionCount > 0) &&
                <div className="product-description">
                    <ul>
                    {product.description.split("\n").map(function(item, id) {
                        return (
                            <li key={'bullet-' + product.product_id + '-' + id}>{item}</li>
                        )
                    })}
                    </ul>
                </div>
                }
            </div>

        );
    }

}

