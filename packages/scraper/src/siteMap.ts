import { ContentKeys, Page } from 'platonist-library/build/Models';
import { getDebates } from './services';
import { publicUrl } from 'platonist-library/build/Config/DefaultConfig';

interface SiteMap {
  loc: string;
  lastMod: Date;
}

export const createSiteMap = async (
  pages: (Page | null)[],
  parentPath?: string,
  siteMap: SiteMap[] = [],
): Promise<SiteMap[]> => {
  if (!pages) {
    return siteMap;
  }

  const api = publicUrl();

  for (const page of pages) {
    if (!page || (page && !page.active)) {
      break;
    }

    const path = (parentPath || '') + `/${page.title}`;
    api.pathname = path;
    siteMap.push({
      loc: api.href,
      lastMod: new Date(page.updated_at),
    });

    if (page.content && page.content.length > 0) {
      for (const item of page.content) {
        if (item) {
          switch (item.__component) {
            case ContentKeys.DebateList:
              const debates = await getDebates();
              if (debates && debates.length > 0) {
                debates.forEach((debate) => {
                  api.pathname = `${path}/${debate.title}`;
                  siteMap.push({
                    loc: api.href,
                    lastMod: new Date(debate.updated_at),
                  });
                });
              }
              break;
            default:
              break;
          }
        }
      }
    }

    if (page.pages && page.pages.length > 0) {
      siteMap.push(...(await createSiteMap(page.pages, parentPath)));
    }
  }

  return siteMap;
};
