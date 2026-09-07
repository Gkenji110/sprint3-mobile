import { ConsultaInput } from "@/schemas/consulta.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ConsultaContextType = {
  consultas: ConsultaInput[];
  addConsulta: (consulta: ConsultaInput) => void;
  removeConsulta: (index: number) => void;
  updateConsulta: (index: number, consulta: ConsultaInput) => void;
};

export const ConsultaContext = createContext<ConsultaContextType | undefined>(
  undefined
);

const STORAGE_KEY = "consultas";

export const ConsultaProvider = ({ children }: PropsWithChildren) => {
  const [consultas, setConsultas] = useState<ConsultaInput[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        setConsultas(JSON.parse(raw));
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
  }, [consultas]);

  function addConsulta(consulta: ConsultaInput) {
    setConsultas((prev) => [...prev, consulta]);
  }

  function removeConsulta(index: number) {
    setConsultas((prev) => prev.filter((_, i) => i !== index));
  }

  function updateConsulta(index: number, consulta: ConsultaInput) {
    setConsultas((prev) =>
      prev.map((item, i) => (i === index ? consulta : item))
    );
  }

  return (
    <ConsultaContext.Provider
      value={{ consultas, addConsulta, removeConsulta, updateConsulta }}
    >
      {children}
    </ConsultaContext.Provider>
  );
};

export const useConsulta = () => {
  const context = useContext(ConsultaContext);
  if (!context) {
    throw new Error("Algo está errado");
  }
  return context;
};