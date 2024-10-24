import { log } from 'console';
import fs from 'fs'


const Alphabet = []
for (let i = 1040; i < 1072; i++) {
    Alphabet.push(String.fromCharCode(i))
    String.fromCharCode(i) == 'Е' && Alphabet.push('Ё') 
}




function decodingCaesar(Code) {
    if (!Code) {
        log('Укажите шивр!')
        return
    }
    return Code.split('').map(el => {
        const index = Alphabet.indexOf(el)
        return Alphabet[index -3]
    }).join('');
}

function decryptionOfTheVizhiner(key, Code) {
    Alphabet.splice(Alphabet.indexOf('Ё'), 1)
    if (!key) {
        log('Укажите ключ!')
        return
    }
    if (!Code) {
        log('Укажите шивр!')
        return
    }
    let Key = key.split('')
    return Code.split('').map(el => {
        if (el == ' ') return el
        const indexKey = Alphabet.indexOf(Key.shift())
        if (Key.length == 0) Key = key.split('')

        const index = Alphabet.indexOf(el)
        let i = index - indexKey
        if (i < 0) i += Alphabet.length
        return Alphabet[i]
    }).join('')
}

function decryptionBlockPermutation(key='', Code='') {
    Alphabet.push('_')
    if (!key) {
        log('Укажите ключ!')
        return
    }
    if (!Code) {
        log('Укажите шивр!')
        return
    }
    const array = key.split('').sort()
    const Key = key.split('').map(el => {
        const index = array.indexOf(el)
        array[index] = ''
        return index
    })
    let result = ''
    for (let i = 0; Code.split('').slice(i, i + Key.length).length != 0; i+= Key.length) {
        const array = Code.split('').slice(i, i+ Key.length)
        result += Key.map(el => {
            return array[el]
        }).join('')
    }
    return result
}

function decodingGammaSuperpositionModuloN(key='', Code='') {
    Alphabet.push('_')
    for (let i = 0; i < 10; i++) {
        Alphabet.push(i.toString())
    }
    if (!key) {
        log('Укажите ключ!')
        return
    }
    if (!Code) {
        log('Укажите шивр!')
        return
    }

    let Key = key.split('')

    return Code.split('').map(el => {
        const indexKey = Alphabet.indexOf(Key.shift())
        if (Key.length == 0) Key = key.split('')

        const index = Alphabet.indexOf(el)
        return Alphabet[(index - indexKey + Alphabet.length-1) % (Alphabet.length-1)]
    }).join('')
}


switch (process.argv[2]) {
    case '1': log(decodingCaesar(process.argv[3])); break
        
    case '2': log(decryptionOfTheVizhiner(process.argv[3], process.argv[4])); break
    case '3': log(decryptionBlockPermutation(process.argv[3], process.argv[4])); break
    case '4': log(decodingGammaSuperpositionModuloN(process.argv[3], process.argv[4])); break
}

