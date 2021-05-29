/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { app } = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const should = chai.should();

describe("GET /weathers/report", () => {
  it("should get the weather", (done) => {
    let location = "delhi";
    chai
      .request(app) //calling localhost for server
      .get("/weathers/report")
      .query({ location: location })
      .end((error, response) => {
        response.should.have.status(200);
        console.log(response.body.should.have.property("count")); //checking for the user is inputing the correct value
        done();
      });
  });
});
