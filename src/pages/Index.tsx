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
  maxLink: 'https://max.ru/cvety',
  freeDeliveryFrom: 3000,
};

const HERO_IMG =
  'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/3d3b7ecf-8011-4ca6-80db-796939444f54.jpg';
const IMG_A =
  'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/4b584b4d-99fd-4674-8f55-593db7b6c87f.jpg';
const IMG_B =
  'https://cdn.poehali.dev/projects/e8407245-8529-4871-aee1-42c9918e49e3/files/deca98ec-7545-40d3-98cf-3ebba1facb1d.jpg';

interface Flower {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const initialFlowers: Flower[] = [
  { id: 1, name: 'Букет из 25 роз Caro', price: 7950, description: 'Пионовидные розы в нежной упаковке', image: HERO_IMG },
  { id: 2, name: 'Композиция из калл', price: 5450, description: 'Каллы, пионы и амарант в коробке', image: IMG_A },
  { id: 3, name: 'Сухоцвет «Олива»', price: 3850, description: 'Пампасная трава и оливковые ветви', image: IMG_B },
  { id: 4, name: 'Букет из белых хризантем', price: 5450, description: 'Белые хризантемы и зелень', image: IMG_A },
  { id: 5, name: 'Букет красных гербер', price: 7250, description: 'Герберы и сезонная зелень', image: HERO_IMG },
  { id: 6, name: 'Диантусы и ромашки', price: 3450, description: 'Полевая композиция в крафте', image: IMG_B },
];

const FILTERS = ['Доставка 24/7', 'Цветы', 'Цена, ₽', 'Состав', 'Акции'];

const Index = () => {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);
  const [cart, setCart] = useState<Flower[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '' });

  const addToCart = (f: Flower) => setCart((c) => [...c, f]);
  const removeFromCart = (idx: number) => setCart((c) => c.filter((_, i) => i !== idx));
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
      {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image || HERO_IMG,
      },
      ...list,
    ]);
    setForm({ name: '', price: '', description: '', image: '' });
    setAdminOpen(false);
  };

  const nav = ['Главная', 'Каталог', 'О магазине', 'Доставка', 'Контакты'];
  const anchors = ['home', 'catalog', 'about', 'delivery', 'contacts'];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <a href="#home" className="font-logo text-3xl italic tracking-wide text-gold">
            Цветы
          </a>
          <nav className="hidden gap-8 md:flex">
            {nav.map((n, i) => (
              <a
                key={n}
                href={`#${anchors[i]}`}
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-gold"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, '')}`} className="hidden text-sm text-foreground/80 hover:text-gold sm:block">
              {COMPANY.phone}
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-foreground hover:text-gold">
                  <Icon name="ShoppingBag" size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-medium text-moss-dark">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card text-card-foreground border-border">
                <SheetHeader>
                  <SheetTitle className="font-display text-3xl text-gold">Корзина</SheetTitle>
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
                        <span className="text-gold">{cartTotal.toLocaleString('ru')} ₽</span>
                      </div>
                      <Button className="w-full bg-gold text-moss-dark hover:bg-gold/90">Оформить заказ</Button>
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
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="container relative py-24 text-center md:py-36">
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-gold animate-fade-in">студия флористики</p>
          <h1 className="font-logo text-6xl italic text-cream md:text-8xl animate-fade-in">Цветы</h1>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground animate-fade-in">
            Цветы нашего тайного сада — чтобы озарить ваши моменты. Авторские букеты в природной болотно-винной палитре.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-fade-in">
            <a href="#catalog">
              <Button className="bg-gold text-moss-dark hover:bg-gold/90">Смотреть каталог</Button>
            </a>
            <a href={COMPANY.maxLink} target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Написать в MAX
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Feature bars */}
      <section className="border-y border-border bg-wine-dark">
        <div className="container grid gap-px py-0 md:grid-cols-3">
          {[
            ['Truck', `Бесплатная доставка от ${COMPANY.freeDeliveryFrom.toLocaleString('ru')} ₽`],
            ['Flower2', 'Большое разнообразие цветов'],
            ['Clock', 'Доставка 24/7 в день заказа'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center justify-center gap-3 py-5 text-center">
              <Icon name={icon} size={20} className="text-gold" />
              <span className="font-display text-lg tracking-wide text-cream">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-20">
        <div className="container">
          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">коллекция</p>
            <h2 className="font-display text-5xl text-cream">Каталог</h2>
          </div>
          <div className="mb-10 flex flex-wrap gap-2">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                  i === 0
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-border text-muted-foreground hover:border-gold/50 hover:text-gold'
                }`}
              >
                {f}
                {i > 0 && <Icon name="ChevronDown" size={14} />}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {flowers.map((f) => (
              <div
                key={f.id}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-gold/40"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-cream backdrop-blur hover:text-gold">
                    <Icon name="Heart" size={16} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="font-display text-2xl text-gold">{f.price.toLocaleString('ru')} ₽</span>
                  <h3 className="mt-1 text-base font-medium">{f.name}</h3>
                  <p className="mb-4 mt-0.5 flex-1 text-sm text-muted-foreground">{f.description}</p>
                  <Button
                    onClick={() => addToCart(f)}
                    className="w-full bg-moss text-cream hover:bg-moss/80"
                  >
                    <Icon name="ShoppingBag" size={15} className="mr-2" />В корзину
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-border bg-wine-dark py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <img src={IMG_B} alt="О магазине" className="aspect-square w-full rounded-md object-cover" />
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">о нас</p>
            <h2 className="font-display text-5xl text-cream">Студия «Цветы»</h2>
            <p className="mt-6 text-cream/75">
              Мы влюблены в приглушённые благородные оттенки — болотный, винный, золото и крем. Каждый букет собирается вручную из свежих цветов и изысканной зелени.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                ['Calendar', '6 лет', 'на рынке'],
                ['Flower2', '2 000+', 'букетов'],
                ['Heart', '98%', 'довольных'],
              ].map(([icon, num, label]) => (
                <div key={label} className="rounded-md border border-cream/15 p-4">
                  <Icon name={icon} size={22} className="mx-auto mb-2 text-gold" />
                  <p className="font-display text-3xl text-cream">{num}</p>
                  <p className="text-xs text-cream/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="py-20">
        <div className="container">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">сервис</p>
          <h2 className="font-display text-5xl text-cream">Доставка</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['Truck', 'Бесплатно', `При заказе от ${COMPANY.freeDeliveryFrom.toLocaleString('ru')} ₽ — доставим без оплаты по городу.`],
              ['Clock', 'В день заказа', 'Курьер привезёт букет в удобный интервал, до 2 часов.'],
              ['ShieldCheck', 'Свежесть', 'Гарантируем свежесть цветов или заменим букет.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-md border border-border bg-card p-6">
                <Icon name={icon} size={26} className="mb-4 text-gold" />
                <h3 className="font-display text-2xl text-cream">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="border-t border-border bg-wine-dark py-20">
        <div className="container grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">связь</p>
            <h2 className="font-display text-5xl text-cream">Контакты</h2>
            <div className="mt-8 space-y-5">
              <a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-4 group">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-gold">
                  <Icon name="Phone" size={18} />
                </span>
                <span className="text-lg text-cream group-hover:text-gold transition-colors">{COMPANY.phone}</span>
              </a>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-gold">
                  <Icon name="MapPin" size={18} />
                </span>
                <span className="text-lg text-cream">{COMPANY.address}</span>
              </div>
              <a href={COMPANY.maxLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-gold">
                  <Icon name="MessageCircle" size={18} />
                </span>
                <span className="text-lg text-cream group-hover:text-gold transition-colors">Написать в MAX</span>
              </a>
            </div>
          </div>
          <div className="rounded-md border border-cream/15 bg-card p-8">
            <h3 className="font-display text-3xl text-gold">Оставить заявку</h3>
            <div className="mt-5 space-y-3">
              <Input placeholder="Ваше имя" className="bg-background" />
              <Input placeholder="Телефон" className="bg-background" />
              <Textarea placeholder="Комментарий к заказу" rows={3} className="bg-background" />
              <Button className="w-full bg-gold text-moss-dark hover:bg-gold/90">Отправить</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer + Admin */}
      <footer className="border-t border-border bg-moss-dark text-cream/70">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm md:flex-row">
          <p className="font-logo text-2xl italic text-gold">Цветы</p>
          <p>© {new Date().getFullYear()} Студия флористики. Все права защищены.</p>
          <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-cream/60 hover:text-gold hover:bg-cream/10">
                <Icon name="Lock" size={14} className="mr-1.5" />
                Админ
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-3xl text-gold">Добавить цветок</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Название"
                  className="bg-background"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Цена, ₽"
                  className="bg-background"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
                <Textarea
                  placeholder="Описание"
                  rows={2}
                  className="bg-background"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Фото товара</label>
                  <Input type="file" accept="image/*" className="bg-background" onChange={handleImage} />
                  {form.image && (
                    <img src={form.image} alt="preview" className="mt-3 h-28 w-28 rounded object-cover" />
                  )}
                </div>
                <Button onClick={addFlower} className="w-full bg-gold text-moss-dark hover:bg-gold/90">
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
