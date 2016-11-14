

export interface MoneyFormatterProps {
    locale?: string;
    currency: string;
    decimals?: number;
}


export class MoneyFormatter {

    protected formatter: Intl.NumberFormat;

    protected locale:string = 'en-US';

    protected currency:string;

    protected decimals: number =  2;


    public constructor(props: MoneyFormatterProps) {

        if (props.decimals) {
            this.decimals = props.decimals;
        }
        if (props.locale) {
            this.locale = props.locale;
        }
        this.currency = props.currency;
        this.initFormatter();
    }

    protected initFormatter() {
        this.formatter = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.currency,
            minimumFractionDigits: this.decimals,
        });
    }

    public format(value: number): string {

        return this.formatter.format(value);
    }
}