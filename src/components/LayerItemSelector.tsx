import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionItem } from "@/types/collection";
import { getItemsByLayer } from "@/lib/items";

interface LayerItemSelectorProps {
  layers: string[];
  items: CollectionItem[];
  onItemSelect: (item: CollectionItem) => void;
  selectedLayer?: string;
  selectedItem?: string;
  onLayerChange?: (layer: string) => void;
  placeholder?: {
    layer?: string;
    item?: string;
  };
}

const LayerItemSelector: React.FC<LayerItemSelectorProps> = ({
  layers,
  items,
  onItemSelect,
  selectedLayer: externalSelectedLayer,
  selectedItem: externalSelectedItem,
  onLayerChange,
  placeholder = {},
}) => {
  const [internalSelectedLayer, setInternalSelectedLayer] = useState<string>("");
  const [internalSelectedItem, setInternalSelectedItem] = useState<string>("");

  // Use external state if provided, otherwise use internal state
  const selectedLayer = externalSelectedLayer ?? internalSelectedLayer;
  const selectedItem = externalSelectedItem ?? internalSelectedItem;

  // Get items for the selected layer
  const itemsInSelectedLayer = selectedLayer ? getItemsByLayer(items, selectedLayer) : [];

  const handleLayerChange = (layer: string) => {
    if (onLayerChange) {
      onLayerChange(layer);
    } else {
      setInternalSelectedLayer(layer);
      setInternalSelectedItem(""); // Reset item selection when layer changes
    }
  };

  const handleItemChange = (itemAddress: string) => {
    const item = items.find((item) => item.name === itemAddress);
    if (item) {
      if (externalSelectedItem === undefined) {
        setInternalSelectedItem(itemAddress);
      }
      onItemSelect(item);
    }
  };

  return (
    <div className="grid gap-4">
      {/* Layer Selection */}
      <div className="grid gap-2">
        <label htmlFor="layer-select" className="text-sm font-medium">
          Select Layer
        </label>
        <Select value={selectedLayer} onValueChange={handleLayerChange}>
          <SelectTrigger className="w-full py-2">
            <SelectValue placeholder={placeholder.layer || "Choose a layer"} />
          </SelectTrigger>
          <SelectContent>
            {layers.map((layer) => (
              <SelectItem key={layer} value={layer}>
                <span>{layer}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Item Selection */}
      {selectedLayer && (
        <>
          {itemsInSelectedLayer.length > 0 ? (
            <div className="grid gap-2">
              <label htmlFor="item-select" className="text-sm font-medium">
                Select Item from {selectedLayer}
              </label>
              <Select value={selectedItem} onValueChange={handleItemChange}>
                <SelectTrigger className="w-full py-2">
                  <SelectValue
                    placeholder={placeholder.item || `Choose an item from ${selectedLayer}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {itemsInSelectedLayer.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      <div className="flex items-center gap-2">
                        {item.img_url && (
                          <img
                            src={item.img_url}
                            alt={item.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No items available in this layer</div>
          )}
        </>
      )}
    </div>
  );
};

export default LayerItemSelector;
