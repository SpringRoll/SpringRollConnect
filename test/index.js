import { Selenium, logout } from './helpers';
before(async () => await Selenium.init());
afterEach(async () => await logout());
after(() => Selenium.Browser.quit());

import './api';
import './pages';
