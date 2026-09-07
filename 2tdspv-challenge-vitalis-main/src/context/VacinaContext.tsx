import { VacinaInput } from "@/schemas/vacina.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type VacinaContextType = {
  vacinas: VacinaInput[];
  addVacina: (vacina: VacinaInput) => void;
  removeVacina: (index: number) => void;
  updateVacina: (index: number, vacina: VacinaInput) => void;
  getVacinasPorPet: (petIndex: number) => VacinaInput[];
};

export const VacinaContext = createContext<VacinaContextType | undefined>(undefined);

const STORAGE_KEY = "vacinas";

export const VacinaProvider = ({ children }: PropsWithChildren) => {
  const [vacinas, setVacinas] = useState<VacinaInput[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        setVacinas(JSON.parse(raw));
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(vacinas));
  }, [vacinas]);

  function addVacina(vacina: VacinaInput) {
    setVacinas((prev) => [...prev, vacina]);
  }

  function removeVacina(index: number) {
    setVacinas((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVacina(index: number, vacina: VacinaInput) {
    setVacinas((prev) => prev.map((item, i) => (i === index ? vacina : item)));
  }

  function getVacinasPorPet(petIndex: number) {
    return vacinas.filter((v) => v.petIndex === petIndex);
  }

  return (
    <VacinaContext.Provider value={{ vacinas, addVacina, removeVacina, updateVacina, getVacinasPorPet }}>
      {children}
    </VacinaContext.Provider>
  );
};

export const useVacina = () => {
  const context = useContext(VacinaContext);
  if (!context) {
    throw new Error("Algo está errado");
  }
  return context;
};