import {
  cancelAppointment,
  createAppointment,
  fetchAppointmentById,
  fetchAppointments,
  fetchDoctorAppointments,
  fetchAvailableSlots,
} from "@/lib/api";
import type { Appointment, BookingData, TimeSlot } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAppointments(patientId?: string) {
  return useQuery<Appointment[]>({
    queryKey: ["appointments", patientId],
    queryFn: () => fetchAppointments(patientId ? { patientId } : undefined),
  });
}

export function useDoctorAppointments(doctorId?: string) {
  return useQuery<Appointment[]>({
    queryKey: ["doctor-appointments", doctorId],
    queryFn: () => fetchDoctorAppointments(doctorId ?? ""),
    enabled: !!doctorId,
  });
}

export function useAppointmentById(id: string) {
  return useQuery<Appointment | null>({
    queryKey: ["appointment", id],
    queryFn: async () => (id ? fetchAppointmentById(id) : null),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, Omit<Appointment, "id" | "createdAt">>(
    {
      mutationFn: createAppointment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      },
    },
  );
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, string>({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });
}

export function useAvailableSlots(doctorId: string, date: string) {
  return useQuery<TimeSlot[]>({
    queryKey: ["slots", doctorId, date],
    queryFn: () => fetchAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
}

export function useBookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);
  const reset = () => {
    setCurrentStep(1);
    setBookingData({});
  };

  const steps = [
    { step: 1, label: "Select Location", completed: !!bookingData.locationId },
    { step: 2, label: "Choose Hospital", completed: !!bookingData.hospitalId },
    {
      step: 3,
      label: "Select Department",
      completed: !!bookingData.department,
    },
    { step: 4, label: "Choose Doctor", completed: !!bookingData.doctorId },
    {
      step: 5,
      label: "Pick Time Slot",
      completed: !!bookingData.date && !!bookingData.timeSlot,
    },
    { step: 6, label: "Confirm Booking", completed: false },
  ];

  return {
    currentStep,
    bookingData,
    steps,
    updateBooking,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}
