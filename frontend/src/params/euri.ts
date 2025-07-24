import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Checks if the parameter is a valid integer.
 */
export const match: ParamMatcher = (param) => {
  // Use a regular expression to check if the string contains only digits.
  return /^.+$/.test(param);
};
