import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export function generateUsername() {
  // return 'RootUser';
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    length: 3,
    style: 'capital',
  });
}
