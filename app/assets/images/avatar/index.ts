export type AvatarName = 'bear' | 'chicken' | 'dog' | 'cat' | 'dinosaur' | 'dog' | 'gorilla' | 'meerkat' | 'panda' | 'rabbit';

export const avatarNames: AvatarName[] = [
  'bear',
  'chicken',
  'dog',
  'cat',
  'dinosaur',
  'gorilla',
  'meerkat',
  'panda',
  'rabbit',
];

export const avatarImages: Record<AvatarName, any> = {
  bear: require('./bear.png'),
  chicken: require('./chicken.png'),
  dog: require('./dog.png'),
  cat: require('./cat.png'),
  dinosaur: require('./dinosaur.png'),
  gorilla: require('./gorilla.png'),
  meerkat: require('./meerkat.png'),
  panda: require('./panda.png'),
  rabbit: require('./rabbit.png'),
};
