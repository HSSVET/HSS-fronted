package com.vetverse.hss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HssBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HssBackendApplication.class, args);
	}

}
