import sharp from 'sharp';
for (const size of [192,512]) await sharp('public/icon.svg').resize(size,size).png().toFile(`public/icon-${size}.png`);
const mask = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#191b19"/><path d="M269 131 165 269h82l-8 103 109-152h-79Z" fill="#d5f463"/></svg>';
await sharp(Buffer.from(mask)).png().toFile('public/icon-maskable.png');
