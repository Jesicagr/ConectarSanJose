package com.conectarsj.backend.exceptions;

public class FechaInvalidaException extends RuntimeException {
    public FechaInvalidaException(String mensaje) {
        super(mensaje);
    }
}
