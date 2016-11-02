import * as React from 'react';
import * as MediaHelper from '../openstore/product_media_helper';
import * as ProductStock from '../openstore/product_stock_level';
import ProductSearchCardBack from './product_search_card_back';
import * as Models from './product_search_model';

import '../../css/product/product.scss';


export interface ProductSearchCardProps {
    product: Models.ProductSearchModel;
}

export interface ProductSearchCardState {
    flipped?: boolean;
}

class ProductSearchCard extends React.Component<ProductSearchCardProps, ProductSearchCardState> {

    protected pictureHelper: MediaHelper.ProductPicture;

    protected productStockLevel: ProductStock.ProductStockLevel;

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        };

        //30x30,40x40,65x90,170x200,250x750,400x500,800x800,1024x768,1280x1024,1200x1200,3000x3000
        let url_spec = 'http://api.emdmusic.com/media/preview/picture'; // no slash at the end
        //let url_spec = 'http://localhost/workspace/openstore/public/media/preview/picture'; // no slash at the end
        let options = {
            resolution: '400x500',
            quality: 85,
            format: 'jpg'
        };
        this.pictureHelper = new MediaHelper.ProductPicture(url_spec, options);
        this.productStockLevel = new ProductStock.ProductStockLevel();
    }

    flipCard() {
        console.log('flipped');
        this.setState({ flipped: !this.state.flipped });
    }

    render() {

        const product = this.props.product;
        const media_id = product.picture_media_id;
        let img = '';
        if (media_id != '') {
            img = this.pictureHelper.getMediaUrl(media_id, product.picture_media_filemtime);
        }

        let flippedClass = '';
        if (this.state.flipped) {
            flippedClass = ' flipped';
        }

        const top_left_bagdes = (product: Models.ProductSearchModel) => {
            let is_new = product.flag_new
            let content = (
                            <div>
                                { product.flag_new == "1" ? <div className="product-new-badge">New</div> : '' }
                                { product.is_promotional == "1" && product.is_liquidation != "1" ?
                                    <div className="product-promo-badge">Promo</div> : ''
                                }
                                { product.is_liquidation == "1" ? <div className="product-liquidation-badge">Liquidation</div> : '' }
                            </div>
                          );
            return content;
        };


        const bottom_right_badges = (product: Models.ProductSearchModel) => {

            let unitFormatter = new Intl.NumberFormat('en-US', {
                //style: 'currency',
                //currency: 'USD',
                minimumFractionDigits: 2,
            });

            let moneyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product.currency_reference,
                minimumFractionDigits: 2,

            });

            return (
                <div>

                    <div className="stock-badge">
                        <div className="value">{ unitFormatter.format(product.available_stock) }</div>
                        <div className={ this.productStockLevel.getStockLevel(product.stock_level) }></div>
                    </div>
                    <div className="price-badge">
                        { moneyFormatter.format(product.public_price) }
                    </div>

                </div>
            );

        };



        return (
            <div className="product-card-wrap" onClick={(evt) => this.flipCard() }>
                <div className="product-card-container">
                    <div className={'product-card-flipper' + flippedClass}>
                        <div className="product-card-front">
                            <div className="product-card-image">
                                <img src={ img } />
                                <div className="top-left-zone">
                                    { top_left_bagdes(product) }
                                </div>
                                <div className="bottom-right-zone">
                                    { bottom_right_badges(product) }
                                </div>

                            </div>

                            <div className="product-card-content">
                                <span className="product-reference">
                                    { product.reference }
                                </span>
                                <span className="product-brand">
                                    { product.brand_title }
                                </span>
                                <div className="product-title">
                                    { product.title }
                                </div>
                            </div>

                            <div className="product-card-footer">
                                <ul>
                                    <li><i className="fa fa-clock-o"></i> 05/10/2015</li>
                                    <li><a href="#"><i className="fa fa-comments-o"></i>12</a></li>
                                    <li><a href="#"><i className="fa fa-facebook"> </i>21</a></li>
                                    <li><a href="#"><i className="fa fa-twitter"> </i>5</a></li>
                                </ul>
                            </div>

                        </div>
                        <ProductSearchCardBack product={product} />

                    </div>

                </div>

            </div>
        );
    }


}

export default ProductSearchCard;