package com.blog.fit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.blog.fit", "com.blog.services"})
public class FitApplication {

	public static void main(String[] args) {
		SpringApplication.run(FitApplication.class, args);
	}
}
