import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type {
  Meta,
  Employee,
  AttendanceRecap,
  CreateEmployeePayload,
  DashboardStats,
} from "../types";

export const useAllEmployees = (page: number, search: string) => {
  return useQuery({
    queryKey: ["admin-employees", page, search],
    queryFn: async () => {
      const { data } = await api.get<{ data: Employee[]; meta: Meta }>(
        `/admin/employees`,
        {
          params: {
            page,
            limit: 10,
            search,
          },
        }
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useAttendanceRecap = (
  page: number,
  startDate: string,
  endDate: string,
  search: string
) => {
  return useQuery({
    queryKey: ["admin-recap", page, startDate, endDate, search],
    queryFn: async () => {
      const { data } = await api.get<{ data: AttendanceRecap[]; meta: Meta }>(
        "/admin/attendances/recap",
        {
          params: {
            page,
            limit: 10,
            start_date: startDate,
            end_date: endDate,
            search: search,
          },
        }
      );

      return data;
    },
    placeholderData: (prev) => prev,
  });
};

export const exportAttendanceExcel = async (
  startDate: string,
  endDate: string,
  search: string
) => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await api.get("/admin/attendances/export", {
      params: { start_date: startDate, end_date: endDate, search, timezone },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", `Recap_${startDate}_to_${endDate}.xlsx`);
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    toast.success("Download started!");
  } catch (error) {
    toast.error("Failed to export excel");
    console.error(error);
  }
};

export const useEmployeeMutations = () => {
  const queryClient = useQueryClient();

  const invalidateEmployees = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-employees"],
      type: "active",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: CreateEmployeePayload) => {
      return await api.post("/admin/employees", data);
    },
    onSuccess: async () => {
      toast.success("Employee created successfully");
      await invalidateEmployees();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create employee");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateEmployeePayload>;
    }) => {
      return await api.put(`/admin/employees/${id}`, data);
    },
    onSuccess: async () => {
      toast.success("Employee updated successfully");
      await invalidateEmployees();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update employee");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/admin/employees/${id}`);
    },
    onSuccess: async () => {
      toast.success("Employee deleted");
      await invalidateEmployees();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete employee");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardStats }>(
        "/admin/dashboard/stats"
      );
      return data.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};
