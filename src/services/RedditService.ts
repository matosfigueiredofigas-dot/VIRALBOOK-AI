export class RedditService {
  /**
   * Busca menções e dores em subreddits relacionados à palavra-chave.
   * Não requer autenticação OAuth pesada apenas para buscar posts públicos recentes.
   */
  static async getSocialValidation(keyword: string) {
    try {
      // Busca simples na API pública de pesquisa do Reddit JSON
      const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=25`);
      
      if (!res.ok) {
        return { mentions: 0, topDores: [] };
      }

      const data = await res.json();
      const posts = data.data?.children || [];
      
      const mentions = posts.length;
      // Filtra títulos que indicam perguntas ou reclamações (How, Why, Help, Issue, Sucks)
      const dores = posts
        .filter((p: any) => p.data.title.match(/how|why|help|issue|problem|suck/i))
        .map((p: any) => p.data.title)
        .slice(0, 3); // Pega as top 3 dores

      return {
        mentions,
        topDores: dores
      };
    } catch (error) {
      console.error("Erro no RedditService:", error);
      return { mentions: 0, topDores: [] };
    }
  }
}
