package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.NotificationDTO;
import com.safardrop.safardrop.security.RequestAuthorizationService;
import com.safardrop.safardrop.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final RequestAuthorizationService requestAuthorizationService;

    public NotificationController(
            NotificationService notificationService,
            RequestAuthorizationService requestAuthorizationService
    ) {
        this.notificationService = notificationService;
        this.requestAuthorizationService = requestAuthorizationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(@PathVariable int userId, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, userId);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }
}
