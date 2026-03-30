const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  let original = content;

  content = content.replace(/<Button([^>]*)asChild([^>]*)>\s*<Link([^>]*)>(.*?)<\/Link>\s*<\/Button>/gs, (match, before, after, linkAtts, innerStr) => {
    let btnAtts = before + " " + after;
    let clsMatch = btnAtts.match(/className=(["'][^"']+["']|\{[^\}]+\})/);
    let varMatch = btnAtts.match(/variant=(["'][^"']+["']|\{[^\}]+\})/);
    let sizeMatch = btnAtts.match(/size=(["'][^"']+["']|\{[^\}]+\})/);

    let cls = clsMatch ? clsMatch[1] : null;
    let vrnt = varMatch ? varMatch[1] : null;
    let sz = sizeMatch ? sizeMatch[1] : null;

    let objProps = [];
    if (vrnt) objProps.push(`variant: ${vrnt}`);
    if (sz) objProps.push(`size: ${sz}`);
    if (cls) objProps.push(`className: ${cls}`);

    let bv = `className={buttonVariants(${objProps.length > 0 ? `{ ${objProps.join(', ')} }` : ''})}`;
    return `<Link${linkAtts} ${bv}>${innerStr}</Link>`;
  });

  if (content !== original) {
    if (!content.includes('buttonVariants')) {
      content = content.replace(/import\s*\{\s*Button\s*\}\s*from\s*['"]@\/components\/ui\/button['"]/, 'import { Button, buttonVariants } from "@/components/ui/button"');
    }
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed Button->Link in', path);
  }
}

['src/app/(customer)/dashboard/page.tsx', 
 'src/app/(public)/book/confirmation/page.tsx',
 'src/app/(public)/login/page.tsx', 
 'src/app/(public)/page.tsx', 
 'src/components/shared/navbar.tsx'].forEach(processFile);
