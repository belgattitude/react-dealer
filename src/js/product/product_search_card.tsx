import * as React from 'react';
import '../../css/product/product.scss';

interface ProductModel {
    product_id: string,
    reference: string,
    brand_title: string,
    title: string,
    category_breadcrumb: string;
    description: string,
    picture_media_id?: string
}

export interface ProductSearchCardProps {
    data: ProductModel;
}

export interface ProductSearchCardState {
    flipped?: boolean;
}


class ProductSearchCard extends React.Component<ProductSearchCardProps, ProductSearchCardState> {

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        };
    }

    flipCard() {
        console.log('flipped');
        this.setState({ flipped: !this.state.flipped });
    }

    render() {
        let product = this.props.data;
        let resolution = '';
        //resolution = '800x800';
        resolution = '250x750';
        //30x30,40x40,65x90,170x200,250x750,800x800,1024x768,1280x1024,1200x1200,3000x3000

        //resolution = '170x200';
        let imgPattern = 'http://api.emdmusic.com/media/preview/picture/' + resolution + '-85';
        /**
         * picture_media_id: "7480",
         picture_media_filemtime: "1338815764",
         */
        let media_id = product.picture_media_id;
        let img = '';
        if (media_id != null) {
            let imgPfx = media_id.substring(media_id.length - 2);
            img = imgPattern + '/' + imgPfx + '/' + media_id + '.jpg';
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
                                <button type="button" className="btn btn-primary">New</button>
                            </div>

                            <div className="product-card-content">
                                <span className="product_reference">
                                    { product.reference }
                                </span>
                                <span className="product_brand">
                                    { product.brand_title }
                                </span>
                                <div className="product_title">
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
                        <div className="product-card-back">

                            <div>
                                {product.category_breadcrumb}
                            </div>
                            <div className="product-card-title">
                                <span className="product_reference">
                                    {product.reference}
                                </span>
                                <span className="product_brand">
                                    {product.brand_title}
                                </span>
                                <div className="product_title">
                                    {product.title}
                                </div>
                            </div>

                            <div className="product_description">

                                {product.description.split("\n").map(function(item, id) {
                                    return (
                                        <li>{item}</li>
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default ProductSearchCard;