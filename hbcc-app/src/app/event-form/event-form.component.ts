import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
        console.log("Title "+this.description);
        console.log("Location "+this.location);
        console.log("Start date "+this.start);
        console.log("End date "+this.end);
        const event = {description : this.description,
                        location: this.location,
                        startDate: this.start,
                        endDate: this.end};
        console.log(event);
        this.http.post('/api/events' , event).subscribe();
        this.router.navigate(['/home']);
    }
}
