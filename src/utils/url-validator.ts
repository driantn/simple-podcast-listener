import isUrl from 'validator/lib/isURL';

const isValidUrl = (string: string) => {
  return isUrl(string);
};

export default isValidUrl;
