import { Output, Item } from 'rss-parser';

export type FeedItem = Output<any> & Item & { id: string };
