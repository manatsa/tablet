package com.zimnat.tablet.controller;

import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.BaseName;
import com.zimnat.tablet.business.domain.Role;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.UserDTO;
import com.zimnat.tablet.business.services.RoleService;
import com.zimnat.tablet.business.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 30/3/2023
 */

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value("spring.pass.def.auto")
    private String def;


    @Auditor
    @GetMapping("/")
    public List<User> getAllUsers(){
        List<User> users= userService.getAll();
        return users.stream().peek(user ->{
            user.setActiveString(user.getActive().toString());
            user.setRoleString(user.getRoles().stream().map(BaseName::getName).collect(Collectors.joining(",")));
                }
        ).collect(Collectors.toList());
    }

    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO){
        try {

            User user = userDTO.createFromDTO();
            user.setPassword(def);
            user.setRoles(userDTO.getRoles().stream().map(r->roleService.getByName(r)).collect(Collectors.toSet()));
            user.setUserLevel(userDTO.getUserLevel());
            User currentUser = userService.getCurrentUser();
            user = userService.Save(user, currentUser);
            List<User> users=userService.getAll();
            users.stream().map(user1 -> {
                user1.setRoleString(rolesToString(user1));

                String privString=user1.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> {
                    return privsToString(role);
                }).collect(Collectors.joining(","));
                user1.setPrivilegeString(privString);
                return user1;
            });

            return ResponseEntity.ok(users);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO, @PathVariable("id") String id){
        try {
            User currentUser = userService.getCurrentUser();
            userService.update(id,userDTO, currentUser);
            List<User> users=userService.getAll();
            users.stream().map(user ->
            {
                String privString=user.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> privsToString(role)).collect(Collectors.joining(","));

                user.setRoleString(rolesToString(user));
                user.setPrivilegeString(privString);
                user.setActiveString(user.getActive().toString());
                return user;
            });


            return ResponseEntity.ok(users);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @Auditor
    @PutMapping("/changePassword/{newPassword}")
    public ResponseEntity<?> changeUserPassword(@PathVariable("newPassword") String password){
        User currentUser=userService.getCurrentUser();
        userService.changePassword(currentUser, password);
        List<User> users=userService.getAll();
        users.stream().map(user ->
        {
            String privString=user.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> privsToString(role)).collect(Collectors.joining(","));

            user.setRoleString(rolesToString(user));
            user.setPrivilegeString(privString);
            user.setActiveString(user.getActive().toString());
            return user;
        });


        return ResponseEntity.ok(users);

    }

    @PutMapping("/resetPassword/{id}")
    public ResponseEntity<?> resetPassword(@PathVariable("id") String id){
        User currentUser=userService.getCurrentUser();
        try{
        userService.resetPassword(id, currentUser);
        List<User> users=userService.getAll();
        users.stream().map(user ->
        {
            String privString=user.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> privsToString(role)).collect(Collectors.joining(","));

            user.setRoleString(rolesToString(user));
            user.setPrivilegeString(privString);
            user.setActiveString(user.getActive().toString());
            return user;
        });


        return ResponseEntity.ok(users);
    }catch(Exception e){
        e.printStackTrace();
        return ResponseEntity.status(500).body(e);
    }
    }

    @Auditor
    @PutMapping("/activateDeactivate/{id}")
    public ResponseEntity<?> activateDeactivate(@PathVariable("id") String id)throws Exception{
        User currentUser=userService.getCurrentUser();
        try{
            userService.activateDeactivate(id, currentUser);
            List<User> users=userService.getAll();
            users.stream().map(user ->
            {
                String privString=user.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> privsToString(role)).collect(Collectors.joining(","));
                String rolesString=rolesToString(user);
                String actString=user.getActive().toString();

                System.err.println("ROLES:"+rolesString+" \t PRIVS::"+privString+" \t ACTIVE::"+actString);
                user.setRoleString(rolesString);
                user.setPrivilegeString(privString);
                user.setActiveString(actString);
                return user;
            });

            return ResponseEntity.ok(users);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @Auditor
    @PutMapping("/lock-account/{id}")
    public ResponseEntity<?> lockAccount(@PathVariable("id") String id){
        try {
            userService.lockAccount(id);
            List<User> users=userService.getAll();
            users.stream().map(user ->
            {
                String privString=user.getRoles().stream().filter(role -> role!=null && role.getName()!=null).map(role -> privsToString(role)).collect(Collectors.joining(","));

                user.setRoleString(rolesToString(user));
                user.setPrivilegeString(privString);
                user.setActiveString(user.getActive().toString());
                return user;
            });


            return ResponseEntity.ok(users);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }


    private String rolesToString(User user){
        return user.getRoles().stream().map(BaseName::getName).collect(Collectors.joining(","));
    }

    private String privsToString(Role role){
        return role.getPrivileges().stream().map(BaseName::getName).collect(Collectors.joining(","));
    }

}
