package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.BookingDTO;
import com.safardrop.safardrop.security.AuthenticatedUser;
import com.safardrop.safardrop.security.RequestAuthorizationService;
import com.safardrop.safardrop.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final RequestAuthorizationService requestAuthorizationService;

    public BookingController(BookingService bookingService, RequestAuthorizationService requestAuthorizationService) {
        this.bookingService = bookingService;
        this.requestAuthorizationService = requestAuthorizationService;
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings(HttpServletRequest request) {
        requestAuthorizationService.requireRole(request, com.safardrop.safardrop.entity.UserRole.ADMIN);
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable int bookingId, HttpServletRequest request) {
        BookingDTO booking = bookingService.getBookingById(bookingId);
        AuthenticatedUser authenticatedUser = requestAuthorizationService.getAuthenticatedUser(request);

        boolean allowed = authenticatedUser.isAdmin()
                || authenticatedUser.getUserId() == booking.getCustomerId()
                || authenticatedUser.getUserId() == booking.getTripOwnerId();

        if (!allowed) {
            throw new org.springframework.web.server.ResponseStatusException(FORBIDDEN, "You are not allowed to access this resource");
        }

        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, bookingDTO.getCustomerId());
        try {
            BookingDTO created = bookingService.createBooking(bookingDTO);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create booking"));
        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByTrip(@PathVariable int tripId, HttpServletRequest request) {
        int tripOwnerId = bookingService.getTripOwnerId(tripId);
        requestAuthorizationService.requireSelfOrAdmin(request, tripOwnerId);
        return ResponseEntity.ok(bookingService.getBookingsByTrip(tripId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByCustomer(@PathVariable int customerId, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, customerId);
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }
}
