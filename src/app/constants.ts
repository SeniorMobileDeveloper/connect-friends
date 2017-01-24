export class ENDPOINTS {
    // local development
    public static get BASE(): string { return 'http://192.168.0.131/Backend/Konect/'; }
    // production
    public static get BASE(): string { return 'http://ec2-54-153-113-196.us-west-1.compute.amazonaws.com/konect_backend/'; }

    public static get LOGIN(): string { return 'login.php'; }
    public static get SIGNUP(): string { return 'signup.php'; }
    public static get UPDATE(): string { return 'update.php'; }
    public static get UPLOAD_PHOTO(): string { return 'upload.php'; }
	public static get IMAGES(): string { return 'images/'; }
    public static get DEFAULT_AVATAR(): string { return 'appicon.png'; }
    public static get GET_USERS_AROUND(): string { return 'get-users-around.php'; }
    public static get GROUP(): string { return 'group.php'; }
    public static get GET_GROUPS(): string { return 'get-groups.php'; }
    public static get GET_GROUP_MEMBERS(): string { return 'get-group-members.php'; }
    public static get GET_GROUP_STATUS(): string { return 'get-group-status.php'; }
    public static get GROUP_REQUEST(): string { return 'group-request.php'; }
    public static get GET_LIKE_STATUS(): string { return 'get-like-status.php'; }
    public static get SET_LIKE_STATUS(): string { return 'set-like-status.php'; }
    public static get REVERT_LIKE_STATUS(): string { return 'revert-like-status.php'; }
    public static get GROUP_LIKE_REQUEST(): string { return 'like-group.php'; }
    public static get LOCATION_LIKE_REQUEST(): string { return 'like-location.php'; }
    public static get GET_GROUP_LOCATION(): string { return 'group-location.php'; }
    public static get GET_MEETING_LOCATION(): string { return 'group-meeting-location.php'; }
    public static get MEETING_SUCCESS(): string { return 'meeting-success.php'; }
    public static get FRIEND(): string { return 'friend.php'; }
}
