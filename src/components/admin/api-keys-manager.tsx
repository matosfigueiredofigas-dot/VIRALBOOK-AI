"use client";

import { useState, useEffect } from "react";
import { Key, Save, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiKey {
  key_name: string;
  key_value: string;
}

export function ApiKeysManager() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const keyDefinitions = [
    { id: "GROQ_API_KEY", label: "Groq API Key (IA Principal)", placeholder: "gsk_..." },
    { id: "GEMINI_API_KEY", label: "Gemini API Key (IA Fallback 1)", placeholder: "AIzaSy..." },
    { id: "GLM_API_KEY", label: "GLM API Key (Zhipu AI - Fallback 2)", placeholder: "id.secret..." },
    { id: "OPENAI_API_KEY", label: "OpenAI API Key (GPT - Futuro)", placeholder: "sk-..." },
    { id: "ANTHROPIC_API_KEY", label: "Anthropic API Key (Claude - Futuro)", placeholder: "sk-ant-..." },
    { id: "RESEND_API_KEY", label: "Resend API Key (Emails)", placeholder: "re_..." },
    { id: "HOTMART_WEBHOOK_TOKEN", label: "Hotmart Webhook Token", placeholder: "Token do Hotmart..." }
  ];

  async function loadKeys() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-keys");
      const data = await res.json();
      if (data.keys) {
        const newKeys: Record<string, string> = {};
        data.keys.forEach((k: ApiKey) => {
          newKeys[k.key_name] = k.key_value;
        });
        setKeys(newKeys);
      }
    } catch (error) {
      console.error("Erro ao carregar chaves", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function saveKey(keyName: string) {
    setSaving(keyName);
    try {
      await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name: keyName, key_value: keys[keyName] || "" })
      });
      // Poderiamos mostrar um toast de sucesso aqui
    } catch (error) {
      console.error("Erro ao salvar", error);
    }
    setSaving(null);
  }

  function handleChange(keyName: string, value: string) {
    setKeys(prev => ({ ...prev, [keyName]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Gestão Central de APIs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure as chaves das integrações. Os valores salvos aqui têm prioridade sobre o Vercel. Deixe vazio para usar a chave padrão do Vercel.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadKeys} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Recarregar
        </Button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          A carregar chaves seguras...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyDefinitions.map((def) => (
            <div key={def.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <label className="text-sm font-semibold text-white/90">{def.label}</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary focus:outline-none transition-colors"
                  placeholder={def.placeholder}
                  value={keys[def.id] || ""}
                  onChange={(e) => handleChange(def.id, e.target.value)}
                />
                <Button 
                  onClick={() => saveKey(def.id)}
                  disabled={saving === def.id}
                  className="shrink-0"
                >
                  {saving === def.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
