//-------- utility functions -----------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
//-------- showCodeOutput (displays generated code in modal) -----------
function showCodeOutput(code) {
  const modal = document.getElementById("code-modal");
  const outputBox = document.getElementById("code-output");

  if (!modal || !outputBox) {
    alert("⚠️ Code output modal is missing from builder.html.");
    return;
  }

  outputBox.value = code;
  modal.style.display = "flex";
}

function objectToCode(obj, indent = 2) {
  const pad = " ".repeat(indent);

  if (Array.isArray(obj)) {
    return `[\n${obj.map(item => pad + objectToCode(item, indent + 2)).join(",\n")}\n${" ".repeat(indent - 2)}]`;
  }

  if (typeof obj === "object" && obj !== null) {
    const entries = Object.entries(obj).filter(([_, val]) => {
      if (val === "" || val === null) return false;
      if (typeof val === "object") {
        if (Array.isArray(val) && val.length === 0) return false;
        if (!Array.isArray(val) && Object.values(val).every(v => v === null || v === "")) return false;
      }
      return true;
    });

    if (entries.length === 0) return "{}";

    return `{\n${entries
      .map(([key, val]) => `${" ".repeat(indent)}${key}: ${objectToCode(val, indent + 2)}`)
      .join(",\n")}\n${" ".repeat(indent - 2)}}`;
  }

  if (typeof obj === "string") return JSON.stringify(obj);
  return String(obj);
}


