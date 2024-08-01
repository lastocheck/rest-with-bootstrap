package com.example.spring_boot_crud_mvc.service;

import com.example.spring_boot_crud_mvc.exceptions.RoleNotFoundException;
import com.example.spring_boot_crud_mvc.model.Role;
import com.example.spring_boot_crud_mvc.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional(noRollbackFor = RoleNotFoundException.class)
    public Role findByName(String name) {
        return roleRepository.findByName(name).orElseThrow(() ->new RoleNotFoundException("No role found with the name %s".formatted(name)));
    }

    @Override
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role findById(Integer id) {
        return roleRepository.findById(id).orElseThrow(() -> new RoleNotFoundException("couldn't find role with id " + id));
    }
}
