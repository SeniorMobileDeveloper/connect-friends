import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SwingStackComponent, SwingCardComponent } from 'angular2-swing';
import { GoogleplaceDirective } from '../lib/angular2-google-map-auto-complete/directives/googleplace.directive';

import { ConferenceApp } from './app.component';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MainPage } from '../pages/main_page/main_page';
import { CheckinPage } from '../pages/checkin_page/checkin_page';
import { SwipeMainPage } from '../pages/swipe_main_page/swipe_main_page';
import { NavigationPage } from '../pages/navigation_page/navigation_page';
import { ConfirmDialog } from '../components/modal_confirm/confirm';
import { MatchDialog } from '../components/modal_match/match';
import { InputDialog } from '../components/modal_input/input';

import { HttpClient } from '../providers/httpclient.service';
import { UserService } from '../providers/users.service';
import { GroupsService } from '../providers/groups.service';
import { GeocodingService } from '../providers/location.service';

@NgModule({
  declarations: [
    ConferenceApp,
    AccountPage,
    LoginPage,
    SignupPage,
    MainPage,
    CheckinPage,
    SwipeMainPage,
    NavigationPage,
    ConfirmDialog,
    MatchDialog,
    InputDialog,
    GoogleplaceDirective,
    SwingStackComponent,
    SwingCardComponent
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AccountPage,
    LoginPage,
    SignupPage,
    MainPage,
    CheckinPage,
    SwipeMainPage,
    NavigationPage,
    ConfirmDialog,
    MatchDialog,
    InputDialog
  ],
  providers: [Storage, UserService, GeocodingService, HttpClient, GroupsService]
})
export class AppModule {}
