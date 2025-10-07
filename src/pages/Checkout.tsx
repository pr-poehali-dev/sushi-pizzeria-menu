import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutState {
  items: CartItem[];
  restaurantName: string;
  subtotal: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as CheckoutState;

  const [deliveryType, setDeliveryType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    comment: '',
  });

  if (!state || !state.items || state.items.length === 0) {
    navigate('/');
    return null;
  }

  const deliveryFee = deliveryType === 'delivery' ? 150 : 0;
  const serviceFee = 50;
  const total = state.subtotal + deliveryFee + serviceFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deliveryType === 'delivery' && (!formData.name || !formData.phone || !formData.address)) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Укажите имя, телефон и адрес доставки',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryType === 'pickup' && (!formData.name || !formData.phone)) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Укажите имя и телефон',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✅ Заказ оформлен!',
      description: `Ваш заказ на ${total} ₽ принят в работу. Ожидайте звонка для подтверждения.`,
    });

    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Оформление заказа</h1>
              <p className="text-sm text-muted-foreground">{state.restaurantName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Truck" size={20} />
                  Способ получения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Доставка курьером</p>
                          <p className="text-sm text-muted-foreground">30-40 минут</p>
                        </div>
                        <Badge variant="secondary">150 ₽</Badge>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Самовывоз</p>
                          <p className="text-sm text-muted-foreground">Готово через 20 минут</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Бесплатно</Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="rounded-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Контактные данные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {deliveryType === 'delivery' && (
              <Card className="rounded-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" size={20} />
                    Адрес доставки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Улица и дом *</Label>
                    <Input
                      id="address"
                      placeholder="ул. Пушкина, д. 10"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="rounded-xl mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="apartment">Квартира</Label>
                      <Input
                        id="apartment"
                        placeholder="123"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entrance">Подъезд</Label>
                      <Input
                        id="entrance"
                        placeholder="2"
                        value={formData.entrance}
                        onChange={(e) => handleInputChange('entrance', e.target.value)}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="floor">Этаж</Label>
                      <Input
                        id="floor"
                        placeholder="5"
                        value={formData.floor}
                        onChange={(e) => handleInputChange('floor', e.target.value)}
                        className="rounded-xl mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Input
                      id="comment"
                      placeholder="Позвоните за 10 минут"
                      value={formData.comment}
                      onChange={(e) => handleInputChange('comment', e.target.value)}
                      className="rounded-xl mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CreditCard" size={20} />
                  Способ оплаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="CreditCard" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Картой онлайн</p>
                        <p className="text-sm text-muted-foreground">Visa, MasterCard, Мир</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Banknote" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Наличными курьеру</p>
                        <p className="text-sm text-muted-foreground">При получении заказа</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="sbp" id="sbp" />
                    <Label htmlFor="sbp" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Smartphone" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">СБП (Система быстрых платежей)</p>
                        <p className="text-sm text-muted-foreground">Через мобильный банк</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="rounded-2xl sticky top-24 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="ShoppingBag" size={20} />
                  Ваш заказ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {item.price} ₽
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {item.quantity * item.price} ₽
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сумма заказа</span>
                    <span className="font-medium">{state.subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сервисный сбор</span>
                    <span className="font-medium">{serviceFee} ₽</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Итого</span>
                  <span className="font-bold text-2xl text-primary">{total} ₽</span>
                </div>

                <Button type="submit" size="lg" className="w-full rounded-xl">
                  <Icon name="Check" size={20} className="mr-2" />
                  Оформить заказ
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
