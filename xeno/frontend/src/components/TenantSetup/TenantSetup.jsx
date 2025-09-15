import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Store, Key, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useApi, useApiMutation } from '../../hookes/useApi';
import { useAuth } from '../../hookes/useAuth';
import toast from 'react-hot-toast';

const TenantSetup = () => {
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { data: connectionStatus, loading: statusLoading, refetch: refetchStatus } = useApi('/shopify/status');
  
  const { execute: connectStore, loading: connecting } = useApiMutation('/shopify/connect', {
    onSuccess: () => {
      toast.success('Shopify store connected successfully!');
      setCurrentStep(3);
      refetchStatus();
      refreshProfile();
    }
  });

  const { execute: syncData, loading: syncing } = useApiMutation('/shopify/sync', {
    method: 'POST',
    onSuccess: () => {
      toast.success('Data synchronization completed!');
      refetchStatus();
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (connectionStatus?.isConnected) {
      setCurrentStep(3);
    }
  }, [connectionStatus]);

  const onSubmit = async (data) => {
    await connectStore(data);
  };

  const handleSync = async () => {
    await syncData();
  };

  const steps = [
    { number: 1, title: 'Store Information', description: 'Enter your Shopify store details' },
    { number: 2, title: 'Connect Store', description: 'Establish connection with Shopify' },
    { number: 3, title: 'Sync Data', description: 'Import your store data' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopify Setup</h1>
        <p className="mt-2 text-gray-600">
          Connect your Shopify store to start analyzing your data
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.number} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`
                    flex h-10 w-10 items-center justify-center rounded-full border-2 
                    ${currentStep > step.number 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : currentStep === step.number
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-medium">{step.number}</span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {stepIdx < steps.length - 1 && (
                  <div className="hidden sm:block ml-8 w-20 h-0.5 bg-gray-200" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-3">
                  <Store className="h-6 w-6 text-primary-600" />
                  <h2 className="card-title">Store Information</h2>
                </div>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Shopify Store Name
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('shopifyStoreName', {
                          required: 'Store name is required',
                          pattern: {
                            value: /^[a-zA-Z0-9-]+$/,
                            message: 'Only letters, numbers, and hyphens allowed'
                          }
                        })}
                        type="text"
                        className="input pr-32"
                        placeholder="your-store-name"
                        defaultValue={user?.tenant?.shopifyStoreName}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">.myshopify.com</span>
                      </div>
                    </div>
                    {errors.shopifyStoreName && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopifyStoreName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Access Token
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('accessToken', {
                          required: 'Access token is required'
                        })}
                        type="password"
                        className="input pl-10"
                        placeholder="Enter your private app access token"
                      />
                    </div>
                    {errors.accessToken && (
                      <p className="mt-1 text-sm text-red-600">{errors.accessToken.message}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      You can generate this token from your Shopify admin panel under Apps → Private Apps
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={connecting}
                      className="btn-primary"
                    >
                      {connecting && <div className="spinner mr-2" />}
                      Connect Store
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Connection Status</h2>
                </div>
                <div className="card-content">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Successfully connected to {connectionStatus?.storeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last sync: {connectionStatus?.lastSyncAt 
                          ? new Date(connectionStatus.lastSyncAt).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sync Data */}
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="h-6 w-6 text-primary-600" />
                    <h2 className="card-title">Data Synchronization</h2>
                  </div>
                </div>
                <div className="card-content">
                  <p className="text-gray-600 mb-4">
                    Sync your Shopify data including customers, orders, and products.
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn-primary"
                  >
                    {syncing && <div className="spinner mr-2" />}
                    {syncing ? 'Syncing Data...' : 'Start Sync'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Setup Guide</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">1. Create Private App</h4>
                  <p className="text-gray-600">Go to your Shopify admin → Apps → App and sales channel settings → Develop apps</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">2. Configure Permissions</h4>
                  <p className="text-gray-600">Grant read access to customers, orders, and products</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">3. Get Access Token</h4>
                  <p className="text-gray-600">Copy the Admin API access token from your private app</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <a
                  href="https://help.shopify.com/en/manual/apps/private-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                >
                  View detailed guide
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {connectionStatus?.isConnected && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-content space-y-3">
                <button 
                  onClick={handleSync}
                  className="btn-outline w-full"
                  disabled={syncing}
                >
                  Sync Data Now
                </button>
                <button className="btn-outline w-full">
                  View Dashboard
                </button>
                <button className="btn-outline w-full">
                  Test Connection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantSetup;