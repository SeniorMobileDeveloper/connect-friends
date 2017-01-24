import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CheckinPage } from '../checkin_page/checkin_page';
import { AccountPage } from '../account/account';
import { ConfirmDialog } from '../../components/modal_confirm/confirm';

import { UserService } from '../../providers/users.service';
import { GroupsService } from '../../providers/groups.service';

@Component({
    templateUrl: 'main_page.html'
})
export class MainPage {

    items: Array<{username: string, img_url: string, distance: number}>;
    profile_img_url: string; 

    constructor(public navCtrl: NavController, 
        public modalCtrl: ModalController,
        public userService: UserService,
        public groupsService: GroupsService,
        public navParams: NavParams) {

        this.profile_img_url = "assets/img/appicon.png";
        this.items = [];
        for(let i = 0; i < 8; i++) {
            this.items.push({
                username: 'user' + (i+1),
                img_url: 'assets/img/appicon.png',
                distance: 10
            });
        }

        let user_id = navParams.get('user_id');
        userService.checkPendingRequest(user_id)
        .subscribe(res => {
            console.log('request: ', res);
            if (res.msg == 'success') {
                let modal = this.modalCtrl.create(ConfirmDialog, {username: res.creator.username});
                modal.onDidDismiss(data => {
                    if (data == 'accept') {
                        // this.groupsService.acceptGroupRequest(user_id, res.group_id, 1)
                        // .subscribe(result => {
                        //     console.log('accept result: ', result);
                            this.navCtrl.push(CheckinPage, {group_id: res.group_id});
                        // });
                    } else {
                        // this.groupsService.acceptGroupRequest(user_id, res.group_id, -1);
                    }
                });
                modal.present();
            }
        });
    }

    presentUsernamePage() {
        // let modal = this.modalCtrl.create(AccountPage);
        // modal.present();
        this.navCtrl.push(AccountPage);
    }

    getFriendList() {
        //Todo|Fredrick : The module gettting friends list is implemented here. 
    }

    gotoCheckinPage() {
        this.navCtrl.push(CheckinPage);
    }
}
