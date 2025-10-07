import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  image: string;
  isFavorite: boolean;
  popularDishes: string[];
}

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Italiano Vero',
    cuisine: 'Итальянская',
    rating: 4.8,
    deliveryTime: '25-35 мин',
    priceRange: '₽₽₽',
    image: '🍕',
    isFavorite: false,
    popularDishes: ['Пицца Маргарита', 'Карбонара', 'Тирамису'],
  },
  {
    id: 2,
    name: 'Суши Мастер',
    cuisine: 'Японская',
    rating: 4.9,
    deliveryTime: '30-40 мин',
    priceRange: '₽₽₽₽',
    image: '🍣',
    isFavorite: false,
    popularDishes: ['Филадельфия', 'Калифорния', 'Сашими сет'],
  },
  {
    id: 3,
    name: 'Пицца Хаус',
    cuisine: 'Итальянская',
    rating: 4.6,
    deliveryTime: '20-30 мин',
    priceRange: '₽₽',
    image: '🍕',
    isFavorite: false,
    popularDishes: ['Пепперони', '4 сыра', 'Дьябола'],
  },
  {
    id: 4,
    name: 'Токио Кухня',
    cuisine: 'Японская',
    rating: 4.7,
    deliveryTime: '35-45 мин',
    priceRange: '₽₽₽',
    image: '🍱',
    isFavorite: false,
    popularDishes: ['Рамен', 'Темпура', 'Унаги маки'],
  },
  {
    id: 5,
    name: 'La Pasta',
    cuisine: 'Итальянская',
    rating: 4.5,
    deliveryTime: '25-35 мин',
    priceRange: '₽₽',
    image: '🍝',
    isFavorite: false,
    popularDishes: ['Болоньезе', 'Аматричана', 'Панна котта'],
  },
  {
    id: 6,
    name: 'Сакура',
    cuisine: 'Японская',
    rating: 4.8,
    deliveryTime: '30-40 мин',
    priceRange: '₽₽₽₽',
    image: '🍣',
    isFavorite: false,
    popularDishes: ['Нигири сет', 'Гункан маки', 'Соба'],
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [activeTab, setActiveTab] = useState('home');

  const toggleFavorite = (id: number) => {
    setRestaurants(
      restaurants.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      )
    );
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.popularDishes.some((dish) =>
        dish.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCuisine =
      selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;

    const matchesPrice =
      selectedPrice === 'all' || restaurant.priceRange === selectedPrice;

    const matchesRating =
      selectedRating === 'all' ||
      (selectedRating === '4.5+' && restaurant.rating >= 4.5) ||
      (selectedRating === '4.0+' && restaurant.rating >= 4.0);

    const matchesTab =
      activeTab === 'home' ||
      (activeTab === 'favorites' && restaurant.isFavorite);

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesPrice &&
      matchesRating &&
      matchesTab
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-2xl">
                🍕
              </div>
              <h1 className="text-2xl font-bold text-foreground">MenuHub</h1>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Icon name="User" size={20} />
            </Button>
          </div>

          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Поиск ресторанов или блюд..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </header>

      <nav className="sticky top-[132px] z-40 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'restaurants', label: 'Рестораны', icon: 'Store' },
              { id: 'menu', label: 'Меню', icon: 'UtensilsCrossed' },
              { id: 'search', label: 'Поиск', icon: 'Search' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'contacts', label: 'Контакты', icon: 'Mail' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Кухня" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все кухни</SelectItem>
              <SelectItem value="Итальянская">Итальянская</SelectItem>
              <SelectItem value="Японская">Японская</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPrice} onValueChange={setSelectedPrice}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Цена" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любая цена</SelectItem>
              <SelectItem value="₽₽">₽₽ - Доступно</SelectItem>
              <SelectItem value="₽₽₽">₽₽₽ - Средне</SelectItem>
              <SelectItem value="₽₽₽₽">₽₽₽₽ - Дорого</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Рейтинг" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой рейтинг</SelectItem>
              <SelectItem value="4.5+">4.5+ звёзд</SelectItem>
              <SelectItem value="4.0+">4.0+ звёзд</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Ничего не найдено
            </h2>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтры или поисковый запрос
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="group hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in border-border"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-48 flex items-center justify-center">
                    <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                      {restaurant.image}
                    </span>
                    <button
                      onClick={() => toggleFavorite(restaurant.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <Icon
                        name="Heart"
                        size={20}
                        className={
                          restaurant.isFavorite
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {restaurant.name}
                      </h3>
                      <Badge variant="secondary" className="rounded-full">
                        {restaurant.priceRange}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="fill-primary text-primary" />
                        <span className="font-medium text-foreground">
                          {restaurant.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="mb-3 rounded-full">
                      {restaurant.cuisine}
                    </Badge>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Популярные блюда:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.popularDishes.slice(0, 2).map((dish) => (
                          <span
                            key={dish}
                            className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground"
                          >
                            {dish}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full rounded-xl" 
                      size="lg"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <Icon name="UtensilsCrossed" size={18} className="mr-2" />
                      Посмотреть меню
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;