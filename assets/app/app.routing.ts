/**
 * Created by Thisum on 8/12/2016.
 */
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from "./auth/signin.component";
import {SignUpComponent} from "./auth/signup.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PageNotFoundComponent} from "./error/page-not-found.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/signin',
        pathMatch: 'full'
    },
    {
        path: 'signin',
        component: SignInComponent
    },
    {
        path: 'signup',
        component: SignUpComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);

export const appRoutingProviders: any[] = [

];