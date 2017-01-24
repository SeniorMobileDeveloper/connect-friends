import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { ENDPOINTS } from '../app/constants';
import 'rxjs/add/operator/map';

@Injectable()
export class GeocodingService {
  	
    geocode_url: string = 'https://maps.googleapis.com/maps/api/geocode/json';
    api_key: string = 'AIzaSyAhF0GX4AKTopBXEjfJ45gm7pXokwGHdtU';

    constructor(public http: Http) { }

    getAreaFromAddress(address) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('address', address);
        params.set('key', this.api_key);
        return this.http.get(this.geocode_url, {
            search: params
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

    getUsersInBounds(bounds) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('northeast_lat', bounds.northeast.lat);
        params.set('northeast_lng', bounds.northeast.lng);
        params.set('southwest_lat', bounds.southwest.lat);
        params.set('southwest_lng', bounds.southwest.lng);
        return this.http.get(ENDPOINTS.BASE + ENDPOINTS.GET_USERS_AROUND, {
            search: params
        })
        .map(res => res.json());
    }
}   