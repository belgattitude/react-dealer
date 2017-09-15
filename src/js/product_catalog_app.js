import React from 'react';
import ReactDOM from 'react-dom';

import { ProductCatalog } from './product/product_catalog';


import { ProductStore } from './product/product_store';
import { ProductStoreParams } from './product/product_store_params';


import { ProductSearch } from './product/product_search';
import { ProductSearchBar } from './product/product_search_bar';

import { ProductSearchService } from './product/product_search_service';
import { ProductPictureService } from './openstore/product_picture_service';


import { observable } from 'mobx';
import { Provider } from 'mobx-react';


var sourceUrl = 'http://localhost/emdmusic_server/public/api/v1/catalog/search';
var locale = 'fr-FR';
var language = 'en';
var pricelist = 'FR';
var brandTitle = 'Emdmusic';

var searchInputId = 'catalogSearchTextInput';
var initialSearchText = '';

var windowInnerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var isMobile = (windowInnerWidth < 600);



var productSearchService = new ProductSearchService({
    source: sourceUrl
});


var productPictureService = new ProductPictureService({
    spec_url: 'https://apps.emdmusic.com/media/preview/picture',
    format: {
        resolution: '400x500',
        type: 'jpg',
        quality: 85
    }
});

var productSearchBar = React.createElement(ProductSearchBar, {
    searchInputId: searchInputId,
    initialSearchText: initialSearchText,
    brandTitle: brandTitle,
    renderInElementId: 'product_search_bar'
});



var productSearch = React.createElement(ProductSearch, {
    locale: locale,
    language: language,
    initialSearchText: initialSearchText,

    productSearchService: productSearchService,
    productPictureService: productPictureService,
    productSearchBar: productSearchBar,

    searchInputTarget: searchInputId,
    searchDebounceTime: isMobile ? 450 : 350,
    searchLimit: isMobile ? 15 : 50,
    hideSearchInput: true,
    pricelist: pricelist

});

/*
var productSearch = new ProductSearch({
        locale: locale,
        language: language,
        initialSearchText: initialSearchText,

        productSearchService: productSearchService,
        productPictureService: productPictureService,
        productSearchBar: productSearchBar,

        searchInputTarget: searchInputId,
        searchDebounceTime: isMobile ? 450 : 350,
        searchLimit: isMobile ? 15 : 50,
        hideSearchInput: true,
        pricelist: pricelist
});*/

/*
var productCatalog = React.createElement(ProductCatalog, {
//    productSearch: productSearch,
//    catalogState: catalogState

});*/

var productStoreParams = {
    //sourceUrl: 'http://localhost/emdmusic_server/public/api/v1/catalog/search',
    sourceUrl: 'http://emd.localhost/api/v1/catalog/search',
    locale: 'fr-FR',
    language: 'en',
    pricelist: 'FR'
};

export const stores = (state = {}, token) => {
    //const request = requestCreator(state.common.hostname, token)
    console.log('stores created');
    return {
        products: new ProductStore(productStoreParams),
    }
}

console.log(stores().products);

//const products = observable([]);
const productStore = stores().products;

ReactDOM.render(
    <Provider productStore={ productStore } >
        <ProductCatalog
            productSearch={ productSearch }
        />
    </Provider>,
    document.getElementById('product_catalog')
);