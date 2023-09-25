package com.zimnat.tablet.business.services.impl;

import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.business.domain.dto.UserDTO;
import com.zimnat.tablet.business.repos.UserRepo;
import com.zimnat.tablet.business.services.RoleService;
import com.zimnat.tablet.business.services.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Service
@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
public class UserServiceImpl implements UserService {

    final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Lazy
    @Autowired
    private UserRepo userRepo;

    @PersistenceContext
    private EntityManager entityManager;
    @Lazy
    @Autowired
    private RoleService userRoleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value("spring.pass.def.auto")
    private String def;

    @Override
    public List<User> getAllActive() {
        return userRepo.getAllActive(Boolean.TRUE);
    }

//    @LogExecutionTime
    @Override
    public List<User> getAll() {
        return userRepo.findAll();
    }

    @Override
    public User get(String id) {
        return userRepo.findById(id).get();
    }

    @Override
    public void delete(User t) {
        if (t.getId() == null) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        t.setActive(Boolean.FALSE);
        userRepo.save(t);
    }


    @Override
    @Transactional
    public User Save(User t, User editor) {
        String hashedPassword = passwordEncoder.encode("Password@123");
        t.setPassword(hashedPassword);
        t.setCreatedBy(editor.getUserName());
        t.setDateCreated(new Date());
        t.setId(UUID.randomUUID().toString());
        t.setRoles(t.getRoles().stream().map(r -> userRoleService.get(r.getId())).collect(Collectors.toSet()));
        return userRepo.save(t);
    }

    @Override
    @Transactional
    public User changePassword(User editor, String newPassword) {
        User t=get(editor.getId());
        String hashedPassword = passwordEncoder.encode(newPassword);
        t.setPassword(hashedPassword);
        t.setModifiedBy(editor.getUserName());
        t.setDateModified(new Date());
        return userRepo.save(t);
    }

    @Override
    @Transactional
    public User resetPassword(String id, User editor) {
        User t=get(id);
        t.setPassword(def);
        t.setModifiedBy(editor.getUserName());
        t.setDateModified(new Date());
        return userRepo.save(t);
    }

    @Transactional
    @Override
    public User update(String id, UserDTO userDTO, User editor) throws Exception {
        User target=null;
        User user=get(id);
        if(user!=null && user.getId()!=null){
            target=entityManager.find(User.class, user.getId());
            BeanUtils.copyProperties(user, target);
            target.setModifiedBy(editor.getUserName());
            User creator=findByUserName(user.getCreatedBy());
            target.setCreatedBy(editor.getUserName());
            target.setDateModified(new Date());
            target.setUserName(userDTO.getUserName());
            target.setActive(userDTO.isActive());
            target.setLastName(userDTO.getLastName());
            target.setFirstName(userDTO.getFirstName());
            target.setUserLevel(userDTO.getUserLevel());
            target.setRoles(userDTO.getRoles().stream().map(r->userRoleService.getByName(r)).collect(Collectors.toSet()));
            User u =entityManager.merge(target);
            return u;
        }else{
            throw new Exception("User was not found!");
        }
    }

    @Transactional
    @Override
    public User activateDeactivate(String id, User editor) throws Exception {
        User target=null;

        if(id!=null){
            target=entityManager.find(User.class,id);
            target.setModifiedBy(editor.getModifiedBy());
            target.setDateModified(new Date());
            target.setActive(!target.getActive());
            User user =entityManager.merge(target);
            return user;
        }else{
            throw new Exception("User was not found!");
        }


    }

    @Transactional
    @Override
    public User lockAccount(String username) throws Exception {
        User target=findByUserName(username);

        if(username!=null && target!=null){
            target=findByUserName(username);
            target.setDateModified(new Date());
            target.setActive(false);
            User user =entityManager.merge(target);
            return user;
        }else{
            throw new Exception("User was not found or is locked!");
        }


    }

    @Override
    public User findByUserName(String name) {
        User user=userRepo.findByUserName(name);
        return user;
    }

    @Override
    public User getCurrentUser() {
        String username = getCurrentUsername();
        if (username == null) {
            return null;
        }
        User user = findByUserName(username);
        if (user == null) {
            return null;
        }

        return user;
    }

    @Override
    public String getCurrentUsername() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            return null;
        }
        if (authentication.getPrincipal() instanceof String) {
            String principal = (String) authentication.getPrincipal();
            if (principal.compareTo("anonymousUser") != 0) {
                return null;
            }
            return principal;
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }


    @Override
    public List<User> searchUsers(String [] names) {
        if (names.length == 1) {
            return userRepo.findByUserNameLike(names[0]+"%");
        }
        return userRepo.findByNames(names[0], names[1]);
    }


}