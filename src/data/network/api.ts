import Constants from 'expo-constants';

import { Requester } from './requester';

export const api = Requester.create({
  baseUrl: Constants.expoConfig?.extra?.apiUrl ?? 'https://discussions-api.onrender.com',
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
