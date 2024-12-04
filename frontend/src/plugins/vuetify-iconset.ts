import { h } from "vue";
import type { IconSet, IconAliases, IconProps } from "vuetify";
import json from "@iconify-json/ri/icons.json";
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine
} from "@remixicon/vue";

const aliases: IconAliases = {
  collapse: "arrow-up-s-line",
  expand: "arrow-down-s-line",
  complete: "check-line",
  cancel: "close-line",
  close: "close-line",
  delete: "close-line",
  clear: "close-line",
  magnify: "search-line",
  success: "check-line",
  info: "information-line",
  warning: "alert-line",
  error: "error-warning-line",
  prev: "arrow-left-s-line",
  next: "arrow-right-s-line",
  checkboxOn: "checkbox-fill",
  checkboxOff: "checkbox-blank-line",
  checkboxIndeterminate: "checkbox-indeterminate-fill",
  delimiter: "ellipsis",
  sortAsc: "arrow-up-s-line",
  sortDesc: "arrow-down-s-line",
  menu: "menu-line",
  subgroup: "arrow-down-s-line",
  dropdown: "arrow-down-s-line",
  radioOn: "radio-button-fill",
  radioOff: "checkbox-blank-circle-line",
  edit: "edit-line",
  ratingEmpty: "star-line",
  ratingFull: "star-fill",
  ratingHalf: "star-half-fill",
  loading: "refresh-line",
  first: "arrow-left-s-line",
  last: "arrow-right-s-line",
  unfold: "arrow-down-s-line",
  file: "file-line",
  plus: "add-line",
  minus: "subtraction-line",
  calendar: "calendar-line"
};

const iconify: IconSet = {
  component: (props: IconProps) => {
    if (typeof props.icon !== "string") {
      return props.icon;
    }
    let name = props.icon;
    if (props.icon.startsWith("mdi-") || props.icon.startsWith("ri-")) {
      if (
        !props.icon.includes("-fill") &&
        !props.icon.includes("-line") &&
        !props.icon.includes("-core") &&
        !props.icon.includes("-outline")
      ) {
        name = name + "-fill";
      } else if (props.icon.includes("-outline")) {
        name = name.replace("-outline", "-line");
      } else if (props.icon.includes("-core")) {
        name = name.replace("-core", "");
      }
      name = name.replace("mdi-", "").replace("ri-", "");
    }
    console.log(name);
    return h("i", {}, [
      h("svg", {
        class: ["ri"],
        debugName: name,
        innerHTML:
          json["icons"][name]?.body || json["icons"]["question-mark"].body,
        viewBox: "0 0 24 24"
      })
    ]);
  }
};

export { iconify, aliases };
