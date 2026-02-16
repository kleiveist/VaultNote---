import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { load as parseYaml } from "js-yaml";
import { marked } from "marked";
import { CommandRegistry } from "./core/commands";
import { loadUIState, saveUIState } from "./core/persistence";
import type { CommandItem, EditorTab, ModuleId, TreeNode, UIState } from "./core/models";
import { sampleTabs, sampleTree, sampleVault } from "./data/sample-vault";

marked.setOptions({ gfm: true, breaks: false });

const MODULES: Array<{ id: ModuleId; label: string; short: string }> = [
  { id: "dashboard", label: "Dashboard", short: "DB" },
  { id: "editor", label: "Editor", short: "ED" },
  { id: "graph", label: "Graph", short: "GR" }
];

const TREE_STATE_KEY = "vaultnote.ui.tree.expanded";

interface ParsedContent {
  frontmatter: string | null;
  body: string;
  error: string | null;
}

function parseMarkdownDocument(content: string): ParsedContent {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: null, body: content, error: null };
  }

  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  try {
    parseYaml(frontmatter);
    return { frontmatter, body, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid YAML frontmatter";
    return { frontmatter, body, error: message };
  }
}

function flattenFiles(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      out.push(node);
    }
    if (node.children) {
      out.push(...flattenFiles(node.children));
    }
  }
  return out;
}

function buildDefaultContent(path: string): string {
  const parts = path.split("/");
  const fileName = parts.length > 0 ? parts[parts.length - 1] : "New Note";
  return `---\nProject: VAULTNOTE\nPath: ${path}\n---\n\n# ${fileName}\n\nStart writing here.`;
}

