import { NumberFormatterProps } from './number_formatter';
import {IntlFormatterProvider} from "../intl/intl_formatter_provider";

export interface UnitFormatterProps extends NumberFormatterProps{
    unit?: string;
    unitSeparator?: string;
}


export class UnitFormatter {

    protected formatter: Intl.NumberFormat;
    protected locale:string = 'en-US';

    protected minimumFractionDigits: number = 2;
    protected maximumFractionDigits: number = 2;

    protected unit: string = '';
    protected unitSeparator: string = '';

    public constructor(props: UnitFormatterProps) {
        if (props.locale) {
            this.locale = props.locale;
        }
        if (props.minimumFractionDigits != null) {
            this.minimumFractionDigits = props.minimumFractionDigits;
        }
        if (props.maximumFractionDigits != null) {
            this.maximumFractionDigits = props.maximumFractionDigits;
        }

        if (props.unit != null) {
            this.unit = props.unit;
        }
        if (props.unitSeparator != null) {
            this.unitSeparator = props.unitSeparator;
        }
        this.initFormatter();
    }

    protected initFormatter() {
        this.formatter = IntlFormatterProvider.getNumberFormatter(this.locale, {
            minimumFractionDigits: this.minimumFractionDigits,
            maximumFractionDigits: this.maximumFractionDigits
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
            formatted = formatted + this.unitSeparator + this.unit;
        }

        return formatted;
    }
}