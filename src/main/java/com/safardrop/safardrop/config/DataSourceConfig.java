package com.safardrop.safardrop.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);
    private static final String H2_FALLBACK_URL = "jdbc:h2:file:./.renderdb/safardrop;MODE=MySQL;AUTO_SERVER=TRUE";

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        String url = trimToNull(environment.getProperty("spring.datasource.url"));
        String username = environment.getProperty("spring.datasource.username", "sa");
        String password = environment.getProperty("spring.datasource.password", "");

        if (url == null) {
            log.warn("SPRING_DATASOURCE_URL is not set. Using H2 fallback.");
            return createH2DataSource();
        }

        if (isLocalhostMySql(url)) {
            log.warn("SPRING_DATASOURCE_URL points to localhost in a deployed environment. Using H2 fallback.");
            return createH2DataSource();
        }

        if (isMySql(url)) {
            HikariDataSource mysqlDataSource = createMySqlDataSource(url, username, password);
            if (canConnect(mysqlDataSource)) {
                return mysqlDataSource;
            }
            mysqlDataSource.close();
            log.warn("MySQL connection test failed. Using H2 fallback.");
            return createH2DataSource();
        }

        HikariDataSource genericDataSource = new HikariDataSource();
        genericDataSource.setJdbcUrl(url);
        genericDataSource.setUsername(username);
        genericDataSource.setPassword(password);
        return genericDataSource;
    }

    private HikariDataSource createMySqlDataSource(String url, String username, String password) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setConnectionTimeout(5000);
        dataSource.setValidationTimeout(3000);
        dataSource.setInitializationFailTimeout(1);
        return dataSource;
    }

    private HikariDataSource createH2DataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.h2.Driver");
        dataSource.setJdbcUrl(H2_FALLBACK_URL);
        dataSource.setUsername("sa");
        dataSource.setPassword("");
        dataSource.setConnectionTimeout(5000);
        dataSource.setValidationTimeout(3000);
        dataSource.setInitializationFailTimeout(1);
        return dataSource;
    }

    private boolean canConnect(HikariDataSource dataSource) {
        try (Connection ignored = dataSource.getConnection()) {
            return true;
        } catch (Exception ex) {
            log.warn("Datasource connectivity check failed: {}", ex.getMessage());
            return false;
        }
    }

    private boolean isMySql(String url) {
        return url.toLowerCase().startsWith("jdbc:mysql:");
    }

    private boolean isLocalhostMySql(String url) {
        String normalized = url.toLowerCase();
        return normalized.startsWith("jdbc:mysql://localhost")
                || normalized.startsWith("jdbc:mysql://127.0.0.1");
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
