import {IntlFormatterProvider} from "../intl/intl_formatter_provider";

export interface NumberFormatterProps {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}


export class NumberFormatter {

    protected formatter: Intl.NumberFormat;
    protected locale:string = 'en-US';

    protected minimumFractionDigits: number = 2;
    protected maximumFractionDigits: number = 2;

    public constructor(props: NumberFormatterProps) {
        if (props.locale) {
            this.locale = props.locale;
        }
        if (props.minimumFractionDigits != null) {
            this.minimumFractionDigits = props.minimumFractionDigits;
        }
        if (props.maximumFractionDigits != null) {
            this.maximumFractionDigits = props.maximumFractionDigits;
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

        return formatted;
    }
}