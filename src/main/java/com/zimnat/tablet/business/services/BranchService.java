package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Branch;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.BranchDTO;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface BranchService {

    public List<Branch> getAll();

    public Branch get(String id);

    public void delete(Branch t);

    public Branch save(Branch t);

    public Branch update(String id, BranchDTO branchDTO, User editor) throws Exception;
}