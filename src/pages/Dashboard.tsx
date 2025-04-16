import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Welcome to Exclusuive</h1>
      <p className="mb-4 text-lg">Explore our features and offerings below:</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Feature One</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Discover how our first feature can help you streamline your workflow and enhance
              productivity.
            </CardDescription>
            <Button className="mt-4">Learn More</Button>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Two</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Explore the benefits of our second feature, designed to improve your experience and
              efficiency.
            </CardDescription>
            <Button className="mt-4">Learn More</Button>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Three</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Learn about our third feature that offers unique solutions tailored to your needs.
            </CardDescription>
            <Button className="mt-4">Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
