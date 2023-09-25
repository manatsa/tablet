package com.zimnat.tablet.business.security;


import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.UserDTO;
import com.zimnat.tablet.business.services.UserService;
import com.zimnat.tablet.config.exceptions.AppNotAuthorizedException;
import com.zimnat.tablet.config.exceptions.BadParametersException;
import org.replica.emaze.exceptions.AccountLockedException;
import org.replica.emaze.exceptions.InternalServerErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */


@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("api/")
public class JwtAuthenticationController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Auditor
    @RequestMapping(value = "signin", method = RequestMethod.POST)
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<?> LoginAndCreateAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws BadCredentialsException, InternalServerErrorException {
        SimpleDateFormat format= new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        User user=userService.findByUserName(authenticationRequest.getUsername());
        System.err.println(user);
        if(user==null){
            throw new BadParametersException("Username was not found!");
        }
        else if(!user.getActive()){
            throw  new com.zimnat.tablet.config.exceptions.AccountLockedException("Your account has been locked after too many attempts!");
        }

        if(user!=null){
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(authenticationRequest.getUsername());

            final String token = jwtTokenUtil.generateToken(userDetails);
            System.err.println(authenticationRequest.getUsername()+" has logged in.........> Date: "+format.format(new Date()));
            UserDTO userDTO=new UserDTO(user, token);
            return ResponseEntity.ok(userDTO);
        }else{
            throw new BadParametersException("Login has failed! User not found.");
        }

    }

    private void authenticate(String username, String password) throws BadCredentialsException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            System.err.println("user "+ username+" has logged in!!");
        } catch (DisabledException e) {
            throw new com.zimnat.tablet.config.exceptions.AccountLockedException("user is not active, not allowed to login!");
        } catch (BadCredentialsException e) {
            throw new AppNotAuthorizedException("Invalid username and/or password!");
        }
    }
}
