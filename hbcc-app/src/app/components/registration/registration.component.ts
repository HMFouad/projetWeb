import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '@app/app-constants';
import {UnAuthGuard} from '@app/guards/un-auth.guard';
import {SecureHttpClientService} from '@app/services/secure-http-client.service';

@Component({
    selector: 'hbcc-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    public signUpForm: FormGroup;

    public specialities: any;

    public apiMessage: string;

    public signUpFormSubmitted: boolean;
    public signUpFormLoading: boolean;

    public constructor(private httpClient: HttpClient,
                       private unAuthGuard: UnAuthGuard,
                       private secureHttpClient: SecureHttpClientService) {
        this.signUpFormSubmitted = false;
        this.signUpFormLoading = false;
    }

    public ngOnInit(): void {
        this.signUpForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            speciality: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required])
        });

        this.speciality.setValue(null);
        this.httpClient.get('/api/specialities').subscribe(data => {
            this.specialities = data;
        });
    }

    public get firstName() {
        return this.signUpForm.get('firstName');
    }

    public get lastName() {
        return this.signUpForm.get('lastName');
    }

    public get email() {
        return this.signUpForm.get('email');
    }

    public get speciality() {
        return this.signUpForm.get('speciality');
    }

    public get password() {
        return this.signUpForm.get('password');
    }

    public get confirmPassword() {
        return this.signUpForm.get('confirmPassword');
    }

    public submitSignUpForm() {
        this.signUpFormSubmitted = true;
        if (this.signUpForm.valid && !this.signUpFormLoading) {
            this.signUpFormLoading = true;
            this.httpClient.post('/api/users',
                this.signUpForm.value,
                { responseType: 'json' })
                .subscribe((response: any) => {
                    this.signUpFormLoading = false;
                    this.apiMessage = null;
                    localStorage.setItem(AppConstants.AUTH_TOKEN_VALUE_NAME, response.authToken.value);
                    localStorage.setItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME, response.authToken.expiresAt);
                    localStorage.setItem(AppConstants.USER_ID_NAME, response.user);
                    this.secureHttpClient.userHasBeenUpdated.next(true);
                    this.signUpForm.reset();
                    this.unAuthGuard.canActivate();
                }, (response) => { // error
                    this.signUpFormLoading = false;
                    this.apiMessage = response.error.message || 'Veuillez essayer ultérieurement.';
                });
        }
    }

    public resetSignUpForm() {
        this.signUpForm.reset();
        this.signUpFormSubmitted = false;
        this.apiMessage = null;
    }
}
