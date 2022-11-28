import { request, RequestOptions } from 'https';

export function getApiResponse<JsonType>(options: RequestOptions): Promise<JsonType> {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      if (res.statusCode >= 500) {
        throw new Error(`Status Code: ${res.statusCode}`);
      }

      if (res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const responseBuffer = [];

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
