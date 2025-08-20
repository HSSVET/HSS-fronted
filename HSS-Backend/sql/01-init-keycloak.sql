-- Keycloak Database Initialization
-- Bu dosya PostgreSQL konteyner başladığında otomatik olarak çalışır

-- Keycloak veritabanını oluştur
CREATE DATABASE keycloak;

-- Keycloak kullanıcısını oluştur (isteğe bağlı)
-- CREATE USER keycloak WITH PASSWORD 'keycloak123';
-- GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

\echo 'Keycloak database initialized successfully'; 