import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types/mission";

export interface MissionForm {
  name: string;
  description: string;
  type: Mission["type"];
  status: Mission["status"];
  maxParticipants: string;
  reward: string;
}

const defaultFormValues: MissionForm = {
  name: "",
  description: "",
  type: "daily",
  status: "active",
  maxParticipants: "",
  reward: "",
};

interface AddMissionProps {
  onSubmit: (data: MissionForm) => void;
  initialValues?: MissionForm;
  mode: "add" | "edit";
  onCancel?: () => void;
}

const AddMission: React.FC<AddMissionProps> = ({ onSubmit, initialValues, mode, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<MissionForm>({
    defaultValues: initialValues || defaultFormValues,
  });

  useEffect(() => {
    reset(initialValues || defaultFormValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">미션명</label>
          <Input {...register("name", { required: true })} placeholder="미션 이름을 입력하세요" />
          {errors.name && <span className="text-xs text-red-500">필수 입력</span>}
        </div>
        <div>
          <label className="text-sm font-medium">보상</label>
          <Input {...register("reward", { required: true })} placeholder="예: 100 포인트" />
          {errors.reward && <span className="text-xs text-red-500">필수 입력</span>}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">설명</label>
        <Textarea
          {...register("description", { required: true })}
          placeholder="미션 설명을 입력하세요"
          rows={3}
        />
        {errors.description && <span className="text-xs text-red-500">필수 입력</span>}
      </div>
      <div className="flex flex-row gap-4">
        <div>
          <label className="text-sm font-medium">타입</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">데일리</SelectItem>
                  <SelectItem value="weekly">위클리</SelectItem>
                  <SelectItem value="monthly">먼슬리</SelectItem>
                  <SelectItem value="special">특별</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <label className="text-sm font-medium">상태</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  {mode === "edit" && <SelectItem value="completed">완료</SelectItem>}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <label className="text-sm font-medium">최대 참여자</label>
          <Input type="number" {...register("maxParticipants")} placeholder="제한 없음" />
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          {mode === "add" ? "추가" : "저장"}
        </Button>
      </div>
    </form>
  );
};

export default AddMission;
