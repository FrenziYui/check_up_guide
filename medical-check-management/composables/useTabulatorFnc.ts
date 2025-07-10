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

    // 開始日入力フィールドの作成
    const start = document.createElement("input");
    start.setAttribute("type", "string");
    start.setAttribute("placeholder", "自");
    start.style.padding = "4px";
    start.style.width = "43%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue() || "";

    // 終了日入力フィールドの作成
    end = start.cloneNode() as HTMLInputElement;
    end.setAttribute("placeholder", "至");

    // クリアボタン（×）の作成
    const clearButton = document.createElement("button");
    clearButton.textContent = "×";
    clearButton.style.marginLeft = "8px";
    clearButton.style.background = "transparent";
    clearButton.style.border = "none";
    clearButton.style.cursor = "pointer";
    clearButton.style.fontSize = "16px";
    clearButton.addEventListener("click", () => {
      start.value = "";
      end.value = "";
      success({ start: "", end: "" }); // 値をリセット
    });

    // 入力値が変更されたときに成功関数を呼び出す
    function buildValues() {
      success({
        start: start.value,
        end: end.value,
      });
    }

    // キー入力で確定またはキャンセル
    function keypress(e: KeyboardEvent) {
      if (e.key === "Enter") {
        buildValues();
      }

      if (e.key === "Escape") {
        cancel();
      }
    }

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);

    // コンテナに要素を追加
    container.appendChild(start);
    container.appendChild(end);
    container.appendChild(clearButton); // クリアボタンを追加

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
          return rowValue >= Number(headerValue.start) && rowValue <= Number(headerValue.end);
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
