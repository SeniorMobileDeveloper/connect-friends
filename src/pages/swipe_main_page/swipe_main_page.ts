import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GroupsService } from '../../providers/groups.service';
import { UserService } from '../../providers/users.service';
import { ENDPOINTS } from '../../app/constants';
import { NavigationPage } from '../navigation_page/navigation_page';
import { MatchDialog } from '../../components/modal_match/match';
import { StackConfig, DragEvent } from 'angular2-swing';

@Component({
  	templateUrl: 'swipe_main_page.html'
})
export class SwipeMainPage {
	@ViewChild('myswing1') swingStack: SwingStackComponent;
  	@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

	groups: Array<any>;
	groupId: number;
  	stackConfig: StackConfig;
  	currentUser: any;
  	lastVotedGroup: any;
  	isAcceptBtnVisible: boolean;

	constructor(public navCtrl: NavController,
		public groupsService: GroupsService,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public userService: UserService) {
		
		this.groupId = navParams.get('group_id');
		this.images_path = ENDPOINTS.BASE + ENDPOINTS.IMAGES;
		this.groups = [];
		this.allGroups = [];
		this.isAcceptBtnVisible = false;

		this.stackConfig = {
	      	throwOutConfidence: (offset, element) => {
	        	return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
	      	},
	      	transform: (element, x, y, r) => {
	        	this.onItemMove(element, x, y, r);
	      	},
	      	throwOutDistance: (d) => {
	        	return 800;
	      	}
	    };

	    userService.getCurrentUser()
        .then(data => {
            this.currentUser = JSON.parse(data);
        	this.getNearbyGroups();
        });
	}

	getNearbyGroups() {
		this.groupsService.getAllGroups(this.groupId)
		.subscribe((res) => {
			res.data.forEach((group, index) => {
				this.groups.push(group);
			});
			console.log('groups: ', this.groups);
		});
	}

	ngAfterViewInit() {
	    // Either subscribe in controller or set in HTML
	    this.swingStack.throwin.subscribe((event: DragEvent) => {
	      	event.target.style.background = '#808080';
	    });
	}

	onItemMove(element, x, y, r) {
	  	var color = '';
	  	var abs = Math.abs(x);
	  	let min = Math.trunc(Math.min(16*16 - abs, 16*16));
	  	let hexCode = this.decimalToHex(min, 2);

	  	if (x < 0) {
	    	color = '#FF' + hexCode + hexCode;
	  	} else {
	    	color = '#' + hexCode + 'FF' + hexCode;
	  	}

	  	element.style.background = color;
	  	element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
	}

	// Connected through HTML
	voteUp(like: boolean) {
		if (this.groups.length == 0) return;
		let vote = like ? 'like' : 'dislike';
		let tempGroup = this.groups[this.groups.length-1];
	  	this.groupsService.setGroupLikeStatus(tempGroup.id, this.currentUser.id, vote)
	  	.subscribe((res) => {
	  		if (like) {
	  			console.log('user liked');
	  			this.groupsService.getGroupLikeStatus(this.groupId, tempGroup.id)
	  			.subscribe(res => {
	  				if (res.status == 'match') {
	  					console.log('they are match');
	  					let modal = this.modalCtrl.create(MatchDialog, {group: tempGroup});
		                modal.onDidDismiss(data => {
		                    console.log('modal result: ' + JSON.stringify(data));
		                    if (data == 'accept') {
		                        // this.groupsService.acceptGroupMatchRequest(this.groupId, this.currentUser.id, tempGroup.id, 1)
		                        // .subscribe(res => {
		                        	this.navCtrl.push(NavigationPage, {
			                    		groupId: this.groupId,
			                    		userId: this.currentUser.id,
			                    		targetGroupId: tempGroup.id
			                    	});
		                        // });
		                    } else {
		                        // this.groupsService.acceptGroupMatchRequest(this.groupId, this.currentUser.id, tempGroup.id, -1)
		                    }
		                });
		                modal.present();
	  				}
	  			});
	  		}
	  		this.lastVotedGroup = this.groups.pop();
	  	});
	}

	reverse() {
		if (!this.lastVotedGroup) return;
		this.groupsService.revertGroupLikeStatus(this.lastVotedGroup.id, this.currentUser.id)
		.subscribe(res => {
			this.groups.push(this.lastVotedGroup);
			this.lastVotedGroup = null;
		});		
	}

	// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
	decimalToHex(d, padding) {
	  	var hex = Number(d).toString(16);
	  	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

	  	while (hex.length < padding) {
	    	hex = "0" + hex;
	  	}

	  	return hex;
	}

	accepted() {
		//Todo|Fredrick: The accepted module is implemented here.

		// this.navCtrl.push(NavigationPage);
	}

	goBack() {
		this.navCtrl.pop();
	}

	goToNavigation() {
		this.navCtrl.push(NavigationPage);
	}
}
