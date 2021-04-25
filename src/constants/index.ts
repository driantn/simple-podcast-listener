export const FEED_STATUS = 'feedStatus';
export const FEEDS = 'feeds';
export const FEED_CONTENT = 'feedContent';
export const UPDATE_INTERVAL =
  process.env.NODE_ENV === 'development' ? 5 * 1000 : 60 * 1000;
