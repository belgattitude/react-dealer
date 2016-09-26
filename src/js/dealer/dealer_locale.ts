import "babel-polyfill";


export default class DealerLocale {

    protected static defaultLocale: string = 'en_GB';

    protected static supportedLocales: Array<string> = [
        'en_US',
        'en_GB',
        'fr_FR',
        'nl_NL',
        'de_DE'
    ];

    protected locale: string;

    protected language: string;

    protected territory: string;

    /**
     *
     * @param locale
     */
    constructor(locale?: string) {

        if (!locale) {
            locale = DealerLocale.defaultLocale;
        } else if (!DealerLocale.isSupported(locale)) {
            let dl = DealerLocale.defaultLocale;
            locale = dl;
            console.log('Locale: ' + locale + ' not supported, falling back to default:' + dl);
        }
        this.locale = locale;
        this.language = locale.substr(0, 2);
        this.territory = locale.substr(3, 2);
    }

    /**
     *
     * @param locale
     * @returns {boolean}
     */
    public static isSupported(locale: string) : boolean {
        return (DealerLocale.supportedLocales.indexOf(locale) >= 0);
    }


    /**
     * Format dealer locator distance in miles/km from current locale.
     *
     * @param distance dealer distance in miles
     */
    public formatDistance(distance: number) : string {

        switch (this.territory) {
            case 'US':
            case 'GB':
                var unit = 'miles';
                var mult = 1;
                break;
            default:
                var unit = 'km';
                var mult = 1.60934;
        }

        let converted =  Math.round(distance * 10 * mult) / 10;
        return converted.toString() + ' ' + unit;

    }

    /**
     *
     * @returns {string}
     */
    public getLanguage() : string {
        return this.language;
    }

    /**
     *
     * @returns {string}
     */
    public getTerritory() : string {
        return this.territory;
    }

}


