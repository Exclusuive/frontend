import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Welcome to Exclusuive</h1>

      <p className="text-lg">Currently we are in the beta phase.</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Did you participate in our event?</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Follow the link below to check out the event page.
            </CardDescription>
            <div className="flex justify-between">
              <Link to="https://dokpami.onrender.com" className="mt-4">
                <Button>Go to Event Page</Button>
              </Link>

              <Link to="/member/mynfts" className="mt-4">
                <Button>Go to my page</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
