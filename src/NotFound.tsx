import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center">
      {/* <h1 className="mb-4 text-6xl font-bold">404</h1> */}
      <p className="mb-6 text-xl text-gray-700">Oppss...! 페이지를 찾을 수 없습니다...!</p>
      <button
        onClick={() => navigate(-1)}
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        뒤로가기
      </button>
    </div>
  );
}
