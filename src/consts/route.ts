export const ENTITY_PATH = '/src/pages';
export const PAGES = import.meta.glob(`${ENTITY_PATH}/**/*.tsx`, {
  eager: true,
});
