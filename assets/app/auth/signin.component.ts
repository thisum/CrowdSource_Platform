import {OnInit, Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {User} from "../obj/User";
/**
 * Created by Thisum on 8/1/2016.
 */

@Component({
    moduleId: module.id,
    selector: "fr-signin",
    templateUrl: 'html/signin.component.html'
})
export class SignInComponent implements OnInit{

    constructor( private _router: Router, private _authService: AuthService ){}

    model = new User("", "");
    
    onSubmit(){

        this._authService.signin(this.model)
            .then(result => {this._router.navigateByUrl('/dashboard')})
            .catch(error => console.log(error));

    }

    ngOnInit(){

    }


    hasLogin(){
        const signedIn = this._authService.hasLoggedIn();
        if(signedIn){
            this._router.navigateByUrl('/dashboard')
        }
        return signedIn
    }
    

}