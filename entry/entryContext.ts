import { createContentfulClient } from './contentfulClient';
import { createEntryGateway } from './entryGateway';

const client = createContentfulClient(process.env.SPACE, process.env.ACCESS_TOKEN);

export const entryGateway = createEntryGateway(client);
