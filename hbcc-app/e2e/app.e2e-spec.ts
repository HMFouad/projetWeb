
import { browser, by, element } from 'protractor';
const Serveur = require('../server/server');

describe('Hbcc App', () => {


  it('Should find inscription title', () => {
         browser.get('http://localhost:8080/');
          expect(browser.driver.findElement(by.css('InscriptionTitle')).getText()).toEqual("S'inscrire");
  });

});
