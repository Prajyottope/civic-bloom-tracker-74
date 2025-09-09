import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Location {
  id: string;
  state_name: string;
  city_name: string;
  latitude: number;
  longitude: number;
  is_tier1: boolean;
  created_at: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('state_name', { ascending: true });

      if (error) throw error;
      
      const locationData = data as Location[] || [];
      setLocations(locationData);
      
      // Extract unique states
      const uniqueStates = Array.from(new Set(locationData.map(loc => loc.state_name)));
      setStates(uniqueStates);
    } catch (error: any) {
      toast({
        title: "Error Loading Locations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCitiesForState = (stateName: string) => {
    return locations
      .filter(loc => loc.state_name === stateName)
      .map(loc => loc.city_name);
  };

  const getLocationByCity = (cityName: string) => {
    return locations.find(loc => loc.city_name === cityName);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    states,
    loading,
    getCitiesForState,
    getLocationByCity,
    refetch: fetchLocations,
  };
}