import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import { AccountPage } from '../account/account';
import { GroupsService } from '../../providers/groups.service';
import { UserService } from '../../providers/users.service';
import { ENDPOINTS } from '../../app/constants';

declare var google;

@Component({
  	templateUrl: 'navigation_page.html'
})
export class NavigationPage {

	@ViewChild('map') mapElement: ElementRef;
    map: any;
    suggests: Array<any>;
    groupId: number;
    userId: number;
    targetGroupId: number;
    images_path: string;
    groupLocation: Object = null;
    targetGroupLocation: Object = null;
    meetingLocation: Object = null;
    currentGroup: any = null;
    targetGroup: any = null;
    isGroupLeader: boolean = false;
    watch: any = null;
    isTracking: boolean;
    groupMarker: any = null;
    targetGroupMarker: any = null;
    meetingMarker: any = null;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public groupsService: GroupsService,
		public zone: NgZone,
		public userService: UserService) {

		this.groupId = navParams.get('groupId');
		this.userId = navParams.get('userId');
		this.targetGroupId = navParams.get('targetGroupId');
		this.images_path = ENDPOINTS.BASE + ENDPOINTS.IMAGES;
		
		groupsService.getGroup(this.targetGroupId)
		.subscribe(res => {
			console.log('load group: ', res.group);
			// set current group
			this.targetGroup = res.group;
			this.suggests = [];
			let userIds = [];
			for (let i = 0; i < res.group.members.length; i ++) {
				this.suggests.push(res.group.members[i].user);
			}
			this.targetGroupLocation = {
				latitude: res.group.latitude,
				lngitude: res.group.longitude
			};
		});

		groupsService.getGroup(this.groupId)
		.subscribe(res => {
			console.log('current group: ' + JSON.stringify(res));
			this.currentGroup = res.group;
			this.isGroupLeader = (this.currentGroup.creator == this.userId);
			this.groupLocation = {
				latitude: res.group.latitude,
				lngitude: res.group.longitude
			};
			this.loadMap();
			this.updatePins();
		});
	}

	ionViewLoaded() {
		
	}

	suggestNewLocation() {
		this.groupsService.suggestLocation(this.groupId, this.targetGroupId)
		.subscribe(res => {
			this.meetingLocation = res.location;
			let latLng = new google.maps.LatLng(this.meetingLocation.latitude, this.meetingLocation.longitude);
			if (this.meetingMarker)
				this.meetingMarker.setMap(null);
			this.meetingMarker = new google.maps.LatLng(this.groupLocation.latitude, this.groupLocation.longitude);
			this.meetingMarker = new google.maps.Marker({
			    position: latLng,
			    map: this.map,
			    draggable: true
			});
		});
	}

	agree() {
		this.groupsService.updateLocationLikeStatus(this.groupId, this.userId, this.targetGroupId, 1, "accept")
		.subscribe(res => {
			this.isTracking = true;
			this.startTracking();
			this.getLocation();
		});
	}

	back() {
		this.groupsService.updateLocationLikeStatus(this.groupId, this.userId, this.targetGroupId, -1, "cancel")
		.subscribe(res => {
			if (this.watch) {
				this.stopTracking();
			}
			this.navCtrl.pop();
		});
	}

	loadMap() {
		let latLng = new google.maps.LatLng(this.groupLocation.latitude, this.groupLocation.longitude);
		let mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	}

	updatePins() {
		if (this.groupMarker)
			this.groupMarker.setMap(null);
		let latLng = new google.maps.LatLng(this.groupLocation.latitude, this.groupLocation.longitude);
		this.groupMarker = new google.maps.Marker({
		    position: latLng,
		    map: this.map,
		    draggable: true
		});

		if (this.targetGroupMarker)
			this.targetGroupMarker.setMap(null);
		latLng = new google.maps.LatLng(this.targetGroupLocation.latitude, this.targetGroupLocation.longitude);
		this.targetGroupMarker = new google.maps.Marker({
		    position: latLng,
		    map: this.map,
		    draggable: true
		});
	}

	getLocation() {
		setTimeout(() => {
			this.groupsService.getGroupLocation(this.targetGroupId)
			.subscribe(res => {
				this.targetGroupLocation = res.location;
			});
			if (this.isGroupLeader) {
				this.userService.updateLocation(this.groupLocation)
				.subscribe(res => {
					this.updatePins();
				});
			} else {
				this.groupsService.getGroupLocation(this.groupId)
				.subscribe(res => {
					this.groupLocation = res.location;
					this.updatePins();
				});
			}
			if (this.isTracking) this.getLocation();
		}, 5000);
	}

	startTracking() {
 	  	// Background Tracking	 
	  	let config = {
		    desiredAccuracy: 0,
		    stationaryRadius: 20,
		    distanceFilter: 10, 
		    debug: true,
		    interval: 2000 
	  	};
	 
	  	BackgroundGeolocation.configure((location) => {
		    console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
		    // Run update inside of Angular's zone
		    this.zone.run(() => {
		    	this.userService.updateLocation(location)
		    	.subscribe(res => {
		    		this.groupLocation = location;
		    	});
		    });
	   	}, (err) => {
	    	console.log(err);
	  	}, config);
	 
	  	// Turn ON the background-geolocation system.
	  	BackgroundGeolocation.start();
	 
	  	// Foreground Tracking
	 
	  	let options = {
		    frequency: 3000, 
		    enableHighAccuracy: true
	  	};
	  	this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined)
	  	.subscribe((position: Geoposition) => {
	 
	    	console.log(position);
	    	// Run update inside of Angular's zone
		    this.zone.run(() => {
		    	this.userService.updateLocation(position.coords)
		    	.subscribe(res => {
		    		this.groupLocation = position.coords;
		    	});
		    });
	  	});
	}

	stopTracking() {
	  	console.log('stopTracking');
	  	BackgroundGeolocation.finish();
	  	this.watch.unsubscribe();
	  	this.isTracking = false;
	}

	goToProfile() {
		this.navCtrl.push(AccountPage, {this_group: this.groupId, target_group: this.targetGroupId});
	}
}
