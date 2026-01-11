import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Employee, CreateEmployeePayload } from "@/features/admin/types";
import {
  useDepartments,
  useShifts,
} from "@/features/admin/hooks/useMasterData";

const formSchema = z.object({
  username: z.string().min(3, "Min 3 characters"),
  full_name: z.string().min(1, "Name is required"),
  nik: z.string().min(1, "NIK is required"),
  department_id: z.string().min(1, "Select department"),
  shift_id: z.string().min(1, "Select shift"),
});

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeToEdit?: Employee | null;
  onSubmit: (values: CreateEmployeePayload) => void;
  isLoading: boolean;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employeeToEdit,
  onSubmit,
  isLoading,
}: EmployeeFormDialogProps) {
  const isEdit = !!employeeToEdit;

  const { data: departments, isLoading: deptLoading } = useDepartments();
  const { data: shifts, isLoading: shiftLoading } = useShifts();

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      full_name: "",
      nik: "",
      department_id: "",
      shift_id: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (employeeToEdit) {
        form.reset({
          username: employeeToEdit.username,
          full_name: employeeToEdit.full_name,
          nik: employeeToEdit.nik,
          department_id: employeeToEdit.department_name === "Umum" ? "1" : "2",
          shift_id: "1",
        });
      } else {
        form.reset({
          username: "",
          full_name: "",
          nik: "",
          department_id: "",
          shift_id: "",
        });
      }
    }
  }, [open, employeeToEdit, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const payload: CreateEmployeePayload = {
                username: values.username,
                full_name: values.full_name,
                nik: values.nik,
                department_id: Number(values.department_id),
                shift_id: Number(values.shift_id),
              };
              onSubmit(payload);
            })}
            className="space-y-4"
          >
            {!isEdit && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              deptLoading ? "Loading..." : "Select Dept"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments?.map((dept) => (
                          <SelectItem key={dept.id} value={String(dept.id)}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shift_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              shiftLoading ? "Loading..." : "Select Shift"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts?.map((shift) => (
                          <SelectItem key={shift.id} value={String(shift.id)}>
                            {shift.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
