/**
 * Created by Thisum on 8/17/2016.
 */
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

import {SERVER_RESPONSE_STATUS, BASE_URL} from "../util/constants";
import {getHeader} from "../util/request-builder.util";
import {Request} from "../obj/Request";


@Injectable()
export class RequestService{

    private baseUrl = BASE_URL + '/question';
    private options = {
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    constructor (private _http: Http) {}

    public loadRequests(count: number): Promise<Request[]>{

        const headers = getHeader();
        var url = this.baseUrl + '/load';

        return this._http.get( url , {headers : headers, body : {loadFrom : count}}).toPromise()
            .then(response => {
                const status = response.json().status;
                if(status == SERVER_RESPONSE_STATUS.SUCCESS)
                {
                    const data = response.json().result;
                    let objs: any[] = [];
                    for(let i=0; i<data.length; i++){
                        let date = new Date(data[i].requestTime).toLocaleString('en-GB', this.options);
                        let request = new Request(data[i]._id, date, data[i].image, data[i].question);
                        objs.push(request);
                    }
                    return objs;
                }
                else if( status == SERVER_RESPONSE_STATUS.FAILED)
                {
                    throw new Error(response.json().message);
                }
            })
            .catch(this.handleError);
    }

    public submitAnswer(answer: any): Promise<string>{
    
        const headers = getHeader();
        var url = this.baseUrl + '/answer';
        
        return this._http.patch( url, JSON.stringify(answer), {headers : headers}).toPromise()
            .then(response => {
                const obj = response.json();
                if(obj.status == SERVER_RESPONSE_STATUS.SUCCESS)
                {
                    return obj.status;
                }
                else if( obj.status == SERVER_RESPONSE_STATUS.FAILED)
                {
                    throw new Error(response.json().message);
                }
                else if( obj.status == SERVER_RESPONSE_STATUS.WARNING)
                {
                    throw new Error(response.json().message);
                }
            })
            .catch(this.handleError);
       
    }    

    private handleError(error: any){
        console.error('Error occurred : ' +error );
        return Promise.reject(error.message || error);
    }

}