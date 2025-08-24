// app/(main)/dashboard/events-tracker/page.jsx
"use client";

import EventList from "@/components/events/EventList";
import EventMap from "@/components/events/EventMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Bell,
  BellOff,
  CloudRain,
  Flame,
  MountainIcon,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function EventsTrackerPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Event categories with icons
  const categories = [
    { id: "all", name: "All Events", icon: AlertCircle, color: "bg-gray-500" },
    { id: "wildfires", name: "Wildfires", icon: Flame, color: "bg-orange-500" },
    { id: "severeStorms", name: "Storms", icon: Wind, color: "bg-blue-500" },
    { id: "floods", name: "Floods", icon: CloudRain, color: "bg-cyan-500" },
    {
      id: "volcanoes",
      name: "Volcanoes",
      icon: MountainIcon,
      color: "bg-red-500",
    },
  ];

  // Fetch events from NASA EONET API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nasa-eonet");
        const data = await response.json();

        if (data && data.events) {
          setEvents(data.events);
          setFilteredEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.categories[0].id === selectedCategory)
      );
    }
  }, [selectedCategory, events]);

  // Toggle notifications
  const toggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          // Setup periodic checks for high-impact events
          setupEventNotifications();
        }
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  const setupEventNotifications = () => {
    // Check for new events every 30 minutes
    setInterval(async () => {
      const response = await fetch("/api/nasa-eonet?limit=5");
      const data = await response.json();

      if (data && data.events) {
        // Check for high impact events
        const highImpactEvents = data.events.filter(
          (event) =>
            event.title.toLowerCase().includes("warning") ||
            event.title.toLowerCase().includes("major") ||
            event.title.toLowerCase().includes("severe")
        );

        highImpactEvents.forEach((event) => {
          new Notification("NASA Event Alert", {
            body: `${event.title} - ${event.categories[0].title}`,
            icon: "/nasa-logo.svg",
          });
        });
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🌪️ Natural Disaster & Event Tracker
            </span>
          </CardTitle>
          <Button
            onClick={toggleNotifications}
            variant={notificationsEnabled ? "default" : "outline"}
            className={
              notificationsEnabled ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {notificationsEnabled ? (
              <BellOff className="h-4 w-4 mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            {notificationsEnabled ? "Disable Alerts" : "Enable Alerts"}
          </Button>
        </CardHeader>
        <CardContent className="text-blue-100">
          <p>
            Real-time tracking of natural events worldwide using NASA's EONET
            API. Monitor wildfires, storms, volcanoes, and other significant
            events with live data.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Event Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-200">Event Types</h3>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className={`w-full justify-start mb-2 ${
                      selectedCategory === category.id
                        ? category.color
                        : "bg-blue-500/10"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-2 pt-4 border-t border-blue-500/30">
              <h3 className="font-medium text-blue-200">Statistics</h3>
              <div className="text-sm text-blue-100 space-y-1">
                <p>Total Events: {events.length}</p>
                <p>Filtered: {filteredEvents.length}</p>
                <p>Last Updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
            <CardHeader>
              <CardTitle>Live Event Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <EventMap events={filteredEvents} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Event List</CardTitle>
            </CardHeader>
            <CardContent>
              <EventList events={filteredEvents} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
