export interface ProductPictureOptions {
    resolution?: string,
    quality?: number,
    format?: string
}

export class ProductPicture {

    protected spec_url: string;
    protected options: ProductPictureOptions;

    constructor(spec_url: string, options?: ProductPictureOptions) {

        if (!options) {
            options = this.getDefaultOptions();
        } else {
            if (!options.resolution) {
                options.resolution = this.getDefaultOptions().resolution;
            }
            if (!options.quality) {
                options.quality = this.getDefaultOptions().quality;
            }
            if (!options.format) {
                options.format = this.getDefaultOptions().format;
            }
        }
        this.options = options;
        this.spec_url = spec_url;
    }

    getMediaUrl(media_id?: string): string {
        let media_url = '';
        if (media_id && media_id != '') {
            media_url = this.spec_url + '/' + this.options.resolution + '-' + this.options.quality;
            media_url += '/' + this.getPathPrefix(media_id) + '/';
            media_url += media_id + '.' + this.options.format;
        }
        return media_url;
    }

    protected getPathPrefix(media_id: string): string {
        let pathPrefix = media_id.substring(media_id.length - 2);
        return pathPrefix;
    }

    getDefaultOptions(): ProductPictureOptions {
        return {
            resolution: '800x800',
            quality: 85,
            format: 'jpg'
        };
    }
}

