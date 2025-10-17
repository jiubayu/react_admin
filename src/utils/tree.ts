import { chain } from 'ramda';

export function flattenTrees<T extends {children?: any[]}>(trees: T[] = []):T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees)
}