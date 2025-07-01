import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Package,
  TrendingUp,
  Activity,
  DollarSign,
  Eye,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const CollectionStats = [
  {
    name: "총 컬렉션",
    value: "1,234",
    delta: "+12.3%",
    trend: "up",
    icon: Package,
    description: "전월 대비 증가",
  },
  {
    name: "총 NFT",
    value: "45,678",
    delta: "+8.1%",
    trend: "up",
    icon: Eye,
    description: "전월 대비 증가",
  },
  {
    name: "활성 사용자",
    value: "3,654",
    delta: "+15.2%",
    trend: "up",
    icon: Users,
    description: "전월 대비 증가",
  },
  {
    name: "총 거래량",
    value: "₩2.4M",
    delta: "+23.5%",
    trend: "up",
    icon: DollarSign,
    description: "전월 대비 증가",
  },
];

const RecentActivity = [
  {
    id: 1,
    user: "김철수",
    action: "새로운 컬렉션 생성",
    collection: "디지털 아트 시리즈 #1",
    time: "2분 전",
    status: "success",
  },
  {
    id: 2,
    user: "이영희",
    action: "NFT 민팅",
    collection: "게임 아이템 컬렉션",
    time: "5분 전",
    status: "success",
  },
  {
    id: 3,
    user: "박민수",
    action: "컬렉션 수정",
    collection: "포토그래피 시리즈",
    time: "10분 전",
    status: "warning",
  },
  {
    id: 4,
    user: "최지영",
    action: "NFT 거래 완료",
    collection: "음악 NFT",
    time: "15분 전",
    status: "success",
  },
  {
    id: 5,
    user: "정현우",
    action: "계정 생성",
    collection: "-",
    time: "20분 전",
    status: "info",
  },
];

const TopCollections = [
  {
    name: "디지털 아트 시리즈 #1",
    volume: "₩450,000",
    items: 150,
    floor: "₩3,000",
    change: "+12.5%",
  },
  {
    name: "게임 아이템 컬렉션",
    volume: "₩320,000",
    items: 89,
    floor: "₩2,500",
    change: "+8.3%",
  },
  {
    name: "포토그래피 시리즈",
    volume: "₩280,000",
    items: 67,
    floor: "₩4,200",
    change: "+15.7%",
  },
  {
    name: "음악 NFT",
    volume: "₩190,000",
    items: 45,
    floor: "₩5,800",
    change: "+6.2%",
  },
];

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* 1. KPI Cards */}
      <section>
        <h2 className="mb-4 text-xl font-bold">상단 요약 카드 (KPI)</h2>
        {/* KPI Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Example KPI Card */}
          <Card>
            <CardHeader>
              <CardTitle>총 NFT 민팅 수</CardTitle>
              <CardDescription>최근 7일 증감률</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,678</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <ArrowUpRight className="h-3 w-3" /> +8.1%
              </div>
            </CardContent>
          </Card>
          {/* ...repeat for other KPIs... */}
        </div>
      </section>

      {/* 2. 레이어별 아이템 분석 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">레이어별 아이템 분석</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Bar Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>레이어별 아이템 민팅 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex h-48 items-center justify-center">
                [Bar Chart]
              </div>
            </CardContent>
          </Card>
          {/* 인기 아이템 TOP 5 */}
          <Card>
            <CardHeader>
              <CardTitle>가장 인기 있는 아이템 TOP 5</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
          {/* Low Adoption Items */}
          <Card>
            <CardHeader>
              <CardTitle>잘 사용되지 않는 아이템</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. 유저 활동 분석 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">유저 활동 분석</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* TOP 10 Users */}
          <Card>
            <CardHeader>
              <CardTitle>가장 활동적인 유저 TOP 10</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>최근 가입 유저 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
          {/* Churned Users */}
          <Card>
            <CardHeader>
              <CardTitle>이탈 유저 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Metric/Chart Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. 인벤토리/상점 사용 분석 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">인벤토리 / 상점 사용 분석</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 장착 비율 */}
          <Card>
            <CardHeader>
              <CardTitle>아이템 장착 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Pie/Bar Chart Placeholder]</div>
            </CardContent>
          </Card>
          {/* 상점 판매 수 */}
          <Card>
            <CardHeader>
              <CardTitle>상점 판매 수 & 인기 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
          {/* 평균 장착 아이템 수 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자별 평균 장착 아이템 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Metric Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. 커뮤니티 미션 참여도 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">커뮤니티 미션 참여도</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 미션 생성/참여 수 */}
          <Card>
            <CardHeader>
              <CardTitle>미션 생성 수 / 참여 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Metric/Chart Placeholder]</div>
            </CardContent>
          </Card>
          {/* 미션 성공률/포기율 */}
          <Card>
            <CardHeader>
              <CardTitle>미션 별 성공률 / 포기율</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Bar Chart Placeholder]</div>
            </CardContent>
          </Card>
          {/* 인기 미션 */}
          <Card>
            <CardHeader>
              <CardTitle>가장 인기 있었던 미션</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. 실시간 알림 / 최근 이벤트 로그 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">실시간 알림 / 최근 이벤트 로그</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {/* 트랜잭션 로그 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 트랜잭션 로그</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Table/List Placeholder]</div>
            </CardContent>
          </Card>
          {/* 이벤트 피드 & 관리자 알림 */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 피드 & 관리자 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Feed/Alert Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. 전체 흐름 시각화 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">전체 흐름 시각화</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {/* 타임라인 차트 */}
          <Card>
            <CardHeader>
              <CardTitle>타임라인 차트</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Line/Stacked Bar Chart Placeholder]</div>
            </CardContent>
          </Card>
          {/* NFT 보유자 네트워크 */}
          <Card>
            <CardHeader>
              <CardTitle>NFT 보유자 네트워크 (선택)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>[Network Graph Placeholder]</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 8. CTA 영역 (관리 액션 유도) */}
      <section>
        <h2 className="mb-4 text-xl font-bold">관리 액션 제안 (CTA)</h2>
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <span>아이템 사용률이 낮은 레이어가 있습니다. 리워드 미션을 추가해보세요!</span>
              <Button>미션 추가</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4">
              <span>활동 유저 수가 감소 중입니다. 상점에 새로운 아이템을 추가해보세요.</span>
              <Button>아이템 추가</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
