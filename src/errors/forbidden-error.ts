import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: 'We apologize, but it appears that we do not have any available rooms. ',
  };
}
