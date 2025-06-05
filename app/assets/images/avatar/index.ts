export type AvatarName = 'bear' | 'chicken' | 'dinosaur' | 'dog' | 'gorilla' | 'meerkat' | 'panda' | 'rabbit';

export const avatarNames: AvatarName[] = [
  'bear',
  'chicken',
  'dinosaur',
  'dog',
  'gorilla',
  'meerkat',
  'panda',
  'rabbit',
];

export const avatarImages: Record<AvatarName, any> = {
  bear: require('./bear.png'),
  chicken: require('./chicken.png'),
  dinosaur: require('./dinosaur.png'),
  dog: require('./dog.png'),
  gorilla: require('./gorilla.png'),
  meerkat: require('./meerkat.png'),
  panda: require('./panda.png'),
  rabbit: require('./rabbit.png'),
};
