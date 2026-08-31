import { defaultLocale, type LocaleId } from './locales';

export interface MessageCatalog {
  documentTitle: string;
  nav: {
    menu: string;
    locale: string;
    toggle: string;
    home: string;
    about: string;
    documentation: string;
    projects: string;
    events: string;
    media: string;
    contacts: string;
    credits: string;
  };
  pager: {
    previousFile: string;
    nextFile: string;
    previous: string;
    next: string;
    forward: string;
    close: string;
    download: string;
  };
  home: {
    openHintBefore: string;
    openHintMid: string;
    quickContacts: string;
    quickTelegram: string;
    quickMail: string;
    quickDiscord: string;
  };
  interaction: {
    title: string;
  };
  whoami: {
    window: string;
  };
  techDocs: {
    mapTitle: string;
    mapMeta: string;
    component: string;
    index: string;
    inspect: string;
    showAll: string;
  };
  exec: {
    requestsOpen: string;
    projectRecord: string;
    order: string;
    orderHint: string;
  };
  router: {
    history: string;
    historyMeta: string;
    scheduled: string;
    scheduledMeta: string;
    emptyHistory: string;
    emptyQueue: string;
  };
  protocols: {
    connect: string;
    opens: string;
  };
  license: {
    bio: string;
    personalSignal: string;
    commissions: string;
    sign: string;
  };
  gallery: {
    open: string;
    item: string;
  };
  terminal: {
    cmd: string;
    suggestions: string;
    enter: string;
    prompt: string;
    notFound: string;
    tryHelp: string;
    navigationComplete: string;
    localeUsage: string;
    localeCurrent: string;
    localeUnknown: string;
    localeActivated: string;
    availableCommands: string;
    arrowsHint: string;
    execHint: string;
  };
  commands: Record<string, string>;
  boot: {
    aria: string;
    portrait: string;
    skip: string;
    pressStart: string;
    continue: string;
    greeting: string;
    abort: string;
  };
}

const en: MessageCatalog = {
  documentTitle: 'Personal System',
  nav: {
    menu: 'Menu',
    locale: 'locale',
    toggle: 'Toggle menu',
    home: 'Home',
    about: 'About',
    documentation: 'Documentation',
    projects: 'Projects',
    events: 'Events',
    media: 'Media',
    contacts: 'Contacts',
    credits: 'Credits',
  },
  pager: {
    previousFile: 'previous file',
    nextFile: ' next file',
    previous: 'Previous',
    next: 'Next',
    forward: 'Forward',
    close: 'Close',
    download: 'Download',
  },
  home: {
    openHintBefore: 'TIP: Open a section from the menu, press ',
    openHintMid: ' or type ',
    quickContacts: 'Quick contacts',
    quickTelegram: 'TG',
    quickMail: 'Mail',
    quickDiscord: 'Discord',
  },
  interaction: {
    title: 'WARNING: INTERACTION PROTOCOL',
  },
  whoami: {
    window: 'WHOAMI',
  },
  techDocs: {
    mapTitle: 'VARECTRA TECHNICAL SPECS',
    mapMeta: 'select [+]',
    component: 'COMPONENT',
    index: 'COMPONENT INDEX',
    inspect: 'Inspect',
    showAll: '[Enter/click: show all]',
  },
  exec: {
    requestsOpen: 'requests: open',
    projectRecord: 'project record',
    order: '[ ORDER ]',
    orderHint: 'Opens Telegram in a new tab',
  },
  router: {
    history: 'ROUTING HISTORY',
    historyMeta: 'newest first',
    scheduled: 'SCHEDULED TASKS',
    scheduledMeta: 'nearest first',
    emptyHistory: 'No historical packets.',
    emptyQueue: 'Queue is empty.',
  },
  protocols: {
    connect: 'connect',
    opens: 'Opens',
  },
  license: {
    bio: 'Author of this personal system. Backend developer and architect. Builds character sites as one-off commissions, not templates.',
    personalSignal: 'personal signal',
    commissions: 'commissions',
    sign: 'Personal sites, made prenonally',
  },
  gallery: {
    open: 'Open',
    item: 'Gallery item',
  },
  terminal: {
    cmd: 'cmd',
    suggestions: 'Available commands',
    enter: 'Run command',
    prompt: 'Enter a site command',
    notFound: 'varectra: command not found',
    tryHelp: 'Try `/help`.',
    navigationComplete: 'navigation complete',
    localeUsage: '/locale [ru en by]',
    localeCurrent: 'locale',
    localeUnknown: 'locale not found',
    localeActivated: 'locale activated',
    availableCommands: 'available commands',
    arrowsHint: 'tip: arrows move · enter open',
    execHint: 'tip: arrows move · enter open · o order',
  },
  commands: {
    '/help': 'Show available commands',
    '/about': 'Open identity records',
    '/tech-docs': 'Inspect Varectra technical specifications',
    '/exec': 'Browse projects and services',
    '/router': 'Read event routing logs',
    '/static': 'Browse the media filesystem',
    '/protocols': 'List communication protocols',
    '/license': 'Read author license and credits',
    '/themes': 'List or activate an interface theme',
    '/locale': 'List or activate an interface locale',
    '/leg': 'Extend the local canid beyond its specified length',
  },
  boot: {
    aria: 'Varectra system boot',
    portrait: 'ASCII portrait of Varectra, a protogen with a visor and mane.',
    skip: '[ESC] skip',
    pressStart: 'PRESS [ANY KEY TO START]',
    continue: 'continue [ENTER]',
    greeting: 'Hello! My name is Varectra.',
    abort: '[ESC] abort',
  },
};

