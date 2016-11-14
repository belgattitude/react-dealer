

export interface NumberFormatterProps {
    locale?: string;
    decimals?: number;
}


export class NumberFormatter {

    protected formatter: Intl.NumberFormat;

    protected locale:string = 'en-US';


    protected decimals: number =  2;


    public constructor(props: NumberFormatterProps) {

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

        });
    }

    public format(value: number): string {

        return this.formatter.format(value);
    }
}