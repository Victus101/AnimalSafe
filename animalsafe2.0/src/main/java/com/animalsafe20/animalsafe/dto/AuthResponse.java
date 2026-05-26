package com.animalsafe20.animalsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de autenticación con JWT
 * 
 * Estructura:
 * {
 *   "token": "...",
 *   "user": {
 *     "id": 1,
 *     "name": "Juanito",
 *     "email": "juan@gmail.com",
 *     "role": "USER",
 *     "userType": "ACOGIDA"
 *   }
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private UserDataResponse user;

    /**
     * Crea una respuesta de autenticación exitosa
     * @param token JWT generado
     * @param userId ID del usuario
     * @param name nombre del usuario
     * @param email email del usuario
     * @param role rol de seguridad (USER, ADMIN, VOLUNTEER)
     * @param userType tipo de usuario de aplicación (VOLUNTARIO, RESCATISTA, ACOGIDA)
     * @return AuthResponse completamente poblado
     */
    public static AuthResponse success(String token, Long userId, String name, String email, String role, String userType) {
        UserDataResponse userData = UserDataResponse.builder()
                .id(userId)
                .name(name)
                .email(email)
                .role(role)
                .userType(userType)
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userData)
                .build();
    }
}
