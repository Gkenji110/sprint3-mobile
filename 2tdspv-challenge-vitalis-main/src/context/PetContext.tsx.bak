import { PetInput } from "@/schemas/pet.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type PetContextType = {
  pets: PetInput[];
  addPet: (pet: PetInput) => Promise<void>;
  removePet: (index: number) => void;
  updatePet: (index: number, pet: PetInput) => void;
  current: PetInput | undefined;
};

export const PetContext = createContext<PetContextType | undefined>(undefined);

const STORAGE_KEY = "pets";

export const PetProvider = ({ children }: PropsWithChildren) => {
  const [pets, setPets] = useState<PetInput[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        setPets(JSON.parse(raw));
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  }, [pets]);

  const addPet = async (pet: PetInput) => {
    setPets((prev) => [...prev, pet]);
  };

  const removePet = (index: number) => {
    setPets((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePet = (index: number, pet: PetInput) => {
    setPets((prev) => prev.map((item, i) => (i === index ? pet : item)));
  };

  return (
    <PetContext.Provider value={{ pets, addPet, removePet, updatePet, current: pets[0] }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("Algo está errado");
  }
  return context;
};