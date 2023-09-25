package com.zimnat.tablet.config.exceptions;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

public class BadParametersException extends RuntimeException {
    public BadParametersException() {
        super();
    }

    public BadParametersException(String message) {
        super(message);
    }
}