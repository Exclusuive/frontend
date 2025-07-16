import { useState, useMemo } from "react";
import { Search, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetAllCollections } from "@/hooks/useGetCollections";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CollectionDetail from "@/components/CollectionDetail";
import { Collection } from "@/types/collection";

export default function Explore() {
  const { collections, isPending, error, refetch } = useGetAllCollections();
  const [searchTerm, setSearchTerm] = useState("");
  const [openCollectionDetail, setOpenCollectionDetail] = useState<boolean>(false);

  // Filter collections based on search term
  const filteredCollections = useMemo(() => {
    if (!collections || !Array.isArray(collections)) return [];

    return collections.filter(
      (collection: Collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [collections, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading collections</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Explore Collections</h1>
        <p className="text-muted-foreground">Discover and explore amazing collections</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          {filteredCollections.length} collection{filteredCollections.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Collections Grid/List */}
      {filteredCollections.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">No collections found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCollections.map((collection: Collection) => (
            <Dialog
              key={collection.collection_id}
              open={openCollectionDetail}
              onOpenChange={setOpenCollectionDetail}
            >
              <DialogTrigger asChild onClick={() => setOpenCollectionDetail(true)}>
                <Card
                  key={collection.collection_id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3 aspect-square overflow-hidden rounded-lg">
                      <img
                        src={collection.img_url || ""}
                        alt={collection.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{collection.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(collection.created_at)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    {collection.category && (
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {collection.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              {openCollectionDetail && <CollectionDetail collectionId={collection.collection_id} />}
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
