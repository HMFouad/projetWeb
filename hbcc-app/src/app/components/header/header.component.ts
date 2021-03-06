import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '@app/app-constants';
import {AuthGuard} from '@app/guards/auth.guard';
import {SecureHttpClientService} from "@app/services/secure-http-client.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'hbcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    private userSubscription: Subscription;

    public loginForm;

    public userConnected: boolean;

    public userEmail: string|null;

    public constructor(private httpClient: HttpClient,
                       private router: Router,
                       private authGuard: AuthGuard,
                       private secureHttpClient: SecureHttpClientService) {
        this.userSubscription = this.secureHttpClient.userHasBeenUpdated.subscribe(() => {
            this.userConnected = this.authGuard.result;

            if (this.userConnected) {

                const authToken = localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
                const userId = localStorage.getItem(AppConstants.USER_ID_NAME);

                this.secureHttpClient.request(
                    'get',
                    `/api/users/${userId}`,
                    { headers: (new HttpHeaders()).set('Authorization', `Bearer ${authToken}`) }
                ).subscribe((user) => {
                    this.userEmail = user.email;
                });
            }
            else {
                this.userEmail = null;
            }

        });
    }

    private doLocalLogout () {
        localStorage.removeItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
        localStorage.removeItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME);
        localStorage.removeItem(AppConstants.USER_ID_NAME);
        this.secureHttpClient.userHasBeenUpdated.next(true);
        this.authGuard.canActivate();
    }

    public ngOnInit(): void {
        this.secureHttpClient.userHasBeenUpdated.next(true);
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required]),
        });
    }

    public logout () {
        const authToken = localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
        this.httpClient.delete('/api/tokens', {
            headers: (new HttpHeaders()).set('Authorization', `Bearer ${authToken}`)
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
                this.loginForm.reset();
                localStorage.setItem(AppConstants.AUTH_TOKEN_VALUE_NAME, response.authToken.value);
                localStorage.setItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME, response.authToken.expiresAt);
                localStorage.setItem(AppConstants.USER_ID_NAME, response.user);
                this.secureHttpClient.userHasBeenUpdated.next(true);
                this.loginForm.reset();
                this.router.navigate(['user/planning']);
            }, (error) => { // error
                console.log (error);
            });
        }

    }

    public get emailFormControl () {
        return this.loginForm.get('email');
    }

    public ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

}
