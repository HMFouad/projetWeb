import { Component, OnInit } from '@angular/core';
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

    public constructor (private httpClient: HttpClient,
      private router: Router) {}

    public ngOnInit (): void {
      this.signUpForm = new FormGroup({
        'firstName': new FormControl('', [Validators.required, Validators.firstName]),
        'lastName': new FormControl('', [Validators.required, Validators.lastName]),
        'email': new FormControl('', [Validators.required, Validators.email]),
        'speciality': new FormControl('', [Validators.required, Validators.speciality]),
        'password': new FormControl('', [Validators.required]),

    });
    }

    public submitSignUpForm () {
      
              if (this.signUpForm.valid) {
                  this.httpClient.post(
                      this.signUpForm.value, {
                          responseType: 'json'
                      }).subscribe((response) => { // success
                      console.log (response);
                  }, (error) => { // error
                      console.log (error);
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

