import React from 'react';
import '../../css/product/product.scss';

class ProductSearchCard extends React.Component {

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

        let htmlDesc = this.formatDescription(product.description);

        return (
            <div className="product-card-wrap" onClick={(evt) => this.flipCard() }>
                <div className="product-card-container">
                    <div className={'flipper' + flippedClass}>
                        <div className="front">
                            <div className="product-card-image">
                                <img src={ img } />
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
                        </div>
                        <div className="back">

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

                                {product.description.split("\n").map(function(item) {
                                    return (
                                    <span>
                                    {item}
                                    <br/>
                                    </span>
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    formatDescription(description) {
        var desc = description.replace(/\n/g, "<br/>");
        return desc;

    }
}

export default ProductSearchCard;