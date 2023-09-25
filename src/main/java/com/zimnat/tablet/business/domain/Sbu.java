package com.zimnat.tablet.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Sbu  extends BaseName{

    private String code;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "sbu_branch", joinColumns = {
            @JoinColumn(name = "sbu_id", nullable = false)}, inverseJoinColumns = {
            @JoinColumn(name = "branch_id", nullable = false)})
    Set<Branch> branches= new HashSet<>();

}
