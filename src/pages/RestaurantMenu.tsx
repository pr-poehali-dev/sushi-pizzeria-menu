import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isSpicy?: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  image: string;
  description: string;
  address: string;
  phone: string;
  menu: MenuItem[];
}

const mockRestaurantsData: Record<string, Restaurant> = {
  '1': {
    id: 1,
    name: 'Italiano Vero',
    cuisine: 'Итальянская',
    rating: 4.8,
    deliveryTime: '25-35 мин',
    priceRange: '₽₽₽',
    image: '🍕',
    description: 'Аутентичная итальянская кухня с использованием традиционных рецептов',
    address: 'ул. Пушкина, д. 10',
    phone: '+7 (495) 123-45-67',
    menu: [
      {
        id: 1,
        name: 'Пицца Маргарита',
        description: 'Томатный соус, моцарелла, базилик, оливковое масло',
        price: 650,
        category: 'Пиццы',
        image: '🍕',
        isPopular: true,
      },
      {
        id: 2,
        name: 'Пицца Пепперони',
        description: 'Томатный соус, моцарелла, пепперони, орегано',
        price: 750,
        category: 'Пиццы',
        image: '🍕',
        isPopular: true,
        isSpicy: true,
      },
      {
        id: 3,
        name: 'Карбонара',
        description: 'Паста, бекон, яйцо, пармезан, черный перец',
        price: 550,
        category: 'Паста',
        image: '🍝',
        isPopular: true,
      },
      {
        id: 4,
        name: 'Болоньезе',
        description: 'Паста, мясной соус, пармезан, базилик',
        price: 520,
        category: 'Паста',
        image: '🍝',
      },
      {
        id: 5,
        name: 'Тирамису',
        description: 'Савоярди, маскарпоне, кофе, какао',
        price: 350,
        category: 'Десерты',
        image: '🍰',
        isPopular: true,
      },
      {
        id: 6,
        name: 'Панна котта',
        description: 'Сливки, ваниль, ягодный соус',
        price: 320,
        category: 'Десерты',
        image: '🍮',
      },
    ],
  },
  '2': {
    id: 2,
    name: 'Суши Мастер',
    cuisine: 'Японская',
    rating: 4.9,
    deliveryTime: '30-40 мин',
    priceRange: '₽₽₽₽',
    image: '🍣',
    description: 'Премиум японская кухня от шеф-повара из Токио',
    address: 'Невский проспект, д. 25',
    phone: '+7 (812) 987-65-43',
    menu: [
      {
        id: 1,
        name: 'Филадельфия',
        description: 'Лосось, сливочный сыр, огурец, нори, рис',
        price: 890,
        category: 'Роллы',
        image: '🍣',
        isPopular: true,
      },
      {
        id: 2,
        name: 'Калифорния',
        description: 'Краб, авокадо, огурец, икра тобико, майонез',
        price: 850,
        category: 'Роллы',
        image: '🍣',
        isPopular: true,
      },
      {
        id: 3,
        name: 'Сашими сет',
        description: 'Лосось, тунец, угорь - по 3 кусочка',
        price: 1250,
        category: 'Сашими',
        image: '🍱',
        isPopular: true,
      },
      {
        id: 4,
        name: 'Нигири сет',
        description: 'Ассорти нигири: лосось, тунец, креветка, угорь',
        price: 980,
        category: 'Суши',
        image: '🍣',
      },
      {
        id: 5,
        name: 'Рамен',
        description: 'Свиной бульон, лапша, яйцо, свинина чашу',
        price: 650,
        category: 'Горячее',
        image: '🍜',
        isPopular: true,
      },
      {
        id: 6,
        name: 'Моти',
        description: 'Рисовые пирожные с разными начинками',
        price: 420,
        category: 'Десерты',
        image: '🍡',
      },
    ],
  },
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockRestaurantsData[id || '1'];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Record<number, number>>({});

  if (!restaurant) {
    navigate('/');
    return null;
  }

  const categories = ['all', ...Array.from(new Set(restaurant.menu.map(item => item.category)))];

  const filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const item = restaurant.menu.find(m => m.id === parseInt(itemId));
    return sum + (item?.price || 0) * count;
  }, 0);

  const handleCheckout = () => {
    const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
      const item = restaurant.menu.find(m => m.id === parseInt(itemId));
      return {
        id: parseInt(itemId),
        name: item?.name || '',
        price: item?.price || 0,
        quantity,
        image: item?.image || '',
      };
    });

    navigate('/checkout', {
      state: {
        items: cartItems,
        restaurantName: restaurant.name,
        subtotal: totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{restaurant.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <Icon name="Star" size={14} className="fill-primary text-primary" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{restaurant.deliveryTime}</span>
                <Badge variant="outline" className="text-xs">{restaurant.cuisine}</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <span className="text-8xl">{restaurant.image}</span>
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {restaurant.description}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={16} />
              <span>{restaurant.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-6 bg-secondary/50 p-1 rounded-xl">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {category === 'all' ? 'Все' : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map((item, index) => (
                <Card 
                  key={item.id}
                  className="group hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                          {item.image}
                        </span>
                        {item.isPopular && (
                          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2">
                            ⭐ Хит
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground leading-tight">
                            {item.name}
                          </h3>
                          {item.isSpicy && (
                            <span className="text-lg ml-2">🌶️</span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-foreground">
                            {item.price} ₽
                          </span>

                          {cart[item.id] ? (
                            <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-2 py-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-md"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="font-semibold min-w-[20px] text-center">
                                {cart[item.id]}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-md"
                                onClick={() => addToCart(item.id)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="rounded-lg"
                              onClick={() => addToCart(item.id)}
                            >
                              <Icon name="Plus" size={16} className="mr-1" />
                              В корзину
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl z-50 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalPrice} ₽
                </div>
              </div>
              <Button size="lg" className="rounded-xl px-8" onClick={handleCheckout}>
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;