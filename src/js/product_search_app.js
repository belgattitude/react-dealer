import React from 'react';
import ReactDOM from 'react-dom';
import ProductSearch from './product/product_search';

var productSearch = React.createElement(ProductSearch, {
    source: 'http://localhost/emdmusic_server/public/api/v1/catalog/search',
}, null);

ReactDOM.render(
    productSearch,
    document.getElementById('product_search')
);