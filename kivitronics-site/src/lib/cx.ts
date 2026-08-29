/** Minimal class-name joiner. Keeps JSX readable without a dependency. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
