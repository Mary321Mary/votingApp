/** Interpolate `{{key}}` placeholders from state/config spreadsheet copy. */
export function interpolateStateCopy(
  template: string,
  values: Record<string, string | number | undefined | null>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value == null ? "" : String(value);
  });
}

/** Turn plain newlines from YAML/spreadsheet copy into `<br/>` for Trans/HTML. */
export function newlinesToBr(template: string): string {
  return template.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");
}
