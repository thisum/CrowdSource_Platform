/**
 * Created by thisum on 1/18/2017.
 */

export class Request{

    constructor(
                public requestId: string,
                public requestTime: string,
                public image: string,
                public question: string,
                public response?: string
                ) {}
}