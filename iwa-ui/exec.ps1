docker build -t auth0-angular-sample .
docker run --init -p 4200:4200 -p 3000:3000 -it auth0-angular-sample