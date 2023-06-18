import { filter } from 'rxjs/operators';

function isPresent<T>(value?: T | null): value is T {
  return value !== null && value !== undefined;
}

function isNullish<T>(value?: T | null): value is null | undefined {
  return value == null || value === undefined;
}

export const filterOnlyPresent = () => filter(isPresent);
export const filterOnlyNullish = () => filter(isNullish);

export function filterOnlyPropertyPresent<T>(prop: keyof T) {
  return filter<T>((value) => isPresent<any>(value[prop]));
}
