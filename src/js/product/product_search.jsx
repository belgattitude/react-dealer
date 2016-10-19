import React from 'react';
import '../../css/product/product.scss';
import ProductSearchService from  './product_search_service';
import ProductSearchCard from './product_search_card';


class ProductSearch extends React.Component {

    static propTypes = {
        source: React.PropTypes.string.isRequired,
    }

    static defaultProps = {
    }

    productSearchService = null;

    constructor(props) {
        super(props);
        this.productSearchService = new ProductSearchService({
            source: props.source
        });
        this.state = {
            products: []
        };
        this.searchProducts();
    }

    searchProducts(query) {
        if (query == undefined) query = '';
        this.productSearchService.searchProducts('BE', 'en', query, 50).then(
            (products) => {
                this.setState({ products : products.data} );
            }
        );
    }

    handleChange({ target }) {
        console.log('target', target);
        console.log('value', target.value)
        this.setState({
            [target.id]: target.value,
        });
    }

    render() {
        return (
            <div>
                <div>
                    <input type="text" ref="input" onChange={(evt) => this.searchProducts(evt.target.value) }  />
                </div>
                <div className="product-list-container">
                    {this.state.products.map((product) => {
                        return <ProductSearchCard key={product.product_id} data={product} />
                    })}
                </div>
            </div>
        );
    }

}

export default ProductSearch;