//-------- createField (field type rendering) -----------
function createField(field, value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "field";
  wrapper.dataset.key = field.key;

  const label = document.createElement("label");
  label.textContent = field.label;
  wrapper.appendChild(label);

  // nav-editor (HeaderA dropdown)
  if (field.type === "nav-editor") {
    const list = document.createElement("div");
    const nav = Array.isArray(value) ? value : [];
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      nav.forEach((tab, i) => {
        const tabDiv = document.createElement("div");
        tabDiv.style = "margin-bottom:0.5rem;padding:0.5rem;border:1px solid #444;border-radius:6px;background:#1a1a1a";

        const labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.placeholder = "Tab Label";
        labelInput.value = tab.label || "";
        labelInput.oninput = () => (tab.label = labelInput.value);
        tabDiv.appendChild(labelInput);

        const submenuList = document.createElement("div");
        submenuList.style.marginLeft = "1rem";

        (tab.submenu || []).forEach((item, j) => {
          const row = document.createElement("div");
          row.style = "display:flex;gap:0.5rem;margin:0.25rem 0";

          const subLabel = document.createElement("input");
          subLabel.type = "text";
          subLabel.placeholder = "Sub Label";
          subLabel.value = item.label || "";
          subLabel.oninput = () => (item.label = subLabel.value);

          const subHref = document.createElement("input");
          subHref.type = "text";
          subHref.placeholder = "Link (e.g. #about)";
          subHref.value = item.href || "";
          subHref.oninput = () => (item.href = subHref.value);

          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑️";
          delBtn.onclick = () => {
            tab.submenu.splice(j, 1);
            render();
          };

          row.append(subLabel, subHref, delBtn);
          submenuList.appendChild(row);
        });

        const addSub = document.createElement("button");
        addSub.textContent = "➕ Add Submenu";
        addSub.onclick = () => {
          tab.submenu = tab.submenu || [];
          tab.submenu.push({ label: "", href: "" });
          render();
        };
        submenuList.appendChild(addSub);

        tabDiv.appendChild(submenuList);

        const delTab = document.createElement("button");
        delTab.textContent = "🗑️ Delete Tab";
        delTab.onclick = () => {
          nav.splice(i, 1);
          render();
        };

        tabDiv.appendChild(delTab);
        list.appendChild(tabDiv);
      });
    }

    const addTab = document.createElement("button");
    addTab.textContent = "➕ Add Tab";
    addTab.onclick = () => {
      nav.push({ label: "", submenu: [] });
      render();
    };
    wrapper.appendChild(addTab);

    render();
    wrapper.getValue = () => nav;
    return wrapper;
  }

  // nav-simple (HeaderB flat tabs)
  if (field.type === "nav-simple") {
    const list = document.createElement("div");
    const nav = Array.isArray(value) ? value : [];
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      nav.forEach((item, i) => {
        const row = document.createElement("div");
        row.style = "display:flex;gap:0.5rem;margin-bottom:0.25rem";

        const labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.placeholder = "Label";
        labelInput.value = item.label || "";
        labelInput.oninput = () => (item.label = labelInput.value);

        const hrefInput = document.createElement("input");
        hrefInput.type = "text";
        hrefInput.placeholder = "Link";
        hrefInput.value = item.href || "";
        hrefInput.oninput = () => (item.href = hrefInput.value);

        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.onclick = () => {
          nav.splice(i, 1);
          render();
        };

        row.append(labelInput, hrefInput, del);
        list.appendChild(row);
      });
    }

    const add = document.createElement("button");
    add.textContent = "➕ Add Link";
    add.onclick = () => {
      nav.push({ label: "", href: "" });
      render();
    };
    wrapper.appendChild(add);

    render();
    wrapper.getValue = () => nav;
    return wrapper;
  }

  // carousel-slides (array of slides)
  if (field.type === "carousel-slides") {
    const list = document.createElement("div");
    const slides = Array.isArray(value) ? value : [];
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      slides.forEach((slide, i) => {
        const row = document.createElement("div");
        row.style = "border:1px solid #444;padding:0.5rem;margin-bottom:0.5rem;border-radius:6px;background:#1a1a1a";

        const fields = [
          { key: 'image', placeholder: 'Image URL' },
          { key: 'label', placeholder: 'Button Label' },
          { key: 'link', placeholder: 'Link' },
          { key: 'caption', placeholder: 'Caption' }
        ];

        fields.forEach(f => {
          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = f.placeholder;
          input.value = slide[f.key] || "";
          input.style.marginBottom = "0.25rem";
          input.oninput = () => (slide[f.key] = input.value);
          row.appendChild(input);
        });

        const del = document.createElement("button");
        del.textContent = "🗑️ Remove Slide";
        del.onclick = () => {
          slides.splice(i, 1);
          render();
        };

        row.appendChild(del);
        list.appendChild(row);
      });
    }

    const add = document.createElement("button");
    add.textContent = "➕ Add Slide";
    add.onclick = () => {
      slides.push({ image: "", label: "", link: "", caption: "" });
      render();
    };
    wrapper.appendChild(add);

    render();
    wrapper.getValue = () => slides;
    return wrapper;
  }





   //-------- section-grid-items (array of createPhotoBlock configs) -----------
  if (field.type === "section-grid-items") {
    const list = document.createElement("div");
    const items = Array.isArray(value) ? value : [];
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      items.forEach((item, i) => {
        const itemDiv = document.createElement("div");
        itemDiv.style = "border:1px solid #444;padding:0.5rem;margin-bottom:1rem;border-radius:6px;background:#1a1a1a";

        const fields = [
          { key: 'image', label: 'Image', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
          { key: 'buttonLink', label: 'Button Link', type: 'text' },
          { key: 'buttonPosition', label: 'Button Position', type: 'select', options: ['top', 'center', 'bottom'] }
        ];

        fields.forEach(f => {
          const label = document.createElement("label");
          label.textContent = f.label;

          let input;
          if (f.type === "select") {
            input = document.createElement("select");
            f.options.forEach(opt => {
              const o = document.createElement("option");
              o.value = opt;
              o.textContent = opt;
              input.appendChild(o);
            });
          } else {
            input = document.createElement("input");
            input.type = f.type;
          }

          input.value = item[f.key] || "";
          input.oninput = () => (item[f.key] = input.value);
          itemDiv.appendChild(label);
          itemDiv.appendChild(input);
        });

        const del = document.createElement("button");
        del.textContent = "🗑️ Remove Item";
        del.onclick = () => {
          items.splice(i, 1);
          render();
        };

        itemDiv.appendChild(del);
        list.appendChild(itemDiv);
      });
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ Add PhotoBlock";
    addBtn.onclick = () => {
      items.push({
        image: "",
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        buttonPosition: "bottom"
      });
      render();
    };

    wrapper.appendChild(addBtn);
    render();
    wrapper.getValue = () => items;
    return wrapper;
  }



  //-------- faq-blocks (multi-section grouped FAQs) -----------
  if (field.type === "faq-blocks") {
    const list = document.createElement("div");
    const blocks = Array.isArray(value) ? value : [];
    wrapper.appendChild(list);

    function render() {
      list.innerHTML = "";
      blocks.forEach((block, i) => {
        const blockDiv = document.createElement("div");
        blockDiv.style = "border:1px solid #444;padding:0.75rem;margin-bottom:1rem;border-radius:6px;background:#1a1a1a";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Section Title";
        titleInput.value = block.title || "";
        titleInput.style.marginBottom = "0.5rem";
        titleInput.oninput = () => (block.title = titleInput.value);

        const themeSelect = document.createElement("select");
        ["dark", "light"].forEach(opt => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          themeSelect.appendChild(o);
        });
        themeSelect.value = block.theme || "light";
        themeSelect.oninput = () => (block.theme = themeSelect.value);

        const questionList = document.createElement("div");
        (block.questions ||= []).forEach((qa, j) => {
          const row = document.createElement("div");
          row.style = "display:flex;flex-direction:column;margin-bottom:0.5rem";

          const q = document.createElement("input");
          q.type = "text";
          q.placeholder = "Question";
          q.value = qa.question || "";
          q.oninput = () => (qa.question = q.value);

          const a = document.createElement("textarea");
          a.placeholder = "Answer";
          a.style = "width:100%;height:60px";
          a.value = qa.answer || "";
          a.oninput = () => (qa.answer = a.value);

          const del = document.createElement("button");
          del.textContent = "🗑️ Remove Q&A";
          del.onclick = () => {
            block.questions.splice(j, 1);
            render();
          };

          row.append(q, a, del);
          questionList.appendChild(row);
        });

        const addQA = document.createElement("button");
        addQA.textContent = "➕ Add Question";
        addQA.onclick = () => {
          block.questions.push({ question: "", answer: "" });
          render();
        };

        const delBlock = document.createElement("button");
        delBlock.textContent = "🗑️ Delete Section";
        delBlock.onclick = () => {
          blocks.splice(i, 1);
          render();
        };

        blockDiv.append(titleInput, themeSelect, questionList, addQA, delBlock);
        list.appendChild(blockDiv);
      });
    }

    const addBlock = document.createElement("button");
    addBlock.textContent = "➕ Add FAQ Section";
    addBlock.onclick = () => {
      blocks.push({
        title: "New Section",
        theme: "dark",
        questions: [{ question: "", answer: "" }]
      });
      render();
    };

    wrapper.appendChild(addBlock);
    render();
    wrapper.getValue = () => blocks;
    return wrapper;
  }



  //-------- position-object (for top/left positioning) ---------------------------------------------
  if (field.type === "position-object") {
    const wrapper = document.createElement("div");
    wrapper.dataset.key = field.key;

    const pos = typeof value === "object" && value !== null ? value : {};

    const topInput = document.createElement("input");
    topInput.type = "text";
    topInput.placeholder = "Top (e.g. 10%, 50px)";
    topInput.value = pos.top ?? "";
    topInput.oninput = () => (pos.top = topInput.value || null);

    const leftInput = document.createElement("input");
    leftInput.type = "text";
    leftInput.placeholder = "Left (e.g. 50%, 20px)";
    leftInput.value = pos.left ?? "";
    leftInput.oninput = () => (pos.left = leftInput.value || null);

    wrapper.appendChild(topInput);
    wrapper.appendChild(leftInput);

    wrapper.getValue = () => ({
      top: topInput.value || null,
      left: leftInput.value || null
    });

    return wrapper;
  }







