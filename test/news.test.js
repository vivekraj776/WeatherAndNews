/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { app } = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const should = chai.should();

describe("GET /news/headlines", () => {
  it("should get the news", (done) => {
    let search = "bitcoin";
    chai
      .request(app) //calling localhost for server
      .get("/news/headlines")
      .query({ search: search })
      .set(
        "x-auth",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDcxY2VmM2U2NDg2MjMxZDliY2YyOTAiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNjE4MDcxMjgzfQ.wSEUHB3zWGtUDYBQsdsFjzG3lAwVS-ViI9l9eQVMu8o"
      )
      .end((error, response) => {
        response.should.have.status(200);
        console.log(response.body.should.have.property("count")); //checking for the user is inputing the correct value
        done();
      });
  });
});
