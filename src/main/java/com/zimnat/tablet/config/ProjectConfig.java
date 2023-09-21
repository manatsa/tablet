package com.zimnat.tablet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;

/**
 * @author :: codemaster
 * created on :: 20/9/2023
 */

@Configuration
public class ProjectConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(8);
//        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = "ROLE_SUPER > ROLE_ADMIN > ROLE_USER";
        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }

    @Bean
    public DefaultWebSecurityExpressionHandler webSecurityExpressionHandler() {
        DefaultWebSecurityExpressionHandler expressionHandler = new DefaultWebSecurityExpressionHandler();
        expressionHandler.setRoleHierarchy(roleHierarchy());
        return expressionHandler;
    }

    @Bean
    public InMemoryUserDetailsManager inMemoryUserDetailsManager(){
        InMemoryUserDetailsManager inMemoryUserDetailsManager= new InMemoryUserDetailsManager();
        UserDetails user= User.withDefaultPasswordEncoder().username("user").password("user").roles("USER").build();
        UserDetails admin= User.withDefaultPasswordEncoder().username("admin").password("admin").roles("ADMIN").build();

        return inMemoryUserDetailsManager;
    }





}
