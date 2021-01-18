package com.geta.auth.service;

import com.geta.core.oauth.model.UserAuth;
import com.geta.core.oauth.model.UserAuthority;
import com.geta.core.oauth.model.dto.CustomGrantedAuthority;
import com.geta.core.oauth.model.dto.CustomUserDetails;
import com.geta.data.auth.persistence.AuthenticationDao;
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
    private AuthenticationDao authenticationDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAuth user = authenticationDao.findByUsername(username);
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
