import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export interface BaseEntity {
  id: number;
  status?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  birthday?: string | null;
}

const formatBirthday = (val: string | null | undefined): string | null => {
  if (!val) return null;
  return String(val).substring(0, 10);
};
export function useEntityActions<T extends BaseEntity>(options: {
  apiBase: string;
  idField: string;
  onActionComplete?: () => void;
  onClose?: () => void;
}) {
  const { fetchWithAuth } = useAuth();
  const { apiBase, idField, onActionComplete, onClose } = options;

  const handleSave = useCallback(
    async (entity: T) => {
      try {
        const payload = {
          ...entity,
          birthday: formatBirthday(entity.birthday),
        };

        const response = await fetchWithAuth(
          `${apiBase}/${idField}/${entity.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) throw new Error("Erreur lors de la mise à jour");

        Swal.fire({
          icon: "success",
          title: "Succès !",
          text: "Le profil a été mis à jour.",
          timer: 2000,
          showConfirmButton: false,
        });
        onActionComplete?.();
        onClose?.();
      } catch (error) {
        console.error("Erreur onSave :", error);
        Swal.fire({
          icon: "error",
          title: "Oups...",
          text: "Une erreur est survenue.",
        });
      }
    },
    [apiBase, idField, onActionComplete, onClose, fetchWithAuth],
  );

  const handleToggleSuspend = useCallback(
    async (entity: T) => {
      const currentStatus = entity.status?.toLowerCase();

      let nextStatus = "Actif";
      let swalTitle = "Suspendre le compte ?";
      let swalText = "Êtes-vous sûr de vouloir suspendre le compte ?";
      let swalIcon: "warning" | "success" = "warning";
      let swalConfirmColor = "#ff9f43";

      if (currentStatus === "suspendu") {
        nextStatus = "Actif";
        swalTitle = "Réactiver le compte ?";
        swalText = "Êtes-vous sûr de vouloir réactiver le compte ?";
        swalIcon = "success";
        swalConfirmColor = "#10ac84";
      } else if (currentStatus === "en attente") {
        nextStatus = "Actif";
        swalTitle = "Approuver le profil ?";
        swalText =
          "Êtes-vous sûr de vouloir approuver et activer ce coiffeur ?";
        swalIcon = "success";
        swalConfirmColor = "#10ac84";
      } else {
        nextStatus = "Suspendu";
        swalTitle = "Suspendre le compte ?";
        swalText = "Êtes-vous sûr de vouloir suspendre le compte ?";
        swalIcon = "warning";
        swalConfirmColor = "#ff9f43";
      }

      const result = await Swal.fire({
        title: swalTitle,
        text: swalText,
        icon: swalIcon,
        showCancelButton: true,
        confirmButtonColor: swalConfirmColor,
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, confirmer",
        cancelButtonText: "Annuler",
      });

      if (!result.isConfirmed) return;

      try {
        const payload = {
          ...entity,
          status: nextStatus,
          birthday: formatBirthday(entity.birthday),
        };

        const response = await fetchWithAuth(
          `${apiBase}/${idField}/${entity.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) throw new Error("Erreur lors de la mise à jour");

        Swal.fire({
          icon: "success",
          title: "Succès !",
          text: `Le compte est maintenant ${nextStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
        onActionComplete?.();
        onClose?.();
      } catch (error) {
        console.error("Erreur toggle :", error);
        Swal.fire("Erreur", "Une erreur est survenue", "error");
      }
    },
    [apiBase, idField, onActionComplete, onClose, fetchWithAuth],
  );
  const deleteUser = useCallback(
    async (entity: T) => {
      const result = await Swal.fire({
        title: "Supprimer définitivement ?",
        text: "Cette action est irréversible et supprimera toutes les données liées.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
      });

      if (!result.isConfirmed) return;

      try {
        const response = await fetchWithAuth(
          `${apiBase}/api/users/${entity.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) throw new Error("Erreur lors de la suppression");

        Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text: "L'élément a été supprimé avec succès.",
          timer: 2000,
          showConfirmButton: false,
        });

        onActionComplete?.();
        onClose?.();
      } catch (error) {
        console.error("Erreur deleteUser :", error);
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la suppression.",
          "error",
        );
      }
    },
    [apiBase, onActionComplete, onClose, fetchWithAuth],
  );

  return { handleSave, handleToggleSuspend, deleteUser };
}
