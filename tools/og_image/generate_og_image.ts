// eslint-disable-next-line import/no-extraneous-dependencies
import fm from 'front-matter';
import fs from 'fs/promises';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { chromium } from 'playwright';
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from 'sharp';

import { retrieveTranslation } from '../../src/features/locales/i18n';

interface Params {
  pageTitle: string;
  siteTitle: string;
}

function addBr(text: string): string {
  const t = text;
  return t.replace(/、/g, '$&<br />');
}

const blogTitle = retrieveTranslation('website.title');

export async function generateOgImage({ pageTitle, siteTitle }: Params): Promise<Buffer> {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const page = await context.newPage();
  await page.setViewportSize({
    width: 1200,
    height: 630,
  });

  const [baseHtml, baseImage] = await Promise.all([
    fs.readFile(path.resolve(__dirname, './templates/og_image.html'), 'utf-8'),
    await fs.readFile(path.resolve(__dirname, './templates/og_image.png'), 'base64'),
  ]);

  const html = baseHtml
    .replace('{{pageTitle}}', pageTitle)
    .replace('{{siteTitle}}', siteTitle)
    .replace('{{image}}', `data:image/png;base64,${baseImage}`);

  await page.setContent(html, { waitUntil: 'load' });

  return page.screenshot().finally(async () => {
    await browser.close();
  });
}

async function main(): Promise<void> {
  const entriesPath = path.resolve(__dirname, '../../../client/src/content/entries');
  const entriesDirents = await fs.readdir(entriesPath, { withFileTypes: true });

  const ogImagesPath = path.resolve(__dirname, '../../public/assets/images/og');
  await fs.rm(ogImagesPath, { recursive: true }).catch(() => {});
  await fs.mkdir(ogImagesPath, { recursive: true }).catch(() => {});
  await fs.readdir(ogImagesPath, { withFileTypes: true }).catch(() => {});

  await Promise.all(
    entriesDirents.map(async ({ name: fileName }) => {
      const filepath = path.join(entriesPath, fileName);
      const slug = path.parse(fileName).name;

      const contents = await fs.readFile(filepath, 'utf-8');
      const { attributes } = fm<{ title: string }>(contents);

      const buffer = await generateOgImage({ pageTitle: attributes.title, siteTitle: addBr(blogTitle) });
      await sharp(buffer)
        .png({ colors: 64, compressionLevel: 9 })
        .toFile(path.resolve(ogImagesPath, `${slug}.png`));
    }),
  );
}

main();
