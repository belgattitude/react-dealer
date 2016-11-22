export interface ProductSearchParams {
    /* search params */
    pricelist: string;
    language: string;
    query: string;
    brand?: string;
    category?: string;

    /* Browsing options */
    limit: number;
    offset?: number;
}
