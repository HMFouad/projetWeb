import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './components/about/about.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import { EventsComponent } from './components/events/events.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {AuthGuard} from './guards/auth.guard';
import {RegistrationComponent} from './components/registration/registration.component';
import { UserComponent } from './components/user/user.component';
import {UserProfileComponent} from "@app/components/user/user-profile/user-profile.component";
import {UserPlanningComponent} from "@app/components/user/user-planning/user-planning.component";
import {UnAuthGuard} from "@app/guards/un-auth.guard";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        EventsComponent,
        RegistrationComponent,
        UserProfileComponent,
        AboutComponent,
        MapComponent,
        HeaderComponent,
        FooterComponent,
        UserPlanningComponent,
        UserComponent
    ],
    providers: [
        AuthGuard,
        UnAuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
