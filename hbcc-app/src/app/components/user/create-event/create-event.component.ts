import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppConstants} from 'app/app-constants';
import {SecureHttpClientService} from '@app/services/secure-http-client.service';

@Component({
    selector: 'hbcc-create-event',
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent  {
    public description: any;
    public location: any;
    public start: any;
    public end: any;


    public constructor(private http: SecureHttpClientService,
                       private router: Router) {}

    public saveEvent(): void {

        const body: any = {
            description: this.description,
            start: this.start,
            end: this.end
        };

        if  (this.location) {
            body.location = this.location;
        }

        this.http.request(
            'post',
            '/api/events',
            {
                body,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME)}`
                }
            }
        ).subscribe((response) => { // success
            this.router.navigate(['/user/planning']);
        },
        (error) => { // error
            this.router.navigate(['/user/planning']);
        });
    }
}
