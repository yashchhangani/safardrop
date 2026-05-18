package com.safardrop.safardrop.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.safardrop.safardrop.dto.BookingDTO;
import com.safardrop.safardrop.entity.Booking;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Value("${app.payment.demo-mode:true}")
    private boolean demoMode;

    private final BookingService bookingService;
    private final NotificationService notificationService;

    public PaymentService(BookingService bookingService, NotificationService notificationService) {
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }

    public Map<String, Object> createOrderForBooking(int bookingId) throws RazorpayException {
        if (key == null || key.isBlank() || secret == null || secret.isBlank() || "YOUR_SECRET_HERE".equals(secret)) {
            throw new IllegalStateException("Razorpay credentials are not configured");
        }

        Booking booking = bookingService.getBookingEntityById(bookingId);
        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new IllegalArgumentException("This booking is already paid");
        }
        int amount = (int) Math.round(booking.getAmount() == null ? 0.0 : booking.getAmount());

        if (amount <= 0) {
            throw new IllegalArgumentException("Booking amount must be greater than 0");
        }

        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "booking_" + bookingId);

        Order order = client.orders.create(options);
        String createdOrderId = order.get("id");
        String currency = order.get("currency");

        booking.setRazorpayOrderId(createdOrderId);
        booking.setCurrency(currency);
        bookingService.saveBooking(booking);

        return Map.of(
                "id", createdOrderId,
                "amount", order.get("amount"),
                "currency", currency,
                "key", key,
                "bookingId", bookingId
        );
    }

    public BookingDTO verifyPayment(int bookingId, String orderId, String paymentId, String signature) {
        if (isBlank(orderId) || isBlank(paymentId) || isBlank(signature)) {
            throw new IllegalArgumentException("Payment verification details are incomplete");
        }

        Booking booking = bookingService.getBookingEntityById(bookingId);
        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            notificationService.notifyTravellerForPaidBooking(booking);
            return bookingService.getBookingById(bookingId);
        }

        if (booking.getRazorpayOrderId() == null || booking.getRazorpayOrderId().isBlank()) {
            throw new IllegalArgumentException("No Razorpay order is linked to this booking");
        }

        if (!booking.getRazorpayOrderId().equals(orderId)) {
            throw new IllegalArgumentException("Razorpay order does not match this booking");
        }

        if (!generateSignature(orderId, paymentId).equals(signature)) {
            throw new IllegalArgumentException("Invalid Razorpay signature");
        }

        BookingDTO bookingDTO = bookingService.markBookingPaidAndConfirmed(bookingId);
        notificationService.notifyTravellerForPaidBooking(bookingService.getBookingEntityById(bookingId));
        return bookingDTO;
    }

    public BookingDTO completeDemoPayment(int bookingId) {
        if (!demoMode) {
            throw new IllegalStateException("Demo payment mode is disabled");
        }

        Booking booking = bookingService.getBookingEntityById(bookingId);
        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            notificationService.notifyTravellerForPaidBooking(booking);
            return bookingService.getBookingById(bookingId);
        }

        BookingDTO bookingDTO = bookingService.markBookingPaidAndConfirmed(bookingId);
        notificationService.notifyTravellerForPaidBooking(bookingService.getBookingEntityById(bookingId));
        return bookingDTO;
    }

    private String generateSignature(String orderId, String paymentId) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKey);
            byte[] hash = hmacSha256.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to verify Razorpay signature", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder(bytes.length * 2);
        for (byte value : bytes) {
            builder.append(String.format("%02x", value));
        }
        return builder.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
