import mockEntries from '../__mocks__/mock-entries.json';
import { getEntryList, getEntry } from '../entryDelivery';

jest.mock('../../../data/entries.json', () => mockEntries);

it('getEntryList', async () => {
  const actualValue = getEntryList().length;
  const expectValue = 2;

  expect(actualValue).toBe(expectValue);
});

it('getEntry', async () => {
  const actualValue = getEntry('content-of-article-can-not-think-of-anything-syndrome').title;
  const expectValue = '記事の内容が思いつかない症候群';

  expect(actualValue).toBe(expectValue);
});
