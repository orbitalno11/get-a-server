package com.devgeta.auth.service;

import com.devgeta.auth.persistence.UserAuthDao;
import com.devgeta.core.model.UserAuth;
import com.devgeta.core.model.UserAuthority;
import com.devgeta.core.model.dto.CustomGrantedAuthority;
import com.devgeta.core.model.dto.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class UserAuthDetailServiceImpl implements UserDetailsService {
    @Autowired
    private UserAuthDao userAuthDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAuth user = userAuthDao.findByUsername(username);
        if (user != null) {
            CustomUserDetails customUserDetails = new CustomUserDetails();
            customUserDetails.setUserName(user.getUserName());
            customUserDetails.setPassword(user.getPassword());
            Set<GrantedAuthority> authorities = new HashSet<>();
            for (UserAuthority authority : user.getUserAuthorities()) {
                authorities.add(new CustomGrantedAuthority(authority.getAuthority().getName()));
            }
            customUserDetails.setGrantedAuthorities(authorities);
            return customUserDetails;
        }
        throw new UsernameNotFoundException(username);
    }
}
