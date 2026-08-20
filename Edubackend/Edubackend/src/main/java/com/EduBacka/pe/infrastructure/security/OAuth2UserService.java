package com.EduBacka.pe.infrastructure.security;

import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import com.EduBacka.pe.domain.enumerate.UserRole;
import com.EduBacka.pe.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getAttribute("sub");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (user.getAuthProvider() != AuthProvider.GOOGLE) {
                user.setAuthProvider(AuthProvider.GOOGLE);
                user.setGoogleId(googleId);
            }
            if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
                user.setAvatarUrl(picture);
            }
            userRepository.save(user);
        } else {
            user = User.builder()
                    .email(email)
                    .fullName(name)
                    .avatarUrl(picture)
                    .avatarInitials(name != null && name.length() > 1 ? name.substring(0, 2).toUpperCase() : "U")
                    .authProvider(AuthProvider.GOOGLE)
                    .googleId(googleId)
                    .role(UserRole.USER)
                    .active(true)
                    .build();
            userRepository.save(user);
        }

        return new CustomOAuth2User(oAuth2User, user);
    }
}
