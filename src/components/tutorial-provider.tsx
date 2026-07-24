"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_KEY = "viralbook_tutorial_completed";

export function startTutorial() {
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('viralbook_lang') : 'pt';
  const isEn = savedLang === 'en';
  const isEs = savedLang === 'es';

  const driverObj = driver({
    showProgress: true,
    doneBtnText: isEn ? "Complete" : isEs ? "Completar" : "Concluir",
    nextBtnText: isEn ? "Next" : isEs ? "Siguiente" : "Próximo",
    prevBtnText: isEn ? "Previous" : isEs ? "Anterior" : "Anterior",
    popoverClass: "driverjs-theme",
    steps: [
      {
        element: '[data-tour="sidebar-radar"]',
        popover: {
          title: isEn ? "Ebook Radar" : isEs ? "Radar de Ebooks" : "Radar de Livros",
          description: isEn 
            ? "Start here! Scan high-converting Amazon & Google Books to uncover real market pain points." 
            : isEs 
            ? "¡Empiece por aquí! Escanee ebooks populares para descubrir dolores reales del mercado." 
            : "Comece por aqui! Vasculhe o banco de dados de e-books em alta na Amazon para descobrir quais dores as pessoas estão tentando resolver agora.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="sidebar-library"]',
        popover: {
          title: isEn ? "Idea Library" : isEs ? "Biblioteca de Ideas" : "Biblioteca de Ideias",
          description: isEn 
            ? "Create your own startup. Use AI to cross audiences, problem statements, and monetization models." 
            : isEs 
            ? "Cree su propia startup. Use IA para cruzar audiencias, problemas y modelos de monetización." 
            : "Crie sua própria startup. Use nossa inteligência artificial para cruzar públicos, problemas e métodos de monetización.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="sidebar-dashboard"]',
        popover: {
          title: isEn ? "Opportunities Dashboard" : isEs ? "Dashboard de Oportunidades" : "Dashboard de Oportunidades",
          description: isEn 
            ? "Where the magic happens. Track generated Micro-SaaS, inspect Lean Canvas, and copy build prompts." 
            : isEs 
            ? "Aquí ocorre la magia. Siga los Micro-SaaS generados, vea el Lean Canvas y copie prompts." 
            : "Aqui é onde a mágica acontece. Acompanhe os Micro-SaaS que você gerou, veja o Lean Canvas de cada um e copie os prompts de desenvolvimento.",
          side: "right",
          align: "start"
        }
      },
      {
        element: '[data-tour="global-filters"]',
        popover: {
          title: isEn ? "Global Filters" : isEs ? "Filtros Globales" : "Filtros Globais",
          description: isEn 
            ? "Use these filters at any time to analyze specific target regions or 24h market trends." 
            : isEs 
            ? "Use estos filtros en cualquier momento para analizar mercados específicos o tendencias de 24h." 
            : "Use estes filtros a qualquer momento para analisar mercados específicos ou buscar tendências das últimas 24h.",
          side: "bottom",
          align: "center"
        }
      }
    ],
    onDestroyStarted: () => {
      if (!driverObj.hasNextStep() || confirm(isEn ? "Are you sure you want to exit the tour?" : isEs ? "¿Está seguro de que desea salir del tour?" : "Tem certeza que deseja fechar o tutorial?")) {
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
