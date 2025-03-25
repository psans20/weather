const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
  urls: {
    regular: string;
  };
  description: string | null;
  alt_description: string | null;
}

export async function getCityImage(city: string, weather: string): Promise<string> {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash API key not found');
      return 'https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=2670&auto=format&fit=crop';
    }

    // Try to get a location-specific image first
    const locationQuery = `${city} ${getCityKeywords(city)}`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(locationQuery)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=5&content_filter=high`
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();

    // If we find location images, use the most relevant one
    if (data.results?.length > 0) {
      // Try to find an image that matches the current weather
      const weatherMatchingImage = data.results.find((img: UnsplashImage) => 
        img.description?.toLowerCase().includes(weather.toLowerCase()) ||
        img.alt_description?.toLowerCase().includes(weather.toLowerCase())
      );

      const imageToUse = weatherMatchingImage || data.results[0];
      const imageUrl = new URL(imageToUse.urls.regular);
      imageUrl.searchParams.set('q', '85');
      imageUrl.searchParams.set('w', '1920');
      imageUrl.searchParams.set('fit', 'crop');
      return imageUrl.toString();
    }

    // Fallback to a more generic city search if no specific location images found
    const fallbackResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)} city landmark&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1&content_filter=high`
    );
    
    if (!fallbackResponse.ok) {
      throw new Error(`Unsplash API error: ${fallbackResponse.status}`);
    }
    
    const fallbackData = await fallbackResponse.json();
    
    if (!fallbackData.results?.[0]) {
      return 'https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=2670&auto=format&fit=crop';
    }
    
    const fallbackImageUrl = new URL(fallbackData.results[0].urls.regular);
    fallbackImageUrl.searchParams.set('q', '85');
    fallbackImageUrl.searchParams.set('w', '1920');
    fallbackImageUrl.searchParams.set('fit', 'crop');
    return fallbackImageUrl.toString();

  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=2670&auto=format&fit=crop';
  }
}

// Helper function to get relevant keywords for specific cities
function getCityKeywords(city: string): string {
  const cityKeywords: { [key: string]: string } = {
    'London': 'landmarks Big Ben Tower Bridge',
    'Paris': 'Eiffel Tower landmarks',
    'New York': 'Manhattan skyline Times Square',
    'Tokyo': 'skyline Shibuya',
    'Dubai': 'skyline Burj Khalifa',
    'Sydney': 'Opera House Harbour Bridge',
    'Rome': 'Colosseum landmarks',
    'Venice': 'canals San Marco',
    'Amsterdam': 'canals architecture',
    'Hong Kong': 'Victoria Harbour skyline',
    'Singapore': 'Marina Bay Sands skyline',
    'Barcelona': 'Sagrada Familia architecture',
    'San Francisco': 'Golden Gate Bridge skyline',
    'Rio de Janeiro': 'Christ the Redeemer Copacabana',
    'Las Vegas': 'Strip night lights',
    'Chicago': 'skyline architecture',
    'Toronto': 'CN Tower skyline',
    'Seattle': 'Space Needle skyline',
    'Bangkok': 'temples skyline',
    'Istanbul': 'Blue Mosque Hagia Sophia'
  };

  // If we have specific keywords for this city, use them
  if (cityKeywords[city]) {
    return cityKeywords[city];
  }

  // Default keywords for any other city
  return 'skyline landmarks cityscape downtown';
} 