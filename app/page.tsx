"use client";

import { useEffect, useRef, useState } from "react";

const TELEGRAM_MINI_APP_URL = "https://t.me/nogti000bot?startapp=landing";
const TELEGRAM_BOT_URL = "https://t.me/nogti000bot";

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [galleryActive, setGalleryActive] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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
    const canParallax = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hero || !canParallax || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = (event?: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = event ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
        const py = event ? (event.clientY - rect.top) / rect.height - 0.5 : 0;
        hero.style.setProperty("--hero-x", `${px * 10}px`);
        hero.style.setProperty("--hero-y", `${py * 8}px`);
        hero.style.setProperty("--phone-x", `${px * -16}px`);
        hero.style.setProperty("--phone-y", `${py * -12}px`);
      });
    };

    const onPointerMove = (event: PointerEvent) => update(event);
    const onPointerLeave = () => update();
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || !("IntersectionObserver" in window)) {
      setGalleryActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setGalleryActive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!galleryActive || galleryPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => moveGallery(1), 4200);
    return () => window.clearInterval(timer);
  }, [galleryActive, galleryPaused]);

  const moveGallery = (direction: -1 | 1) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const card = gallery.querySelector<HTMLElement>(".work-card");
    const step = (card?.offsetWidth ?? 320) + 18;
    const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - step / 2;
    const atStart = gallery.scrollLeft <= step / 2;
    const left = direction === 1 && atEnd ? 0 : direction === -1 && atStart ? gallery.scrollWidth : gallery.scrollLeft + step * direction;
    gallery.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="NAILÉ — на главную">
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
          <a href="#services" onClick={() => setMenuOpen(false)}>Услуги</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Работы</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>О мастере</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Отзывы</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
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
            Маникюр,
            <em>который говорит</em>
            за вас
          </h1>
          <p className="hero-lead">
            Естественная форма, безупречное покрытие и внимание к деталям —
            без спешки и лишнего.
          </p>
          <div className="hero-actions">
            <a className="button" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">
              Выбрать время <Arrow />
            </a>
            <a className="text-link" href="#portfolio">Посмотреть работы <Arrow /></a>
          </div>
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
          <div className="gallery-controls">
            <button type="button" onClick={() => moveGallery(-1)} aria-label="Предыдущие работы"><Arrow direction="left" /></button>
            <button type="button" onClick={() => moveGallery(1)} aria-label="Следующие работы"><Arrow /></button>
          </div>
        </div>

        <div
          className="work-scroll"
          ref={galleryRef}
          onPointerEnter={() => setGalleryPaused(true)}
          onPointerLeave={() => setGalleryPaused(false)}
          onFocus={() => setGalleryPaused(true)}
          onBlur={() => setGalleryPaused(false)}
          data-reveal
        >
          {works.map(([src, title], index) => (
            <figure className="work-card" key={src}>
              <div className="work-image"><img src={src} alt={title} loading={index > 1 ? "lazy" : "eager"} /></div>
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
        <a className="brand footer-brand" href="#top">
          <span>NAILÉ</span>
          <small>маникюр с характером</small>
        </a>
        <p>Тихая эстетика. Точная работа. Ваши руки — только лучше.</p>
        <div className="footer-links">
          <a href="#services">Услуги</a>
          <a href="#portfolio">Портфолио</a>
          <a href="#faq">FAQ</a>
          <a className="footer-booking-link" href={TELEGRAM_MINI_APP_URL} target="_blank" rel="noopener noreferrer">Записаться <Arrow /></a>
        </div>
        <small>© 2026 NAILÉ. Все права защищены.</small>
      </footer>
    </main>
  );
}
