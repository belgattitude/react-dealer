import { NumberFormatterProps } from './number_formatter';

export interface MoneyFormatterProps extends NumberFormatterProps {
    currency: string;
}

export class MoneyFormatter  {

    protected formatter: Intl.NumberFormat;
    protected locale:string = 'en-US';

    protected minimumFractionDigits: number = 2;
    protected maximumFractionDigits: number = 2;

    protected currency:string;

    public constructor(props: MoneyFormatterProps) {

        if (props.locale) {
            this.locale = props.locale;
        }
        if (props.minimumFractionDigits != null) {
            this.minimumFractionDigits = props.minimumFractionDigits;
        }
        if (props.maximumFractionDigits != null) {
            this.maximumFractionDigits = props.maximumFractionDigits;
        }

        this.currency = props.currency;
        this.initFormatter();
    }

    protected initFormatter() {
        this.formatter = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.currency,
            minimumFractionDigits: this.minimumFractionDigits,
            maximumFractionDigits: this.maximumFractionDigits,
        });
    }

    public format(value: number | string): string {

        let formatted: string = '';
        let val: number;

        if (typeof value === "string") {
            val = parseFloat(value);
        } else {
            val = value;
        }

        formatted = this.formatter.format(val);
        return formatted;

    }

    /*
    public format(value: number | string, part?: string): string {

        let formatted = '';
        let val: number;

        if (typeof value === "string") {
            val = parseFloat(value);
        } else {
            val = value;
        }

        if (part == 'fraction') {
            val = val%1;
        } else if (part == 'integer') {
            val = Math.floor(val);
        }

        formatted = this.formatter.format(val);
        return formatted;

    }
*/
}