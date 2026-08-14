package lms.lms;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import lms.lms.members.repository.MemberRepository;
import lms.lms.members.entity.Role;

@SpringBootApplication
public class LmsApplication {

    @Bean
    CommandLineRunner makeAdmin(MemberRepository memberRepository) {
        return args -> {
            memberRepository.findByEmail("mawufantasy@gmail.com").ifPresent(member -> {
				member.setRole(Role.ADMIN);
                memberRepository.save(member);
            });
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
    }
}
