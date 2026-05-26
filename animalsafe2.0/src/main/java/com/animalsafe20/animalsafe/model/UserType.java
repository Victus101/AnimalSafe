package com.animalsafe20.animalsafe.model;

/**
 * Enum que representa el tipo de usuario (rol de aplicación)
 * DIFERENTE del rol de seguridad (UserRole)
 * 
 * Este es un concepto a nivel de aplicación para clasificar
 * el comportamiento y permisos de negocio del usuario
 */
public enum UserType {
    VOLUNTARIO("Voluntario"),      // Usuario que se ofrece como voluntario
    RESCATISTA("Rescatista"),      // Usuario especializado en rescate
    ACOGIDA("Acogida");            // Usuario que proporciona acogida temporal

    private final String label;

    UserType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * Convierte un string a UserType con validación segura
     * @param value el valor string
     * @return UserType correspondiente
     * @throws IllegalArgumentException si el valor no es válido
     */
    public static UserType fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("El tipo de usuario no puede estar vacío");
        }

        try {
            return UserType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Tipo de usuario inválido: " + value +
                    ". Valores válidos: VOLUNTARIO, RESCATISTA, ACOGIDA"
            );
        }
    }
}
