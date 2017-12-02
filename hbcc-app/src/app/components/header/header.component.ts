import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'hbcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    private loginForm;

    public constructor(private httpClient: HttpClient,
                       private router: Router) {}

    public ngOnInit(): void {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required]),
        });
    }

    public submitLoginForm () {

        if (this.loginForm.valid) {
            this.httpClient.post(
                '/api/tokens',
                this.loginForm.value, {
                    responseType: 'json'
                }).subscribe((response) => { // success
                console.log (response);
                // TODO Save token dans le localStorage ?
                this.router.navigate(['profile']);
            }, (error) => { // error
                console.log (error);
            });
        }

    }

    public get emailFormControl () {
        return this.loginForm.get('email');
    }

}
