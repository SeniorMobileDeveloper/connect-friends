import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, ViewController, ModalController, Nav, NavParams } from 'ionic-angular';
import { Camera, Transfer } from 'ionic-native';
import { UserService } from '../../providers/users.service';
import { GroupsService } from '../../providers/groups.service';
import { MainPage } from '../main_page/main_page';
import { ENDPOINTS } from '../../app/constants';
import { InputDialog } from '../../components/modal_input/input';

@Component({
    templateUrl: 'account.html',
})
export class AccountPage {
    @ViewChild(Nav) nav: Nav;
    user: any = {};
    private myPhoto: string;
    isPhotoTaken: boolean = false;
    groupId: number = -1;
    targetGroupId: number = -1;

    constructor(public navCtrl: NavController, 
        public viewCtrl: ViewController, 
        public modalCtrl: ModalController,
        private userService: UserService, 
        public groupsService: GroupsService,
        private _zone: NgZone,
        public navParams: NavParams) {
    
        userService.getCurrentUser()
        .then(data => {
            if (data) {
                this.user = JSON.parse(data);
                this.myPhoto = this.user.photo;
            } else {
                this.user = {};
            }
            if (this.myPhoto) {
              this.myPhoto = ENDPOINTS.BASE + ENDPOINTS.IMAGES + this.myPhoto;
            } else {
              this.myPhoto = ENDPOINTS.BASE + ENDPOINTS.IMAGES + ENDPOINTS.DEFAULT_AVATAR;
            }
            console.log('photo url: ', this.myPhoto);
            // return userInfo;
        });

        this.groupId = navParams.get('this_group');
        if (this.groupId > -1) {
            this.targetGroupId = navParams.get('target_group');
        }
    }

    becomeFriends() {
        if (this.groupId) {
            this.takePhoto()
            .then((imgUrl) => {
                this.groupsService.makeFriends(this.groupId, this.targetGroupId)
                .subscribe((response) => {
                    alert('Members in two groups are now friends.');
                    this.close();
                })
            }, (err) => {
                if(err.error == "cordova_not_available") {
                    alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
                } else {
                    console.log("Failed to open camera: " + err.error);
                }
            });
        } else {
            let modal = this.modalCtrl.create(InputDialog, {label: 'username'});
            modal.onDidDismiss(data => {
                console.log('modal result: ', data);
                if (data == 'cancel') {
                    console.log('modal canceled');
                } else {
                    let username = data;
                    this.takePhoto()
                    .then((imgUrl) => {
                        this.userService.makeFriends(this.user.id, username)
                        .subscribe((response) => {
                            alert('Two members are now friends.');
                            this.close();
                        })
                    })
                }
            });
            modal.present();
        }        
    }

    takePhoto() {
        let options = {
            destinationType: 1,
            sourceType: 1,
            encodingType: 0,
            quality:100,
            allowEdit: false,
            saveToPhotoAlbum: false,
            correctOrientation: true,
        };
        return Camera.getPicture(options);
    }

    takeUserPhoto() {
        this.takePhoto()
        .then((imgUrl) => {
            this.myPhoto = imgUrl;
            this.isPhotoTaken = true;
        }, (err) => {                
            if(err.error == "cordova_not_available") {
                alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
            } else {
                console.log("Failed to open camera: " + err.error);
            }
        });
    }

    uploadPhoto() {
        if (!this.isPhotoTaken) {
            console.log('take photo first.');
            return;
        }
        let ft = new Transfer();
        let filename = 'image.jpg';
        let options = {
            fileKey: 'file',
            fileName: filename,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {
                'Content-Type' : undefined
            },
            params: {
                fileName: filename,
                user_id: this.user.id
            }
        }; 
        // ft.onProgress(this.onProgress);
        ft.upload(this.myPhoto, ENDPOINTS.BASE + ENDPOINTS.UPLOAD_PHOTO, options, false)
        .then((result: any) => {
            console.log('upload success: ' + JSON.stringify(result));
            alert('Updated photo successfully.');
        }).catch((error: any) => {
            console.log('upload failure: ' + JSON.stringify(error));
            alert('Could not update the photo. ' + JSON.stringify(error));
        });
    }

    close() {
        this.navCtrl.setRoot(MainPage);
        // this.navCtrl.pop();
    }
}
