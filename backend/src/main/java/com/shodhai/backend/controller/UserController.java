package com.shodhai.backend.controller;

import com.shodhai.backend.model.User;
import com.shodhai.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> loginOrCreate(@RequestParam String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.findOrCreateUser(username.trim());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<User> getByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}