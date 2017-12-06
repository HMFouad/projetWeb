import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'hbcc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    private signUpForm;

    private specialities: any;

    public constructor(private httpClient: HttpClient) {}

    public ngOnInit(): void {
        this.signUpForm = new FormGroup({
            'firstName': new FormControl('', [Validators.required]),
            'lastName': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'speciality': new FormControl('', [Validators.required]),
            'password': new FormControl('', [Validators.required]),


        });
        this.httpClient.get('/api/specialities').subscribe(data => {
            this.specialities = data;
        });
    }


    public submitSignUpForm () {
        if (this.signUpForm.valid) {
            this.httpClient.post(
                this.signUpForm.value, {
                    responseType: 'json'
                }).subscribe((response) => { // success
                console.log(response);
            }, (error) => { // error
                console.log(error);
            });
        }
    }
    public get firstNameFormControl () {
      return this.signUpForm.get('firstName');
    }

    public get lastNameFormControl () {
      return this.signUpForm.get('lastName');
    }

    public get emailFormControl () {
      return this.signUpForm.get('lastName');
    }

    public get specialityFormControl () {
      return this.signUpForm.get('speciality');
    }

    public get passwordFormControl () {
      return this.signUpForm.get('lastName');
    }
}

