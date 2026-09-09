import { useMemo } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAtualizarConsultaMutation } from "@/hooks/useAtualizarConsultaMutation";
import { ConsultaApiResponse } from "@/services/consulta.service";
import { PetApiResponse } from "@/services/pet.service";
import { UnidadeApiResponse } from "@/services/unidade.service";
import ConsultaCard from "./ConsultaCard";

interface ConsultaVetItemProps {
  consulta: ConsultaApiResponse;
  pets: PetApiResponse[];
  unidades: UnidadeApiResponse[];
}

/**
 * Um item da lista de consultas do veterinário, com o atalho "Realizada".
 *
 * Fica num componente à parte (e não direto no `FlatList` de
 * `(vet)/consultas.tsx`) porque `useAtualizarConsultaMutation` é um hook —
 * cada linha da lista precisa da sua própria instância, uma por consulta.
 *
 * `petId`/`unidadeId` são achados casando `nomePet`/`nomeUnidade` contra as
 * listas do veterinário (mesma lógica de `edit-consulta-vet.tsx` — `GET
 * /api/consultas` não devolve esses IDs). Se o nome não for único, o atalho
 * simplesmente some do card em vez de arriscar salvar com o ID errado.
 */
export default function ConsultaVetItem({ consulta, pets, unidades }: ConsultaVetItemProps) {
  const petCorrespondente = useMemo(
    () => pets.filter((p) => p.nome === consulta.nomePet),
    [pets, consulta.nomePet],
  );
  const petId = petCorrespondente.length === 1 ? petCorrespondente[0].id : undefined;

  const unidadeCorrespondente = useMemo(
    () => unidades.filter((u) => u.nome === consulta.nomeUnidade),
    [unidades, consulta.nomeUnidade],
  );
  const unidadeId = unidadeCorrespondente.length === 1 ? unidadeCorrespondente[0].id : undefined;

  const { mutate: salvarConsulta } = useAtualizarConsultaMutation(
    consulta.id,
    petId ?? 0,
    unidadeId ?? 0,
  );

  const handleMarcarRealizada = () => {
    Alert.alert(
      "Marcar como Realizada",
      `Confirmar que a consulta de "${consulta.nomePet}" foi realizada?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () =>
            salvarConsulta({
              tipo: consulta.tipo,
              dataHora: consulta.dataHora,
              status: "REALIZADA",
              observacoes: consulta.observacoes ?? undefined,
            }),
        },
      ],
    );
  };

  return (
    <ConsultaCard
      consulta={consulta}
      onPress={() =>
        router.push({
          pathname: "/edit-consulta-vet",
          params: { id: consulta.id.toString() },
        })
      }
      onMarcarRealizada={petId !== undefined && unidadeId !== undefined ? handleMarcarRealizada : undefined}
    />
  );
}
