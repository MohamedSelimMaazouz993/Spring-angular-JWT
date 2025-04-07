package com.taskflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@Data
public class JwtConfig {
    
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration}")
    private int expiration;
    
    @Value("${app.jwt.header}")
    private String header;
    
    @Value("${app.jwt.prefix}")
    private String prefix;
}