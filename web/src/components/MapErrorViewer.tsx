import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2 } from "lucide-react";
import {
  getLastMapError,
  getRecentMapErrors,
  subscribeMapErrors,
  clearMapErrors,
  type MapErrorPayload,
} from "@/lib/mapErrorLogger";

interface Props {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default";
}

export const MapErrorViewer = ({ variant = "outline", size = "sm" }: Props) => {
  const [last, setLast] = useState<MapErrorPayload | null>(getLastMapError());
  const [all, setAll] = useState<readonly MapErrorPayload[]>(getRecentMapErrors());

  useEffect(() => {
    const unsub = subscribeMapErrors(() => {
      setLast(getLastMapError());
      setAll(getRecentMapErrors());
    });
    return unsub;
  }, []);

  if (!last) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} data-testid="view-last-map-error">
          <FileText className="w-4 h-4 mr-1" /> View last map error
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Last map error
            <Badge variant="secondary">{all.length} stored</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span className="font-mono">{last.source}{last.action ? ` · ${last.action}` : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">When</span>
              <span className="font-mono">{new Date(last.timestamp).toLocaleString()}</span>
            </div>
            {typeof last.nodeCount === "number" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nodes</span>
                <span className="font-mono">{last.nodeCount}{last.selectedId ? ` · selected ${last.selectedId}` : ""}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Message</p>
            <pre className="text-xs bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 overflow-auto whitespace-pre-wrap">
              {last.name}: {last.message}
            </pre>
          </div>

          <ScrollArea className="h-48 rounded-lg border bg-background">
            <pre className="text-[11px] p-3 font-mono whitespace-pre-wrap">
{JSON.stringify(last, null, 2)}
            </pre>
          </ScrollArea>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">Persisted to localStorage · last {all.length} of 20</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearMapErrors()}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Clear log
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
