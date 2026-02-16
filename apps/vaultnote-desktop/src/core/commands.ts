import type { CommandItem } from "./models";

export class CommandRegistry {
  private commands = new Map<string, CommandItem>();

  clear(): void {
    this.commands.clear();
  }

  register(command: CommandItem): void {
    this.commands.set(command.id, command);
  }

  all(): CommandItem[] {
    return Array.from(this.commands.values());
  }

  search(query: string): CommandItem[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.all();
    }
    return this.all().filter((item) => {
      return item.title.toLowerCase().includes(q) || item.group.toLowerCase().includes(q);
    });
  }
}
