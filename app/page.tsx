"use client";

import { useEffect, useState } from "react";
import FiltersLine from "../components/appUi/filtersLine";
import Main from "../components/appUi/main";
import { useVisibleCurrentsContext } from "../components/utils/contexts/currentsContext";
import { FamilyType } from "../types/family";
import { RepublicType } from "../types/republic";
import { CurrentType } from "../types/current";
import { EventType } from "../types/event";
import SettingsLine from "../components/appUi/settingsLine";
import republicsData from "../public/data/republics.json";
import familiesData from "../public/data/currents.json";
import eventsData from "../public/data/events.json";
import InfosModal from "../components/appUi/infosModal";
import { useTransitionsContext } from "../components/utils/contexts/transitionsContext";
import { useCoalitionsContext } from "../components/utils/contexts/coalitionsContext";
import Link from "next/link";

export default function HomePage() {
  const [republics, setRepublics] = useState<RepublicType[] | null>(null);
  const [currents, setCurrents] = useState<CurrentType[] | null>(null);
  const [families, setFamilies] = useState<FamilyType[] | null>(null);
  const [events, setEvents] = useState<EventType[] | null>(null);
  const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
  const [eventVisibility, setEventVisibility] = useState(false);
  const [referenceSize, setReferenceSize] = useState(28);
  const [infosVisibility, setInfosVisibility] = useState(false);
  const { transitionsVisibility, setTransitionsVisibility } =
    useTransitionsContext();
  const { coalitionsVisibility, setCoalitionsVisibility } =
    useCoalitionsContext();

  // Fetch the data
  useEffect(() => {
    const currentsData = familiesData.families.flatMap(
      (family: FamilyType) => family.currents
    );
    setRepublics(republicsData.republics);
    setCurrents(currentsData);
    setVisibleCurrents(currentsData);
    setFamilies(familiesData.families);
    setEvents(eventsData.events);
  }, [setVisibleCurrents]); // Add republicsData, familiesData, eventsData to auto update when json files are updated (dev mode)

  return (
    <>
      <Link
        href="#chart"
        className="sr-only"
        role="navigation"
        aria-label="Accès rapide"
      ></Link>
      <SettingsLine
        eventVisibility={eventVisibility}
        setEventVisibility={(newValue) => setEventVisibility(newValue)}
        referenceSize={referenceSize}
        setReferenceSize={(newSize) => setReferenceSize(newSize)}
        setInfosVisibility={setInfosVisibility}
        transitionsVisibility={transitionsVisibility}
        setTransitionsVisibility={(newValue) =>
          setTransitionsVisibility(newValue)
        }
        coalitionsVisibility={coalitionsVisibility}
        setCoalitionsVisibility={(newValue) =>
          setCoalitionsVisibility(newValue)
        }
      />

      <Main
        republics={republics}
        currents={currents}
        events={events}
        eventsVisibility={eventVisibility}
        referenceSize={referenceSize}
      />

      <FiltersLine families={families} />

      {infosVisibility && (
        <InfosModal setInfosVisibility={setInfosVisibility} />
      )}
    </>
  );
}
