import { Card, CardContent } from "@/components/ui/card";
import { useLoaderData } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
}

interface LoaderData {
  popularPosts: Post[];
  restaurants: Restaurant[];
}

export async function loader(): Promise<LoaderData> {
  return {
    popularPosts: [
      {
        id: 1,
        title: "서울 인근 채식 식당 중에 추천 되는 곳은...",
        category: "자유게시판",
      },
      {
        id: 2,
        title: "지인 소개팅 받을 때 비건이라고 이야기...",
        category: "비건게시판",
      },
      {
        id: 3,
        title: "채식 토마토 스튜 해봤는데, 연두보다 더 ...",
        category: "도전요리사",
      },
      {
        id: 4,
        title: "이번주에 강서구 A 맛집 탐방 가실분 모...",
        category: "강남구모임",
      },
    ],
    restaurants: [
      {
        id: 1,
        name: "비건 페스토 파스타",
        image:
          "https://images.unsplash.com/photo-1634864572865-1cf8ff8bd23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHBhc3RhJTIwZ3JlZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        name: "비건 아이스크림",
        image:
          "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aWNlJTIwY3JlYW0lMjBjb25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      },
    ],
  };
}

export default function Home() {
  const { popularPosts, restaurants } = useLoaderData() as LoaderData;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">인기 게시글</h2>

        <div className="space-y-3">
          {popularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-sm">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm line-clamp-1">{post.title}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {post.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">이번 주 맛집탐방은 어디 어때?</h2>
        <div className="grid grid-cols-2 gap-3">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden shadow-sm">
              <div className="aspect-square overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
