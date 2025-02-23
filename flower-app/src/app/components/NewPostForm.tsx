import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface NewPostFormProps {
  communityId: string;
  onPostCreated: () => void; // Callback function to refresh posts
}

const NewPostForm: React.FC<NewPostFormProps> = ({ communityId, onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [varietyName, setVarietyName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const csrfToken = useCsrfToken();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('caption', caption);
    if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        formData.append('image_url', blob, 'image.jpg');
    }
    formData.append('variety_name', varietyName);
    formData.append('location', location);
    formData.append('community', communityId);


    try {
      const response = await fetch('https://127.0.0.1:8000/api/posts/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': csrfToken, // Include CSRF token in headers
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || 'Failed to create post';
        throw new Error(errorMessage);
      }

      // Reset form and trigger post refresh
      setCaption('');
      setImageUrl(null);
      setVarietyName('');
      setLocation('');
      onPostCreated(); // Call the callback function
    } catch (error:any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
  <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
   <div className="mb-4">
    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
     Caption
    </label>
    <Textarea
     id="caption"
     value={caption}
     onChange={(e) => setCaption(e.target.value)}
     required
    />
   </div>
   <div className="mb-4">
    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
     Image
    </label>
    <Input
     type="file"
     id="image"
     onChange={handleImageChange}
     accept="image/*"
    />
    {imageUrl && (
     <img
      src={imageUrl}
      alt="Preview"
      className="mt-2 h-24 w-24 object-cover rounded"
     />
    )}
   </div>
   <div className="mb-4">
    <label
     htmlFor="varietyName"
     className="block text-sm font-medium text-gray-700"
    >
     Variety Name
    </label>
    <Input
     type="text"
     id="varietyName"
     value={varietyName}
     onChange={(e) => setVarietyName(e.target.value)}
    />
   </div>
   <div className="mb-4">
    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
     Location
    </label>
    <Input
     type="text"
     id="location"
     value={location}
     onChange={(e) => setLocation(e.target.value)}
    />
   </div>
   <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Posting..." : "Create Post"}
   </Button>
   {error && <p className="text-red-500 mt-2">{error}</p>}
  </form>
 );
};

export default NewPostForm;
