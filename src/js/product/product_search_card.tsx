import * as React from 'react';

import { ProductSearchCardBack } from './product_search_card_back';
import { StockLevel } from './stock_level';
import { ProductPictureService, ProductPictureServiceProps } from '../openstore/product_picture_service';
import { MoneyFormatter } from '../formatter/money_formatter';
import { UnitFormatter } from '../formatter/unit_formatter';
import * as Models from './product_search_model';
import { PrettyPriceFormatter, PrettyPriceFormatterProps } from '../formatter/pretty_price_formatter';

import '../../css/product/product_card.scss';

export interface ProductSearchCardProps {
    product: Models.ProductSearchModel;
    locale: string;
    productPictureService: ProductPictureService;
}

export interface ProductSearchCardState {
    flipped?: boolean;
}

export class ProductSearchCard extends React.Component<ProductSearchCardProps, ProductSearchCardState> {

    protected locale: string;

    protected unitFormatter: UnitFormatter;
    protected moneyFormatter: MoneyFormatter;
    protected discountFormatter: UnitFormatter;
    protected prettyPriceFormatter: PrettyPriceFormatter;

    protected currency: string = 'EUR';

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        };

        this.locale = props.locale;

        this.moneyFormatter = new MoneyFormatter({
            currency: this.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            locale: this.locale
        });
        this.unitFormatter = new UnitFormatter({
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            locale: this.locale,
            unit: ''
        });
        this.discountFormatter = new UnitFormatter({
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            locale: this.locale,
            unit: '%',
            unitSeparator: ''
        });

        this.prettyPriceFormatter = new PrettyPriceFormatter({
            currency: this.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            locale: this.locale
        });

    }


    flipCard() {
        console.log('flipped');
        this.setState({ flipped: !this.state.flipped });
    }


    render() {

        const product = this.props.product;
        const media_id = product.picture_media_id;

        let img = this.props.productPictureService.getMediaUrl(media_id, product.picture_media_filemtime);

        let flippedClass = '';
        if (this.state.flipped) {
            flippedClass = ' flipped';
        }

        const top_left_bagdes = (product: Models.ProductSearchModel) => {

            let all_displayed = false;
            let rankable_breadcrumb = '';
            if (product.rankable_breadcrumb) {
                rankable_breadcrumb = product.rankable_breadcrumb.replace(new RegExp('\\|', 'g'), '»');
            }

            // remaining stock

            let only_left = '';
            if ( product.flag_till_end_of_stock == "1" ) {
                if (product.remaining_total_available_stock) {
                    let pcs_remain = parseInt(product.remaining_total_available_stock);
                    let unit = (pcs_remain > 1) ? 'pcs' : 'pc';
                    only_left = this.unitFormatter.format(pcs_remain) + ' ' + unit + ' left !!!';
                } else {
                    only_left = 'Out of stock !!!';
                }
            }

            let discount_message: string = '';
            let discounted_price: boolean =  (product.list_price != product.price);
            let isPromotionnal: boolean = (product.is_promotional == "1"  && product.is_liquidation != "1");
            let isLiquidation: boolean = (product.is_liquidation == "1");
            if (discounted_price) {
                discount_message = '-' + this.discountFormatter.format(product.total_discount) + ', save ' + this.moneyFormatter.format(product.price_saving) + '/pc !!!';
            }


            let content = (
                            <div>
                                { product.deal_rank > 0 && (isLiquidation || isPromotionnal)  || all_displayed ?
                                    <div className="product-deal-badge" aria-label={ "#" + (product.deal_rank) + " in " + rankable_breadcrumb }>
                                        <span>
                                            <i className="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;
                                            Popular deal
                                        </span>
                                    </div>
                                    :
                                    '' }

                                { isLiquidation || all_displayed ?
                                    <div className="product-liquidation-badge" aria-label={ 'Liquidation: ' + discount_message}>
                                        <span>
                                            <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;
                                            Stock clearance
                                        </span>
                                    </div>
                                    : ''
                                }

                                { isPromotionnal || all_displayed ?
                                    <div className="product-promo-badge" aria-label={ 'Promo: ' + discount_message}>
                                        <span>
                                            <i className="fa fa-hand-peace-o" aria-hidden="true"></i>&nbsp;
                                            - { this.discountFormatter.format(product.total_discount) }
                                        </span>
                                    </div>
                                    : ''
                                }

                                { (!isLiquidation && product.fresh_rank > 0) || all_displayed ?
                                    <div className="product-fresh-badge" aria-label={ "#" + (product.fresh_rank) + " in " + rankable_breadcrumb }>
                                        <span>
                                            <i className="fa fa-line-chart" aria-hidden="true"></i>&nbsp;
                                            Fresh &amp; shining
                                        </span>
                                    </div>
                                    :
                                    '' }

                                { (product.bestseller_rank) > 0 || all_displayed ?
                                    <div className="product-bestseller-badge" aria-label={ "#" + (product.bestseller_rank) + " in " + rankable_breadcrumb }>
                                        <span>
                                            <i className="fa fa-fire" aria-hidden="true"></i>&nbsp;
                                            Bestseller
                                        </span>
                                    </div>
                                    :
                                    '' }
                                { (product.popular_rank > 0) || all_displayed ?
                                    <div className="product-popular-badge" aria-label={ "#" + (product.popular_rank) + " in " + rankable_breadcrumb }>
                                        <span>
                                            <i className="fa fa-heartbeat" aria-hidden="true"></i>&nbsp;
                                            Popular
                                        </span>
                                    </div>
                                    :
                                    '' }
                                { !isLiquidation && product.flag_new == "1" || all_displayed ?
                                    <div className="product-new-badge" aria-label={ product.available_at }>
                                        <span>
                                            <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;
                                            New
                                        </span>

                                    </div>
                                    : ''
                                }
                                { only_left != '' ?
                                    <div className="product-stock-remaining-message">
                                        { only_left }
                                    </div>
                                    :''
                                }

                            </div>
                          );
            return content;
        };

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


        const top_right_badges = (product: Models.ProductSearchModel) => {

            let isDiscounted: boolean =  (product.list_price != product.price);

            let rawPrice = product.price;

            let priceParts = this.prettyPriceFormatter.getParts(product.price);
            console.log('priceParts', priceParts);

            let intPart = this.moneyFormatter.format(rawPrice);
            let fractionPart = this.moneyFormatter.format((rawPrice % 1))
                //.replace(/\D$/g, '')
                .replace(/^0/, '');

            let price = {
                __html: intPart.replace(new RegExp('(' + fractionPart + ')'), '<span class="decimals">$1</span>')
            }

            let content = (
                <div>
                    <div className="product-badge-price" data-text-header="List price">
                        <div className="price" dangerouslySetInnerHTML={priceParts}></div>
                        { isDiscounted ?
                            <div className="discount-footer">
                                <span className="stroked-price"> { this.moneyFormatter.format(product.list_price) }</span>
                                <span className="total-discount"> { this.discountFormatter.format(product.total_discount) }</span>
                            </div>
                            : ''
                        }
                    </div>
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


        let classExtras = '';
        if (product.is_promotional == '1') {
            classExtras += ' product-card-highlighted';
        } else if (product.flag_new == "1" ||
                    product.bestseller_rank > 0 ||
                    product.popular_rank > 0 ||
                    product.fresh_rank > 0
                ) {
            classExtras += ' product-card-raised';
        }

        return (
            <div className={ "product-card-wrap" + classExtras}>

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
                        <ProductSearchCardBack product={ product }
                                               flipBackHandler={ (evt) => { this.flipCard() }}
                                               moneyFormatter={ this.moneyFormatter }
                                               unitFormatter={ this.unitFormatter }
                                               productPictureService={ this.props.productPictureService } />

                    </div>

                </div>

            </div>
        );
    }
}

