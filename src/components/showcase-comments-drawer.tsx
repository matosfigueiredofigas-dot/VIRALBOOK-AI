"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, X, Loader2, User } from "lucide-react";

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_email: string;
}

interface ShowcaseCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  currentUserId: string;
}

export function ShowcaseCommentsDrawer({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  currentUserId,
}: ShowcaseCommentsDrawerProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/showcase/${projectId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao publicar comentário");
      }

      const createdComment = await res.json();
      setComments((prev) => [...prev, createdComment]);
      setNewComment("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border-l border-border w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Feedback & Discussão</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {projectTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Comentários */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs font-medium">Nenhum comentário ainda.</p>
                <p className="text-[11px]">Seja o primeiro a dar feedback construtivo sobre esta app!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-muted/40 border border-border/60 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {comment.author_email.split("@")[0]}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(comment.created_at).toLocaleDateString("pt-PT")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Formulário de Novo Comentário */}
        <form onSubmit={handleSendComment} className="pt-4 border-t border-border space-y-2">
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escreva um feedback construtivo..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
