import api from "../api/api";

const extensionFor = (format) =>
  format === "json" ? "json" : format === "xlsx" ? "xlsx" : "csv";

const defaultName = (prefix, format) =>
  `${prefix}-${new Date().toISOString().slice(0, 10)}.${extensionFor(format)}`;

const fileNameFromResponse = (response, fallback) => {
  const disposition = response?.headers?.["content-disposition"];
  if (!disposition) return fallback;

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = /filename="?([^";]+)/i.exec(disposition);
  return plainMatch ? plainMatch[1] : fallback;
};

const blobErrorDetail = async (blob, fallback) => {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return parsed?.message || parsed?.detail || parsed?.title || fallback;
  } catch {
    return fallback;
  }
};

const requestExport = async (url, params, fallbackName) => {
  try {
    const response = await api.get(url, {
      params,
      responseType: "blob",
    });
    return {
      blob: response.data,
      fileName: fileNameFromResponse(response, fallbackName),
    };
  } catch (err) {
    const blob = err?.response?.data;
    if (blob instanceof Blob) {
      const detail = await blobErrorDetail(
        blob,
        "No se pudo exportar los datos"
      );
      const error = new Error(detail);
      error.detail = detail;
      throw error;
    }
    throw err;
  }
};

const exportService = {
  exportUserTrips: async (format, { from = null, to = null } = {}) => {
    const params = { format };
    if (from) params.from = from;
    if (to) params.to = to;
    return requestExport("/exports/trips", params, defaultName("trayectos", format));
  },

  exportStats: async (format, { from = null, to = null } = {}) => {
    const params = { format };
    if (from) params.from = from;
    if (to) params.to = to;
    return requestExport("/exports/stats", params, defaultName("estadisticas", format));
  },
};

export default exportService;