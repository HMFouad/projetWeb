import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'hbcc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    specialities: any

    public constructor (private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

    public ngOnInit () {
        this.http.get('/api/specialities').subscribe(data => {
            this.specialities = data;
        });
    }
}
