import * as React from 'react';
import * as Models from './product_search_model';
import * as ProductStockLevel from '../openstore/product_stock_level';
import { UnitFormatter } from '../formatter/unit_formatter';
import '../../css/product/product_stock.scss';


export interface StockLevelProps {
    product: Models.ProductSearchModel;
    locale: string;
}

export interface StockLevelState {

}

export class StockLevel extends React.Component<StockLevelProps, StockLevelState> {

    protected productStockLevel: ProductStockLevel.ProductStockLevel;

    protected unitFormatter: UnitFormatter;

    protected locale: string;

    protected max_stock: number = 30;

    constructor(props) {
        super(props);
        this.locale = props.locale;
        this.productStockLevel = new ProductStockLevel.ProductStockLevel();
        this.initUnitFormatter(0);
    }

    initUnitFormatter(decimals: number) {
        this.unitFormatter = new UnitFormatter({
            locale: this.locale,
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
            unit: ''
        });
    }


    render() {

        let product = this.props.product;
        let stockClass = this.productStockLevel.getStockLevel(product.stock_level);

        let stock = product.available_stock;
        let stockLabel = this.unitFormatter.format(stock);

        if (stock >= this.max_stock) {
            stockLabel = ">" + stockLabel;
        }

        let till_end_of_stock = (product.flag_till_end_of_stock == "1");
        if (till_end_of_stock) {
            stockClass = "level-till-end-of-stock";
            stockLabel = this.unitFormatter.format(product.remaining_total_available_stock);
        }

        return (
            <div className="stock-badge">

                <div className={ stockClass }>
                    <span>
                        { stockLabel }
                    </span>
                </div>

            </div>
        );
    }

}

