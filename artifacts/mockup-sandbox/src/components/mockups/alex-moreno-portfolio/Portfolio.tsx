import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Dribbble,
  Linkedin,
  Mail,
  Menu,
  Moon,
  MoveUpRight,
  Send,
  Smartphone,
  Sun,
  X,
  Zap,
} from "lucide-react";

type Project = {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  kind: string;
  year: string;
  image: string;
  imageAlt: string;
  color: string;
  size: "wide" | "tall" | "standard";
  intro: string;
  challenge: string;
  approach: string;
  outcome: string;
  services: string[];
};

const projects: Project[] = [
  {
    id: "norte",
    number: "01",
    title: "Norte, sin fricción",
    client: "Norte · fintech",
    category: "Producto digital",
    kind: "Producto digital",
    year: "2024",
    image: "/__mockup/images/alex-fintech.jpg",
    imageAlt: "Paneles de interfaz financiera en azul y lila sobre papel claro",
    color: "blue",
    size: "wide",
    intro:
      "Una experiencia financiera más clara para quienes quieren hacer crecer su dinero sin necesitar un manual.",
    challenge:
      "Norte tenía una herramienta sólida, pero una experiencia que hacía complejo algo que debería sentirse sencillo: entender el propio dinero.",
    approach:
      "Reorganicé la arquitectura de información, reduje pasos en tareas clave y diseñé un sistema visual modular con estados que explican, no interrumpen.",
    outcome:
      "El nuevo flujo de inversión se completó un 34% más rápido en las pruebas de producto. El sistema salió a producción en cuatro meses.",
    services: ["Estrategia UX", "Product design", "Motion"],
  },
  {
    id: "sonora",
    number: "02",
    title: "Escuchar distinto",
    client: "Sonora · cultura",
    category: "Identidad & digital",
    kind: "Identidad & digital",
    year: "2023",
    image: "/__mockup/images/alex-sonora.jpg",
    imageAlt: "Composición editorial de un disco verde ácido y formas índigo",
    color: "lime",
    size: "tall",
    intro:
      "Una plataforma para descubrir música nueva sin caer en la misma lista, una y otra vez.",
    challenge:
      "Las plataformas se habían vuelto expertas en repetir lo que ya conocíamos. Sonora quería recuperar el placer de perderse un poco.",
    approach:
      "Diseñé una dirección de arte expresiva, una navegación editorial y transiciones que hacen visible el carácter de cada descubrimiento.",
    outcome:
      "Una marca digital con personalidad propia y un prototipo de descubrimiento validado con una comunidad de oyentes independientes.",
    services: ["Dirección de arte", "UX/UI", "Motion"],
  },
  {
    id: "barrio",
    number: "03",
    title: "La ciudad a pie",
    client: "Barrio Abierto · cultura",
    category: "Producto digital",
    kind: "Producto digital",
    year: "2023",
    image: "/__mockup/images/alex-ciudad.jpg",
    imageAlt: "Modelo arquitectónico terracota junto a una interfaz de mapas",
    color: "terra",
    size: "standard",
    intro:
      "Una guía urbana hecha por personas del barrio, para mirar lo cotidiano con otros ojos.",
    challenge:
      "Los mapas turísticos mostraban los mismos lugares. Las voces, negocios y espacios que hacen barrio quedaban fuera del recorrido.",
    approach:
      "Construí una experiencia cartográfica que pone a las personas delante de las categorías, con recorridos flexibles y relatos breves.",
    outcome:
      "Una beta de seis barrios con más de 120 recomendaciones creadas por sus propios vecinos.",
    services: ["Investigación", "Diseño de producto", "Prototipado"],
  },
  {
    id: "pulso",
    number: "04",
    title: "Un ritmo más amable",
    client: "Pulso · bienestar",
    category: "Motion & interacción",
    kind: "Motion & interacción",
    year: "2022",
    image: "/__mockup/images/alex-fintech.jpg",
    imageAlt: "Composición abstracta de formas azul intenso y lavanda",
    color: "lavender",
    size: "standard",
    intro:
      "Pequeños rituales de movimiento para una app de bienestar que no necesita hablar más alto.",
    challenge:
      "El seguimiento de hábitos estaba lleno de alertas. Pulso necesitaba comunicar progreso sin añadir presión.",
    approach:
      "Creé una gramática de motion basada en respiración, con feedback suave y transiciones que acompañan el ritmo real del usuario.",
    outcome:
      "Un sistema de movimiento documentado y listo para integrarse en iOS y Android.",
    services: ["Motion design", "Prototipado", "Sistema UI"],
  },
];

const filters = ["Todos", "Producto digital", "Identidad & digital", "Motion & interacción"];

const testimonials = [
  {
    quote:
      "David consigue hacer preguntas que cambian el proyecto. A su lado, el equipo pasó de discutir pantallas a entender mejor a las personas.",
    name: "Lucía Ferrer",
    role: "Lead de producto en Norte",
    initials: "LF",
  },
  {
    quote:
      "Tiene un ojo muy fino para el detalle y algo aún más difícil: sabe cuándo ese detalle sirve de verdad a la experiencia.",
    name: "Mateo Ruiz",
    role: "Director creativo en Sonora",
    initials: "MR",
  },
  {
    quote:
      "La colaboración se sintió natural desde el primer taller. David aportó dirección, criterio y muchísima generosidad.",
    name: "Inés Soler",
    role: "Fundadora de Barrio Abierto",
    initials: "IS",
  },
];

const navItems = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
];

