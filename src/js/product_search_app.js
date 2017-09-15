import React from 'react';
import ReactDOM from 'react-dom';
import { ProductSearchBar } from './product/product_search_bar';
import { ProductSearch } from './product/product_search';
import { ProductSearchService, ProductSearchParams } from './product/product_search_service';
import { ProductPictureService } from './openstore/product_picture_service';
import { ProductStore } from './product/product_store';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';


var sourceUrl = 'http://localhost/emdmusic_server/public/api/v1/catalog/search';
var locale = 'fr-FR';
var language = 'en';
var pricelist = 'FR';
var brandTitle = 'Triana';

var searchInputId = 'catalogSearchTextInput';
var initialSearchText = '';



var productSearchService = new ProductSearchService({
    source: sourceUrl
});


var windowInnerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var isMobile = (windowInnerWidth < 600);

var productPictureService = new ProductPictureService({
    spec_url: 'https://apps.emdmusic.com/media/preview/picture',
    format: {
        resolution: isMobile ?  '300x400' : '400x500',
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


var productStoreParams = {
    //sourceUrl: 'http://emd.localhost/api/v1/catalog/search',
    sourceUrl: 'http://emd.localhost/triana/search.json',
    //sourceUrl: 'http://localhost/emdmusic_server/public/api/v1/catalog/search',
    locale: 'fr-FR',
    language: 'en',
    pricelist: 'FR'
};

export const stores = (state = {}, token) => {
    //const request = requestCreator(state.common.hostname, token)
    console.log('stores creatd');
    return {
        products: new ProductStore(productStoreParams),
    }
}

const productStore = stores().products;

const App = () => (
    <Provider productStore={ productStore }>
        { productSearch }
    </Provider>
)

ReactDOM.render(
    <App />,
    document.getElementById('product_search')
);


/*
 ReactDOM.render(
 <Provider productStore={ productStore } >
    <ProductSearch
        locale={locale}
        language={language}
        initialSearchText={initialSearchText}

     productSearchService={productSearchService}
     productPictureService={productPictureService}
     productSearchBar={productSearchBar}

     searchInputTarget={searchInputId}
     searchDebounceTime={isMobile ? 450 : 350}
     searchLimit={isMobile ? 15 : 50}
     hideSearchInput={true}
     pricelist={pricelist}/>
 </Provider>,
 document.getElementById('product_search')
 );
*/

