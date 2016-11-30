
import { Map } from 'core-js';
import { sortBy, toPairs, fromPairs } from 'lodash';


export class IntlFormatterProvider {

    protected static cache: Map<string, any> = new Map<string, any>();

    protected constructor() {

    }

    public static getNumberFormatter(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
        let key = 'NumberFormatter_' + locale + '_';
        //key += JSON.stringify(fromPairs(sortBy(toPairs(options), 0)));
        key += JSON.stringify(sortBy(toPairs(options), 0));
        if (!IntlFormatterProvider.cache.has(key)) {
            console.log('Created a new NumberFormatter', key);
            let formatter = new Intl.NumberFormat(locale, options) as any;
            IntlFormatterProvider.cache.set(key, formatter);
        }
        return IntlFormatterProvider.cache.get(key);
    }


}
