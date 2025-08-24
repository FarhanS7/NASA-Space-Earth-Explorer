// components/events/EventList.jsx
"use client";

import {
  AlertCircle,
  Calendar,
  CloudRain,
  ExternalLink,
  Flame,
  MapPin,
  MountainIcon,
  Wind,
} from "lucide-react";

export default function EventList({ events, isLoading }) {
  const getIconForCategory = (categoryId) => {
    switch (categoryId) {
      case "wildfires":
        return Flame;
      case "severeStorms":
        return Wind;
      case "floods":
        return CloudRain;
      case "volcanoes":
        return MountainIcon;
      default:
        return AlertCircle;
    }
  };

  const getColorForCategory = (categoryId) => {
    switch (categoryId) {
      case "wildfires":
        return "text-orange-500";
      case "severeStorms":
        return "text-blue-500";
      case "floods":
        return "text-cyan-500";
      case "volcanoes":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-blue-200">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No events found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {events.map((event) => {
        const IconComponent = getIconForCategory(event.categories[0].id);
        const colorClass = getColorForCategory(event.categories[0].id);

        return (
          <div
            key={event.id}
            className="p-4 rounded-lg bg-blue-800/30 border border-blue-700/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-6 w-6 mt-1 ${colorClass}`} />
                <div>
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <p className="text-sm text-blue-200">
                    {event.categories[0].title}
                  </p>

                  <div className="flex items-center mt-2 space-x-4 text-xs text-blue-300">
                    {event.geometry && event.geometry.length > 0 && (
                      <>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(
                              event.geometry[0].date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {event.geometry[0].coordinates[1].toFixed(2)}°,
                            {event.geometry[0].coordinates[0].toFixed(2)}°
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {event.sources && event.sources.length > 0 && (
                <a
                  href={event.sources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Details
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
