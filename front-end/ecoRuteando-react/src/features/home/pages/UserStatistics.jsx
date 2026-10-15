import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { LeafIcon, ArrowLeft, ChartIcon, RouteIcon, ClockIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import tripService from "../../../services/tripService";
import routeService from "../../../services/routeService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TRANSPORT_COLORS = {
  walking: "#10b981",
  car: "#f59e0b",
  other: "#94a3b8",
};

const UserStatistics = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [tripsData, setTripsData] = useState([]);
  const [routesCount, setRoutesCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [trips, routes] = await Promise.all([
          tripService.getAll(),
          routeService.getAll(null, false, true),
        ]);

        if (mounted) {
          setTripsData(Array.isArray(trips) ? trips : []);
          setRoutesCount((Array.isArray(routes) ? routes : []).length);
        }
      } catch (err) {
        console.error("Error al cargar datos para estadísticas:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserData();
    return () => {
      mounted = false;
    };
  }, []);

  const completedTrips = tripsData.filter((t) => t.completed);
  const totalCO2 = completedTrips.reduce((sum, t) => sum + (Number(t.actualCo2Kg) || 0), 0);
  const totalKm = completedTrips.reduce((sum, t) => sum + (Number(t.actualDistanceKm) || 0), 0);
  const totalCalories = completedTrips.reduce((sum, t) => sum + (Number(t.estimatedCalories) || 0), 0);
  const treesEquivalent = (totalCO2 / 21).toFixed(2); // ~21kg de CO2 absorbido por árbol por año

  // Agrupación mensual para Chart.js
  const monthlyMap = {};
  completedTrips.forEach((trip) => {
    const date = new Date(trip.startedAt || trip.endedAt || Date.now());
    const monthKey = date.toLocaleString("es-ES", { month: "short" });
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { co2: 0, km: 0 };
    }
    monthlyMap[monthKey].co2 += Number(trip.actualCo2Kg) || 0;
    monthlyMap[monthKey].km += Number(trip.actualDistanceKm) || 0;
  });

  const monthLabels = Object.keys(monthlyMap).length > 0
    ? Object.keys(monthlyMap)
    : ["Sin viajes aún"];
  const monthlyCo2Values = Object.keys(monthlyMap).length > 0
    ? Object.values(monthlyMap).map((m) => Number(m.co2.toFixed(2)))
    : [0];
  const monthlyKmValues = Object.keys(monthlyMap).length > 0
    ? Object.values(monthlyMap).map((m) => Number(m.km.toFixed(1)))
    : [0];

  // Agrupación por modo de transporte para Doughnut Chart
  const modeMap = {};
  completedTrips.forEach((trip) => {
    const mode = (trip.transportMode || "walking").toLowerCase();
    modeMap[mode] = (modeMap[mode] || 0) + 1;
  });

  const modeLabels = Object.keys(modeMap).length > 0
    ? Object.keys(modeMap).map((m) => {
        if (m === "car") return "Automóvil";
        return "Caminata";
      })
    : ["Sin registros"];

  const modeValues = Object.keys(modeMap).length > 0
    ? Object.values(modeMap)
    : [1];

  const modeColors = Object.keys(modeMap).length > 0
    ? Object.keys(modeMap).map((m) => TRANSPORT_COLORS[m] || TRANSPORT_COLORS.other)
    : [isDarkMode ? "#26383D" : "#e5e7eb"];

  // Configuración de estilos y temas para Chart.js
  const axisColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const gridColor = isDarkMode ? "rgba(55, 65, 81, 0.5)" : "rgba(229, 231, 235, 0.8)";
  const textColor = isDarkMode ? "#e2e8f0" : "#1f2937";

  // Gráfico 1: Barras de CO2 mensual
  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "CO₂ Ahorrado (kg)",
        data: monthlyCo2Values,
        backgroundColor: "rgba(16, 185, 129, 0.85)",
        hoverBackgroundColor: "#059669",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} kg de CO₂`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 12 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 12 } },
        beginAtZero: true,
      },
    },
  };

  // Gráfico 2: Línea de Distancia (Km)
  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Distancia Recorrida (km)",
        data: monthlyKmValues,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: isDarkMode ? "#0B1215" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} km recorridos`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 12 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 12 } },
        beginAtZero: true,
      },
    },
  };

  // Gráfico 3: Dona por modo de transporte
  const doughnutData = {
    labels: modeLabels,
    datasets: [
      {
        data: modeValues,
        backgroundColor: modeColors,
        borderColor: isDarkMode ? "#162329" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { family: "Inter, system-ui, sans-serif", size: 12 },
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} viajes`,
        },
      },
    },
    cutout: "68%",
  };

<<<<<<< Updated upstream
  // Logros dinámicos basados en la actividad real
  const achievements = [
    {
      name: "Primera Ruta",
      completed: routesCount >= 1,
      icon: "🚀",
      value: `${routesCount}/1`,
    },
    {
      name: "Explorador Verde (5 Rutas)",
      completed: routesCount >= 5,
      icon: "🌟",
      value: `${routesCount}/5`,
    },
    {
      name: "Primer Viaje Sostenible",
      completed: completedTrips.length >= 1,
      icon: "🚶",
      value: `${completedTrips.length}/1`,
    },
    {
      name: "Viajero Constante (10 Viajes)",
      completed: completedTrips.length >= 10,
      icon: "🏆",
      value: `${completedTrips.length}/10`,
    },
    {
      name: "10 kg CO₂ Ahorrados",
      completed: totalCO2 >= 10,
      icon: "🌿",
      value: `${totalCO2.toFixed(1)}/10 kg`,
    },
    {
      name: "50 km Sostenibles",
      completed: totalKm >= 50,
      icon: "🚶",
      value: `${totalKm.toFixed(1)}/50 km`,
    },
  ];
=======

>>>>>>> Stashed changes

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B1215]" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? "bg-[#162329] border-b border-[#26383D]" : "bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700"} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? "bg-[#162329] border border-emerald-500/30" : "bg-white"}`}>
                <ChartIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Reportes Estadísticos y Visualización</h1>
                <p className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-green-100"}`}>
                  Análisis interactivo de movilidad y huella ambiental impulsado por Chart.js
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDarkMode
                  ? "bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#26383D]"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              <ArrowLeft size={16} />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Cargando datos y generando reportes...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards de Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <LeafIcon size={20} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    CO₂ Ahorrado
                  </span>
                </div>
                <p className={`text-3xl font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                  {totalCO2.toFixed(1)} <span className="text-base font-normal">kg</span>
                </p>
                <p className={`text-[11px] mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  ≈ {treesEquivalent} árboles absorbentes
                </p>
              </div>

              <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                    <RouteIcon size={20} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Distancia Total
                  </span>
                </div>
                <p className={`text-3xl font-black ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`}>
                  {totalKm.toFixed(1)} <span className="text-base font-normal">km</span>
                </p>
                <p className={`text-[11px] mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  En trayectos sostenibles
                </p>
              </div>

              <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <ClockIcon size={20} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Viajes Hechos
                  </span>
                </div>
                <p className={`text-3xl font-black ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>
                  {completedTrips.length}
                </p>
                <p className={`text-[11px] mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {routesCount} rutas creadas
                </p>
              </div>

              <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <TrophyIcon size={20} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    EcoPuntos
                  </span>
                </div>
                <p className={`text-3xl font-black ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
                  {Math.round(totalKm * 10)}
                </p>
                <p className={`text-[11px] mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {Math.round(totalCalories)} kcal quemadas
                </p>
              </div>
            </div>

            {/* GRÁFICOS INTERACTIVOS CHART.JS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico 1: Barras de CO2 Ahorrado */}
              <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                      CO₂ Ahorrado por Período
                    </h3>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Kilos de emisiones evitadas en la atmósfera (Chart.js Bar)
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                    {totalCO2.toFixed(1)} kg total
                  </span>
                </div>
                <div className="h-[280px] w-full">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Gráfico 2: Línea de Distancia Recorrida */}
              <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                      Evolución de Kilómetros Sostenibles
                    </h3>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Trayectos acumulados por período (Chart.js Line)
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 font-semibold">
                    {totalKm.toFixed(1)} km total
                  </span>
                </div>
                <div className="h-[280px] w-full">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
            </div>

            {/* Fila 2: Distribución por Modo de Transporte */}
            <div className="mb-8 max-w-2xl mx-auto">
              {/* Gráfico 3: Dona por Modo de Transporte */}
              <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
                <h3 className={`text-base font-bold mb-1 text-center ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                  Distribución por Modo de Transporte
                </h3>
                <p className={`text-xs mb-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Porcentaje de viajes según el transporte utilizado (Chart.js Doughnut)
                </p>
                <div className="h-[280px] w-full flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="text-center py-4">
              <p className={`text-xs flex items-center justify-center gap-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                <LeafIcon size={14} className="text-emerald-500" />
                Cada kilómetro planificado y recorrido reduce la huella de carbono de la ciudad.
                <LeafIcon size={14} className="text-emerald-500" />
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserStatistics;