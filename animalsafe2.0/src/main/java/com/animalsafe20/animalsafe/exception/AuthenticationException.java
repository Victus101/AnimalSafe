package com.animalsafe20.animalsafe.exception;

/**
 * Excepción lanzada cuando hay un error de autenticación o autorización
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
