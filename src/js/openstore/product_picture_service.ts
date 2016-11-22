export interface ProductPictureFormat {
    resolution?: string;
    quality?: number;
    type?: string;
}
export interface ProductPictureServiceProps {
    spec_url: string;
    format?: ProductPictureFormat;
}

export class ProductPictureService {

    protected spec_url: string;
    protected format: ProductPictureFormat;

    constructor(props?: ProductPictureServiceProps) {

        this.spec_url = props.spec_url;

        let defaultFormat = this.getDefaultFormat();
        if (!props.format) {
            this.format = defaultFormat;
        } else {
            let format: ProductPictureFormat = props.format;
            if (!format.resolution) {
                format.resolution = defaultFormat.resolution;
            }
            if (!format.quality) {
                format.quality = defaultFormat.quality;
            }
            if (!format.type) {
                format.type = defaultFormat.type;
            }
            this.format = format;
        }
    }

    getMediaUrl(media_id?: string, media_filemtime?: string): string {
        let media_url = '';
        if (media_id && media_id != '') {
            media_url = this.spec_url + '/' + this.format.resolution + '-' + this.format.quality;
            media_url += '/' + this.getPathPrefix(media_id) + '/';
            media_url += media_id;
            if (media_filemtime) {
                media_url += '_' + media_filemtime;
            }
            media_url += '.' + this.format.type
        }
        return media_url;
    }

    protected getPathPrefix(media_id: string): string {
        let pathPrefix = media_id.substring(media_id.length - 2);
        return pathPrefix;
    }

    getDefaultFormat(): ProductPictureFormat {
        return {
            resolution: '800x800',
            quality: 85,
            type: 'jpg'
        };
    }
}

