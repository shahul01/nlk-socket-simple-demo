export const keysDict:{[key:string]:string} = {
  'q':'q', 'w':'w', 'e':'e', 'r':'r', 't':'t', 'y':'y', 'u':'u', 'i':'i', 'o':'o', 'p':'p',
  'a':'a', 's':'s', 'd':'d', 'f':'f', 'g':'g', 'h':'h', 'j':'j', 'k':'k', 'l':'l',
  'z':'z', 'x':'x', 'c':'c', 'v':'v', 'b':'b', 'n':'n', 'm':'m',
  '$':'$', ',':',', 'Space':' ', '.':'.', '↵':'Enter'
};

export const keysGeneralLocation:{[key:string]:string} = {
  'q':'1a', 'w':'1a', 'e':'1a', 'r':'1b', 't':'1b', 'y':'1b', 'u':'1b', 'i':'1c', 'o':'1c', 'p':'1c',
  'a':'2a', 's':'2a', 'd':'2a', 'f':'2b', 'g':'2b', 'h':'2b', 'j':'2c', 'k':'2c', 'l':'2c',
  'z':'3a', 'x':'3a', 'c':'3b', 'v':'3b', 'b':'3b', 'n':'3c', 'm':'3c',
  '$Sym':'4a', ',':'4a', ' ':'4b', '.':'4c', 'Enter':'4c'
};

export const locationKeysDict: {[key:string]: string[]} = {
  '1a': ['q','w','e'], '1b': ['r','t','y', 'u'], '1c': ['i','o','p'],
  '2a': ['a','s','d'], '2b': ['f','g','h'], '2c': ['j','k','l'],
  '3a': ['z','x'], '3b': ['c','v','b'], '3c': ['n','m'],
  '4a': ['$Sym',','], '4b': [' '], '4c': ['.', 'Enter'],
};
