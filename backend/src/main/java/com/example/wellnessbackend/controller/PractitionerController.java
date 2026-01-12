package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.PractitionerCreateDto;
import com.example.wellnessbackend.dto.PractitionerResponseDto;
import com.example.wellnessbackend.dto.PractitionerUpdateDto;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.PractitionerService;
import com.example.wellnessbackend.service.TherapySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/practitioners")
@RequiredArgsConstructor
public class PractitionerController {

    private final PractitionerService service;
    private final UserRepository userRepository; // for updating user bio
    private final TherapySessionService sessionService; // for availability

    // =========================
    // CREATE PRACTITIONER PROFILE
    // =========================
    @PostMapping("/{userId}")
    public ResponseEntity<PractitionerResponseDto> create(
            @PathVariable Long userId,
            @RequestBody PractitionerCreateDto request
    ) {
        return ResponseEntity.ok(service.createPractitioner(userId, request));
    }

    // =========================
    // GET ALL PRACTITIONERS
    // =========================
    @GetMapping
    public ResponseEntity<List<PractitionerResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // =========================
    // GET PRACTITIONER BY PROFILE ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<PractitionerResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // =========================
    // GET PRACTITIONER BY USER ID
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<PractitionerResponseDto> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    // =========================
    // UPDATE PRACTITIONER PROFILE
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<PractitionerResponseDto> update(
            @PathVariable Long id,
            @RequestBody PractitionerUpdateDto request
    ) {
        // Step 1: Fetch practitioner profile
        var profile = service.getProfileById(id);

        // Step 2: Update bio & specialization, reset verified
        profile.setBio(request.getBio());
        profile.setSpecialization(request.getSpecialization());
        profile.setVerified(false);

        var updatedProfile = service.saveProfile(profile);

        // Step 3: Update user's bio in the users table
        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for practitioner"));
        user.setBio(request.getBio());
        userRepository.save(user);

        return ResponseEntity.ok(service.mapToDto(updatedProfile));
    }

    // =========================
    // GET VERIFIED PRACTITIONERS
    // =========================
    @GetMapping("/verified")
    public ResponseEntity<List<PractitionerResponseDto>> getVerifiedPractitioners() {
        List<User> users = userRepository.findByRoleAndVerified(com.example.wellnessbackend.entity.Role.PRACTITIONER, true);

        List<PractitionerResponseDto> response = users.stream()
                .map(user -> {
                    var practitioner = service.getByUserId(user.getId());
                    return PractitionerResponseDto.builder()
                            .id(practitioner.getId())
                            .userId(user.getId())
                            .specialization(practitioner.getSpecialization())
                            .bio(practitioner.getBio())
                            .verified(practitioner.getVerified())
                            .rating(practitioner.getRating())
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET PRACTITIONER AVAILABILITY
    // =========================
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<LocalDateTime>> getAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) String date
    ) {
        List<LocalDateTime> freeSlots = sessionService.getAvailableSlots(id, date);
        return ResponseEntity.ok(freeSlots);
    }
}
