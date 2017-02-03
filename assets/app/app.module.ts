import {NgModule, NgModuleMetadataType} from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent }   from './app.component';
import {routing, appRoutingProviders}        from './app.routing';

import { DashboardComponent }   from './dashboard/dashboard.component';

import {AuthService} from "./services/auth.service";
import {SignInComponent} from "./auth/signin.component";
import {SignUpComponent} from "./auth/signup.component";
import {PageNotFoundComponent} from "./error/page-not-found.component";
import {HttpModule} from "@angular/http";
import {RequestService} from "./services/request.service";

@NgModule(<NgModuleMetadataType>{
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpModule
    ],
    declarations: [
        AppComponent,
        SignInComponent,
        SignUpComponent,
        DashboardComponent,
        PageNotFoundComponent
    ],
    providers: [
        AuthService,
        RequestService,
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}