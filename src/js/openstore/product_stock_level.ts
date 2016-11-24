
export interface LevelToClassNameMap {
    [level: string]: string;
}

export class ProductStockLevel {

    /**
     * Exclusions
     */
    public static readonly STOCK_ON_REQUEST_ONLY = "STOCK_ON_REQUEST_ONLY";
    public static readonly STOCK_LEVEL_UNDETERMINABLE = "STOCK_LEVEL_UNDETERMINABLE";
    public static readonly STOCK_AVAILABLE_UPON_ACCEPTANCE = "STOCK_AVAILABLE_UPON_ACCEPTANCE";
    public static readonly STOCK_UPON_AVAILABLE_QTY = "STOCK_UPON_AVAILABLE_QTY";

    /**
     * Stock levels
     */
    public static readonly STOCK_FULL   = "ON_STOCK_FULL";
    public static readonly STOCK_HIGH   = "ON_STOCK_HIGH";
    public static readonly STOCK_NORMAL = "ON_STOCK_NORMAL";
    public static readonly STOCK_LOW    = "ON_STOCK_LOW";
    public static readonly STOCK_EMPTY  = "NO_STOCK";
    public static readonly STOCK_LAST   = "STOCK_LAST"

    protected map: LevelToClassNameMap;


    constructor() {

        this.map = this.getDefaultMap();
    }

    getDefaultMap(): LevelToClassNameMap {

        let map: LevelToClassNameMap = {};
        map[ProductStockLevel.STOCK_FULL]   = 'level-4-full';
        map[ProductStockLevel.STOCK_HIGH]   = 'level-3-high';
        map[ProductStockLevel.STOCK_NORMAL] = 'level-2-normal';
        map[ProductStockLevel.STOCK_LOW] = 'level-1-low';
        map[ProductStockLevel.STOCK_EMPTY] = 'level-0-empty';

        return map;
    }


    getStockLevel(stock_level: string): string {

        let className = stock_level;

        if (this.map[stock_level]) {
            className = this.map[stock_level];
        } else {
            className = 'level-unknown';
        }

        return className;

    }

}

