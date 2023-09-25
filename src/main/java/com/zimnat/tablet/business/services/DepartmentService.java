package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Department;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.DepartmentDTO;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface DepartmentService {

    public List<Department> getAll();

    public Department get(String id);

    public void delete(Department t);

    public Department save(Department t);

    public Department update(String id, DepartmentDTO sbuDTO, User editor) throws Exception;
}