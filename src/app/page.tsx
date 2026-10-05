"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./page.module.css";

const cloudMessages = [
  "Me encantan tus patitas.",
  "Tienes una carita hermosa.",
  "Eres una persona maravillosa.",
  "Me encanta cuando me pides mimos.",
  "Me encanta que seas apasionada por tu carrera.",
  "Me encanta verte maquillarte.",
  "Tienes un corazoncito muy tierno.",
  "Es muy cómodo dormir contigo.",
  "Tu forma de dar amor es muy sincera.",
  "Eres una experta en doramas.",
  "Me encanta tu carita en las mañanas.",
  "Me encanta cuando me miras con cara de maldadosa.",
  "Me encanta tu pasión por Cinnamoroll.",
  "Tu carita cuando te doy flores es increíblemente bella.",
] as const;

type ButtonPosition = {
  x: number;
  y: number;
};

type HeartParticle = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
};

type HeartFinale = {
  hearts: HeartParticle[];
  messageDelay: number;
};

const NO_BUTTON_ESCAPES = 5;

function getRandomButtonPosition(previous: ButtonPosition): ButtonPosition {
  let nextPosition: ButtonPosition;

  do {
    nextPosition = {
      x: 10 + Math.random() * 80,
      y: 88 + Math.random() * 5,
    };
  } while (
    Math.hypot(nextPosition.x - previous.x, nextPosition.y - previous.y) < 32
  );

  return nextPosition;
}

