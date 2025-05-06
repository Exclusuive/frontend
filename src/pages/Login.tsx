import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 최대 20자까지 가능합니다" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const success = login(data.email, data.password);
      if (success) {
        navigate("/");
      } else {
        setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 bg-[#75C526] rounded-full flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" />
              <path d="M12 8v4l2.5 2.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Vegin</h1>
        </div>

        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p className="text-sm">
            <strong>Demo Credentials:</strong>
            <br />
            Email: example@naver.com
            <br />
            Password: 123456
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
          <div>
            <Input
              type="email"
              placeholder="이메일"
              {...register("email")}
              className={`w-full p-3 border rounded-md ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              {...register("password")}
              className={`w-full p-3 border rounded-md ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-[#75C526] hover:bg-[#65b01e] text-white rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>

          <div className="flex justify-between text-sm mt-2">
            <a href="#" className="text-gray-600 hover:underline">
              비밀번호 찾기
            </a>
            <a href="#" className="text-gray-600 hover:underline">
              회원가입
            </a>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md">
            <img
              src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_24dp.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span>Continue with Google</span>
          </button>

          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md">
            <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
                fill="currentColor"
              />
            </svg>
            <span>Continue with Apple</span>
          </button>

          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md">
            <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
              <rect width="24" height="24" fill="#FEE500" rx="4" />
              <path
                d="M12.001 6.202c-3.604 0-6.527 2.319-6.527 5.175 0 1.896 1.261 3.564 3.253 4.507-.239.702-.734 2.596-.832 2.991-.128.49.179.484.376.353.155-.104 2.294-1.581 3.197-2.22.506.075 1.03.113 1.533.113 3.603 0 6.525-2.318 6.525-5.175 0-2.856-2.922-5.175-6.525-5.175z"
                fill="#392020"
              />
            </svg>
            <span>Continue with Kakao</span>
          </button>

          <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md">
            <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
              <rect width="24" height="24" fill="#03C75A" rx="4" />
              <path
                d="M16.273 12.845L7.376 8.5v7.151l3.208-1.592v-2.42l2.348 1.333v2.276l3.341 1.653V8.5l-3.341 1.68v2.665z"
                fill="white"
              />
            </svg>
            <span>Continue with Naver</span>
          </button>
        </div>

        <div className="mt-8 text-xs text-center text-gray-500">
          By clicking continue, you agree to our{" "}
          <a href="#" className="text-[#75C526] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#75C526] hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
