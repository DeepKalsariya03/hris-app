import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClockPayload,
  ClockResponse,
  HistoryResponse,
  TodayAttendanceResponse,
} from "../types";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useClock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ClockPayload) => {
      const { data } = await api.post<ClockResponse>(
        "/attendances/clock",
        payload
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
    },

    onError: (error: any) => {
      const responseData = error.response?.data;

      let title = "Clock In/Out Failed";
      let description = responseData?.message || "Failed to submit attendance";

      if (responseData?.error) {
        if (
          responseData.error.errors &&
          Array.isArray(responseData.error.errors)
        ) {
          title = "Validation Failed";
          description = responseData.error.errors
            .map((err: any) => err.message)
            .join(", ");
        }
        else if (responseData.error.message) {
          description = responseData.error.message;
        }
        else if (typeof responseData.error === "string") {
          description = responseData.error;
        }
      }

      toast.error(title, {
        description: description,
      });
    },
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const { data } = await api.get<{ data: TodayAttendanceResponse }>(
        "/attendances/today"
      );
      return data.data;
    },
    retry: false,
  });
};

export const useAttendanceHistory = (
  month: number,
  year: number,
  page: number
) => {
  return useQuery({
    queryKey: ["attendance-history", month, year, page],
    queryFn: async () => {
      const { data } = await api.get<HistoryResponse>(
        `/attendances/history?month=${month}&year=${year}&page=${page}&limit=10`
      );

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
};
