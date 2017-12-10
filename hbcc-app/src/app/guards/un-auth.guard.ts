import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AppConstants} from '@app/app-constants';

@Injectable()
export class UnAuthGuard implements CanActivate {
    public constructor (private router: Router) {}
    public get result (): boolean {
        return !localStorage.getItem(AppConstants.AUTH_TOKEN_VALUE_NAME) &&
               !localStorage.getItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME) &&
               !localStorage.getItem(AppConstants.USER_ID_NAME);
    }

    public canActivate(): boolean|Subject<boolean> {
        const res = this.result;

        if (!res) {
            this.router.navigate(['user/planning']);
        }

        return res;
    }
}
