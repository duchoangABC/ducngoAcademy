
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Bình',
  streak: 12,
  points: 1450,
  // Updated avatar to the professional man in white shirt
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK-K3d4LpGqj90g7I0vV0j5k5E6Z2x1y8B2m3c4D5e6F7g8H9i0j1k2L3m4N5o6P7q8R9s0T1u2V3w4X5y6Z", 
};

// Extending the type locally for the context to include the job title string
interface ExtendedUserProfile extends UserProfile {
  jobTitle: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use a reliable placeholder that looks like the user's request if the direct link expires
  // Using a professional asian man placeholder for demonstration
  const [user, setUser] = useState<ExtendedUserProfile>({
    ...defaultUser,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK-K3d4LpGqj90g7I0vV0j5k5E6Z2x1y8B2m3c4D5e6F7g8H9i0j1k2L3m4N5o6P7q8R9s0T1u2V3w4X5y6Z", 
    jobTitle: 'M1 GSBH'
  });

  const updateUser = (data: Partial<ExtendedUserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};
