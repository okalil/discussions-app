import * as Factory from 'factory.ts';
import { getUserRepository } from '../user/user.repository.mock';
import type { CommentDto } from './comment.dto';
import type { SaveCommentDto } from './save-comment.dto';
import { faker } from '@faker-js/faker';

export function getCommentRepository(discussionId: string) {
  return new CommentRepository(discussionId);
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

const factory = Factory.Sync.makeFactory<CommentDto>({
  id: Factory.each(() => faker.string.uuid()),
  content: Factory.each(() => faker.lorem.lines({ min: 1, max: 4 })),
  user: { id: '1', name: 'john@mail.com' },
  voted: Factory.each(() => faker.datatype.boolean()),
  votes: Factory.each(() => faker.number.int({ max: 1000 })),
});
const comments = factory.buildList(2);

export class CommentRepository {
  private discussionId: string;
  constructor(discussionId: string) {
    this.discussionId = discussionId;
  }

  async getComments(): Promise<CommentDto[]> {
    await delay(500);
    return comments;
  }

  async getComment(commentId: string): Promise<CommentDto> {
    await delay(300);
    const comment = comments.find(it => it.id === commentId);
    if (!comment) throw new Error();
    return comment;
  }

  async upvoteComment(commentId: string) {
    const comment = await this.getComment(commentId);
    comment.voted = true;
    comment.votes++;
  }

  async downvoteComment(commentId: string) {
    const comment = await this.getComment(commentId);
    comment.voted = false;
    comment.votes--;
  }

  async createComment(dto: SaveCommentDto) {
    const user = await getUserRepository().getUser();
    if (!user) throw new Error();
    const comment = factory.build({ user, ...dto });
    comments.push(comment);
  }

  async updateComment(commentId: string, dto: SaveCommentDto) {
    const comment = await this.getComment(commentId);
    comment.content = dto.content;
  }

  async deleteComment(commentId: string) {
    Object.assign(
      comments,
      comments.filter(it => it.id !== commentId)
    );
  }

  listenCommentCreate(listener: () => void) {
    return () => {};
  }
  listenCommentUpdate(listener: () => void) {
    return () => {};
  }
  listenCommentDelete(listener: () => void) {
    return () => {};
  }
}
