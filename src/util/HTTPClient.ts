import { default as axios, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HTTPError extends Error {
  constructor(public response: AxiosResponse) {
    super(`Request failed with status code ${response.status}.`);
  }
}
export class ClientError extends HTTPError {}

export class BadRequest extends ClientError {}
export class Unauthorized extends ClientError {}
export class Forbidden extends ClientError {}
export class NotFound extends ClientError {}
export class TooManyRequests extends ClientError {}

export class ServerError extends HTTPError {}

export class InternalServerError extends ServerError {}

export class HTTPClient {
  public async axios(opts: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      try {
        const response = await axios(opts);
        const error = this.generateError(response);

        if (!error) {
          resolve(response)
        } else {
          throw error
        }
      } catch (err) {
        reject(err)
      }
    });
  }

  private generateError(response: AxiosResponse): HTTPError | void {
    const { status } = response;
    if (!status) {
      throw new Error('Failed with no status code');
    }
    if (status < 200 || status >= 300) {
      switch (status) {
        case 400:
          return new BadRequest(response);
        case 401:
          return new Unauthorized(response);
        case 403:
          return new Forbidden(response);
        case 404:
          return new NotFound(response);
        case 429:
          return new TooManyRequests(response);
        case 500:
          return new InternalServerError(response);
        default:
          if (status > 500) {
            return new ServerError(response);
          }
          if (status > 400) {
            return new ClientError(response);
          }
      }
    }
    return undefined;
  }
}
