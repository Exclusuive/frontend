import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ name }: { name: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: name });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className="flex w-full cursor-pointer items-center justify-between rounded-md border p-2 active:cursor-grab active:bg-gray-200"
    >
      {name}
    </div>
  );
}
