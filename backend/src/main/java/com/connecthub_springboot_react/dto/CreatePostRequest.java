package com.connecthub_springboot_react.dto;

public class CreatePostRequest {

    private String caption;

    public CreatePostRequest() {
    }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
}
