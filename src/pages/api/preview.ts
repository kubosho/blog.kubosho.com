import { NextApiRequest, NextApiResponse } from 'next';

import { getApiResponse } from '../../microcms_api/api_response';
import { BlogApiSchema } from '../../microcms_api/api_schema';
import { getRequestOptions } from '../../microcms_api/request_options';

type EntryResponse = {
  id: Pick<BlogApiSchema, 'id'>;
};

async function preview(req: NextApiRequest, res: NextApiResponse): Promise<unknown> {
  const { draftKey, id } = req.query;

  if (!id) {
    return res.status(404).end();
  }

  const draftKeyQuery = draftKey !== undefined ? `draftKey=${draftKey}` : '';

  const path = `https://${process.env.X_MICROCMS_HOST_NAME}/${process.env.X_MICROCMS_API_PATH}/${id}?fields=id&${draftKeyQuery}`;
  const options = getRequestOptions({ path });

  try {
    const apiResponse = await getApiResponse<EntryResponse>(options);

    res.setPreviewData({
      id: apiResponse.id,
      draftKey: req.query.draftKey,
    });
    res.writeHead(307, { Location: `/draft/${id}` });
    res.end('Preview mode enabled');
  } catch (err) {
    res.status(401).json({ message: 'Invalid id' });
  }
}

export default preview;
