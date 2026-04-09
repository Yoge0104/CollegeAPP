package com.collegecompanion.service;

import com.collegecompanion.dto.AuthResponse;
import com.collegecompanion.dto.LoginRequest;
import com.collegecompanion.dto.RegisterRequest;
import com.collegecompanion.model.User;
import com.collegecompanion.repository.UserRepository;
import com.collegecompanion.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setBranch(request.getBranch());
        user.setYear(request.getYear());
        user.setSection(request.getSection());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
            user.getId(),
            token,
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getBranch(),
            user.getYear(),
            user.getSection()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
            user.getId(),
            token,
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getBranch(),
            user.getYear(),
            user.getSection()
        );
    }
}
