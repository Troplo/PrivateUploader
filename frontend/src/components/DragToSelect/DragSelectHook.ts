import { ref, unref, watch } from "vue";
import { Option } from "./DragSelectCommon";
import { useDragRect } from "./hooks/useDragRect";
import useAutoScrollByPoint from "./hooks/useAutoScrollByPoint";
import { MaybeNullableRef, MaybeRef, Position } from "./typings/internal";
import { rectIsIntersect } from "./utils/rectIsIntersect";

interface UseDragToSelectConfig {
  contentRef: MaybeNullableRef<HTMLElement>;
  containerRef: MaybeNullableRef<HTMLElement>;
  options: Set<Option>;
  onChange: (selectedOptions: Set<unknown>) => void;
  draggableOnOption: MaybeRef<boolean>;
  disabled: MaybeRef<boolean>;
  consumePointerDownedOnOption: () => boolean;
}

export function useDragToSelect({
  contentRef,
  containerRef,
  options,
  onChange,
  draggableOnOption,
  disabled,
  consumePointerDownedOnOption
}: UseDragToSelectConfig) {
  const pointPosition = ref<Position>([0, 0]);
  const dragged = ref(false);
  const {
    rect: areaRect,
    style: areaStyle,
    isDragging,
    stop
  } = useDragRect(contentRef, {
    disabled,
    onStart(e) {
      dragged.value = false;
      if (!unref(draggableOnOption) && consumePointerDownedOnOption()) {
        return false;
      }
      pointPosition.value = [e.clientX, e.clientY];
    },
    onMove(e) {
      dragged.value = true;
      // cursor may be not moved
      if (
        e.clientX !== pointPosition.value[0] ||
        e.clientY !== pointPosition.value[1]
      ) {
        pointPosition.value = [e.clientX, e.clientY];
      }
    }
  });

  useAutoScrollByPoint(containerRef, isDragging, pointPosition);

  watch(areaRect, () => {
    const newSelectedOptions = new Set();
    if (!areaRect.value) return;
    for (const { dom, value, disabled } of options) {
      if (areaRect.value.height < 50 && areaRect.value.width < 50) return;
      if (
        disabled ||
        rectIsIntersect(areaRect.value, {
          left: dom.offsetLeft,
          top: dom.offsetTop,
          width: dom.clientWidth,
          height: dom.clientHeight
        })
      ) {
        newSelectedOptions.add(value);
      }
    }
    onChange(newSelectedOptions);
  });

  return { dragged, isDragging, areaStyle, stop };
}
