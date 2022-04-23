// import puppeteer from 'puppeteer';
// import {  } from 'platonist-library/build/Utils';
import { publicUrl } from 'platonist-library/build/Config/DefaultConfig';
import { Page } from 'platonist-library/build/Models';
import { request } from './library';
import { getHomepages, getCurrentHomepage } from './services';
import { createSiteMap } from './siteMap';

export const scraper = async () => {
  const homepages = await getHomepages();

  const location: Partial<Location> = {
    hostname: 'localhost',
  };

  const homepage =
    homepages && homepages.length && getCurrentHomepage(location, homepages);

  if (homepage) {
    const pages = await request<Page[]>('pages', {
      'homepage.id': homepage.id,
    });

    const homepageUrl = publicUrl();
    if (location.hostname !== 'localhost') {
      homepageUrl.host = homepage.url;
    }

    const siteMap = await createSiteMap(pages, undefined, [
      {
        loc: homepageUrl.href,
        lastMod: new Date(homepage.updated_at),
      },
    ]);
    console.log(siteMap);
  }

  // const browser = await puppeteer.launch();

  // const page = await browser.newPage();

  // await page.goto('https://treuhandtechno.de/', {
  //   waitUntil: 'networkidle2',
  // });

  // console.log(await page.content());

  // let pageContent;
  // try {
  //   pageContent = await page.waitForSelector('#page')
  // } catch (error) {
  //   throw error;
  // }
  // console.dir(pageContent);

  // const element = await page.$('#page');
  // if (element) {
  //   console.dir(element);

  //   const value = await element.evaluate(el => {
  //     console.dir(el);
  //     return el;
  //   });
  //   console.dir(value);
  // }

  // console.log(await page.content());
  // browser.close();
};

scraper();
