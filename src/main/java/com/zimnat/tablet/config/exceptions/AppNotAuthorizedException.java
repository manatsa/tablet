package com.zimnat.tablet.config.exceptions;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

public class AppNotAuthorizedException extends RuntimeException {
    public AppNotAuthorizedException() {
        super();
    }

    public AppNotAuthorizedException(String message) {
        super(message);
    }
}