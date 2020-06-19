import { IncomingMessage, ServerResponse } from 'http';
import { getEntryList } from '../../../entry/entryDelivery';

export default (_res: IncomingMessage, res: ServerResponse): void => {
  const entries = getEntryList();

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(entries));
};
