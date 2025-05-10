import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  HeartIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { paths } from "@/config/paths";

interface ProtectedWebViewLayoutProps {
  children: ReactNode;
}

export function ProtectedWebViewLayout({ children }: ProtectedWebViewLayoutProps) {
  const navigate = useNavigate();
  const { veginUserIsLogin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen w-full">
      <div className="flex flex-col w-full max-w-[428px] min-w-[320px] bg-white min-h-screen shadow-lg relative">
        <header className="bg-white px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center"></div>
          </div>

          <div className="flex items-center gap-4">
            {veginUserIsLogin ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-[#75C526] text-[#75C526] hover:bg-[#75C526] hover:text-white"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#75C526] text-[#75C526] hover:bg-[#75C526] hover:text-white"
                >
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </header>
        <main className="flex-grow px-4 py-4 overflow-y-auto">{children}</main>
        {veginUserIsLogin && (
          <div className="bg-white border-t py-2 sticky bottom-0 w-full">
            <div className="px-2">
              <div className="flex justify-between items-center">
                {[
                  {
                    icon: <HomeIcon className="w-6 h-6" />,
                    name: "홈",
                    path: paths.home.path,
                  },
                  {
                    icon: <GlobeIcon className="w-6 h-6" />,
                    name: "맵",
                    path: paths.app.map.path,
                  },
                  {
                    icon: <PersonIcon className="w-6 h-6" />,
                    name: "친구",
                    path: paths.app.friends.path,
                  },
                  {
                    icon: <EnvelopeClosedIcon className="w-6 h-6" />,
                    name: "메시지",
                    path: paths.app.messages.path,
                  },
                  {
                    icon: <HeartIcon className="w-6 h-6" />,
                    name: "좋아요",
                    path: paths.app.likes.path,
                  },
                ].map((item, index) => (
                  <Link key={index} to={item.path}>
                    <div className="flex flex-col items-center px-1">
                      <div className="h-6 flex items-center justify-center">{item.icon}</div>
                      <span className="text-[10px] sm:text-xs mt-1">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
