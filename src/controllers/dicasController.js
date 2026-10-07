const { dicasData } = require('../database/dicasData');

function listar(req, res) {
  try {
    const { categoria, busca } = req.query;
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

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar dicas de estudo: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const dica = dicasData.find(d => d.id === id);
    if (!dica) {
      return res.status(404).json({ erro: 'Dica não encontrada' });
    }
    res.json(dica);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar dica: ' + err.message });
  }
}

module.exports = {
  listar,
  obterPorId
};