// -----------------------------------------------------------------------
  // Default fields: text, number, checkbox, select
  let input;
  if (field.type === "select") {
    input = document.createElement("select");
    field.options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      input.appendChild(o);
    });
    input.value = value || field.default || "";
  } else if (field.type === "checkbox") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!value;
  } else {
    input = document.createElement("input");
    input.type = field.type;
    input.value = value || field.default || "";
  }

  input.name = field.key;
  wrapper.appendChild(input);

  wrapper.getValue = () => {
    if (field.type === "checkbox") return input.checked;
    if (field.type === "number") return parseFloat(input.value);
    return input.value;
  };

  return wrapper;
}

//-------- initBuilder (main builder logic) -----------
window.initBuilder = function () {
  const container = document.getElementById("flow-container");
  const typeSelect = document.getElementById("module-type-select");
  const addBtn = document.getElementById("add-block-btn");
  const saveBtn = document.getElementById("save-json-btn");
  const genBtn = document.getElementById("generate-code-btn");
  const loadBtn = document.getElementById("load-code-btn");
  loadBtn.onclick = () => {
    document.getElementById("import-modal").style.display = "flex";
  };


  const modal = document.getElementById("editor-modal");
  const modalFields = document.getElementById("modal-fields");
  const modalSave = document.getElementById("modal-save");
  const modalCancel = document.getElementById("modal-cancel");

  let editingBlock = null;

  function renderBlock(blockData, insertAt = null) {
    const div = document.createElement("div");
    div.className = "flow-block";

    const info = document.createElement("div");
    info.className = "info";
    info.textContent = `${blockData.type}`;
    info.onclick = () => openEditor(div, blockData);
    div.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "actions";

    const makeBtn = (label, onclick) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.onclick = onclick;
      return btn;
    };

    actions.appendChild(makeBtn("✏️", () => openEditor(div, blockData)));
    actions.appendChild(makeBtn("📄", () => {
      const copy = JSON.parse(JSON.stringify(blockData));
      renderBlock(copy, Array.from(container.children).indexOf(div) + 1);
    }));
    actions.appendChild(makeBtn("⬆️", () => {
      const i = Array.from(container.children).indexOf(div);
      if (i > 0) container.insertBefore(div, container.children[i - 1]);
    }));
    actions.appendChild(makeBtn("⬇️", () => {
      const i = Array.from(container.children).indexOf(div);
      if (i < container.children.length - 1) container.insertBefore(container.children[i + 1], div);
    }));
    actions.appendChild(makeBtn("🗑️", e => {
      e.stopPropagation();
      if (confirm("Delete this block?")) container.removeChild(div);
    }));

    div.dataset.type = blockData.type;
    div.dataset.config = JSON.stringify(blockData.config || {});
    div.appendChild(actions);

    if (insertAt !== null && insertAt < container.children.length) {
      container.insertBefore(div, container.children[insertAt]);
    } else {
      container.appendChild(div);
    }
  }

  function openEditor(blockEl, data) {
    const schema = window.editorSchema[data.type];
    if (!schema) return;

    modalFields.innerHTML = "";
    schema.fields.forEach(field => {
      const val = data.config?.[field.key];
      const fieldEl = createField(field, val);
      modalFields.appendChild(fieldEl);
    });

    editingBlock = blockEl;
    modal.classList.add("active");
  }

  modalSave.onclick = () => {
    const type = editingBlock.dataset.type;
    const schema = window.editorSchema[type];
    const config = {};

    schema.fields.forEach((field) => {
      const el = modalFields.querySelector(`[data-key="${field.key}"]`);
      if (el && el.getValue) {
        config[field.key] = el.getValue();
      }
    });

    editingBlock.dataset.config = JSON.stringify(config);
    editingBlock.querySelector(".info").textContent = `${type}`;
    modal.classList.remove("active");
    editingBlock = null;
  };

  modalCancel.onclick = () => {
    modal.classList.remove("active");
    editingBlock = null;
  };

  addBtn.onclick = () => {
    const type = typeSelect.value;
    if (!type || !window.editorSchema[type]) return;

    const config = {};
    for (const field of window.editorSchema[type].fields) {
      if (field.hasOwnProperty("default")) {
        config[field.key] = Array.isArray(field.default)
          ? [...field.default]
          : field.default;
      } else if (field.type === "checkbox") {
        config[field.key] = false;
      } else {
        config[field.key] = "";
      }
    }

    renderBlock({ type, config });
  };

  saveBtn.onclick = () => {
    const all = [...container.children].map(div => ({
      type: div.dataset.type,
      config: JSON.parse(div.dataset.config)
    }));
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site-flow.json";
    a.click();
  };

  genBtn.onclick = () => {
    const all = [...container.children].map(div => ({
      type: div.dataset.type,
      config: JSON.parse(div.dataset.config)
    }));

    let output = "";

    all.forEach(block => {
      const { type, config } = block;

      if (type === "faq") {
        // Special output for FAQ
        const faqList = objectToCode(config.faqData, 2);
        output += `const faqData = ${faqList};\n\n`;
        output += `faqData.forEach((block, index) => {\n`;
        output += `  createFAQ({\n`;
        output += `    containerId: ${JSON.stringify(config.containerId)},\n`;
        output += `    id: \`faq-block-\${index + 1}\`,\n`;
        output += `    className: "faq-demo",\n`;
        output += `    theme: block.theme,\n`;
        output += `    questions: block.questions\n`;
        output += `  });\n`;
        output += `});\n\n`;
      } 
      else {
        // Default output for everything else
        const args = objectToCode(config, 2);
        output += `create${capitalize(type)}(${args});\n\n`;
      }
    });

    const paddedOutput = output
      .split("\n")
      .map(line => "  " + line)
      .join("\n");

    showCodeOutput(paddedOutput);
  };

};

