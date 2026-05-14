package com.connecthub_springboot_react.dto.room;

public class CreateRoomRequest {
    private String name;
    private String description;
    /** TEXT, VOICE, or VIDEO (case-insensitive). VIDEO is rejected at service layer until implemented. */
    private String type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
