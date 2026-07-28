"use client";

import { useState } from "react";
import { Rocket, TrendingUp, Clock, Plus, Loader2, Users2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShowcaseCard } from "@/components/showcase-card";
import { ShowcaseSubmitModal } from "@/components/showcase-submit-modal";
import { ShowcaseWeeklyLeaderboard } from "@/components/showcase-weekly-leaderboard";

const CATEGORIES = ["Todos", "SaaS", "App Mobile", "Extensão Chrome", "Infoproduto", "E-commerce", "Marketplace", "Ferramenta IA", "Outro"];

interface ShowcaseProject {
  id: string;
  title: string;
  tagline: string;
  description?: string;
  url: string;
  screenshot_url?: string;
  category: string;
  tags: string[];
  upvotes_count: number;
  created_at: string;
  author_email: string;
  has_voted: boolean;
  user_id: string;
}

interface ShowcaseClientProps {
  currentUserId: string;
  initialProjects: ShowcaseProject[];
}

export function ShowcaseClient({ currentUserId, initialProjects }: ShowcaseClientProps) {
  const [projects, setProjects] = useState<ShowcaseProject[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async (cat: string, s: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ sort: s });
      if (cat !== "Todos") params.set("category", cat);
      const res = await fetch(`/api/showcase?${params}`);
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    fetchProjects(cat, sort);
  };

  const handleSortChange = (s: "top" | "new") => {
    setSort(s);
    fetchProjects(category, s);
  };

  const handleSuccess = (project: ShowcaseProject) => {
    setProjects(prev => [{ ...project, author_email: "", has_voted: false }, ...prev]);
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleLeaderboardUpvote = async (id: string, currentHasVoted: boolean) => {
    // Atualizar no estado local
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            has_voted: !currentHasVoted,
            upvotes_count: currentHasVoted ? p.upvotes_count - 1 : p.upvotes_count + 1,
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/showcase/${id}/upvote`, { method: "POST" });
    } catch (err) {
      console.error("Erro no upvote:", err);
    }
  };

  // Top 3 projetos ordenados por upvotes
  const topWeeklyProjects = [...projects]
    .sort((a, b) => b.upvotes_count - a.upvotes_count)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-600/10 border border-primary/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <Globe2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Comunidade
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Showcase da{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Comunidade
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base max-w-lg">
              Produtos reais construídos com oportunidades geradas pelo ViralBook AI. Inspira-te, vota e partilha o teu.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users2 className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">{projects.length}</strong> projetos publicados</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-xl shadow-primary/25 font-bold px-6 gap-2 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Publicar o Meu Projeto
          </Button>
        </div>
      </div>

      {/* Leaderboard Semanal */}
      <ShowcaseWeeklyLeaderboard
        topProjects={topWeeklyProjects}
        onUpvote={handleLeaderboardUpvote}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground border border-border/50 hover:border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 border border-border/50 shrink-0">
          <button
            onClick={() => handleSortChange("top")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sort === "top" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Mais Votados
          </button>
          <button
            onClick={() => handleSortChange("new")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sort === "new" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Mais Recentes
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">A carregar projetos...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center mb-4">
            <Rocket className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="font-bold text-lg mb-1">Ainda não há projetos aqui</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Sê o primeiro a publicar o teu projeto nesta categoria!
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" /> Publicar o Primeiro
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project, i) => (
            <ShowcaseCard
              key={project.id}
              project={project}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Submit Modal */}
      <ShowcaseSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
