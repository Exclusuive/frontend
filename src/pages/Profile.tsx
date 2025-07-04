import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, MapPin, Calendar, Save, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { useAuthStore } from "@/stores/useAuthStore";

// Zod schema definition - matches User.profile structure
const profileSchema = z.object({
  name: z.string().min(1, "Please enter your name").max(100, "Name must be 100 characters or less"),
  email: z.string().email("Please enter a valid email format"),
  age: z.number().min(1, "Please enter your age").max(150, "Please enter a valid age"),
  sex: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
  location: z.string().optional(),
  birthDate: z.string().optional(),
  imgUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile } = useAuthStore();

  // 프로필 폼
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.profile.name || "",
      email: user?.profile.email || "",
      age: user?.profile.age || 20,
      sex: (user?.profile.sex as "male" | "female") || "male",
      location: user?.profile.location || "",
      birthDate: user?.profile.birthDate || "",
      imgUrl: user?.profile.imgUrl || "",
    },
  });

  const handleProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile data:", data);
    updateProfile(data);
    setIsEditing(false);
    // TODO: API 호출 로직
  };

  const handleImageChange = (imageUrl: string, _file?: File) => {
    profileForm.setValue("imgUrl", imageUrl);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* 헤더 */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* 프로필 이미지 카드 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Image
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Upload your profile image or enter an image URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-xs">
              <ImageUpload
                currentImageUrl={user?.profile.imgUrl || "/placeholder-image.png"}
                onImageChange={handleImageChange}
                isEditing={isEditing}
                className="w-full"
              />
            </div>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  {...profileForm.register("name")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-destructive text-sm">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age
                  </label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    {...profileForm.register("age", { valueAsNumber: true })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                  {profileForm.formState.errors.age && (
                    <p className="text-destructive text-sm">
                      {profileForm.formState.errors.age.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="sex" className="text-sm font-medium">
                    Gender
                  </label>
                  <Select
                    value={profileForm.watch("sex")}
                    onValueChange={(value) =>
                      profileForm.setValue("sex", value as "male" | "female")
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {profileForm.formState.errors.sex && (
                    <p className="text-destructive text-sm">
                      {profileForm.formState.errors.sex.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Input
                  id="location"
                  {...profileForm.register("location")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  placeholder="Seoul"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Birth Date
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  {...profileForm.register("birthDate")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              {isEditing && (
                <Button type="submit" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
