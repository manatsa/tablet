package com.zimnat.tablet.controller;

import com.zimnat.tablet.aop.annotation.Auditor;
import com.zimnat.tablet.business.domain.Setting;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.SettingDTO;
import com.zimnat.tablet.business.domain.enums.UserLevel;
import com.zimnat.tablet.business.services.SettingService;
import com.zimnat.tablet.business.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/setting")
public class SettingController {

    @Autowired
    SettingService settingService;

    @Autowired
    UserService userService;

    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(settingService.getAll());
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createSetting(@RequestBody SettingDTO settingDTO){
        Setting setting= new Setting();
        User user=userService.getCurrentUser();
        try{
            setting.setName(settingDTO.getName());
            setting.setDescription(settingDTO.getDescription());
            setting.setEffectiveDate(settingDTO.getEffectiveDate());
            setting.setValue(settingDTO.getValue());
            setting.setLevel(UserLevel.valueOf(settingDTO.getLevel()));
            setting.setProperty(settingDTO.getProperty());
            setting =settingService.save(setting, user);
            return  ResponseEntity.ok(settingService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSetting(@RequestBody SettingDTO settingDTO, @PathVariable("id") String id){


        try{
            User currentUser=userService.getCurrentUser();
            Setting setting=settingService.update(id, settingDTO,currentUser);
            return  ResponseEntity.ok(settingService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
