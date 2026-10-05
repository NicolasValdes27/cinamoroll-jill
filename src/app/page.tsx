"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
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

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [openedClouds, setOpenedClouds] = useState<number[]>([]);
  const [isFinale, setIsFinale] = useState(false);

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

            {isFinale && (
              <div className={styles.finalImageWrap}>
                <Image
                  className={styles.finalImage}
                  src="/cinnamoroll-correo.webp"
                  alt="Cinnamoroll asomándose desde un sobre rodeado de cartas"
                  width={277}
                  height={180}
                  priority
                />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
