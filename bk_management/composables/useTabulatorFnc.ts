export const useTabulatorFnc = () => {
  interface FilterValues {
    start: string;
    end: string;
  }
  interface EditorParams {
    [key: string]: any;
  }
  const minMaxFilterEditor = (
    cell: any,
    onRendered: () => void,
    success: (values: FilterValues) => void,
    cancel: () => void,
    editorParams: EditorParams
  ): HTMLElement => {
    let end: HTMLInputElement;

    const container = document.createElement("span");

    const start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", "0");
    start.setAttribute("max", "100");
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue() || "";

    function buildValues() {
      success({
        start: start.value,
        end: end.value,
      });
    }

    function keypress(e: KeyboardEvent) {
      if (e.key === "Enter") {
        buildValues();
      }

      if (e.key === "Escape") {
        cancel();
      }
    }

    end = start.cloneNode() as HTMLInputElement;
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);

    container.appendChild(start);
    container.appendChild(end);

    return container;
  };

  const minMaxFilterFunction = (
    headerValue: FilterValues,
    rowValue: number,
    rowData: any,
    filterParams: any
  ): boolean => {
    if (rowValue) {
      if (headerValue.start !== "") {
        if (headerValue.end !== "") {
          return (
            rowValue >= Number(headerValue.start) &&
            rowValue <= Number(headerValue.end)
          );
        } else {
          return rowValue >= Number(headerValue.start);
        }
      } else if (headerValue.end !== "") {
        return rowValue <= Number(headerValue.end);
      }
    }

    return true;
  };

  return {
    minMaxFilterEditor,
    minMaxFilterFunction,
  };
};
