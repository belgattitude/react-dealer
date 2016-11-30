import * as React from 'react';


import '../../css/product/product_search_bar.scss';


export interface ProductSearchBarProps {

    searchInputId: string;

    /**
     * Initial searchText
     */
    initialSearchText?: string;

}

export interface ProductSearchBarState {
    hasQuery: boolean;
    searchText: string;
}

export class ProductSearchBar extends React.Component<ProductSearchBarProps, ProductSearchBarState> {

    protected searchInput: HTMLInputElement;

    constructor(props: ProductSearchBarProps) {
        super(props);
        let initialText = this.props.initialSearchText || '';

        this.state = {
            hasQuery: initialText != '',
            searchText: initialText
        } as ProductSearchBarState;
    }

    onSearchTextChange() {
        let value = this.searchInput.value;
        this.setState({
            searchText: value,
            hasQuery: (value ? true : false)
        });
    }

    clearSearch() {
        this.searchInput.value = '';
    }




    render() {
        const id = this.props.searchInputId;

        let hasQueryClass = '';
        if (this.state.hasQuery) {
            hasQueryClass = 'has-query';
        }



        return (
            <div className="product-searchbar-container">
                <nav className="product-searchbar-navbar">
                    <a href="#" className="toggle">
                        <i className="fa fa-reorder"></i>
                    </a>
                    <a href="#" className="brand">Triana</a>

                    <div className="left">
                    </div>

                    <div className="right">
                        <div className="product-searchbar-input">
                                <span className={'text-input-wrapper ' + hasQueryClass }>
                                    <input className="search-input"
                                           ref={(searchInput) => { this.searchInput = searchInput; }}
                                           onInput={ (evt: any) => {
                                                this.onSearchTextChange();
                                           } }
                                           onChange={ (evt: any) => {
                                                this.onSearchTextChange();
                                           } }
                                           id={ id }
                                           type="input"
                                           autoComplete="off"
                                           placeholder="Search"
                                           value={ this.state.searchText }
                                    />
                                    <span className="clear-icon" onClick={ (evt: any) => {
                                        this.clearSearch();
                                    } }>
                                        ✖

                                    </span>
                                </span>
                        </div>
                    </div>
                </nav>
            </div>
        );


        /*

         <div className="left">
         <a href="#" className="link">Home</a>
         <a href="#" className="link">Catalog</a>
         </div>

         */


    }

}

