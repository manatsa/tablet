package com.zimnat.tablet.config.exceptions;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

public class CustomDataNotFoundException extends RuntimeException {
    public CustomDataNotFoundException() {
        super();
    }

    public CustomDataNotFoundException(String message) {
        super(message);
    }
}