import { Nullable, isNotNull } from 'option-t/lib/Nullable/Nullable';
import { ContentfulClientApi, EntryCollection } from 'contentful';

import { mapEntryValueParameter, createEntryValue } from './entryResponseConverter';
import { ContentfulCustomEntryFields, EntryValue } from './entryValue';

export interface EntryGateway {
  fetchAllEntries(): Promise<Nullable<ReadonlyArray<EntryValue>>>;
}

class EntryGatewayImpl {
  private _client: ContentfulClientApi;

  constructor(client: ContentfulClientApi) {
    this._client = client;
  }

  async fetchAllEntries(): Promise<Nullable<ReadonlyArray<EntryValue>>> {
    let res: EntryCollection<ContentfulCustomEntryFields> = null;

    try {
      res = await this._client.getEntries();
    } catch (err) {
      // tslint:disable-next-line no-console
      console.error(err);
      return;
    }

    const entryValueParams = res.items.map(({ sys, fields }) => mapEntryValueParameter(sys, fields));
    const values = entryValueParams.map(createEntryValue).sort((e1, e2) => e2.createdAt - e1.createdAt);

    return values;
  }
}

export function createEntryGateway(client: ContentfulClientApi): EntryGateway {
  const g = new EntryGatewayImpl(client);
  return g;
}
