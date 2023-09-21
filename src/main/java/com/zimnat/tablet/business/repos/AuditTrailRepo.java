package com.zimnat.tablet.business.repos;

import com.zimnat.tablet.business.domain.AuditTrail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface AuditTrailRepo extends JpaRepository<AuditTrail, String> {

    List<AuditTrail> findAllByUsername(String username);
    List<AuditTrail> findAllByActionContainingIgnoreCaseAndUsername(String action, String username);
    List<AuditTrail> findAllByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(String username, Date start, Date end);
    List<AuditTrail> findAllByUsernameAndDateCreatedBetween(String username, Date start, Date end);
}
