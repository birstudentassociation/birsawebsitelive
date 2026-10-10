const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^-\d+(\.\d+)?$/;

export function csvField(value: unknown): string {
  let str = value === null || value === undefined ? "" : String(value);
  if (FORMULA_PREFIX.test(str) && !PLAIN_NUMBER.test(str)) {
    str = `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
