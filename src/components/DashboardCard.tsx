import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  description: string;
  value: string | number;
  change: string;
  changeColor?: string;
  icon?: React.ReactNode;
}

const DashboardCard = ({
  title,
  description,
  value,
  change,
  changeColor = "text-green-500",
  icon = <ArrowUpRight className="h-3 w-3" />,
}: DashboardCardProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={"flex items-center gap-1 text-xs " + changeColor}>
        {icon} {change}
      </div>
    </CardContent>
  </Card>
);

export default DashboardCard;