//-------- parseImportedCode (reverse code to blocks) -----------
function parseImportedCode() {
  const input = document.getElementById("import-input").value;
  const container = document.getElementById("flow-container");

  try {
    let blocks = [];

    try {
      // Match function calls like: createHeaderA({...})
      const matches = [...input.matchAll(/create([A-Z][a-zA-Z0-9]*)\s*\((\{[\s\S]*?\})\);?/g)];

      for (const match of matches) {
        const rawType = match[1];              // e.g. HeaderA
        const configStr = match[2];            // stringified config object

        const type = rawType.charAt(0).toLowerCase() + rawType.slice(1); // headerA
        const config = eval("(" + configStr + ")"); // safely parse just the object

        blocks.push({ type, config });
      }

      // Special case: handle faqData
      if (input.includes("const faqData =")) {
        const faqMatch = input.match(/const faqData\s*=\s*(\[[\s\S]*?\]);/);
        if (faqMatch) {
          const faqData = eval("(" + faqMatch[1] + ")");
          blocks.push({ type: "faq", config: { containerId: "main", faqData } });
        }
      }

      if (!blocks.length) {
        alert("⚠️ No usable blocks found in pasted code.");
        return;
      }

      container.innerHTML = "";
      blocks.forEach(block => renderBlock(block));
      document.getElementById("import-modal").style.display = "none";

    } catch (err) {
      console.error("Parse error:", err);
      alert("⚠️ Error parsing code. Make sure it’s a valid createXYZ(...) call.");
    }


        if (!Array.isArray(blocks) || blocks.length === 0) {
          alert("⚠️ No usable blocks found.");
          return;
        }

        container.innerHTML = "";
        blocks.forEach(block => {
          if (block.type && block.config) {
            renderBlock(block);
          }
        });

        document.getElementById("import-modal").style.display = "none";
      } catch (err) {
        console.error("Import failed:", err);
        alert("⚠️ Error parsing code. Paste valid generated code.");
      }
    }

