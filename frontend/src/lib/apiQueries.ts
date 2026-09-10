import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendeesApi, type CreateAttendeeInput, type ListAttendeesParams } from "./attendeesApi";
import { eventsApi } from "./eventsApi";
import { hallsApi } from "./hallsApi";

/** Central query keys keep cache invalidation predictable as the backend grows. */
export const queryKeys = {
  events: ["events"] as const,
  event: (id: string) => ["events", id] as const,
  attendees: (eventId: string, params?: ListAttendeesParams) => ["events", eventId, "attendees", params] as const,
  halls: ["halls"] as const,
};

/** Replace or extend these hooks when new backend endpoints are added. */
export function useEventsQuery() {
  return useQuery({ queryKey: queryKeys.events, queryFn: eventsApi.list });
}
export function useEventQuery(id: string) {
  return useQuery({ queryKey: queryKeys.event(id), queryFn: () => eventsApi.get(id), enabled: Boolean(id) });
}
export function useAttendeesQuery(eventId: string, params?: ListAttendeesParams) {
  return useQuery({ queryKey: queryKeys.attendees(eventId, params), queryFn: () => attendeesApi.list(eventId, params), enabled: Boolean(eventId) });
}
export function useHallsQuery() {
  return useQuery({ queryKey: queryKeys.halls, queryFn: hallsApi.list });
}
export function useCreateHallMutation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: hallsApi.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.halls }) });
}
export function useCreateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: eventsApi.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.events }) });
}
export function useDeleteEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: eventsApi.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.events }) });
}
export function useCreateAttendeeMutation(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: CreateAttendeeInput) => attendeesApi.create(eventId, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", eventId, "attendees"] }) });
}
export function useImportAttendeesMutation(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (file: File) => attendeesApi.importCsv(eventId, file), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", eventId, "attendees"] }) });
}
