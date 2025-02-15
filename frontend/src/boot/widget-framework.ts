import { install } from "@troplo/debug-overlay/src";
import { registerCoreWidgets } from "@/widgets/core";

export default async function setupWidgets(app) {
  install({
    // On Flowinity the expectation is that the widgets are always available even in production
    useFramework: true,
    log: true,
    platform: {
      version: import.meta.env.TPU_VERSION,
      name: "Flowinity",
      environment: import.meta.env.DEV ? "dev" : "prod"
    },
    app: app
  });
  registerCoreWidgets();
}
