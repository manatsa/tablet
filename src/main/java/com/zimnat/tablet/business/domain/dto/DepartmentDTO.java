package com.zimnat.tablet.business.domain.dto;

import com.zimnat.tablet.business.domain.BaseName;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO{
    private String name;
    private String description;
}
