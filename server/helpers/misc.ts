export const consoleLine = '-'.repeat(process.stdout?.columns);

export const uuid = (exponent=1000000) => {
  const powerOfTen = Number('1'+'0'.repeat(exponent));
  return Math.ceil(Math.random()*powerOfTen);
};

module.exports = { consoleLine, uuid };
