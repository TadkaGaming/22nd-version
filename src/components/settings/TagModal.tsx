import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { Tag } from '@/contexts/TagsContext';

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, categoryId: string, description: string) => void;
  tag?: Tag | null;
}

export const TagModal = ({ open, onClose, onSave, tag }: TagModalProps) => {
  const { categories } = useCategoriesContext();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setCategoryId(tag.categoryId);
      setDescription(tag.description);
    } else {
      setName('');
      setCategoryId('');
      setDescription('');
    }
  }, [tag, open]);

  const handleSave = () => {
    if (name.trim() && categoryId) {
      onSave(name.trim(), categoryId, description.trim());
      onClose();
    }
  };

  const isEditing = !!tag;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit tag' : 'New tag'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag name</Label>
            <Input
              id="tag-name"
              placeholder="Name your tag"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-category">Tag type (Category)</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No categories available. Create a category first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-description">Description</Label>
            <Textarea
              id="tag-description"
              placeholder="Describe this tag..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || !categoryId}
          >
            {isEditing ? 'Save' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
