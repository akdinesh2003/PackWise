export type TripType = 'beach' | 'hiking' | 'business' | 'family' | 'solo' | 'international';
export const tripTypes: { value: TripType; label: string }[] = [
  { value: 'beach', label: '🏖️ Beach Vacation' },
  { value: 'hiking', label: '🏔️ Hiking Trip' },
  { value: 'business', label: '👔 Business Trip' },
  { value: 'family', label: '👨‍👩‍👧‍👦 Family Holiday' },
  { value: 'solo', label: '👤 Solo Adventure' },
  { value: 'international', label: '🌍 International Travel' },
];

export type WeatherCondition = 'hot' | 'cold' | 'rainy' | 'snowy';
export const weatherConditions: { value: WeatherCondition; label: string }[] = [
  { value: 'hot', label: '☀️ Hot' },
  { value: 'cold', label: '❄️ Cold' },
  { value: 'rainy', label: '🌧️ Rainy' },
  { value: 'snowy', label: '🌨️ Snowy' },
];

export type Category = 'Clothing' | 'Tech' | 'Documents' | 'Toiletries' | 'Miscellaneous';
export const categories: Category[] = ['Clothing', 'Tech', 'Documents', 'Toiletries', 'Miscellaneous'];

export interface ChecklistItem {
  id: string;
  name: string;
  packed: boolean;
  category: Category;
}

export interface Checklist {
  items: ChecklistItem[];
  title: string;
}
