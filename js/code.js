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
const SCENARIOS = [
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
          { text: 'Хорошо, перейду по ссылке.', safe: false, feedback: 'Срочность — главный приём мошенника. Не поддавайтесь давлению.', next: 'lose' },
          { text: 'Блокирую и сообщаю в поддержку площадки.', safe: true, feedback: 'Идеально: модераторы заблокируют аккаунт и предупредят других.', next: 'win' }
        ],
        onTimeout: { feedback: 'Чем дольше переписка — тем выше шанс ошибиться.', next: 'lose' }
      }
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
    head.innerHTML = `<div class="tr_result__icon">${isWin ? '🛡️' : '⚠️'}</div><h2 class="tr_result__title"></h2><p class="tr_result__sub"></p><div class="tr_result__score"><span class="tr_result__score-num">${safeCount}/${total}</span><span class="tr_result__score-label">правильных решений</span></div>`;
    head.querySelector('.tr_result__title').textContent = isWin ? '🎉 Вы устояли!' : '😟 Мошенник победил';
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