function TreeView(props: {
  nodes: TreeNode[];
  expanded: Set<string>;
  selectedPath: string | null;
  onToggle: (nodeId: string) => void;
  onSelectFile: (path: string, title: string) => void;
}) {
  const { nodes, expanded, selectedPath, onToggle, onSelectFile } = props;

  return (
    <ul className="tree">
      {nodes.map((node) => {
        const isFolder = node.type === "folder";
        const isOpen = isFolder ? expanded.has(node.id) : false;
        const isSelected = selectedPath === node.path;

        return (
          <li key={node.id}>
            <button
              className={`tree-row ${isSelected ? "selected" : ""}`}
              onClick={() => {
                if (isFolder) {
                  onToggle(node.id);
                  return;
                }
                onSelectFile(node.path, node.name);
              }}
            >
              <span className="tree-icon">{isFolder ? (isOpen ? "v" : ">") : "-"}</span>
              <span className="tree-name">{node.name}</span>
            </button>

            {isFolder && isOpen && node.children && (
              <TreeView
                nodes={node.children}
                expanded={expanded}
                selectedPath={selectedPath}
                onToggle={onToggle}
                onSelectFile={onSelectFile}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function App() {
  const persisted = useMemo(() => loadUIState(), []);
  const [activeModule, setActiveModule] = useState<ModuleId>(persisted.activeModule ?? "editor");
  const [explorerCollapsed, setExplorerCollapsed] = useState<boolean>(
    persisted.explorerCollapsed ?? false
  );
  const [tabs, setTabs] = useState<EditorTab[]>(sampleTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    persisted.activeTabId ?? sampleTabs[0]?.id ?? null
  );
  const [selectedPath, setSelectedPath] = useState<string | null>(sampleTabs[0]?.path ?? null);
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("code");
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [statusLine, setStatusLine] = useState("Ready");

  const initialExpanded = useMemo(() => {
    const raw = localStorage.getItem(TREE_STATE_KEY);
    if (!raw) {
      return new Set<string>(["folder-product"]);
    }
    try {
      return new Set<string>(JSON.parse(raw) as string[]);
    } catch {
      return new Set<string>(["folder-product"]);
    }
  }, []);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(initialExpanded);

  const commandRegistry = useMemo(() => new CommandRegistry(), []);
  const allFiles = useMemo(() => flattenFiles(sampleTree), []);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? null;

  useEffect(() => {
    localStorage.setItem(TREE_STATE_KEY, JSON.stringify(Array.from(expandedFolders.values())));
  }, [expandedFolders]);

  useEffect(() => {
    const state: UIState = {
      lastVaultId: sampleVault.id,
      activeModule,
      openTabIds: tabs.map((tab) => tab.id),
      activeTabId,
      explorerCollapsed
    };
    saveUIState(state);
  }, [activeModule, activeTabId, explorerCollapsed, tabs]);

  const openFileInTab = (path: string, title: string) => {
    const existing = tabs.find((tab) => tab.path === path);
    if (existing) {
      setActiveTabId(existing.id);
      setSelectedPath(path);
      setStatusLine(`Opened ${title}`);
      return;
    }

    const tab: EditorTab = {
      id: `tab-${path.replace(/[^a-zA-Z0-9]/g, "-")}`,
      title,
      path,
      content: buildDefaultContent(path),
      dirty: false
    };

    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
    setSelectedPath(path);
    setStatusLine(`Created ${title}`);
  };

  useEffect(() => {
    commandRegistry.clear();

    const commands: CommandItem[] = [
      {
        id: "general:toggle-preview",
        title: "Toggle Preview",
        group: "General",
        run: () => setPreviewMode((prev) => (prev === "code" ? "preview" : "code"))
      },
      {
        id: "general:collapse-explorer",
        title: "Toggle Explorer",
        group: "General",
        run: () => setExplorerCollapsed((prev) => !prev)
      },
      {
        id: "editor:save",
        title: "Save Active File",
        group: "Editor",
        run: () => {
          if (!activeTab) {
            return;
          }
          setTabs((prev) => prev.map((tab) => (tab.id === activeTab.id ? { ...tab, dirty: false } : tab)));
          setStatusLine(`Saved ${activeTab.title}`);
        }
      }
    ];

    for (const command of commands) {
      commandRegistry.register(command);
    }

    for (const file of allFiles) {
      commandRegistry.register({
        id: `file:open:${file.path}`,
        title: `Open ${file.name}`,
        group: "Files",
        run: () => openFileInTab(file.path, file.name)
      });
    }
  }, [activeTab, allFiles, commandRegistry, tabs]);

  const matchingCommands = useMemo(() => {
    return commandRegistry.search(commandQuery).slice(0, 12);
  }, [commandQuery, commandRegistry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const withCommand = event.ctrlKey || event.metaKey;

      if (withCommand && (event.key.toLowerCase() === "p" || event.key.toLowerCase() === "o")) {
        event.preventDefault();
        setCommandPaletteOpen(true);
        setCommandQuery("");
        return;
      }

      if (withCommand && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!activeTab) {
          return;
        }
        setTabs((prev) => prev.map((tab) => (tab.id === activeTab.id ? { ...tab, dirty: false } : tab)));
        setStatusLine(`Saved ${activeTab.title}`);
        return;
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setShowHelp(false);
        setShowSettings(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab]);

  const parsed = useMemo(() => parseMarkdownDocument(activeTab?.content ?? ""), [activeTab?.content]);
  const previewHtml = useMemo(() => {
    const html = marked.parse(parsed.body) as string;
    return DOMPurify.sanitize(html);
  }, [parsed.body]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-left">
          <button className="icon-btn" onClick={() => setExplorerCollapsed((prev) => !prev)} title="Toggle Explorer">
            []
          </button>
          <button className="icon-btn" title="Files">
            F
          </button>
          <button className="icon-btn" title="Search">
            S
          </button>
          <button className="icon-btn" title="Bookmarks">
            B
          </button>
        </div>

        <div className="top-right">
          <span className="status-chip">{statusLine}</span>
          <span className="status-chip">Vault: {sampleVault.name}</span>
        </div>
      </header>

      <main className="workspace">
        <aside className="nav-rail">
          {MODULES.map((module) => (
            <button
              key={module.id}
              className={`rail-btn ${activeModule === module.id ? "active" : ""}`}
              onClick={() => setActiveModule(module.id)}
              title={module.label}
            >
              <span>{module.short}</span>
            </button>
          ))}
        </aside>

        <section className={`explorer ${explorerCollapsed ? "collapsed" : ""}`}>
          <div className="explorer-header">
            <h2>Explorer</h2>
            <div className="explorer-actions">
              <button className="icon-btn" title="Edit">
                E
              </button>
              <button className="icon-btn" title="New">
                +
              </button>
              <button className="icon-btn" title="Sort">
                U
              </button>
              <button className="icon-btn" title="View">
                V
              </button>
              <button className="icon-btn" title="Close" onClick={() => setExplorerCollapsed(true)}>
                X
              </button>
            </div>
          </div>

          {explorerCollapsed ? (
            <div className="empty-state">Explorer collapsed</div>
          ) : sampleTree.length === 0 ? (
            <div className="empty-state">No files in vault...</div>
          ) : (
            <TreeView
              nodes={sampleTree}
              expanded={expandedFolders}
              selectedPath={selectedPath}
              onToggle={(nodeId) => {
                setExpandedFolders((prev) => {
                  const next = new Set(prev);
                  if (next.has(nodeId)) {
                    next.delete(nodeId);
                  } else {
                    next.add(nodeId);
                  }
                  return next;
                });
              }}
              onSelectFile={openFileInTab}
            />
          )}
        </section>

        <section className="editor-pane">
          <div className="tab-row">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.title}
                {tab.dirty ? " *" : ""}
              </button>
            ))}
          </div>

          <div className="editor-toolbar">
            <div className="history-buttons">
              <button className="icon-btn" title="Back">
                &larr;
              </button>
              <button className="icon-btn" title="Forward">
                &rarr;
              </button>
            </div>

            <div className="mode-buttons">
              <button
                className={`icon-btn ${previewMode === "code" ? "active" : ""}`}
                onClick={() => setPreviewMode("code")}
              >
                Code
              </button>
              <button
                className={`icon-btn ${previewMode === "preview" ? "active" : ""}`}
                onClick={() => setPreviewMode("preview")}
              >
                Preview
              </button>
            </div>
          </div>

          {!activeTab ? (
            <div className="empty-state">Select a file...</div>
          ) : previewMode === "code" ? (
            <textarea
              className="editor-textarea"
              value={activeTab.content}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTabs((prev) =>
                  prev.map((tab) =>
                    tab.id === activeTab.id ? { ...tab, content: nextValue, dirty: true } : tab
                  )
                );
              }}
            />
          ) : (
            <div className="preview-wrap">
              {parsed.error && (
                <div className="yaml-warning">Frontmatter warning: {parsed.error}</div>
              )}
              <article className="preview-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          )}
        </section>
      </main>

      <footer className="bottom-bar">
        <button className="vault-switcher">Vault: {sampleVault.name}</button>
        <div className="bottom-actions">
          <button className="icon-btn" onClick={() => setShowHelp(true)}>
            ?
          </button>
          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            S
          </button>
        </div>
      </footer>

      {(showHelp || showSettings) && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setShowHelp(false);
            setShowSettings(false);
          }}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>{showHelp ? "Help" : "Settings"}</h3>
            <p>
              {showHelp
                ? "Use Ctrl+P or Ctrl+O for command palette. Ctrl+S saves the active tab."
                : "Settings persistence and keymap customization are wired through JSON state next."}
            </p>
            <button className="icon-btn" onClick={() => { setShowHelp(false); setShowSettings(false); }}>
              Close
            </button>
          </div>
        </div>
      )}

      {commandPaletteOpen && (
        <div className="palette-backdrop" onClick={() => setCommandPaletteOpen(false)}>
          <div className="palette" onClick={(event) => event.stopPropagation()}>
            <input
              autoFocus
              className="palette-input"
              placeholder="Type a command or file..."
              value={commandQuery}
              onChange={(event) => setCommandQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const first = matchingCommands[0];
                  if (!first) {
                    return;
                  }
                  first.run();
                  setCommandPaletteOpen(false);
                }
              }}
            />
            <div className="palette-list">
              {matchingCommands.length === 0 ? (
                <div className="palette-empty">No command found.</div>
              ) : (
                matchingCommands.map((item) => (
                  <button
                    key={item.id}
                    className="palette-item"
                    onClick={() => {
                      item.run();
                      setCommandPaletteOpen(false);
                    }}
                  >
                    <span>{item.title}</span>
                    <small>{item.group}</small>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
