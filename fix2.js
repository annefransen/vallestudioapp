const fs = require('fs');
let f = 'src/app/(public)/page.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/const (\w+)\s*:\s*Variants\s*=/g, 'const $1: any =');
fs.writeFileSync(f, c);
console.log('Fixed Variants in', f);
