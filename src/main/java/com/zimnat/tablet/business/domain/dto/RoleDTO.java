package com.zimnat.tablet.business.domain.dto;

import lombok.*;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    String name;
    List<String> privileges;
}
