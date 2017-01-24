import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENDPOINTS } from '../app/constants';
import { HttpClient } from './httpclient.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupsService {

    CURRENT_GROUP_KEY: string = 'current_group';

    constructor(public storage: Storage, public httpClient: HttpClient) {
        storage.set(this.CURRENT_GROUP_KEY, {});
  	}

  	createGroup(users, creator, location) {
        let params = {};
        params['users'] = users;
        params['creator'] = creator;
        params['location'] = JSON.stringify(location);
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.GROUP, params);
  	}

    getAllGroups(group_id) {
        let params = { group_id: group_id };
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GET_GROUPS, params);
    }

    setCurrentGroup(group_id, users) {
        let group = {
            id: group_id,
            members: users
        }
        this.storage.set(this.CURRENT_GROUP_KEY, JSON.stringify(group));
    }

    getCurrentGroup() {
        return this.storage.get(this.CURRENT_GROUP_KEY);
    }

    getCurrentGroupStatus() {
        let observer;
        let request = new Observable(obs => {
            observer = obs;
        });
        this.getCurrentGroup()
        .then(data => {
            console.log('current group: ', data);
            if (data) {
                let group = JSON.parse(data);
                let groupId = group.id;
                this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GET_GROUP_STATUS, {group_id: groupId})
                .subscribe(res => {
                    observer.next(res);
                });
            } else {
                observer.next({});
            }
        });
        return request;
    }

    getGroup(groupId) {
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GROUP, {group_id: groupId});
    }

    getGroupLikeStatus(current_group, target_group) {
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GET_LIKE_STATUS, {
            current_group: current_group,
            target_group: target_group
        });
    }

    setGroupLikeStatus(group_id, user_id, like) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.SET_LIKE_STATUS, {
            group: group_id,
            user: user_id,
            like: like
        });
    }

    revertGroupLikeStatus(group_id, user_id) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.REVERT_LIKE_STATUS, {
            group: group_id,
            user: user_id
        });
    }

    acceptGroupRequest(user_id, group_id, acceptance) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.GROUP_REQUEST, {
            user_id: user_id,
            group_id: group_id,
            answer: acceptance
        });
    }

    acceptGroupMatchRequest(group_id, user_id, target_group, like) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.GROUP_LIKE_REQUEST, {
            group_id: group_id,
            user_id: user_id,
            target_group: target_group,
            like: like
        });
    }

    updateLocationLikeStatus(groupId, userId, targetGroup, like, locationStatus) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.LOCATION_LIKE_REQUEST, {
            group_id: groupId,
            user_id: userId,
            target_group: targetGroup,
            like: like,
            location_status: locationStatus
        });
    }

    getGroupLocation(groupId) {
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GET_GROUP_LOCATION, {group_id: groupId});
    }

    suggestLocation(group1, group2) {
        return this.httpClient.get(ENDPOINTS.BASE + ENDPOINTS.GET_MEETING_LOCATION, {group1: group1, group2: group2});
    }

    makeFriends(group1, group2) {
        return this.httpClient.post(ENDPOINTS.BASE + ENDPOINTS.MEETING_SUCCESS, {group1: group1, group2: group2});
    }
}
