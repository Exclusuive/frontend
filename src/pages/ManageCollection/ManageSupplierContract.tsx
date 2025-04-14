import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetManageSuppliers } from "@/hooks/useGetManageSuppliers";
import { Supplier, Selection, Product, Condition } from "@/types/types";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectSupplierModal from "@/components/SelectSupplierCard";
import AddProductDialog from "@/components/AddProductDialog";

export default function ManageSupplierContract() {
  const account = useCurrentAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const supplierId = searchParams.get("supplier_id");
  const {
    data: suppliers,
    loading,
    error,
  } = useGetManageSuppliers(account?.address || "", collectionId || "");

  const [newSupplierName, setNewSupplierName] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSelectionPrice, setNewSelectionPrice] = useState<number>(0);
  const [selectionType, setSelectionType] = useState<string>("Item");
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newTicketType, setNewTicketType] = useState("");
  const [newRequirements, setNewRequirements] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [selectedConditionIndex, setSelectedConditionIndex] = useState<number>(-1);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [showCreateSupplierDialog, setShowCreateSupplierDialog] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showConditions, setShowConditions] = useState(false);

  const { addSupplier, addSelection } = useSendTransactions();

  console.log(selectedSupplier);

  // Use mock data for now, replace with actual data when available
  const displaySuppliers = suppliers && suppliers.length > 0 ? suppliers : [];

  // Find the selected supplier based on the URL parameter
  useEffect(() => {
    if (supplierId && displaySuppliers.length > 0) {
      const supplier = displaySuppliers.find((s) => s.supplier_id === supplierId);
      if (supplier) {
        setSelectedSupplier(supplier);
      } else {
        // If supplier not found, show the selection dialog
        setShowSupplierDialog(true);
      }
    } else if (displaySuppliers.length > 0) {
      // If no supplier selected but suppliers exist, show the selection dialog
      setShowSupplierDialog(true);
    }
  }, [supplierId, displaySuppliers]);

  // Immediately show the supplier selection dialog when the component loads
  useEffect(() => {
    if (!supplierId && !loading) {
      setShowSupplierDialog(true);
    }
  }, [supplierId, loading]);

  const handleCreateSupplier = async () => {
    if (!newSupplierName.trim()) {
      return;
    }

    await addSupplier({
      id: collectionId || "",
      capId: capId || "",
      supplier: newSupplierName,
    });

    // Here you would call the actual API to create a supplier
    setNewSupplierName("");
    setShowCreateSupplierDialog(false);
  };

  const handleAddSelection = async (supplierId: string) => {
    await addSelection({
      id: collectionId || "",
      supplierId: supplierId,
      supplierCapId: selectedSupplier?.supplier_cap_id || "",
      price: newSelectionPrice,
      selectionType: selectionType,
    });
    setNewSelectionPrice(0);
  };

  const handleAddProduct = (selectionId: number) => {
    if (!newProductName.trim()) {
      return;
    }

    // Here you would call the actual API to add a product
    setNewProductName("");
  };

  const handleAddCondition = (id: string) => {
    if (!newTicketType.trim() || !newRequirements.trim()) {
      return;
    }

    // Here you would call the actual API to add a condition
    setNewTicketType("");
    setNewRequirements("");
  };

  const handleAddProductToSelection = (selectionId: number) => {
    // Here you would call the actual API to add a product to the selection
    setNewProductName("");
  };

  const handleAddProductWithDetails = (type: string, selectedId: string, quantity: number) => {
    console.log(`Adding product: Type=${type}, ID=${selectedId}, Quantity=${quantity}`);
    // Here you would call the actual API to add a product with the selected details
  };

  const handleAddConditionToSelection = (selectionId: number) => {
    // Here you would call the actual API to add a condition to the selection
    setNewTicketType("");
    setNewRequirements("");
  };

  const handleSelectionChange = (selection: Selection) => {
    setSelectedSelection(selection);
    setShowProducts(true);
    setShowConditions(false);
  };

  const handleProductChange = (product: Product) => {
    setSelectedProduct(product);
    setShowConditions(true);
  };

  const handleConditionChange = (condition: Condition, index: number) => {
    setSelectedCondition(condition);
    setSelectedConditionIndex(index);
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierDialog(false);
    setShowProducts(false);
    setShowConditions(false);

    // Update URL with supplier ID and cap ID
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("supplier_id", supplier.supplier_id);
    newSearchParams.set("supplier_cap_id", supplier.supplier_cap_id);
    setSearchParams(newSearchParams);
  };

  const handleCreateNewSupplier = () => {
    setShowSupplierDialog(false);
    setShowCreateSupplierDialog(true);
  };

  const handleBackToSelections = () => {
    setShowProducts(false);
    setShowConditions(false);
  };

  const handleBackToProducts = () => {
    setShowConditions(false);
  };

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div>Error loading suppliers: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Manage Supplier Contracts</h1>

      {/* Supplier Selection Dialog */}
      <SelectSupplierModal
        open={showSupplierDialog}
        items={displaySuppliers}
        onClick={handleSupplierSelect}
        create={true}
        onCreate={handleCreateNewSupplier}
        onOpenChange={setShowSupplierDialog}
      />

      {/* Create Supplier Dialog */}
      <Dialog open={showCreateSupplierDialog} onOpenChange={setShowCreateSupplierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Supplier</DialogTitle>
            <DialogDescription>Enter the details for the new supplier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSupplier}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedSupplier ? (
        <div className="py-8 text-center">
          <p>No supplier selected. Please select a supplier to continue.</p>
          <Button className="mt-4" onClick={() => setShowSupplierDialog(true)}>
            Select Supplier
          </Button>
        </div>
      ) : !showProducts && !showConditions ? (
        // Selections Section
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Selections for {selectedSupplier.name}</h2>
              <p className="text-muted-foreground text-sm">
                ID: {selectedSupplier.supplier_id.slice(0, 8)}...
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowSupplierDialog(true)}>Change Supplier</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Selection</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Selection</DialogTitle>
                    <DialogDescription>Enter the price for the new selection.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={selectionType} onValueChange={setSelectionType}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Item">Item</SelectItem>
                          <SelectItem value="Property">Property</SelectItem>
                          <SelectItem value="Ticket">Ticket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price (SUI)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newSelectionPrice}
                        onChange={(e) => setNewSelectionPrice(Number(e.target.value))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        selectedSupplier && handleAddSelection(selectedSupplier.supplier_id)
                      }
                    >
                      Add Selection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedSupplier.selections?.map((selection) => (
              <Card key={selection.fields.number}>
                <CardHeader>
                  <CardTitle>Selection {selection.fields.number}</CardTitle>
                  <CardDescription>Price: {selection.fields.price} SUI</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>SelectionType : {selection.fields.product?.fields?.name?.split("::")[2]}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="flex w-full justify-between">
                    <AddProductDialog
                      selectionNumber={selection.fields.number}
                      selectionId={selection.fields.number.toString()}
                      supplierId={selectedSupplier.supplier_id}
                      selectionType={
                        selection.fields.product?.fields?.name?.split("::")[2] || "Item"
                      }
                    />
                  </div>
                  <div className="flex w-full justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Add Condition
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Add Condition to Selection {selection.fields.number}
                          </DialogTitle>
                          <DialogDescription>
                            Enter the details for the new condition.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ticketType" className="text-right">
                              Ticket Type
                            </Label>
                            <Input
                              id="ticketType"
                              value={newTicketType}
                              onChange={(e) => setNewTicketType(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="requirements" className="text-right">
                              Requirements
                            </Label>
                            <Input
                              id="requirements"
                              value={newRequirements}
                              onChange={(e) => setNewRequirements(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => handleAddConditionToSelection(selection.fields.number)}
                          >
                            Add Condition
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : showProducts && !showConditions ? (
        // Products Section
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Products for Selection {selectedSelection?.fields.number}
              </h2>
              <Button
                variant="ghost"
                className="text-muted-foreground mt-1 p-0 text-sm"
                onClick={handleBackToSelections}
              >
                ← Back to Selections
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Product</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Enter the details for the new product.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productName" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="productName"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      selectedSelection && handleAddProduct(selectedSelection.fields.number)
                    }
                  >
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        // Conditions Section
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Conditions for {selectedProduct?.fields?.name}
              </h2>
              <Button
                variant="ghost"
                className="text-muted-foreground mt-1 p-0 text-sm"
                onClick={handleBackToProducts}
              >
                ← Back to Products
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Condition</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Condition</DialogTitle>
                  <DialogDescription>Enter the details for the new condition.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ticketType" className="text-right">
                      Ticket Type
                    </Label>
                    <Input
                      id="ticketType"
                      value={newTicketType}
                      onChange={(e) => setNewTicketType(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requirements" className="text-right">
                      Requirements
                    </Label>
                    <Input
                      id="requirements"
                      value={newRequirements}
                      onChange={(e) => setNewRequirements(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => selectedProduct && handleAddCondition(selectedProduct.id)}>
                    Add Condition
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedProduct?.fields?.conditions?.map((condition: Condition, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{condition.fields?.ticket_type || condition.ticket_type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{condition.fields?.requirements || condition.requirements}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
