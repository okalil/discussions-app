import { Requester } from './requester';

export const url = 'https://discussions-api.onrender.com';

export const api = Requester.create({
  baseUrl: url,
  async onError(response) {
    const body = await response.text();
    const json = safeParseJson(body);
    throw new Error(json ? json.message : body);
  },
});

function safeParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
