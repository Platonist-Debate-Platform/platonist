/* jshint esversion: 6 */
/* jshint node: true */

const fs = require('fs');
const glob = require('glob');
const parser = require('typescript-react-intl').default;
const path = require('path');
const _assign = require('lodash').assign;
const _has = require('lodash').has;
const _indexOf = require('lodash').indexOf;

const availableLanguages = ['en', 'de'];

const globPromise = (pattern = 'src/**/*.@(tsx|ts)') =>
  new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

globPromise()
  .then((files) => {
    // Get all files that includes 'react-intl' strings
    let results = [];
    files.forEach((file) => {
      const contents = fs.readFileSync(file).toString();
      const res = parser(contents);
      results = results.concat(res);
    });
    return results;
  })
  .then((results) => {
    // Get all default messages
    const locale = {};
    results.forEach((result) => (locale[result.id] = result.defaultMessage));
    return locale;
  })
  .then((locales) =>
    Promise.all([
      // Write all default messages to the default message file
      locales,
      fs.writeFileSync(
        path.resolve(
          process.cwd(),
          'src',
          'Assets',
          'I18n',
          'default.messages.json',
        ),
        JSON.stringify(locales, null, 2),
      ),
    ]),
  )
  .then((all) => {
    // Get already existing translations
    const locales = all[0];
    const translations = [];
    availableLanguages.map((lang) =>
      translations.push(
        fs.readFileSync(
          path.resolve(
            process.cwd(),
            'src',
            'Assets',
            'I18n',
            `${lang}.messages.json`,
          ),
          'utf-8',
        ),
      ),
    );
    return Promise.all([locales, translations]);
  })
  .then((all) => [all[0], all[1].map((file) => JSON.parse(file, null, 2))])
  .then((data) => {
    // Compare translations and add new keys.
    const locales = data[0];
    const translations = data[1] || [];
    Object.keys(locales).map((key) => {
      const locale = locales[key];
      translations.map((translation) => {
        if (!translation[key]) {
          translation[key] = locale;
        }
      });
    });
    // Remove not existing translations
    translations.map((translation) => {
      const keys = Object.keys(translation);
      keys.map((key) => {
        if (!_has(locales, key)) {
          delete translation[key];
        }
      });
    });
    return Promise.all([locales, translations]);
  })
  .then((data) => {
    const locales = { defaults: data[0] };
    const translations = data[1];
    const writeTranslations = [];
    translations.map((trans, index) => {
      writeTranslations.push(
        fs.writeFileSync(
          path.resolve(
            process.cwd(),
            'src',
            'Assets',
            'I18n',
            `${availableLanguages[index]}.messages.json`,
          ),
          JSON.stringify(trans, null, 2),
        ),
      );
      _assign(locales, { [availableLanguages[index]]: trans });
    });
    const writeTSTranslations = fs.writeFileSync(
      path.resolve(process.cwd(), 'src', 'Assets', 'I18n', 'messages.ts'),
      `/* tslint:disable:quotemark */\n\n` +
        `/* tslint:disable:max-line-length */\n\n` +
        `// DO NOT EDIT OR CHANGE THIS FILE!!\n\n` +
        `import { AvailableTranslations } from '@platonist/library';\n\n` +
        `const translations: AvailableTranslations = ${JSON.stringify(
          locales,
          null,
          2,
        )};\n\n` +
        `export default translations;`,
    );
    return Promise.all([writeTranslations, writeTSTranslations]);
  })
  .then(() => console.log('Done translations.'))
  .catch((err) => console.log(err));
