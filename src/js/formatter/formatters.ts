import { MoneyFormatter, MoneyFormatterProps } from './money_formatter';
import { UnitFormatter, UnitFormatterProps } from './unit_formatter';
import { NumberFormatter, NumberFormatterProps } from './number_formatter';

export interface FormattersProps {
    locale?: string
}

export class Formatters {

    protected locale: string = 'en-US';

    public constructor(props: FormattersProps) {
        if (props.locale) {
            this.locale = props.locale;
        }
    }

    public getMoneyFormatter(props: MoneyFormatterProps) : MoneyFormatter {

        if (!props.locale) {
            props.locale = this.locale;
        }
        return new MoneyFormatter(props);
    }

    public getUnitFormatter(props: UnitFormatterProps): UnitFormatter {
        if (!props.locale) {
            props.locale = this.locale;
        }
        return new UnitFormatter(props);
    }

    public getNumberFormatter(props: NumberFormatterProps): NumberFormatter {
        if (!props.locale) {
            props.locale = this.locale;
        }
        return new NumberFormatter(props);
    }


}
