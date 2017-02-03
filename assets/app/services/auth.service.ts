/**
 * Created by Thisum on 8/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from "./../obj/User";
import {SERVER_RESPONSE_STATUS, BASE_URL} from "../util/constants";

@Injectable()
export class AuthService {

    private baseUrl = BASE_URL + '/auth';

    constructor (private _http: Http) {}

    signup(user: User): Promise<Boolean> {

        let headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post( this.baseUrl + '/signup', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then(response => {
                const status = response.json().status;
                if(status == SERVER_RESPONSE_STATUS.SUCCESS)
                {
                    return true;
                }
                else if( status == SERVER_RESPONSE_STATUS.FAILED)
                {
                    throw new Error(response.json().message);
                }
            })
            .catch(this.handleError);
    }

    signin(user: User): Promise<Boolean> {

        const headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post( this.baseUrl + '/signin', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then(response => {
                const status = response.json().status;
                if(status == SERVER_RESPONSE_STATUS.SUCCESS)
                {
                    const data = response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('admin', data.admin);
                    return true;
                }
                else if( status == SERVER_RESPONSE_STATUS.FAILED)
                {
                    throw new Error(response.json().message);
                }
            })
            .catch(this.handleError);
    }

    public logout() {
        localStorage.clear();
    }

    public hasLoggedIn() {
        return localStorage.getItem('token') != null;
    }

    public performLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('admin');
    }

    public getEmail(){
        return localStorage.getItem('email') === null ? "" : localStorage.getItem('email');
    }

    public isAdmin(){
        return localStorage.getItem('admin') === "true";
    }

    private handleError(error: any){
        console.error('Error occurred : ' +error );
        return Promise.reject(error.message || error);
    }
}