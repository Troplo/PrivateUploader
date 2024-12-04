import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import vuetify from "@/plugins/vuetify";
import HomeHandler from "@/views/HomeHandler.vue";
import main from "@/main";

global.ResizeObserver = require("resize-observer-polyfill");
