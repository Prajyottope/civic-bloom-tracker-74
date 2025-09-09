import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return null;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select an image (JPG, PNG, GIF) or PDF file",
          variant: "destructive",
        });
        return null;
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage (for now we'll create a simple base64 data URL as fallback)
      // In a real implementation, you would upload to Supabase Storage
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
          toast({
            title: "File uploaded successfully",
            description: "Your file has been processed",
          });
        };
        reader.readAsDataURL(file);
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const openFileSelector = (accept?: string): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept || 'image/*,application/pdf';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };
      
      input.oncancel = () => resolve(null);
      input.click();
    });
  };

  const openCamera = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };
      
      input.oncancel = () => resolve(null);
      input.click();
    });
  };

  return {
    uploadFile,
    openFileSelector,
    openCamera,
    uploading,
  };
}