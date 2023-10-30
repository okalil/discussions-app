interface IUser {
  id: string;
  name: string;
  picture?: { url: string };
}

export class User implements IUser {
  id: string;
  name: string;
  picture?: { url: string };

  constructor(values: Partial<IUser>) {
    Object.assign(this, values);
  }

  static fromJson(json: Record<string, any>): User {
    return new User({
      id: String(json.id) ?? '',
      name: json.name ?? '',
      picture: json.picture?.url ? json.picture : undefined,
    });
  }
}
