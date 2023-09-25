package com.zimnat.tablet.business.repos;

import com.zimnat.tablet.business.domain.Role;
import com.zimnat.tablet.business.domain.User;
import com.zimnat.tablet.utils.Constants;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface UserRepo extends CrudRepository<User, String> {

    @Override
    public List<User> findAll();

    @Query("Select Distinct u from User u "+ Constants.USER_CONSTANT+" where u.id =:id")
    public User findUser(@Param("id") String id);

    @Query("Select Distinct u from User u "+ Constants.USER_CONSTANT+" where u.active=:active Order By u.userName ASC")
    public List<User> getAllActive(@Param("active") Boolean active);

    @Query("Select Distinct u from User u "+ Constants.USER_CONSTANT+" where u.userName=:userName")
    public User findByUserName(@Param("userName") String userName);

    @Query("Select Distinct u from User u "+ Constants.USER_CONSTANT+" where u.roles in:userRoles")
    public List<User> findByUserRoles(@Param("userRoles") Set<Role> userRoles);

    @Query("Select Distinct u from User u "+ Constants.USER_CONSTANT+" where (u.firstName LIKE :firstName% and u.lastName LIKE :lastName%) OR (u.firstName LIKE :lastName% and u.lastName LIKE :firstName%)")
    public List<User> findByNames(@Param("firstName") String firstName, @Param("lastName") String lastName);

    public List<User> findByUserNameLike(String username);
}