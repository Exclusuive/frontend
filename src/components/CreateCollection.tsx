// import { DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "./ui/button";
// import ImageUpload from "./ui/image-upload";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import TagInput from "./ui/tag-input";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { CollectionFormData } from "@/pages/AdminCollection";

// const collectionSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   imgUrl: z.string().optional(),
//   layers: z.array(z.string()).optional(),
//   properties: z.array(z.string()).optional(),
//   tickets: z.array(z.string()).optional(),
// });

// const CreateCollection = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty, dirtyFields },
//     reset,
//     setValue,
//     trigger,
//     watch,
//     control,
//   } = useForm<CollectionFormData>({
//     resolver: zodResolver(collectionSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       imgUrl: "",
//       layers: [],
//       properties: [],
//       tickets: [],
//     },
//   });

//   const onSubmit = (data: CollectionFormData) => {
//     // TODO: 실제 제출 로직 구현
//     console.log("CreateCollection 제출:", data);
//   };

//   // 이미지 URL 실시간 반영
//   const imageUrl = watch("imgUrl");

//   return (
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>Create Collection</DialogTitle>
//       </DialogHeader>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
//         <ImageUpload
//           currentImageUrl={imageUrl}
//           onImageChange={(url: string) => setValue("imgUrl", url)}
//           isEditing={true}
//           className="w-full"
//           showUrl={false}
//         />
//         <Input
//           placeholder="Collection Name"
//           className="mt-2"
//           aria-label="Collection Name"
//           {...register("name", { required: true })}
//         />
//         <Textarea
//           placeholder="Collection Description"
//           className="mt-2"
//           aria-label="Collection Description"
//           rows={3}
//           {...register("description")}
//         />
//         {/* Layers */}
//         <Controller
//           control={control}
//           name="layers"
//           render={({ field }) => (
//             <TagInput
//               label="Layers"
//               tags={field.value}
//               onTagsChange={field.onChange}
//               isEditing={true}
//               placeholder="Layer name"
//             />
//           )}
//         />
//         {/* Properties */}
//         <Controller
//           control={control}
//           name="properties"
//           render={({ field }) => (
//             <TagInput
//               label="Properties"
//               tags={field.value}
//               onTagsChange={field.onChange}
//               isEditing={true}
//               placeholder="Property name"
//             />
//           )}
//         />
//         {/* Tickets */}
//         <Controller
//           control={control}
//           name="tickets"
//           render={({ field }) => (
//             <TagInput
//               label="Tickets"
//               tags={field.value}
//               onTagsChange={field.onChange}
//               isEditing={true}
//               placeholder="Ticket name"
//             />
//           )}
//         />
//         <DialogFooter className="flex-col gap-2 sm:flex-row">
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white sm:w-auto"
//           >
//             Confirm
//           </Button>
//         </DialogFooter>
//       </form>
//     </DialogContent>
//   );
// };

// export default CreateCollection;
