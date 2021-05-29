/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { app } = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const should = chai.should();

describe("POST /auth/signup", () => {
  it("should get the user", (done) => {
    var text = {
      //required detail for user
      name: "vivek123",
      email: "vivekraj776@outlook.com",
      password: "vivek123",
    };
    chai
      .request(app) //calling localhost for server
      .post("/auth/signup")
      .send(text)
      .end((error, response) => {
        response.should.have.status(200);
        console.log(response.body.should.have.property("name")); //checking for the user is inputing the correct value
        done();
      });
  });
});

describe("POST /auth/login", () => {
  it("it should return user present", (done) => {
    var text = {
      email: "vivekraj776@outlook.com",
      password: "abhi123",
    };
    chai
      .request(app)
      .post("/auth/login")
      .send(text)
      .end((error, response) => {
        console.log("I am here ===>");
        response.should.have.status(200);
        done();
      });
  });
});

describe("DELETE /auth/logout", () => {
  it("it should return user present", (done) => {
    var user = "vivek";
    var token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmJkZTk1NmJkNjZjMjEzNzg0NzZmNTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM5MTcyNjk1fQ.RcyrXd24po58Bmyu5DS9eP9-3nT-avFLb9UVCnVfmRY";
    chai
      .request(app)
      .delete("/auth/logout")
      .set(
        "x-auth",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmJkZTk1NmJkNjZjMjEzNzg0NzZmNTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM5MTcyNjk1fQ.RcyrXd24po58Bmyu5DS9eP9-3nT-avFLb9UVCnVfmRY"
      )
      .auth(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmJkZTk1NmJkNjZjMjEzNzg0NzZmNTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM5MTcyNjk1fQ.RcyrXd24po58Bmyu5DS9eP9-3nT-avFLb9UVCnVfmRY"
      )
      .send(user, token)
      .end((error, response) => {
        console.log("I am here in logout ===>");
        response.should.have.status(200);
        done();
      });
  });
});
