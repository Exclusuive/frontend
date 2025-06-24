import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/types/user";
import { CheckIcon } from "lucide-react";

interface SetRolePopupProps {
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: Role) => void;
}

const defaultRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full control over NFT collections, user management",
    icon: "👨‍💼",
  },
  {
    id: "member",
    name: "Member",
    description: "View and interact with NFT collections and characters",
    icon: "👤",
  },
];

const SetRolePopup = ({ onOpenChange, onConfirm }: SetRolePopupProps) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;
    onConfirm(selectedRole);
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-[#474747]">Select Your Role</DialogTitle>
        <DialogDescription>Choose the appropriate role for your account.</DialogDescription>
      </DialogHeader>

      <div className="space-y-3 py-4">
        {defaultRoles.map((role) => (
          <div
            key={role.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3",
              "hover:border-[#4CA3FF] hover:bg-[#4CA3FF]/10",
              selectedRole?.id === role.id ? "border-[#4CA3FF] bg-[#4CA3FF]/10" : "border-border",
            )}
            onClick={() => handleRoleSelect(role)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedRole?.id === role.id}
            aria-label={`Select ${role.name} role`}
          >
            <div className="text-2xl">{role.icon}</div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm leading-none font-medium text-[#474747]">{role.name}</h4>
              <p className="text-muted-foreground mt-1 text-xs">{role.description}</p>
            </div>
            {selectedRole?.id === role.id && <CheckIcon className="h-4 w-4 text-[#4CA3FF]" />}
          </div>
        ))}
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedRole}
          className="w-full bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white sm:w-auto"
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SetRolePopup;
