package com.animalsafe20.animalsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa los datos del usuario en la respuesta de autenticación
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDataResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String userType;
}
