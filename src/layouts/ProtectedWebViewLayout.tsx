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
            <div className="h-10 w-10 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1575384043001-f37f476218e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Byb3V0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt="Sprout Logo"
                className="h-full object-contain"
              />
            </div>
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
            <Button variant="ghost" size="icon" className="rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Button>
          </div>
        </header>
        (
        <div className="bg-white py-3">
          <div className="px-4">
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Pears"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-6 left-6 text-black font-bold">
                  <h3 className="text-lg mb-1">광고/배너</h3>
                  <p className="text-lg">영역</p>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i === 0 ? "bg-black" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow px-4 py-4 overflow-y-auto">{children}</main>
        {veginUserIsLogin && (
          <div className="bg-white border-t py-2 sticky bottom-0 w-full">
            <div className="px-2">
              <div className="flex justify-between items-center">
                {[
                  {
                    icon: <HomeIcon className="w-6 h-6" />,
                    name: "홈",
                    path: "/",
                  },
                  {
                    icon: <GlobeIcon className="w-6 h-6" />,
                    name: "맵",
                    path: "/map",
                  },
                  {
                    icon: <PersonIcon className="w-6 h-6" />,
                    name: "친구",
                    path: "/friends",
                  },
                  {
                    icon: <EnvelopeClosedIcon className="w-6 h-6" />,
                    name: "메시지",
                    path: "/messages",
                  },
                  {
                    icon: <HeartIcon className="w-6 h-6" />,
                    name: "좋아요",
                    path: "/likes",
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
