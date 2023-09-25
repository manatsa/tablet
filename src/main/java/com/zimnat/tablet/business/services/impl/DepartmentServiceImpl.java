package com.zimnat.tablet.business.services.impl;

import com.zimnat.tablet.business.domain.Department;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.DepartmentDTO;
import com.zimnat.tablet.business.repos.DepartmentRepo;
import com.zimnat.tablet.business.services.DepartmentService;
import com.zimnat.tablet.business.services.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Service
@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepo departmentRepo;
    @Autowired
    private UserService userService;
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Department> getAll() {
        return departmentRepo.findAll();
    }

    @Override
    public Department get(String id) {
        return departmentRepo.findById(id).get();
    }

    @Override
    public void delete(Department t) {
        if (t.getId() == null) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        t.setActive(Boolean.FALSE);
        departmentRepo.save(t);
    }

    @Override
    @Transactional
    public Department save(Department t) {
        t.setId(UUID.randomUUID().toString());
        t.setCreatedBy(userService.get(userService.getCurrentUser().getId()));
        t.setDateCreated(new Date());
        return departmentRepo.save(t);
    }



    @Override
    @Transactional
    public Department update(String id, DepartmentDTO departmentDTO, User editor) throws Exception {
        Department target=null;
        Department department=get(id);
        if(department!=null && department.getId()!=null){
            target=entityManager.find(Department.class, department.getId());
            BeanUtils.copyProperties(department, target);
            target.setCreatedBy(userService.get(department.getCreatedBy().getId()));
            target.setModifiedBy(entityManager.find(User.class,userService.getCurrentUser().getId()));
            target.setDateModified(new Date());
            target.setName(departmentDTO.getName());
            target.setName(departmentDTO.getName());
            target.setDescription(departmentDTO.getDescription());
            return entityManager.merge(target);
        }
        return null;
    }


}
