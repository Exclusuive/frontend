// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useCollectionStore } from "@/stores/useCollectionStore";
// import { Collection } from "@/types/collection";
// import { Edit3, Save, X, Upload, Eye, EyeOff } from "lucide-react";
// import { cn } from "@/lib/utils";

// const AdminCollection = () => {
//   const { collection, setCollection } = useCollectionStore();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showAddress, setShowAddress] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     reset,
//     watch,
//   } = useForm<Collection>({
//     defaultValues: {
//       name: collection?.name || "",
//       description: collection?.description || "",
//       imgUrl: collection?.imgUrl || "",
//       address: collection?.address || "",
//     },
//   });

//   const watchedImgUrl = watch("imgUrl");

//   // Update form when collection changes
//   useEffect(() => {
//     if (collection) {
//       reset({
//         name: collection.name,
//         description: collection.description,
//         imgUrl: collection.imgUrl,
//         address: collection.address,
//       });
//       setImagePreview(collection.imgUrl);
//     }
//   }, [collection, reset]);

//   // Update image preview when URL changes
//   useEffect(() => {
//     setImagePreview(watchedImgUrl);
//   }, [watchedImgUrl]);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     reset();
//     setImagePreview(collection?.imgUrl || "");
//   };

//   const handleSave = (data: Collection) => {
//     if (collection) {
//       const updatedCollection: Collection = {
//         ...collection,
//         ...data,
//       };
//       setCollection(updatedCollection);
//       setIsEditing(false);
//     }
//   };

//   const handleImageError = () => {
//     setImagePreview("/placeholder-image.png");
//   };

//   const formatAddress = (address: string) => {
//     if (address.length <= 20) return address;
//     return `${address.slice(0, 10)}...${address.slice(-10)}`;
//   };

//   if (!collection) {
//     return (
//       <div className="flex flex-col gap-4 p-10">
//         <Card>
//           <CardContent className="flex items-center justify-center p-8">
//             <div className="text-center">
//               <p className="mb-2 text-lg font-medium text-gray-600">No Collection Selected</p>
//               <p className="text-sm text-gray-500">
//                 Please select a collection to view and edit its information.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-6 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Collection Management</h1>
//           <p className="mt-1 text-sm text-gray-600">View and edit collection information</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//             Admin Access
//           </Badge>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Collection Information Card */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-xl">Collection Details</CardTitle>
//                 <CardDescription>Basic information about the collection</CardDescription>
//               </div>
//               {!isEditing && (
//                 <Button
//                   onClick={handleEdit}
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <Edit3 className="h-4 w-4" />
//                   Edit
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
//               {/* Collection Name */}
//               <div>
//                 <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
//                   Collection Name
//                 </label>
//                 {isEditing ? (
//                   <div>
//                     <Input
//                       id="name"
//                       {...register("name")}
//                       className={cn("w-full", errors.name && "border-red-500 focus:border-red-500")}
//                       placeholder="Enter collection name"
//                     />
//                     {errors.name && (
//                       <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-lg font-medium text-gray-900">{collection.name}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <label
//                   htmlFor="description"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Description
//                 </label>
//                 {isEditing ? (
//                   <div>
//                     <textarea
//                       id="description"
//                       {...register("description")}
//                       rows={3}
//                       className={cn(
//                         "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
//                         errors.description && "border-red-500 focus:border-red-500",
//                       )}
//                       placeholder="Enter collection description"
//                     />
//                     {errors.description && (
//                       <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-gray-700">{collection.description}</p>
//                 )}
//               </div>

//               {/* Contract Address */}
//               <div>
//                 <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
//                   Contract Address
//                 </label>
//                 {isEditing ? (
//                   <div>
//                     <div className="relative">
//                       <Input
//                         id="address"
//                         {...register("address")}
//                         type={showAddress ? "text" : "password"}
//                         className={cn(
//                           "w-full pr-10",
//                           errors.address && "border-red-500 focus:border-red-500",
//                         )}
//                         placeholder="Enter contract address"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute top-0 right-0 h-full px-3"
//                         onClick={() => setShowAddress(!showAddress)}
//                       >
//                         {showAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <code className="rounded bg-gray-100 px-2 py-1 text-sm">
//                       {formatAddress(collection.address)}
//                     </code>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setShowAddress(!showAddress)}
//                     >
//                       {showAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 )}
//                 {showAddress && !isEditing && (
//                   <p className="mt-1 text-xs break-all text-gray-500">{collection.address}</p>
//                 )}
//               </div>

//               {/* Image URL */}
//               <div>
//                 <label htmlFor="imgUrl" className="mb-1 block text-sm font-medium text-gray-700">
//                   Image URL
//                 </label>
//                 {isEditing ? (
//                   <div>
//                     <Input
//                       id="imgUrl"
//                       {...register("imgUrl")}
//                       className={cn(
//                         "w-full",
//                         errors.imgUrl && "border-red-500 focus:border-red-500",
//                       )}
//                       placeholder="Enter image URL"
//                     />
//                     {errors.imgUrl && (
//                       <p className="mt-1 text-sm text-red-600">{errors.imgUrl.message}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-sm break-all text-blue-600">{collection.imgUrl}</p>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {isEditing && (
//                 <div className="flex items-center gap-2 pt-4">
//                   <Button
//                     type="submit"
//                     disabled={!isDirty}
//                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
//                   >
//                     <Save className="h-4 w-4" />
//                     Save Changes
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleCancel}
//                     className="flex items-center gap-2"
//                   >
//                     <X className="h-4 w-4" />
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </form>
//           </CardContent>
//         </Card>

//         {/* Image Preview Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-xl">Collection Image</CardTitle>
//             <CardDescription>Preview of the collection image</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {/* Image Preview */}
//               <div className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Collection preview"
//                     className="h-full w-full object-cover"
//                     onError={handleImageError}
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center">
//                     <div className="text-center">
//                       <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-500">No image preview available</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Image Status */}
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600">Image Status:</span>
//                 <Badge
//                   variant={imagePreview ? "default" : "secondary"}
//                   className={cn(
//                     imagePreview ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
//                   )}
//                 >
//                   {imagePreview ? "Loaded" : "Not Available"}
//                 </Badge>
//               </div>

//               {/* Collection Stats */}
//               <div className="grid grid-cols-2 gap-4 border-t pt-4">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-blue-600">0</p>
//                   <p className="text-sm text-gray-600">Total Items</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-green-600">0</p>
//                   <p className="text-sm text-gray-600">Active Members</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminCollection;
