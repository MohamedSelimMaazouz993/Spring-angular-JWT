package com.taskflow.service;

import com.taskflow.dto.UserDto;
import com.taskflow.model.User;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto getUserByUsername(String username);
    UserDto createUser(UserDto userDto);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    UserDto mapToDto(User user);
    User mapToEntity(UserDto userDto);
}