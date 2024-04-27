import { UserDto } from '../user/user.dto';

export interface CommentDto {
  id: string;
  content: string;
  votes: number;
  voted: boolean;
  user: UserDto;
}

export const CommentSchema = {
  parse(json: any): CommentDto {
    return {
      id: json.id ?? '',
      content: json.content ?? '',
      votes: json.votes_count ?? 0,
      voted: json.user_voted ?? false,
      user: json.user,
    };
  },
};
