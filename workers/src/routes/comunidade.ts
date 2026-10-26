import { Hono } from 'hono';
import { Bindings } from '../types';
import { generateQrCodeSvg } from '../utils/qrcode';

export const DEFAULT_WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/FobzGj8sibBI0EWfQrl2oU';
export const DEFAULT_WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb8qMqDBlHpk2TQYwU0X';

export const comunidadeRouter = new Hono<{ Bindings: Bindings }>();

// 8. Comunidade e Canal WhatsApp
comunidadeRouter.get('/api/comunidade', (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);
  return c.json({ url });
});

comunidadeRouter.get('/api/comunidade/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'comunidade');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao gerar QR code' }, 500);
  }
});

comunidadeRouter.get('/api/canal', (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);
  return c.json({ url });
});

comunidadeRouter.get('/api/canal/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'canal');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao gerar QR code' }, 500);
  }
});
