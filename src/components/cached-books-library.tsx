"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Sparkles, Heart, Share2, Bell, MessageSquare, TrendingUp, Users, Copy, CheckCircle2, FileText, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AIChatModal } from "@/components/ai-chat-modal"
import { useRouter } from "next/navigation"

// Ícone personalizado do Facebook
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      width="24"
      height="24"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Cores de capa baseadas na categoria para o visual de biblioteca premium
function getCategoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("tech") || cat.includes("comput") || cat.includes("program")) {
    return "from-violet-600 to-indigo-900 shadow-violet-500/10";
  }
  if (cat.includes("financ") || cat.includes("negoc") || cat.includes("busi") || cat.includes("admin")) {
    return "from-emerald-600 to-teal-900 shadow-emerald-500/10";
  }
  if (cat.includes("saud") || cat.includes("health") || cat.includes("diet") || cat.includes("psico")) {
    return "from-rose-500 to-red-900 shadow-rose-500/10";
  }
  if (cat.includes("produtiv") || cat.includes("foco") || cat.includes("self") || cat.includes("desenv")) {
    return "from-amber-500 to-orange-800 shadow-amber-500/10";
  }
  return "from-blue-600 to-slate-900 shadow-blue-500/10";
}

export function CachedBooksLibrary({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleFavorite = async (id: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: id })
      });
      if (res.status === 401) {
        router.push('/login');
      } else if (res.ok) {
        alert('Adicionado aos favoritos!');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao favoritar.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir a oportunidade "${title}" da biblioteca?`)) {
      return;
    }
    try {
      const res = await fetch('/api/radar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.status === 401) {
        router.push('/login');
      } else if (res.ok) {
        alert('Oportunidade excluída com sucesso!');
        setItems(items.filter((item) => item.id !== id));
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Erro ao excluir.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir.');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link secreto copiado para a área de transferência!");
  };

  // Mapear todas as categorias únicas disponíveis no histórico
  const categories = Array.from(
    new Set(items.map((item) => item.book_category || "Sem Categoria"))
  ).filter(Boolean);

  // Filtragem dos dados
  const filteredData = items.filter((item) => {
    const titleMatch = item.book_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const saasMatch = item.saas_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const problemMatch = item.problem_solved?.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = selectedCategory ? (item.book_category || "Sem Categoria") === selectedCategory : true;
    
    return (titleMatch || saasMatch || problemMatch) && catMatch;
  });

  return (
    <div className="space-y-6">
      {/* Painel de Métricas Rápidas da Biblioteca */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-5 rounded-3xl border border-border/40 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Livros Processados</div>
          <div className="text-2xl font-black text-foreground mt-1.5">{items.length}</div>
        </div>
        <div className="text-center border-l border-border/30">
          <div className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest">Nichos Distintos</div>
          <div className="text-2xl font-black text-purple-400 mt-1.5">
            {new Set(items.map(item => item.target_audience).filter(Boolean)).size}
          </div>
        </div>
        <div className="text-center border-l border-border/30">
          <div className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">Categorias Únicas</div>
          <div className="text-2xl font-black text-blue-400 mt-1.5">{categories.length}</div>
        </div>
        <div className="text-center border-l border-border/30">
          <div className="text-[10px] text-green-500 font-extrabold uppercase tracking-widest">Score Médio Geral</div>
          <div className="text-2xl font-black text-green-500 mt-1.5">
            {items.length > 0 ? Math.round(items.reduce((acc, curr) => acc + (curr.viral_opportunity_score || 0), 0) / items.length) : 0}
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por livro, SaaS ou problema..."
            className="pl-10 bg-background/80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Categorias */}
        <div className="flex flex-wrap gap-2 justify-start w-full md:w-auto">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer py-1.5 px-3 text-xs font-semibold"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Badge>
          {categories.slice(0, 5).map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer py-1.5 px-3 text-xs font-semibold"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid de Livros (Visual Estilo Biblioteca) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-4">
        {filteredData.map((item) => {
          const capGradient = getCategoryColor(item.book_category);
          return (
            <Card 
              key={item.id} 
              className="group relative flex flex-col justify-between overflow-hidden bg-card/40 border border-border/50 backdrop-blur-md hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl"
            >
              {/* Visual de Capa de Livro 3D simulada */}
              <div className="p-5 flex-1">
                <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${capGradient} flex flex-col justify-between p-5 text-white shadow-lg overflow-hidden`}>
                  {/* Textura do Livro (Lombada/Spine) */}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/20" />
                  <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10" />

                  {/* Detalhes da Capa */}
                  <div className="flex justify-between items-start pl-3">
                    <Badge className="bg-white/20 border-none backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider">
                      {item.book_category || "Ebook"}
                    </Badge>
                    <Badge className="bg-yellow-500 text-black border-none font-bold text-[10px] rounded-full px-2 py-0.5">
                      Score: {item.viral_opportunity_score}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 pl-3">
                    <a 
                      href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(item.book_title + " " + (item.book_author || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline block z-20 relative"
                    >
                      <h3 className="font-extrabold text-lg line-clamp-2 leading-tight drop-shadow-md font-serif">
                        {item.book_title}
                      </h3>
                    </a>
                    <p className="text-xs text-white/80 font-medium italic truncate">
                      por {item.book_author || "Autor Mapeado"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pl-3 pt-2 text-[10px] text-white/75 font-semibold border-t border-white/15">
                    <span>MERCADO: {item.country}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Detalhes da Oportunidade SaaS Associada */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">SaaS Oportunidade</span>
                  </div>
                  <h4 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.saas_name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.problem_solved}
                  </p>
                </div>
              </div>
              {/* Ações */}
              <CardFooter className="p-5 pt-0 flex gap-2 items-center">
                <Sheet>
                  <SheetTrigger render={<Button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10 rounded-xl font-bold py-5 text-xs" />}>
                    <span onClick={() => setActiveItem(item)}>Abrir</span>
                  </SheetTrigger>
                  
                  {activeItem && (
                    <SheetContent className={`w-full overflow-y-auto transition-all duration-300 ${isExpanded ? "!max-w-[90vw]" : "!max-w-xl"}`}>
                      <SheetHeader className="mb-6 relative pr-12">
                        <button 
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="absolute top-0 right-8 p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                          title={isExpanded ? "Restaurar tamanho" : "Maximizar"}
                        >
                          {isExpanded ? "🗗" : "🗖"}
                        </button>
                        <SheetTitle className="text-2xl font-extrabold text-primary flex items-center gap-4 flex-wrap">
                          {activeItem.saas_name}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-none"
                              onClick={() => window.open(`/canvas/${activeItem.id}`, '_blank')}
                            >
                              <FileText className="h-4 w-4 mr-2" /> Lean Canvas
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-none"
                              onClick={() => setIsChatOpen(true)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" /> Falar com CTO (IA)
                            </Button>
                          </div>
                        </SheetTitle>
                        <SheetDescription className="text-base text-foreground mt-2">
                          <strong>Livro Original:</strong>{" "}
                          <a 
                            href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(activeItem.book_title + " " + (activeItem.book_author || ""))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-primary transition-colors font-semibold"
                          >
                            {activeItem.book_title}
                          </a>
                          {" "}(por {activeItem.book_author})
                          <br />
                          <strong>Problema Resolvido:</strong> {activeItem.problem_solved}
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="space-y-6">
                        {/* Canais de Validação */}
                        <div>
                          <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Validação Social & Canais</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/10">
                              <div className="flex items-center gap-2 text-orange-500 font-bold mb-2">
                                <Search className="h-4 w-4" />
                                Validação Reddit
                              </div>
                              <div className="text-xl font-extrabold text-foreground mb-1">
                                {activeItem.reddit_mentions || 0}
                                <span className="text-xs font-normal text-muted-foreground ml-1">menções</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Discussões de dores ativas identificadas em fóruns do Reddit.
                              </p>
                            </div>
 
                            <div className="bg-blue-600/5 p-4 rounded-lg border border-blue-600/10">
                              <div className="flex items-center gap-2 text-blue-500 font-bold mb-2">
                                <FacebookIcon className="h-4 w-4" />
                                Validação Facebook
                              </div>
                              <div className="space-y-1">
                                <a
                                  href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(activeItem.target_audience || activeItem.saas_name)}&media_type=all`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[13px] font-bold text-foreground hover:text-blue-500 hover:underline transition-colors block"
                                >
                                  Anúncios Ativos: <span className="text-blue-500">{activeItem.facebook_ads_count || 0} ads ↗</span>
                                </a>
                                <a
                                  href={`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(activeItem.target_audience || activeItem.saas_name)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[13px] font-bold text-foreground hover:text-indigo-400 hover:underline transition-colors block"
                                >
                                  Grupos do Nicho: <span className="text-indigo-400">{activeItem.facebook_groups_count || 0} ativos ↗</span>
                                </a>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                                Presença comercial e audiência mapeada no Facebook.
                              </p>
                            </div>
                          </div>
                        </div>
 
                        {/* Monetização */}
                        <div>
                          <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Como Monetizar</h4>
                          <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <p className="text-foreground text-sm">{activeItem.monetization_model}</p>
                            <Separator className="my-3" />
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Preço Sugerido:</span>
                              <span className="font-bold text-green-500">{activeItem.suggested_price?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                              <span className="text-muted-foreground">Potencial:</span>
                              <span className="font-bold">{activeItem.potential_revenue?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                            </div>
                          </div>
                        </div>
 
                        {/* Plano MVP */}
                        <div>
                          <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Plano do MVP</h4>
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <p className="text-foreground text-sm leading-relaxed">{activeItem.mvp_features}</p>
                            <div className="flex gap-2 mt-4 text-xs">
                              <Badge variant="outline" className="bg-background">⏱️ {activeItem.development_time}</Badge>
                              <Badge variant="outline" className="bg-background">🧠 {activeItem.implementation_difficulty}</Badge>
                            </div>
                          </div>
                        </div>
 
                        {/* Prompts */}
                        <div>
                          <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider flex items-center justify-between">
                            Prompts de Construção
                          </h4>
                          <div className="space-y-4">
                            <div className="relative group">
                              <div className="text-[11px] font-semibold mb-1 text-purple-500">Para ChatGPT / Claude / Gemini (Universal)</div>
                              <pre className="bg-muted p-4 rounded-lg text-[12px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono border border-border/50">
{`Atue como meu CTO. SaaS: "${activeItem.saas_name}".
Problema: ${activeItem.problem_solved}
MVP: ${activeItem.mvp_features}
Preço: ${activeItem.suggested_price}`}
                              </pre>
                            </div>
 
                            <div className="relative group">
                              <div className="text-[11px] font-semibold mb-1 text-primary">Para Vercel v0 / Lovable (Frontend)</div>
                              <pre className="bg-muted p-4 rounded-lg text-[12px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono border border-border/50">
                                {activeItem.prompt_lovable}
                              </pre>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(activeItem.prompt_lovable, 'lovable')}
                              >
                                {copiedPrompt === 'lovable' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
 
                            <div className="relative group">
                              <div className="text-[11px] font-semibold mb-1 text-blue-500">Para Bolt.new / Cursor</div>
                              <pre className="bg-muted p-4 rounded-lg text-[12px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono border border-border/50">
                                {activeItem.prompt_bolt}
                              </pre>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(activeItem.prompt_bolt, 'bolt')}
                              >
                                {copiedPrompt === 'bolt' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <AIChatModal 
                        isOpen={isChatOpen} 
                        onClose={() => setIsChatOpen(false)} 
                        contextText={JSON.stringify(activeItem, null, 2)} 
                        projectName={activeItem.saas_name} 
                      />
                    </SheetContent>
                  )}
                </Sheet>
 
                {/* Reutilizar */}
                <Button 
                  variant="outline"
                  className="rounded-xl border-border hover:bg-muted font-semibold text-xs py-5 px-3"
                  onClick={() => {
                    alert(`Carregando análise reutilizada para "${item.book_title}"...`);
                    window.location.href = `/dashboard?search=${encodeURIComponent(item.saas_name)}`;
                  }}
                  title="Focar no Painel de Análise"
                >
                  Focar
                </Button>

                {/* Favoritar */}
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                  onClick={() => handleFavorite(item.id)}
                  title="Adicionar aos Favoritos"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Excluir */}
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                  onClick={() => handleDelete(item.id, item.book_title)}
                  title="Excluir da Biblioteca"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {filteredData.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/10 border border-dashed border-border/50 rounded-3xl">
            Nenhum e-book processado encontrado para a busca ou filtro selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
