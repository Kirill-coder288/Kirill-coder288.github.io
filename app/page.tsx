"use client";

import { useEffect, useRef, useState } from "react";

const TELEGRAM_MINI_APP_URL = "https://t.me/nogti000bot?startapp=landing";
const TELEGRAM_BOT_URL = "https://t.me/nogti000bot";

type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

const services = [
  {
    number: "01",
    title: "Маникюр + покрытие",
    text: "Снятие, бережная обработка, укрепление и покрытие в один тон.",
    time: "1 ч 45 мин",
    price: "2 500 ₽",
  },
  {
    number: "02",
    title: "Маникюр без покрытия",
    text: "Чистая обработка, полировка и уход для естественных ногтей.",
    time: "1 час",
    price: "1 500 ₽",
  },
  {
    number: "03",
    title: "Укрепление гелем",
    text: "Тонкая архитектура и прочность без лишней толщины.",
    time: "+ 25 мин",
    price: "+ 600 ₽",
  },
  {
    number: "04",
    title: "Деликатный дизайн",
    text: "Френч, втирка, точки или минималистичные акценты.",
    time: "+ 15–30 мин",
    price: "от 200 ₽",
  },
];

const works = [
  ["/images/work-1-v2.webp", "Молочный нюд"],
  ["/images/work-2-v2.webp", "Микро-френч"],
  ["/images/work-3-v2.webp", "Полупрозрачный розовый"],
  ["/images/work-4-v2.webp", "Приглушённая роза"],
  ["/images/work-5-v2.webp", "Жемчужный акцент"],
  ["/images/work-6-v2.webp", "Тёплый хром"],
];

const reviews = [
  {
    name: "Мария",
    text: "Наконец нашла мастера, после которого покрытие выглядит тонко и носится без сколов. Идеальная форма.",
  },
  {
    name: "Екатерина",
    text: "Очень спокойно, чисто и без конвейера. Анна слышит пожелания и всегда предлагает оттенок в точку.",
  },
  {
    name: "Анастасия",
    text: "Хожу уже второй год. Ногти стали крепче, а маникюр выглядит аккуратно даже через три недели.",
  },
];

const faqs = [
  {
    q: "Как подготовиться к процедуре?",
    a: "Ничего специального делать не нужно. Не снимайте покрытие самостоятельно и не обрезайте кутикулу за 2–3 дня до визита — остальное я сделаю бережно на процедуре.",
  },
  {
    q: "Сколько держится покрытие?",
    a: "В среднем 3–4 недели. Срок зависит от скорости роста ногтей и нагрузки на руки. Я подбираю материал под ваши ногти, а не работаю одной схемой для всех.",
  },
  {
    q: "Какие материалы вы используете?",
    a: "Только профессиональные базы, гели и покрытия проверенных брендов. Все инструменты проходят полный цикл дезинфекции и стерилизации.",
  },
  {
    q: "Можно перенести или отменить запись?",
    a: "Да. Пожалуйста, предупредите не позднее чем за 24 часа — так я смогу предложить время другому клиенту и подобрать для вас новое окно.",
  },
];

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "left" ? "←" : "→"}</span>;
}

