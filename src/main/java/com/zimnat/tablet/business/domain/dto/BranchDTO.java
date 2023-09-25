package com.zimnat.tablet.business.domain.dto;

import com.zimnat.tablet.business.domain.BaseName;
import com.zimnat.tablet.business.domain.Sbu;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class BranchDTO {

    private String name;

    private String description;

    private String address;

    private String phone;

    private String sbu;
}
