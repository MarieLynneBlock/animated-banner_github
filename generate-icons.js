const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'assets', 'icons');
const outputFile = path.join(__dirname, 'assets', 'icons-list.json');

// Сканируем папку icons
const files = fs.readdirSync(iconsDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.svg' || ext === '.jpg' || ext === '.jpeg';
});

// Генерируем список иконок
const iconList = files.map(file => {
    const name = path.basename(file, path.extname(file));
    const ext = path.extname(file).toLowerCase();
    const type = ext === '.svg' ? 'svg' : 'png';
    
    return {
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' '),
        src: `assets/icons/${file}`,
        type: type
    };
});

// Сохраняем в JSON файл
fs.writeFileSync(outputFile, JSON.stringify(iconList, null, 2), 'utf8');
console.log(`✓ Найдено ${iconList.length} иконок:`);
iconList.forEach(icon => console.log(`  - ${icon.name} (${icon.src})`));

