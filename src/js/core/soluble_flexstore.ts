

export interface IJsonResult {
    data: Array<any>
}


export class JsonResult {

    constructor(public result: IJsonResult) {

    }

    get data() : Array<Object> {
        return this.result.data;
    }
}



