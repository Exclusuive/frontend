import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

interface Props {}

export default function EditCollection({}: Props) {
  return (
    <div>
      <Tabs>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Collection Info</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
