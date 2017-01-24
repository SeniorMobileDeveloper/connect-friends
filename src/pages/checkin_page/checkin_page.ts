import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SwipeMainPage } from '../swipe_main_page/swipe_main_page';
import { GeocodingService } from '../../providers/location.service';
import { UserService } from '../../providers/users.service';
import { GroupsService } from '../../providers/groups.service';
import { ENDPOINTS } from '../../app/constants';

@Component({
  	templateUrl: 'checkin_page.html',
})
export class CheckinPage {

	address: string;
	nearByUsers: Array<any>;
	images_path: string;
	groupMembers: Array<any>;
	userCount: number = 0;
	currentUser: any;
	groupLocation: any;
	groupId: number;
	
	constructor(public navCtrl: NavController, 
		public geoCodingService: GeocodingService, 
		public groupsService: GroupsService,
		public userService: UserService,
		public navParams: NavParams) {

		this.address = '';
		this.images_path = ENDPOINTS.BASE + ENDPOINTS.IMAGES;
		
		this.groupId = navParams.get('group_id');
		console.log('selected group id: ', this.groupId);

		// this.loadGroup(10);
		if (this.groupId) {
			this.loadGroup(this.groupId);
		} else {
			userService.getCurrentUser()
	        .then(data => {
	            this.currentUser = JSON.parse(data);
	        	this.groupMembers = [];
	        	for(let i = 0; i < 4; i++) {
					this.groupMembers.push({
						photo: 'assets/img/appicon.png'
					});
				}
				this.selectUser(this.currentUser);
	        });
	    }
	}

	loadGroup(group_id) {
		this.groupsService.getGroup(group_id)
		.subscribe(res => {
			console.log('load group: ', res.group);
			// set current group
			this.groupMembers = [];
			let userIds = [];
			for (let i = 0; i < res.group.members.length; i ++) {
				this.selectUser(res.group.members[i].user);
				userIds.push(res.group.members[i].user.id);
			}
			// console.log('group members: ', this.groupMembers);
			for (let i = res.group.members.length; i < 4; i ++) {
				this.groupMembers.push({
					photo: 'assets/img/appicon.png'
				});
			}
			this.groupsService.setCurrentGroup(this.groupId, userIds);
			this.groupLocation = {
				lat: res.group.latitude,
				lng: res.group.longitude
			};
			this.userCount = res.group.members.length;
		});
	}

	createGroup() {
		if (this.groupId) return;
		if (this.userCount < 2) return;
		let userIds = [];
		for (let i=0; i<this.userCount; i++) {
			userIds.push(this.groupMembers[i].id);
		}
		// console.log('selected users: ', userIds);
		this.groupsService.createGroup(userIds, this.currentUser.id, this.groupLocation)
		.subscribe((res) => {
			// console.log('group created: ', res);
			this.groupId = res.id;
			this.groupsService.setCurrentGroup(this.groupId, userIds);
		});
	}

	oldFriend() {
		this.navCtrl.pop();
	}

	newFriend() {
		this.navCtrl.push(SwipeMainPage, {group_id: 9});
		this.groupsService.getCurrentGroupStatus()
		.subscribe(res => {
			console.log('group status: ', res);
			// 
			// if (res.msg == 'success') {
			// 	if (res.status == 'accepted') {
			// 		this.navCtrl.push(SwipeMainPage, {group_id: 5});
			// 	} else if (res.status == 'canceled') {
			// 		alert('This group has been canceled.');
			// 	} else if (res.status == 'pending') {
			// 		alert('Waiting for the members to accept group request...');
			// 	}
			// }
		});		
	}

	getAddress(place:Object) {
    	this.address = place['formatted_address'];
       	var location = place['geometry']['location'];
       	var lat =  location.lat();
       	var lng = location.lng();
       	// console.log("Address Object: ", place);
   	}

	checkIn() {
		// console.log('location: ', this.address);
		this.geoCodingService.getAreaFromAddress(this.address)
		.subscribe(res => {
			// console.log('geocoding result: ', res.results);
			let bounds = res.results[0].geometry.bounds;
			this.groupLocation = res.results[0].geometry.location;
			// console.log('area bound: ', bounds);
			this.searchFriendsInArea(bounds);
		});		
	}

	searchFriendsInArea (bounds) {
		this.geoCodingService.getUsersInBounds(bounds)
		.subscribe(res => {
			// console.log('users result: ', res);
			if (res.msg == 'success') {
				this.nearByUsers = res.result;
			}
		});
	}

	selectUser (user) {
		if (this.userCount >= 4) return;
		let temp = Object.assign({}, user);
		temp = Object.assign(temp, {photo: this.images_path + user.photo});
		this.groupMembers[this.userCount] = temp;
		this.userCount++;
	}
}
