package com.zimnat.tablet.controller;

import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.Branch;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.BranchDTO;
import com.zimnat.tablet.business.services.BranchService;
import com.zimnat.tablet.business.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 1/4/2023
 */

@RestController
@RequestMapping("/api/branch")
public class BranchController {

   @Autowired
   BranchService branchService;


   @Autowired
   UserService userService;

   @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getBranchs(){
        try{

           List<Branch> branchs=branchService.getAll();
           return ResponseEntity.ok(branchs);
        }catch (Exception e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createBranch(@RequestBody BranchDTO branchDTO){
        Branch branch=new Branch();
        branch.setName(branchDTO.getName());
        branch.setDescription(branchDTO.getDescription());
        branch.setAddress(branchDTO.getAddress());
        branch.setPhone(branchDTO.getPhone());
        try{
            branch=branchService.save(branch);
            return  ResponseEntity.ok(branchService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBranch(@RequestBody BranchDTO branchDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Branch branch=branchService.update(id, branchDTO,currentUser);
            return  ResponseEntity.ok(branchService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

}
