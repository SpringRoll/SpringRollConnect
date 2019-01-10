const mongoose = require("mongoose");
const selenium = require("./helpers/selenium");
const expect = require("chai").expect;

describe("authentication", () => {
  it("should be able to log a user in", done => {
    const user = mongoose.model("User").createUser(
      {
        name: "Spring Roll",
        username: "testuser",
        password: "secret",
        email: "email@springroll.io"
      },
      2,
      function() {
        // attempt to login from the home page
        selenium.browser
          .get("http://localhost:3000")

          // set the username field
          .then(() => {
            return selenium.browser.findElement({ name: "username" });
          })
          .then(element => element.sendKeys("testuser"))

          // set the password field
          .then(() => {
            return selenium.browser.findElement({ name: "password" });
          })
          .then(element => element.sendKeys("secret"))

          // submit the form
          .then(() => {
            return selenium.browser.findElement({ tagName: "form" });
          })
          .then(element => element.submit())

          // now check that we're on the correct page by looking for a logout link
          .then(() => {
            return selenium.browser.findElements(
              selenium.By.css('a[href="/logout"]')
            );
          })
          .then(result => {
            expect(result.length).to.equal(1);
            done();
          })
          .catch(error => done(error));
      }
    );
  });
});
