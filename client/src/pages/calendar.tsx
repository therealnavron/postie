import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calendarEvents } from "@/lib/mock-data";
import type { Platform, PostType } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Image, Video, Film, LayoutGrid, MessageSquare, Clock, Zap, Layers, Camera, Star } from "lucide-react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

const platformIcons: Record<Platform, typeof SiInstagram> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  twitter: SiX,
};

const postTypeIcons: Record<PostType, typeof Image> = {
  single_image: Image,
  video: Video,
  reel: Film,
  slideshow: Layers,
  thread: MessageSquare,
  story: Film,
  highlight: Star,
  profile_picture: Camera,
};

const statusColors: Record<string, string> = {
  posted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  due_today: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday=0
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const monthName = currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6" data-testid="calendar-page">
      <div>
        <h1 className="text-xl font-semibold">Content Calendar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your scheduled posts and campaign deadlines.
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{monthName}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth} data-testid="btn-prev-month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth} data-testid="btn-next-month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1.5">
                {d}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square sm:aspect-auto sm:min-h-[80px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              return (
                <div
                  key={day}
                  className={`aspect-square sm:aspect-auto sm:min-h-[80px] p-1 rounded-md border border-transparent ${
                    isToday ? "bg-primary/5 border-primary/20" : ""
                  } ${events.length > 0 ? "bg-card" : ""}`}
                  data-testid={`cal-day-${day}`}
                >
                  <span
                    className={`text-xs ${
                      isToday
                        ? "bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="hidden sm:block mt-1 space-y-0.5">
                    {events.map((evt) => {
                      const PIcon = platformIcons[evt.platform];
                      return (
                        <div
                          key={evt.id}
                          className={`flex items-center gap-1 px-1 py-0.5 rounded text-[9px] truncate ${statusColors[evt.status] || "bg-muted text-muted-foreground"}`}
                          data-testid={`cal-event-${evt.id}`}
                        >
                          <PIcon className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{evt.brand_name}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Mobile dots */}
                  {events.length > 0 && (
                    <div className="flex sm:hidden gap-0.5 mt-0.5 justify-center">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className={`h-1 w-1 rounded-full ${
                            evt.status === "posted"
                              ? "bg-emerald-500"
                              : evt.status === "due_today"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events list */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {calendarEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((evt) => {
              const Icon = postTypeIcons[evt.post_type] || Image;
              const PIcon = platformIcons[evt.platform];
              const isToday = evt.status === "due_today";
              return (
                <div
                  key={evt.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isToday ? "border-amber-500/30 bg-amber-500/5" : "border-border/40"
                  }`}
                  data-testid={`upcoming-${evt.id}`}
                >
                  <div className="h-8 w-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{evt.campaign_title}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <PIcon className="h-2.5 w-2.5" />
                      <span>{evt.brand_name}</span>
                      {evt.time && (
                        <>
                          <span>·</span>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{evt.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="secondary" className={`text-[10px] ${statusColors[evt.status]}`}>
                      {evt.status.replace("_", " ")}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {isToday ? "Today" : new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
