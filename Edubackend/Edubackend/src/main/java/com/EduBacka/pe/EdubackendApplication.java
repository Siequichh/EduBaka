package com.EduBacka.pe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class EdubackendApplication {

	public static void main(String[] args) {
		// ponytail: single hardcoded zone — app is Peru-only; switch to per-user tz if it ever goes multi-region.
		TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
		SpringApplication.run(EdubackendApplication.class, args);
	}

}
