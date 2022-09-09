export const consoleLine = '-'.repeat(process.stdout?.columns);

export const uuid = () => Math.ceil(Math.random()*1000000);

module.exports = { consoleLine, uuid };
