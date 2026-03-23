package com.safardrop.safardrop;

import org.slf4j.MDC;
import org.springframework.boot.context.event.ApplicationStartingEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class MDCConfig implements ApplicationListener<ApplicationStartingEvent> {
    @Override
    public void onApplicationEvent(ApplicationStartingEvent event) {
        MDC.put("spring.application.name", "Safardrop");
    }
}