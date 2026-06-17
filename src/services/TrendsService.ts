import googleTrends from 'google-trends-api';

export class TrendsService {
  /**
   * Valida o crescimento de uma palavra-chave (nicho/livro) no Google Trends.
   * Retorna o crescimento percentual estimado no último mês.
   */
  static async getKeywordGrowth(keyword: string, geo: string = 'US') {
    try {
      const results = await googleTrends.interestOverTime({
        keyword: keyword,
        geo: geo === 'ALL' ? '' : geo,
        startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
      });
      
      const parsedResults = JSON.parse(results);
      const timeline = parsedResults.default?.timelineData;
      
      if (!timeline || timeline.length < 2) {
        return { monthlyGrowth: 0, rawInterest: 0 };
      }

      // Comparação simples entre o início do mês e o fim do mês
      const startValue = timeline[0].value[0] || 1; // Evita divisão por zero
      const endValue = timeline[timeline.length - 1].value[0] || 0;
      
      const growth = ((endValue - startValue) / startValue) * 100;
      
      return {
        monthlyGrowth: parseFloat(growth.toFixed(2)),
        rawInterest: endValue
      };
    } catch (error) {
      console.error("Erro no TrendsService:", error);
      return { monthlyGrowth: 0, rawInterest: 0 };
    }
  }
}
