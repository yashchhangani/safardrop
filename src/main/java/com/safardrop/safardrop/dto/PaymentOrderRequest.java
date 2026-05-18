package com.safardrop.safardrop.dto;

import jakarta.validation.constraints.Positive;

public class PaymentOrderRequest {
    @Positive(message = "bookingId must be greater than 0")
    private int bookingId;

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }
}
