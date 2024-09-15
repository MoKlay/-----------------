import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function generatePassword({
    Q, P
}) {
    const M = 12
    let pass = ''
    for (let i = 0; i < M; i++) {
        if (i < Q) {
            pass += String.fromCharCode(parseInt(Math.random()*33 +1072)).toLocaleLowerCase()
        }  else if (i >= Q && Q + P > i) {
            pass += String.fromCharCode(parseInt(Math.random()*33 +1072)).toLocaleUpperCase()
        } else {
            pass += parseInt(Math.random()*10)
        }
            
    }
    return pass
}


rl.question('Введите идентификатор пароля: ', (answer) => {
    const N = answer.length
    const Q = N**3 % 5
    const P = N**2 % 6
    console.log(Q, P);
    console.log(`Сгенерированный пароль: ${generatePassword({Q, P})} \n`);
  
    rl.close();
  });