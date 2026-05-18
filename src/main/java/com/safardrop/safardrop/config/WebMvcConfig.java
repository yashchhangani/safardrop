package com.safardrop.safardrop.config;

import com.safardrop.safardrop.security.AuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    private final String[] allowedOrigins;

    public WebMvcConfig(
            AuthInterceptor authInterceptor,
            @Value("${app.cors.allowed-origins:}") String allowedOrigins) {
        this.authInterceptor = authInterceptor;

        Set<String> mergedOrigins = new LinkedHashSet<>();
        mergedOrigins.add("http://localhost:5173");
        mergedOrigins.add("http://localhost:5174");
        mergedOrigins.add("https://safardrop.vercel.app");
        mergedOrigins.add("https://*.vercel.app");

        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(origin -> !origin.isEmpty())
                    .forEach(mergedOrigins::add);
        }

        this.allowedOrigins = mergedOrigins.toArray(String[]::new);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
