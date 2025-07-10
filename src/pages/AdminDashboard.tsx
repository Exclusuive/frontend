import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardCard, { DashboardCardProps } from "@/components/DashboardCard";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Item } from "@/types/collection";
import { formatItemAttributes, getItemsByLayer } from "@/lib/items";
import { Mission } from "@/types/mission";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// 카드 데이터 배열
const dashboardCards: DashboardCardProps[] = [
  {
    title: "Active Users",
    description: "Change in the last 7 days",
    value: "12,345",
    change: "+3.2%",
    changeColor: "text-green-500",
    icon: <ArrowUpRight className="h-3 w-3" />,
  },
  {
    title: "Active NFTs",
    description: "Change in the last 7 days",
    value: "8,910",
    change: "+1.7%",
    changeColor: "text-green-500",
    icon: <ArrowUpRight className="h-3 w-3" />,
  },
  {
    title: "Completed Missions",
    description: "Total completed missions",
    value: "2,345",
    change: "+0.9%",
    changeColor: "text-green-500",
    icon: <ArrowUpRight className="h-3 w-3" />,
  },
  {
    title: "Active Points",
    description: "calculated by the listed 3 cards",
    value: "21,600",
    change: "+5.8%",
    changeColor: "text-green-500",
    icon: <ArrowUpRight className="h-3 w-3" />,
  },
];

const renderItemsGrid = (layer: string, items: Item[]) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 overflow-y-auto">
        {getItemsByLayer(items, layer).length > 0 &&
          getItemsByLayer(items, layer).map((item: Item, index: number) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.img_url}
                  alt={item.name}
                  className="h-9 w-9 rounded object-cover md:h-20 md:w-20"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold">{item.name}</h4>
                  <a
                    href={`https://suiscan.xyz/address/${item.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline hover:text-blue-600"
                    tabIndex={0}
                    aria-label={`View ${item.name} on Explorer`}
                  >
                    view on Explorer
                  </a>
                </div>
                {item.description && (
                  <p className="truncate text-xs text-gray-500">{item.description}</p>
                )}
                {item.attributes && item.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formatItemAttributes(item.attributes || "").map((attribute) => (
                      <Badge
                        key={attribute.name}
                        variant="secondary"
                        className="px-1.5 py-0.5 text-[11px]"
                      >
                        {attribute.name}: {attribute.value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 px-3">
                <div className="text-xs font-medium">Total Minted</div>
                <div className="text-center text-xs font-medium">100</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { collection } = useCollectionStore();
  const layers = collection?.layer_types || [];
  const items = collection?.item_types || [];
  const missions: Mission[] = collection?.missions || [];

  return (
    <div className="flex h-full flex-col p-10">
      <section className="grid hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, idx) => (
          <DashboardCard key={card.title + idx} {...card} />
        ))}
      </section>

      <div className="my-4 grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="flex min-h-0 flex-1 flex-col">
          <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader>
              <CardTitle>Item Analysis by Layer</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsbyCategory
                categories={layers}
                items={items}
                getItemsByCategory={getItemsByLayer}
                renderItemsGrid={renderItemsGrid}
              />
            </CardContent>
          </Card>
        </section>
        <section className="flex min-h-0 min-h-full flex-1 flex-col">
          <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Current Missions</CardTitle>
              <div className="my-4 flex flex-col gap-2">
                <Link to="/admin/mission">
                  <Button className="w-fit bg-blue-500 px-10">미션 추가하러 가기</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* 미션 탭 UI */}
              <div className="w-full">
                {/* shadcn Tabs 컴포넌트 사용 */}
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          미션명
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          설명
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                          활성화 여부
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                          참여자 수
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {missions.map((mission) => (
                        <tr key={mission.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {mission.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{mission.description}</td>
                          <td className="px-4 py-2 text-center text-sm">
                            {mission.status === "active" ? (
                              <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                활성
                              </span>
                            ) : (
                              <span className="inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                                비활성
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center text-sm text-gray-900">
                            {mission.participants}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {missions.length === 0 && (
                    <div>
                      <div className="py-8 text-center text-sm text-gray-400">
                        등록된 미션이 없습니다.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
