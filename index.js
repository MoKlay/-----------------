import fs from 'fs'

if (process.argv[2]) {
    fs.readFile(process.argv[2], (err, data) => {
        if (err) {
            console.log('Ошибка чтения', err);
        }
        data = String(data.toString())
        let text = data.replace(/\(\d+,\d+\)/g, '')
        console.log(data)
        console.log(text)
        while (data.includes('(')) {
            const start = data.indexOf('(')
            const mass = JSON.parse(`[${data.slice(start + 1, data.indexOf(')'))}]`)
            const path = text.slice(start - Math.abs(mass[0]), start - Math.abs(mass[0]) + mass[1])
            text = text.slice(0, start) + path + text.slice(start, text.length)
            data = data.replace(/\(\d+,\d+\)/, path)
            console.log(start ,mass ,path, text);
        }
        console.log(data)
        fs.writeFileSync('./newtext.txt', data)
        const textsize = fs.statSync(process.argv[2]).size
        const newtextsize = fs.statSync('./newtext.txt').size
        console.log(textsize, newtextsize);
        
    })
} else {
    console.log('Укажите в параметр путь файла');
}
