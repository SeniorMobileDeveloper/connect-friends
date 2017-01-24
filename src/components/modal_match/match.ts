import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'match.html',
})
export class MatchDialog {

    group: any;
    constructor(public viewCtrl: ViewController, public navPrams: NavParams) {
        this.group = navPrams.get('group');
    }

    accept() {
        this.viewCtrl.dismiss('accept');
    }

    dismiss() {
        this.viewCtrl.dismiss('cancel');
    }
}
