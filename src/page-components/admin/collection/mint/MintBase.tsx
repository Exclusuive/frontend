import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMint } from "@/hooks/moveCall/mint";
import { useState } from "react";

export default function MintBase() {
  const [recipient, setRecipient] = useState("");

  const { mintBase } = useMint();

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mint Base NFT</CardTitle>
          <CardDescription>Mint a base NFT to a recipient address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="col-span-3"
                placeholder="Enter recipient address"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              mintBase({ imgURL: "", recipient });
            }}
            disabled={!recipient}
            className="w-full"
          >
            Minting
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
