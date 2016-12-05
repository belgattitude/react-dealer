import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../../css/product/product_search_bar.scss';

export interface ProductSearchBarProps {

    searchInputId: string;

    /**
     * Append navbar to an existing DOM node
     */
    renderInElementId?: string;

    /**
     * Initial searchText
     */
    initialSearchText?: string;

    /**
     * Name displayed in navbar
     */
    brandTitle?: string;

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

    componentDidMount() {
        // Hack to render in a different element id
        if (this.props.renderInElementId) {
            const el = document.getElementById(this.props.renderInElementId);
            if (!el) {
                console.log("Error cannot render ProductSearchBar into '" + this.props.renderInElementId +
                            "', it does not exists in DOM");
            } else {
                ReactDOM.findDOMNode(el).appendChild(ReactDOM.findDOMNode(this));
            }
        }
    }

    onSearchTextChange() {
        let value = this.searchInput.value;
        this.setState({
            searchText: value,
            hasQuery: (value ? true : false)
        });
    }

    clearSearch() {

        // clear input value
        this.searchInput.value = '';

        /*
        //evt.target.onchange(evt);
        //new Event('change', { 'bubbles': true })
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true);
        */
        let evt = new CustomEvent(
            "input",
            {
                detail: {
                    message: "Cleared search input",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        this.searchInput.dispatchEvent(evt);
    }




    render() {
        const id = this.props.searchInputId;

        let hasQueryClass = '';
        if (this.state.hasQuery) {
            hasQueryClass = 'has-query';
        }

        return (
            <div className="product-searchbar-container" ref="product_searchbar_container">
                <nav className="product-searchbar-navbar">
                    <a href="#" className="toggle">
                        <i className="fa fa-reorder"></i>
                    </a>
                    <a className="brand">{ this.props.brandTitle }</a>

                    <div className="left">
                        <div className="link">Home</div>
                        <div className="link">Products</div>
                    </div>

                    <div className="right">
                        <div className="product-searchbar-input">
                                <span className={'text-input-wrapper ' + hasQueryClass }>
                                    <input id={ id }
                                           className="search-input"
                                           maxLength={ 40 }
                                           ref={(searchInput) => { this.searchInput = searchInput; }}
                                           onInput={ (evt: any) => {
                                                this.onSearchTextChange();
                                           } }
                                           onChange={ (evt: any) => {
                                                this.onSearchTextChange();
                                           } }
                                           type="input"
                                           autoComplete="off"
                                           placeholder="Search"
                                           value={ this.state.searchText }
                                    />
                                    <div className="clear-icon" onClick={ (evt: any) => {
                                        this.clearSearch();
                                    } }>
                                        ✖
                                    </div>
                                </span>
                        </div>
                    </div>
                </nav>
            </div>
        );

    }

}

