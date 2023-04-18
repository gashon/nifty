
// todo tokenize instead of splitting on spaces
export const countTokens = (str: string) => {
  return str.split(/\s+/).length;
}