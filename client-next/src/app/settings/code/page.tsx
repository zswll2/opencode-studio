"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/context";
import { getApiBaseUrl, getPaths, getProjectRules, getSystemTools } from "@/lib/api";
import type { PathsInfo, RulesResponse, SystemToolInfo } from "@/types";
import { PageHelp } from "@/components/page-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const LSP_LIST = [
  { id: "typescript", label: "TypeScript", tool: "typescript-language-server" },
  { id: "eslint", label: "ESLint", tool: "eslint" },
  { id: "pyright", label: "Pyright", tool: "pyright" },
  { id: "gopls", label: "Go (gopls)", tool: "gopls" },
  { id: "rust", label: "Rust", tool: "rust-analyzer" },
  { id: "clangd", label: "Clangd", tool: "clangd" },
  { id: "dart", label: "Dart", tool: "dart" },
  { id: "jdtls", label: "Java", tool: "jdtls" },
  { id: "kotlin-ls", label: "Kotlin", tool: "kotlin-language-server" },
  { id: "lua-ls", label: "Lua", tool: "lua-language-server" },
  { id: "ocaml-lsp", label: "OCaml", tool: "ocamllsp" },
  { id: "nixd", label: "Nix", tool: "nixd" },
  { id: "sourcekit-lsp", label: "Swift", tool: "sourcekit-lsp" },
];

const FORMATTER_LIST = [
  { id: "prettier", label: "Prettier", tool: "prettier" },
  { id: "biome", label: "Biome", tool: "biome" },
  { id: "gofmt", label: "gofmt", tool: "gofmt" },
  { id: "rustfmt", label: "rustfmt", tool: "rustfmt" },
  { id: "ruff", label: "ruff", tool: "ruff" },
  { id: "clang-format", label: "clang-format", tool: "clang-format" },
  { id: "ktlint", label: "ktlint", tool: "ktlint" },
  { id: "deno", label: "deno fmt", tool: "deno" },
  { id: "mix", label: "mix format", tool: "mix" },
  { id: "zig", label: "zig fmt", tool: "zig" },
];

export default function CodeSettingsPage() {
  const { config, saveConfig } = useApp();
  const [tools, setTools] = useState<SystemToolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [paths, setPaths] = useState<PathsInfo | null>(null);
  const [rules, setRules] = useState<RulesResponse | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [apiBaseUrl, pathsData, rulesData, toolsData] = await Promise.all([
          getApiBaseUrl(),
          getPaths(),
          getProjectRules(),
          getSystemTools(),
        ]);
        setBackendUrl(apiBaseUrl);
        setPaths(pathsData);
        setRules(rulesData);
        setTools(toolsData);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load code settings metadata");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, []);

  const toolMap = useMemo(() => {
    const map = new Map<string, SystemToolInfo>();
    tools.forEach((tool) => map.set(tool.name, tool));
    return map;
  }, [tools]);

  const updateLsp = (id: string, next: any) => {
    if (!config) return;
    saveConfig({
      ...config,
      lsp: {
        ...(config.lsp || {}),
        [id]: { ...(config.lsp?.[id] || {}), ...next },
      },
    });
  };

  const updateFormatter = (id: string, next: any) => {
    if (!config) return;
    saveConfig({
      ...config,
      formatter: {
        ...(config.formatter || {}),
        [id]: { ...(config.formatter?.[id] || {}), ...next },
      },
    });
  };

  return (
    <div className="space-y-4">
      <PageHelp title="Code Settings" docUrl="https://opencode.ai/docs" docTitle="LSP & Formatter Manager" />

      <Card>
        <CardHeader>
          <CardTitle>Resolution Context</CardTitle>
          <p className="text-sm text-muted-foreground">
            This shows the live backend URL, the active OpenCode config path, and the rules file the backend resolved.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Backend URL</div>
            <div className="font-mono break-all">{loading ? "Loading..." : backendUrl || "Unknown"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Active Config</div>
            <div className="font-mono break-all">{loading ? "Loading..." : paths?.current || "Unknown"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Detected Config</div>
            <div className="font-mono break-all">{loading ? "Loading..." : paths?.detected || "None"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Project Rules</div>
            <div className="font-mono break-all">{loading ? "Loading..." : rules?.path || "None"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Rules Source</div>
            <div className="font-mono break-all">{loading ? "Loading..." : rules?.source || "none"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">PATH Strategy</div>
            <div className="font-mono break-all">Backend shell lookup (`which` on WSL/Linux, `where` on Windows)</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LSP Servers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detection uses the backend shell PATH. If a binary lives in `~/.nvm`, `~/.local/bin`, `~/.cargo/bin`, or
            similar, start OpenCode Studio from a shell that exports that PATH.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {LSP_LIST.map((item) => {
            const cfg = config?.lsp?.[item.id] as any;
            const tool = toolMap.get(item.tool);
            return (
              <div key={item.id} className="grid gap-3 md:grid-cols-[1.4fr_0.6fr_0.4fr_1.6fr] md:items-center">
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.id}</div>
                </div>
                <div className="space-y-1">
                  <Badge variant={tool?.available ? "secondary" : "outline"}>
                    {loading ? "Checking" : tool?.available ? "Detected in PATH" : "Not Found in PATH"}
                  </Badge>
                  <div className="text-[11px] text-muted-foreground break-all">
                    {loading
                      ? "Looking up via backend `which`"
                      : tool?.available
                        ? tool.path
                        : `Searched via backend \`which ${item.tool}\``}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!cfg?.disabled}
                    onCheckedChange={(checked) => updateLsp(item.id, { disabled: !checked })}
                  />
                  <span className="text-xs text-muted-foreground">Enabled</span>
                </div>
                <Input
                  placeholder="Command override"
                  value={Array.isArray(cfg?.command) ? cfg.command.join(" ") : ""}
                  onChange={(e) => updateLsp(item.id, { command: e.target.value.split(" ").filter(Boolean) })}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <PageHelp title="Code Settings" docUrl="https://opencode.ai/docs" docTitle="LSP & Formatter Manager" />
          <CardTitle>Formatters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {FORMATTER_LIST.map((item) => {
            const cfg = config?.formatter?.[item.id] as any;
            const tool = toolMap.get(item.tool);
            return (
              <div key={item.id} className="grid gap-3 md:grid-cols-[1.4fr_0.6fr_0.4fr_1.6fr] md:items-center">
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.id}</div>
                </div>
                <div className="space-y-1">
                  <Badge variant={tool?.available ? "secondary" : "outline"}>
                    {loading ? "Checking" : tool?.available ? "Detected in PATH" : "Not Found in PATH"}
                  </Badge>
                  <div className="text-[11px] text-muted-foreground break-all">
                    {loading
                      ? "Looking up via backend `which`"
                      : tool?.available
                        ? tool.path
                        : `Searched via backend \`which ${item.tool}\``}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!cfg?.disabled}
                    onCheckedChange={(checked) => updateFormatter(item.id, { disabled: !checked })}
                  />
                  <span className="text-xs text-muted-foreground">Enabled</span>
                </div>
                <Input
                  placeholder="Command override"
                  value={Array.isArray(cfg?.command) ? cfg.command.join(" ") : ""}
                  onChange={(e) => updateFormatter(item.id, { command: e.target.value.split(" ").filter(Boolean) })}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
