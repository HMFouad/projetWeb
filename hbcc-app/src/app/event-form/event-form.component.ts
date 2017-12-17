import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {AppConstants} from '@app/app-constants';

@Component({
    selector: 'hbcc-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
    description: any;
    location: any;
    start: any;
    end: any;


    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
    }
    saveEvent() {
        const event = {description : this.description,
                        location: this.location,
                        start: this.start,
                        end: this.end};
        this.http.post('/api/events' , event,
            {responseType: 'json', headers : { Authorization: `Bearer ${localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME)}`}})
            .subscribe((response) => { // success
                this.router.navigate(['/user/planning']); },

            (error) => { // error
                this.router.navigate(['/user/planning']);
            });



    }
}
