package com.safardrop.safardrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int trip_id;

    @NotNull(message = "User ID is required")
    @Column(name = "user_id")
    private int userId;

    @NotBlank(message = "Pickup location is required")
    @Column(name = "pickup_location")
    private String pickupLocation;

    @NotBlank(message = "Drop location is required")
    @Column(name = "drop_location")
    private String dropLocation;

    @Column(name = "trip_status")
    private String tripStatus;

    @Column(name = "fare")
    private BigDecimal fare;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters & Setters

    public int getTripId() {
        return trip_id;
    }

    public void setTripId(int trip_id) {
        this.trip_id = trip_id;
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

    public String getTripStatus() {
        return tripStatus;
    }

    public void setTripStatus(String tripStatus) {
        this.tripStatus = tripStatus;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}