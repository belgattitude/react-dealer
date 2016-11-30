import { NumberFormatterProps, NumberFormatter } from './number_formatter';
import { merge } from 'lodash';
import { MoneyFormatter } from "./money_formatter";

import { IntlFormatterProvider } from '../intl/intl_formatter_provider';

export interface PrettyPriceFormatterProps extends NumberFormatterProps {
    currency: string;
}

export interface PriceParts {
    intPart: string;
    fractionPart: string;
    currencySymbol: string;
    __html: string;
}


export class PrettyPriceFormatter {

    protected props: PrettyPriceFormatterProps;

    protected numberFormatter: Intl.NumberFormat;

    public constructor(props: PrettyPriceFormatterProps) {

        this.props = merge({}, this.getDefaultProps(), props);

        let currency = props.currency;
        let locale = props.locale;
        this.numberFormatter = IntlFormatterProvider.getNumberFormatter(locale,
            {
                style: 'currency',
                currency: currency,
                useGrouping: false,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    }


    public getParts(value: string|number, options?: PrettyPriceFormatterProps) : PriceParts {

        let price: number;
        if (typeof value === "string") {
            price = parseFloat(value);
        } else {
            price = value;
        }



        const formatted = this.numberFormatter.format(price);
        let currencySymbol = formatted.replace(/[\d\ \.,]+/g, '');



        let fractionPart = this.numberFormatter.format((price % 1))
            .replace(/[^\d\ \.,)]/g, '').replace(/^0/, '');


        let intPart = formatted.replace(new RegExp('(' + fractionPart + ')'), '').replace(/[^\d\.,\ ]/g, '');
        let html = formatted.replace(new RegExp('(' + fractionPart + '.*)'), '<span class="decimals">$1</span>') ;


        let parts = {
            intPart: intPart,
            fractionPart: fractionPart,
            currencySymbol: currencySymbol,
            __html: html
        };
        return parts;
    }

    public getDefaultProps(): PrettyPriceFormatterProps {
        return  {
            currency: 'USD',
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2

        } as PrettyPriceFormatterProps;

    }
}