function setSceneMotion(root: HTMLElement, x: number, y: number) {
  root.style.setProperty("--scene-x", `${x}px`);
  root.style.setProperty("--scene-y", `${y}px`);
  root.style.setProperty("--scene-x-inverse", `${-x}px`);
  root.style.setProperty("--scene-y-inverse", `${-y}px`);
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [motionPermission, setMotionPermission] = useState<"unsupported" | "prompt" | "enabled" | "denied">("unsupported");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!hero || !finePointer.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let bounds: DOMRect | null = null;

    const reset = () => {
      cancelAnimationFrame(frame);
      hero.classList.remove("is-interacting");
      hero.style.setProperty("--hero-x", "0px");
      hero.style.setProperty("--hero-y", "0px");
      hero.style.setProperty("--phone-x", "0px");
      hero.style.setProperty("--phone-y", "0px");
      bounds = null;
    };

    const onPointerEnter = () => {
      bounds = hero.getBoundingClientRect();
      hero.classList.add("is-interacting");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!bounds) bounds = hero.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--hero-x", `${px * 10}px`);
        hero.style.setProperty("--hero-y", `${py * 7}px`);
        hero.style.setProperty("--phone-x", `${px * -14}px`);
        hero.style.setProperty("--phone-y", `${py * -10}px`);
      });
    };

    hero.addEventListener("pointerenter", onPointerEnter);
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointerenter", onPointerEnter);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (!coarsePointer || !("DeviceOrientationEvent" in window)) return;

    const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor;
    const frame = requestAnimationFrame(() => {
      setMotionPermission(typeof OrientationEvent.requestPermission === "function" ? "prompt" : "enabled");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      setSceneMotion(root, 0, 0);
    };
    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSceneMotion(root, x, y));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    return () => {
      reset();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || motionPermission !== "enabled" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let frame = 0;
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;
    let heroVisible = true;

    const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      baseBeta ??= event.beta;
      baseGamma ??= event.gamma;
      const x = clamp(event.gamma - baseGamma, 18) / 18;
      const y = clamp(event.beta - baseBeta, 18) / 18;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSceneMotion(root, x * 13, y * 9);
        if (heroVisible) {
          hero.style.setProperty("--hero-x", `${x * 8}px`);
          hero.style.setProperty("--hero-y", `${y * 6}px`);
          hero.style.setProperty("--phone-x", `${x * -11}px`);
          hero.style.setProperty("--phone-y", `${y * -8}px`);
        }
      });
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) {
          cancelAnimationFrame(frame);
          hero.style.setProperty("--hero-x", "0px");
          hero.style.setProperty("--hero-y", "0px");
          hero.style.setProperty("--phone-x", "0px");
          hero.style.setProperty("--phone-y", "0px");
        }
      },
      { threshold: 0.05 },
    );

    hero.classList.add("is-motion-active");
    root.classList.add("device-motion-active");
    visibilityObserver.observe(hero);
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero.classList.remove("is-motion-active");
      root.classList.remove("device-motion-active");
      setSceneMotion(root, 0, 0);
      visibilityObserver.disconnect();
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [motionPermission]);

  const enableDeviceMotion = async () => {
    const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor | undefined;
    if (!OrientationEvent) return;

    try {
      const permission = typeof OrientationEvent.requestPermission === "function"
        ? await OrientationEvent.requestPermission()
        : "granted";
      setMotionPermission(permission === "granted" ? "enabled" : "denied");
    } catch {
      setMotionPermission("denied");
    }
  };

  const jumpToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;

    const header = document.querySelector<HTMLElement>(".site-header");
    const offset = (header?.offsetHeight ?? 0) + 14;
    const top = Math.max(0, Math.round(window.scrollY + target.getBoundingClientRect().top - offset));

    setMenuOpen(false);
    window.history.replaceState(null, "", `#${sectionId}`);
    window.scrollTo(0, top);
  };

  return (
    <main>
      <header className="site-header" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="NAILÉ — на главную" onClick={(event) => jumpToSection(event, "top")}>
          <span>NAILÉ</span>
          <small>маникюр с характером</small>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav id="main-navigation" className={menuOpen ? "nav is-open" : "nav"}>
          <a href="#services" onClick={(event) => jumpToSection(event, "services")}>Услуги</a>
          <a href="#portfolio" onClick={(event) => jumpToSection(event, "portfolio")}>Работы</a>
          <a href="#about" onClick={(event) => jumpToSection(event, "about")}>О мастере</a>
          <a href="#reviews" onClick={(event) => jumpToSection(event, "reviews")}>Отзывы</a>
          <a href="#faq" onClick={(event) => jumpToSection(event, "faq")}>FAQ</a>
        </nav>

        <a
          className="button button-small header-cta"
          href={TELEGRAM_MINI_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Записаться
        </a>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />

        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Тонкая работа · спокойная атмосфера</p>
          <h1>
            <span className="headline-line">Маникюр,</span>
            <em className="headline-line">который говорит</em>
            <span className="headline-line">за вас</span>
          </h1>
          <p className="hero-lead">
            Естественная форма, безупречное покрытие и внимание к деталям —
            без спешки и лишнего.
          </p>
          <div className="hero-actions">
            <a className="button" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">
              Выбрать время <Arrow />
            </a>
            <a className="text-link" href="#portfolio" onClick={(event) => jumpToSection(event, "portfolio")}>Посмотреть работы <Arrow /></a>
          </div>
          {motionPermission === "prompt" && (
            <button className="motion-permission" type="button" onClick={enableDeviceMotion}>
              <span className="motion-permission-icon" aria-hidden="true">↻</span>
              <span className="motion-permission-copy">
                <strong>Включить эффект движения</strong>
                <small>Наклоняйте телефон — детали будут двигаться за вами</small>
              </span>
            </button>
          )}
          {motionPermission === "enabled" && (
            <p className="motion-active-status" role="status">
              <span aria-hidden="true">●</span> Движение включено — попробуйте наклонить телефон
            </p>
          )}
          {motionPermission === "denied" && (
            <p className="motion-denied" role="status">Доступ к движению отключён в настройках браузера.</p>
          )}
          <div className="social-proof" aria-label="Рейтинг мастера 5 из 5">
            <div className="avatar-stack" aria-hidden="true">
              <span>М</span><span>Е</span><span>А</span>
            </div>
            <div>
              <b>5.0 <span className="stars">★★★★★</span></b>
              <small>более 200 довольных клиентов</small>
            </div>
          </div>
        </div>

        <div className="hero-visual" data-reveal style={{ "--delay": "140ms" } as React.CSSProperties}>
          <div className="photo-shell">
            <img className="hero-photo" src="/images/hero.webp" alt="Нежный нюдовый маникюр" fetchPriority="high" />
            <span className="photo-caption">soft nude · 2026</span>
          </div>
          <div className="phone" aria-label="Пример мобильной записи">
            <div className="phone-top"><span>9:41</span><i /></div>
            <div className="phone-screen">
              <div className="phone-mark">N</div>
              <small>онлайн-запись</small>
              <strong>Ваш идеальный<br />маникюр — здесь</strong>
              <div className="mini-slot">
                <span>Ближайшее окно</span>
                <b>Сегодня, 17:30</b>
              </div>
              <a className="phone-booking-link" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">Выбрать время</a>
              <div className="phone-note">Запись откроется в Telegram</div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Преимущества">
        <div><span>01</span><b>Стерильно</b><small>трёхэтапная обработка</small></div>
        <div><span>02</span><b>Бережно</b><small>без боли и перепила</small></div>
        <div><span>03</span><b>Индивидуально</b><small>форма под ваши руки</small></div>
        <div><span>04</span><b>Спокойно</b><small>только вы и мастер</small></div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">Услуги</p>
            <h2>Всё необходимое.<br /><em>Ничего лишнего.</em></h2>
          </div>
          <p>Стоимость фиксируется до начала процедуры. Снятие моего покрытия входит в цену.</p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article
              className="service-card"
              key={service.title}
              data-reveal
              style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="service-meta">
                <small>{service.time}</small>
                <strong>{service.price}</strong>
              </div>
              <a
                className="service-booking-link"
                href={TELEGRAM_MINI_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Записаться в Telegram: ${service.title}`}
              >
                <Arrow />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section portfolio" id="portfolio">
        <div className="section-heading portfolio-heading" data-reveal>
          <div>
            <p className="eyebrow">Портфолио</p>
            <h2>Маникюр, который<br /><em>хочется рассматривать</em></h2>
          </div>
        </div>

        <div className="work-grid" data-reveal>
          {works.map(([src, title], index) => (
            <figure className="work-card" key={src}>
              <div className="work-image">
                <img src={src} alt={title} width="900" height="1200" loading={index > 1 ? "lazy" : "eager"} decoding="async" />
              </div>
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section about" id="about">
        <div className="about-photo" data-reveal>
          <img src="/images/master.webp" alt="Мастер маникюра Анна в светлой студии" loading="lazy" />
          <span>Анна · мастер и основатель</span>
        </div>
        <div className="about-copy" data-reveal style={{ "--delay": "100ms" } as React.CSSProperties}>
          <p className="eyebrow">О мастере</p>
          <h2>Красота начинается<br /><em>с ощущения заботы</em></h2>
          <p>
            Я Анна, сертифицированный мастер маникюра. Уже 6 лет создаю
            аккуратные, ноские покрытия и помогаю клиентам полюбить свои руки.
          </p>
          <p>
            Работаю без спешки: сначала обсуждаем привычки и пожелания, затем
            выбираем форму, оттенок и материал именно под вас.
          </p>
          <div className="about-stats">
            <div><b>6+</b><span>лет опыта</span></div>
            <div><b>500+</b><span>клиентов</span></div>
            <div><b>30+</b><span>обучений</span></div>
          </div>
        </div>
      </section>

      <section className="section reviews" id="reviews">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">Отзывы</p>
            <h2>Возвращаются<br /><em>не только за маникюром</em></h2>
          </div>
          <p>Небольшая выборка слов, которыми клиенты делятся после визита.</p>
        </div>
        <div className="review-grid">
          {reviews.map((review, index) => (
            <article className="review-card" key={review.name} data-reveal style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
              <div className="review-top"><span className="stars">★★★★★</span><small>5.0</small></div>
              <p>«{review.text}»</p>
              <div className="review-author"><span>{review.name[0]}</span><b>{review.name}</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="faq-intro" data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2>Частые<br /><em>вопросы</em></h2>
          <p>Если не нашли ответ, задайте вопрос при записи — я всё подскажу.</p>
        </div>
        <div className="faq-list" data-reveal style={{ "--delay": "100ms" } as React.CSSProperties}>
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <article className={isOpen ? "faq-item is-open" : "faq-item"} key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{item.q}</span><i aria-hidden="true">+</i>
                  </button>
                </h3>
                <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="booking" id="booking">
        <div className="booking-copy" data-reveal>
          <p className="eyebrow">Запись в Telegram</p>
          <h2>Готовы к маникюру,<br /><em>который подходит вам?</em></h2>
          <p>Выберите услугу и удобное время в Mini App. Подтверждение записи придёт прямо в Telegram.</p>
          <div className="booking-note"><span>✓</span> Быстро, удобно и без звонков</div>
        </div>

        <div className="telegram-booking-card" data-reveal style={{ "--delay": "120ms" } as React.CSSProperties}>
          <span className="telegram-booking-mark" aria-hidden="true">↗</span>
          <p className="eyebrow">Telegram Mini App</p>
          <h3>Свободные окна уже внутри</h3>
          <p>Откройте приложение, выберите услугу, дату и удобное время — всё займёт пару минут.</p>
          <a className="button" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">
            Открыть запись <Arrow />
          </a>
          <a className="text-link telegram-fallback" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
            Если приложение не открылось — написать боту <Arrow />
          </a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" onClick={(event) => jumpToSection(event, "top")}>
          <span>NAILÉ</span>
          <small>маникюр с характером</small>
        </a>
        <p>Тихая эстетика. Точная работа. Ваши руки — только лучше.</p>
        <div className="footer-links">
          <a href="#services" onClick={(event) => jumpToSection(event, "services")}>Услуги</a>
          <a href="#portfolio" onClick={(event) => jumpToSection(event, "portfolio")}>Портфолио</a>
          <a href="#faq" onClick={(event) => jumpToSection(event, "faq")}>FAQ</a>
          <a className="footer-booking-link" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">Записаться <Arrow /></a>
        </div>
        <small>© 2026 NAILÉ. Все права защищены.</small>
      </footer>
    </main>
  );
}
