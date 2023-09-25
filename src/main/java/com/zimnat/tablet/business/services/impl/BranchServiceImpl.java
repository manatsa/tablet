package com.zimnat.tablet.business.services.impl;

import com.zimnat.tablet.business.domain.Branch;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.BranchDTO;
import com.zimnat.tablet.business.repos.BranchRepo;
import com.zimnat.tablet.business.services.BranchService;
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
public class BranchServiceImpl implements BranchService {

    @Autowired
    private BranchRepo branchRepo;
    @Autowired
    private UserService userService;
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Branch> getAll() {
        return branchRepo.findAll();
    }

    @Override
    public Branch get(String id) {
        return branchRepo.findById(id).get();
    }

    @Override
    public void delete(Branch t) {
        if (t.getId() == null) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        t.setActive(Boolean.FALSE);
        branchRepo.save(t);
    }

    @Override
    @Transactional
    public Branch save(Branch t) {
        t.setId(UUID.randomUUID().toString());
        t.setCreatedBy(userService.get(userService.getCurrentUser().getId()));
        t.setDateCreated(new Date());
        return branchRepo.save(t);
    }



    @Override
    @Transactional
    public Branch update(String id, BranchDTO branchDTO, User editor) throws Exception {
        Branch target=null;
        Branch branch=get(id);
        if(branch!=null && branch.getId()!=null){
            target=entityManager.find(Branch.class, branch.getId());
            BeanUtils.copyProperties(branch, target);
            target.setCreatedBy(userService.get(branch.getCreatedBy().getId()));
            target.setModifiedBy(entityManager.find(User.class,userService.getCurrentUser().getId()));
            target.setDateModified(new Date());
            target.setName(branchDTO.getName());
            target.setName(branchDTO.getName());
            target.setDescription(branchDTO.getDescription());
            return entityManager.merge(target);
        }
        return null;
    }


}
