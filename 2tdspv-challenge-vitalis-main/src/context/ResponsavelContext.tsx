import { ResponsavelInput } from "@/schemas/responsavel.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ResponsavelContextType = {
  responsavel: ResponsavelInput | undefined;
  updateResponsavel: (data: ResponsavelInput) => Promise<void>;
  clearResponsavel: () => Promise<void>;
  recarregarResponsavel: () => Promise<void>;
};

export const ResponsavelContext = createContext<ResponsavelContextType | undefined>(undefined);

const STORAGE_KEY = "responsavel";

export const ResponsavelProvider = ({ children }: PropsWithChildren) => {
  const [responsavel, setResponsavel] = useState<ResponsavelInput | undefined>(undefined);

  useEffect(() => {
    recarregarResponsavel();
  }, []);

  const recarregarResponsavel = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setResponsavel(JSON.parse(raw));
    } catch {}
  };

  const updateResponsavel = async (data: ResponsavelInput) => {
    setResponsavel(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearResponsavel = async () => {
    setResponsavel(undefined);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ResponsavelContext.Provider value={{ responsavel, updateResponsavel, clearResponsavel, recarregarResponsavel }}>
      {children}
    </ResponsavelContext.Provider>
  );
};

export const useResponsavel = () => {
  const context = useContext(ResponsavelContext);
  if (!context) {
    throw new Error("Algo está errado");
  }
  return context;
};