package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Role;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.RoleDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface RoleService {

    public List<Role> getAll();

    Role get(String id);

    void delete(Role t);

    @Transactional
    Role save(Role t);

    public Role getByName(String name);

    Boolean checkDuplicate(Role current, Role old);

    public Set<Role> findByNamesIn(Set<String> names);

    public Role update(String id, RoleDTO userDTO, User editor) throws Exception;
}