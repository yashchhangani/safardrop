package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.TripDTO;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // Get all trips
    @GetMapping
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    // Get trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable int id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    // Get trips by user
    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<TripDTO>> getTripsByUser(@PathVariable int user_id) {
        return ResponseEntity.ok(tripService.getTripsByUser(user_id));
    }

    // Create trip
    @PostMapping
    public ResponseEntity<TripDTO> createTrip(@Valid @RequestBody Trip trip) {
        return new ResponseEntity<>(tripService.createTrip(trip), HttpStatus.CREATED);
    }

    // Update trip
    @PutMapping("/{id}")
    public ResponseEntity<TripDTO> updateTrip(@PathVariable int id, @Valid @RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.updateTrip(id, trip));
    }

    // Delete trip
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrip(@PathVariable int id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok("Trip deleted successfully");
    }
}
