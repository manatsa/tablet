package com.zimnat.tablet.business.services;

import com.zimnat.tablet.business.domain.Sbu;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.SbuDTO;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface SbuService {

    public List<Sbu> getAll();

    public Sbu get(String id);

    public void delete(Sbu t);

    public Sbu save(Sbu t);

    public Sbu update(String id, SbuDTO sbuDTO, User editor) throws Exception;
}