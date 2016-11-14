

export interface UnitFormatterProps {
    locale?: string;
    decimals?: number;
}


export class UnitFormatter {

    protected formatter: Intl.NumberFormat;

    protected locale:string = 'en-US';


    protected decimals: number =  0;


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

    public format(value: number): string {

        return this.formatter.format(value);
    }
}