import React from 'react';
import ReactDOM from 'react-dom';
import ProductSearch from './product/product_search';

var productSearch = React.createElement(ProductSearch, {
    source: 'http://localhost/emdmusic_server/public/api/v1/catalog/search',
    searchInputTarget: 'catalogSearchTextInput',
    searchDebounceTime: 400,
    searchLimit: 30,
    hideSearchInput: true,
    language: 'en',
    pricelist: 'ES',
    locale: 'fr-FR'
}, null);

ReactDOM.render(
    productSearch,
    document.getElementById('product_search')
);