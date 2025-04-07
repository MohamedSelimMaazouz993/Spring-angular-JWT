package com.taskflow.service;

import com.taskflow.dto.AuthRequest;
import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.UserDto;
import com.taskflow.model.User;

public interface AuthService {
    AuthResponse authenticateUser(AuthRequest loginRequest);
    User registerUser(UserDto userDto);
}