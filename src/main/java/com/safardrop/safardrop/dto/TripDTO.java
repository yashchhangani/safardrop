package com.safardrop.safardrop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TripDTO {

    private int tripId;

    @NotNull(message = "User ID is required")
    private int userId;

    @NotBlank(message = "Origin is required")
    @JsonProperty("pickupLocation") // maps frontend JSON field to 'origin'
    private String origin;

    @NotBlank(message = "Pickup area is required")
    private String pickupArea;

    @NotBlank(message = "Destination is required")
    @JsonProperty("dropLocation") // maps frontend JSON field to 'destination'
    private String destination;

    @NotBlank(message = "Drop area is required")
    private String dropArea;

    @NotNull(message = "Travel date is required")
    private LocalDate travelDate;

    @NotNull(message = "Capacity is required")
    private Integer capacity;

    private String tripStatus;

    private Double fare;

    private LocalDateTime createdAt;

    private String ownerName;

    private String ownerEmail;

    // Default constructor
    public TripDTO() {}

    // Parameterized constructor
    public TripDTO(int tripId, int userId, String origin, String pickupArea, String destination, String dropArea,
                   LocalDate travelDate, Integer capacity, String tripStatus,
                   Double fare, LocalDateTime createdAt, String ownerName, String ownerEmail) {
        this.tripId = tripId;
        this.userId = userId;
        this.origin = origin;
        this.pickupArea = pickupArea;
        this.destination = destination;
        this.dropArea = dropArea;
        this.travelDate = travelDate;
        this.capacity = capacity;
        this.tripStatus = tripStatus;
        this.fare = fare;
        this.createdAt = createdAt;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
    }

    // Getters & Setters
    public int getTripId() { return tripId; }
    public void setTripId(int tripId) { this.tripId = tripId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getPickupArea() { return pickupArea; }
    public void setPickupArea(String pickupArea) { this.pickupArea = pickupArea; }

    public String getDropArea() { return dropArea; }
    public void setDropArea(String dropArea) { this.dropArea = dropArea; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getTripStatus() { return tripStatus; }
    public void setTripStatus(String tripStatus) { this.tripStatus = tripStatus; }

    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
}
