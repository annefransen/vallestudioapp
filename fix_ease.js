const fs = require('fs');
let f = 'src/app/(public)/page.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/ease:\s*['"]easeOut['"]/g, 'ease: "circOut" as any');
fs.writeFileSync(f, c);
console.log('fixed ease type');
