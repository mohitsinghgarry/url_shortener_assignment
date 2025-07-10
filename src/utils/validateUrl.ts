import  validUrl  from 'valid-url';

export const validateUrl = (url: string): boolean => {
  return validUrl.isUri(url) ? true : false;
};