import React from 'react';
import ReactDOM from 'react-dom';
import { ProductSearchBar } from './product/product_search_bar';
import { ProductSearch } from './product/product_search';
import { ProductSearchService } from './product/product_search_service';
import { ProductPictureService } from './openstore/product_picture_service';


var windowInnerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var isMobile = (windowInnerWidth < 600);

var productSearchService = new ProductSearchService({
    source: 'http://localhost/emdmusic_server/public/api/v1/catalog/search'
});

var productPictureService = new ProductPictureService({
    spec_url: 'http://api.emdmusic.com/media/preview/picture',
    format: {
        resolution: isMobile ?  '300x400' : '400x500',
        type: 'jpg',
        quality: 85
    }
});

var searchInputId = 'catalogSearchTextInput';

var productSearchBar = React.createElement(ProductSearchBar, {
    searchInputId: searchInputId,
    initialSearchText: 'ukulele'
});

var productSearch = React.createElement(ProductSearch, {
    locale: 'fr-FR',
    language: 'en',

    productSearchService: productSearchService,
    productPictureService: productPictureService,

    searchInputTarget: searchInputId,
    searchDebounceTime: isMobile ? 450 : 350,
    searchLimit: isMobile ? 15 : 50,
    hideSearchInput: true,
    pricelist: 'FR',

}, null);

ReactDOM.render(
    productSearchBar,
    document.getElementById('product_search_bar')
)

ReactDOM.render(
    productSearch,
    document.getElementById('product_search')
);