package com.zimnat.tablet.business.repos;

import com.zimnat.tablet.business.domain.Branch;
import com.zimnat.tablet.business.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface DepartmentRepo extends JpaRepository<Department, String> {

}