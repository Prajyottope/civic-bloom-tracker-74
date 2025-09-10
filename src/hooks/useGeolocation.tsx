import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationState {
  data: GeolocationData | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    data: null,
    loading: false,
    error: null,
  });
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser.';
      setState(prev => ({ ...prev, error }));
      toast({
        title: "Location Not Supported",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        setState({
          data,
          loading: false,
          error: null,
        });

        toast({
          title: "Location Retrieved",
          description: "Your current location has been captured successfully.",
        });
      },
      (error) => {
        let errorMessage = 'An unknown error occurred while retrieving location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      options
    );
  }, [toast]);

  const clearLocation = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearLocation,
  };
};