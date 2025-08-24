// components/climate/DataSourceInfo.jsx
export default function DataSourceInfo({ dataset }) {
  const dataSources = {
    co2: {
      name: "Carbon Dioxide Concentration",
      source: "NASA OCO-2 & AIRS Instruments",
      description: "Atmospheric CO₂ measurements from satellite observations",
      link: "https://climate.nasa.gov/vital-signs/carbon-dioxide/",
    },
    temperature: {
      name: "Global Surface Temperature",
      source: "NASA GISS Surface Temperature Analysis",
      description:
        "Global temperature anomalies relative to 1951-1980 baseline",
      link: "https://climate.nasa.gov/vital-signs/global-temperature/",
    },
    rainfall: {
      name: "Precipitation Patterns",
      source: "NASA GPM Mission",
      description: "Global rainfall measurement from satellite data",
      link: "https://gpm.nasa.gov/",
    },
    sealevel: {
      name: "Sea Level Rise",
      source: "NASA Satellite Altimetry",
      description: "Global mean sea level change from satellite measurements",
      link: "https://climate.nasa.gov/vital-signs/sea-level/",
    },
  };

  const info = dataSources[dataset] || dataSources.co2;

  return (
    <div className="pt-4 border-t border-blue-500/30">
      <h3 className="font-medium text-blue-200 mb-2">Data Source</h3>
      <div className="text-sm text-blue-100 space-y-2">
        <p>
          <strong>{info.name}</strong>
        </p>
        <p>Source: {info.source}</p>
        <p className="text-xs opacity-80">{info.description}</p>
        <a
          href={info.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 text-xs inline-block mt-1"
        >
          Learn more ↗
        </a>
      </div>
    </div>
  );
}
