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
      
      // Tentar Open Library como contingência no servidor também
      try {
        console.log("[GoogleBooksService Server] Tentando Open Library...");
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`);
        const data = await res.json();
        if (data.docs && data.docs.length > 0) {
          return data.docs.map((item: any) => ({
            id: item.key.replace('/works/', ''),
            title: item.title,
            authors: item.author_name || ['Desconhecido'],
            description: item.first_sentence?.[0] || `Obra de ${item.author_name?.[0] || 'Desconhecido'} publicada originalmente em ${item.first_publish_year || 'ano desconhecido'}.`,
            categories: item.subject || [query],
            publishedDate: item.first_publish_year?.toString() || '2023',
            language: item.language?.[0] || 'pt-BR',
          }));
        }
      } catch (olError) {
        console.error("[GoogleBooksService Server] Open Library também falhou:", olError);
      }

      // Tentar iTunes/Apple Books como 3ª contingência
      try {
        console.log("[GoogleBooksService Server] Tentando iTunes/Apple Books API...");
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=ebook&limit=${maxResults}&country=BR`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((item: any) => {
            const cleanDesc = (item.description || '')
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&#xa0;/g, ' ')
              .trim();
            return {
              id: `itunes-${item.trackId}`,
              title: item.trackName || item.trackCensoredName,
              authors: item.artistName ? [item.artistName] : ['Desconhecido'],
              description: cleanDesc || `${item.genres?.[0] || 'Livro'} de ${item.artistName || 'Desconhecido'}.`,
              categories: item.genres || [query],
              publishedDate: item.releaseDate ? item.releaseDate.substring(0, 4) : '2023',
              language: 'pt-BR',
            };
          });
        }
      } catch (itunesError) {
        console.error("[GoogleBooksService Server] iTunes API também falhou:", itunesError);
      }

      // Fallback final para não quebrar a IA caso a API do Google bloqueie por limite de uso (Error 429)
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