function Portfolio() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [testimonial, setTestimonial] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [formError, setFormError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const visibleProjects = useMemo(
    () =>
      activeFilter === "Todos"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter],
  );

  useEffect(() => {
    const roles = ["diseñador UI/UX", "motion designer"];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedRole(roles[0]);
      return;
    }
    let roleIndex = 0;
    let letterIndex = 0;
    let deleting = false;
    let timer: number;

    const tick = () => {
      const role = roles[roleIndex];
      letterIndex += deleting ? -1 : 1;
      setTypedRole(role.slice(0, letterIndex));
      let delay = deleting ? 48 : 82;
      if (!deleting && letterIndex === role.length) {
        deleting = true;
        delay = 1450;
      } else if (deleting && letterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 330;
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".am-portfolio [data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeFilter, activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 20);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
      if (event.key === "ArrowRight") moveProject(1);
      if (event.key === "ArrowLeft") moveProject(-1);
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [activeProject]);

  function moveProject(direction: number) {
    setActiveProject((current) => {
      if (!current) return current;
      const index = projects.findIndex((project) => project.id === current.id);
      return projects[(index + direction + projects.length) % projects.length];
    });
  }

  function openProject(project: Project) {
    setActiveProject(project);
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setFormError("Revisa los campos marcados antes de enviar.");
      return;
    }
    setFormState("loading");
    window.setTimeout(() => {
      setFormState("success");
      form.reset();
    }, 1100);
  }

  const currentTestimonial = testimonials[testimonial];

  return (
    <div className={`am-portfolio${dark ? " am-dark" : ""}`}>
      <style>{styles}</style>
      <div className="am-grid-wash" aria-hidden="true" />
      <header className="am-header">
        <a className="am-wordmark" href="#inicio" aria-label="David Duarte, inicio">
          <span className="am-mark">d<span>.</span></span>
          <span className="am-wordmark-name">david duarte</span>
        </a>
        <nav className="am-desktop-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="am-header-actions">
          <button
            className="am-icon-button am-theme-toggle"
            type="button"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="am-header-cta" href="#contacto">
            Hablemos <ArrowUpRight size={15} />
          </a>
          <button
            className="am-icon-button am-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="am-mobile-nav" aria-label="Navegación móvil">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span className="am-mono">0{index + 1}</span>{item.label}<ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section className="am-hero" id="inicio">
          <div className="am-hero-meta am-mono">
            <span><i className="am-status-dot" /> DISPONIBLE PARA PROYECTOS</span>
            <span>BARCELONA, ES <span className="am-meta-slash">/</span> 41°23′N 2°10′E</span>
          </div>
          <div className="am-hero-center">
            <div className="am-orbit am-orbit-one" aria-hidden="true" />
            <div className="am-orbit am-orbit-two" aria-hidden="true" />
            <div className="am-hero-stamp am-mono" aria-hidden="true">
              <span>DISEÑO CON</span>
              <span>INTENCIÓN</span>
              <span className="am-stamp-star">+</span>
            </div>
            <p className="am-eyebrow am-mono">DISEÑO DIGITAL · MOVIMIENTO · IDEAS</p>
            <h1 aria-label="David Duarte">
              <span className="am-name-line">DAVID</span>
              <span className="am-name-line am-name-accent">DUARTE</span>
            </h1>
            <p className="am-hero-promise">Hago que lo complejo se sienta simple.</p>
            <p className="am-hero-role">
              <span className="am-typed">{typedRole}<span className="am-cursor">|</span></span>
            </p>
            <a className="am-work-link" href="#proyectos">
              Ver mi trabajo <ArrowDown size={15} />
            </a>
          </div>
          <div className="am-hero-bottom am-mono">
            <span>ESTRATEGIA <span>↗</span> DISEÑO <span>↗</span> MOVIMIENTO</span>
            <span>UN POCO DE CURIOSIDAD. MUCHO DE CRITERIO.</span>
          </div>
        </section>

        <section className="am-projects am-section" id="proyectos">
          <div className="am-section-head" data-reveal>
            <div>
              <p className="am-kicker am-mono"><span>01</span> TRABAJO SELECCIONADO</p>
              <h2>Ideas que encuentran<br />su <span className="am-accent-word">forma.</span></h2>
            </div>
            <p className="am-section-intro">Una selección de proyectos donde estrategia, forma y detalle se encuentran para hacer algo útil —y un poco inesperado.</p>
          </div>
          <div className="am-filter-row" role="group" aria-label="Filtrar proyectos">
            <span className="am-filter-label am-mono">VER POR</span>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`am-filter-pill${activeFilter === filter ? " is-active" : ""}`}
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {activeFilter === filter && <span className="am-filter-dot" />}
              </button>
            ))}
          </div>
          <div className="am-project-grid">
            {visibleProjects.map((project, index) => (
              <button
                type="button"
                className={`am-project-card am-project-${project.size} am-tone-${project.color}`}
                key={project.id}
                onClick={() => openProject(project)}
                data-reveal
                style={{ transitionDelay: `${Math.min(index * 90, 270)}ms` }}
                aria-label={`Ver caso de estudio: ${project.title}`}
              >
                <div className="am-project-art">
                  <img src={project.image} alt={project.imageAlt} />
                  <div className="am-project-art-shade" />
                  <span className="am-project-counter am-mono">{project.number} / 0{projects.length}</span>
                  <span className="am-project-open"><ArrowUpRight size={20} /></span>
                  {project.id === "sonora" && <span className="am-art-label am-mono">REPRODUCTOR<br />DE CURIOSIDAD</span>}
                  {project.id === "barrio" && <span className="am-map-pin" aria-hidden="true"><span /></span>}
                  {project.id === "pulso" && <span className="am-pulse-mark" aria-hidden="true"><span /><span /><span /><span /><span /></span>}
                  <span className="am-project-overlay-title">{project.title}</span>
                </div>
                <div className="am-project-caption">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.client}</p>
                  </div>
                  <span className="am-project-tag am-mono">{project.kind}</span>
                </div>
              </button>
            ))}
            {visibleProjects.length === 0 && (
              <div className="am-empty-filter" role="status">Aún estoy preparando este tipo de proyecto. Pronto habrá novedades.</div>
            )}
          </div>
          <div className="am-projects-foot am-mono">
            <span>SELECCIÓN 2022 — 2024</span>
            <span>SCROLL PARA DESCUBRIR <span className="am-foot-arrow">↓</span></span>
          </div>
        </section>

        <section className="am-statement">
          <div className="am-statement-inner" data-reveal>
            <span className="am-statement-mark">“</span>
            <p>El buen diseño no añade ruido.<br /><span>Encuentra la señal.</span></p>
            <span className="am-statement-note am-mono">UNA IDEA QUE GUÍA<br />CADA DECISIÓN</span>
          </div>
        </section>

        <section className="am-about am-section" id="sobre-mi">
          <div className="am-section-head" data-reveal>
            <div>
              <p className="am-kicker am-mono"><span>02</span> QUIÉN ESTÁ DETRÁS</p>
              <h2>Hola, soy David.<br /><span className="am-accent-word">Pienso en sistemas.</span></h2>
            </div>
            <p className="am-section-intro">Me interesa lo que ocurre entre una buena pregunta y algo que por fin hace clic.</p>
          </div>
          <div className="am-about-layout">
            <div className="am-about-art" data-reveal>
              <div className="am-about-photo" role="img" aria-label="Retrato ilustrado de un diseñador entre luz y sombras cálidas">
                <div className="am-photo-sun" />
                <div className="am-photo-arch am-photo-arch-back" />
                <div className="am-photo-arch am-photo-arch-front" />
                <div className="am-photo-figure">
                  <span className="am-figure-head" />
                  <span className="am-figure-body" />
                </div>
                <span className="am-photo-caption am-mono">DAVID, EN SU ELEMENTO / 2024</span>
              </div>
              <div className="am-about-sticker am-mono">DESDE<br />BARCELONA<br /><span>EST. 2017</span></div>
              <div className="am-about-side-note am-mono">CURIOSIDAD, SIEMPRE.</div>
            </div>
            <div className="am-about-copy" data-reveal>
              <p className="am-about-lead">Soy un diseñador independiente que convierte problemas en productos claros, expresivos y agradables de usar.</p>
              <p>Trabajo entre UX, interfaz y motion, conectando la visión del negocio con la vida real de las personas. Me gusta abrir espacio para hacer buenas preguntas, prototipar pronto y cuidar hasta el último píxel.</p>
              <p>Colaboro con equipos que valoran el pensamiento claro, las conversaciones honestas y los detalles que no se presumen: simplemente hacen que todo funcione mejor.</p>
              <div className="am-about-actions">
                <a className="am-text-link" href="#contacto">Un poco más sobre cómo trabajo <ArrowUpRight size={15} /></a>
                <button className="am-cv-pending" type="button" disabled aria-label="CV en preparación. La descarga estará disponible cuando se comparta el archivo real.">
                  <Download size={15} /> CV en preparación
                </button>
              </div>
              <div className="am-about-stats">
                <div><strong>08<span>+</span></strong><span>AÑOS DISEÑANDO</span></div>
                <div><strong>26</strong><span>PROYECTOS LANZADOS</span></div>
                <div><strong>11</strong><span>EQUIPOS CÓMPLICES</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="am-skills">
          <div className="am-skills-inner">
            <div className="am-skills-heading" data-reveal>
              <p className="am-kicker am-mono"><span>03</span> MI CAJA DE HERRAMIENTAS</p>
              <h2>Buen criterio.<br />Las herramientas<br />justas.</h2>
            </div>
            <div className="am-skills-list">
              <div className="am-skill-groups">
                <article className="am-skill-group" data-reveal>
                  <div className="am-skill-group-head"><span className="am-skill-icon"><Smartphone size={17} /></span><div><span className="am-mono">01 / DISCIPLINA</span><h3>Design</h3></div></div>
                  <div className="am-skill-meter-row"><span>Figma</span><div className="am-skill-meter" role="meter" aria-label="Dominio de Figma" aria-valuemin={0} aria-valuemax={100} aria-valuenow={93}><span style={{ width: "93%" }} /></div></div>
                  <div className="am-skill-meter-row"><span>Adobe XD</span><div className="am-skill-meter" role="meter" aria-label="Dominio de Adobe XD" aria-valuemin={0} aria-valuemax={100} aria-valuenow={78}><span style={{ width: "78%" }} /></div></div>
                  <div className="am-skill-meter-row"><span>Sketch</span><div className="am-skill-meter" role="meter" aria-label="Dominio de Sketch" aria-valuemin={0} aria-valuemax={100} aria-valuenow={71}><span style={{ width: "71%" }} /></div></div>
                </article>
                <article className="am-skill-group" data-reveal>
                  <div className="am-skill-group-head"><span className="am-skill-icon"><Zap size={17} /></span><div><span className="am-mono">02 / MOVIMIENTO</span><h3>Motion</h3></div></div>
                  <div className="am-skill-meter-row"><span>After Effects</span><div className="am-skill-meter" role="meter" aria-label="Dominio de After Effects" aria-valuemin={0} aria-valuemax={100} aria-valuenow={88}><span style={{ width: "88%" }} /></div></div>
                  <div className="am-skill-meter-row"><span>Principle</span><div className="am-skill-meter" role="meter" aria-label="Dominio de Principle" aria-valuemin={0} aria-valuemax={100} aria-valuenow={74}><span style={{ width: "74%" }} /></div></div>
                </article>
                <article className="am-skill-group" data-reveal>
                  <div className="am-skill-group-head"><span className="am-skill-icon"><Code2 size={17} /></span><div><span className="am-mono">03 / DESARROLLO</span><h3>Build</h3></div></div>
                  <div className="am-skill-meter-row"><span>HTML / CSS</span><div className="am-skill-meter" role="meter" aria-label="Dominio de HTML y CSS" aria-valuemin={0} aria-valuemax={100} aria-valuenow={82}><span style={{ width: "82%" }} /></div></div>
                  <div className="am-skill-meter-row"><span>Framer</span><div className="am-skill-meter" role="meter" aria-label="Dominio de Framer" aria-valuemin={0} aria-valuemax={100} aria-valuenow={86}><span style={{ width: "86%" }} /></div></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="am-process am-section" id="proceso">
          <div className="am-section-head" data-reveal>
            <div>
              <p className="am-kicker am-mono"><span>04</span> MENOS RECETAS, MÁS OFICIO</p>
              <h2>Un proceso que<br /><span className="am-accent-word">deja espacio.</span></h2>
            </div>
            <p className="am-section-intro">Estructura suficiente para avanzar. Flexibilidad suficiente para encontrar algo mejor de lo que buscábamos al principio.</p>
          </div>
          <div className="am-process-track">
            {[
              { n: "01", title: "Entender", text: "Escuchar antes de proponer. Mapeamos el contexto, las personas y qué sería un buen resultado." },
              { n: "02", title: "Enfocar", text: "Elegimos juntos el problema que merece nuestra atención. Lo demás puede esperar." },
              { n: "03", title: "Explorar", text: "Damos forma a las ideas, probamos temprano y aprendemos con algo tangible sobre la mesa." },
              { n: "04", title: "Afinar", text: "Detalles, movimiento y sistema. Dejamos cada decisión lista para vivir fuera del archivo." },
            ].map((step) => (
              <article className="am-process-step" key={step.n} data-reveal>
                <div className="am-process-node"><span>{step.n}</span></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="am-process-foot am-mono"><span>CLARIDAD ANTES QUE VELOCIDAD.</span><span>ITERAR TAMBIÉN ES AVANZAR. <ArrowRight size={13} /></span></div>
        </section>

        <section className="am-clients">
          <div className="am-clients-top" data-reveal>
            <p className="am-kicker am-mono"><span>05</span> BUENA COMPAÑÍA</p>
            <p className="am-clients-sub">He tenido la suerte de pensar y crear con equipos que se toman en serio el impacto de su trabajo.</p>
          </div>
          <div className="am-client-list" aria-label="Algunos equipos con los que he colaborado">
            <span className="am-client-norte" data-reveal><span className="am-norte-icon" />norte</span>
            <span className="am-client-sonora" data-reveal><span className="am-sonora-icon">s</span>sonora</span>
            <span className="am-client-barrio" data-reveal><span className="am-barrio-icon">b.</span>barrio abierto</span>
            <span className="am-client-marea" data-reveal>marea<span className="am-marea-dot">●</span></span>
            <span className="am-client-pulso" data-reveal><span>∿</span> pulso</span>
          </div>
          <div className="am-testimonial" data-reveal>
            <div className="am-testimonial-quote">
              <span className="am-quote-mark">“</span>
              <blockquote>{currentTestimonial.quote}</blockquote>
            </div>
            <div className="am-testimonial-bottom">
              <div className="am-person">
                <div className="am-person-avatar" aria-hidden="true">{currentTestimonial.initials}</div>
                <div><strong>{currentTestimonial.name}</strong><span>{currentTestimonial.role}</span></div>
              </div>
              <div className="am-slider-controls" aria-label="Controles de testimonios">
                <span className="am-slide-count am-mono">0{testimonial + 1} <i>/</i> 0{testimonials.length}</span>
                <button type="button" onClick={() => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)} aria-label="Testimonio anterior"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Siguiente testimonio"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="am-contact" id="contacto">
          <div className="am-contact-grid" aria-hidden="true" />
          <div className="am-contact-inner">
            <div className="am-contact-copy" data-reveal>
              <p className="am-kicker am-mono"><span>06</span> LO SIGUIENTE EMPIEZA AQUÍ</p>
              <h2>¿Tienes algo<br />en <span>mente?</span></h2>
              <p className="am-contact-description">Cuéntame en qué estás trabajando. Si hay una buena pregunta detrás, seguro encontramos un rato para hablar.</p>
              <a className="am-email-link" href="mailto:hola@davidduarte.design">hola@davidduarte.design <ArrowUpRight size={17} /></a>
              <div className="am-contact-socials" aria-label="Perfiles sociales">
                <a href="https://www.linkedin.com/in/tu-perfil/" target="_blank" rel="noreferrer" title="Enlace provisional; pendiente de la URL real de David"><Linkedin size={15} /><span>LinkedIn</span></a>
                <a href="https://dribbble.com/tu-perfil/" target="_blank" rel="noreferrer" title="Enlace provisional; pendiente de la URL real de David"><Dribbble size={15} /><span>Dribbble</span></a>
                <a href="https://www.behance.net/tu-perfil/" target="_blank" rel="noreferrer" title="Enlace provisional; pendiente de la URL real de David"><span className="am-behance-mark" aria-hidden="true">Be</span><span>Behance</span></a>
              </div>
              <a className="am-calendly-link" href="https://calendly.com/tu-enlace/" target="_blank" rel="noreferrer" title="Enlace provisional; pendiente del enlace real de Calendly">
                Agendar una llamada <ArrowUpRight size={15} /><span className="am-calendly-note am-mono">URL PROVISIONAL</span>
              </a>
              <p className="am-link-note">Perfiles y agenda: enlaces de ejemplo, pendientes de las URLs oficiales.</p>
            </div>
            <form className="am-contact-form" onSubmit={handleContactSubmit} data-reveal>
              <div className="am-form-head"><span className="am-mono">NOTA RÁPIDA</span><span className="am-form-indicator"><i /> RESPONDO EN 1–2 DÍAS</span></div>
              <label>Tu nombre<input name="name" type="text" autoComplete="name" placeholder="¿Cómo te llamas?" required minLength={2} /></label>
              <label>Tu email<input name="email" type="email" autoComplete="email" placeholder="tú@empresa.com" required /></label>
              <label>Tipo de proyecto
                <select name="projectType" required defaultValue="">
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="producto-digital">Diseño de producto digital</option>
                  <option value="web">Diseño web</option>
                  <option value="motion">Motion design</option>
                  <option value="identidad">Identidad digital</option>
                  <option value="otro">Otro / todavía lo estoy definiendo</option>
                </select>
              </label>
              <label>Presupuesto aproximado <span className="am-optional-label">OPCIONAL</span>
                <select name="budget" defaultValue="">
                  <option value="">Prefiero conversarlo</option>
                  <option value="menos-2000">Menos de €2.000</option>
                  <option value="2000-5000">€2.000 – €5.000</option>
                  <option value="5000-10000">€5.000 – €10.000</option>
                  <option value="mas-10000">Más de €10.000</option>
                </select>
              </label>
              <label>¿Qué tienes entre manos?<textarea name="message" rows={3} placeholder="Un poco de contexto, una duda o una idea..." required minLength={12} /></label>
              {formError && <p className="am-form-error" role="alert">{formError}</p>}
              {formState === "success" ? (
                <div className="am-form-success" role="status"><span><Check size={17} /></span> Gracias por escribir. Te respondo muy pronto.</div>
              ) : (
                <button className="am-submit" type="submit" disabled={formState === "loading"}>
                  {formState === "loading" ? <><span className="am-submit-loader" /> Enviando nota...</> : <>Enviar nota <Send size={15} /> <span className="am-submit-arrow"><ArrowUpRight size={16} /></span></>}
                </button>
              )}
              <p className="am-form-foot">Sin formularios eternos. Solo una conversación.</p>
            </form>
          </div>
          <div className="am-contact-bottom am-mono"><span>BARCELONA · DISPONIBLE EN REMOTO</span><span>HAGAMOS ALGO QUE IMPORTE <span>↗</span></span></div>
        </section>
      </main>

      <footer className="am-footer">
        <a className="am-wordmark" href="#inicio" aria-label="Volver al inicio">
          <span className="am-mark">d<span>.</span></span><span className="am-wordmark-name">david duarte</span>
        </a>
        <span className="am-footer-note am-mono">DISEÑADO CON CURIOSIDAD Y CAFÉ.</span>
        <div><span className="am-footer-copy">© {new Date().getFullYear()} DAVID DUARTE</span><a href="#inicio" className="am-back-top">ARRIBA <ArrowUpRight size={13} /></a></div>
      </footer>

      {activeProject && (
        <div className="am-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <div
            className="am-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="am-dialog-title"
            ref={dialogRef}
            tabIndex={-1}
          >
            <div className="am-dialog-top">
              <span className="am-mono">CASO DE ESTUDIO <i>/</i> {activeProject.number}</span>
              <button className="am-dialog-close" type="button" onClick={() => setActiveProject(null)} aria-label="Cerrar caso de estudio"><X size={19} /></button>
            </div>
            <div className={`am-dialog-art am-tone-${activeProject.color}`}>
              <img src={activeProject.image} alt={activeProject.imageAlt} />
              <span className="am-dialog-art-caption am-mono">{activeProject.client} <i>—</i> {activeProject.year}</span>
            </div>
            <div className="am-dialog-body">
              <div className="am-dialog-heading">
                <div><span className="am-project-tag am-mono">{activeProject.kind}</span><h2 id="am-dialog-title">{activeProject.title}</h2></div>
                <span className="am-dialog-year am-mono">{activeProject.year}</span>
              </div>
              <p className="am-dialog-intro">{activeProject.intro}</p>
              <div className="am-case-columns">
                <div><span className="am-mono">EL RETO</span><p>{activeProject.challenge}</p></div>
                <div><span className="am-mono">EL ENFOQUE</span><p>{activeProject.approach}</p></div>
              </div>
              <div className="am-case-outcome"><span className="am-mono">LO QUE CAMBIÓ</span><p>{activeProject.outcome}</p></div>
              <div className="am-case-services">{activeProject.services.map((service) => <span key={service}>{service}</span>)}</div>
            </div>
            <div className="am-dialog-footer">
              <button type="button" onClick={() => moveProject(-1)}><ArrowLeft size={15} /> ANTERIOR</button>
              <span className="am-mono">{activeProject.number} <i>/</i> 0{projects.length}</span>
              <button type="button" onClick={() => moveProject(1)}>SIGUIENTE <ArrowRight size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
.am-portfolio{--am-bg:#f7f7f5;--am-paper:#fff;--am-ink:#17181c;--am-muted:#777a83;--am-line:#e6e5e1;--am-indigo:#5548e8;--am-indigo-soft:#eeecff;--am-lime:#d6ef62;--am-display:'Manrope',sans-serif;--am-mono:'DM Mono',monospace;position:relative;isolation:isolate;overflow:hidden;background:var(--am-bg);color:var(--am-ink);font-family:var(--am-display);font-size:14px;line-height:1.55;transition:background .4s,color .4s}
.am-portfolio *{box-sizing:border-box}.am-portfolio button,.am-portfolio input,.am-portfolio textarea{font:inherit}.am-portfolio button{color:inherit}.am-portfolio a{color:inherit;text-decoration:none}.am-portfolio button:focus-visible,.am-portfolio a:focus-visible,.am-portfolio input:focus-visible,.am-portfolio textarea:focus-visible{outline:2px solid var(--am-indigo);outline-offset:4px}.am-portfolio img{display:block;width:100%;height:100%;object-fit:cover}.am-portfolio .am-mono{font-family:var(--am-mono);font-size:9px;letter-spacing:.095em}.am-portfolio .am-grid-wash{position:absolute;z-index:-1;inset:0 0 auto;height:850px;opacity:.23;pointer-events:none;background-image:linear-gradient(rgba(26,28,38,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(26,28,38,.045) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(to bottom,black,transparent 91%)}
.am-portfolio .am-header{height:78px;max-width:1280px;margin:0 auto;padding:0 52px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:20;border-bottom:1px solid rgba(28,29,34,.09)}.am-wordmark{display:inline-flex;align-items:center;gap:10px}.am-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--am-ink);color:var(--am-paper);font-size:18px;font-weight:800;letter-spacing:-.1em}.am-mark span{color:#a69cff}.am-wordmark-name{font-size:12px;font-weight:800;letter-spacing:-.035em}.am-desktop-nav{display:flex;gap:34px;margin-left:140px}.am-desktop-nav a{font-size:11px;color:var(--am-muted);transition:color .2s}.am-desktop-nav a:hover{color:var(--am-indigo)}.am-header-actions{display:flex;gap:11px;align-items:center}.am-icon-button{width:36px;height:36px;border:1px solid var(--am-line);background:transparent;border-radius:50%;display:grid;place-items:center;cursor:pointer;transition:background .2s,border-color .2s}.am-icon-button:hover{background:var(--am-indigo-soft);border-color:var(--am-indigo)}.am-header-cta{height:37px;padding:0 15px;display:flex;align-items:center;gap:10px;border-radius:3px;background:var(--am-indigo);color:#fff!important;font-size:11px;font-weight:700;transition:transform .2s,background .2s}.am-header-cta:hover{transform:translateY(-2px);background:#4336d2}.am-menu-toggle,.am-mobile-nav{display:none}
.am-portfolio .am-hero{max-width:1280px;margin:auto;padding:0 52px;min-height:645px;display:flex;flex-direction:column;position:relative}.am-hero-meta,.am-hero-bottom{display:flex;align-items:center;justify-content:space-between;color:#8b8d94;font-size:9px;letter-spacing:.1em}.am-hero-meta{padding-top:25px}.am-hero-meta>span:first-child{display:flex;align-items:center;gap:8px}.am-status-dot,.am-form-indicator i{width:6px;height:6px;border-radius:50%;background:#8cbe53;display:inline-block;box-shadow:0 0 0 4px rgba(140,190,83,.13)}.am-meta-slash{padding:0 7px;color:#b4b5b9}.am-hero-center{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:68px 0 64px;text-align:center}.am-eyebrow{color:var(--am-indigo);margin:0 0 19px;font-size:9px!important;letter-spacing:.18em!important}.am-hero h1{font-size:clamp(54px,7.5vw,96px);line-height:.99;letter-spacing:-.085em;font-weight:700;margin:0;position:relative;z-index:1}.am-hero h1>span:first-child{font-weight:500;color:var(--am-indigo);font-style:italic;letter-spacing:-.09em}.am-period{color:var(--am-indigo)}.am-hero-role{font-size:14px;color:var(--am-muted);line-height:1.85;margin:23px 0 24px}.am-typed{color:var(--am-ink);font-weight:700;min-width:154px;display:inline-block;text-align:left}.am-cursor{color:var(--am-indigo);animation:am-blink 1.05s step-end infinite}.am-round-link{width:42px;height:42px;border:1px solid var(--am-line);border-radius:50%;display:grid;place-items:center;transition:all .25s}.am-round-link:hover{background:var(--am-indigo);color:#fff;border-color:var(--am-indigo);transform:translateY(3px)}.am-hero-bottom{padding:17px 0 18px;border-top:1px solid var(--am-line);font-size:8px}.am-hero-bottom>span:first-child span{color:var(--am-indigo);padding:0 5px}.am-orbit{position:absolute;border:1px solid rgba(85,72,232,.1);border-radius:50%;pointer-events:none}.am-orbit-one{width:450px;height:450px;top:50%;left:50%;transform:translate(-50%,-51%)}.am-orbit-two{width:560px;height:560px;top:50%;left:50%;transform:translate(-50%,-51%);border-style:dashed;opacity:.55}.am-orbit-one:before,.am-orbit-two:after{content:"";position:absolute;width:8px;height:8px;border-radius:50%;background:#8279f1}.am-orbit-one:before{right:12%;top:23%}.am-orbit-two:after{left:12%;bottom:22%;background:#c2df70}.am-hero-stamp{position:absolute;right:12%;top:23%;z-index:2;width:77px;height:77px;border-radius:50%;background:#d6ef62;transform:rotate(11deg);display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:7px!important;line-height:1.5!important;letter-spacing:.1em!important;color:#363b1a}.am-stamp-star{font-size:14px;margin-top:1px}.am-mobile-break{display:none}
.am-section{max-width:1180px;margin:auto;padding-left:52px;padding-right:52px}.am-projects{padding-top:105px;padding-bottom:82px}.am-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}.am-kicker{color:var(--am-muted);font-size:9px!important;letter-spacing:.12em!important;margin:0 0 19px}.am-kicker>span{color:var(--am-indigo);margin-right:12px}.am-section-head h2,.am-skills-heading h2{font-size:clamp(38px,5.3vw,61px);line-height:1.04;letter-spacing:-.075em;margin:0;font-weight:650}.am-accent-word{color:var(--am-indigo);font-weight:500;font-style:italic}.am-section-intro{max-width:325px;font-size:12px;color:var(--am-muted);line-height:1.8;margin:0 0 5px}.am-filter-row{display:flex;align-items:center;gap:8px;margin:38px 0 23px;flex-wrap:wrap}.am-filter-label{color:#a1a2a8;margin-right:9px}.am-filter-pill{height:29px;padding:0 12px;border:1px solid var(--am-line);border-radius:99px;background:transparent;color:var(--am-muted);font-size:10px!important;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s}.am-filter-pill:hover{border-color:var(--am-indigo);color:var(--am-indigo)}.am-filter-pill.is-active{background:var(--am-ink);border-color:var(--am-ink);color:var(--am-bg)}.am-filter-dot{width:5px;height:5px;border-radius:50%;background:#b2aaff}.am-project-grid{display:grid;grid-template-columns:1.12fr .88fr;gap:42px 24px;align-items:start}.am-project-card{appearance:none;border:0;background:transparent;text-align:left;padding:0;cursor:pointer;min-width:0;transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .5s,translate .5s;opacity:0;translate:0 20px}.am-project-card.is-visible{opacity:1;translate:0 0}.am-project-card:hover{transform:translateY(-5px)}.am-project-card:nth-child(even){margin-top:63px}.am-project-art{height:320px;position:relative;overflow:hidden;background:#dfe0ee}.am-project-tall .am-project-art{height:397px}.am-project-wide .am-project-art{height:350px}.am-project-art img{transition:transform .7s cubic-bezier(.2,.7,.2,1),filter .3s;filter:saturate(.93)}.am-project-card:hover .am-project-art img{transform:scale(1.045);filter:saturate(1.1)}.am-project-art-shade{position:absolute;inset:40% 0 0;background:linear-gradient(transparent,rgba(14,16,23,.28));opacity:.62;transition:opacity .3s}.am-project-counter{position:absolute;left:18px;top:17px;color:rgba(255,255,255,.86);font-size:8px!important}.am-project-open{position:absolute;right:15px;top:15px;width:35px;height:35px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.88);color:#17181c;transform:translateY(5px);opacity:0;transition:opacity .25s,transform .25s}.am-project-card:hover .am-project-open{opacity:1;transform:translateY(0)}.am-project-overlay-title{position:absolute;left:22px;bottom:18px;color:white;font-size:clamp(20px,2.8vw,36px);font-weight:700;letter-spacing:-.065em;opacity:0;transform:translateY(5px);transition:all .25s}.am-project-card:hover .am-project-overlay-title{opacity:1;transform:translateY(0)}.am-art-label{position:absolute;right:23px;bottom:30px;color:#182017;font-size:9px!important;line-height:1.5!important;letter-spacing:.1em!important;transform:rotate(-5deg)}.am-map-pin{position:absolute;left:56%;top:41%;width:29px;height:29px;border-radius:50% 50% 50% 0;background:#5447e8;transform:rotate(-45deg);box-shadow:0 7px 18px #5447e858}.am-map-pin span{position:absolute;left:10px;top:10px;width:9px;height:9px;border-radius:50%;background:#f7f7f5}.am-pulse-mark{position:absolute;top:47%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:7px}.am-pulse-mark span{width:9px;height:33px;border-radius:8px;background:#f6f2fe;transform:rotate(15deg)}.am-pulse-mark span:nth-child(2),.am-pulse-mark span:nth-child(4){height:51px}.am-pulse-mark span:nth-child(3){height:66px;background:#d6ef62}.am-project-caption{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding-top:13px}.am-project-caption h3{font-size:15px;margin:0 0 3px;letter-spacing:-.035em}.am-project-caption p{font-size:10px;margin:0;color:var(--am-muted)}.am-project-tag{display:inline-flex;align-items:center;white-space:nowrap;padding:5px 8px;border:1px solid var(--am-line);border-radius:2px;color:var(--am-muted);font-size:8px!important;letter-spacing:.04em!important}.am-projects-foot{display:flex;justify-content:space-between;padding-top:27px;border-top:1px solid var(--am-line);margin-top:45px;color:#95969c;font-size:8px!important}.am-foot-arrow{color:var(--am-indigo);font-size:13px;margin-left:5px}.am-empty-filter{grid-column:1/-1;padding:54px 20px;text-align:center;color:var(--am-muted);border:1px dashed var(--am-line)}
.am-statement{background:#eae8fb;position:relative;overflow:hidden}.am-statement:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(85,72,232,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(85,72,232,.045) 1px,transparent 1px);background-size:36px 36px;mask-image:radial-gradient(ellipse at center,black,transparent 80%)}.am-statement-inner{max-width:1050px;min-height:265px;padding:58px 52px;margin:auto;display:flex;align-items:center;justify-content:center;position:relative}.am-statement-mark{font-family:Georgia,serif;color:var(--am-indigo);font-size:90px;line-height:1;align-self:flex-start;margin:1px 17px 0 0}.am-statement-inner p{font-size:clamp(25px,4vw,43px);line-height:1.22;letter-spacing:-.06em;font-weight:600;margin:0}.am-statement-inner p span{font-style:italic;color:var(--am-indigo);font-weight:500}.am-statement-note{position:absolute;right:60px;bottom:48px;color:#7c7b8f;line-height:1.7;font-size:8px!important}
.am-about{padding-top:110px;padding-bottom:106px}.am-about-layout{display:grid;grid-template-columns:.92fr 1.08fr;gap:89px;align-items:center;margin-top:57px}.am-about-art{position:relative;max-width:410px}.am-about-photo{height:395px;position:relative;overflow:hidden;background:#e5dcce}.am-photo-sun{position:absolute;width:204px;height:204px;border-radius:50%;background:#dc985e;right:51px;top:35px;opacity:.8}.am-photo-arch{position:absolute;bottom:-28px;border-radius:48% 48% 0 0}.am-photo-arch-back{width:245px;height:280px;background:#5c5e7c;right:13px;bottom:-25px}.am-photo-arch-front{width:240px;height:249px;background:#a45d49;left:27px;bottom:-25px}.am-photo-figure{position:absolute;z-index:2;bottom:0;left:44%;height:258px;width:128px}.am-figure-head{position:absolute;z-index:2;width:66px;height:75px;left:30px;top:21px;border-radius:46% 50% 45% 48%;background:#c17d56;transform:rotate(-8deg);box-shadow:inset -9px 0 #a9654b}.am-figure-head:before{content:"";position:absolute;width:68px;height:41px;left:-4px;top:-12px;border-radius:55% 65% 28% 25%;background:#302b2b;transform:rotate(-4deg)}.am-figure-body{position:absolute;bottom:-34px;left:0;width:130px;height:188px;background:#282b39;border-radius:48% 48% 0 0;transform:rotate(2deg)}.am-figure-body:after{content:"";position:absolute;right:-8px;top:47px;width:22px;height:98px;background:#bd7956;border-radius:12px;transform:rotate(-22deg)}.am-photo-caption{position:absolute;z-index:3;left:15px;bottom:13px;color:rgba(255,255,255,.77);font-size:7px!important}.am-about-sticker{position:absolute;z-index:4;right:-22px;top:28px;width:88px;height:88px;background:#d6ef62;display:flex;justify-content:center;align-items:center;flex-direction:column;text-align:center;line-height:1.35;color:#303519;transform:rotate(8deg);font-size:8px!important}.am-about-sticker span{font-size:6px;opacity:.67;margin-top:5px}.am-about-side-note{position:absolute;left:-38px;bottom:55px;writing-mode:vertical-rl;transform:rotate(180deg);color:#aaa7a1;font-size:7px!important}.am-about-lead{font-size:20px;line-height:1.48;font-weight:600;letter-spacing:-.04em;margin:0 0 19px;max-width:515px}.am-about-copy>p:not(.am-about-lead){font-size:12px;line-height:1.9;color:var(--am-muted);max-width:505px;margin:0 0 13px}.am-text-link{margin-top:13px;display:inline-flex;align-items:center;gap:9px;font-size:11px;font-weight:700;color:var(--am-indigo)!important}.am-text-link svg{transition:transform .2s}.am-text-link:hover svg{transform:translate(3px,-3px)}.am-about-stats{display:flex;gap:43px;margin-top:35px;padding-top:23px;border-top:1px solid var(--am-line)}.am-about-stats>div{display:flex;flex-direction:column}.am-about-stats strong{font-size:29px;line-height:1;font-weight:700;letter-spacing:-.08em}.am-about-stats strong span{color:var(--am-indigo);font-size:19px}.am-about-stats>div>span{font-family:var(--am-mono);font-size:7px;letter-spacing:.09em;color:var(--am-muted);margin-top:8px}
.am-skills{background:#efefeb;padding:76px 0 82px}.am-skills-inner{max-width:1180px;margin:auto;padding:0 52px;display:grid;grid-template-columns:.78fr 1.22fr;gap:78px}.am-skills-heading h2{font-size:clamp(35px,4.5vw,51px)}.am-skills-list{padding-top:3px}.am-skill-line{display:grid;grid-template-columns:41px 1fr 24px;align-items:center;gap:13px;border-bottom:1px solid #d9d9d3;padding:17px 0;opacity:0;translate:0 15px;transition:opacity .6s,translate .6s}.am-skill-line.is-visible{opacity:1;translate:0 0}.am-skill-icon{width:37px;height:37px;border:1px solid #d5d4ce;background:#f6f6f2;display:grid;place-items:center;color:var(--am-indigo)}.am-skill-line h3{font-size:13px;letter-spacing:-.025em;margin:0 0 4px}.am-skill-line p{font-size:10px;color:var(--am-muted);margin:0}.am-skill-no{color:#a4a49c;font-size:8px!important}.am-tools-row{display:flex;align-items:center;gap:11px;flex-wrap:wrap;padding-top:24px}.am-tools-row>span{color:#868780;margin-right:4px}.am-tool{height:29px;border:1px solid #d8d8d2;padding:0 9px;display:flex;align-items:center;gap:6px;font-size:9px;color:#54555a;background:#f5f5f1}.am-tool svg{color:var(--am-indigo)}.am-framer-mark{font-weight:800;font-size:12px;color:#ec6aa4}
.am-process{padding-top:108px;padding-bottom:103px}.am-process-track{display:grid;grid-template-columns:repeat(4,1fr);gap:27px;margin-top:64px;position:relative}.am-process-track:before{content:"";height:1px;position:absolute;top:17px;left:12px;right:12px;background:linear-gradient(90deg,var(--am-indigo),#d4d1ef)}.am-process-step{position:relative;padding-top:42px;opacity:0;translate:0 18px;transition:opacity .6s,translate .6s}.am-process-step.is-visible{opacity:1;translate:0 0}.am-process-node{position:absolute;top:0;left:0;width:35px;height:35px;border-radius:50%;background:var(--am-bg);border:1px solid #c9c5f4;display:grid;place-items:center;z-index:1}.am-process-node span{font-family:var(--am-mono);font-size:8px;color:var(--am-indigo)}.am-process-step h3{font-size:16px;letter-spacing:-.04em;margin:0 0 10px}.am-process-step p{font-size:11px;line-height:1.8;color:var(--am-muted);margin:0;max-width:205px}.am-process-foot{display:flex;justify-content:space-between;border-top:1px solid var(--am-line);padding-top:19px;margin-top:46px;color:#96979c;font-size:8px!important}.am-process-foot span:last-child{display:flex;align-items:center;gap:7px}.am-process-foot svg{color:var(--am-indigo)}
.am-clients{background:#efefeb;padding:70px max(52px,calc((100vw - 1076px)/2)) 78px}.am-clients-top{display:flex;justify-content:space-between;align-items:flex-start;gap:30px}.am-clients-top .am-kicker{margin:0}.am-clients-sub{font-size:11px;line-height:1.7;color:var(--am-muted);max-width:365px;margin:0}.am-client-list{display:flex;align-items:center;justify-content:space-between;gap:27px;padding:43px 3px;border-bottom:1px solid #d9d9d3}.am-client-list>span{display:flex;align-items:center;color:#686a6d;opacity:.77;white-space:nowrap}.am-client-norte{font-size:20px;font-weight:700;letter-spacing:-.07em}.am-norte-icon{width:20px;height:20px;margin-right:7px;border:5px solid #797a7e;border-radius:50%;border-right-color:transparent;transform:rotate(-35deg)}.am-client-sonora{font-family:Georgia,serif;font-style:italic;font-size:23px;letter-spacing:-.06em}.am-sonora-icon{font-family:var(--am-display);font-size:15px;font-style:normal;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#777;color:#efefeb;margin-right:7px}.am-client-barrio{font-size:13px;font-weight:700;letter-spacing:-.04em}.am-barrio-icon{font-family:Georgia,serif;font-size:18px;margin-right:5px}.am-client-marea{font-size:19px;font-weight:600;letter-spacing:-.06em}.am-marea-dot{font-size:8px;margin-left:3px;align-self:flex-start}.am-client-pulso{font-size:16px;font-weight:600;letter-spacing:-.05em}.am-client-pulso>span{font-size:28px;line-height:.6;margin-right:4px}.am-testimonial{max-width:760px;margin:42px auto 0;padding:27px 34px 22px;background:#f8f8f5;border:1px solid #e2e2dc}.am-testimonial-quote{display:flex;gap:19px;align-items:flex-start;min-height:105px}.am-quote-mark{font-family:Georgia,serif;font-size:47px;color:var(--am-indigo);line-height:1}.am-testimonial blockquote{font-size:16px;line-height:1.65;letter-spacing:-.025em;font-weight:500;margin:5px 0 25px;max-width:640px}.am-testimonial-bottom{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e7e7e2;padding-top:17px}.am-person{display:flex;align-items:center;gap:10px}.am-person-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#e6e3fb;color:var(--am-indigo);font-family:var(--am-mono);font-size:9px}.am-person>div:last-child{display:flex;flex-direction:column;gap:2px}.am-person strong{font-size:10px}.am-person span{color:var(--am-muted);font-size:9px}.am-slider-controls{display:flex;align-items:center;gap:7px}.am-slide-count{color:var(--am-muted);margin-right:6px;font-size:8px!important}.am-slide-count i{font-style:normal;color:#c2c1bd;margin:0 4px}.am-slider-controls button{width:29px;height:29px;border:1px solid #deded9;background:transparent;display:grid;place-items:center;cursor:pointer;transition:all .2s}.am-slider-controls button:hover{background:var(--am-indigo);border-color:var(--am-indigo);color:white}
.am-contact{position:relative;overflow:hidden;background:#1b1b21;color:#f7f7f5;padding:93px max(52px,calc((100vw - 1076px)/2)) 23px}.am-contact-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:38px 38px;mask-image:linear-gradient(120deg,transparent 5%,black 52%,transparent 100%);pointer-events:none}.am-contact:after{content:"";position:absolute;width:430px;height:430px;border:1px solid rgba(130,118,255,.14);border-radius:50%;right:-125px;top:-170px;box-shadow:0 0 0 50px rgba(130,118,255,.025),0 0 0 100px rgba(130,118,255,.018)}.am-contact-inner{position:relative;z-index:1;display:grid;grid-template-columns:1fr .8fr;gap:91px;max-width:1068px;margin:0 auto 67px}.am-contact-copy .am-kicker{color:#aaa9b2}.am-contact-copy .am-kicker>span{color:#aaa1ff}.am-contact-copy h2{font-size:clamp(53px,7vw,78px);line-height:.99;letter-spacing:-.08em;margin:34px 0 19px;font-weight:650}.am-contact-copy h2 span{color:#aaa1ff;font-weight:500;font-style:italic}.am-contact-description{max-width:340px;color:#aaa9b2;font-size:12px;line-height:1.85;margin:0 0 25px}.am-email-link{display:inline-flex;align-items:center;gap:9px;color:#d0caff!important;border-bottom:1px solid rgba(170,161,255,.42);padding-bottom:6px;font-size:14px;font-weight:600}.am-email-link svg{transition:transform .2s}.am-email-link:hover svg{transform:translate(3px,-3px)}.am-contact-socials{display:flex;gap:9px;margin-top:27px}.am-contact-socials a{width:32px;height:32px;border:1px solid #404049;border-radius:50%;display:grid;place-items:center;color:#c3c2ca;transition:all .2s}.am-contact-socials a:hover{background:#aaa1ff;color:#1b1b21;border-color:#aaa1ff;transform:translateY(-2px)}.am-contact-form{align-self:start;padding:24px 25px 19px;background:#24242c;border:1px solid #35353f}.am-form-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #3c3c45;padding-bottom:17px;margin-bottom:17px;color:#b8b7c0}.am-form-indicator{display:flex;align-items:center;gap:7px;font-family:var(--am-mono);font-size:7px;letter-spacing:.06em;color:#a5a5ae}.am-form-indicator i{width:5px;height:5px}.am-contact-form label{display:block;font-size:9px;color:#c3c2c9;margin:0 0 15px}.am-contact-form input,.am-contact-form textarea{display:block;width:100%;border:0;border-bottom:1px solid #494952;background:transparent;color:#f8f7fa;padding:9px 0 10px;font-family:var(--am-display);font-size:11px;resize:vertical;min-height:34px;outline:none}.am-contact-form input::placeholder,.am-contact-form textarea::placeholder{color:#777781}.am-contact-form input:focus,.am-contact-form textarea:focus{border-color:#aaa1ff}.am-submit{width:100%;height:43px;border:0;background:#a69cff;color:#1d1c27;font-size:11px;font-weight:700;display:flex;justify-content:center;align-items:center;gap:9px;cursor:pointer;position:relative;margin-top:7px;transition:background .2s}.am-submit:hover{background:#c0baff}.am-submit:disabled{cursor:wait;opacity:.8}.am-submit-arrow{position:absolute;right:13px;top:13px}.am-submit-loader{width:13px;height:13px;border:1.5px solid rgba(25,24,33,.25);border-top-color:#191821;border-radius:50%;animation:am-spin .7s linear infinite}.am-form-foot{font-size:8px;color:#85858e;text-align:center;margin:13px 0 0}.am-form-error{color:#ffaf9b;font-size:10px;margin:0 0 10px}.am-form-success{background:#303a32;border:1px solid #49654d;color:#c8edc7;padding:12px;display:flex;align-items:center;gap:9px;font-size:10px;line-height:1.5}.am-form-success>span{width:22px;height:22px;background:#405944;display:grid;place-items:center;border-radius:50%}.am-contact-bottom{position:relative;z-index:1;border-top:1px solid #393941;padding-top:17px;display:flex;justify-content:space-between;color:#898891;font-size:8px!important}.am-contact-bottom span span{color:#aaa1ff}
.am-footer{height:76px;max-width:1280px;margin:auto;padding:0 52px;display:flex;align-items:center;justify-content:space-between}.am-footer .am-mark{width:27px;height:27px;font-size:16px}.am-footer-note,.am-footer-copy,.am-back-top{font-size:8px!important;color:#92939a}.am-footer>div{display:flex;align-items:center;gap:22px}.am-back-top{display:flex;align-items:center;gap:5px}.am-back-top svg{color:var(--am-indigo)}
.am-dialog-backdrop{position:fixed;z-index:100;inset:0;background:rgba(18,18,23,.72);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:30px}.am-dialog{width:min(760px,100%);max-height:min(92vh,920px);overflow-y:auto;background:var(--am-bg);color:var(--am-ink);box-shadow:0 25px 90px rgba(0,0,0,.28);outline:none;animation:am-dialog-in .28s cubic-bezier(.18,.7,.2,1)}.am-dialog-top{height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 21px;color:var(--am-muted);font-size:8px!important}.am-dialog-top i,.am-dialog-footer i{font-style:normal;color:#b5b4ba;padding:0 5px}.am-dialog-close{width:30px;height:30px;border:1px solid var(--am-line);background:transparent;display:grid;place-items:center;cursor:pointer}.am-dialog-close:hover{background:var(--am-indigo);color:white}.am-dialog-art{height:246px;position:relative;overflow:hidden;background:#ddd}.am-dialog-art img{object-fit:cover}.am-dialog-art-caption{position:absolute;left:18px;bottom:15px;color:#fff;text-shadow:0 1px 8px #222;font-size:8px!important}.am-dialog-art-caption i{font-style:normal;padding:0 4px}.am-dialog-body{padding:27px 36px 23px}.am-dialog-heading{display:flex;justify-content:space-between;align-items:flex-start}.am-dialog-heading h2{font-size:35px;line-height:1.06;letter-spacing:-.07em;margin:12px 0 0}.am-dialog-year{color:var(--am-muted);padding-top:8px}.am-dialog-intro{font-size:14px;line-height:1.7;max-width:610px;color:var(--am-muted);margin:17px 0 25px}.am-case-columns{display:grid;grid-template-columns:1fr 1fr;gap:26px;border-top:1px solid var(--am-line);padding-top:20px}.am-case-columns>div>span,.am-case-outcome>span{color:var(--am-indigo);font-size:8px!important}.am-case-columns p,.am-case-outcome p{font-size:10px;line-height:1.8;color:var(--am-muted);margin:8px 0 0}.am-case-outcome{border-top:1px solid var(--am-line);padding-top:16px;margin-top:18px}.am-case-services{display:flex;gap:7px;margin-top:18px;flex-wrap:wrap}.am-case-services span{padding:6px 9px;background:var(--am-indigo-soft);color:var(--am-indigo);font-family:var(--am-mono);font-size:8px}.am-dialog-footer{height:52px;border-top:1px solid var(--am-line);display:flex;align-items:center;justify-content:space-between;padding:0 20px}.am-dialog-footer button{border:0;background:transparent;display:flex;align-items:center;gap:8px;color:var(--am-muted);font-family:var(--am-mono);font-size:8px;letter-spacing:.06em;cursor:pointer}.am-dialog-footer button:hover{color:var(--am-indigo)}.am-dialog-footer>span{color:var(--am-muted);font-size:8px!important}
.am-dark{--am-bg:#17181d;--am-paper:#22232b;--am-ink:#f1f0ed;--am-muted:#a5a5ad;--am-line:#34353e;--am-indigo:#a69cff;--am-indigo-soft:#302d48;--am-lime:#d6ef62}.am-dark .am-grid-wash{opacity:.11;background-image:linear-gradient(rgba(222,220,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(222,220,255,.08) 1px,transparent 1px)}.am-dark .am-header{border-color:var(--am-line)}.am-dark .am-mark{background:#efeee9;color:#202026}.am-dark .am-filter-pill.is-active{background:#f1f0ed;color:#17181d;border-color:#f1f0ed}.am-dark .am-statement{background:#29263b}.am-dark .am-statement-note{color:#aaa6c4}.am-dark .am-skills,.am-dark .am-clients{background:#22232a}.am-dark .am-skill-line{border-color:#393a42}.am-dark .am-skill-icon,.am-dark .am-tool{background:#292a32;border-color:#41424a;color:#d2d1d7}.am-dark .am-client-list{border-color:#393a42}.am-dark .am-client-list>span{color:#b8b7c0}.am-dark .am-testimonial{background:#2a2b33;border-color:#3a3a43}.am-dark .am-testimonial-bottom{border-color:#40414a}.am-dark .am-slider-controls button{border-color:#4a4b54}.am-dark .am-footer{color:#f3f2f0}.am-dark .am-round-link:hover{color:#fff}.am-dark .am-about-photo{filter:brightness(.87)}.am-dark .am-project-tag{border-color:var(--am-line)}
@keyframes am-blink{50%{opacity:0}}@keyframes am-spin{to{transform:rotate(360deg)}}@keyframes am-dialog-in{from{opacity:0;transform:translateY(12px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
.am-portfolio [data-reveal]{opacity:0;translate:0 18px;transition:opacity .65s cubic-bezier(.2,.7,.2,1),translate .65s cubic-bezier(.2,.7,.2,1)}.am-portfolio [data-reveal].is-visible{opacity:1;translate:0 0}
@media(max-width:900px){.am-portfolio .am-header,.am-footer{padding-left:28px;padding-right:28px}.am-portfolio .am-hero{padding-left:28px;padding-right:28px}.am-section{padding-left:28px;padding-right:28px}.am-skills-inner{padding:0 28px;gap:45px}.am-desktop-nav{margin-left:0;gap:22px}.am-about-layout{gap:48px}.am-project-art{height:285px}.am-project-tall .am-project-art{height:350px}.am-project-wide .am-project-art{height:315px}.am-contact{padding-left:28px;padding-right:28px}.am-contact-inner{gap:50px}.am-clients{padding-left:28px;padding-right:28px}}
@media(max-width:680px){.am-portfolio{font-size:13px}.am-portfolio .am-header{height:65px;padding:0 20px}.am-wordmark-name{font-size:11px}.am-desktop-nav{display:none}.am-header-actions{gap:8px}.am-header-cta{height:33px;padding:0 11px;font-size:10px}.am-theme-toggle{width:33px;height:33px}.am-menu-toggle{display:grid;width:33px;height:33px}.am-mobile-nav{display:flex;position:absolute;top:64px;left:0;right:0;padding:15px 20px 19px;background:var(--am-bg);border-bottom:1px solid var(--am-line);flex-direction:column;box-shadow:0 12px 24px rgba(20,20,30,.08)}.am-mobile-nav a{display:flex;align-items:center;gap:13px;padding:12px 1px;border-bottom:1px solid var(--am-line);font-size:13px;font-weight:600}.am-mobile-nav a:last-child{border-bottom:0}.am-mobile-nav .am-mono{color:var(--am-indigo);font-size:8px}.am-mobile-nav svg{margin-left:auto;color:var(--am-indigo)}.am-portfolio .am-hero{padding:0 20px;min-height:590px}.am-hero-meta{font-size:7px!important;gap:12px;padding-top:20px}.am-hero-meta>span:last-child{font-size:7px}.am-hero-center{padding:72px 0 57px}.am-hero h1{font-size:clamp(48px,12.2vw,74px)}.am-hero-role{font-size:12px;margin:21px 0 22px}.am-hero-stamp{right:2%;top:12%;width:66px;height:66px;font-size:6px!important}.am-orbit-one{width:300px;height:300px}.am-orbit-two{width:370px;height:370px}.am-hero-bottom{font-size:7px!important}.am-hero-bottom>span:last-child{display:none}.am-mobile-break{display:block}.am-section{padding-left:20px;padding-right:20px}.am-projects{padding-top:75px;padding-bottom:60px}.am-section-head{display:block}.am-section-head h2{font-size:43px}.am-section-intro{margin-top:17px;max-width:400px;font-size:11px}.am-filter-row{gap:7px;margin:26px 0 17px}.am-filter-label{width:100%;margin-bottom:3px}.am-filter-pill{font-size:9px!important;padding:0 10px;height:28px}.am-project-grid{grid-template-columns:1fr;gap:28px}.am-project-card:nth-child(even){margin-top:0}.am-project-art,.am-project-tall .am-project-art,.am-project-wide .am-project-art{height:clamp(245px,68vw,370px)}.am-project-caption h3{font-size:14px}.am-project-tag{font-size:7px!important}.am-projects-foot{margin-top:30px;font-size:7px!important}.am-statement-inner{min-height:220px;padding:45px 23px}.am-statement-mark{font-size:58px;margin-right:9px}.am-statement-inner p{font-size:26px}.am-statement-note{right:20px;bottom:16px;font-size:6px!important}.am-about{padding-top:75px;padding-bottom:74px}.am-about-layout{grid-template-columns:1fr;gap:36px;margin-top:32px}.am-about-art{max-width:420px;margin:auto;width:calc(100% - 13px)}.am-about-photo{height:clamp(295px,90vw,380px)}.am-about-sticker{right:-13px;top:17px;width:76px;height:76px}.am-about-side-note{left:-20px}.am-about-copy{max-width:500px}.am-about-lead{font-size:18px}.am-about-copy>p:not(.am-about-lead){font-size:11px}.am-about-stats{gap:25px}.am-about-stats strong{font-size:25px}.am-about-stats>div>span{font-size:6px}.am-skills{padding:58px 0 61px}.am-skills-inner{padding:0 20px;grid-template-columns:1fr;gap:28px}.am-skills-heading h2{font-size:39px}.am-skill-line{grid-template-columns:36px 1fr 18px;gap:10px;padding:15px 0}.am-skill-icon{width:34px;height:34px}.am-skill-line h3{font-size:12px}.am-skill-line p{font-size:9px;line-height:1.6}.am-tools-row{gap:7px}.am-tools-row>span{width:100%;margin-bottom:2px}.am-tool{height:27px;padding:0 7px;font-size:8px}.am-process{padding-top:76px;padding-bottom:74px}.am-process-track{grid-template-columns:1fr 1fr;gap:34px 20px;margin-top:40px}.am-process-track:before{display:none}.am-process-step{padding-top:41px}.am-process-step h3{font-size:15px}.am-process-step p{font-size:10px}.am-process-foot{margin-top:35px;font-size:7px!important;gap:13px}.am-clients{padding:57px 20px 60px}.am-clients-top{display:block}.am-clients-sub{font-size:10px;margin-top:16px}.am-client-list{padding:30px 3px;display:grid;grid-template-columns:repeat(3,1fr);gap:25px 15px;justify-items:center}.am-client-norte{font-size:18px}.am-client-sonora{font-size:20px}.am-client-barrio{font-size:11px}.am-client-marea{font-size:17px}.am-client-pulso{font-size:15px}.am-testimonial{margin-top:28px;padding:21px 18px 17px}.am-testimonial-quote{gap:9px;min-height:132px}.am-quote-mark{font-size:39px}.am-testimonial blockquote{font-size:13px;line-height:1.65;margin:4px 0 19px}.am-person strong{font-size:9px}.am-person span{font-size:8px}.am-person-avatar{width:30px;height:30px}.am-slide-count{font-size:7px!important;margin-right:2px}.am-slider-controls{gap:4px}.am-slider-controls button{width:27px;height:27px}.am-contact{padding:66px 20px 19px}.am-contact-inner{grid-template-columns:1fr;gap:35px;margin-bottom:48px}.am-contact-copy h2{font-size:59px;margin:27px 0 16px}.am-contact-description{font-size:11px}.am-email-link{font-size:13px}.am-contact-form{padding:20px 18px 17px}.am-contact-bottom{font-size:6px!important;gap:15px}.am-contact-bottom>span:last-child{text-align:right}.am-footer{height:67px;padding:0 20px}.am-footer-note{display:none}.am-footer-copy{font-size:7px!important}.am-footer>div{gap:13px}.am-back-top{font-size:7px!important}.am-dialog-backdrop{padding:10px;align-items:flex-end}.am-dialog{max-height:94dvh;width:100%}.am-dialog-top{padding:0 15px}.am-dialog-art{height:180px}.am-dialog-body{padding:22px 20px 20px}.am-dialog-heading h2{font-size:29px}.am-dialog-intro{font-size:12px}.am-case-columns{gap:17px}.am-case-columns p,.am-case-outcome p{font-size:9px}.am-dialog-footer{padding:0 13px}.am-dialog-footer button{font-size:7px;gap:5px}}
@media(prefers-reduced-motion:reduce){.am-portfolio *, .am-portfolio *:before,.am-portfolio *:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.am-portfolio [data-reveal],.am-portfolio .am-project-card,.am-portfolio .am-skill-line,.am-portfolio .am-process-step{opacity:1;translate:0 0}}
html:has(.am-portfolio){scroll-behavior:smooth}
.am-mark{display:flex;align-items:center;justify-content:center}
.am-hero h1>span{font-weight:500;color:var(--am-indigo);font-style:italic;letter-spacing:-.09em}
.am-stamp-star{transform:rotate(45deg)}
@media(prefers-reduced-motion:reduce){html:has(.am-portfolio){scroll-behavior:auto!important}}
.am-hero h1{font-size:clamp(60px,10vw,126px);line-height:.82;letter-spacing:-.085em}
.am-hero h1 .am-name-line{display:block;white-space:nowrap;font-style:normal;color:var(--am-ink);font-weight:800;letter-spacing:-.085em}
.am-hero h1>span.am-name-line:first-child{color:var(--am-ink);font-style:normal;font-weight:800}
.am-hero h1 .am-name-accent{color:var(--am-indigo);font-weight:500;font-style:italic;letter-spacing:-.1em}
.am-hero-promise{font-size:clamp(17px,2.1vw,23px);line-height:1.35;letter-spacing:-.045em;margin:22px 0 5px;font-weight:500;color:var(--am-muted)}
.am-hero-role{margin:0 0 24px;min-height:25px}
.am-hero-role .am-typed{min-width:0}
.am-work-link{position:relative;display:inline-flex;align-items:center;gap:9px;padding:7px 0 8px;border-bottom:1px solid var(--am-line);color:var(--am-ink)!important;font-size:11px;font-weight:700;transition:color .2s}
.am-work-link:after{content:"";position:absolute;left:0;bottom:-1px;width:100%;height:2px;background:var(--am-indigo);transform:scaleX(0);transform-origin:right;transition:transform .28s}
.am-work-link:hover{color:var(--am-indigo)!important}
.am-work-link:hover:after{transform:scaleX(1);transform-origin:left}
.am-work-link svg{color:var(--am-indigo);transition:transform .2s}
.am-work-link:hover svg{transform:translateY(3px)}
@media(max-width:680px){.am-hero h1{font-size:clamp(49px,14vw,68px);line-height:.8}.am-hero-promise{font-size:16px;max-width:310px;margin:22px 0 6px}.am-hero-role{font-size:12px;margin:0 0 22px}}
.am-portfolio{overflow:clip}
.am-portfolio .am-header{position:sticky;top:0;z-index:60;background:rgba(247,247,245,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom-color:rgba(28,29,34,.12)}
.am-dark .am-header{background:rgba(23,24,29,.94);border-bottom-color:var(--am-line)}
html:has(.am-portfolio){scroll-padding-top:78px}
.am-about-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.am-about-actions .am-text-link{margin-top:13px}
.am-cv-pending{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:0 12px;border:1px solid var(--am-line);background:transparent;color:var(--am-muted);font-size:9px;font-weight:700;cursor:not-allowed}
.am-cv-pending:disabled{opacity:.8}
.am-cv-pending svg{color:var(--am-indigo)}
.am-skill-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.am-skill-group{min-width:0;border-top:1px solid #d1d0c8;padding-top:14px}
.am-skill-group-head{display:flex;align-items:center;gap:10px;margin-bottom:21px}
.am-skill-group-head .am-skill-icon{flex:none}
.am-skill-group-head .am-mono{display:block;font-size:7px!important;color:#77786f}
.am-skill-group-head h3{font-size:16px;letter-spacing:-.04em;margin:4px 0 0}
.am-skill-meter-row{margin:0 0 16px}
.am-skill-meter-row>span{display:block;font-size:10px;margin-bottom:7px;color:#404047}
.am-skill-meter{height:4px;background:#d6d6cf;border-radius:8px;overflow:hidden}
.am-skill-meter>span{display:block;height:100%;background:var(--am-indigo);border-radius:inherit}
.am-dark .am-skill-group{border-color:#393a42}
.am-dark .am-skill-group-head .am-mono{color:#aaa9b2}
.am-dark .am-skill-meter-row>span{color:#ddd}
.am-dark .am-skill-meter{background:#484952}
.am-contact{background:#463bd0;color:#fff}
.am-contact:after{border-color:rgba(255,255,255,.17);box-shadow:0 0 0 50px rgba(255,255,255,.04),0 0 0 100px rgba(255,255,255,.025)}
.am-contact-copy .am-kicker{color:#eceaff}
.am-contact-copy .am-kicker>span{color:#d6ef62}
.am-contact-description{color:#eeecff}
.am-email-link{color:#fff!important;border-bottom-color:rgba(255,255,255,.55)}
.am-contact-socials{display:flex;gap:8px;flex-wrap:wrap;margin-top:26px}
.am-contact-socials a{width:auto;min-height:36px;padding:0 11px;border:1px solid rgba(255,255,255,.5);border-radius:999px;display:flex;align-items:center;gap:7px;color:#fff;font-size:10px;font-weight:600;transition:background .2s,color .2s,border-color .2s,transform .2s}
.am-contact-socials a:hover{background:#fff;color:#352ca8;border-color:#fff;transform:translateY(-2px)}
.am-behance-mark{font-size:12px;font-weight:800;letter-spacing:-.12em}
.am-calendly-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:14px;color:#fff!important;font-size:11px;font-weight:700}
.am-calendly-link>svg{transition:transform .2s}
.am-calendly-link:hover>svg{transform:translate(3px,-3px)}
.am-calendly-note{padding:4px 6px;border:1px solid rgba(255,255,255,.38);color:#efedff;font-size:7px!important}
.am-link-note{max-width:360px;color:#e2dfff;font-size:9px;line-height:1.6;margin:0}
.am-contact-form{background:#352ca8;border-color:rgba(255,255,255,.27)}
.am-form-head{border-bottom-color:rgba(255,255,255,.28);color:#fff}
.am-form-indicator{color:#f2f0ff}
.am-contact-form label{color:#f4f2ff}
.am-contact-form select{font:inherit}
.am-contact-form input,.am-contact-form select,.am-contact-form textarea{border-bottom-color:rgba(255,255,255,.52);color:#fff;color-scheme:dark}
.am-contact-form input::placeholder,.am-contact-form select:invalid,.am-contact-form textarea::placeholder{color:#dedbff}
.am-contact-form select option{background:#fff;color:#252342}
.am-contact-form input:focus,.am-contact-form select:focus,.am-contact-form textarea:focus{border-color:#d6ef62}
.am-submit{background:#d6ef62;color:#252342}
.am-submit:hover{background:#e4f58c}
.am-submit-loader{border-color:rgba(37,35,66,.25);border-top-color:#252342}
.am-form-foot{color:#e1defa}
.am-form-error{color:#ffe0d9}
.am-form-success{background:#244c3b;border-color:#83c8a3;color:#e9fff2}
.am-form-success>span{background:#34654e;color:#fff}
.am-contact-bottom{border-top-color:rgba(255,255,255,.32);color:#e2dfff}
.am-contact-bottom span span{color:#d6ef62}
.am-contact button:focus-visible,.am-contact a:focus-visible,.am-contact input:focus-visible,.am-contact select:focus-visible,.am-contact textarea:focus-visible{outline-color:#d6ef62}
@media(max-width:900px){.am-skills-inner{grid-template-columns:1fr;gap:30px}}
@media(max-width:680px){.am-skill-groups{grid-template-columns:1fr;gap:15px}.am-skill-group{padding:14px 0 2px}.am-skill-group-head{margin-bottom:15px}.am-contact-inner{gap:31px}.am-contact-form{padding:20px 18px 17px}.am-contact-socials{gap:6px}.am-contact-socials a{min-height:38px;padding:0 9px;font-size:9px}.am-calendly-link{flex-wrap:wrap}.am-link-note{max-width:100%}}
`;

export { Portfolio };
export default Portfolio;
