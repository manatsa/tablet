package com.zimnat.tablet.config;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

import com.zimnat.tablet.config.exceptions.AccountLockedException;
import com.zimnat.tablet.config.exceptions.AppNotAuthorizedException;
import com.zimnat.tablet.config.exceptions.BadParametersException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.PrintWriter;
import java.io.StringWriter;

@ControllerAdvice
public class CustomControllerAdvice {

    @ExceptionHandler({NullPointerException.class}) // exception handled
    @ResponseStatus(
            value = HttpStatus.NOT_FOUND,
            reason = "Invalid username and/or password.",
            code=HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleNullPointerExceptions( Exception e )
    {
        HttpStatus status = HttpStatus.NOT_FOUND; // 404
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace
                ),
                status
        );
    }

    // fallback method
    @ExceptionHandler(Exception.class) // exception handled
    @ResponseStatus(
            value = HttpStatus.INTERNAL_SERVER_ERROR,
            reason = "An internal server error has occurred. ",
            code=HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponse> handleExceptions( Exception e )
    {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
        // converting the stack trace to String
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace // specifying the stack trace in case of 500s
                ),
                status
        );
    }

    @ExceptionHandler(BadParametersException.class)
    @ResponseStatus(
            value = HttpStatus.BAD_REQUEST,
            reason = "Invalid username and/or password.",
            code=HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleBadParametersExceptions(Exception e)
    {
        HttpStatus status = HttpStatus.BAD_REQUEST; // 400
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace
                ),
                status
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(
            value = HttpStatus.BAD_REQUEST,
            reason = "Invalid username and/or password.",
            code=HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleBadCredentialsExceptions(Exception e)
    {
        HttpStatus status = HttpStatus.BAD_REQUEST; // 400
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace
                ),
                status
        );
    }

    @ExceptionHandler({AppNotAuthorizedException.class})
    @ResponseStatus(
            value = HttpStatus.UNAUTHORIZED,
            reason = "Account has been locked or user is not in the system.",
            code=HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ErrorResponse> handleUnauthorizedExceptions(Exception e)
    {
        HttpStatus status = HttpStatus.UNAUTHORIZED; // 400
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace
                ),
                status
        );
    }



    @ExceptionHandler({AccountLockedException.class, DisabledException.class})
    @ResponseStatus(
            value = HttpStatus.BAD_GATEWAY,
            reason = "Account has been locked or user is not in the system.")
    public ResponseEntity<ErrorResponse> handleAccountLockedExceptions(Exception e)
    {
        HttpStatus status = HttpStatus.BAD_GATEWAY; // 403
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String stackTrace = stringWriter.toString();

        return new ResponseEntity<>(
                new ErrorResponse(
                        status,
                        e.getMessage(),
                        stackTrace
                ),
                status
        );
    }


}