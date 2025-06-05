import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <section id="AdminDashboard" className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-16 p-8">
            {/* Introduction */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Getting Started</h2>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  The admin dashboard is a powerful tool for managing your NFT collections. You can
                  create, configure, and optimize your collections with ease.
                </p>
              </div>
            </section>

            {/* Login Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Login</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/login.png" alt="Login screen" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  When you first access the admin page, you'll see a screen like above. Log in using
                  your preferred wallet. Ensure you are on the{" "}
                  <span className="text-blue-700">Admin</span> tab.
                </p>
              </div>
            </section>

            {/* Create Collection Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Create Collection</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/createNewCollection.png"
                  alt="Create New Collection"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  After logging in, you'll see the "Create Collection" modal if you don't have any
                  collections yet.
                </p>
                <p>
                  You can create a new collection by entering the collection name, description, and
                  uploading a banner image.
                </p>
                <p>Layers can be added to define the visual components that make up your NFTs.</p>
                <p>
                  Once you're ready, click the{" "}
                  <span className="text-blue-700">Create Collection</span> button to initiate the
                  on-chain transaction.
                </p>
              </div>
            </section>

            {/* Collection Overview Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Collection Overview</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/collection_overview.png"
                  alt="Collection Overview"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  The <span className="text-blue-700">Overview</span> tab provides a snapshot of
                  your collection and its structure.
                </p>
                <p>
                  You can browse item layers and check statistics like the distribution of items per
                  layer.
                </p>
              </div>
            </section>

            {/* Edit Collection Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Edit Collection</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/edit_collection.png" alt="Edit Collection" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  The <span className="text-blue-700">Edit Collection</span> page lets you upload
                  images, edit descriptions, and define types.
                </p>
                <p>
                  You can configure layer, property, and ticket types to structure your collection.
                </p>
              </div>
            </section>

            {/* Mint & Transfer Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Mint & Transfer</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/mint_transfer.png" alt="Mint & Transfer" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Use the <span className="text-blue-700">Mint & Transfer</span> tab to mint new
                  NFTs.
                </p>
                <p>
                  You can mint base NFTs directly to a recipient address or create and mint items
                  with custom metadata.
                </p>
              </div>
            </section>

            {/* Mint New Item Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Mint New Item</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/mint_new.png" alt="Mint New Item" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  If you're minting a new item, you can provide a name, upload an image, and assign
                  a property before sending it to a recipient.
                </p>
              </div>
            </section>

            {/* Mint Existing Item Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Mint Existing Item</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/mint_exist.png" alt="Mint Existing Item" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Use this modal to mint an existing item by selecting its layer and type, then
                  assign it to a user with a property.
                </p>
              </div>
            </section>

            {/* Store Management Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Store Management</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/store.png" alt="Manage Store" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  The <span className="text-blue-700">Manage Store</span> tab allows you to add
                  items and set purchase conditions.
                </p>
                <p>
                  You can select existing stores and manage them by adding slots, products, or rules
                  like whitelist requirements.
                </p>
              </div>
            </section>

            {/* Store Overview Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Store Overview</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/storeOverview.png" alt="Select Store" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  From the store list, choose the one you want to manage. Each store shows its
                  unique ID and the number of slots.
                </p>
                <p>You can also create a new store from this view.</p>
              </div>
            </section>

            {/* Add Slot Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Add Slot</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/createSlot.png" alt="Add New Slot" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  To create a slot, choose a slot type such as Base, Item, PropertyScroll, or
                  Ticket.
                </p>
                <p>You can also specify the price in MIST to control access or value.</p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/Slot_created.png" alt="Slot Created" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  After adding a slot, it will appear in the store view with details like type,
                  price, and quantity remaining.
                </p>
                <p>Now you're ready to add products into that slot.</p>
              </div>
            </section>

            {/* Add Product Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Add Product</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/add_product.png"
                  alt="Select Slot to Add Product"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Select the slot you want to add a product to. You can manage each slot
                  individually.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/add_product2.png" alt="Add Product Modal" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Choose the layer type and item type, and set the quantity of the product to be
                  added.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/add_product_completed.png" alt="Product Added" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Once added, the item will show up under the slot with its image, layer name, and
                  quantity info.
                </p>
                <p>This completes the product listing inside your NFT store!</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
