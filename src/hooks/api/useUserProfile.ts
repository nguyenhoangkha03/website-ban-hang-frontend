import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile, UpdateUserRequest } from '@/types';

// API Functions

const fetchUserProfile = async (): Promise<UserProfile> => {
    // Return mock data that conforms to the new UserProfile interface
    return Promise.resolve({
      id: 1,
      employeeCode: 'NV-001',
      fullName: 'Demo User',
      email: 'demo@example.com',
      phone: '0123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      roleId: 2, // Assuming 2 is a customer role
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
};

const updateUserProfile = async (profileData: Partial<UpdateUserRequest>): Promise<UserProfile> => {
    // Return mock data
    console.log('Updating user profile with:', profileData);
    // This should ideally fetch the current profile and merge, but for mock this is fine
    return Promise.resolve({
      id: 1,
      employeeCode: 'NV-001',
      fullName: profileData.fullName || 'Demo User',
      email: 'demo@example.com',
      phone: profileData.phone,
      dateOfBirth: profileData.birthDate,
      gender: profileData.gender,
      avatarUrl: profileData.avatar,
      roleId: 2,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
};

// React Query Hooks

export const useUserProfile = () => {
    return useQuery<UserProfile, Error>({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<UserProfile, Error, Partial<UpdateUserRequest>>({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(['userProfile'], data);
        },
    });
};
