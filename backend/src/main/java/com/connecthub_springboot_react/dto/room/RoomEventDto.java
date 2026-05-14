package com.connecthub_springboot_react.dto.room;

public class RoomEventDto {
    private String event;
    private Object payload;

    public RoomEventDto() {
    }

    public RoomEventDto(String event, Object payload) {
        this.event = event;
        this.payload = payload;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
