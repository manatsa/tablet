package com.zimnat.tablet.business.services.impl;

import com.zimnat.tablet.business.domain.Sbu;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.SbuDTO;
import com.zimnat.tablet.business.repos.SbuRepo;
import com.zimnat.tablet.business.services.SbuService;
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
public class SbuServiceImpl implements SbuService {

    @Autowired
    private SbuRepo sbuRepo;
    @Autowired
    private UserService userService;
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Sbu> getAll() {
        return sbuRepo.findAll();
    }

    @Override
    public Sbu get(String id) {
        return sbuRepo.findById(id).get();
    }

    @Override
    public void delete(Sbu t) {
        if (t.getId() == null) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        t.setActive(Boolean.FALSE);
        sbuRepo.save(t);
    }

    @Override
    @Transactional
    public Sbu save(Sbu t) {
        t.setId(UUID.randomUUID().toString());
        t.setCreatedBy(userService.get(userService.getCurrentUser().getId()));
        t.setDateCreated(new Date());
        return sbuRepo.save(t);
    }



    @Override
    @Transactional
    public Sbu update(String id, SbuDTO sbuDTO, User editor) throws Exception {
        Sbu target=null;
        Sbu sbu=get(id);
        if(sbu!=null && sbu.getId()!=null){
            target=entityManager.find(Sbu.class, sbu.getId());
            BeanUtils.copyProperties(sbu, target);
            target.setCreatedBy(userService.get(sbu.getCreatedBy().getId()));
            target.setModifiedBy(entityManager.find(User.class,userService.getCurrentUser().getId()));
            target.setDateModified(new Date());
            target.setName(sbuDTO.getName());
            target.setDescription(sbuDTO.getDescription());
            return sbuRepo.save(target);
        }
        return null;
    }


}
