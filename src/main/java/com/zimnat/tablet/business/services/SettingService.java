package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Setting;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.SettingDTO;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.replica.emaze.business.services
 */

public interface SettingService {

    public List<Setting> getAll();
    public Setting save(Setting setting, User user);
    public Setting update(String id, SettingDTO settingsDTO, User user);
    public Setting findById(String id);
    public Setting findByName(String name);
    public List<Setting> findByDescription(String description);
}
