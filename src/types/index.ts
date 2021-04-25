import { Output, Item } from 'rss-parser';

export type FeedItem = Output<any> & Item & { id: string };
export type FeedStatus = { currentTime: number; duration: number };
