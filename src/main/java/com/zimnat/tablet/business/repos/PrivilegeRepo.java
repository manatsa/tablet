package com.zimnat.tablet.business.repos;

import com.zimnat.tablet.business.domain.Privilege;
import com.zimnat.tablet.business.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PrivilegeRepo extends JpaRepository<Privilege, String> {


    List<Privilege> findAllByRolesIn(List<Role> role);
    Privilege getByName(String name);
}