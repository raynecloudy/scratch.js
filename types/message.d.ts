import { Account } from "./account";
import { Project } from "./project";
import { Studio } from "./studio";

export type CommentLocation = "project" | "studios" | "users";

export interface Message {
  readonly actor: {
    readonly id: number;
    readonly username: string;

    fetch(): Promise<Account>;
  };
  readonly id: number;
  readonly timestamp: string;

  isFollowMessage(): this is FollowMessage;
  isLoveMessage(): this is LoveMessage;
  isFavoriteMessage(): this is FavoriteMessage;
  isRemixMessage(): this is RemixMessage;
  isCommentMessage(): this is CommentMessage;
  isCuratorInviteMessage(): this is CuratorInviteMessage;
  isBecomeStudioOwnerMessage(): this is BecomeStudioOwnerMessage;
  isStudioActivityMessage(): this is StudioActivityMessage;
  isForumTopicActivityMessage(): this is ForumTopicActivityMessage;
  isWelcomeMessage(): this is WelcomeMessage;
}

export interface FollowMessage extends Message {}

export interface LoveOrFavoriteMessage extends Message {
  readonly project: {
    readonly id: number;

    fetch(): Promise<Project>;
  };
}

export interface LoveMessage extends LoveOrFavoriteMessage {}

export interface FavoriteMessage extends LoveOrFavoriteMessage {}

export interface RemixMessage extends Message {
  readonly originalProject: {
    readonly id: number;
    readonly title: string;

    fetch(): Promise<Project>;
  };
  readonly remixProject: {
    readonly id: number;
    readonly title: string;

    fetch(): Promise<Project>;
  };
}

export interface CommentMessage extends Message {
  readonly comment: {
    readonly content: string;
    readonly id: number;
    readonly location: {
      readonly id: number;
      readonly type: CommentLocation;

      fetch(): Promise<typeof this.comment.location.type extends "project" ? Project : typeof this.location.type extends "studiis" ? Studio : Account>;
    };
    readonly repliedTo: string | null;
  };
}

export interface StudioMessage extends Message {
  readonly studio: {
    readonly id: number;
    readonly title: string;

    fetch(): Promise<Studio>;
  };
}

export interface CuratorInviteMessage extends StudioMessage {}

export interface BecomeStudioOwnerMessage extends StudioMessage {}

export interface StudioActivityMessage extends StudioMessage {}

export interface ForumTopicActivityMessage extends Message {
  readonly topic: {
    readonly id: number;
    readonly title: string;
  };
}

export interface WelcomeMessage extends Message {}
