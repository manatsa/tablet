package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Privilege;
import com.zimnat.tablet.business.domain.Role;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.PrivilegeDTO;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PrivilegeService {

    public Privilege get(String id);
    public Privilege getByName(String name);
    public Privilege save(Privilege userRole, User user);

    public Privilege update(String id, PrivilegeDTO privilegeDTO, User user);
    public List<Privilege> getAll();

    public List<Privilege> getPrivilegesByRole(Role userRole);

}
