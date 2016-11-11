

export interface IJsonResult {
    data: Array<any>;
    request_id?: number;
    success: boolean;
    total: number;
    limit: number;
    count: number;
    start: number;
}


export class JsonResult {

    constructor(public result: IJsonResult) {

    }

    get data() : Array<Object> {
        return this.result.data;
    }
}



