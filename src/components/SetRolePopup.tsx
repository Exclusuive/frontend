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
        <DialogTitle>Select Your Role</DialogTitle>
        <DialogDescription>Choose the appropriate role for your account.</DialogDescription>
      </DialogHeader>

      <div className="space-y-3 py-4">
        {defaultRoles.map((role) => (
          <div
            key={role.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
              "hover:bg-accent hover:border-accent-foreground/20",
              "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
              selectedRole?.id === role.id
                ? "bg-primary/10 border-primary/50 ring-primary/20 ring-2"
                : "bg-background border-border",
            )}
            onClick={() => handleRoleSelect(role)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedRole?.id === role.id}
            aria-label={`Select ${role.name} role`}
          >
            <div className="text-2xl">{role.icon}</div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm leading-none font-medium">{role.name}</h4>
              <p className="text-muted-foreground mt-1 text-xs">{role.description}</p>
            </div>
            {selectedRole?.id === role.id && <div className="bg-primary h-2 w-2 rounded-full" />}
          </div>
        ))}
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedRole} className="w-full sm:w-auto">
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SetRolePopup;
