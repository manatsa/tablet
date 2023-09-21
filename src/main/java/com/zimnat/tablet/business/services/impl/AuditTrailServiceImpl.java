package com.zimnat.tablet.business.services.impl;

import com.zimnat.tablet.business.domain.AuditTrail;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.repos.AuditTrailRepo;
import com.zimnat.tablet.business.services.AuditTrailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.replica.emaze.business.services.impl
 */

@Service
public class AuditTrailServiceImpl implements AuditTrailService {

    @Autowired
    AuditTrailRepo auditTrailRepo;

    @Override
    public AuditTrail save(AuditTrail auditTrail, User user) {
        auditTrail.setCreatedBy(user);
        auditTrail.setDateCreated(new Date());
        auditTrail.setId(UUID.randomUUID().toString());
        return auditTrailRepo.save(auditTrail);
    }

    @Override
    public List<AuditTrail> getByUsername(String username) {
        if(username==null){
            return null;
        }
        return auditTrailRepo.findAllByUsername(username);
    }

    @Override
    public List<AuditTrail> getByActionContainingIgnoreCaseAndUsername(String action, String username) {
        if(username==null){
            return null;
        }
        return auditTrailRepo.findAllByActionContainingIgnoreCaseAndUsername(action, username);
    }

    @Override
    public List<AuditTrail> getByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(String username, Date start, Date end) {
        if(start==null || end==null){
            return null;
        }
        return auditTrailRepo.findAllByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(username, start, end);
    }

    @Override
    public List<AuditTrail> getByUsernameAndDateCreatedBetween(String username,Date start, Date end) {
        if(start==null || end==null){
            return null;
        }
        return auditTrailRepo.findAllByUsernameAndDateCreatedBetween(username, start, end);
    }
}
