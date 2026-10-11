/**
 * Controller Legal & Conformidade do Lino Livre
 * Define metadados e diretrizes jurídicas sobre o papel de intermediário,
 * isenção de responsabilidade, canal DMCA / Takedown e política de privacidade.
 */

exports.obterDiretrizesLegais = (req, res) => {
  return res.json({
    status: 'ativo',
    versao: '1.0',
    plataforma: 'Lino Livre',
    slogan: 'Livros livres, para todos.',
    natureza: 'Educacional, comunitária e sem fins lucrativos',
    missao: 'Democratização do acesso à leitura, formação técnica e literatura nos países de língua portuguesa (PALOP) e Sul Global.',
    arquitetura: {
      papel: 'intermediario_indexador',
      armazenamento_local_arquivos: false,
      redirecionamento_protocolo: 'HTTP 302',
      diretriz_principal: 'Zero armazenamento local de arquivos binários (PDF, EPUB, MOBI) no servidor web e banco de dados. O acervo mantém unicamente metadados e links para provedores externos.'
    },
    aviso_legal: 'O Lino Livre opera estritamente como plataforma intermediária e motor de busca de hiperligações externas públicas. Não controlamos, não editamos e não armazenamos o conteúdo físico nos nossos servidores.',
    dmca_takedown: {
      canal_oficial: 'bv6alblu6@mozmail.com',
      assunto_obrigatorio: '[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - Lino Livre',
      prazo_atendimento_horas: 48,
      compromisso: 'Desindexação célere e voluntária de links notificados de boa-fé por autores, editores ou seus representantes legais.',
      requisitos: [
        'Identificação da obra protegida por direitos autorais',
        'URL ou ID da obra indexada no Lino Livre',
        'URL externa para a qual o link aponta',
        'Comprovação da titularidade dos direitos autorais ou procuração',
        'Declaração de boa-fé do titular ou representante',
        'Informações de contato válidas'
      ]
    },
    privacidade: {
      cadastro_obrigatorio: false,
      cookies_rastreamento: false,
      venda_compartilhamento_dados: false,
      armazenamento_preferencias: 'localStorage (exclusivo no navegador do usuário para tema, fonte e áudio)',
      conformidade: ['LGPD (Lei 13.709/2018)', 'RGPD (Regulamento UE 2016/679)']
    },
    licencas_suportadas: [
      'dominio-publico',
      'cc0',
      'cc-by',
      'cc-by-sa',
      'cc-by-nc',
      'outro'
    ],
    links: {
      termos_completos: '/termos.html',
      aviso_legal: '/legal.html',
      documento_oficial: 'https://github.com/MisterAntoY/lino-livre/blob/main/TERMOS-DE-USO-E-AVISO-LEGAL.md'
    }
  });
};
