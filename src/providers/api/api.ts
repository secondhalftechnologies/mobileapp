import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
    url: string = 'http://sqoreyard.com/sqyardpanel/rest/v1'; //'http://localhost/payism/web/yard/rest/v1';
    options: RequestOptions;

    constructor(public http: Http) {
        let myHeaders: Headers = new Headers;
        myHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
        myHeaders.set('Authorization', '44b03c7f0c2fbf059d1c');

        this.options = new RequestOptions({ headers: myHeaders });
    }


    get(endpoint: string, params?: any) {
        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
                endpoint += "/" + params[k];
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            // this.options.search = p;
        }

        return this.http.get(this.url + '/' + endpoint , this.options);
    }

    post(endpoint: string, body: any) {

        let params = new URLSearchParams();
        for(let key in body){
            params.set(key, body[key]) 
        }

        return this.http.post(this.url + '/' + endpoint, params, this.options);
    }

    put(endpoint: string, body: any) {

        let params = new URLSearchParams();
        for(let key in body){
            params.set(key, body[key]) 
        }
        return this.http.put(this.url + '/' + endpoint, params, this.options);
    }

    delete(endpoint: string) {
        return this.http.delete(this.url + '/' + endpoint, this.options);
    }

    patch(endpoint: string, body: any) {
        return this.http.put(this.url + '/' + endpoint, body, this.options);
    }
}
