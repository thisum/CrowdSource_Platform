/**
 * Created by Thisum on 8/12/2016.
 */

import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'fr-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit{

    email: string = "";

    constructor(private _router: Router, private _authService : AuthService){}

    hasLogin(){
        this.email = this._authService.getEmail();
        return this._authService.hasLoggedIn();
    }

    onLogout(){
        this._authService.performLogout();
        this._router.navigateByUrl('/signin');
    }

    ngOnInit():void {

    }

}