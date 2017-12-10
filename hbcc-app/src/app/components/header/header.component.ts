import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '@app/app-constants';
import {AuthGuard} from "@app/guards/auth.guard";

@Component({
  selector: 'hbcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


    private loginForm;

    private userConnected: boolean;

    public constructor(private httpClient: HttpClient,
                       private router: Router,
                       private authGuard: AuthGuard) {}

    private doLocalLogout () {
        localStorage.removeItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
        localStorage.removeItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME);
        localStorage.removeItem(AppConstants.USER_ID_NAME);
        this.checkUserConnected();
        this.authGuard.canActivate();
    }

    private checkUserConnected (): void {
        this.userConnected = this.authGuard.result;
    }

    public ngOnInit(): void {
        this.checkUserConnected();
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required]),
        });
    }

    public logout () {
        const authToken = localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
        this.httpClient.delete('/api/tokens', {
            headers: (new HttpHeaders()).set('Authorization', `${authToken}`),
            responseType: 'json'
        }).subscribe(() => {
            this.doLocalLogout();
        }, () => {
            this.doLocalLogout();
        });
    }

    public submitLoginForm () {

        if (this.loginForm.valid) {
            this.httpClient.post('/api/tokens', this.loginForm.value, {
                responseType: 'json'
            }).subscribe((response: any) => { // success
                localStorage.setItem(AppConstants.AUTH_TOKEN_VALUE_NAME, response.authToken.value);
                localStorage.setItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME, response.authToken.expiresAt);
                localStorage.setItem(AppConstants.USER_ID_NAME, response.user);
                this.checkUserConnected();

                this.router.navigate(['user/planning']);
            }, (error) => { // error
                console.log (error);
            });
        }

    }

    public get emailFormControl () {
        return this.loginForm.get('email');
    }

}
