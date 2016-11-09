import * as React from 'react';
import * as Models from './product_search_model';
import * as ProductStockLevel from '../openstore/product_stock_level';
import '../../css/product/product.scss';


export interface StockLevelProps {
    product: Models.ProductSearchModel;
    locale: string;
}

export interface StockLevelState {

}

export default class StockLevel extends React.Component<StockLevelProps, StockLevelState> {

    protected productStockLevel: ProductStockLevel.ProductStockLevel;

    protected unitFormatter: Intl.NumberFormat;

    protected locale: string;

    constructor(props) {
        super(props);
        this.locale = props.locale;
        this.productStockLevel = new ProductStockLevel.ProductStockLevel();
        this.initUnitFormatter(0);
    }

    initUnitFormatter(minimumFractionDigits: number) {
        this.unitFormatter = new Intl.NumberFormat(this.locale, {
            minimumFractionDigits: minimumFractionDigits,
        });
    }


    render() {
        let product = this.props.product;
        return (
            <div className="stock-badge">
                <div className={ this.productStockLevel.getStockLevel(product.stock_level) }>
                    <span>
                        { product.available_stock >= 30 ?
                            <a>&gt;</a>
                            : ''
                        }
                        { this.unitFormatter.format(product.available_stock) }
                    </span>
                </div>
            </div>
        );
    }

}

