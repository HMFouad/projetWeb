import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutComponent } from './components/about/about.component';
import { MapComponent } from './components/map/map.component';
import {AuthGuard} from './guards/auth.guard';
import {UserPlanningComponent} from '@app/components/user/user-planning/user-planning.component';
import {UserComponent} from '@app/components/user/user.component';
import {UnAuthGuard} from '@app/guards/un-auth.guard';
import {UserProfileComponent} from '@app/components/user/user-profile/user-profile.component';

const appRoutes: Routes = [
    { path: 'registration', canActivate: [UnAuthGuard], component: RegistrationComponent },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard], children: [
        { path: 'planning', component: UserPlanningComponent },
        { path: 'profile', component: UserProfileComponent },
    ]},

    {path: 'about', component: AboutComponent},
    {path: 'map', component: MapComponent, },
    {path: '', redirectTo: '/registration', pathMatch: 'full'},
    {path: '**', redirectTo: '/registration', pathMatch: 'full'}
];

export const AppRoutingModule = RouterModule.forRoot(
  appRoutes,
  { useHash: true }
);
