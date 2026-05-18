package com.safardrop.safardrop.security;

import com.safardrop.safardrop.entity.UserRole;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class RequestAuthorizationService {

    public AuthenticatedUser getAuthenticatedUser(HttpServletRequest request) {
        Object attribute = request.getAttribute(AuthInterceptor.AUTH_USER_ATTRIBUTE);
        if (attribute instanceof AuthenticatedUser authenticatedUser) {
            return authenticatedUser;
        }

        throw new ResponseStatusException(UNAUTHORIZED, "Unauthorized");
    }

    public AuthenticatedUser requireSelfOrAdmin(HttpServletRequest request, int userId) {
        AuthenticatedUser authenticatedUser = getAuthenticatedUser(request);
        if (authenticatedUser.isAdmin() || authenticatedUser.getUserId() == userId) {
            return authenticatedUser;
        }

        throw new ResponseStatusException(FORBIDDEN, "You are not allowed to access this resource");
    }

    public AuthenticatedUser requireRole(HttpServletRequest request, UserRole... allowedRoles) {
        AuthenticatedUser authenticatedUser = getAuthenticatedUser(request);
        for (UserRole allowedRole : allowedRoles) {
            if (authenticatedUser.getRole() == allowedRole) {
                return authenticatedUser;
            }
        }

        throw new ResponseStatusException(FORBIDDEN, "You do not have permission for this action");
    }
}
