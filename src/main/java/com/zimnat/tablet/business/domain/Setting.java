package com.zimnat.tablet.business.domain;

import com.zimnat.tablet.business.domain.enums.UserLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.replica.emaze.business.domain
 */

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Setting extends BaseEntity{

    private String name;
    private String description;
    private String property;
    private String value;
    private Date effectiveDate;
    @Enumerated
    private UserLevel level;
}
