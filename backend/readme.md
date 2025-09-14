## shodh-a-code backend


- This is a spring-boot app using java 17 and maven.


- The application serves as a backend for the shodh-a-code online code judge service.

- Although the backend is managed by an outer docker-compose file, in case one needs to start it manually run 
`./mvnw clean spring-boot:run` from the root dir, that is, this `/backend` dir or use your IDE's Maven triggers.


- Swagger documentation is available at http://localhost:8080/swagger-ui.html and OpenAPI specs at http://localhost:8080/v3/api-docs while spring is running.



## How it works:

- On startup: Spring Boot checks if the Docker image exists. If not, it builds it from a Dockerfile.
- For each submission:      
  - Creates a unique container name
  - Runs compilation in a container (auto-removed with --rm)
  - Runs the program in another container with resource limits
  - Cleans up any hanging containers
- On shutdown: Removes any leftover judge containers

## Testing

- Upon init the db is pre-populated with two problems in one contest (http://localhost:8080/api/contests/1) :
  - Hello World (expects the output "Hello World")
  - Add Two Numbers (expects the output to be two numbers)

- The judge accepts valid java code with AND without the Java boilerplate, so both the following kinds of submissions work.


```bash

# Option 1: Send just the statement
curl -X POST http://localhost:8080/api/submissions \              
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode 'code=java.util.Scanner sc = new java.util.Scanner(System.in); int a = sc.nextInt(); int b = sc.nextInt(); System.out.println(a + b);' \
  --data-urlencode 'language=JAVA' \
  --data-urlencode 'userId=1' \
  --data-urlencode 'problemId=2'

# Option 2: Send full class
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -data-urlencode 'code=public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }&language=JAVA&userId=1&problemId=1'
  --data-urlencode 'language=JAVA' \
  --data-urlencode 'userId=1' \
  --data-urlencode 'problemId=1'
 
  ```

  - The user has to only submit correct code, the test-cases are managed by the backend itself.
