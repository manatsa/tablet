package com.zimnat.tablet.business.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 21/9/2023
 */

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Branch extends BaseName{

    private String address;

    private String phone;

    @ManyToMany
    private Set<Sbu> sbus=new HashSet<>();
}
