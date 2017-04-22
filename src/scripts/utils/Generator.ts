module TacticArena.Utils {
    export class Generator {

        constructor () {

        }

        generate (n = 5) {
            var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            var consonant = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
            var vowel = ['a', 'e', 'i', 'o', 'u'];
            var name = [];
            var numLetters = n;
            var selected;
            var result = '';
            for (var i = 0; i < numLetters; i++) {
                selected = Math.floor(Math.random() * 26);
                if (name.length > 2) {
                    var lastLetter = name.length - 1;
                    var penultLetter = name.length - 2;
                    while (name[lastLetter] == selected && name[penultLetter] == selected)
                        selected = Math.floor(Math.random() * 26);
                    if (consonant.indexOf(name[lastLetter]) != -1 && consonant.indexOf(name[penultLetter]) != -1) {
                        selected = Math.floor(Math.random() * 5);
                        name[i] = vowel[selected];
                        continue;
                    }
                }
                else {
                    if (vowel.indexOf(name[0]) != -1) {
                        selected = Math.floor(Math.random() * 21);
                        name[i] = consonant[selected];
                        continue;
                    }
                    else if (consonant.indexOf(name[0]) != -1) {
                        selected = Math.floor(Math.random() * 5);
                        name[i] = vowel[selected];
                        continue;
                    }
                }
                name[i] = letter[selected];
            }
            if (consonant.indexOf(name[name.length - 1]) != -1 && consonant.indexOf(name[name.length - 2]) != -1) {
                selected = Math.floor(Math.random() * 5);
                name[name.length - 1] = vowel[selected];
            }
            result = name.join('');
            result = result.substr(0, 1).toUpperCase() + result.substr(1);
            return result;
        }

        serialize() {

        }
    }
}
