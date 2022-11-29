export const consoleLine = '-'.repeat(process.stdout?.columns);

export const uuid = (noOfDigits=6) => {
  const powerOfTen = Number('1'+'0'.repeat(noOfDigits));
  return Math.ceil(Math.random()*powerOfTen);
};

module.exports = { consoleLine, uuid };
