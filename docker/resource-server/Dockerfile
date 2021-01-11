FROM openjdk:8-jre-alpine
EXPOSE 8091
WORKDIR /app
COPY ./resource/target/resource-0.0.1-SNAPSHOT.jar .
ENTRYPOINT ["java", "-jar", "resource-0.0.1-SNAPSHOT.jar"]