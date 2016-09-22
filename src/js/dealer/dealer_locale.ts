import "babel-polyfill";



export default class DealerLocale {

    protected static supportedLocales: Array<string> = [
        'en_US',
        'en_GB',
        'fr_FR',
        'nl_NL',
        'de_DE'
    ];

    protected locale: string;


    protected language: string;

    /**
     *
     * @param locale
     */
    constructor(locale: string) {

        if (!DealerLocale.isSupported(locale)) {
            throw new Error('Unsupported locale' + locale);
        }
        this.locale = locale;
        this.language = locale.substr(0, 2);
        console.log('this.language', this.language);
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
     *
     * @returns {string}
     */
    public getLanguage() : string {
        return this.language;
    }


}


