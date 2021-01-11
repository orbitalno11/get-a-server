FROM openjdk:8-jre-alpine
EXPOSE 8090
WORKDIR /app
COPY ./auth/target/auth-0.0.1-SNAPSHOT.jar .
ENTRYPOINT ["java", "-jar", "auth-0.0.1-SNAPSHOT.jar"]