"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronUp, Trash2, Globe, Zap, MessageSquare, Code2, Sparkles } from "lucide-react";
import { ShowcaseBadgeModal } from "./showcase-badge-modal";
import { ShowcaseLaunchKitModal } from "./showcase-launch-kit-modal";
import { ShowcaseCommentsDrawer } from "./showcase-comments-drawer";

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

interface ShowcaseCardProps {
  project: ShowcaseProject;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  index?: number;
}

export function ShowcaseCard({ project, currentUserId, onDelete, index = 0 }: ShowcaseCardProps) {
  const [upvotes, setUpvotes] = useState(project.upvotes_count);
  const [hasVoted, setHasVoted] = useState(project.has_voted);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modais
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showLaunchKitModal, setShowLaunchKitModal] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);

  const isOwner = currentUserId === project.user_id;

  const authorInitial = project.author_email?.charAt(0).toUpperCase() || "?";
  const authorName = project.author_email?.split("@")[0] || "Criador";

  const handleUpvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    const prev = { upvotes, hasVoted };
    // Optimistic update
    setHasVoted(!hasVoted);
    setUpvotes(v => hasVoted ? v - 1 : v + 1);

    try {
      const res = await fetch(`/api/showcase/${project.id}/upvote`, { method: "POST" });
      if (!res.ok) {
        setUpvotes(prev.upvotes);
        setHasVoted(prev.hasVoted);
      }
    } catch {
      setUpvotes(prev.upvotes);
      setHasVoted(prev.hasVoted);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tens a certeza que queres remover este projeto?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/showcase/${project.id}`, { method: "DELETE" });
      if (res.ok && onDelete) onDelete(project.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
        className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          {/* Screenshot / Placeholder */}
          <div className="relative h-44 bg-gradient-to-br from-muted/80 to-muted overflow-hidden">
            {project.screenshot_url ? (
              <img
                src={project.screenshot_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary/50" />
                </div>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 text-xs font-semibold text-foreground">
                {project.category}
              </span>
            </div>

            {/* Delete button (owner only) */}
            {isOwner && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 rounded-xl bg-destructive/90 hover:bg-destructive flex items-center justify-center text-white transition-colors shadow-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {authorInitial}
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate">{authorName}</span>
              {isOwner && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Meu</span>
              )}
            </div>

            {/* Title & Tagline */}
            <div>
              <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted/80 border border-border/40 text-muted-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Toolbar & Footer */}
        <div className="p-4 pt-0 space-y-3 mt-auto">
          {/* Quick Actions (Comments, Badge, IA Kit) */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/40">
            <button
              onClick={() => setShowCommentsDrawer(true)}
              className="px-2 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center justify-center gap-1 transition"
              title="Feedback e Comentários"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Feedback</span>
            </button>

            <button
              onClick={() => setShowBadgeModal(true)}
              className="px-2 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center justify-center gap-1 transition"
              title="Obter Badge de Lançamento"
            >
              <Code2 className="w-3.5 h-3.5 text-orange-500" />
              <span>Badge</span>
            </button>

            <button
              onClick={() => setShowLaunchKitModal(true)}
              className="px-2 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center justify-center gap-1 transition"
              title="Gerar Posts Virais com IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Kit IA</span>
            </button>
          </div>

          {/* Footer: Upvote + Visit */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleUpvote}
              disabled={isVoting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                hasVoted
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-muted/60 hover:bg-muted text-foreground border border-border/50 hover:border-primary/40"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasVoted ? "voted" : "not-voted"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronUp className={`h-4 w-4 ${hasVoted ? "" : "text-muted-foreground"}`} />
                </motion.div>
              </AnimatePresence>
              <span>{upvotes}</span>
            </motion.button>

            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground border border-border/50 hover:border-primary text-xs font-semibold transition-all group/btn"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visitar
            </a>
          </div>

          {/* ViralBook badge */}
          <div className="flex items-center gap-1 justify-center pt-1">
            <Zap className="h-3 w-3 text-primary/40" />
            <span className="text-[10px] text-muted-foreground/50 font-medium">Powered by ViralBook AI</span>
          </div>
        </div>
      </motion.div>

      {/* Modais e Drawers */}
      <ShowcaseBadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        projectId={project.id}
        projectTitle={project.title}
      />

      <ShowcaseLaunchKitModal
        isOpen={showLaunchKitModal}
        onClose={() => setShowLaunchKitModal(false)}
        projectId={project.id}
        projectTitle={project.title}
      />

      <ShowcaseCommentsDrawer
        isOpen={showCommentsDrawer}
        onClose={() => setShowCommentsDrawer(false)}
        projectId={project.id}
        projectTitle={project.title}
        currentUserId={currentUserId || ""}
      />
    </>
  );
}
