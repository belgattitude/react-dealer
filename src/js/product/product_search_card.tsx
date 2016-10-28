import * as React from 'react';
import * as MediaHelper from '../openstore/product_media_helper';
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

    protected pictureHelper : MediaHelper.ProductPicture;

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        };

        //30x30,40x40,65x90,170x200,250x750,400x500,800x800,1024x768,1280x1024,1200x1200,3000x3000
        //let url_spec = 'http://api.emdmusic.com/media/preview/picture'; // no slash at the end
        let url_spec = 'http://localhost/workspace/openstore/public/media/preview/picture'; // no slash at the end
        let options = {
            resolution: '400x500',
            quality: 85,
            format: 'jpg'
        };
        this.pictureHelper = new MediaHelper.ProductPicture(url_spec, options);
    }

    flipCard() {
        console.log('flipped');
        this.setState({ flipped: !this.state.flipped });
    }

    render() {

        let product = this.props.product;
        let media_id = product.picture_media_id;
        let img = '';
        if (media_id != '') {
            img = this.pictureHelper.getMediaUrl(media_id);
        }

        let flippedClass = '';
        if (this.state.flipped) {
            flippedClass = ' flipped';
        }

        return (
            <div className="product-card-wrap" onClick={(evt) => this.flipCard() }>
                <div className="product-card-container">
                    <div className={'product-card-flipper' + flippedClass}>
                        <div className="product-card-front">
                            <div className="product-card-image">
                                <img src={ img } />
                                <div className="top-left-zone">
                                    <div className="product-new-badge">New</div>
                                    <div className="product-popular-badge">Promo</div>
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