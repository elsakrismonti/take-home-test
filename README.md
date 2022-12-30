# take-home-test
Is a take home test that I took for the first step of PT. Dans Multi Pro's backend developer (Node.js) position on December 30th 2020.
I'm using MySQL RDBMS using sequelize and I'm storing the data to service-users database that has a user table. 
1. First I added two dummy data to the user table, 
2. using http://localhost:3012/login and body { username, password }, to login and validate the username and password (bycrypt), and return the jwt token.
3. using example: http://localhost:3012/jobs?&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbHNha3Jpc21vbnRpIiwiaWF0IjoxNjcyMzg1NTE5LCJleHAiOjE2NzI0NzE5MTl9.fzfKLR3FQLU2LsXro5_zOPAVLKauP5_y4l9eqWKJUvY
  to get the list of the jobs with jwttoken
4. using example: http://localhost:3012/jobs/32bf67e5-4971-47ce-985c-44b6b3860cdb?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbHNha3Jpc21vbnRpIiwiaWF0IjoxNjcyMzg1NTE5LCJleHAiOjE2NzI0NzE5MTl9.fzfKLR3FQLU2LsXro5_zOPAVLKauP5_y4l9eqWKJUvY
to get a job by id.
