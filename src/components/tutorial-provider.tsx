"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_KEY = "viralbook_tutorial_completed";

export function startTutorial() {
  const driverObj = driver({
    showProgress: true,
    doneBtnText: "Concluir",
    nextBtnText: "Próximo",
    prevBtnText: "Anterior",
    popoverClass: "driverjs-theme",
    steps: [
      {
        element: '[data-tour="sidebar-radar"]',
        popover: {
          title: "Radar de Livros",
          description: "Comece por aqui! Vasculhe o banco de dados de e-books em alta na Amazon para descobrir quais dores as pessoas estão tentando resolver agora.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="sidebar-library"]',
        popover: {
          title: "Biblioteca de Ideias",
          description: "Crie sua própria startup. Use nossa inteligência artificial para cruzar públicos, problemas e métodos de monetização.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="sidebar-dashboard"]',
        popover: {
          title: "Dashboard de Oportunidades",
          description: "Aqui é onde a mágica acontece. Acompanhe os Micro-SaaS que você gerou, veja o Lean Canvas de cada um e copie os prompts de desenvolvimento.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="global-filters"]',
        popover: {
          title: "Filtros Globais",
          description: "Use estes filtros a qualquer momento para analisar mercados específicos ou buscar tendências das últimas 24h.",
          side: "bottom",
          align: "center"
        }
      }
    ],
    onDestroyStarted: () => {
      if (!driverObj.hasNextStep() || confirm("Tem certeza que deseja fechar o tutorial?")) {
        localStorage.setItem(STORAGE_KEY, "true");
        driverObj.destroy();
      }
    },
  });

  driverObj.drive();
}

export function TutorialProvider() {
  useEffect(() => {
    // Only run the tutorial automatically if it's not completed
    // We add a small delay to ensure the UI is fully rendered
    const timeout = setTimeout(() => {
      const isCompleted = localStorage.getItem(STORAGE_KEY);
      if (!isCompleted) {
        startTutorial();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
