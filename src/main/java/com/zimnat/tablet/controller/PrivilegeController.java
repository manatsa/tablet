package com.zimnat.tablet.controller;

import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.Privilege;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.PrivilegeDTO;
import com.zimnat.tablet.business.services.PrivilegeService;
import com.zimnat.tablet.business.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/privileges")
public class PrivilegeController {

    @Autowired
    PrivilegeService privilegeService;

    @Autowired
    UserService userService;

    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(privilegeService.getAll());
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createRole(@RequestBody PrivilegeDTO privilegeDTO){
        Privilege privilege= new Privilege();
        privilege.setName(privilegeDTO.getName());
        User user=userService.getCurrentUser();
        try{
            privilege =privilegeService.save(privilege, user);
            return  ResponseEntity.ok(privilegeService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> createPrivilege(@RequestBody PrivilegeDTO privilegeDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Privilege privilege=privilegeService.update(id, privilegeDTO,currentUser);
            return  ResponseEntity.ok(privilegeService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
