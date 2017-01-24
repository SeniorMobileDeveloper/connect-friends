import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpClient {
  	constructor(public http: Http) { }

  	get(endpoint, data) {
        let params: URLSearchParams = new URLSearchParams();
        if (data) {
            for (var key in data) {
                params.set(key, data[key]);
            }
        }
  		return this.http.get(endpoint, {
  			search: params
  		})
        .map(res => res.json());;
  	}

  	post(endpoint, data) {
  		var headers = new Headers();
  		headers.append('Content-Type','application/x-www-form-urlencoded');
        var params = this.generateParams(data);
  		return this.http.post(endpoint, params, {
  			headers: headers
  		})
        .map(res => res.json());  		
  	}

    generateParams(data) {
        var params = '';
        for (var key in data) {
            params = params + key + '=' + data[key] + '&';
        }
        params = params.slice(0, -1);
        return params;
    }
}