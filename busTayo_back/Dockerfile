# ===== Build stage =====
FROM amazoncorretto:17.0.12 AS build

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar --no-daemon


# ===== Run stage =====
FROM amazoncorretto:17.0.12

WORKDIR /app

COPY --from=build /app/build/libs/*.jar /app/server.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod

CMD ["java", "-jar", "/app/server.jar"]