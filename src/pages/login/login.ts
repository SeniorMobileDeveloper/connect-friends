import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { MainPage } from '../main_page/main_page';
import { UserService } from '../../providers/users.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    login: {username?: string, password?: string} = {};
    errorResponse: string = '';

    constructor(public navCtrl: NavController, public userService: UserService) { }

    onLogin(form) {
        if (form.valid) {
            this.userService.login(this.login)
            .subscribe((res) => {
                console.log('login result: ', res);
                this.userService.setCurrentUser(res.user);
                // this.getGeolocation();
                if (res.isValid === 'valid') {
                    this.errorResponse = '';
                    this.navCtrl.push(MainPage, {user_id: res.user.id});
                } else {
                    this.errorResponse = 'Invalid username or password.';
                }
            });
        }
    }

    onSignup() {
        this.navCtrl.push(SignupPage);
    }

    facebook_login() {
        facebookConnectPlugin.login(['email'], function(response) {
          alert('Logged in');
          console.log('FB response: ', response);
          this.getDetails();
        }, function(error){
          alert(error);
        })
    }

    getDetails() {
        facebookConnectPlugin.getLoginStatus((response) => {
          if(response.status == "connected") {
            facebookConnectPlugin.api('/' + response.authResponse.userID + '?fields=id,name,gender',[], 
            function onSuccess(result) {
              alert(JSON.stringify(result));
              this.navCtrl.push(RegisterPage);
            },
            function onError(error) {
              alert(error);
            });
          }
          else {
            alert('Not logged in');
          }
        });
    }

    facebook_logout() {
        facebookConnectPlugin.logout((response) => {
            alert(JSON.stringify(response));
        })
    }

    getGeolocation() {
        Geolocation.getCurrentPosition().then(pos => {
            console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
            this.userService.updateLocation(pos.coords);
        });
    }
}
