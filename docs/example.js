const sudoo_terminal = require('../dist/index');

const imp = sudoo_terminal.Imp();
const canvas = sudoo_terminal.Canvas();

let current = '';
imp.listen((str, key) => {
    current += key.name;

    canvas.replace(current + '\n' + current + '\n');
});
process.stdin.setRawMode(true);
imp.press({
    name: 'b',
    sequence: 'b',
}).onKey('return', (str, key) => {

    if (key.ctrl) {
        return true;
    }
    canvas.enter();
});
imp.onMeta('shift', (str, key) => (console.log(key), false))