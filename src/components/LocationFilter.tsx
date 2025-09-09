import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocations } from '@/hooks/useLocations';

interface LocationFilterProps {
  onLocationChange: (state?: string, city?: string) => void;
  selectedState?: string;
  selectedCity?: string;
}

export const LocationFilter = ({ onLocationChange, selectedState, selectedCity }: LocationFilterProps) => {
  const { states, getCitiesForState, loading } = useLocations();

  const handleStateSelect = (state: string) => {
    onLocationChange(state, undefined);
  };

  const handleCitySelect = (state: string, city: string) => {
    onLocationChange(state, city);
  };

  const handleClearFilter = () => {
    onLocationChange(undefined, undefined);
  };

  const getDisplayText = () => {
    if (selectedCity && selectedState) {
      return `${selectedCity}, ${selectedState}`;
    }
    if (selectedState) {
      return selectedState;
    }
    return 'All Locations';
  };

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <MapPin className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit">
          <MapPin className="h-4 w-4 mr-2" />
          {getDisplayText()}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background border border-border">
        <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleClearFilter}>
          All Locations
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {states.map((state) => {
          const cities = getCitiesForState(state);
          
          return (
            <DropdownMenuSub key={state}>
              <DropdownMenuSubTrigger className="flex items-center justify-between">
                <span>{state}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border border-border">
                <DropdownMenuItem onClick={() => handleStateSelect(state)}>
                  All cities in {state}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={`${state}-${city}`}
                    onClick={() => handleCitySelect(state, city)}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};