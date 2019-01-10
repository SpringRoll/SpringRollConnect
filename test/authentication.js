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
      async function() {
        // attempt to login from the home page
        await selenium.browser.get("http://localhost:3000")

        // set the username field
        const usernameInput = await selenium.browser.findElement({ name: "username" });
        await usernameInput.sendKeys('testuser');

        // set the password field
        const passwordInput = await selenium.browser.findElement({ name: "password" });
        passwordInput.sendKeys("secret");

        // submit the form
        const form = await selenium.browser.findElement({ tagName: 'form' });
        await form.submit();

        // now check that we're on the correct page by looking for a logout link
        const links = await selenium.browser.findElements(
              selenium.By.css('a[href="/logout"]')
            );

        try {
          expect(links.length).to.equal(1);
          done();
        } catch(e) {
          done(e);
        }
      }
    );
  });
});
