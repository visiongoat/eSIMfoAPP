import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationBar from "@/components/navigation-bar";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  language?: string;
  currency?: string;
  avatar?: string;
}

export default function PersonalInfo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  // Fetch user profile
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfile>) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setIsEditing(false);
      setEditedProfile({});
      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (Object.keys(editedProfile).length > 0) {
      updateProfileMutation.mutate(editedProfile);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getDisplayValue = (field: keyof UserProfile) => {
    return editedProfile[field] !== undefined ? editedProfile[field] : profile?.[field] || '';
  };

  if (isLoading) {
    return (
      <div className="mobile-screen">
        <NavigationBar 
          title="Personal Information"
          showBackButton={true}
          onBackClick={() => setLocation('/profile')}
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Personal Information"
        showBackButton={true}
        onBackClick={() => setLocation('/profile')}
        rightButton={
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={updateProfileMutation.isPending}
            className="text-blue-500 dark:text-blue-400 font-medium disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? "Saving..." : isEditing ? "Save" : "Edit"}
          </button>
        }
      />

      <div className="px-6 pt-4 pb-28 space-y-6">
        {/* Profile Photo Section */}
        <div className="text-center py-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={getDisplayValue('name')}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.name || 'Not set'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={getDisplayValue('email')}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.email || 'Not set'}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={getDisplayValue('phone')}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.phone || 'Not set'}
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Address Information</h3>
          
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                value={getDisplayValue('country')}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your country"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.country || 'Not set'}
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={getDisplayValue('city')}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.city || 'Not set'}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            {isEditing ? (
              <textarea
                value={getDisplayValue('address')}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your address"
              />
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100 min-h-[80px]">
                {profile?.address || 'Not set'}
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h3>
          
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            {isEditing ? (
              <select
                value={getDisplayValue('language')}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Language</option>
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
              </select>
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.language === 'en' ? 'English' :
                 profile?.language === 'tr' ? 'Türkçe' :
                 profile?.language === 'de' ? 'Deutsch' :
                 profile?.language === 'fr' ? 'Français' :
                 profile?.language === 'es' ? 'Español' :
                 profile?.language === 'it' ? 'Italiano' :
                 'English'}
              </div>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Currency
            </label>
            {isEditing ? (
              <select
                value={getDisplayValue('currency')}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Currency</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="TRY">TRY (₺)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CHF">CHF (Fr)</option>
              </select>
            ) : (
              <div className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {profile?.currency ? `${profile.currency} (${
                  profile.currency === 'EUR' ? '€' :
                  profile.currency === 'USD' ? '$' :
                  profile.currency === 'GBP' ? '£' :
                  profile.currency === 'TRY' ? '₺' :
                  profile.currency === 'JPY' ? '¥' :
                  profile.currency === 'CAD' ? 'C$' :
                  profile.currency === 'AUD' ? 'A$' :
                  profile.currency === 'CHF' ? 'Fr' : '€'
                })` : 'EUR (€)'}
              </div>
            )}
          </div>
        </div>

        {/* Cancel Button (only shown when editing) */}
        {isEditing && (
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}