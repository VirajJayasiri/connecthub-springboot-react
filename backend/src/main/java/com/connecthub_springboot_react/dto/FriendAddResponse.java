package com.connecthub_springboot_react.dto;

public class FriendAddResponse {

    private boolean added;
    private FriendSummaryDto friend;

    public FriendAddResponse() {
    }

    public FriendAddResponse(boolean added, FriendSummaryDto friend) {
        this.added = added;
        this.friend = friend;
    }

    public boolean isAdded() {
        return added;
    }

    public void setAdded(boolean added) {
        this.added = added;
    }

    public FriendSummaryDto getFriend() {
        return friend;
    }

    public void setFriend(FriendSummaryDto friend) {
        this.friend = friend;
    }
}
