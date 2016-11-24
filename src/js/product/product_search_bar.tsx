import * as React from 'react';


import '../../css/product/product_search_bar.scss';


export interface ProductSearchBarProps {
}

export interface ProductSearchBarState {
    hasQuery: boolean;
}

export class ProductSearchBar extends React.Component<ProductSearchBarProps, ProductSearchBarState> {

    constructor(props: ProductSearchBarProps) {
        super(props);
        this.state = {
            hasQuery: false
        } as ProductSearchBarState;
    }


    /**
     * function tog(v){return v?'addClass':'removeClass';}
     $(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});


     */

    onSearchInput(evt: any) {
        if (event.target) {
            let element = evt.target as HTMLInputElement;
            let value = element.value;
            if (value) {

                this.setState({
                    hasQuery: true
                })
            } else {
                this.setState({
                    hasQuery: false
                })
            }
        }
    }


    render() {

        const id = "catalogSearchTextInput";

        let searchInputClass = [
            'clearable',
        ].join(' ');

        if (this.state.hasQuery) {
            searchInputClass += " x";
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
                                <span className="text-input-wrapper">
                                    <input className={"search-input " + searchInputClass}
                                           onInput={ (evt: any) => {
                                                this.onSearchInput(evt);
                                           } }
                                           id={ id } type="search" autoComplete="off"
                                           placeholder="Search"
                                    />
                                    <span>✖</span>
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

