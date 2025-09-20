export interface UserRegistration {
  id: string;
  fullName: string;
  email: string;
  income: string;
  walletAddress: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// In-memory storage for user registrations (in a real app, this would be a database)
let registrations: UserRegistration[] = [];

export const saveUserRegistration = (data: Omit<UserRegistration, 'id' | 'registrationDate' | 'status'>): UserRegistration => {
  const newRegistration: UserRegistration = {
    id: generateId(),
    ...data,
    registrationDate: new Date().toISOString(),
    status: 'pending'
  };

  registrations.push(newRegistration);
  
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRegistrations', JSON.stringify(registrations));
  }

  return newRegistration;
};

export const getUserRegistrations = (): UserRegistration[] => {
  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('userRegistrations');
    if (stored) {
      registrations = JSON.parse(stored);
    }
  }
  return registrations;
};

export const getUserRegistrationByWallet = (walletAddress: string): UserRegistration | undefined => {
  const allRegistrations = getUserRegistrations();
  return allRegistrations.find(reg => reg.walletAddress === walletAddress);
};

// Simple ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
