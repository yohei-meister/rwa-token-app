"use client";

// @ts-nocheck
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserRegistrations, updateRegistrationStatus, type UserRegistration } from "@/data/registrations";
import { useCredentialCreate } from "@/hooks/useCredentialCreate";
import { useWalletStore } from "@/stores/walletStore";
import { kyc } from "@/data/kyc";

export default function DashboardContainer() {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingCredentials, setProcessingCredentials] = useState<Set<string>>(new Set());
  
  const { selectedUser, isConnected } = useWalletStore();
  const credentialCreateMutation = useCredentialCreate();

  useEffect(() => {
    // Load registrations from localStorage
    const loadRegistrations = () => {
      try {
        const data = getUserRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load registrations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();

    // Refresh data every 5 seconds to catch any updates
    const interval = setInterval(loadRegistrations, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: UserRegistration['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">High</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStatusUpdate = async (id: string, status: UserRegistration['status']) => {
    try {
      const success = updateRegistrationStatus(id, status);
      if (success) {
        // Refresh the data
        const updatedData = getUserRegistrations();
        setRegistrations(updatedData);
      } else {
        alert('Failed to update status. Registration not found.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleRejectRegistration = async (registration: UserRegistration) => {
    try {
      // Confirm rejection
      const confirmReject = confirm(
        `Are you sure you want to reject the registration for ${registration.fullName}?\n\nThis action cannot be undone.`
      );
      
      if (!confirmReject) {
        return;
      }

      // Update status to rejected
      const success = updateRegistrationStatus(registration.id, 'rejected');
      if (success) {
        // Refresh the data
        const updatedData = getUserRegistrations();
        setRegistrations(updatedData);
        alert(`Registration for ${registration.fullName} has been rejected.`);
      } else {
        throw new Error("Failed to update registration status");
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert(`Failed to reject registration: ${error.message || 'Unknown error'}`);
    }
  };

  const handleHighStatusWithCredential = async (registration: UserRegistration) => {
    try {
      // Check if wallet is connected
      if (!isConnected || !selectedUser) {
        alert("Please connect a wallet first");
        return;
      }

      // Add to processing set
      setProcessingCredentials(prev => new Set(prev).add(registration.id));

      // Find High Status from kyc data
      const highStatusKyc = kyc.find(k => k.name === "High Status");
      if (!highStatusKyc) {
        throw new Error("High Status KYC not found");
      }

      // Create credential with High Status (following create-container.tsx pattern)
      const now = Math.floor(Date.now() / 1000);
      const credentialInput = {
        TransactionType: "CredentialCreate" as const,
        Account: selectedUser.address,        // Required: Account field from wallet
        Subject: registration.walletAddress,  // Target user's wallet address
        CredentialType: highStatusKyc.name,   // "High Status"
        Expiration: now + 3600 * 24 * 365,   // 1 year expiration
      };

      await credentialCreateMutation.mutateAsync({ input: credentialInput });

      // Update status to high after successful credential creation
      const success = updateRegistrationStatus(registration.id, 'high');
      if (success) {
        // Refresh the data
        const updatedData = getUserRegistrations();
        setRegistrations(updatedData);
        alert(`High status credential created successfully for ${registration.fullName}`);
      } else {
        throw new Error("Failed to update registration status");
      }
    } catch (error) {
      console.error('Error creating high credential:', error);
      alert(`Failed to create high status credential: ${error.message || 'Unknown error'}`);
    } finally {
      // Remove from processing set
      setProcessingCredentials(prev => {
        const newSet = new Set(prev);
        newSet.delete(registration.id);
        return newSet;
      });
    }
  };

  const handleLowStatusWithCredential = async (registration: UserRegistration) => {
    try {
      // Check if wallet is connected
      if (!isConnected || !selectedUser) {
        alert("Please connect a wallet first");
        return;
      }

      // Add to processing set
      setProcessingCredentials(prev => new Set(prev).add(registration.id));

      // Find Low Status from kyc data
      const lowStatusKyc = kyc.find(k => k.name === "Low Status");
      if (!lowStatusKyc) {
        throw new Error("Low Status KYC not found");
      }

      // Create credential with Low Status (following create-container.tsx pattern)
      const now = Math.floor(Date.now() / 1000);
      const credentialInput = {
        TransactionType: "CredentialCreate" as const,
        Account: selectedUser.address,        // Required: Account field from wallet
        Subject: registration.walletAddress,  // Target user's wallet address
        CredentialType: lowStatusKyc.name,    // "Low Status"
        Expiration: now + 3600 * 24 * 365,   // 1 year expiration
      };

      await credentialCreateMutation.mutateAsync({ input: credentialInput });

      // Update status to low after successful credential creation
      const success = updateRegistrationStatus(registration.id, 'low');
      if (success) {
        // Refresh the data
        const updatedData = getUserRegistrations();
        setRegistrations(updatedData);
        alert(`Low status credential created successfully for ${registration.fullName}`);
      } else {
        throw new Error("Failed to update registration status");
      }
    } catch (error) {
      console.error('Error creating low credential:', error);
      alert(`Failed to create low status credential: ${error.message || 'Unknown error'}`);
    } finally {
      // Remove from processing set
      setProcessingCredentials(prev => {
        const newSet = new Set(prev);
        newSet.delete(registration.id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading registrations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Dashboard
        </h1>
        <p className="text-gray-600">
          View and manage all user registration requests
        </p>
        
        {/* Wallet Status */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Wallet Status</p>
              <p className="text-sm text-gray-600">
                {isConnected && selectedUser ? (
                  <>
                    Connected as{" "}
                    <Badge variant="secondary">{selectedUser.userType}</Badge>
                    <br />
                    <span className="font-mono text-xs">
                      {selectedUser.address}
                    </span>
                  </>
                ) : (
                  "Not connected - Please connect wallet to create credentials"
                )}
              </p>
            </div>
            <div className="flex items-center">
              {isConnected ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              User Registrations
            </h2>
            <Badge variant="outline" className="text-sm">
              Total: {registrations.length}
            </Badge>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">No registrations found</div>
            <p className="text-gray-400 text-sm">
              Registration requests will appear here once users submit their information.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Income</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-mono text-xs">
                      {registration.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {registration.fullName}
                    </TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.income}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(registration.walletAddress)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(registration.status)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(registration.registrationDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRegistration(registration)}
                          disabled={registration.status !== 'pending'}
                          className="text-xs px-2 py-1"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleHighStatusWithCredential(registration)}
                          disabled={
                            registration.status !== 'pending' || 
                            processingCredentials.has(registration.id) ||
                            !isConnected ||
                            !selectedUser
                          }
                          className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {processingCredentials.has(registration.id) ? 'Creating...' : 'High'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleLowStatusWithCredential(registration)}
                          disabled={
                            registration.status !== 'pending' || 
                            processingCredentials.has(registration.id) ||
                            !isConnected ||
                            !selectedUser
                          }
                          className="text-xs px-2 py-1"
                        >
                          {processingCredentials.has(registration.id) ? 'Creating...' : 'Low'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {registrations.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {registrations.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-600">High</div>
            <div className="text-2xl font-bold text-blue-600">
              {registrations.filter(r => r.status === 'high').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-600">Low</div>
            <div className="text-2xl font-bold text-gray-600">
              {registrations.filter(r => r.status === 'low').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-600">Rejected</div>
            <div className="text-2xl font-bold text-red-600">
              {registrations.filter(r => r.status === 'rejected').length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
