import { Plus, Filter, Check } from 'lucide-react';
import { useDiaryContext } from '@/contexts/DiaryContext';
import { useFilteredTradesContext } from '@/contexts/TradesContext';
import { useGlobalFilters } from '@/contexts/GlobalFiltersContext';
import { calculateTradeMetrics } from '@/types/trade';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const DiaryNotesList = () => {
  const { 
    selectedFolderId, 
    selectedNoteId, 
    setSelectedNoteId, 
    getNotesForFolder,
    createNote,
    folders,
  } = useDiaryContext();
  const { trades } = useFilteredTradesContext();
  const { formatCurrency } = useGlobalFilters();

  const notes = getNotesForFolder(selectedFolderId);
  const currentFolder = folders.find(f => f.id === selectedFolderId);

  const handleNewNote = () => {
    createNote({
      title: 'Untitled Note',
      content: '',
    });
  };

  // Get trade info for a note
  const getTradeInfo = (linkedTradeId: string | null) => {
    if (!linkedTradeId) return null;
    const trade = trades.find(t => t.id === linkedTradeId);
    if (!trade) return null;
    const metrics = calculateTradeMetrics(trade);
    return { trade, metrics };
  };

  return (
    <div className="h-full flex flex-col border-r border-border/50 bg-card/20">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-primary hover:text-primary"
          onClick={handleNewNote}
        >
          <Plus className="h-4 w-4" />
          New note
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <Checkbox id="select-all" />
        <label htmlFor="select-all" className="text-sm text-muted-foreground">
          Select all
        </label>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {notes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Click "New note" to create one</p>
            </div>
          ) : (
            notes.map(note => {
              const isSelected = selectedNoteId === note.id;
              const tradeInfo = getTradeInfo(note.linkedTradeId);
              const netPnl = tradeInfo?.metrics.netPnl;

              return (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full text-left p-4 transition-colors",
                    isSelected 
                      ? "bg-primary/10" 
                      : "hover:bg-muted/30"
                  )}
                >
                  <div className="font-medium text-sm truncate">
                    {note.title}
                  </div>
                  {(note.linkedTradeId || note.linkedDate) && netPnl !== undefined && (
                    <div className={cn(
                      "text-sm font-medium mt-1",
                      netPnl >= 0 ? "text-profit" : "text-loss"
                    )}>
                      NET P&L: {netPnl >= 0 ? '' : '-'}${Math.abs(netPnl).toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(note.createdAt), 'MM/dd/yyyy')}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
