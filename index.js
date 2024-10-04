const fs = require("fs");

if (process.argv[2]) {
    fs.readFile(process.argv[2], (err, data) => {
        if (err) {
            console.log('Ошибка чтения', err);
        }
        let text = data
        text.forEach(element => {
            console.log(String.fromCharCode(element+65));
        });
    })
} else {
    console.log('Укажите в параметр путь файла');
}
