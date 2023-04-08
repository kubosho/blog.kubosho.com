import { request, RequestOptions } from 'https';

export function getApiResponse<JsonType>(options: RequestOptions): Promise<JsonType> {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      const statusCode = res.statusCode ?? 999;

      if (statusCode && statusCode >= 500) {
        throw new Error(`Status Code: ${res.statusCode}`);
      } else if (statusCode && statusCode >= 400) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const responseBuffer: Uint8Array[] = [];

      res.on('data', (d) => {
        responseBuffer.push(d);
      });

      res.on('end', () => {
        const resString = Buffer.concat(responseBuffer).toString();
        resolve(JSON.parse(resString));
      });
    });

    req.end();
  });
}
