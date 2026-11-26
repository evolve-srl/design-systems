import { useMemo } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { buildClientReplyMarkdown } from "@/data/sites";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportReplyDialog({ open, onOpenChange }: ExportReplyDialogProps) {
  const markdown = useMemo(() => buildClientReplyMarkdown(), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Client reply copied as Markdown.");
    } catch {
      toast.error("Could not access clipboard — please copy from the text area.");
    }
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "evolve-5-sites-pre-code-delivery.md";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded evolve-5-sites-pre-code-delivery.md");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-editorial text-2xl font-medium">
            Client Reply Package (All 5 Sites)
          </DialogTitle>
          <DialogDescription>
            Ready-to-send Markdown summary containing Section 6 deliverables for PrivacyMasters,
            Evolve, TuttoAltopiano, Oblivio and Medicleo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy Markdown
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download .md
          </Button>
        </div>

        <textarea
          readOnly
          value={markdown}
          aria-label="Client reply Markdown text"
          className="mt-2 min-h-[360px] flex-1 resize-none rounded-md border border-border bg-secondary/40 p-3 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </DialogContent>
    </Dialog>
  );
}