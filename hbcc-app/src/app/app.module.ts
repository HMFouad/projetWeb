import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './components/app/app.component';
import { EventsComponent } from './events/events.component';




@NgModule({
  declarations: [
    AppComponent,
    EventsComponent
  ],
	imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/', pathMatch: 'full' }
    ]),
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
