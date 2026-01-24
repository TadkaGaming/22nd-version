import { Calendar } from 'lucide-react';

const DayView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Day View</h1>
          <p className="text-muted-foreground">Daily trading analysis and breakdown</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl">
        <p className="text-muted-foreground">Day View content coming soon...</p>
      </div>
    </div>
  );
};

export default DayView;
