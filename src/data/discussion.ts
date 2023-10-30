import { User } from './user';

interface IDiscussion {
  id: string;
  title: string;
  description: string;
  votes: number;
  comments: number;
  voted: boolean;
  user: User;
}

export class Discussion implements IDiscussion {
  id: string;
  title: string;
  description: string;
  votes: number;
  comments: number;
  voted: boolean;
  user: User;

  constructor(values: Partial<IDiscussion>) {
    Object.assign(this, values);
  }

  static fromJson(json: Record<string, any>): Discussion {
    return new Discussion({
      id: json.id ?? '',
      title: json.title ?? '',
      description: json.description ?? '',
      votes: json.votes_count ?? 0,
      comments: json.comments_count ?? 0,
      voted: json.user_voted ?? false,
      user: json.user,
    });
  }
}
