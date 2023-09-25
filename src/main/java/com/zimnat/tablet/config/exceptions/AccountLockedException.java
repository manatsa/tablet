package com.zimnat.tablet.config.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

@ResponseStatus(
        value = HttpStatus.BAD_GATEWAY,
        reason = "Account has been locked or user is not in the system.")
public class AccountLockedException extends RuntimeException {
    public AccountLockedException() {
        super();
    }

    public AccountLockedException(String message) {
        super(message);
    }
}