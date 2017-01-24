import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { MainPage } from '../main_page/main_page';
import { UserService } from '../../providers/users.service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
    signup: {
        username: string;
        email: string;
        password: string;
        age: number;
        gender: string;
        orientation: string;
        distance: number;
        description: string;
        aim: string;
        marrage: string;
    } = {
        username: '',
        email: '',
        password: '',
        age: 30,
        gender: 'male',
        orientation: 'straight',
        distance: 0,
        description: '',
        aim: 'konect',
        marrage: 'single'
    };
    errorResponse: string = '';

    constructor(public navCtrl: NavController, public userService: UserService) {}
    onSignup() {
        //Todo|Fredrick: The signup module is implemented here.
        console.log('signup data: ', this.signup);
        this.userService.signup(this.signup)
        .subscribe((res) => {
          console.log('signup result: ', res);
          if (res.msg === 'success') {
            this.errorResponse = '';
            this.navCtrl.push(MainPage);
          } else if (res.msg === 'exist') {
            this.errorResponse = 'The email already exists.';
          } else if (res.msg === 'fail') {
            this.errorResponse = 'Registration failed.';
          }
        });
    }

    goToLogin() {
        this.navCtrl.pop();
    }
}
