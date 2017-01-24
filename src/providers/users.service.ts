import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENDPOINTS } from '../app/constants';
import { HttpClient } from './httpclient.service';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    currentUser: Object = {};
    CURRENT_USER_KEY: string = 'current_user';

	constructor(public storage: Storage, public httpClient: HttpClient) {
        
  	}

  	signup(data) {
  		return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.SIGNUP, data);
  	}

  	login(data) {
  		return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.LOGIN, data);
  	}

    logout() {

    }

  	generateParams(data) {
  		var params = '';
  		for (var key in data) {
  			params = params + key + '=' + data[key] + '&';
  		}
  		params = params.slice(0, -1);
  		return params;
  	}

    updateLocation(location) {
        let userInfo;
        this.storage.get(this.CURRENT_USER_KEY)
        .then(data => {
            if (data) {
                userInfo = JSON.parse(data);
                userInfo['latitude'] = location.latitude;
                userInfo['longitude'] = location.longitude;
                return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.UPDATE, userInfo)
                .subscribe(res => {
                    console.log('update response: ' + JSON.stringify(res));
                });
            } else {
                return null;
            }
        });
    }

    setCurrentUser(user) {
        // this.currentUser = user;
        this.storage.set(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    getCurrentUser() {
        return this.storage.get(this.CURRENT_USER_KEY);
    }

    checkPendingRequest(user_id) {
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GROUP_REQUEST, {user_id: user_id});
    }

    makeFriends(user, friend_username) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.FRIEND, {user: user, friend: username});
    }
}
