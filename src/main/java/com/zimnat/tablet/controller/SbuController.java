package com.zimnat.tablet.controller;

import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.Sbu;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.SbuDTO;
import com.zimnat.tablet.business.services.PrivilegeService;
import com.zimnat.tablet.business.services.SbuService;
import com.zimnat.tablet.business.services.UserService;
import org.replica.emaze.exceptions.InternalServerErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 1/4/2023
 */

@RestController
@RequestMapping("/api/sbu")
public class SbuController {

   @Autowired
   SbuService sbuService;

   @Autowired
   UserService userService;

   @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getSbus() throws Exception {
        try{
           List<Sbu> sbus=sbuService.getAll();
           return ResponseEntity.ok(sbus);
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createSbu(@RequestBody SbuDTO sbuDTO) throws Exception {
        Sbu sbu=new Sbu();
        sbu.setCode(sbuDTO.getCode());
        sbu.setName(sbuDTO.getName());
        sbu.setDescription(sbuDTO.getDescription());
        try{
            sbu=sbuService.save(sbu);
            List<Sbu> sbus=sbuService.getAll();
            System.err.println(sbus);
            return  ResponseEntity.ok(sbus);
        }catch(Exception e){
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSbu(@RequestBody SbuDTO sbuDTO, @PathVariable("id") String id) throws Exception {
        try{
            User currentUser=userService.getCurrentUser();
            Sbu sbu=sbuService.update(id, sbuDTO,currentUser);
            return  ResponseEntity.ok(sbuService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

}
