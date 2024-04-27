import { UserDto } from '../user/user.dto';

export interface DiscussionDto {
  id: string;
  title: string;
  description: string;
  votes: number;
  comments: number;
  voted: boolean;
  user: UserDto;
}

interface DiscussionJsonDto {
  id: string;
  title: string;
  description: string;
  votes_count: number;
  comments_count: number;
  user_voted: boolean;
  user: UserDto;
}

export const DiscussionSchema = {
  parse(json: DiscussionJsonDto): DiscussionDto {
    return {
      id: json.id ?? '',
      title: json.title ?? '',
      description: json.description ?? '',
      votes: json.votes_count ?? 0,
      comments: json.comments_count ?? 0,
      voted: json.user_voted ?? false,
      user: json.user,
    };
  },
};
