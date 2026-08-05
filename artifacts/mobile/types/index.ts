export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  duration: string;
  description: string;
  posterColor: string;
  accentColor: string;
  tags: string[];
  featured?: boolean;
  director?: string;
  cast?: string[];
}

export interface CultureItem {
  id: string;
  title: string;
  category: 'food' | 'music' | 'dance' | 'tradition' | 'art';
  description: string;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  region: string;
  color: string;
}
