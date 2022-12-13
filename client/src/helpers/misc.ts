
export const uuid = (noOfDigits=6) => {
  const powerOfTen = Number('1'+'0'.repeat(noOfDigits));
  return Math.ceil(Math.random()*powerOfTen);
};

export const sampleTexts = {
  // eslint-disable-next-line max-len
  'matrixKungFu': "NEO: I know kung fu. MORPHEUS: Show me. This is a sparring program, similar to the programmed reality of Matrix. It has the same basic rules. Rules like gravity. What you must learn is that these rules are no different than the rules of a computer system. Some of them can be bent. Others can be broken. Hit me, if you can.",

};
