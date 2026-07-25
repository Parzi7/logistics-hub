export const MOCK_CARGOS = [
  {
    id: 1,
    route: { from: 'Литвинов (CZ)', to: 'Київ (UA)' },
    cargo: 'поліетилен у мішках на палетах',
    weight: '22.5 т',
    volume: '86 м³',
    vehicleType: 'тент',
    dates: '23.07 – 24.07',
    price: '125 000 UAH',
    timeAdded: '2 години тому',
    company: 'ТОВ Логістик Плюс',
    customerType: 'Експедитор',
    contact: { name: 'Олександр', phone: '+380(50)1234567', country: 'ua' },
    description: 'Обов\'язково наявність ременів. Завантаження заднє.',
    status: 'active'
  },
  {
    id: 5,
    route: { from: 'Жидачів (UA)', to: 'Молдова обл. (RO)' },
    cargo: 'лотки для яєць',
    weight: '10 т',
    volume: '86 м³',
    vehicleType: 'тент',
    dates: '28.07',
    price: '-',
    timeAdded: '21 годину тому',
    company: 'ЖИДАЧІВСЬКИЙ ЦЕЛЮЛОЗНО-ПАПЕРОВИЙ КОМБІНАТ',
    customerType: 'Прямий замовник',
    contact: { name: 'Віктор Кісіль', phone: '+380(68)2986809', country: 'ua' },
    description: 'Оплата по факту вивантаження, без затримок. Потрібні чисті машини.',
    status: 'active'
  },
  {
    id: 2,
    route: { from: 'Сленік (RO)', to: 'Сарни (UA)' },
    cargo: 'сіль в мішках',
    weight: '23.0 т',
    volume: '90 м³',
    vehicleType: 'тент',
    dates: '20.07 – 22.07',
    price: '58 000 UAH',
    timeAdded: '1 день тому',
    company: 'AgroTrans',
    customerType: 'Прямий замовник',
    contact: { name: 'Марія', phone: '+380(99)7654321', country: 'ua' },
    description: '',
    status: 'active'
  }
];

export const MOCK_ARCHIVE = [
  {
    id: 3,
    route: { from: 'АТ Лакірхен', to: 'UA Хмельницький' },
    cargo: 'папір',
    weight: '22.5 т',
    volume: '86 м³',
    vehicleType: 'тент',
    dates: '15.07 – 17.07',
    price: '85 000 UAH',
    timeAdded: '10 днів тому',
    company: 'PaperMill Ltd',
    customerType: 'Експедитор',
    contact: { name: 'Іван', phone: '+380(67)1112233', country: 'ua' },
    description: 'Вантаж доставлено успішно.',
    status: 'archived'
  }
];

export const MOCK_TRANSPORT = [
  {
    id: 4,
    location: { from: 'Коменешть', to: null },
    vehicle: 'Тент',
    weight: '0.0 т',
    volume: '90 м³',
    date: 'вільна',
    timestamp: '2026-07-20 09:22:24',
    timeAdded: '3 години тому',
    price: '-',
    company: 'TransAuto',
    contact: { name: 'Василь', phone: '+380(66)5554433', country: 'ua' },
    description: 'Готовий їхати в будь-якому напрямку.',
    status: 'active'
  }
];

export const MOCK_ARCHIVE_TRANSPORT = [];