import { createContext, useContext, useState, ReactNode } from 'react';

type Coordinate = { latitude: number; longitude: number };

type ActiveRoute = {
  id: string;
  name: string;
  coords: Coordinate[];
  landmarks: string[];
};

type RouteContextType = {
  activeRoute: ActiveRoute | null;
  setActiveRoute: (route: ActiveRoute | null) => void;
};

const RouteContext = createContext<RouteContextType>({
  activeRoute: null,
  setActiveRoute: () => {},
});

export function RouteProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);

  return (
    <RouteContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  return useContext(RouteContext);
}