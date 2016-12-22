import * as React from 'react';

import { Provider, observer, inject } from 'mobx-react';

import '../../css/product/product_catalog.scss';
import { ProductSearch } from './product_search';
import { ProductStore } from "./product_store";

export interface ProductCatalogProps {
    productStore: ProductStore;
    productSearch: ProductSearch;
}

export interface ProductCatalogState {
}


@inject('productStore')
@observer
export class ProductCatalog extends React.Component<ProductCatalogProps, ProductCatalogState> {

    constructor(props: ProductCatalogProps) {

        super(props);

        this.state = {

        } as ProductCatalogState;

    }



    componentDidMount() {

    }


    render() {

        //console.log('AAAAAAAAAAAAA', this.props);
        let products = this.props.productStore.products;
        let productSearch = this.props.productSearch;

        return (
            <div className="FlexboxLayout">
                <header className="FlexboxLayout-header">
                    <div className="Header Header--cozy" role="banner">
                        Header
                    </div>
                </header>
                <main className="FlexboxLayout-body">
                    <article className="FlexboxLayout-content">
                        { productSearch }
                    </article>
                    <nav className="FlexboxLayout-left u-textCenter">
                        <strong>Navigation</strong>
                    </nav>
                    <aside className="FlexboxLayout-right u-textCenter">
                        <strong>Advertisements</strong>
                    </aside>
                </main>
                <footer className="FlexboxLayout-footer">
                    <div className="Footer">
                        Footer
                    </div>
                </footer>
            </div>
        );
/*
 <div>
 <ul>
 { products.map((product) => {
 return <li key={product.product_id}>{ product.reference}</li>
 })}
 </ul>
 </div>

 */
    }

}

