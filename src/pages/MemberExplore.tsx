import React, { useState, useMemo } from "react";
import { Search, Grid3X3, List } from "lucide-react";
import { collections } from "@/data/collections";
import { Collection } from "@/types/collection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MemberExplore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories from collections
  const categories = useMemo(() => {
    const cats = collections.map((collection) => collection.name.split(" ")[0]).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, []);

  // Filter collections based on search and category
  const filteredCollections = useMemo(() => {
    return collections.filter((collection) => {
      const matchesSearch =
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.configs?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        collection.name.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleCollectionClick = (collection: Collection) => {
    // TODO: Navigate to collection detail page
    console.log("Collection clicked:", collection.name);
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder="컬렉션 이름이나 설명으로 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-12 pl-10 text-base"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="text-sm"
              >
                {category === "all" ? "전체" : category}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className="p-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="p-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          {filteredCollections.length}개의 컬렉션을 찾았습니다
        </p>
      </div>

      {/* Collections Grid/List */}
      {filteredCollections.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <h3 className="mb-2 text-lg font-semibold">검색 결과가 없습니다</h3>
            <p>다른 검색어나 카테고리를 시도해보세요</p>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-4"
          }
        >
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              viewMode={viewMode}
              onClick={() => handleCollectionClick(collection)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CollectionCardProps {
  collection: Collection;
  viewMode: "grid" | "list";
  onClick: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, viewMode, onClick }) => {
  const itemCount = collection.item_types?.length || 0;
  const missionCount = collection.missions?.length || 0;

  return (
    <Card
      className={`focus:ring-primary/20 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:outline-none active:scale-[0.98] ${viewMode === "list" ? "flex flex-row" : "flex flex-col"} `}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${collection.name} 컬렉션 보기`}
    >
      {/* Image */}
      <div
        className={`bg-muted relative overflow-hidden ${
          viewMode === "list" ? "h-24 w-24 flex-shrink-0 sm:h-32 sm:w-32" : "aspect-square"
        } `}
      >
        {collection.configs?.img_url ? (
          <img
            src={collection.configs?.img_url}
            alt={collection.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="from-primary/10 to-secondary/10 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <div className="text-muted-foreground text-4xl font-bold">
              {collection.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Badge for item count */}
        {itemCount > 0 && (
          <div className="bg-background/80 absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
            {itemCount}개
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-between ${viewMode === "list" ? "ml-4 flex-1" : "flex-1"} `}
      >
        <CardHeader className={viewMode === "list" ? "p-4 pb-2" : "p-4 pb-2"}>
          <CardTitle className="line-clamp-2 text-lg font-semibold">{collection.name}</CardTitle>
          {collection.configs?.description && (
            <CardDescription className="line-clamp-2 text-sm">
              {collection.configs?.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className={viewMode === "list" ? "p-4 pt-0" : "p-4 pt-0"}>
          {/* Collection Stats */}
          <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
            {itemCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <span>{itemCount}개 아이템</span>
              </div>
            )}
            {missionCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="bg-secondary h-2 w-2 rounded-full"></div>
                <span>{missionCount}개 미션</span>
              </div>
            )}
          </div>

          {/* Layers and Attributes */}
          {collection.layer_types && collection.layer_types.length > 0 && (
            <div className="mb-3">
              <div className="text-muted-foreground mb-1 text-xs">레이어</div>
              <div className="flex flex-wrap gap-1">
                {collection.layer_types.slice(0, 3).map((layer, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs"
                  >
                    {layer}
                  </span>
                ))}
                {collection.layer_types.length > 3 && (
                  <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                    +{collection.layer_types.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Market indicator */}
          {collection.market && collection.market.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>마켓 활성화</span>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default MemberExplore;
