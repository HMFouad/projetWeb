import {Routes, RouterModule} from '@angular/router';
import {RegistrationComponent} from './components/registration/registration.component';
import {AuthGuard} from './guards/auth.guard';
import {UserComponent} from '@app/components/user/user.component';
import {UnAuthGuard} from '@app/guards/un-auth.guard';
import {ProfileComponent} from '@app/components/user/profile/profile.component';
import {CreateEventComponent} from '@app/components/user/create-event/create-event.component';
import {PlanningComponent} from '@app/components/user/planning/planning.component';

const appRoutes: Routes = [
    { path: 'registration', canActivate: [UnAuthGuard], component: RegistrationComponent },
    {
        path: 'user', component: UserComponent, canActivate: [AuthGuard], children: [
            { path: 'planning', component: PlanningComponent },
            { path: 'create-event', component: CreateEventComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },
    { path: '', redirectTo: '/registration', pathMatch: 'full' },
    { path: '**', redirectTo: '/registration', pathMatch: 'full' }
];

export const AppRoutingModule = RouterModule.forRoot(
    appRoutes,
    { useHash: true }
);
