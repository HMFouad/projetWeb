import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private loginForm;

  constructor(private httpClient: HttpClient,
              private router: Router
          ) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required]),
    })
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
        })
    }

  }

  public get emailFormControl () {
    return this.loginForm.get('email');
  }

}
