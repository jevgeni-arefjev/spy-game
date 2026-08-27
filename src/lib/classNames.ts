type ClassValue = string | false | null | undefined

/** Join CSS Module class names, dropping anything falsy. */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(' ')
}
