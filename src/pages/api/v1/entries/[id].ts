import { IncomingMessage, ServerResponse } from 'http';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';
import { getEntry } from '../../../../entry/entryDelivery';

type Request = {
  query: {
    id: string;
  };
} & IncomingMessage;

export default ({ query }: Request, res: ServerResponse): void => {
  const entry = getEntry(query.id);

  res.setHeader('Content-Type', 'application/json');

  if (isUndefined(entry)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ status: 404, message: 'entry is not found.' }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify(entry));
};
