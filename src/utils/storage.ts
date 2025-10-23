import type {StorageEnum} from '#/enum';

export const getItem = <T>(key: StorageEnum): T | null => {
  let value = null;
  try {
    const result = window.localStorage.getItem(key);
    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }
  return value;
};

export const getStringItem = (key: StorageEnum) => localStorage.getItem(key);

export const setItem = (key: StorageEnum, value: string) =>
  localStorage.setItem(key, value);

export const removeItem = (key: StorageEnum) => localStorage.removeItem(key);

export const clearItems = () => localStorage.clear();
