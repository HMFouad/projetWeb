import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {AuthGuard} from '@app/guards/auth.guard';
import {AppConstants} from '@app/app-constants';
import {Observable} from "rxjs/Observable";

/**
 * Let us to handle all unauthorized response from api.
 */
@Injectable()
export class SecureHttpClientService {

    public constructor (private httpClient: HttpClient,
                        private authGuard: AuthGuard) {}

    /**
     * Send api request with given parameter.
     * Execute httpClient methods and handle unauthorized status response.
     * @param {"post" | "patch" | "delete" | "get"} method
     * @param {string} url
     * @param options
     */
    public request (method: 'post'|'patch'|'delete'|'get',
                    url: string,
                    options: any): Observable<any> {

        const responseSubject: ReplaySubject<any> = new ReplaySubject<any>(1);

        options.responseType = options.responseType || 'json';

        this.httpClient.request(
            method,
            url,
            options
        ).subscribe(
            (response) => {
                responseSubject.next(response);
            },
            (response) => {

                // if access token is send to the call
                // and if the response status is Unauthorized status
                // and if the message of invalid token is received
                if (options.headers &&
                    options.headers.Authorization &&
                    response.status === 401 &&
                    response.error &&
                    response.error.message &&
                    response.error.message === `Le token d'authentification est invalide.`) {
                    localStorage.removeItem(AppConstants.AUTH_TOKEN_VALUE_NAME);
                    localStorage.removeItem(AppConstants.AUTH_TOKEN_EXPIRATION_NAME);
                    localStorage.removeItem(AppConstants.USER_ID_NAME);
                    this.authGuard.canActivate();
                }
                else {
                    responseSubject.next(response);
                }
            }
        );
        return responseSubject;
    }
}
