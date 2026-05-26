package com.animalsafe20.animalsafe.controller;

import com.animalsafe20.animalsafe.dto.LoginRequest;
import com.animalsafe20.animalsafe.dto.RegisterRequest;
import com.animalsafe20.animalsafe.dto.AuthResponse;
import com.animalsafe20.animalsafe.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * Controlador para operaciones de autenticación
 * Endpoints: POST /api/auth/register, POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints de registro y login")
public class AuthController {

    private final AuthService authService;

    /**
     * Registra un nuevo usuario
     * @param request datos del registro
     * @return token JWT y datos del usuario
     */
    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo usuario", description = "Crea una nueva cuenta de usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya existe")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Autentica un usuario existente
     * @param request credenciales de login
     * @return token JWT y datos del usuario
     */
    @PostMapping("/login")
    @Operation(summary = "Login de usuario", description = "Autentica un usuario y devuelve token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso"),
            @ApiResponse(responseCode = "400", description = "Credenciales inválidas")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
