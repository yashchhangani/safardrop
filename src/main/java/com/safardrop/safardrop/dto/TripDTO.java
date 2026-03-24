package com.safardrop.safardrop.dto;

import java.time.LocalDateTime;

public class TripDTO {

    private int tripId;
    private int userId;
    private String pickupLocation;
    private String dropLocation;
    private LocalDateTime createdAt;
    private String tripStatus;

    // Default constructor
    public TripDTO() {}

    // Parameterized constructor
    public TripDTO(int tripId, int userId, String pickupLocation, String dropLocation,
                   LocalDateTime createdAt, String tripStatus) {
        this.tripId = tripId;
        this.userId = userId;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.createdAt = createdAt;
        this.tripStatus = tripStatus;
    }

    // Getters & Setters

    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropLocation() {
        return dropLocation;
    }

    public void setDropLocation(String dropLocation) {
        this.dropLocation = dropLocation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTripStatus() {
        return tripStatus;
    }

    public void setTripStatus(String tripStatus) {
        this.tripStatus = tripStatus;
    }
}