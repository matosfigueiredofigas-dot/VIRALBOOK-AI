"use client";

import { useState, useEffect } from "react";
import { Key, Save, Loader2, RefreshCw, Zap, AlertTriangle, XCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiKey {
  key_name: string;
  key_value: string;
}

interface ProviderStatus {
  name: string;
  key_name: string;
  status: 'online' | 'offline' | 'no_key' | 'error';
  latency_ms?: number;
  error?: string;
}

export function ApiKeysManager() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ProviderStatus>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [testingAll, setTestingAll] = useState(false);

  const keyDefinitions = [
    { id: "GROQ_API_KEY", label: "Groq API Key", role: "IA Principal", placeholder: "gsk_...", testable: true },
    { id: "GEMINI_API_KEY", label: "Gemini API Key", role: "IA Fallback 1", placeholder: "AIzaSy...", testable: true },
    { id: "GLM_API_KEY", label: "GLM API Key", role: "Zhipu AI · Fallback 2", placeholder: "id.secret...", testable: false },
    { id: "OPENAI_API_KEY", label: "OpenAI API Key", role: "GPT · Futuro", placeholder: "sk-...", testable: true },
    { id: "ANTHROPIC_API_KEY", label: "Anthropic API Key", role: "Claude · Futuro", placeholder: "sk-ant-...", testable: true },
    { id: "RESEND_API_KEY", label: "Resend API Key", role: "Envio de Emails", placeholder: "re_...", testable: true },
    { id: "HOTMART_WEBHOOK_TOKEN", label: "Hotmart Webhook Token", role: "Pagamentos", placeholder: "Token...", testable: false }
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

  async function testAllProviders() {
    setTestingAll(true);
    try {
      const res = await fetch("/api/admin/ai-status");
      const data = await res.json();
      if (data.providers) {
        const newStatuses: Record<string, ProviderStatus> = {};
        data.providers.forEach((p: ProviderStatus) => {
          newStatuses[p.key_name] = p;
        });
        setStatuses(newStatuses);
      }
    } catch (error) {
      console.error("Erro ao testar provedores", error);
    }
    setTestingAll(false);
  }

  async function testSingleProvider(keyName: string) {
    setTesting(keyName);
    try {
      const res = await fetch(`/api/admin/ai-status?test=${keyName}`);
      const data = await res.json();
      if (data.providers?.[0]) {
        setStatuses(prev => ({ ...prev, [keyName]: data.providers[0] }));
      }
    } catch (error) {
      console.error("Erro ao testar", error);
    }
    setTesting(null);
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
    } catch (error) {
      console.error("Erro ao salvar", error);
    }
    setSaving(null);
  }

  function handleChange(keyName: string, value: string) {
    setKeys(prev => ({ ...prev, [keyName]: value }));
  }

  function getStatusBadge(keyName: string, testable: boolean) {
    const status = statuses[keyName];
    if (!status) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-white/30 font-medium">
          <span className="w-2 h-2 rounded-full bg-white/20" />
          Não testado
        </span>
      );
    }

    switch (status.status) {
      case 'online':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online · {status.latency_ms}ms
          </span>
        );
      case 'no_key':
        return (
          <span className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium">
            <AlertTriangle className="h-3 w-3" />
            Sem chave
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <XCircle className="h-3 w-3" />
            Erro {status.error || ''}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <XCircle className="h-3 w-3" />
            Offline
          </span>
        );
    }
  }

  // Contadores de resumo
  const onlineCount = Object.values(statuses).filter(s => s.status === 'online').length;
  const errorCount = Object.values(statuses).filter(s => s.status === 'error').length;
  const noKeyCount = Object.values(statuses).filter(s => s.status === 'no_key').length;
  const hasStatuses = Object.keys(statuses).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Gestão Central de APIs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure as chaves das integrações. Os valores aqui têm prioridade sobre o Vercel.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadKeys} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recarregar
          </Button>
          <Button size="sm" onClick={testAllProviders} disabled={testingAll} className="bg-emerald-600 hover:bg-emerald-700">
            {testingAll ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Testar Tudo
          </Button>
        </div>
      </div>

      {/* Status Resumo */}
      {hasStatuses && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-emerald-400">{onlineCount}</div>
            <div className="text-xs text-emerald-400/70 font-medium mt-1">Online</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-400">{noKeyCount}</div>
            <div className="text-xs text-yellow-400/70 font-medium mt-1">Sem Chave</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-red-400">{errorCount}</div>
            <div className="text-xs text-red-400/70 font-medium mt-1">Erro</div>
          </div>
        </div>
      )}

      {/* Lista de Chaves */}
      {loading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          A carregar chaves seguras...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyDefinitions.map((def) => (
            <div key={def.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-white/90">{def.label}</label>
                  <p className="text-xs text-white/40 mt-0.5">{def.role}</p>
                </div>
                {getStatusBadge(def.id, def.testable)}
              </div>
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
                  title="Guardar"
                >
                  {saving === def.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
                {def.testable && (
                  <Button 
                    variant="outline"
                    onClick={() => testSingleProvider(def.id)}
                    disabled={testing === def.id}
                    className="shrink-0"
                    title="Testar conexão"
                  >
                    {testing === def.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
