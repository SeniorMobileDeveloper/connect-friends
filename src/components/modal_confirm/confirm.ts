import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'confirm.html',
})
export class ConfirmDialog {

    username: string;
    constructor(public viewCtrl: ViewController, public navPrams: NavParams) {
        this.username = navPrams.get('username');
    }

    accept() {
        this.viewCtrl.dismiss('accept');
    }

    dismiss() {
        this.viewCtrl.dismiss('cancel');
    }
}
