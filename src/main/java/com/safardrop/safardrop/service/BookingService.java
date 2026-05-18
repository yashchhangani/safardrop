package com.safardrop.safardrop.service;

import com.safardrop.safardrop.dto.BookingDTO;
import com.safardrop.safardrop.entity.Booking;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.exception.ResourceNotFoundException;
import com.safardrop.safardrop.repository.BookingRepository;
import com.safardrop.safardrop.repository.TripRepository;
import com.safardrop.safardrop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            TripRepository tripRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    private BookingDTO convertToDTO(Booking booking) {
        Trip trip = tripRepository.findById(booking.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found for booking"));
        User customer = userRepository.findById(booking.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        User tripOwner = userRepository.findById(trip.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip owner not found"));

        BookingDTO dto = new BookingDTO();

        dto.setBookingId(booking.getBookingId());
        dto.setTripId(booking.getTripId());
        dto.setCustomerId(booking.getCustomerId());
        dto.setTripOwnerId(trip.getUserId());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setAmount(booking.getAmount());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setCustomerName(customer.getUser_name());
        dto.setTripOwnerName(tripOwner.getUser_name());
        dto.setOrigin(trip.getOrigin());
        dto.setDestination(trip.getDestination());
        dto.setPickupArea(trip.getPickupArea());
        dto.setDropArea(trip.getDropArea());
        dto.setTravelDate(trip.getTravelDate());

        return dto;
    }

    public BookingDTO getBookingById(int bookingId) {
        Booking booking = ensureBookingAmount(loadBooking(bookingId));
        return convertToDTO(booking);
    }

    public Booking getBookingEntityById(int bookingId) {
        return ensureBookingAmount(loadBooking(bookingId));
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public BookingDTO markBookingPaidAndConfirmed(int bookingId) {
        Booking booking = getBookingEntityById(bookingId);
        booking.setPaymentStatus("PAID");
        booking.setStatus("CONFIRMED");
        return convertToDTO(bookingRepository.save(booking));
    }

    public List<BookingDTO> getBookingsByCustomer(int customerId) {
        return bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByTrip(int tripId) {
        return bookingRepository.findByTripId(tripId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public int getTripOwnerId(int tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        return trip.getUserId();
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO createBooking(BookingDTO bookingDTO) {
        User customer = userRepository.findById(bookingDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserRole customerRole = customer.getRole() == null ? UserRole.USER : customer.getRole();

        if (customerRole != UserRole.USER && customerRole != UserRole.ADMIN) {
            throw new IllegalArgumentException("Only user or admin accounts can create bookings");
        }

        Trip trip = tripRepository.findById(bookingDTO.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found for booking"));

        if (trip.getUserId() == bookingDTO.getCustomerId()) {
            throw new IllegalArgumentException("You cannot book your own trip");
        }

        Booking booking = new Booking();
        booking.setTripId(bookingDTO.getTripId());
        booking.setCustomerId(bookingDTO.getCustomerId());
        booking.setStatus("PENDING_PAYMENT");
        booking.setPaymentStatus("PENDING");
        booking.setAmount(resolveAmount(bookingDTO.getTripId(), bookingDTO.getAmount()));

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyTravellerForNewBooking(saved);
        return convertToDTO(saved);
    }

    private Booking loadBooking(int bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private Booking ensureBookingAmount(Booking booking) {
        if (booking.getAmount() != null && booking.getAmount() > 0) {
            return booking;
        }

        double resolvedAmount = resolveAmount(booking.getTripId(), booking.getAmount());
        booking.setAmount(resolvedAmount);
        return bookingRepository.save(booking);
    }

    private double resolveAmount(int tripId, Double requestedAmount) {
        if (requestedAmount != null && requestedAmount > 0) {
            return requestedAmount;
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found for booking"));

        Double fare = trip.getFare();
        if (fare == null || fare <= 0) {
            throw new IllegalArgumentException("Trip fare must be greater than 0");
        }

        return fare;
    }
}
