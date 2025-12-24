import { useEffect } from "react";

const PerformanceMonitor = ({ enabled = false }) => {
  useEffect(() => {
    if (!enabled || !window.performance) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "navigation") {
          console.group("🚀 Navigation Performance");
          console.log(
            "DNS Lookup:",
            entry.domainLookupEnd - entry.domainLookupStart,
            "ms"
          );
          console.log(
            "TCP Connection:",
            entry.connectEnd - entry.connectStart,
            "ms"
          );
          console.log(
            "Server Response:",
            entry.responseEnd - entry.requestStart,
            "ms"
          );
          console.log(
            "DOM Processing:",
            entry.domContentLoadedEventStart - entry.responseEnd,
            "ms"
          );
          console.log(
            "Total Load Time:",
            entry.loadEventEnd - entry.navigationStart,
            "ms"
          );
          console.groupEnd();
        }

        if (entry.entryType === "paint") {
          console.log(`🎨 ${entry.name}:`, entry.startTime, "ms");
        }

        if (entry.entryType === "largest-contentful-paint") {
          console.log("🖼️ Largest Contentful Paint:", entry.startTime, "ms");
        }

        if (entry.entryType === "layout-shift") {
          console.log("📐 Layout Shift Score:", entry.value);
        }
      });
    });

    // Observe various performance metrics
    try {
      observer.observe({
        entryTypes: [
          "navigation",
          "paint",
          "largest-contentful-paint",
          "layout-shift",
        ],
      });
    } catch (e) {
      console.warn("Some performance metrics not available:", e.message);
    }

    // Monitor memory usage if available
    if (performance.memory) {
      const logMemory = () => {
        console.log("💾 Memory Usage:", {
          used:
            Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + "MB",
          total:
            Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + "MB",
          limit:
            Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + "MB",
        });
      };

      const memoryInterval = setInterval(logMemory, 30000); // Log every 30 seconds

      return () => {
        clearInterval(memoryInterval);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [enabled]);

  return null;
};

export default PerformanceMonitor;
