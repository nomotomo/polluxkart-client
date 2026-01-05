import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Shirt, 
  Home, 
  Apple, 
  Sparkles, 
  Dumbbell, 
  ChevronRight,
  Grid3X3,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { categories } from '../../data/products';

const iconMap = {
  Laptop,
  Shirt,
  Home,
  Apple,
  Sparkles,
  Dumbbell,
};

const CategoriesModal = ({ trigger, open, onOpenChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen) {
      setSelectedCategory(null);
    }
  };

  const actualOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            Browse All Categories
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[60vh]">
          {/* Categories List - Left Panel */}
          <ScrollArea className="w-1/3 border-r border-border">
            <div className="p-2">
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon] || Laptop;
                const isSelected = selectedCategory?.id === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      isSelected 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : 'hover:bg-muted border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.count} products
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Subcategories - Right Panel */}
          <div className="flex-1 bg-background">
            {selectedCategory ? (
              <ScrollArea className="h-full">
                <div className="p-6">
                  {/* Category Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const IconComponent = iconMap[selectedCategory.icon] || Laptop;
                        return (
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {selectedCategory.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedCategory.description}
                        </p>
                      </div>
                    </div>
                    <Link 
                      to={`/store?category=${selectedCategory.id}`}
                      onClick={() => handleOpenChange(false)}
                    >
                      <Button variant="outline" size="sm" className="mt-2">
                        View All {selectedCategory.name}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <Separator className="mb-6" />

                  {/* Subcategories Grid */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">
                      Subcategories
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedCategory.subcategories?.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/store?category=${selectedCategory.id}&sub=${sub.id}`}
                          onClick={() => handleOpenChange(false)}
                          className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                          <div>
                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {sub.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {sub.count} items
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Select a Category
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Choose a category from the left to view its subcategories and browse products.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with quick links */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {categories.length} categories • {categories.reduce((acc, cat) => acc + cat.count, 0)}+ products
            </p>
            <Link to="/store" onClick={() => handleOpenChange(false)}>
              <Button size="sm" className="bg-primary hover:bg-primary-dark">
                Browse All Products
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesModal;
