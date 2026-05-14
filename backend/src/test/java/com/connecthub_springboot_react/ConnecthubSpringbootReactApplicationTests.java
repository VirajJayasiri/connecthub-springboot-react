package com.connecthub_springboot_react;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "aws.s3.enabled=false")
class ConnecthubSpringbootReactApplicationTests {

	@Test
	void contextLoads() {
	}

}