const ru: MessageCatalog = {
  documentTitle: 'Персональная система',
  nav: {
    menu: 'Меню',
    locale: 'локаль',
    toggle: 'Открыть меню',
    home: 'Главная',
    about: 'Обо мне',
    documentation: 'Документация',
    projects: 'Проекты',
    events: 'События',
    media: 'Медиа',
    contacts: 'Контакты',
    credits: 'Авторы',
  },
  pager: {
    previousFile: 'пред. файл',
    nextFile: ' след. файл',
    previous: 'Назад',
    next: 'Далее',
    forward: 'Вперёд',
    close: 'Закрыть',
    download: 'Скачать',
  },
  home: {
    openHintBefore: 'TIP: Открой раздел в меню, нажми ',
    openHintMid: ' или введи в терминале ',
    quickContacts: 'Быстрые контакты',
    quickTelegram: 'TG',
    quickMail: 'Почта',
    quickDiscord: 'Discord',
  },
  interaction: {
    title: 'WARNING: ПРОТОКОЛ ВЗАИМОДЕЙСТВИЯ',
  },
  whoami: {
    window: 'WHOAMI',
  },
  techDocs: {
    mapTitle: 'ТЕХНИЧЕСКИЕ СПЕЦИФИКАЦИИ',
    mapMeta: 'выбор [+]',
    component: 'КОМПОНЕНТ',
    index: 'ИНДЕКС КОМПОНЕНТОВ',
    inspect: 'Открыть',
    showAll: '[Enter/клик: показать всё]',
  },
  exec: {
    requestsOpen: 'заявки: открыты',
    projectRecord: 'запись проекта',
    order: '[ ЗАКАЗ ]',
    orderHint: 'Открывает Telegram в новой вкладке',
  },
  router: {
    history: 'ЖУРНАЛ МАРШРУТОВ',
    historyMeta: 'сначала новые',
    scheduled: 'ПЛАНОВЫЕ ЗАДАЧИ',
    scheduledMeta: 'сначала ближайшие',
    emptyHistory: 'Исторических пакетов нет.',
    emptyQueue: 'Очередь пуста.',
  },
  protocols: {
    connect: 'подключить',
    opens: 'Открывает',
  },
  license: {
    bio: 'Автор этой персональной системы. Бэкенд-разработчик и архитектор. Собирает сайты персонажей как разовые заказы, а не шаблоны.',
    personalSignal: 'личный сигнал',
    commissions: 'комиссии',
    sign: 'Personal sites, made prenonally',
  },
  gallery: {
    open: 'Открыть',
    item: 'Кадр галереи',
  },
  terminal: {
    cmd: 'cmd',
    suggestions: 'Доступные команды',
    enter: 'Выполнить команду',
    prompt: 'Введите команду сайта',
    notFound: 'varectra: команда не найдена',
    tryHelp: 'Попробуй `/help`.',
    navigationComplete: 'переход выполнен',
    localeUsage: '/locale [ru en by]',
    localeCurrent: 'локаль',
    localeUnknown: 'локаль не найдена',
    localeActivated: 'локаль включена',
    availableCommands: 'доступные команды',
    arrowsHint: 'подсказка: стрелки — выбор · enter — открыть',
    execHint: 'подсказка: стрелки — выбор · enter — открыть · o — заказ',
  },
  commands: {
    '/help': 'Показать доступные команды',
    '/about': 'Открыть записи личности',
    '/tech-docs': 'Смотреть технические спецификации Varectra',
    '/exec': 'Смотреть проекты и услуги',
    '/router': 'Читать журнал событий',
    '/static': 'Смотреть медиафайлы',
    '/protocols': 'Список каналов связи',
    '/license': 'Лицензия автора и кредиты',
    '/themes': 'Список или смена темы интерфейса',
    '/locale': 'Список или смена локали интерфейса',
    '/leg': 'Удлинить местного канида сверх спецификации',
  },
  boot: {
    aria: 'Загрузка системы Varectra',
    portrait: 'ASCII-портрет Varectra, протогена с визором и гривой.',
    skip: '[ESC] пропуск',
    pressStart: 'НАЖМИ [ЛЮБУЮ КЛАВИШУ]',
    continue: 'продолжить [ENTER]',
    greeting: 'Привет! Меня зовут Varectra.',
    abort: '[ESC] стоп',
  },
};

/**
 * Message packs keyed by locale id.
 * Add `by` here when the Belarusian UI copy is ready; unresolved locales
 * fall back through `getMessages`.
 */
const catalogs: Partial<Record<LocaleId, MessageCatalog>> = {
  en,
  ru,
};

export const getMessages = (locale: LocaleId): MessageCatalog =>
  catalogs[locale] ?? catalogs[defaultLocale] ?? en;
