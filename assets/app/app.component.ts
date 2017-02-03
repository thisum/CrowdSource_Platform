import {Component} from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {AuthService} from "./services/auth.service";

@Component({
    moduleId: module.id,
    selector: 'fr-app',
    templateUrl: 'app.component.html',
    directives: [HeaderComponent]
})
export class AppComponent {

    constructor(private _authService: AuthService ){}

    hasLogin(){
        return this._authService.hasLoggedIn();;
    }


}
