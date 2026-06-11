export class GoogleBooksService {
  /**
   * Busca livros populares baseados em um termo de pesquisa
   */
  static async searchTrendingBooks(query: string, maxResults = 10) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&orderBy=relevance&maxResults=${maxResults}${keyParam}`
      );
      
      const data = await res.json();
      
      if (!data.items) {
        throw new Error("Rate limit ou erro na API");
      }

      return data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title || `Guia definitivo sobre ${query}`,
        authors: item.volumeInfo?.authors || ['Desconhecido'],
        description: item.volumeInfo?.description || '',
        categories: item.volumeInfo?.categories || ['Sem categoria'],
        publishedDate: item.volumeInfo?.publishedDate || '2023',
        language: item.volumeInfo?.language || 'pt-BR',
      }));
    } catch (error) {
      console.error("Erro no GoogleBooksService (Fallback ativado):", error);
      // Fallback para não quebrar a IA caso a API do Google bloqueie por limite de uso (Error 429)
      return [{
        id: 'mock-' + Date.now(),
        title: `Guia definitivo sobre ${query}`,
        authors: ['Autor Desconhecido'],
        description: `Um livro abordando os principais problemas e soluções relacionados a ${query}.`,
        categories: [query],
        publishedDate: '2023',
        language: 'pt-BR',
      }];
    }
  }
}
