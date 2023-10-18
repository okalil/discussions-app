type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>;

type Options = {
  baseUrl?: string;
  onError?: (response: Response, request: Request) => any;
};

export class Requester {
  _options;
  constructor(options?: Options) {
    this._options = options;
  }
  static create(options?: Options) {
    return new Requester(options);
  }
  async _fetch(input: RequestInfo | URL, init?: RequestInit | undefined) {
    const baseUrl = this._options?.baseUrl ?? '';
    if (typeof input === 'string') input = baseUrl + input;

    const request = new Request(input, init);

    request.headers.set('Content-Type', 'application/json');

    // const token = storage.getString('token') ?? '';
    // if (token) request.headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(request);
    if (!response.ok) {
      await this._options?.onError?.(response, request);
    }
    return response;
  }
  get: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'GET' });
  post: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'POST' });
  put: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'PUT' });
  patch: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'PATCH' });
  delete: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'DELETE' });
}
