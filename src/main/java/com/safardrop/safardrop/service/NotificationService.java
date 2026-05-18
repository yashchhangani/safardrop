package com.safardrop.safardrop.service;

import com.safardrop.safardrop.dto.NotificationDTO;
import com.safardrop.safardrop.entity.Booking;
import com.safardrop.safardrop.entity.Notification;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.exception.ResourceNotFoundException;
import com.safardrop.safardrop.repository.NotificationRepository;
import com.safardrop.safardrop.repository.TripRepository;
import com.safardrop.safardrop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public void notifyTravellerForPaidBooking(Booking booking) {
        Trip trip = tripRepository.findById(booking.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (notificationRepository.existsByBookingIdAndRecipientUserIdAndType(
                booking.getBookingId(),
                trip.getUserId(),
                "PAYMENT_RECEIVED"
        )) {
            return;
        }

        User customer = userRepository.findById(booking.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Notification notification = new Notification();
        notification.setRecipientUserId(trip.getUserId());
        notification.setUserId(trip.getUserId());
        notification.setBookingId(booking.getBookingId());
        notification.setTripId(trip.getTripId());
        notification.setType("PAYMENT_RECEIVED");
        notification.setMessage(String.format(
                "Payment received for booking #%d from %s for the %s to %s trip. Amount: Rs. %.2f.",
                booking.getBookingId(),
                customer.getUser_name(),
                trip.getOrigin(),
                trip.getDestination(),
                booking.getAmount() == null ? 0.0 : booking.getAmount()
        ));

        notificationRepository.save(notification);
    }

    public void notifyTravellerForNewBooking(Booking booking) {
        Trip trip = tripRepository.findById(booking.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (notificationRepository.existsByBookingIdAndRecipientUserIdAndType(
                booking.getBookingId(),
                trip.getUserId(),
                "NEW_BOOKING"
        )) {
            return;
        }

        User customer = userRepository.findById(booking.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Notification notification = new Notification();
        notification.setRecipientUserId(trip.getUserId());
        notification.setUserId(trip.getUserId());
        notification.setBookingId(booking.getBookingId());
        notification.setTripId(trip.getTripId());
        notification.setType("NEW_BOOKING");
        notification.setMessage(String.format(
                "New booking #%d from %s for your %s to %s trip.",
                booking.getBookingId(),
                customer.getUser_name(),
                trip.getOrigin(),
                trip.getDestination()
        ));

        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getNotificationsForUser(int userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private NotificationDTO toDto(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setRecipientUserId(notification.getRecipientUserId());
        dto.setBookingId(notification.getBookingId());
        dto.setTripId(notification.getTripId());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
