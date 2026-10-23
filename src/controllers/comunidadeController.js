const QRCode = require('qrcode');

let cacheQRCodes = {
  comunidade: null,
  canal: null
};

function obterUrlComunidade() {
  return process.env.WHATSAPP_COMMUNITY_URL || null;
}

function obterUrlCanal() {
  return process.env.WHATSAPP_CHANNEL_URL || null;
}

async function getComunidade(req, res) {
  const url = obterUrlComunidade();
  if (!url) {
    return res.status(404).json({ erro: 'Comunidade WhatsApp não configurada' });
  }
  res.json({ url });
}

async function getComunidadeQrCode(req, res) {
  const url = obterUrlComunidade();
  if (!url) {
    return res.status(404).json({ erro: 'Comunidade WhatsApp não configurada' });
  }

  try {
    if (!cacheQRCodes.comunidade || cacheQRCodes.comunidadeUrl !== url) {
      cacheQRCodes.comunidade = await QRCode.toString(url, { 
        type: 'svg',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      cacheQRCodes.comunidadeUrl = url;
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(cacheQRCodes.comunidade);
  } catch (err) {
    console.error('[comunidadeController]', err);
    res.status(500).json({ erro: 'Erro ao gerar QR code' });
  }
}

async function getCanal(req, res) {
  const url = obterUrlCanal();
  if (!url) {
    return res.status(404).json({ erro: 'Canal WhatsApp não configurado' });
  }
  res.json({ url });
}

async function getCanalQrCode(req, res) {
  const url = obterUrlCanal();
  if (!url) {
    return res.status(404).json({ erro: 'Canal WhatsApp não configurado' });
  }

  try {
    if (!cacheQRCodes.canal || cacheQRCodes.canalUrl !== url) {
      cacheQRCodes.canal = await QRCode.toString(url, { 
        type: 'svg',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      cacheQRCodes.canalUrl = url;
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(cacheQRCodes.canal);
  } catch (err) {
    console.error('[comunidadeController]', err);
    res.status(500).json({ erro: 'Erro ao gerar QR code' });
  }
}

module.exports = {
  getComunidade,
  getComunidadeQrCode,
  getCanal,
  getCanalQrCode
};
