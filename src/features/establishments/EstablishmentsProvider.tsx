import { createContext, useContext, useState, type ReactNode } from "react";
import {
  demoEstablishments,
  type DemoEstablishment,
} from "./data/establishments";

export const ALL_ESTABLISHMENTS_ID = "all";
const EstablishmentsContext = createContext<{
  establishments: readonly DemoEstablishment[];
  selectedEstablishmentId: string;
  selectedEstablishments: readonly DemoEstablishment[];
  setSelectedEstablishmentId: (id: string) => void;
  addManualEstablishment: (name: string) => void;
} | null>(null);

export function EstablishmentsProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(ALL_ESTABLISHMENTS_ID);
  const [manualEstablishments, setManualEstablishments] = useState<DemoEstablishment[]>([]);
  const establishments = [...demoEstablishments, ...manualEstablishments];
  const selectedEstablishments =
    selectedId === ALL_ESTABLISHMENTS_ID
      ? establishments
      : establishments.filter(({ id }) => id === selectedId);

  return (
    <EstablishmentsContext.Provider
      value={{
        establishments,
        selectedEstablishmentId: selectedId,
        selectedEstablishments,
        setSelectedEstablishmentId: setSelectedId,
        addManualEstablishment: (name) =>
          setManualEstablishments((current) => [
            ...current,
            {
              id: `manual-${Date.now()}-${current.length}`,
              name,
              dataSource: "manual",
              payments: [],
              checkins: [],
            },
          ]),
      }}
    >
      {children}
    </EstablishmentsContext.Provider>
  );
}

export function useEstablishments() {
  const value = useContext(EstablishmentsContext);
  if (!value) {
    throw new Error("useEstablishments must be used within EstablishmentsProvider");
  }
  return value;
}
