import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

export default function IntroPage() {
  return (
    <div className="w-full bg-white text-black">
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <h1 className="mb-4 text-center text-5xl font-extrabold tracking-tight">
          Welcome to Exclusuive
        </h1>
        <p className="mb-10 max-w-2xl text-center text-lg text-gray-700">
          Thank you for your interest in Exclusuive. Try our no-code NFT platform designed for
          communities and creators.
        </p>

        <h2 className="mb-10 text-center text-2xl font-semibold">
          There are two types of users. Feel free to try both.
        </h2>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* Admin Card */}
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
              <CardDescription>
                Admins manage collections — typically community managers or project owners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700">
                Switch to admin mode using the <strong>Admin</strong> tab in the sidebar. As an
                admin, you can:
              </p>

              <Accordion type="single" collapsible className="w-full">
                {/* Create Collection */}
                <AccordionItem value="create-collection">
                  <AccordionTrigger className="font-semibold">Create a Collection</AccordionTrigger>
                  <AccordionContent>
                    <img src="/intro/create.png" alt="create" className="rounded-lg border p-6" />
                    <p className="mt-4">
                      Start by naming your collection. You can optionally add a banner image,
                      description, and define <strong>layers</strong>.
                    </p>
                    <p>Layers make your NFTs dynamic — enabling customization later.</p>
                    <p>
                      Not sure what layers are?{" "}
                      <Link to="/docs" className="text-blue-500 underline">
                        Check our documentation.
                      </Link>
                    </p>
                    <Link to="/admin">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to Create a Collection
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                {/* Mint Item */}
                <AccordionItem value="mint-item">
                  <AccordionTrigger className="font-semibold">Mint an Item</AccordionTrigger>
                  <AccordionContent>
                    <img src="/intro/mint.png" alt="mint" className="rounded-lg border p-6" />
                    <p className="mt-4">
                      Once your layers are set up, go to the <strong>Mint & Transfer</strong> tab
                      and click <strong>Mint Item</strong>.
                    </p>
                    <p>
                      Items represent equippable parts of an NFT. Each item must belong to a
                      specific layer, and only one item can be equipped per layer.
                    </p>
                    <p>
                      Set the recipient address and mint the item — or make it available in a Store
                      instead.
                    </p>
                    <Link to="/admin/mint">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to Mint an Item
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                {/* Manage Store */}
                <AccordionItem value="create-store">
                  <AccordionTrigger className="font-semibold">Manage a Store</AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-4">
                      After minting items, click <strong>Manage a Store</strong> in the sidebar.
                    </p>
                    <p>
                      This creates a seamless Web2-style vending machine. You don’t manage users
                      manually — just set the item and purchase conditions. Qualified users can buy
                      the items directly.
                    </p>

                    <img src="/intro/store.png" alt="store" className="rounded-lg border p-6" />
                    <p className="py-6">
                      First, create a store and give it a name. Then, add a slot for your item.
                    </p>

                    <img src="/intro/slot.png" alt="slot" className="rounded-lg border p-6" />
                    <p>
                      Think of this as setting up a vending machine. Choose the category (Item,
                      Property, Ticket) and set the price. Start with an <strong>Item</strong> slot.
                    </p>

                    <img src="/intro/product.png" alt="product" className="rounded-lg border p-6" />
                    <p>
                      Once the slot is created, add products by selecting the items you minted and
                      setting the quantity to sell.
                    </p>

                    <img
                      src="/intro/store_final.png"
                      alt="store-final"
                      className="rounded-lg border p-6"
                    />
                    <p>This is how your store will appear to users.</p>

                    <Link to="/admin/store">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to Manage a Store
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Member Card */}
          <Card>
            <CardHeader>
              <CardTitle>Member</CardTitle>
              <CardDescription>
                Members participate in the community — typically as NFT holders or buyers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700">
                Members can explore collections, buy items, and customize their NFTs.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="explore">
                  <AccordionTrigger className="font-bold">Explore Collections</AccordionTrigger>
                  <AccordionContent>
                    Browse collections created by others. We recommend checking out{" "}
                    <span className="font-bold">DOKPAMI</span>. You’ll see details, layers, and
                    available items.
                    <Link to="/explore/collections">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to Explore Collections
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="buy-item">
                  <AccordionTrigger className="font-bold">Buy an Item</AccordionTrigger>
                  <AccordionContent>
                    <img
                      src="/intro/buy_items.png"
                      alt="buy_item"
                      className="rounded-lg border p-6"
                    />
                    In the store, click <span className="font-bold">Select</span> to view stores and
                    items. You must own a <span className="font-bold">Base</span> item (Slot 0)
                    before equipping other items.
                    <Link to="/member/store/0x1731b154ac970f4e301a996b5cacc58f8b96c4971e1ff257a8a25bea2d457866">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to Dokpami Store
                      </div>
                    </Link>
                    <p>
                      Trouble buying an item? Visit this page to claim your free character:{" "}
                      <a
                        href="https://dokpami.onrender.com/event"
                        className="text-blue-500 underline"
                      >
                        Get Exclusuive Dokpami
                      </a>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="switch-image">
                  <AccordionTrigger className="font-bold">Switch NFT Images</AccordionTrigger>
                  <AccordionContent>
                    <img src="/intro/leader.png" alt="switch_image" className="rounded-lg p-6" />
                    <p>
                      Go to <span className="font-bold">My NFTs</span>, select an NFT, and switch
                      equipped items by layer.
                    </p>
                    <p>
                      Use the <span className="font-bold">Equip</span> button to apply changes.
                    </p>
                    <p>
                      If the image doesn't update, try the{" "}
                      <span className="font-bold">Sync Image</span> button. Equipped items are shown
                      below the preview.
                    </p>
                    <Link to="/member/mynfts">
                      <div className="mx-auto mt-4 w-full rounded-md bg-blue-600 p-2 text-center text-white hover:bg-blue-700">
                        Go to My NFTs
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <section className="my-10">
          <p className="text-center">If you have any questions, please contact us.</p>
          <p className="text-center">
            Email:{" "}
            <a href="mailto:block.poqopo@gmail.com" className="text-blue-500 underline">
              block.poqopo@gmail.com
            </a>
          </p>
          <p className="text-center">
            Telegram:{" "}
            <a href="https://t.me/rrriich" className="text-blue-500 underline">
              @rrriich
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
