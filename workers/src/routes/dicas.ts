import { Hono } from 'hono';
import { Bindings } from '../types';
import { dicasData } from '../../../src/database/dicasData';

export const dicasRouter = new Hono<{ Bindings: Bindings }>();

dicasRouter.get('/api/dicas', (c) => {
  try {
    const { categoria, busca } = c.req.query();
    let resultados = [...dicasData];

    if (categoria && categoria.trim()) {
      const cat = categoria.trim().toLowerCase();
      resultados = resultados.filter(d => d.categoria.toLowerCase() === cat);
    }

    if (busca && busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultados = resultados.filter(d =>
        d.titulo.toLowerCase().includes(termo) ||
        d.descricao.toLowerCase().includes(termo) ||
        d.dica_pratica.toLowerCase().includes(termo) ||
        d.categoria_label.toLowerCase().includes(termo)
      );
    }

    return c.json(resultados);
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao listar dicas de estudo' }, 500);
  }
});

dicasRouter.get('/api/dicas/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const dica = dicasData.find((d: any) => d.id === id);
    if (!dica) return c.json({ erro: 'Dica não encontrada' }, 404);
    return c.json(dica);
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao buscar dica' }, 500);
  }
});
