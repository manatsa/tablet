package com.zimnat.tablet.business.domain.enums;


import com.zimnat.tablet.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum RecurrPeriod {
    DAILY(1), WEEKLY(2), MONTHLY(3),QUARTERLY(4), YEARLY(5);

    private final Integer code;

    private RecurrPeriod(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static RecurrPeriod get(Integer code){
        switch(code){
            case 1:
                return DAILY;
            case 2:
                return WEEKLY;
            case 3:
                return MONTHLY;
            case 4:
                return QUARTERLY;
            case 5:
                return YEARLY;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}