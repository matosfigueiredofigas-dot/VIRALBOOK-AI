import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ViralBook AI',
    short_name: 'ViralBook',
    description: 'Detecte a sua próxima startup baseada em fatos de livros virais.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
