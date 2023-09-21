package com.zimnat.tablet.aop;

import com.zimnat.tablet.business.domain.AuditTrail;
import com.zimnat.tablet.business.services.AuditTrailService;
import com.zimnat.tablet.business.services.UserService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.replica.emaze.aop
 */


@Aspect
@Component
public class LoggerAspect {

    @Autowired
    UserService userService;

    @Autowired
    AuditTrailService auditTrailService;

    @Around("@annotation(com.zimnat.tablet.aop.annotation.Auditor)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        Object proceed = joinPoint.proceed();

        long end=System.currentTimeMillis();
        var actionName=joinPoint.getSignature().getName();
        var action=actionName.startsWith("get")?"GET":actionName.startsWith("create")?"POST":actionName.startsWith("update")?"PUT":"OTHER";
        AuditTrail trail= new AuditTrail(userService.getCurrentUsername(),new Date(start), new Date(end),joinPoint.getSignature().toString(),actionName,action );
        auditTrailService.save(trail, userService.getCurrentUser());
        return proceed;
    }
}
