import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useCreateHallMutation } from "../../lib/apiQueries";
import { RouteModal } from "../../components/RouteModal";

interface AddRoomModalProps {
  onClose: () => void;
}

/** Popup form for the /app/rooms/new URL-backed action route. */
export function AddRoomModal({ onClose }: AddRoomModalProps) {
  const mutation = useCreateHallMutation();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({ name, address, capacity: Number(capacity) });
    onClose();
  };

  return (
    <RouteModal label="Add room" onClose={onClose}>
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-emerald-500" />
          <div><h2 className="text-xl font-bold text-[var(--text-heading)]">Add room</h2><p className="text-sm text-[var(--text-secondary)]">Add a venue for your events.</p></div>
        </div>
        <form onSubmit={(event) => void submit(event)} className="space-y-4">
          <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Room name" className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-sm" />
          <input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address" className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-sm" />
          <input required min="1" type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="Capacity" className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-sm" />
          {mutation.isError && <p className="text-sm text-red-500">Could not create this room. Please try again.</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Add room
            </button>
          </div>
        </form>
      </div>
    </RouteModal>
  );
}
