import localforage from 'localforage';

const name = 'local-rss-feed';

const localDB = (storeName: string) => {
  return localforage.createInstance({ name, storeName });
};

export default localDB;
