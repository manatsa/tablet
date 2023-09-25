package com.zimnat.tablet.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Getter
@Setter
@MappedSuperclass
abstract public class BaseEntity implements Serializable {
    @Id
    private String id;

    @CreatedBy
    @JoinColumn(name="created_by")
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    private User createdBy;

    @JsonIgnore
    @LastModifiedBy
    @JoinColumn(name="modified_by")
    @ManyToOne(fetch = FetchType.EAGER)
    private User modifiedBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateCreated;

    @LastModifiedDate
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateModified;

    @Version
    private Long version;
    private Boolean active = Boolean.TRUE;
    public BaseEntity() {
    }
    public BaseEntity(String id) {
        this.id = id;
    }


    public  boolean equals(BaseEntity entity){
        return  this.getId().equals(entity.getId());
    }
}