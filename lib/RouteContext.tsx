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
  toStartCoords: Coordinate[];
  setToStartCoords: (coords: Coordinate[]) => void;
};

const RouteContext = createContext<RouteContextType>({
  activeRoute: null,
  setActiveRoute: () => {},
  toStartCoords: [],
  setToStartCoords: () => {},
});

export function RouteProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
  const [toStartCoords, setToStartCoords] = useState<Coordinate[]>([]);

  return (
    <RouteContext.Provider value={{ activeRoute, setActiveRoute, toStartCoords, setToStartCoords }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useActiveRoute() {
  return useContext(RouteContext);
}