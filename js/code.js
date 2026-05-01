window.onload = function() {
    let preloader = document.getElementById('loader_body');
    preloader.classList.add('hide-preloader');
    setInterval(function() {
    preloader.classList.add('preloader-hidden');
    }, 990);
}

const checkbox = document.getElementById('theme-checkbox');
const root = document.documentElement;
// Проверка сохраненной темы при загрузке страницы
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    checkbox.checked = true;
}
// Изменение темы при клике
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

const burger = document.getElementById('burger');
const navList = document.querySelector('.header__list');
const overlay = document.getElementById('menuOverlay');

burger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

// Закрыть при клике на пункт меню
navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

function toggleMenu() {
    const isOpen = navList.classList.toggle('open');
    burger.classList.toggle('active');
    overlay.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : ''; // блок скролла
}

function closeMenu() {
    navList.classList.remove('open');
    burger.classList.remove('active');
    overlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

/* =====================================================================
   ТРЕНАЖЁР: сценарии
   ===================================================================== */
   /* =========================================================================
   СЦЕНАРИИ ТРЕНАЖЁРА «КИБЕРПЕРЕПИСКА»
   -------------------------------------------------------------------------
   Каждый сценарий — объект со следующими полями:

   id            — уникальный строковый идентификатор (используется в URL/коде)
   title         — название карточки на экране выбора
   tagline       — короткое описание под названием
   difficulty    — 'easy' | 'medium' | 'hard'  (для бейджа сложности)
   icon          — эмодзи или один символ для аватарки злоумышленника
   attacker      — { name, status }  ник и статус «собеседника» в шапке чата
   intro         — текст-ситуация, который показывается перед стартом
   timeLimit     — лимит времени на ОДИН ход в секундах (по умолчанию 25)
   start         — id первого шага (ключ в объекте steps)
   steps         — { [stepId]: Step }

   Step (шаг диалога):
   {
     messages: [                       // что присылает «мошенник» перед выбором
       { text: '...', delay: 600 }     // delay — задержка перед сообщением, мс
     ],
     question: 'Как ответите?',        // подпись над вариантами (необязательно)
     options: [                        // 2–4 варианта ответа пользователя
       {
         text: 'Текст ответа игрока',
         safe: true,                   // true = правильный с т.з. безопасности
         feedback: 'Почему так лучше', // объяснение, показывается в финале
         next: 'step2'                 // id следующего шага ИЛИ 'win' / 'lose'
       }
     ],
     onTimeout: {                      // что произойдёт при истечении таймера
       feedback: 'Промедление...',
       next: 'lose'                    // обычно ведёт к проигрышу
     }
   }

   Специальные «терминальные» id:
     'win'  — игрок успешно распознал мошенника
     'lose' — игрок попался на уловку
    ПРИМЕР:

    s3: {
        messages:[
            {text: '13423'},
            {text: '13423'}
        ],
        question: '1',
        options: [
            {text: '12', safe: true, next: 'win'}
        ],
        onTimeout:{} 
      },

   Можно создавать сколько угодно промежуточных шагов и ветвлений.
   ========================================================================= */

const SCENARIOS = [
    {
    id: 'olympiad-curator',
    title: 'Фальшивый куратор олимпиады',
    tagline: 'Незнакомец обещает добавить тебя в список участников',
    difficulty: 'easy',
    icon: '🎓',
    attacker: { name: 'Куратор_РЦО', status: 'онлайн' },
    intro: 'Тебе пишет человек, который представляется куратором школьной олимпиады. Он торопит и просит данные якобы для регистрации.',
    timeLimit: 25,
    start: 'step1',
    steps: {
      step1: {
        messages: [{ text: 'Привет. Я куратор районной олимпиады, срочно подтверждаем участников.', delay: 600 }],
        question: 'Как ответите?',
        options: [
          { text: 'Представьтесь и напишите с официального аккаунта школы.', safe: true, feedback: 'Правильно: сначала нужно проверить, кто пишет и откуда.', next: 'step2' },
          { text: 'Хорошо, я готов, что нужно отправить?', safe: false, feedback: 'Опасно: ты сразу доверился незнакомому аккаунту.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Пауза дала мошеннику шанс продолжать давление без сопротивления.', next: 'lose' }
      },
      step2: {
        messages: [{ text: 'Не трать время, мне нужно только ФИО и класс, потом внесу тебя вручную.', delay: 700 }],
        question: 'Что выберете?',
        options: [
          { text: 'Сначала проверю информацию у учителя или на сайте школы.', safe: true, feedback: 'Верно: проверка по независимому каналу снижает риск обмана.', next: 'step3' },
          { text: 'Отправлю ФИО и класс, это же не страшно.', safe: false, feedback: 'Даже базовые данные нельзя отдавать непроверенному человеку.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Промедление не заменяет безопасного решения.', next: 'lose' }
      },
      step3: {
        messages: [{ text: 'Для пропуска в систему укажи дату рождения и номер телефона.', delay: 650 }],
        question: 'Как поступите?',
        options: [
          { text: 'Нет, такие данные я в чате не отправляю.', safe: true, feedback: 'Правильно: мошенники часто расширяют сбор персональных данных постепенно.', next: 'step4' },
          { text: 'Сейчас скину, только быстро.', safe: false, feedback: 'Опасно: это уже чувствительные персональные данные.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Молчание не останавливает атаку и не учит безопасному действию.', next: 'lose' }
      },
      step4: {
        messages: [{ text: 'Ладно, тогда подтверди номер: тебе сейчас придёт код, просто перешли его мне.', delay: 700 }],
        question: 'Что ответите?',
        options: [
          { text: 'Коды подтверждения никому не пересылаю.', safe: true, feedback: 'Отлично: коды из SMS и приложений нельзя передавать никому.', next: 'step5' },
          { text: 'Хорошо, перешлю код, если придёт.', safe: false, feedback: 'Передача кода почти всегда ведёт к захвату аккаунта или операции от твоего имени.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Пока ты молчишь, мошенник продолжает схему давления.', next: 'lose' }
      },
      step5: {
        messages: [{ text: 'Тогда перейди по ссылке и сам введи код там: edu-confirm-list.ru', delay: 650 }],
        question: 'Какой вариант безопаснее?',
        options: [
          { text: 'Не открою ссылку из чата и зайду только на официальный сайт вручную.', safe: true, feedback: 'Верно: адрес из сообщения может вести на фишинговую страницу.', next: 'step6' },
          { text: 'Открою, если сайт похож на настоящий.', safe: false, feedback: 'Внешний вид не гарантирует подлинность сайта.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Пауза без решения оставляет риск перехода по вредной ссылке.', next: 'lose' }
      },
      step6: {
        messages: [{ text: 'Если не веришь, вот фото удостоверения и список фамилий.', delay: 700 }],
        question: 'Что сделаете?',
        options: [
          { text: 'Скриншоты не доказательство, проверю через школу.', safe: true, feedback: 'Правильно: изображения легко подделать.', next: 'step7' },
          { text: 'Раз есть удостоверение, значит всё нормально.', safe: false, feedback: 'Поддельные документы — частый инструмент социальной инженерии.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Нужно не ждать, а выбирать проверку через официальный канал.', next: 'lose' }
      },
      step7: {
        messages: [{ text: 'Никому не звони, учителя сейчас на совещании, просто закончим регистрацию.', delay: 700 }],
        question: 'Ваш ответ?',
        options: [
          { text: 'Именно поэтому я и уточню у учителя отдельно.', safe: true, feedback: 'Отлично: просьба хранить секретность — сильный тревожный признак.', next: 'step8' },
          { text: 'Хорошо, никому не скажу.', safe: false, feedback: 'Секретность выгодна только злоумышленнику.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Мошенник давит на изоляцию жертвы.', next: 'lose' }
      },
      step8: {
        messages: [{ text: 'Ты можешь сорвать себе участие. До закрытия списка 7 минут.', delay: 650 }],
        question: 'Что выберете?',
        options: [
          { text: 'Срочность не повод нарушать правила безопасности.', safe: true, feedback: 'Верно: искусственная спешка — классическая манипуляция.', next: 'step9' },
          { text: 'Ладно, ради участия сделаю как сказано.', safe: false, feedback: 'Именно на страхе упустить возможность и строится атака.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Под давлением времени важно не замирать, а перейти к проверке.', next: 'lose' }
      },
      step9: {
        messages: [{ text: 'Тогда просто отправь логин от дневника, пароль менять не буду.', delay: 700 }],
        question: 'Как ответите?',
        options: [
          { text: 'Логины и пароли никому не передаю.', safe: true, feedback: 'Абсолютно верно: настоящий сотрудник не просит пароль в переписке.', next: 'step10' },
          { text: 'Скину логин, а пароль потом поменяю.', safe: false, feedback: 'Даже временная передача доступа опасна.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Нельзя оставлять запросы на доступ без жёсткого отказа.', next: 'lose' }
      },
      step10: {
        messages: [{ text: 'Хорошо, тогда установи приложение “Реестр участников”, я помогу всё заполнить.', delay: 750 }],
        question: 'Что сделаете?',
        options: [
          { text: 'Не буду ставить программы по ссылке из чата.', safe: true, feedback: 'Правильно: под видом приложения может распространяться вредоносное ПО.', next: 'step11' },
          { text: 'Скачаю, если оно быстро установится.', safe: false, feedback: 'Установка непроверенного ПО может привести к заражению устройства.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Задержка не делает установку безопасной.', next: 'lose' }
      },
      step11: {
        messages: [{ text: 'Последний вариант: переведи 6 рублей за срочную обработку заявки.', delay: 700 }],
        question: 'Как ответите?',
        options: [
          { text: 'Никаких оплат по личным сообщениям я не делаю.', safe: true, feedback: 'Верно: неожиданные сборы в личке — частый финансовый обман.', next: 'step12' },
          { text: 'Сумма маленькая, переведу.', safe: false, feedback: 'Небольшие суммы тоже используют для выманивания денег и проверки доверчивости.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Мошенник пытается дожать жертву деньгами.', next: 'lose' }
      },
      step12: {
        messages: [{ text: 'Ты всё усложняешь. Давай быстро закончим и удалим переписку.', delay: 700 }],
        question: 'Финальное действие?',
        options: [
          { text: 'Блокирую аккаунт и сообщаю учителю или администратору.', safe: true, feedback: 'Идеально: ты распознал мошенника, прекратил контакт и сообщил взрослым/админу.', next: 'win' },
          { text: 'Удалю переписку и забуду.', safe: false, feedback: 'Неправильно: без сообщения злоумышленник продолжит атаковать других.', next: 'lose' }
        ],
        onTimeout: { feedback: 'Нужно завершить инцидент безопасно: блокировка и сообщение.', next: 'lose' }
      }
    }
  },
  {
    id: 'demo_bank',
    title: 'Звонок из «банка»',
    tagline: 'Незнакомец пишет от лица службы безопасности',
    difficulty: 'easy', icon: '🏦',
    attacker: { name: 'Служба безопасности', status: 'в сети' },
    intro: 'Вам пишет неизвестный, представляющийся сотрудником банка. У вас 25 секунд на каждый ответ.',
    timeLimit: 25, start: 's1',
    steps: {
      s1: {
        messages: [
          { text: 'Здравствуйте! Это служба безопасности банка.', delay: 400 },
          { text: 'Зафиксирована подозрительная попытка входа в ваш интернет-банк.', delay: 1200 },
          { text: 'Подтвердите, пожалуйста, что это были вы.', delay: 1100 }
        ],
        question: 'Что ответить?',
        options: [
          { text: 'Это не я, что делать?', safe: false, feedback: 'Так мошенник вовлекает вас в диалог и постепенно запрашивает данные.', next: 's2' },
          { text: 'Перезвоню сам по номеру с обратной стороны карты.', safe: true, feedback: 'Верно: настоящий банк всегда подтвердит обращение по официальному номеру.', next: 'win' },
          { text: 'Назовите мои ФИО и последние 4 цифры карты — тогда поверю.', safe: false, feedback: 'Эти данные мошенник может узнать из утечек, не считайте это доказательством.', next: 's2' }
        ],
        onTimeout: { feedback: 'Промедление в реальной ситуации играет на руку мошеннику — он давит на срочность.', next: 'lose' }
      },
      s2: {
        messages: [{ text: 'Чтобы остановить операцию, продиктуйте код из СМС.', delay: 800 }],
        question: 'Ваш ход',
        options: [
          { text: 'Сейчас продиктую…', safe: false, feedback: 'Никогда и никому не сообщайте СМС-код — это ключ к вашему счёту.', next: 'lose' },
          { text: 'Сотрудники банка не запрашивают коды из СМС. Завершаю разговор.', safe: true, feedback: 'Правильно: код из СМС — секрет, аналогичный паролю.', next: 'win' }
        ],
        onTimeout: { feedback: 'Под давлением «срочности» легко выдать код. Лучше прервать разговор.', next: 'lose' }
      }
    }
  },
  {
    id: 'demo_marketplace',
    title: 'Покупатель с маркетплейса',
    tagline: 'Просит «оформить доставку» по ссылке',
    difficulty: 'medium', icon: '📦',
    attacker: { name: 'Алексей · покупатель', status: 'в сети' },
    intro: 'Вы продаёте товар на онлайн-площадке. В личные сообщения пишет «покупатель».',
    timeLimit: 25, start: 's1',
    steps: {
      s1: {
        messages: [
          { text: 'Здравствуйте! Хочу купить ваш товар.', delay: 400 },
          { text: 'Я уже оплатил, оформляю доставку. Перейдите по ссылке и подтвердите получение средств: hxxps://kufar-pay.ru-secure[.]top/confirm', delay: 1300 }
        ],
        question: 'Реакция?',
        options: [
          { text: 'Перейду по ссылке и подтвержу.', safe: false, feedback: 'Это фишинг: домен поддельный, страница украдёт данные карты.', next: 'lose' },
          { text: 'Расчёты только внутри площадки. Ссылка не нужна.', safe: true, feedback: 'Верно: легитимные сделки идут через защищённую систему маркетплейса.', next: 's2' },
          { text: 'А почему ссылка такая странная?', safe: false, feedback: 'Не вступайте в диалог. Мошенник придумает оправдание и убедит вас.', next: 's2' }
        ],
        onTimeout: { feedback: 'Пока вы думали, мошенник сменил тактику.', next: 's2' }
      },
      s2: {
        messages: [
          { text: 'Это новая система площадки, всё официально.', delay: 700 },
          { text: 'Если не подтвердите за 10 минут — деньги вернутся мне, и сделка сорвётся.', delay: 1100 }
        ],
        question: 'Что делаете?',
        options: [
          { text: 'Хорошо, перейду по ссылке.', safe: false, feedback: 'Срочность — главный приём мошенника. Не поддавайтесь давлению.', next: 's3' },
          { text: 'Блокирую и сообщаю в поддержку площадки.', safe: true, feedback: 'Идеально: модераторы заблокируют аккаунт и предупредят других.', next: 'win' }
        ],
        onTimeout: { feedback: 'Чем дольше переписка — тем выше шанс ошибиться.', next: 'lose' }
      },
      s3: {
        messages:[
            {text: '13423'},
            {text: '13423'}
        ],
        question: '1',
        options: [
            {text: '12', safe: true, next: 'win'}
        ],
        onTimeout:{} 
      },
    }
  },
  {
    id: 'demo_friend',
    title: 'Сообщение «от друга»',
    tagline: 'Аккаунт знакомого просит срочно денег',
    difficulty: 'hard', icon: '👤',
    attacker: { name: 'Максим (взлом?)', status: 'в сети' },
    intro: 'Вам написал ваш знакомый Максим из соцсети. Стиль кажется немного непривычным.',
    timeLimit: 25, start: 's1',
    steps: {
      s1: {
        messages: [
          { text: 'Привет! Очень нужна помощь, выручишь?', delay: 400 },
          { text: 'Можешь скинуть 80 рублей на карту? Завтра отдам.', delay: 1100 }
        ],
        question: 'Ваш ответ?',
        options: [
          { text: 'Конечно, скидывай номер карты.', safe: false, feedback: 'Сначала убедитесь, что это действительно друг — аккаунты часто угоняют.', next: 'lose' },
          { text: 'Позвоню тебе, чтобы уточнить детали.', safe: true, feedback: 'Правильно: голос или видео — лучшая проверка личности.', next: 's2' },
          { text: 'Скинь фото с сегодняшней датой на бумажке.', safe: false, feedback: 'Слабая проверка: фото можно подделать, а звонок — почти нет.', next: 's2' }
        ],
        onTimeout: { feedback: 'Если друг действительно в беде — несколько секунд погоды не сделают, но проверка важнее.', next: 's2' }
      },
      s2: {
        messages: [{ text: 'Не могу говорить, я на совещании. Просто скинь, очень срочно!', delay: 900 }],
        question: 'Финал',
        options: [
          { text: 'Ладно, скидываю.', safe: false, feedback: 'Отказ от голосового подтверждения + срочность = почти 100% признак взлома.', next: 'lose' },
          { text: 'Без звонка денег не будет. Жду, как освободишься.', safe: true, feedback: 'Безопасно: настоящий друг поймёт, мошенник — отвяжется.', next: 'win' }
        ],
        onTimeout: { feedback: 'Срочность — приём давления. Не торопитесь с переводом.', next: 'lose' }
      }
    }
  }
];

/* =====================================================================
   ДВИЖОК ТРЕНАЖЁРА
   ===================================================================== */
(function () {
  'use strict';
  const root = document.getElementById('trainer');
  if (!root) return;

  const state = { scenario: null, stepId: null, timerId: null, timeLeft: 0, typingTimers: [], history: [], locked: false };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const clearAllTimers = () => { if (state.timerId) clearInterval(state.timerId); state.timerId = null; state.typingTimers.forEach(clearTimeout); state.typingTimers = []; };

  function renderMenu() {
    clearAllTimers();
    state.scenario = null; state.stepId = null; state.history = [];
    root.innerHTML = '';
    const wrap = el('div', 'tr_wrap');
    const head = el('div', 'tr_head');
    head.appendChild(el('span', 'tr_eyebrow', 'Тренажёр'));
    head.appendChild(el('h2', 'tr_title', 'Переписка с мошенником'));
    head.appendChild(el('p', 'tr_desc', 'Выберите сценарий и попробуйте распознать обман. На каждый ответ — ограниченное время. Ошибиться можно: после игры покажем разбор.'));
    wrap.appendChild(head);
    const list = el('div', 'tr_cards');
    SCENARIOS.forEach((sc) => {
      const card = el('button', 'tr_card'); card.type = 'button';
      const diff = sc.difficulty || 'easy';
      const diffLabel = { easy: 'Легко', medium: 'Средне', hard: 'Сложно' }[diff];
      card.innerHTML = `<div class="tr_card__top"><div class="tr_card__icon">${sc.icon||'⚠️'}</div><span class="tr_card__diff tr_card__diff--${diff}">${diffLabel}</span></div><h3 class="tr_card__title"></h3><p class="tr_card__sub"></p><div class="tr_card__cta"><span>Начать</span><span aria-hidden="true">→</span></div>`;
      card.querySelector('.tr_card__title').textContent = sc.title;
      card.querySelector('.tr_card__sub').textContent = sc.tagline || '';
      card.addEventListener('click', () => startScenario(sc));
      list.appendChild(card);
    });
    if (!list.children.length) list.appendChild(el('p', 'tr_empty', 'Сценарии ещё не подключены.'));
    wrap.appendChild(list);
    root.appendChild(wrap);
  }

  function startScenario(scenario) { state.scenario = scenario; state.stepId = scenario.start; state.history = []; renderChatShell(); runStep(scenario.start); }

  function renderChatShell() {
    root.innerHTML = '';
    const sc = state.scenario;
    const wrap = el('div', 'tr_chat');
    const head = el('div', 'tr_chat__head');
    head.innerHTML = `<button class="tr_chat__back" type="button" aria-label="Назад">←</button><div class="tr_chat__avatar">${sc.icon||'⚠️'}</div><div class="tr_chat__who"><div class="tr_chat__name"></div><div class="tr_chat__status"><span class="tr_chat__dot"></span><span class="tr_chat__status-text"></span></div></div><div class="tr_chat__timer" aria-label="Время на ответ"><svg viewBox="0 0 36 36" class="tr_ring"><circle class="tr_ring__bg" cx="18" cy="18" r="15.9155"/><circle class="tr_ring__fg" cx="18" cy="18" r="15.9155"/></svg><span class="tr_ring__num">--</span></div>`;
    head.querySelector('.tr_chat__name').textContent = sc.attacker?.name || 'Неизвестный';
    head.querySelector('.tr_chat__status-text').textContent = sc.attacker?.status || 'в сети';
    head.querySelector('.tr_chat__back').addEventListener('click', () => { if (confirm('Прервать тренировку и вернуться к выбору?')) renderMenu(); });
    wrap.appendChild(head);
    if (sc.intro) { const intro = el('div', 'tr_chat__intro'); intro.textContent = sc.intro; wrap.appendChild(intro); }
    const feed = el('div', 'tr_feed'); feed.id = 'tr_feed_w'; wrap.appendChild(feed);
    const panel = el('div', 'tr_panel'); panel.id = 'tr_panel_w'; wrap.appendChild(panel);
    root.appendChild(wrap);
  }

  function runStep(stepId) {
    state.stepId = stepId;
    const step = state.scenario.steps[stepId];
    if (!step) { return finish('win'); }
    state.locked = true; setOptionsBusy(true); setTimerVisible(false);
    let acc = 0;
    const typingDur = 700;
    const messages = step.messages || [];
    messages.forEach((msg, idx) => {
      const delay = msg.delay || 500; acc += delay;
      state.typingTimers.push(setTimeout(() => showTyping(true), Math.max(0, acc - typingDur)));
      state.typingTimers.push(setTimeout(() => { showTyping(false); appendBubble('them', msg.text); }, acc));
      if (idx === messages.length - 1) {
        state.typingTimers.push(setTimeout(() => { showTyping(false); renderOptions(step); startTimer(step); state.locked = false; }, acc + 250));
      }
    });
    if (!messages.length) { renderOptions(step); startTimer(step); state.locked = false; }
  }

  function appendBubble(side, text) {
    const feed = document.getElementById('tr_feed_w'); if (!feed) return;
    const b = el('div', `tr_msg tr_msg--${side}`);
    b.appendChild(el('div', 'tr_bubble')).textContent = text;
    feed.appendChild(b); feed.scrollTop = feed.scrollHeight;
  }
  function showTyping(show) {
    const feed = document.getElementById('tr_feed_w'); if (!feed) return;
    let t = feed.querySelector('.tr_typing');
    if (show) { if (!t) { t = el('div', 'tr_typing', '<span></span><span></span><span></span>'); feed.appendChild(t); } feed.scrollTop = feed.scrollHeight; }
    else if (t) { t.remove(); }
  }
  function renderOptions(step) {
    const panel = document.getElementById('tr_panel_w'); panel.innerHTML = '';
    if (step.question) { const q = el('div', 'tr_panel__q'); q.textContent = step.question; panel.appendChild(q); }
    const list = el('div', 'tr_panel__list');
    (step.options || []).forEach((opt, idx) => { const btn = el('button', 'tr_opt'); btn.type = 'button'; btn.textContent = opt.text; btn.addEventListener('click', () => choose(idx)); list.appendChild(btn); });
    panel.appendChild(list); setOptionsBusy(false);
  }
  function setOptionsBusy(busy) {
    const panel = document.getElementById('tr_panel_w'); if (!panel) return;
    panel.classList.toggle('is-busy', busy); panel.querySelectorAll('.tr_opt').forEach((b) => (b.disabled = busy));
  }
  function choose(idx) {
    if (state.locked) return; state.locked = true; stopTimer();
    const step = state.scenario.steps[state.stepId]; const opt = step.options[idx];
    appendBubble('me', opt.text);
    state.history.push({ stepId: state.stepId, optionIndex: idx, optionText: opt.text, safe: !!opt.safe, feedback: opt.feedback || '', timedOut: false });
    proceed(opt.next);
  }
  function startTimer(step) {
    const limit = state.scenario.timeLimit || 25; state.timeLeft = limit;
    setTimerVisible(true); updateTimerUI(limit, limit);
    state.timerId = setInterval(() => { state.timeLeft -= 1; updateTimerUI(state.timeLeft, limit); if (state.timeLeft <= 0) { stopTimer(); handleTimeout(step); } }, 1000);
  }
  function stopTimer() { if (state.timerId) clearInterval(state.timerId); state.timerId = null; }
  function setTimerVisible(v) { const t = root.querySelector('.tr_chat__timer'); if (t) t.style.visibility = v ? 'visible' : 'hidden'; }
  function updateTimerUI(left, total) {
    const ring = root.querySelector('.tr_ring__fg'); const num = root.querySelector('.tr_ring__num'); if (!ring || !num) return;
    const pct = Math.max(0, Math.min(1, left / total));
    ring.style.strokeDasharray = `${pct * 100}, 100`; num.textContent = String(Math.max(0, left));
    const timer = root.querySelector('.tr_chat__timer');
    timer.classList.toggle('is-warn', left <= Math.ceil(total * 0.4) && left > Math.ceil(total * 0.2));
    timer.classList.toggle('is-danger', left <= Math.ceil(total * 0.2));
  }
  function handleTimeout(step) {
    state.locked = true; setOptionsBusy(true); appendBubble('me', '⌛ (вы не успели ответить)');
    const t = step.onTimeout || { feedback: 'Время вышло.', next: 'lose' };
    state.history.push({ stepId: state.stepId, optionIndex: -1, optionText: 'Не успел(а) ответить', safe: false, feedback: t.feedback, timedOut: true });
    proceed(t.next);
  }
  function proceed(nextId) { if (nextId === 'win' || nextId === 'lose') { setTimeout(() => finish(nextId), 600); return; } setTimeout(() => runStep(nextId), 700); }

  function finish(outcome) {
    clearAllTimers(); const sc = state.scenario;
    const safeCount = state.history.filter((h) => h.safe).length; const total = state.history.length;
    root.innerHTML = '';
    const wrap = el('div', 'tr_result'); const isWin = outcome === 'win';
    wrap.classList.toggle('tr_result--win', isWin); wrap.classList.toggle('tr_result--lose', !isWin);
    const head = el('div', 'tr_result__head');
    head.innerHTML = `<div class="tr_result__icon">${isWin ? '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 2C13.0826 2 10.2847 3.15893 8.22184 5.22183C6.15894 7.28473 5.00001 10.0826 5.00001 13V29C4.9992 29.1519 5.03299 29.302 5.09883 29.4389C5.16468 29.5757 5.26084 29.6958 5.38001 29.79C5.5002 29.8835 5.64015 29.9483 5.78919 29.9795C5.93823 30.0107 6.09242 30.0075 6.24001 29.97L15 27.77V24C15 23.7348 15.1054 23.4804 15.2929 23.2929C15.4804 23.1054 15.7348 23 16 23C16.2652 23 16.5196 23.1054 16.7071 23.2929C16.8947 23.4804 17 23.7348 17 24V27.81L25.76 30C25.8397 30.0096 25.9203 30.0096 26 30C26.2652 30 26.5196 29.8946 26.7071 29.7071C26.8947 29.5196 27 29.2652 27 29V13C27 10.0826 25.8411 7.28473 23.7782 5.22183C21.7153 3.15893 18.9174 2 16 2Z" fill="#FBC02D"></path> <path d="M5.00001 13V29C4.9992 29.1519 5.03299 29.302 5.09883 29.4389C5.16468 29.5757 5.26084 29.6958 5.38001 29.79C5.5002 29.8835 5.64015 29.9483 5.78919 29.9795C5.93823 30.0107 6.09242 30.0075 6.24001 29.97L15 27.8V24C14.9994 23.7465 15.0951 23.5022 15.2677 23.3165C15.4404 23.1309 15.6771 23.0177 15.93 23V2C13.0248 2.01849 10.2448 3.18557 8.19705 5.24647C6.14927 7.30737 4.99996 10.0947 5.00001 13Z" fill="#FDD835"></path> <path d="M22.87 10.92C22.812 10.7422 22.7054 10.5843 22.5623 10.4641C22.4191 10.3439 22.2451 10.2663 22.06 10.24L18.46 9.70997L16.85 6.44997C16.7681 6.2809 16.6403 6.13832 16.4811 6.03855C16.3219 5.93878 16.1379 5.88586 15.95 5.88586C15.7621 5.88586 15.5781 5.93878 15.4189 6.03855C15.2597 6.13832 15.1319 6.2809 15.05 6.44997L13.44 9.70997L9.84 10.24C9.65686 10.2682 9.48516 10.3468 9.34409 10.467C9.20301 10.5871 9.09809 10.7441 9.04105 10.9205C8.984 11.0968 8.97708 11.2855 9.02104 11.4655C9.065 11.6455 9.15812 11.8098 9.29 11.94L11.89 14.48L11.28 18.07C11.2432 18.2565 11.2604 18.4496 11.3295 18.6267C11.3985 18.8038 11.5167 18.9576 11.67 19.07C11.8213 19.1816 12.001 19.2483 12.1885 19.2625C12.376 19.2766 12.5637 19.2376 12.73 19.15L16 17.43L19.22 19.13C19.3668 19.2004 19.5272 19.2379 19.69 19.24C19.8984 19.2386 20.1012 19.1722 20.27 19.05C20.4252 18.9388 20.5453 18.7856 20.6161 18.6084C20.687 18.4312 20.7057 18.2375 20.67 18.05L20 14.48L22.6 11.94C22.7356 11.812 22.8328 11.6487 22.8805 11.4685C22.9282 11.2882 22.9246 11.0983 22.87 10.92Z" fill="#C2185B"></path> <path d="M15.05 6.44995L13.44 9.70995L9.84002 10.23C9.65375 10.2571 9.47892 10.3362 9.33562 10.4583C9.19233 10.5803 9.0864 10.7404 9.03002 10.92C8.9782 11.0945 8.97504 11.2799 9.02086 11.4561C9.06668 11.6324 9.15974 11.7927 9.29002 11.92L11.89 14.46L11.28 18.05C11.2495 18.2334 11.2708 18.4217 11.3415 18.5938C11.4121 18.7658 11.5293 18.9147 11.68 19.0238C11.8306 19.1329 12.0087 19.1978 12.1942 19.2113C12.3797 19.2247 12.5652 19.1862 12.73 19.1L16 17.43V5.93995C15.8095 5.92531 15.6188 5.96556 15.4504 6.05595C15.282 6.14633 15.1431 6.28306 15.05 6.44995Z" fill="#EC407A"></path> <path d="M16 2C13.0826 2 10.2847 3.15893 8.22184 5.22183C6.15894 7.28473 5.00001 10.0826 5.00001 13V29C4.9992 29.1519 5.03299 29.302 5.09883 29.4389C5.16468 29.5757 5.26084 29.6958 5.38001 29.79C5.5002 29.8835 5.64015 29.9483 5.78919 29.9795C5.93823 30.0107 6.09242 30.0075 6.24001 29.97L16 27.53L25.76 30C25.8397 30.0096 25.9203 30.0096 26 30C26.2652 30 26.5196 29.8946 26.7071 29.7071C26.8947 29.5196 27 29.2652 27 29V13C27 10.0826 25.8411 7.28473 23.7782 5.22183C21.7153 3.15893 18.9174 2 16 2ZM16 4C17.78 4 19.5201 4.52784 21.0001 5.51677C22.4802 6.50571 23.6337 7.91131 24.3149 9.55585C24.9961 11.2004 25.1744 13.01 24.8271 14.7558C24.4798 16.5016 23.6226 18.1053 22.364 19.364C21.1053 20.6226 19.5017 21.4798 17.7558 21.8271C16.01 22.1743 14.2004 21.9961 12.5559 21.3149C10.9113 20.6337 9.50572 19.4802 8.51679 18.0001C7.52786 16.5201 7.00001 14.78 7.00001 13C7.00001 10.6131 7.94823 8.32387 9.63605 6.63604C11.3239 4.94821 13.6131 4 16 4ZM7.00001 27.71V19.28C7.91568 20.5897 9.10571 21.6841 10.4873 22.4871C11.8689 23.2902 13.4088 23.7825 15 23.93V25.71L7.00001 27.71ZM25 27.71L17 25.71V23.91C18.5912 23.7625 20.1312 23.2702 21.5127 22.4671C22.8943 21.6641 24.0843 20.5697 25 19.26V27.71Z" fill="#263238"></path> </g></svg>' : '<svg viewBox="0 0 64.00 64.00" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" stroke="#000000" stroke-width="0.00064" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.512"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#B4E6DD;} .st1{fill:#80D4C4;} .st2{fill:#D2F0EA;} .st3{fill:#FFFFFF;} .st4{fill:#FBD872;} .st5{fill:#DB7767;} .st6{fill:#F38E7A;} .st7{fill:#F6AF62;} .st8{fill:#32A48E;} .st9{fill:#A38FD8;} .st10{fill:#7C64BD;} .st11{fill:#EAA157;} .st12{fill:#9681CF;} .st13{fill:#F9C46A;} .st14{fill:#CE6B61;} </style> <g> <path class="st0" d="M48.7,13.36l-15.73-5.2c-0.63-0.21-1.31-0.21-1.93,0l-15.73,5.2c-1.26,0.42-2.11,1.6-2.11,2.92v19.6 c0,4.1,1.89,7.98,5.12,10.51l11.16,8.73c1.49,1.16,3.57,1.16,5.06,0l11.16-8.73c3.23-2.53,5.12-6.41,5.12-10.51v-19.6 C50.81,14.96,49.96,13.78,48.7,13.36z"></path> <path class="st2" d="M32,52c-0.04,0-0.06-0.02-0.07-0.02l-11.16-8.73c-2.28-1.78-3.58-4.47-3.58-7.36V16.95L32,12.05l14.81,4.9 v18.94c0,2.89-1.31,5.58-3.58,7.36l-11.16,8.74L32,52z"></path> <circle class="st6" cx="32" cy="29.65" r="11.71"></circle> <g> <path class="st3" d="M31.21,34.47c0.25-0.06,0.51-0.11,0.78-0.11c0.29,0,0.56,0.05,0.82,0.12l1.19-10.67 c0.05-0.52,0.07-0.93,0.07-1.22c0-0.91-0.2-1.6-0.59-2.06c-0.4-0.46-0.88-0.69-1.45-0.69c-0.57,0-1.06,0.23-1.47,0.69 c-0.41,0.46-0.61,1.08-0.61,1.84c0,0.32,0.04,0.8,0.11,1.44L31.21,34.47z"></path> <path class="st3" d="M31.98,35.42c-0.56,0-1.04,0.2-1.43,0.59c-0.4,0.4-0.59,0.87-0.59,1.41c0,0.56,0.2,1.04,0.59,1.43 c0.4,0.4,0.87,0.59,1.43,0.59s1.04-0.2,1.43-0.59c0.4-0.4,0.59-0.87,0.59-1.43c0-0.55-0.2-1.02-0.59-1.41 C33.02,35.62,32.54,35.42,31.98,35.42z"></path> </g> </g> </g></svg>'}</div><h2 class="tr_result__title"></h2><p class="tr_result__sub"></p><div class="tr_result__score"><span class="tr_result__score-num">${safeCount}/${total}</span><span class="tr_result__score-label">правильных решений</span></div>`;
    head.querySelector('.tr_result__title').textContent = isWin ? 'Отлично, вы распознали угрозу!' : 'Вы проиграли, но это всего лишь тренировка';
    head.querySelector('.tr_result__sub').textContent = isWin ? 'Отличная работа! Вы распознали угрозу и приняли правильные решения.' : 'Не расстраивайтесь — разбор ниже поможет запомнить правильную тактику.';
    wrap.appendChild(head);
    const log = el('div', 'tr_result__log'); log.appendChild(el('h3', 'tr_result__log-title', 'Разбор ситуации'));
    state.history.forEach((h, i) => {
      const item = el('div', `tr_log ${h.safe ? 'tr_log--ok' : 'tr_log--bad'}`);
      const mark = h.timedOut ? '⌛' : (h.safe ? '✓' : '✗');
      item.innerHTML = `<div class="tr_log__mark">${mark}</div><div class="tr_log__body"><div class="tr_log__answer"></div><div class="tr_log__fb"></div></div>`;
      item.querySelector('.tr_log__answer').textContent = `${i + 1}. ${h.optionText}`;
      item.querySelector('.tr_log__fb').textContent = h.feedback;
      log.appendChild(item);
    });
    wrap.appendChild(log);
    const actions = el('div', 'tr_result__actions');
    const retry = el('button', 'tr_btn tr_btn--primary', 'Повторить'); retry.type = 'button'; retry.addEventListener('click', () => startScenario(sc));
    const back = el('button', 'tr_btn', 'Все сценарии'); back.type = 'button'; back.addEventListener('click', renderMenu);
    actions.appendChild(retry); actions.appendChild(back); wrap.appendChild(actions);
    root.appendChild(wrap);
  }

  // Запуск
  if (document.readyState !== 'loading') renderMenu();
  else document.addEventListener('DOMContentLoaded', renderMenu);
})();