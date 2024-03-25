export const timestampIsExpired = (timestamp?: Date): boolean => {
  if(!timestamp) return false;

  return timestamp < new Date();
}
