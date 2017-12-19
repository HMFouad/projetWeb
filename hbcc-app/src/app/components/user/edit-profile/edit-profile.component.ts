import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '@app/app-constants';
import {Router} from '@angular/router';
import {SecureHttpClientService} from '@app/services/secure-http-client.service';

@Component({
    selector: 'hbcc-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    public editProfileForm: FormGroup;

    public specialities: any;
    public defaultFirstName: any;
    public defaultLastName: any;
    public defaultEmail: any;
    public defaultSpeciality: any;

    public apiMessage: string;

    public editProfileFormSubmitted: boolean;
    public editProfileFormLoading: boolean;



    public constructor(private httpClient: SecureHttpClientService, private router: Router) {
        this.editProfileFormSubmitted = false;
        this.editProfileFormLoading = false;
    }

    public ngOnInit(): void {
        this.editProfileForm = new FormGroup({
            firstName: new FormControl('', []),
            lastName: new FormControl('', []),
            email: new FormControl('', [Validators.email]),
            speciality: new FormControl('', []),
            newPassword: new FormControl('', [Validators.required]),
            confirmNewPassword: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });

        this.speciality.setValue(null);
        this.httpClient.request('get',
                                '/api/specialities',
                                { headers: {responseType: 'json'}}
        ).subscribe(data => {
            this.specialities = data;
        });
        this.httpClient.request('get',
            '/api/users/' + localStorage.getItem(AppConstants.USER_ID_NAME),
            { headers: {
                    responseType: 'json',
                    Authorization: `Bearer ${localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME)}`
                }}
        ).subscribe(data => {
            this.defaultFirstName = data.firstName;
            this.defaultLastName = data.lastName;
            this.defaultEmail = data.email;
            for (const spe of this.specialities) {
                if (spe._id === data.speciality) {
                    this.defaultSpeciality = spe.name;
                }
            }
        });
    }

    public get firstName() {
        return this.editProfileForm.get('firstName');
    }

    public get lastName() {
        return this.editProfileForm.get('lastName');
    }

    public get email() {
        return this.editProfileForm.get('email');
    }

    public get speciality() {
        return this.editProfileForm.get('speciality');
    }

    public get newPassword() {
        return this.editProfileForm.get('newPassword');
    }

    public get confirmNewPassword() {
        return this.editProfileForm.get('confirmNewPassword');
    }
    public get password() {
        return this.editProfileForm.get('password');
    }

    public submitEditProfileForm() {
        this.editProfileFormSubmitted = true;
        if (this.editProfileForm.valid && !this.editProfileFormLoading) {
            this.editProfileFormLoading = true;
                this.httpClient.request('patch',
                                        '/api/users/' + localStorage.getItem(AppConstants.USER_ID_NAME),
                    {
                        headers: {
                            responseType: 'json',
                            Authorization: `Bearer ${localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME)}`
                        },
                        body: this.editProfileForm.value
                    })
                .subscribe((response: any) => {
                    this.editProfileFormLoading = false;
                    this.apiMessage = null;
                    this.httpClient.userHasBeenUpdated.next(true);
                    this.editProfileForm.reset();
                    this.router.navigate(['/user/planning']);
                }, (response) => { // error
                    this.editProfileFormLoading = false;
                    this.apiMessage = response.error.message || 'Veuillez essayer ultérieurement.';
                });
        }
    }

    public resetEditProfileForm() {
        this.editProfileForm.reset();
        this.editProfileFormSubmitted = false;
        this.apiMessage = null;
    }

}
