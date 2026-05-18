package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.BookingDTO;
import com.safardrop.safardrop.dto.PaymentOrderRequest;
import com.safardrop.safardrop.dto.PaymentVerificationRequest;
import com.safardrop.safardrop.security.RequestAuthorizationService;
import com.safardrop.safardrop.service.BookingService;
import com.safardrop.safardrop.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService service;
    private final BookingService bookingService;
    private final RequestAuthorizationService requestAuthorizationService;

    public PaymentController(
            PaymentService service,
            BookingService bookingService,
            RequestAuthorizationService requestAuthorizationService
    ) {
        this.service = service;
        this.bookingService = bookingService;
        this.requestAuthorizationService = requestAuthorizationService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody PaymentOrderRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getBookingId() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Valid bookingId is required"));
            }

            BookingDTO booking = bookingService.getBookingById(request.getBookingId());
            requestAuthorizationService.requireSelfOrAdmin(httpRequest, booking.getCustomerId());

            return ResponseEntity.ok(service.createOrderForBooking(request.getBookingId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create Razorpay order"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody PaymentVerificationRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getBookingId() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Valid bookingId is required"));
            }

            BookingDTO booking = bookingService.getBookingById(request.getBookingId());
            requestAuthorizationService.requireSelfOrAdmin(httpRequest, booking.getCustomerId());

            return ResponseEntity.ok(service.verifyPayment(
                    request.getBookingId(),
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to verify payment"));
        }
    }

    @PostMapping("/demo-pay")
    public ResponseEntity<?> demoPay(@Valid @RequestBody PaymentOrderRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getBookingId() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Valid bookingId is required"));
            }

            BookingDTO booking = bookingService.getBookingById(request.getBookingId());
            requestAuthorizationService.requireSelfOrAdmin(httpRequest, booking.getCustomerId());

            return ResponseEntity.ok(service.completeDemoPayment(request.getBookingId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to complete demo payment"));
        }
    }
}
