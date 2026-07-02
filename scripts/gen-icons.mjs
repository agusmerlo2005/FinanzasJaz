import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const pub = join(here, '..', 'public')
const svg = readFileSync(join(here, 'icon.svg'))

// Ícono normal (con márgenes propios del SVG)
const tamanos = [
  { file: 'pwa-192.png', size: 192 },
  { file: 'pwa-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

// Maskable: el mismo arte pero con padding de seguridad (safe zone)
async function run() {
  for (const { file, size } of tamanos) {
    await sharp(svg, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(join(pub, file))
    console.log('✓', file)
  }

  // maskable 512: fondo sólido + arte reducido al 78% centrado
  const arte = await sharp(svg, { density: 384 }).resize(400, 400).png().toBuffer()
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: '#0B0C0F' },
  })
    .composite([{ input: arte, gravity: 'center' }])
    .png()
    .toFile(join(pub, 'pwa-maskable-512.png'))
  console.log('✓ pwa-maskable-512.png')

  // favicon.png 48
  await sharp(svg, { density: 384 }).resize(48, 48).png().toFile(join(pub, 'favicon.png'))
  console.log('✓ favicon.png')
}

run().catch((e) => { console.error(e); process.exit(1) })
