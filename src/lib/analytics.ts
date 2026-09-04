import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-T17NBF411W";

export const initAnalytics = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
  }
};

export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.event(action, params);
  }
};

export const trackPageView = (path?: string) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path || window.location.pathname + window.location.search,
    });
  }
};
