import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Supplier } from '@/types';
import { mockGetSuppliers, mockGetSupplierById } from '@/lib/mock-api';

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// --- Fetch all suppliers ---
const fetchSuppliers = async (): Promise<Supplier[]> => {
  if (USE_MOCK_API) {
    return mockGetSuppliers();
  }
  const response = await axiosInstance.get('/suppliers');
  return response.data.data;
};

export const useSuppliers = () => {
  return useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });
};


// --- Fetch a single supplier by ID ---
const fetchSupplierById = async (id: string): Promise<Supplier> => {
    if (USE_MOCK_API) {
        const supplier = await mockGetSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier with id ${id} not found in mock data.`);
        }
        return supplier;
    }
    const response = await axiosInstance.get(`/suppliers/${id}`);
    return response.data.data;
};

export const useSupplierById = (id: string) => {
    return useQuery<Supplier, Error>({
        queryKey: ['supplier', id],
        queryFn: () => fetchSupplierById(id),
        enabled: !!id, // Only run the query if the id is not null/undefined
    });
};
