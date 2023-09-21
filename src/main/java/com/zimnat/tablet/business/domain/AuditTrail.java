package com.zimnat.tablet.business.domain;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.replica.emaze.business.domain
 */


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class AuditTrail extends BaseEntity{

    private String username;
    private Date start;
    private Date end;
    private String signature;
    private String actionName;
    private String action;
}
