package com.safardrop.safardrop.repository;

import com.safardrop.safardrop.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(int recipientUserId);

    boolean existsByBookingIdAndRecipientUserIdAndType(int bookingId, int recipientUserId, String type);
}
