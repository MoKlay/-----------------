function generatePassword(N) {
  const Q = N ** 3 % 5;
  const P = N ** 2 % 6;
  const M = 12;
  let pass = "";
  for (let i = 0; i < M; i++) {
    if (i < Q) {
      pass += String.fromCharCode(
        parseInt(Math.random() * 32 + 1072)
      ).toLocaleLowerCase();
    } else if (i >= Q && Q + P > i) {
      pass += String.fromCharCode(
        parseInt(Math.random() * 32 + 1072)
      ).toLocaleUpperCase();
    } else {
      pass += parseInt(Math.random() * 10);
    }
  }
  return pass;
}

module.exports = generatePassword
