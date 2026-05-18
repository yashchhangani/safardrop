package com.safardrop.safardrop.dto;

import java.time.LocalDateTime;
import java.time.LocalDate;

public class BookingDTO {
    private int bookingId;
    private int tripId;
    private int customerId;
    private int tripOwnerId;
    private String status;
    private String paymentStatus;
    private Double amount;
    private LocalDateTime createdAt;
    private String customerName;
    private String tripOwnerName;
    private String origin;
    private String destination;
    private String pickupArea;
    private String dropArea;
    private LocalDate travelDate;

    // Getters & Setters
    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public int getTripId() { return tripId; }
    public void setTripId(int tripId) { this.tripId = tripId; }

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }

    public int getTripOwnerId() { return tripOwnerId; }
    public void setTripOwnerId(int tripOwnerId) { this.tripOwnerId = tripOwnerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getTripOwnerName() { return tripOwnerName; }
    public void setTripOwnerName(String tripOwnerName) { this.tripOwnerName = tripOwnerName; }

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
}
