import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppConstants} from 'app/app-constants';
import {SecureHttpClientService} from '@app/services/secure-http-client.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MinDateValidator} from "@app/validators/min-date.validator";

@Component({
    selector: 'hbcc-create-event',
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent  {

    public createEventForm: FormGroup;

    public createEventLoading: boolean;
    public createEventSubmitted: boolean;

    public constructor(private http: SecureHttpClientService,
                       private router: Router) {

        this.createEventLoading = false;
        this.createEventSubmitted = false;

        const startFormControl = new FormControl('', [Validators.required, MinDateValidator()]);

        this.createEventForm = new FormGroup({
            description: new FormControl('', [Validators.required]),
            location: new FormControl(''),
            start: startFormControl,
            end: new FormControl('', [Validators.required, MinDateValidator(startFormControl)])
        });
    }

    public saveEvent(): void {
        this.createEventSubmitted = true;
        if (this.createEventForm.valid && !this.createEventLoading) {
            this.createEventLoading = true;
            const body: any = {
                description: this.createEventForm.value.description,
                start: new Date(this.createEventForm.value.start).toISOString(),
                end: new Date(this.createEventForm.value.end).toISOString()
            };

            if (this.createEventForm.value.location) {
                body.location = this.createEventForm.value.location;
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
                    this.createEventLoading = false;
                    this.router.navigate(['/user/planning']);
                },
                (error) => { // error
                    this.createEventLoading = false;
                    this.router.navigate(['/user/planning']);
                });
        }
    }

    public get description () {
        return this.createEventForm.get('description');
    }

    public get location () {
        return this.createEventForm.get('location');
    }

    public get start () {
        return this.createEventForm.get('start');
    }

    public get end () {
        return this.createEventForm.get('end');
    }
}
