import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './components/about/about.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {AuthGuard} from './guards/auth.guard';
import {RegistrationComponent} from './components/registration/registration.component';
import { UserComponent } from './components/user/user.component';
import {UnAuthGuard} from '@app/guards/un-auth.guard';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { FormsModule } from '@angular/forms';
import {SecureHttpClientService} from '@app/services/secure-http-client.service';
import {CreateEventComponent} from '@app/components/user/create-event/create-event.component';
import {ProfileComponent} from '@app/components/user/profile/profile.component';
import {PlanningComponent} from '@app/components/user/planning/planning.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        Ng2DatetimePickerModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        CreateEventComponent,
        RegistrationComponent,
        ProfileComponent,
        AboutComponent,
        MapComponent,
        HeaderComponent,
        FooterComponent,
        PlanningComponent,
        UserComponent
    ],
    providers: [
        AuthGuard,
        UnAuthGuard,
        SecureHttpClientService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
