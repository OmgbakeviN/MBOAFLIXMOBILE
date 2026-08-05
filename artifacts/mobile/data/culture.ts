import { CultureItem, FoodItem } from '@/types';

export const CULTURE_ITEMS: CultureItem[] = [
  {
    id: 'c1',
    title: 'Makossa',
    category: 'music',
    description:
      'The iconic Cameroonian music genre born in Douala. Made world-famous by Manu Dibango\'s "Soul Makossa."',
    color: '#D4AF37',
    icon: 'music',
  },
  {
    id: 'c2',
    title: 'Bikutsi',
    category: 'music',
    description:
      'A high-energy rhythm from the Beti people of central Cameroon. Known for its hypnotic beat and vibrant dance.',
    color: '#E65100',
    icon: 'music',
  },
  {
    id: 'c3',
    title: 'Bamileke Dance',
    category: 'dance',
    description:
      'The ceremonial dances of the Bamileke people of the West Region — rich in symbolism, mask culture, and royal tradition.',
    color: '#C62828',
    icon: 'activity',
  },
  {
    id: 'c4',
    title: 'Nguon Festival',
    category: 'tradition',
    description:
      'A sacred Bamoun festival celebrating the renewal of the kingdom. One of the most spectacular cultural events in Cameroon.',
    color: '#6A1B9A',
    icon: 'star',
  },
  {
    id: 'c5',
    title: 'Grassfields Art',
    category: 'art',
    description:
      'The elaborate beaded thrones, carved masks, and bronze sculptures of the Grassfields kingdoms are world-renowned.',
    color: '#1565C0',
    icon: 'image',
  },
  {
    id: 'c6',
    title: 'Mvet Storytelling',
    category: 'tradition',
    description:
      'The ancient oral epic tradition of the Beti and Fang peoples — music, poetry, and mythology performed by a mvet player.',
    color: '#2E7D32',
    icon: 'book',
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Ndolé',
    description:
      'The national dish of Cameroon. A rich stew of bitter leaves, groundnuts, and your choice of meat or fish.',
    region: 'Littoral / National',
    color: '#2E7D32',
  },
  {
    id: 'f2',
    name: 'Eru',
    description:
      'A beloved dish from the South West region made from wild vegetables and waterleaf, typically served with water fufu.',
    region: 'South West',
    color: '#1B5E20',
  },
  {
    id: 'f3',
    name: 'Koki',
    description:
      'Black-eyed pea pudding steamed in banana leaves. A festive staple with a uniquely Cameroonian character.',
    region: 'Nationwide',
    color: '#E65100',
  },
  {
    id: 'f4',
    name: 'Fufu Corn & Njama Njama',
    description:
      'A classic highland dish: corn fufu paired with huckleberry leaves, beloved in the North West and West regions.',
    region: 'North West / West',
    color: '#F57F17',
  },
  {
    id: 'f5',
    name: 'Mbongo Tchobi',
    description:
      'A deeply flavored black stew from the Bassa people, made with a unique spice called mbongo. Earthy and complex.',
    region: 'Littoral',
    color: '#212121',
  },
  {
    id: 'f6',
    name: 'Suya',
    description:
      'Spiced grilled meat skewers from the North — lean cuts marinated in a blend of ground peanuts and spices.',
    region: 'Adamawa / North',
    color: '#BF360C',
  },
  {
    id: 'f7',
    name: 'Bobolo',
    description:
      'Fermented cassava pressed into long cylinders and wrapped in leaves. A signature of the South and East regions.',
    region: 'South / East',
    color: '#827717',
  },
  {
    id: 'f8',
    name: 'Kondré',
    description:
      'A hearty stew made with unripe plantain and goat meat, a specialty of the Bamileke people of the West region.',
    region: 'West',
    color: '#4E342E',
  },
];
