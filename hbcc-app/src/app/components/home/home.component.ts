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

    private signUpForm: FormGroup;

    private specialities: any;

    public constructor(private httpClient: HttpClient) {}

    public ngOnInit (): void {
      this.signUpForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        // 'speciality': new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        cpassword: new FormControl('', [Validators.required])
<<<<<<< HEAD
=======

>>>>>>> a27f77f70b34c3e9f9c396a19ad8400477eb5562

        });
        this.httpClient.get('/api/specialities').subscribe(data => {
            this.specialities = data;
        });
    }

<<<<<<< HEAD
public get firstName () {
  return this.signUpForm.get('firstName');
}

public get lastName () {
  return this.signUpForm.get('lastName');
}

public get email () {
  return this.signUpForm.get('email');
}

public get speciality () {
  return this.signUpForm.get('speciality');
}

public get password () {
  return this.signUpForm.get('password');
}

public get cpassword () {
  return this.signUpForm.get('cpassword');
=======
    public get firstName () {
        return this.signUpForm.get('firstName');
    }

    public get lastName () {
        return this.signUpForm.get('lastName');
    }

    public get email () {
        return this.signUpForm.get('email');
    }

    public get speciality () {
        return this.signUpForm.get('speciality');
    }

    public get password () {
        return this.signUpForm.get('password');
    }

    public get cpassword () {
        return this.signUpForm.get('cpassword');
    }

    public submitSignUpForm () {
        console.log ('Test0!!!!!!!!!!!!!!!!!');
        // if (this.signUpForm.valid) {

        this.httpClient.post(
            this.signUpForm.value, {
                responseType: 'json'
            }).subscribe((response) => { // success
            console.log ('Réponse!!!!!!!!!!!!!!!!!');
            console.log (response);
        }, (error) => { // error
            console.log ('Erreur!!!!!!!!!!!!!!!!!');
            // console.log (error);
        });
        // }
    }
>>>>>>> a27f77f70b34c3e9f9c396a19ad8400477eb5562
}

public submitSignUpForm () {
  console.log ('Test0!!!!!!!!!!!!!!!!!');
   if (this.signUpForm.valid) {

      this.httpClient.post(
        '/api/users',
          this.signUpForm.value, {
              responseType: 'json'
          }).subscribe((response) => { // success
            console.log ('Réponse!!!!!!!!!!!!!!!!!');
            console.log (response);
      }, (error) => { // error
          console.log ('Erreur!!!!!!!!!!!!!!!!!');
          console.log (error);
      });
   }else {console.log ('Not Valid');
  }
}
}
