import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useIssues, Issue } from '@/hooks/useIssues';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle, MapPin } from 'lucide-react';

export const MapView = () => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const { issues, loading } = useIssues();

  // Filter issues that have valid coordinates
  const issuesWithCoords = issues.filter(
    issue => issue.latitude && issue.longitude && 
    !isNaN(Number(issue.latitude)) && !isNaN(Number(issue.longitude))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ef4444'; // red
      case 'in_progress': return '#f59e0b'; // amber
      case 'resolved': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const createMarkerElement = (issue: Issue) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.cssText = `
      background-color: ${getStatusColor(issue.status)};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const icon = document.createElement('div');
    icon.innerHTML = '!';
    icon.style.cssText = `
      color: white;
      font-weight: bold;
      font-size: 12px;
    `;
    el.appendChild(icon);
    
    return el;
  };

  const addMarkersToMap = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    issuesWithCoords.forEach((issue) => {
      const lat = Number(issue.latitude);
      const lng = Number(issue.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const markerElement = createMarkerElement(issue);
      
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[250px]">
          <h3 class="font-semibold text-sm mb-2">${issue.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${issue.description?.substring(0, 100)}${issue.description?.length > 100 ? '...' : ''}</p>
          <div class="flex flex-wrap gap-1 mb-2">
            <span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-${getStatusColor(issue.status)}/10 text-${getStatusColor(issue.status)}">
              ${t(`issues.${issue.status}`)}
            </span>
          </div>
          <div class="text-xs text-gray-500">
            <p><strong>${t('map.location')}:</strong> ${issue.city}, ${issue.state}</p>
            <p><strong>${t('map.reportedOn')}:</strong> ${new Date(issue.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    try {
      mapboxgl.accessToken = mapboxToken.trim();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Center of India
        zoom: 5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        addMarkersToMap();
        
        // Fit map to show all markers if there are any
        if (issuesWithCoords.length > 0) {
          const coordinates = issuesWithCoords.map(issue => [
            Number(issue.longitude), 
            Number(issue.latitude)
          ] as [number, number]);
          
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          
          map.current?.fitBounds(bounds, { padding: 50 });
        }
      });

      setTokenError(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setTokenError(true);
    }
  };

  useEffect(() => {
    if (mapboxToken.trim()) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current && issuesWithCoords.length > 0) {
      addMarkersToMap();
    }
  }, [issues]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('map.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('map.viewAllIssues')}</p>
      </div>

      {!mapboxToken.trim() && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              Mapbox Token Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              To display the map, please enter your Mapbox public token. You can get one free at{' '}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">
                mapbox.com
              </a>
            </p>
            <Input
              type="text"
              placeholder="Enter your Mapbox public token (pk.xxx...)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="max-w-md"
            />
            {tokenError && (
              <p className="text-red-600 text-sm mt-2">
                Invalid token or error initializing map. Please check your token.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={mapContainer} 
                className="w-full h-[600px] rounded-lg"
                style={{ display: mapboxToken.trim() ? 'block' : 'none' }}
              />
              {!mapboxToken.trim() && (
                <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter Mapbox token to display map</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Issues:</span>
                <span className="font-semibold">{issues.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">With Location:</span>
                <span className="font-semibold">{issuesWithCoords.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending:</span>
                <Badge variant="destructive" className="ml-2">
                  {issues.filter(i => i.status === 'pending').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Progress:</span>
                <Badge variant="secondary" className="ml-2">
                  {issues.filter(i => i.status === 'in_progress').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolved:</span>
                <Badge variant="default" className="ml-2">
                  {issues.filter(i => i.status === 'resolved').length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-sm">{t('issues.pending')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-sm">{t('issues.inProgress')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-sm">{t('issues.resolved')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};