import * as React from 'react';
//import * as MediaHelper from '../openstore/product_media_helper';
import * as Models from './product_search_model';
import { ProductPicture } from '../openstore/product_media_helper';
//import ProductDescription from './product_description';
import { MoneyFormatter } from '../formatter/money_formatter';
import { UnitFormatter } from '../formatter/unit_formatter';

import '../../css/product/product_card.scss';



export interface ProductSearchCardBackProps {
    product: Models.ProductSearchModel;
    flipBackHandler: any;
    moneyFormatter: MoneyFormatter;
    unitFormatter: UnitFormatter;
    productPicture: ProductPicture
}

export interface ProductSearchCardBackState {

}

export default class ProductSearchCardBack extends React.Component<ProductSearchCardBackProps, ProductSearchCardBackState> {

    protected locale: string;

    protected productPicture: ProductPicture;
    protected unitFormatter: UnitFormatter;
    protected moneyFormatter: MoneyFormatter;

    constructor(props: ProductSearchCardBackProps) {
        super(props);
        this.moneyFormatter = props.moneyFormatter;
        this.state = {};
    }


    flipCard() {
        this.props.flipBackHandler();
    }

    render() {

        let product = this.props.product;

        const inner_menu = ()  => {
            let inner_menu =
                <div className="inner-menu">
                    <div className="menu-group-vertical">
                        <button type="button" className="btn btn-sm" onClick={(evt) => this.flipCard() }><i className="fa fa-repeat"></i></button>
                        <button type="button" className="btn btn-sm disabled"><i className="fa fa-search-plus"></i></button>
                        <button type="button" className="btn btn-sm disabled"><i className="fa fa-heart"></i></button>
                    </div>
                </div>;
            return inner_menu;
        };

        let categ = product.category_breadcrumb.replace(new RegExp('\\|', 'g'), '»');

        return (
            <div className="product-card-back" onClick={(evt) => this.props.flipBackHandler() }>

                { inner_menu() }
                <div>
                    <div className="product-content-first">
                        <div className="product-reference">
                            { product.reference }
                        </div>
                        <div className="product-brand">
                            { product.brand_title }
                        </div>
                    </div>
                    <div className="product-title">
                        { product.title }&nbsp;
                        { product.characteristic }
                    </div>
                </div>

                <div className="product-category-breadcrumb">
                    {categ}
                </div>

                <div className="product-id">
                    (#{product.product_id})
                </div>


                <div className="product-card-pricebox">

                    <div className="pricebox-public">
                        <span>Public price</span>
                        <div>
                            { this.moneyFormatter.format(product.public_price) }
                        </div>
                    </div>
                    <div className="pricebox-list">
                        <span>List price</span>
                        <div>
                            { this.moneyFormatter.format(product.list_price) }
                        </div>
                    </div>
                </div>


            </div>

        );

        //                 <ProductDescription description={product.description} characteristic={product.characteristic} />

    }

}

