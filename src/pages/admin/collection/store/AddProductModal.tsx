import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProductModal() {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        {/* <DialogTitle>Add Product to Selection {selectionNumber}</DialogTitle> */}
        <DialogTitle>Add Product to Selection {0}</DialogTitle>
        <DialogDescription>Select a product and quantity.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="selectedType" className="text-right">
            {/* {selectionType} */}
            {"selection Type"}
          </Label>
          {/* {selectionType === "Item" ? ( */}
          {"Item" === "Item" ? (
            <div className="col-span-3 max-h-[300px] overflow-y-auto rounded-md border p-2">
              {/* {Object.entries(itemsByLayer).map(([layer, items]) => ( */}
              {Object.entries({}).map(([layer, items]) => (
                <div key={layer} className="mb-4">
                  <h3 className="mb-2 font-medium">{layer}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {/* {items.map((item) => (
                        <div
                          key={item.name}
                          className={`cursor-pointer rounded-md p-2 hover:bg-gray-100 ${
                            selectedId === item.name ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-md">
                              <img
                                src={item.img_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </div>
                      ))} */}
                  </div>
                  {/* <Separator className="my-2" /> */}
                </div>
              ))}
            </div>
          ) : (
            <Select
              // value={selectedId}
              value={"selected Id"}
              onValueChange={(value) => {
                // const option = getTypeOptions().find((opt) => getOptionValue(opt) === value);
                // if (option) {
                //   handleOptionSelect(option);
                // }
              }}
            >
              <SelectTrigger className="col-span-3">
                {/* <SelectValue placeholder={`Select ${selectionType?.toLowerCase()}`} /> */}
                <SelectValue placeholder={`Select `} />
              </SelectTrigger>
              <SelectContent>
                {/* {getTypeOptions().map((option) => (
                  <SelectItem key={getOptionKey(option)} value={getOptionValue(option)}>
                    {option.name}
                  </SelectItem>
                ))} */}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* {selectionType === "PropertyScroll" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="propertyValue" className="text-right">
              Value
            </Label>
            <Input
              id="propertyValue"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              placeholder="Enter property value"
              className="col-span-3"
            />
          </div>
        )} */}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            // value={quantity}
            value={"quantity"}
            // onChange={(e) => setQuantity(Number(e.target.value))}
            onChange={(e) => {}}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          // onClick={handleAddProduct}
          onClick={() => {}}
          // disabled={!selectedId || (selectionType === "PropertyScroll" && !propertyValue)}
          disabled={false}
        >
          Add Product
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
