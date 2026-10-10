import QRCode from 'qrcode';

const cacheQRCodes: {
  comunidade?: string;
  comunidadeUrl?: string;
  canal?: string;
  canalUrl?: string;
} = {};

export async function generateQrCodeSvg(url: string, key: 'comunidade' | 'canal'): Promise<string> {
  const cachedUrlKey = key === 'comunidade' ? 'comunidadeUrl' : 'canalUrl';
  if (cacheQRCodes[key] && cacheQRCodes[cachedUrlKey] === url) {
    return cacheQRCodes[key]!;
  }

  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  cacheQRCodes[key] = svg;
  cacheQRCodes[cachedUrlKey] = url;
  return svg;
}
