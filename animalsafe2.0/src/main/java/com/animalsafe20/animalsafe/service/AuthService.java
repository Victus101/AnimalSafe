package com.animalsafe20.animalsafe.service;

import com.animalsafe20.animalsafe.dto.AuthResponse;
import com.animalsafe20.animalsafe.dto.LoginRequest;
import com.animalsafe20.animalsafe.dto.RegisterRequest;
import com.animalsafe20.animalsafe.exception.AuthenticationException;
import com.animalsafe20.animalsafe.exception.BadRequestException;
import com.animalsafe20.animalsafe.exception.ConflictException;
import com.animalsafe20.animalsafe.model.User;
import com.animalsafe20.animalsafe.model.UserType;
import com.animalsafe20.animalsafe.repository.UserRepository;
import com.animalsafe20.animalsafe.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de autenticación
 * Maneja el registro, login y validación de usuarios
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Registra un nuevo usuario
     * @param request datos del registro (incluye userType)
     * @return respuesta de autenticación con token
     * @throws BadRequestException si datos requeridos faltan o son inválidos
     * @throws ConflictException si el email ya existe
     * @throws AuthenticationException si las contraseñas no coinciden
     */
    public AuthResponse register(RegisterRequest request) {
        log.info("Registrando nuevo usuario");

        // ===== VALIDACIÓN DEFENSIVA =====
        
        // Validar name
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("El nombre es obligatorio");
        }

        // Validar email
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("El email es obligatorio");
        }

        // Validar password
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("La contraseña es obligatoria");
        }

        // Validar passwordConfirm
        if (request.getPasswordConfirm() == null || request.getPasswordConfirm().isBlank()) {
            throw new BadRequestException("La confirmación de contraseña es obligatoria");
        }

        // Validar que las contraseñas coincidan
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new AuthenticationException("Las contraseñas no coinciden");
        }

        // Validar userType (defensiva)
        if (request.getUserType() == null || request.getUserType().isBlank()) {
            throw new BadRequestException("Debe seleccionar un tipo de usuario");
        }

        log.debug("Validaciones iniciales pasadas para email: {}", request.getEmail());

        // ===== VALIDACIÓN DE NEGOCIO =====
        
        // Verificar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Intento de registro con email duplicado: {}", request.getEmail());
            throw new ConflictException("El email " + request.getEmail() + " ya está registrado");
        }

        // Convertir y validar userType
        UserType userType;
        try {
            userType = UserType.fromString(request.getUserType());
        } catch (IllegalArgumentException e) {
            log.warn("UserType inválido en registro: {}", request.getUserType());
            throw new BadRequestException(e.getMessage());
        }

        log.debug("UserType validado: {}", userType);

        // ===== CREAR USUARIO =====
        
        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.UserRole.USER)
                .userType(userType)
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Usuario registrado exitosamente con ID: {}, userType: {}", savedUser.getId(), savedUser.getUserType());

        // Generar token
        String token = jwtTokenProvider.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().toString()
        );

        return AuthResponse.success(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole().toString(), savedUser.getUserType().toString());
    }

    /**
     * Autentica un usuario y genera un token
     * @param request credenciales de login
     * @return respuesta de autenticación con token
     * @throws AuthenticationException si las credenciales son inválidas
     */
    public AuthResponse login(LoginRequest request) {
        log.info("Intentando login para usuario: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Contraseña incorrecta para usuario: {}", request.getEmail());
            throw new AuthenticationException("Email o contraseña incorrectos");
        }

        log.info("Login exitoso para usuario: {}", request.getEmail());

        // Generar token
        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().toString()
        );

        return AuthResponse.success(token, user.getId(), user.getName(), user.getEmail(), user.getRole().toString(), user.getUserType().toString());
    }

    /**
     * Valida un token JWT
     * @param token el token a validar
     * @return true si es válido
     */
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    /**
     * Obtiene el ID de usuario desde un token
     * @param token el token JWT
     * @return el ID del usuario
     */
    public Long getUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
