const expect = require('chai').expect;
const selenium = require('./selenium');

describe('SpringRollConnect', () => {
  it('should have the correct title', () => {
    return selenium.browser.get('http://localhost:3000')
      .then(() => selenium.browser.getTitle())
      .then(title => {
        expect(title).to.equal('Login - SpringRoll Connect v1.6.4');
      });
  });
});
