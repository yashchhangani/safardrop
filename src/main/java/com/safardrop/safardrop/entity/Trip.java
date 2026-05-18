package com.safardrop.safardrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tripId;

    @NotNull
    @Column(name = "user_id")
    private int userId;

    @NotBlank
    @Column(name = "origin")
    private String origin;

    @NotBlank
    @Column(name = "pickup_area")
    private String pickupArea;

    @NotBlank
    @Column(name = "destination")
    private String destination;

    @NotBlank
    @Column(name = "drop_area")
    private String dropArea;

    // ✅ FIX DATE FORMAT (IMPORTANT)
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "travel_date")
    private LocalDate travelDate;

    @NotNull
    @Column(name = "capacity")
    private int capacity;

    @Column(name = "trip_status")
    private String tripStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "fare")
    private Double fare;

    // ✅ AUTO SET VALUES BEFORE INSERT (CRITICAL FIX)
    @PrePersist
    public void setDefaults() {
        this.createdAt = LocalDateTime.now();

        if (this.tripStatus == null) {
            this.tripStatus = "PENDING";
        }

        if (this.fare == null) {
            this.fare = 0.0;
        }
    }

    // ================= GETTERS & SETTERS =================

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

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getPickupArea() {
        return pickupArea;
    }

    public void setPickupArea(String pickupArea) {
        this.pickupArea = pickupArea;
    }

    public String getDropArea() {
        return dropArea;
    }

    public void setDropArea(String dropArea) {
        this.dropArea = dropArea;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getTripStatus() {
        return tripStatus;
    }

    public void setTripStatus(String tripStatus) {
        this.tripStatus = tripStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }
}
