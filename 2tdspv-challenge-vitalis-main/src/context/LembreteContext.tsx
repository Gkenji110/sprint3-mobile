import { LembreteInput } from "@/schemas/lembrete.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type LembreteContextType = {
  lembretes: LembreteInput[];
  addLembrete: (lembrete: LembreteInput) => void;
  removeLembrete: (index: number) => void;
  updateLembrete: (index: number, lembrete: LembreteInput) => void;
};

export const LembreteContext = createContext<LembreteContextType | undefined>(
  undefined
);

const STORAGE_KEY = "lembretes";

export const LembreteProvider = ({ children }: PropsWithChildren) => {
  const [lembretes, setLembretes] = useState<LembreteInput[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        setLembretes(JSON.parse(raw));
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lembretes));
  }, [lembretes]);

  function addLembrete(lembrete: LembreteInput) {
    setLembretes((prev) => [...prev, lembrete]);
  }

  function removeLembrete(index: number) {
    setLembretes((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLembrete(index: number, lembrete: LembreteInput) {
    setLembretes((prev) =>
      prev.map((item, i) => (i === index ? lembrete : item))
    );
  }

  return (
    <LembreteContext.Provider
      value={{ lembretes, addLembrete, removeLembrete, updateLembrete }}
    >
      {children}
    </LembreteContext.Provider>
  );
};

export const useLembrete = () => {
  const context = useContext(LembreteContext);
  if (!context) {
    throw new Error("Algo está errado");
  }
  return context;
};