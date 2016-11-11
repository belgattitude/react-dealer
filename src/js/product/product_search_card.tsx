import * as React from 'react';
import * as MediaHelper from '../openstore/product_media_helper';
import ProductSearchCardBack from './product_search_card_back';
import StockLevel from './stock_level';
import * as Models from './product_search_model';

import '../../css/product/product_card.scss';
//import '../../css/tooltip/hint.scss';
import '../../css/product/tooltip.scss';


export interface ProductSearchCardProps {
    product: Models.ProductSearchModel;
    locale: string;
}

export interface ProductSearchCardState {
    flipped?: boolean;
}

class ProductSearchCard extends React.Component<ProductSearchCardProps, ProductSearchCardState> {

    protected pictureHelper: MediaHelper.ProductPicture;


    protected locale: string;

    protected unitFormatter: Intl.NumberFormat;
    protected moneyFormatter: Intl.NumberFormat;

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        };

        this.locale = props.locale;

        //30x30,40x40,65x90,170x200,250x750,400x500,800x800,1024x768,1280x1024,1200x1200,3000x3000
        let url_spec = 'http://api.emdmusic.com/media/preview/picture'; // no slash at the end
        //let url_spec = 'http://localhost/workspace/openstore/public/media/preview/picture'; // no slash at the end
        let options = {
            resolution: '400x500',
            quality: 85,
            format: 'jpg'
        };
        this.pictureHelper = new MediaHelper.ProductPicture(url_spec, options);
        this.initMoneyFormatter('EUR');
        this.initUnitFormatter(0)
    }

    initMoneyFormatter(currency: string) {
        this.moneyFormatter = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        });
    }
    initUnitFormatter(minimumFractionDigits: number) {
        this.unitFormatter = new Intl.NumberFormat(this.locale, {
            minimumFractionDigits: minimumFractionDigits,
        });
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

            let all_displayed = false;
            let content = (
                            <div>
                                { product.fresh_rank > 0 || all_displayed ?
                                    <div className="product-fresh-badge">
                                        <span className="tooltip-toggle" aria-label={ "#" + (product.fresh_rank) + " in \n" + product.rankable_breadcrumb }>
                                            <i className="fa fa-line-chart" aria-hidden="true"></i>&nbsp;
                                            Fresh &amp; shining
                                        </span>
                                    </div>
                                    :
                                    '' }

                                { product.bestseller_rank > 0 || all_displayed ?
                                    <div className="product-bestseller-badge">
                                        <span className="tooltip-toggle" aria-label={ "#" + (product.bestseller_rank) + " in \n" + product.rankable_breadcrumb }>
                                            <i className="fa fa-fire" aria-hidden="true"></i>&nbsp;
                                            Bestseller
                                        </span>
                                    </div>
                                    :
                                    '' }
                                { product.popular_rank > 0 || all_displayed ?
                                    <div className="product-popular-badge">
                                        <span className="tooltip-toggle" aria-label={ "#" + (product.popular_rank) + " in \n" + product.rankable_breadcrumb }>
                                            <i className="fa fa-heartbeat" aria-hidden="true"></i>&nbsp;
                                            Popular
                                        </span>
                                    </div>
                                    :
                                    '' }
                                { product.deal_rank > 0 || all_displayed ?
                                    <div className="product-deal-badge">
                                        <span className="tooltip-toggle" aria-label={ "#" + (product.deal_rank) + " in \n" + product.rankable_breadcrumb }>
                                            <i className="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;
                                            Popular deal
                                        </span>
                                    </div>
                                    :
                                    '' }
                                { product.flag_new == "1" || all_displayed ?
                                    <div className="product-new-badge">New</div>
                                    : ''
                                }
                                { (product.is_promotional == "1"  && product.is_liquidation != "1") || all_displayed ?
                                    <div className="product-promo-badge">Promo</div>
                                    : ''
                                }
                                { product.is_liquidation == "1" || all_displayed ?
                                    <div className="product-liquidation-badge">Liquidation</div>
                                    : ''
                                }
                            </div>
                          );
            return content;
        };

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


        const top_right_badges = (product: Models.ProductSearchModel) => {
            let content = (
                <div>
                    <div className="product-badge-price">{ this.moneyFormatter.format(product.price) }</div>
                    <StockLevel product={product} locale={this.locale} />
                </div>
            );
            return content;
        };

        const bottom_right_badges = (product: Models.ProductSearchModel) => {
            return (
                <div>

                </div>
            );
        };

        const bottom_left_badges = (product: Models.ProductSearchModel) => {
            return (
                <div>
                    { product.serie_reference != null ?
                        <div className="product-serie-badge">{ product.serie_reference } serie</div>
                        : ''
                    }
                </div>
            );
        };

        return (
            <div className="product-card-wrap">

                <div className="product-card-container">
                    <div className={'product-card-flipper' + flippedClass}>
                        <div className="product-card-front">

                            { inner_menu() }

                            <div className="product-card-image">
                                <img src={ img } />
                                <div className="top-left-zone">
                                    { top_left_bagdes(product) }
                                </div>
                                <div className="top-right-zone">
                                    { top_right_badges(product) }
                                </div>
                                <div className="bottom-left-zone">
                                    { bottom_left_badges(product) }
                                </div>
                                <div className="bottom-right-zone">
                                    { bottom_right_badges(product) }
                                </div>
                            </div>

                            <div className="product-card-content">
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

                            <div className="product-card-footer">
                                <ul>
                                    <li><i className="fa fa-clock-o"></i> 05/10/2015</li>
                                    <li><a href="#"><i className="fa fa-comments-o"></i>12</a></li>
                                    <li><a href="#"><i className="fa fa-facebook"> </i>21</a></li>
                                    <li><a href="#"><i className="fa fa-twitter"> </i>5</a></li>
                                </ul>
                            </div>

                        </div>
                        <ProductSearchCardBack product={product}
                                               flipBackHandler={(evt) => { this.flipCard() }} />

                    </div>

                </div>

            </div>
        );
    }


}

export default ProductSearchCard;