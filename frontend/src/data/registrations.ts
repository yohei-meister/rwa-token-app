export interface UserRegistration {
  id: string;
  fullName: string;
  email: string;
  income: string;
  walletAddress: string;
  registrationDate: string;
  status: "pending" | "rejected" | "high" | "low";
}

// In-memory storage for user registrations (in a real app, this would be a database)
let registrations: UserRegistration[] = [];

export const saveUserRegistration = (
  data: Omit<UserRegistration, "id" | "registrationDate" | "status">,
): UserRegistration => {
  const newRegistration: UserRegistration = {
    id: generateId(),
    ...data,
    registrationDate: new Date().toISOString(),
    status: "pending",
  };

  registrations.push(newRegistration);

  // Save to localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("userRegistrations", JSON.stringify(registrations));
  }

  return newRegistration;
};

export const getUserRegistrations = (): UserRegistration[] => {
  // Load from localStorage if available
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("userRegistrations");
    if (stored) {
      registrations = JSON.parse(stored);
    }
  }
  return registrations;
};

export const getUserRegistrationByWallet = (
  walletAddress: string,
): UserRegistration | undefined => {
  const allRegistrations = getUserRegistrations();
  return allRegistrations.find((reg) => reg.walletAddress === walletAddress);
};

export const updateRegistrationStatus = (
  id: string,
  status: UserRegistration["status"],
): boolean => {
  try {
    // Load current registrations
    const allRegistrations = getUserRegistrations();

    // Find and update the registration
    const registrationIndex = allRegistrations.findIndex(
      (reg) => reg.id === id,
    );
    if (registrationIndex === -1) {
      return false; // Registration not found
    }

    allRegistrations[registrationIndex].status = status;
    registrations = allRegistrations;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userRegistrations", JSON.stringify(registrations));
    }

    return true;
  } catch (error) {
    console.error("Error updating registration status:", error);
    return false;
  }
};

// Simple ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
