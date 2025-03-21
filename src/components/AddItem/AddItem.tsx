// import React, { useState } from "react";
// import { FiUpload } from "react-icons/fi";
// import { Layer } from "@/types/types";

// export default function AddItem() {
// //   const [baseImage, setBaseImage] = useState<string | null>(null);

// //   const [selectedLayer, setSelectedLayer] = useState<string>("");
// //   const [selectedType, setSelectedType] = useState<string>("");
// //   const [amountOfSUI, setAmountOfSUI] = useState<string>("");
// //   const [layers, setLayers] = useState<Layer[]>([]);

// //   const handleImageUpload = (
// //     event: React.ChangeEvent<HTMLInputElement>,
// //     setImage: React.Dispatch<React.SetStateAction<string | null>>
// //   ) => {
// //     if (event.target.files && event.target.files[0]) {
// //       const file = event.target.files[0];
// //       const imageUrl = URL.createObjectURL(file);
// //       setImage(imageUrl);
// //     }
// //   };

// //   return (
// //     <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
// //       <h2 className="text-xl font-semibold">Create First Item</h2>
// //       <div className="mt-4 flex space-x-6">
// //         <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
// //           {baseImage ? (
// //             <img src={baseImage} alt="Base" className="h-auto w-full rounded-lg" />
// //           ) : (
// //             <FiUpload className="text-4xl" />
// //           )}
// //           <p className="text-center text-sm text-gray-500">Please upload item image</p>
// //           <input
// //             type="file"
// //             className="hidden"
// //             accept="image/*"
// //             onChange={(e) => handleImageUpload(e, setBaseImage)}
// //           />
// //         </label>
// //         <textarea
// //           className="flex-1 rounded-lg border p-4"
// //           placeholder="Write a brief information about this item"
// //         ></textarea>
// //       </div>
// //       <select
// //         className="mt-4 w-full rounded-lg border p-2"
// //         value={selectedLayer}
// //         onChange={(e) => setSelectedLayer(e.target.value)}
// //       >
// //         <option value="" disabled>
// //           Select Layer
// //         </option>
// //         {layers.map((layer, index) => (
// //           <option key={index} value={layer.name}>
// //             {layer.name}
// //           </option>
// //         ))}
// //       </select>
// //       <div className="mt-2 w-full">
// //         <select
// //           className="w-full rounded-lg border p-2"
// //           value={selectedType}
// //           onChange={(e) => setSelectedType(e.target.value)}
// //         >
// //           <option value="" disabled>
// //             Choose Type
// //           </option>
// //           <option value="Mint item upon request">Mint item instantly</option>
// //           <option value="Mint requires SUI">Mint requires SUI</option>
// //           <option value="I will customize it">I will customize it</option>
// //         </select>
// //         <div
// //           className={`transition-all duration-300 ${selectedType === "Mint requires SUI" ? "opacity-100" : "h-0 overflow-hidden opacity-0"}`}
// //         >
// //           <input
// //             type="number"
// //             className="mt-2 w-full rounded-lg border p-2"
// //             placeholder="Enter required SUI amount"
// //             value={amountOfSUI}
// //             onChange={(e) => setAmountOfSUI(e.target.value)}
// //           />
// //         </div>
// //       </div>
// //     </div>
//   );
// }
