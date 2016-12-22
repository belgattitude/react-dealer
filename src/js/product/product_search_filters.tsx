import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../../css/product/product_search_filters.scss';

export interface ProductSearchFiltersProps {


}

export interface ProductSearchFiltersState {
}

export class ProductSearchFilters extends React.Component<ProductSearchFiltersProps, ProductSearchFiltersState> {

    protected searchInput: HTMLInputElement;

    constructor(props: ProductSearchFiltersProps) {
        super(props);
    }

    componentDidMount() {
    }





    render() {

        return (
            <div className="product-search-filters-container">


                <select>
                    <option>cool</option>
                </select>

            </div>
        );

    }

}

