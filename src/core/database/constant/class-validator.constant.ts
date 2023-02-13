export const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?<>!@.#$%^&*(){}|/"~`' ])(?=.*[a-zA-Z0-9?<>!@#$%^&*().{}|/"~`' ]).{8,16}$/;

export const ERR_MSG_FORMAT_PASSWORD =
  'The password is in the wrong format. Please re-enter your password. ';
export const ERR_MSG_MIN_LENGTH_PASSWORD =
  'The password need at least 8 characters . Please re-enter your password.';
export const ERR_MSG_MAX_LENGTH_PASSWORD =
  'The password cannot enter the 17st character. Please re-enter your password.';
export const ERR_MSG_FORMAT_DATE = 'Not right format date YYYY-MM-DD.';

export const requireFieldLength = (field: string, maxChar: string) => {
  return `${field} cannot longer than ${maxChar} character. Please re-enter your ${field}.`;
};

export const requireFieldNotEmpty = (field: string) => {
  return `${field} cannot be empty.`;
};
