import * as React from "react";

import { ProductSearchService } from '../services/product_search_service';

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Hello extends React.Component<HelloProps, undefined> {
    render() {
        return (
            <div>
                <h1>
                    Hello from {this.props.compiler} and {this.props.framework}!
                </h1>

                <button onClick={ this.onClick }>Click me</button>
            </div>
        );
    }

    onClick = () => {
        //alert('cliqued');
        let sourceUrl = 'http://localhost/emdmusic_server/public/api/v1/catalog/search';
        let ps = new ProductSearchService(sourceUrl);

        let data = ps.fetch({
            pricelist: 'BE',
            language: 'en',
            query: 'PB45',
            limit: 10
        }).then( (data) => {

            console.log('data', data);
        });




    }
}