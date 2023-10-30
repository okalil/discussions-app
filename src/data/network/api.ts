import { Requester } from './requester';

export const url = process.env.EXPO_PUBLIC_API_URL ?? '';

export const api = Requester.create({
  baseUrl: url,
  async onError(response) {
    const body = await response.text();
    const json = safeParseJson(body);
    const message = json?.errors?.[0]?.message ?? body;
    throw new Error(message);
  },
});

function safeParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
