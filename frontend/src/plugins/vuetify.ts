/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
//import "@flowinity/vuetify/styles";
//import "/home/troplo/GitHub/vuetify/packages/vuetify/src/styles/main.sass";
import "vuetify/lib/styles/main.sass";
// Composables
import { createVuetify } from "vuetify";
import {
  VBottomNavigation,
  VVirtualScroll,
  VDataTable,
  VInfiniteScroll,
  VSkeletonLoader
} from "vuetify/lib/components/index.mjs";
import {
  VTreeview,
  VTreeviewItem,
  VTreeviewGroup
} from "vuetify/labs/components";
import { aliases, iconify } from "@/plugins/vuetify-iconset";

export class DefaultThemes {
  themes: any;

  constructor(gold: boolean = false) {
    this.themes = {
      dark_v5: {
        colors: {
          surface: "#121212",
          "surface-bright": "#ccbfd6",
          "surface-variant": "#a3a3a3",
          "on-surface-variant": "#424242",
          "primary-darken-1": "#3700B3",
          "secondary-darken-1": "#03DAC5",
          primary: "#0190ea",
          logo1: "#096fea",
          logo2: "#0166ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#161616",
          toolbar: "#191919",
          sheet: "#151515",
          text: "#000000",
          dark: "#151515",
          background: "#191D20",
          background2: "#191D20",
          gold: "#ffd700"
        },
        dark: true
      },
      dark: {
        colors: {
          surface: "#212121",
          "surface-bright": "#ccbfd6",
          "surface-variant": "#a3a3a3",
          "on-surface-variant": "#424242",
          "primary-darken-1": "#3700B3",
          "secondary-darken-1": "#03DAC5",
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#161616",
          toolbar: "#191919",
          sheet: "#151515",
          text: "#000000",
          dark: "#151515",
          background: "#121212",
          background2: "#121212",
          gold: "#ffd700"
        }
      },
      amoled: {
        colors: {
          surface: "#000000",
          "surface-bright": "#ccbfd6",
          "surface-variant": "#a3a3a3",
          "on-surface-variant": "#424242",
          "primary-darken-1": "#3700B3",
          "secondary-darken-1": "#03DAC5",
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#000000",
          toolbar: "#121212",
          sheet: "#000000",
          text: "#000000",
          dark: "#000000",
          gold: "#ffd700",
          background: "#000000",
          background2: "#000000"
        },
        dark: true
      },
      light: {
        colors: {
          surface: "#ffffff",
          "surface-bright": "#ccbfd6",
          "surface-variant": "#e4e4e4",
          "on-surface-variant": "#d8d8d8",
          "primary-darken-1": "#3700B3",
          "secondary-darken-1": "#03DAC5",
          primary: gold ? "#FFD700" : "#0190ea",
          logo1: gold ? "#FFDB1B" : "#096fea",
          logo2: gold ? "#FFD700" : "#0166ea",
          secondary: "#757575",
          accent: "#121212",
          error: "#F44336",
          info: gold ? "#FFD700" : "#2196F3",
          success: "#4caf50",
          warning: "#ff9800",
          card: "#ffffff",
          toolbar: "#f5f5f5",
          sheet: "#fafafa",
          text: "#333333",
          dark: "#f7f7f7",
          background: "#f5f5f5",
          background2: "#f5f5f5",
          gold: "#ffd700"
        }
      }
    };
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VVirtualScroll,
    VBottomNavigation,
    VDataTable,
    VInfiniteScroll,
    VSkeletonLoader,
    VTreeview,
    VTreeviewItem,
    VTreeviewGroup
  },
  display: {
    thresholds: {
      xl: 1600,
      xs: 900
    },
    mobileBreakpoint: "xs"
  },
  icons: {
    aliases,
    sets: {
      ri: iconify,
      mdi: iconify
    }
  },
  defaults: {
    VMenu: {
      minWidth: 100
    },
    VWindowItem: {
      transition: false,
      reverseTransition: false
    },
    VWindow: {
      transition: false
    },
    VSkeletonLoader: {
      color: "card"
    },
    VAutoComplete: {
      variant: "underlined",
      color: "primary"
    },
    VDialog: {},
    VDataTable: {
      fixedHeader: true,
      noDataText: "No entries yet..."
    },
    VTable: {
      color: "card"
    },
    VCard: {
      elevation: 6,
      color: "card",
      rounded: "xl"
    },
    VExpansionPanels: {
      color: "card"
    },
    VExpansionPanel: {
      color: "toolbar"
    },
    VExpansionPanelHeader: {
      color: "card"
    },
    VExpansionPanelText: {
      color: "card"
    },
    VCheckbox: {
      color: "primary"
    },
    VSwitch: {
      color: "primary",
      inset: true
    },
    VToolbar: {
      color: "toolbar"
    },
    VBtn: {
      variant: "text"
    },
    VTab: {
      color: "primary"
    },
    VOverlay: {
      backgroundColor: "dark"
    },
    VSlider: {
      color: "primary"
    },
    VTextField: {
      //color: "primary"
      variant: "underlined",
      color: "primary"
    },
    VSelect: {
      color: "primary",
      variant: "underlined"
    },
    VAutocomplete: {
      color: "primary",
      variant: "underlined"
    },
    VContainer: {
      fluid: true
    },
    VList: {
      bgColor: "transparent"
    }
  },
  theme: {
    defaultTheme: ["dark", "amoled", "light", "dark_v5"].includes(
      localStorage.getItem("theme") || "dark"
    )
      ? localStorage.getItem("theme") || "dark"
      : "dark",
    themes: new DefaultThemes().themes
  }
});
