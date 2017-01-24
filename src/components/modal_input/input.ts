import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'input.html',
})
export class InputDialog {

    label: string;
    value: string;

    constructor(public viewCtrl: ViewController, public navPrams: NavParams) {
        this.label = navPrams.get('label');
    }

    accept() {
        this.viewCtrl.dismiss(this.value);
    }

    dismiss() {
        this.viewCtrl.dismiss('cancel');
    }
}
