"use client";

import { Cross1Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import IconButton from "./iconButton";

function InfoLink({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="opacity-45 hover:opacity-70 transition-opacity"
    >
      {children}
    </Link>
  );
}

type Props = {
  setInfosVisibility: (value: boolean) => void;
};

export default function InfosModal({ setInfosVisibility }: Props) {
  // Close the modal
  const handleClose = useCallback(() => {
    setInfosVisibility(false);
  }, [setInfosVisibility]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  // Close on click outside
  const infoModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        infoModalRef.current &&
        !infoModalRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full p-4 sm:p-8 z-50 bg-black/25 backdrop-blur-sm">
      <div
        ref={infoModalRef}
        className="bg-white h-full w-full rounded-2xl shadow-lg max-w-screen-xl mx-auto relative overflow-x-scroll"
        role="popover"
      >
        <div className="sticky top-0 flex justify-end w-full p-4 gap-3">
          <Link
            className="size-9 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
            href="#"
            target="_blank"
            title="Voir le code source"
          >
            <GitHubLogoIcon className="size-5" />
          </Link>

          <IconButton
            Icon={Cross1Icon}
            label="Fermer la modale"
            onClick={handleClose}
          />
        </div>

        <section className="grid grid-cols-12 gap-6 pb-14 border-b border-black px-5 sm:px-10">
          <h1 className="col-span-12 md:col-span-7 text-3xl md:text-5xl">
            <span className="opacity-40">Entre crises et revendications</span>
            <br />
            Les évolutions des courants politiques au sein de l’Assemblée
            Nationale*
          </h1>
          <div className="col-span-12 md:col-span-5 flex flex-col items-start text-xl md:text-2xl">
            <p className="opacity-75">
              Ce site est une représentation visuelle des résultats des
              élections législatives françaises depuis la première assemblée
              nationale législative en 1791.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-6 px-5 sm:px-10 pb-8">
          <article className="col-span-12 sm:col-span-7 py-8 border-b border-black max-w-prose flex flex-col gap-4">
            <p>
              Cette visualisation a été réalisée à partir de données de sources
              variées, mais principalement depuis la liste des législatures
              françaises sur{" "}
              <InfoLink
                href={
                  "https://fr.wikipedia.org/wiki/Liste_des_l%C3%A9gislatures_fran%C3%A7aises"
                }
              >
                Wikipédia
              </InfoLink>
              . Plus les données sont anciennes, moins elles sont précises. En
              effet, les concepts de parti politique ou de groupe parlementaire
              n&apos;ont pas toujours existé et les députés ont pu changer de
              parti en cours de mandat. Les données sont donc à prendre avec
              précaution.
            </p>
            <p>
              De plus, il a fallut trancher de manière arbitraire sur
              l&apos;appartenance de chaque parti ou député à un courant
              politique. Les nuances et les évolutions des partis politiques ne
              sont d&apos;ailleurs pas forcément prises en compte. Ajoutons à
              cela que les familles politiques telles que la droite ou la gauche
              sont des notions qui, au fil du temps, ont pu se déplacer.
              L&apos;extrême gauche du début de la III<sup>e</sup> République
              pourrait correspondre aujourd&apos;hui à un positionnement
              centriste. Pour plus de clarté, j&apos;ai décidé de classer les
              partis dans des repères plutôt actuels.
            </p>
            <p>
              Enfin, j&apos;ai souhaité représenter les accords éléctoraux entre
              partis par des coalitions. Celles-ci permettent de mieux
              comprendre les rapports de force qui s&apos;opèrent. Elles
              n&apos;ont pas toujours les mêmes modalités, et plus les éléctions
              sont anciennes, moins les informations sont accessibles.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-5 py-8 border-b border-black max-w-prose flex flex-col gap-4">
            <p>
              * Les assemblées ont prit différentes formes et différents noms,
              les modes de scrutin ont évolué et l&apos;Histoire a avancé en
              rendant chaque élection unique par les enjeux politiques et
              sociaux de l&apos;époque. Ce site propose une vision synthétique,
              et donc incomplète quant aux contextes entourant chaque élection.
            </p>
            <p>
              Cependant, des événements marquants sont placés en marge du
              graphique principal pour contextualiser davantage les résultats
              dans les rapports sociaux et (géo)politiques de l&apos;époque.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-7 py-8 max-w-prose flex flex-col gap-4">
            <p>
              Ce graphique est inspirée du superbe travail de{" "}
              <InfoLink href="https://mastodon.social/@tomfevrier/112751171765233201">
                Tom Février et Marie Patino
              </InfoLink>{" "}
              pour{" "}
              <InfoLink href="https://www.bloomberg.com/graphics/2024-french-election-results/">
                cet article de Bloomberg
              </InfoLink>
              . En le découvrant, j&apos;aurais aimé pouvoir l&apos;étendre
              jusqu&apos;à la révolution de 1789. C&apos;est donc ce que
              j&apos;ai fait. Je l&apos;ai fait pour le plaisir, pour apprendre
              à créer des visualisations de données, et pour mieux comprendre
              l&apos;histoire politique de la France.
            </p>
            <p>
              J&apos;espère que vous prendrez autant de plaisir à le consulter,
              qu&apos;il vous apportera connaissances ou mises en perspectives.
              Si vous y rencontrez des erreurs, des imprécisions, des oublis, ou
              si vous avez des suggestions,{" "}
              <a
                href="mailto:"
                className="text-blue-500 hover:opacity-70 transition-opacity"
              >
                n&apos;hésitez pas à me contacter
              </a>
              . Je n&apos;ai pas été totalement méthodique dans mon approche, et
              j&apos;ai pu commettre des erreurs. Je suis ouvert à toute
              critique constructive, tant sur le contenu que sur le code.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-5 py-8 max-w-prose flex flex-col gap-4">
            <p>
              Je remercie également{" "}
              <span className="text-blue-500">
                {"{"}dites-moi si vous voulez apparaitre là dedans ou non{"}"}
              </span>{" "}
              pour leurs explications et retours.{" "}
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
