import {OnInit, Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {User} from "../obj/User";
/**
 * Created by Thisum on 8/1/2016.
 */

@Component({
    moduleId: module.id,
    selector: 'fr-signup',
    templateUrl: 'html/signup.component.html'
})
export class SignUpComponent implements OnInit{

    user: User;
    constructor( private _router: Router, private _authService: AuthService){}

    model = new User("", "", "", "");

    onSubmit(){
        this._authService.signup(this.model)
            .then(hero => {
                console.log(hero);
                this._router.navigateByUrl('/signin');
            })
            .catch(error => console.log(error));
    }

    ngOnInit(){

    }

    hasLogin(){
        return this._authService.hasLoggedIn();
    }
}