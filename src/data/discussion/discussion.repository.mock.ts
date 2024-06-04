import { faker } from '@faker-js/faker';
import * as Factory from 'factory.ts';

import { getUserRepository } from '../user/user.repository';
import { type CreateDiscussionDto } from './create-discussion.dto';
import { type DiscussionDto } from './discussion.dto';
import { type UpdateDiscussionDto } from './update-discussion.dto';

export function getDiscussionRepository() {
  return new DiscussionRepository();
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

const factory = Factory.Sync.makeFactory<DiscussionDto>({
  id: Factory.each(() => faker.string.uuid()),
  title: Factory.each(() => faker.lorem.sentences(1)),
  comments: Factory.each(() => faker.number.int()),
  description: Factory.each(() => faker.lorem.words(200)),
  user: Factory.each(() => faker.helpers.arrayElement([{ id: '1', name: 'John' }, { id: faker.string.uuid(), name: faker.person.fullName(), picture: { url: faker.image.avatar()} }])),
  voted: Factory.each(() => faker.datatype.boolean()),
  votes: Factory.each(() => faker.number.int({ max: 100 })),
});
const discussions = factory.buildList(32);

export class DiscussionRepository {
  async getDiscussions({ page }: { page: number }) {
    await delay(500);
    const limit = 15;
    const stop = page * limit;
    const next = stop > discussions.length ? null : page + 1;
    return {
      data: discussions.slice(stop - limit, stop),
      next,
    };
  }

  async getDiscussion(id: string): Promise<DiscussionDto> {
    const discussion = discussions.find(it => it.id === id);
    if (!discussion) throw new Error();
    return discussion;
  }

  async upvoteDiscussion(id: string) {
    const discussion = await this.getDiscussion(id);
    discussion.voted = true;
    discussion.votes++;
  }

  async downvoteDiscussion(id: string) {
    const discussion = await this.getDiscussion(id);
    discussion.voted = false;
    discussion.votes--;
  }

  async createDiscussion(dto: CreateDiscussionDto): Promise<string> {
    await delay(500);
    const user = await getUserRepository().getUser();
    if (!user) throw new Error();
    const discussion = factory.build({ user, ...dto });
    discussions.push(discussion)
    return discussion.id;
  }

  async updateDiscussion(id: string, dto: UpdateDiscussionDto) {
    const discussion = await this.getDiscussion(id);
    Object.assign(discussion, dto);
  }

  sendDiscussionSubscribe(discussionId: string) { }
  sendDiscussionUnsubscribe(discussionId: string) { }
  listenDiscussionUpdate(listener: (id: string) => void) {
    return () => { };
  }
}
