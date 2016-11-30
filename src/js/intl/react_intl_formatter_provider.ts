import { IntlProvider,
         FormattedDate, FormattedTime,
         FormattedRelative, FormattedNumber,
         FormattedPlural, FormattedMessage }
         from 'react-intl';

import { Map } from 'core-js';


export interface FormatDateProps extends FormattedDate.PropsBase {};
export interface FormatTimeProps extends FormattedDate.PropsBase {};
export interface FormatRelativeProps extends FormattedDate.PropsBase {};
export interface FormatNumberProps extends FormattedDate.PropsBase {};
export interface FormatPluralProps extends FormattedDate.PropsBase {};



export interface ReactGenericIntlFormatter {
    formatDate: (date: Date, options?: FormatDateProps) => string;
    formatTime: (date: Date, options?: FormatTimeProps) => string;
    formatRelative: (value: number, options?: FormatRelativeProps) => string;
    formatNumber: (value: number, options?: FormatNumberProps) => string;
    formatPlural: (value: number, options?: FormatPluralProps) => string;
    formatMessage: (messageDescriptor: FormattedMessage.MessageDescriptor, values?: Object) => string;
    formatHTMLMessage: (messageDescriptor: FormattedMessage.MessageDescriptor, values?: Object) => string;
}

export class ReactIntlFormatterProvider {

    protected static cache: Map<string, ReactGenericIntlFormatter> = new Map<string, ReactGenericIntlFormatter>();

    public static defaultLocale: string = 'en-US';

    protected constructor() {

    }

    public static getProvider(locale: string): ReactGenericIntlFormatter {

        let key = locale;
        if (!ReactIntlFormatterProvider.cache.has(key)) {
            let messages = {};

            let intlProvider = new IntlProvider({ locale: locale, messages }, {}) as any;
            console.log('intlProvider', intlProvider);
            let intl: ReactGenericIntlFormatter = intlProvider.getChildContext().intl;
            ReactIntlFormatterProvider.cache.set(key, intl);
        }
        return ReactIntlFormatterProvider.cache.get(key);
    }





}
