package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.PractitionerCreateDto;
import com.example.wellnessbackend.dto.PractitionerResponseDto;
import com.example.wellnessbackend.dto.PractitionerUpdateDto;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PractitionerService {

    private final PractitionerProfileRepository repository;
    private final UserRepository userRepository;

    // =========================
    // CREATE PRACTITIONER PROFILE
    // =========================
    public PractitionerResponseDto createPractitioner(Long userId, PractitionerCreateDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PRACTITIONER) {
            throw new RuntimeException("Cannot create practitioner profile: User is not a practitioner");
        }

        if (repository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Practitioner profile already exists for this user");
        }

        PractitionerProfile profile = PractitionerProfile.builder()
                .userId(userId)
                .specialization(request.getSpecialization())
                .bio(request.getBio() != null ? request.getBio() : user.getBio())
                .verified(false)
                .rating(0.0)
                .build();

        PractitionerProfile saved = repository.save(profile);
        return mapToDto(saved);
    }

    // =========================
    // GET ALL PRACTITIONERS
    // =========================
    public List<PractitionerResponseDto> getAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // =========================
    // GET PRACTITIONER BY PROFILE ID
    // =========================
    public PractitionerResponseDto getById(Long id) {
        PractitionerProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found with id: " + id));
        return mapToDto(profile);
    }

    // =========================
    // GET PRACTITIONER BY USER ID
    // =========================
    public PractitionerResponseDto getByUserId(Long userId) {
        PractitionerProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Practitioner not found for userId: " + userId));
        return mapToDto(profile);
    }

    // =========================
    // UPDATE PRACTITIONER PROFILE
    // =========================
    public PractitionerResponseDto updatePractitioner(Long id, PractitionerUpdateDto request) {
        // Step 1: Fetch profile
        PractitionerProfile profile = getProfileById(id);

        // Step 2: Update specialization & bio, reset verified
        profile.setSpecialization(request.getSpecialization());
        profile.setBio(request.getBio());
        profile.setVerified(false);

        PractitionerProfile updatedProfile = saveProfile(profile);

        // Step 3: Update user's bio in User table
        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for practitioner"));
        user.setBio(request.getBio());
        userRepository.save(user);

        return mapToDto(updatedProfile);
    }

    // =========================
    // HELPER METHODS
    // =========================
    public PractitionerProfile getProfileById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found"));
    }

    public PractitionerProfile saveProfile(PractitionerProfile profile) {
        return repository.save(profile);
    }

    public PractitionerResponseDto mapToDto(PractitionerProfile profile) {
        return PractitionerResponseDto.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .bio(profile.getBio())
                .specialization(profile.getSpecialization())
                .verified(profile.getVerified())
                .rating(profile.getRating())
                .build();
    }
}
