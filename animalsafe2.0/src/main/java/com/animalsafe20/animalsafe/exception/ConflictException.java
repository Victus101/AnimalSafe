package com.animalsafe20.animalsafe.exception;

/**
 * Excepción lanzada cuando hay un conflicto (ej: email duplicado)
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
