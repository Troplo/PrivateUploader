import { registerWidget } from "@troplo/debug-overlay/src";
import ExperimentsManager from "@/components/Dev/ExperimentsManager.vue";
import { h } from "vue";
import NetworkInspector from "@/components/Dev/Dialogs/NetworkInspector.vue";
import SocketProfiler from "@/components/Dev/Dialogs/SocketProfiler.vue";
import MemoryProfiler from "@/components/Dev/Dialogs/MemoryProfiler.vue";
import ExperimentsEmergencyOverride from "@/components/Dev/Dialogs/ExperimentsEmergencyOverride.vue";
import BrandingDebug from "@/components/Dev/Dialogs/BrandingDebug.vue";
import ChatDevOptionsDialog from "@/components/Dev/Dialogs/ChatDevOptionsDialog.vue";
import RegisterExperienceDebug from "@/components/Dev/Dialogs/RegisterExperienceDebug.vue";
import DialogDebug from "@/components/Dev/Dialogs/DialogDebug.vue";
import UISettingsDebug from "@/components/Dev/Dialogs/UISettingsDebug.vue";

export function registerCoreWidgets() {
  registerWidget({
    title: "Experiments",
    component: h(ExperimentsManager),
    active: false,
    category: "Admin"
  });

  registerWidget({
    title: "Emergency Experiment Override",
    component: h(ExperimentsEmergencyOverride),
    active: false,
    category: "Admin"
  });

  registerWidget({
    title: "Network Inspector",
    component: h(NetworkInspector),
    active: false
  });

  registerWidget({
    title: "Legacy Socket Profiler",
    component: h(SocketProfiler),
    active: false
  });

  registerWidget({
    title: "Memory Profiler",
    component: h(MemoryProfiler),
    active: false
  });

  registerWidget({
    title: "Dialog Triggers",
    component: h(DialogDebug),
    active: false
  });

  registerWidget({
    title: "Branding",
    component: h(BrandingDebug),
    active: false,
    category: "UI"
  });

  registerWidget({
    title: "Chat Info",
    component: h(ChatDevOptionsDialog),
    active: false,
    category: "Chat"
  });

  registerWidget({
    title: "UI Settings",
    component: h(UISettingsDebug),
    active: false,
    category: "UI"
  });

  registerWidget({
    title: "Register Experience",
    component: h(RegisterExperienceDebug),
    active: false,
    category: "UI"
  });
}
