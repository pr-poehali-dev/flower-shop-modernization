import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const COMPANY = {
  phone: '+7 (900) 123-45-67',
  address: 'г. Москва, ул. Зелёная Роща, 12',
  maxLink: 'https://max.ru/bolotny_cvet',
  freeDeliveryFrom: 3000,
};

interface Flower {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const initialFlowers: Flower[] = [
  {
    id: 1,
    name: 'Болотный шёлк',
    price: 4200,
    description: 'Кремовые розы с эвкалиптом в природной палитре',
    image:
      'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/4b584b4d-99fd-4674-8f55-593db7b6c87f.jpg',
  },
  {
    id: 2,
    name: 'Сухоцвет «Олива»',
    price: 2800,
    description: 'Пампасная трава и оливковые ветви в керамике',
    image:
      'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/deca98ec-7545-40d3-98cf-3ebba1facb1d.jpg',
  },
  {
    id: 3,
    name: 'Тихий вечер',
    price: 3600,
    description: 'Авторская композиция в зелёных тонах',
    image:
      'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/4b584b4d-99fd-4674-8f55-593db7b6c87f.jpg',
  },
];

const Index = () => {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);
  const [cart, setCart] = useState<Flower[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '' });

  const addToCart = (f: Flower) => setCart((c) => [...c, f]);
  const removeFromCart = (idx: number) =>
    setCart((c) => c.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((s, f) => s + f.price, 0);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const addFlower = () => {
    if (!form.name || !form.price) return;
    setFlowers((list) => [
      ...list,
      {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image || initialFlowers[0].image,
      },
    ]);
    setForm({ name: '', price: '', description: '', image: '' });
    setAdminOpen(false);
  };

  const nav = ['Главная', 'Каталог', 'О магазине', 'Доставка', 'Контакты'];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top delivery bar */}
      <div className="bg-moss-dark text-cream text-sm">
        <div className="container flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-center">
          <span className="flex items-center gap-2">
            <Icon name="Truck" size={15} />
            Бесплатная доставка от {COMPANY.freeDeliveryFrom.toLocaleString('ru')} ₽
          </span>
          <a
            href={COMPANY.maxLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 underline underline-offset-4 hover:text-clay transition-colors"
          >
            <Icon name="MessageCircle" size={15} />
            Мы в МАКС
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <a href="#home" className="font-display text-2xl tracking-tight text-moss">
            Болотный<span className="text-clay">·</span>цвет
          </a>
          <nav className="hidden gap-7 md:flex">
            {nav.map((n, i) => (
              <a
                key={n}
                href={`#${['home', 'catalog', 'about', 'delivery', 'contacts'][i]}`}
                className="text-sm text-muted-foreground transition-colors hover:text-moss"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingBag" size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[11px] font-medium text-moss-dark">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {cart.length === 0 && (
                    <p className="text-sm text-muted-foreground">Пока пусто. Выберите букет в каталоге.</p>
                  )}
                  {cart.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={f.image} alt={f.name} className="h-14 w-14 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{f.name}</p>
                        <p className="text-sm text-muted-foreground">{f.price.toLocaleString('ru')} ₽</p>
                      </div>
                      <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive">
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                  {cart.length > 0 && (
                    <div className="mt-2 border-t border-border pt-4">
                      <div className="mb-3 flex justify-between font-medium">
                        <span>Итого</span>
                        <span>{cartTotal.toLocaleString('ru')} ₽</span>
                      </div>
                      <Button className="w-full bg-moss text-cream hover:bg-moss-dark">Оформить заказ</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-in">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-clay">студия флористики</p>
            <h1 className="font-display text-5xl leading-[1.05] text-moss md:text-7xl">
              Букеты цвета<br />тихого болота
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              Природные оттенки, благородная зелень и сухоцветы. Собираем композиции, которые живут долго и говорят без слов.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalog">
                <Button className="bg-moss text-cream hover:bg-moss-dark">Смотреть каталог</Button>
              </a>
              <a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, '')}`}>
                <Button variant="outline" className="border-moss text-moss hover:bg-secondary">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Позвонить
                </Button>
              </a>
            </div>
          </div>
          <div className="animate-scale-in">
            <img
              src={initialFlowers[0].image}
              alt="Букет"
              className="aspect-[4/5] w-full rounded-sm object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="border-t border-border bg-secondary/40 py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-clay">коллекция</p>
              <h2 className="font-display text-4xl text-moss md:text-5xl">Каталог</h2>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {flowers.map((f) => (
              <div key={f.id} className="group flex flex-col">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="font-display text-2xl text-moss">{f.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-medium">{f.price.toLocaleString('ru')} ₽</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(f)}
                      className="bg-moss text-cream hover:bg-moss-dark"
                    >
                      В корзину
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <img
            src={initialFlowers[1].image}
            alt="О магазине"
            className="aspect-square w-full rounded-sm object-cover"
          />
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-clay">о нас</p>
            <h2 className="font-display text-4xl text-moss md:text-5xl">Студия «Болотный цвет»</h2>
            <p className="mt-6 text-muted-foreground">
              Мы любим приглушённые природные оттенки — болотный, оливковый, глину и крем. Каждый букет собирается вручную из свежих цветов и благородной зелени.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                ['Calendar', '6 лет', 'на рынке'],
                ['Flower2', '2 000+', 'букетов'],
                ['Heart', '98%', 'довольных'],
              ].map(([icon, num, label]) => (
                <div key={label} className="rounded-sm bg-secondary/50 p-4">
                  <Icon name={icon} size={22} className="mx-auto mb-2 text-moss" />
                  <p className="font-display text-2xl text-moss">{num}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="border-y border-border bg-moss text-cream py-20">
        <div className="container">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-clay">сервис</p>
          <h2 className="font-display text-4xl md:text-5xl">Доставка</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ['Truck', 'Бесплатно', `При заказе от ${COMPANY.freeDeliveryFrom.toLocaleString('ru')} ₽ — доставим без оплаты по городу.`],
              ['Clock', 'В день заказа', 'Курьер привезёт букет в удобный интервал, до 2 часов.'],
              ['ShieldCheck', 'Свежесть', 'Гарантируем свежесть цветов или заменим букет.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-sm border border-cream/15 p-6">
                <Icon name={icon} size={26} className="mb-4 text-clay" />
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-cream/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-20">
        <div className="container grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-clay">связь</p>
            <h2 className="font-display text-4xl text-moss md:text-5xl">Контакты</h2>
            <div className="mt-8 space-y-5">
              <a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-4 group">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-moss">
                  <Icon name="Phone" size={18} />
                </span>
                <span className="text-lg group-hover:text-moss transition-colors">{COMPANY.phone}</span>
              </a>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-moss">
                  <Icon name="MapPin" size={18} />
                </span>
                <span className="text-lg">{COMPANY.address}</span>
              </div>
              <a href={COMPANY.maxLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-moss">
                  <Icon name="MessageCircle" size={18} />
                </span>
                <span className="text-lg group-hover:text-moss transition-colors">Написать в МАКС</span>
              </a>
            </div>
          </div>
          <div className="rounded-sm bg-secondary/50 p-8">
            <h3 className="font-display text-2xl text-moss">Оставить заявку</h3>
            <div className="mt-5 space-y-3">
              <Input placeholder="Ваше имя" />
              <Input placeholder="Телефон" />
              <Textarea placeholder="Комментарий к заказу" rows={3} />
              <Button className="w-full bg-moss text-cream hover:bg-moss-dark">Отправить</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer + Admin */}
      <footer className="border-t border-border bg-moss-dark text-cream/80">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm md:flex-row">
          <p className="font-display text-lg text-cream">Болотный·цвет</p>
          <p>© {new Date().getFullYear()} Студия флористики. Все права защищены.</p>
          <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-cream/70 hover:text-cream hover:bg-cream/10">
                <Icon name="Lock" size={14} className="mr-1.5" />
                Админ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-moss">Добавить цветок</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Название"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Цена, ₽"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
                <Textarea
                  placeholder="Описание"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Фото товара</label>
                  <Input type="file" accept="image/*" onChange={handleImage} />
                  {form.image && (
                    <img src={form.image} alt="preview" className="mt-3 h-28 w-28 rounded object-cover" />
                  )}
                </div>
                <Button onClick={addFlower} className="w-full bg-moss text-cream hover:bg-moss-dark">
                  Добавить в каталог
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
};

export default Index;