function createHeartFinale(): HeartFinale {
  const positions = Array.from({ length: 64 }, (_, index) => ({
    id: index,
    x: ((index % 8) + 0.5) * 12.5 + (Math.random() - 0.5) * 4,
    y: (Math.floor(index / 8) + 0.5) * 12.5 + (Math.random() - 0.5) * 4,
    rotation: -18 + Math.random() * 36,
  }));

  for (let index = positions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [positions[index], positions[randomIndex]] = [
      positions[randomIndex],
      positions[index],
    ];
  }

  let elapsed = 0;
  const hearts = positions.map((position, index) => {
    const heart = { ...position, delay: elapsed };
    elapsed += Math.max(35, 180 - index * 2.5);
    return heart;
  });

  return { hearts, messageDelay: elapsed + 500 };
}

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [openedClouds, setOpenedClouds] = useState<number[]>([]);
  const [isFinale, setIsFinale] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [futureStep, setFutureStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [yesPosition, setYesPosition] = useState<ButtonPosition>({
    x: 42,
    y: 90,
  });
  const [noPosition, setNoPosition] = useState<ButtonPosition>({
    x: 58,
    y: 90,
  });
  const [noEscapes, setNoEscapes] = useState(0);
  const [heartFinale, setHeartFinale] = useState<HeartFinale | null>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const lastEscapeAt = useRef(0);

  useEffect(() => {
    if (openedClouds.length !== cloudMessages.length || isFinale) {
      return;
    }

    const finaleTimer = window.setTimeout(() => setIsFinale(true), 5000);

    return () => window.clearTimeout(finaleTimer);
  }, [openedClouds.length, isFinale]);

  const openCloud = (cloud: number) => {
    setOpenedClouds((current) =>
      current.includes(cloud) ? current : [...current, cloud],
    );
  };

  const moveNoButton = () => {
    const now = Date.now();

    if (noEscapes >= NO_BUTTON_ESCAPES || now - lastEscapeAt.current < 260) {
      return;
    }

    lastEscapeAt.current = now;
    setYesPosition(noPosition);
    setNoPosition(getRandomButtonPosition(noPosition));
    setNoEscapes((current) => current + 1);
  };

  const handleChoicePointerMove = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    const button = noButtonRef.current;

    if (!button || noEscapes >= NO_BUTTON_ESCAPES) {
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const distance = Math.hypot(
      event.clientX - (buttonRect.left + buttonRect.width / 2),
      event.clientY - (buttonRect.top + buttonRect.height / 2),
    );

    if (distance < 120) {
      moveNoButton();
    }
  };

  return (
    <main className={styles.page}>
      {step === 1 ? (
        <section className={styles.card} key="introduction">
          <h1>
            ¡Hola, Jill! ¡Soy Cinnamoroll y estoy aquí para mostrarte algo
            especial!
          </h1>

          <Image
            className={styles.character}
            src="/cinnamoroll-saludo.gif"
            alt="Cinnamoroll saludando alegremente"
            width={2048}
            height={2048}
            priority
            unoptimized
          />

          <button
            className={styles.button}
            type="button"
            onClick={() => setStep(2)}
          >
            Averigüemos más…
          </button>
        </section>
      ) : step === 2 ? (
        <section className={styles.card} key="message">
          <h1>
            Niko me contactó para enviarte unos mensajitos que tiene para ti.
            Para él eres muy especial; por ende, no dudé en ayudarlo.
          </h1>

          <Image
            className={`${styles.character} ${styles.mighty}`}
            src="/cinnamoroll-mighty.webp"
            alt="Cinnamoroll con una expresión tierna"
            width={1228}
            height={800}
            priority
          />

          <button
            className={styles.button}
            type="button"
            onClick={() => setStep(3)}
          >
            ¡Empecemos!
          </button>
        </section>
      ) : step === 3 ? (
        <section className={styles.card} key="coquita">
          <h1>Pero antes, toma esta coquita y ¡disfruta!</h1>

          <Image
            className={styles.character}
            src="/cinnamoroll-coquita.png"
            alt="Cinnamoroll sosteniendo dos vasos de bebida"
            width={512}
            height={512}
            priority
          />

          <button
            className={styles.button}
            type="button"
            onClick={() => setStep(4)}
          >
            ¡Ahora sí, empecemos!
          </button>
        </section>
      ) : (
        <section
          className={styles.cloudScreen}
          key="clouds"
          aria-label="Mensajes en las nubes"
        >
          <div className={styles.cloudField} aria-live="polite">
            <Image
              className={`${styles.cloudMascot} ${isFinale ? styles.mascotFinale : ""}`}
              src="/cinnamoroll-nubes.gif"
              alt="Cinnamoroll jugando en el centro de las nubes"
              width={348}
              height={245}
              priority
              unoptimized
            />

            {cloudMessages.map((message, index) => {
              const cloudNumber = index + 1;
              const isOpened = openedClouds.includes(cloudNumber);

              return (
                <button
                  className={`${styles.cloud} ${isOpened ? styles.cloudOpened : ""} ${isFinale ? styles.cloudFinale : ""}`}
                  type="button"
                  aria-label={`Abrir mensaje ${cloudNumber}`}
                  aria-expanded={isOpened}
                  disabled={isOpened}
                  key={cloudNumber}
                  onClick={() => openCloud(cloudNumber)}
                  style={
                    { "--cloud-delay": `${index * 120}ms` } as CSSProperties
                  }
                >
                  <Image
                    className={styles.cloudImage}
                    src="/nube-cinnamoroll.png"
                    alt=""
                    width={1785}
                    height={860}
                  />
                  {isOpened && (
                    <span className={styles.messageBubble}>{message}</span>
                  )}
                </button>
              );
            })}

            {isFinale && !showFinalMessage && (
              <button
                className={styles.finalImageWrap}
                type="button"
                aria-label="Abrir mensaje especial"
                onClick={() => setShowFinalMessage(true)}
              >
                <Image
                  className={styles.finalImage}
                  src="/cinnamoroll-correo.webp"
                  alt="Cinnamoroll asomándose desde un sobre rodeado de cartas"
                  width={277}
                  height={180}
                  priority
                />
              </button>
            )}

            {showFinalMessage && !showIcebreaker && (
              <section
                className={styles.finalMessage}
                role="dialog"
                aria-label="Mensaje especial"
              >
                <p>
                  Hola, mi amor. ¿Cómo estás? Te hice este sitio web para
                  mostrarte lo mucho que te quiero. Sé que en estos momentos
                  debes estar en shock por ver algo así, dedicado completamente
                  para ti. Ha sido un esfuerzo brígido hacerlo.
                </p>

                <p>
                  Solo quiero seguir acompañándote en tu camino, en tus logros,
                  en tus penas, en tus tonteras; definitivamente, en todo. Quiero
                  seguir contigo hasta el fin de los tiempos, tomando cafecito,
                  tecito, comiendo sushi y un montón de cosas más. Créeme que
                  amarte ha sido una de las cosas más lindas que me ha dado esta
                  vida y no quiero perderla. Quiero seguir estando contigo. Por
                  favor, te pido que me des una chance de demostrarte que ya no
                  debes lidiar con nada de lo malo que tengo. Trabajo desde hace
                  un tiempo en ello y seguiré trabajando ahora con gente que
                  sabe. Perdón que sea un poco tarde, pero realmente no quiero
                  perderte.
                </p>

                <p>
                  De todas formas, quiero disfrutar contigo todo: ver doramas,
                  pelis, etc. Quiero seguir haciendo las tonteras y descubriendo
                  nuevos lugares… juntos.
                </p>

                <p>
                  Para mí, esto es lo más importante: “juntos”. Eso es lo que
                  quiero. Quiero una vida junto a ti, que hagamos un camino
                  juntos…
                </p>

                <button
                  className={`${styles.button} ${styles.messageButton}`}
                  type="button"
                  onClick={() => setShowIcebreaker(true)}
                >
                  Continuemos…
                </button>
              </section>
            )}

            {showIcebreaker && futureStep === 0 && (
              <section
                className={styles.icebreaker}
                role="dialog"
                aria-label="Video para romper el hielo"
              >
                <h2>Pero rompamos el hielo un rato con…</h2>

                <div className={styles.videoFrame}>
                  <iframe
                    src="https://www.youtube.com/embed/Iru6yghQKL4"
                    title="Video para romper el hielo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <button
                  className={`${styles.button} ${styles.messageButton}`}
                  type="button"
                  onClick={() => setFutureStep(1)}
                >
                  ¡Sigamos!
                </button>
              </section>
            )}

            {futureStep === 1 && (
              <section
                className={styles.storyCard}
                role="dialog"
                aria-label="Mensaje de Cinnamoroll"
              >
                <h2>
                  Me enteré de que no quieres estar más con Niko, no porque no
                  lo ames, sino porque estás cansada de lidiar con ciertas
                  inseguridades y con ciertos sucesos relacionados con la
                  ansiedad…
                </h2>

                <Image
                  className={styles.storyImage}
                  src="/cinnamoroll-llorando.gif"
                  alt="Cinnamoroll llorando"
                  width={2048}
                  height={2048}
                  unoptimized
                />

                <button
                  className={`${styles.button} ${styles.messageButton}`}
                  type="button"
                  onClick={() => setFutureStep(2)}
                >
                  Leer más
                </button>
              </section>
            )}

            {futureStep === 2 && (
              <section
                className={styles.storyCard}
                role="dialog"
                aria-label="Mensaje sobre el futuro"
              >
                <h2>
                  Pero soy un lector del futuro, entonces sé que Niko ya no será
                  así y, según mis cálculos… ¡ustedes estarán juntos por siempre,
                  ya que ambos se aman mucho!
                </h2>

                <Image
                  className={styles.storyImage}
                  src="/cinnamoroll-futuro.png"
                  alt="Cinnamoroll observando el futuro con una bola de cristal"
                  width={1280}
                  height={1280}
                />

                <button
                  className={`${styles.button} ${styles.messageButton}`}
                  type="button"
                  onClick={() => setFutureStep(3)}
                >
                  Entonces…
                </button>
              </section>
            )}

            {futureStep === 3 && (
              <section
                className={styles.choiceScreen}
                aria-label="Pregunta final"
                onPointerMove={handleChoicePointerMove}
              >
                <div className={styles.choiceContent}>
                  <h2>¿Quieres seguir con él?</h2>

                  <Image
                    className={styles.choiceImage}
                    src={
                      noEscapes >= NO_BUTTON_ESCAPES
                        ? "/gato-sorpresa.gif"
                        : "/cinnamoroll-nosotros.jpg"
                    }
                    alt={
                      noEscapes >= NO_BUTTON_ESCAPES
                        ? "Gato mirando sorprendido"
                        : "Cinnamoroll abrazando a Spider-Man"
                    }
                    width={735}
                    height={695}
                    unoptimized={noEscapes >= NO_BUTTON_ESCAPES}
                  />

                  {noEscapes < NO_BUTTON_ESCAPES && <p>Nosotros</p>}
                </div>

                <button
                  className={`${styles.button} ${styles.choiceButton}`}
                  type="button"
                  onClick={() => setFutureStep(4)}
                  style={{
                    left:
                      noEscapes >= NO_BUTTON_ESCAPES
                        ? "50%"
                        : `${yesPosition.x}%`,
                    top:
                      noEscapes >= NO_BUTTON_ESCAPES
                        ? "88%"
                        : `${yesPosition.y}%`,
                    transform: `translate(-50%, -50%) scale(${noEscapes >= NO_BUTTON_ESCAPES ? 1.4 : 1})`,
                  }}
                >
                  Sí
                </button>

                {noEscapes < NO_BUTTON_ESCAPES && (
                  <button
                    ref={noButtonRef}
                    className={`${styles.button} ${styles.choiceButton}`}
                    type="button"
                    style={{
                      left: `${noPosition.x}%`,
                      top: `${noPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    No
                  </button>
                )}
              </section>
            )}

            {futureStep === 4 && (
              <section
                className={styles.storyCard}
                role="dialog"
                aria-label="Celebración"
              >
                <h2>¡Yupiii!</h2>

                <Image
                  className={styles.storyImage}
                  src="/gato-yupiii.webp"
                  alt="Gato celebrando con las patas levantadas"
                  width={512}
                  height={512}
                />

                <button
                  className={`${styles.button} ${styles.messageButton}`}
                  type="button"
                  onClick={() => setHeartFinale(createHeartFinale())}
                >
                  ¿Qué viene ahora?
                </button>
              </section>
            )}

            {heartFinale && (
              <section
                className={styles.heartFinale}
                aria-label="Mensaje final de amor"
                aria-live="polite"
              >
                {heartFinale.hearts.map((heart) => (
                  <Image
                    className={styles.fillingHeart}
                    src="/corazon-rojo.png"
                    alt=""
                    width={1349}
                    height={1166}
                    unoptimized
                    key={heart.id}
                    style={
                      {
                        left: `${heart.x}%`,
                        top: `${heart.y}%`,
                        "--heart-delay": `${heart.delay}ms`,
                        "--heart-rotation": `${heart.rotation}deg`,
                      } as CSSProperties
                    }
                  />
                ))}

                <h2
                  className={styles.loveMessage}
                  style={{ animationDelay: `${heartFinale.messageDelay}ms` }}
                >
                  Te amo
                </h2>

                <Image
                  className={styles.loveCat}
                  src="/gato-con-flores-transparente.png"
                  alt="Gatito sosteniendo un ramo de flores rosas"
                  width={1536}
                  height={1536}
                  style={{
                    animationDelay: `${heartFinale.messageDelay + 250}ms`,
                  }}
                />
              </section>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
