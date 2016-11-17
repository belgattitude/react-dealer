

export interface UnitFormatterProps {
    locale?: string;
    decimals?: number;
    unit?: string;
}


export class UnitFormatter {

    protected formatter: Intl.NumberFormat;

    protected locale:string = 'en-US';

    protected decimals: number =  0;

    protected unit: string = '';

    public constructor(props: UnitFormatterProps) {

        if (props.decimals) {
            this.decimals = props.decimals;
        }
        if (props.locale) {
            this.locale = props.locale;
        }
        this.initFormatter();
    }

    protected initFormatter() {
        this.formatter = new Intl.NumberFormat(this.locale, {
            minimumFractionDigits: this.decimals,
        });
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    public format(value: string | number): string {
        let formatted = '';

        if (typeof value === "string") {
            formatted = this.formatter.format(parseFloat(value));
        } else {
            formatted = this.formatter.format(value);
        }


        if (this.unit != '') {
            formatted = formatted + ' ' + this.unit;
        }

        return formatted;
    }
}