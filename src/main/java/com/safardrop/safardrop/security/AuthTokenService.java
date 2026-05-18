package com.safardrop.safardrop.security;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class AuthTokenService {

    private final String secret;
    private final long tokenExpirySeconds;

    public AuthTokenService(
            @Value("${app.auth.token-secret}") String secret,
            @Value("${app.auth.token-expiry-seconds:43200}") long tokenExpirySeconds
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("app.auth.token-secret must be configured");
        }
        this.secret = secret;
        this.tokenExpirySeconds = tokenExpirySeconds;
    }

    public String generateToken(User user) {
        long expiresAt = Instant.now().plusSeconds(tokenExpirySeconds).getEpochSecond();
        String payload = user.getUser_id() + "|" + user.getEmail() + "|" + user.getRole().name() + "|" + expiresAt;
        String encodedPayload = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return encodedPayload + "." + sign(encodedPayload);
    }

    public AuthenticatedUser parseToken(String token) {
        try {
            if (token == null || token.isBlank() || !token.contains(".")) {
                return null;
            }

            String[] parts = token.split("\\.", 2);
            String encodedPayload = parts[0];
            String signature = parts[1];

            if (!sign(encodedPayload).equals(signature)) {
                return null;
            }

            String payload = new String(Base64.getUrlDecoder().decode(encodedPayload), StandardCharsets.UTF_8);
            String[] fields = payload.split("\\|", 4);
            if (fields.length != 4) {
                return null;
            }

            long expiresAt = Long.parseLong(fields[3]);
            if (Instant.now().getEpochSecond() > expiresAt) {
                return null;
            }

            return new AuthenticatedUser(
                    Integer.parseInt(fields[0]),
                    fields[1],
                    UserRole.valueOf(fields[2])
            );
        } catch (Exception ex) {
            return null;
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] signature = mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign auth token", e);
        }
    }
}
