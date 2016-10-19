
export interface IMediaUtilsOptions {
    resolution?: string,
    quality?: number
}

export default class OpenstoreProductMediaUtils {

    protected options: IMediaUtilsOptions;

    constructor(protected url: string, options?: IMediaUtilsOptions) {

        if (!options) {
            options = this.getDefaultOptions();
        } else {
            if (!options.resolution) {
                options.resolution = this.getDefaultOptions().resolution;
            }
            if (!options.quality) {
                options.quality = this.getDefaultOptions().quality;
            }
        }
        this.options = options;

    }

    getDefaultOptions(): IMediaUtilsOptions {
        return {
            resolution: '800x800',
            quality: 85
        };
    }

}


