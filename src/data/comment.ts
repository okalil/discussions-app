import { User } from './user';

interface IComment {
  id: string;
  content: string;
  votes: number;
  voted: boolean;
  user: User;
}

export class Comment implements IComment {
  id: string;
  content: string;
  votes: number;
  comments: number;
  voted: boolean;
  user: User;

  constructor(values: Partial<IComment>) {
    Object.assign(this, values);
  }

  static fromJson(json: Record<string, any>): Comment {
    return new Comment({
      id: json.id ?? '',
      content: json.content ?? '',
      votes: json.votes_count ?? 0,
      voted: json.user_voted ?? false,
      user: json.user,
    });
  }
}
