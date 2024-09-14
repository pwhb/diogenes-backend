import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export function generateUsername() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    length: 3,
  });
}
