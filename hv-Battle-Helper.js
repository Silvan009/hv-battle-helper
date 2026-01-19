// ==UserScript==
// @name         HV战斗助手
// @namespace    battle-helper
// @description  battle-helper
// @version      1.3.0
// @author       Silvan009
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(() => {
  "use strict";

  const isIsekai = window.location.href.includes("/isekai/");
  const CONFIG_KEY = isIsekai ? "bh_isk_config" : "bh_config";
  const BACKUP_KEY = isIsekai ? "bh_isk_backup" : "bh_backup";
  const PAUSE_KEY = isIsekai ? "bh_isk_pause" : "bh_pause";
  const BATTLE_KEY = isIsekai ? "bh_isk_battle" : "bh_battle";
  const LOG_KEY = isIsekai ? "bh_isk_log" : "bh_log";

  const defaultOptions = [{ value: "default", label: "默认选项" }];

  const moduleConfigs = {
    spiritstance: {
      options: [
        { value: "spiriton", label: "Spirit Stance: 开" },
        { value: "spiritoff", label: "Spirit Stance: 关" },
      ],
    },
    gem: {
      options: [
        { value: "Health Gem", label: "Health Gem" },
        { value: "Mana Gem", label: "Mana Gem" },
        { value: "Spirit Gem", label: "Spirit Gem" },
        { value: "Mystic Gem", label: "Mystic Gem" },
      ],
    },
    channel: {
      options: [
        { value: "Regen", label: "Regen" },
        { value: "Heartseeker", label: "Heartseeker" },
        { value: "Arcane Focus", label: "Arcane Focus" },
        { value: "Absorb", label: "Absorb" },
      ],
    },
    recovery: {
      options: [
        { value: "Cure", label: "Cure" },
        { value: "Full-Cure", label: "Full-Cure" },
        { value: "Health Potion", label: "Health Potion" },
        { value: "Health Elixir", label: "Health Elixir" },
        { value: "Mana Potion", label: "Mana Potion" },
        { value: "Mana Elixir", label: "Mana Elixir" },
        { value: "Spirit Potion", label: "Spirit Potion" },
        { value: "Spirit Elixir", label: "Spirit Elixir" },
        { value: "Last Elixir", label: "Last Elixir" },
        { value: "Caffeinated Candy", label: "Caffeinated Candy" },
        { value: "Energy Drink", label: "Energy Drink" },
        { value: "Defend", label: "Defend" },
        { value: "Flee", label: "Flee" },
      ],
    },
    buffs: {
      options: [
        { value: "Health Draught", label: "Health Draught" },
        { value: "Mana Draught", label: "Mana Draught" },
        { value: "Spirit Draught", label: "Spirit Draught" },
        { value: "Regen", label: "Regen" },
        { value: "Heartseeker", label: "Heartseeker" },
        { value: "Arcane Focus", label: "Arcane Focus" },
        { value: "Flower Vase", label: "Flower Vase" },
        { value: "Bubble-Gum", label: "Bubble-Gum" },
        { value: "Protection", label: "Protection" },
        { value: "Haste", label: "Haste" },
        { value: "Shadow Veil", label: "Shadow Veil" },
        { value: "Absorb", label: "Absorb" },
        { value: "Spark of Life", label: "Spark of Life" },
        { value: "Spirit Shield", label: "Spirit Shield" },
        { value: "Infusion of Flames", label: "Infusion of Flames" },
        { value: "Infusion of Frost", label: "Infusion of Frost" },
        { value: "Infusion of Lightning", label: "Infusion of Lightning" },
        { value: "Infusion of Storms", label: "Infusion of Storms" },
        { value: "Infusion of Divinity", label: "Infusion of Divinity" },
        { value: "Infusion of Darkness", label: "Infusion of Darkness" },
        { value: "Focus", label: "Focus" },
      ],
    },
    scroll: {
      options: [
        { value: "Scroll of the Gods", label: "Scroll of the Gods" },
        { value: "Scroll of the Avatar", label: "Scroll of the Avatar" },
        { value: "Scroll of Protection", label: "Scroll of Protection" },
        { value: "Scroll of Swiftness", label: "Scroll of Swiftness" },
        { value: "Scroll of Life", label: "Scroll of Life" },
        { value: "Scroll of Shadows", label: "Scroll of Shadows" },
        { value: "Scroll of Absorption", label: "Scroll of Absorption" },
      ],
    },
    debuffs: {
      options: [
        { value: "Imperil", label: "Imperil", data: "tc3 sr so tl" },
        { value: "Weaken", label: "Weaken", data: "tc3 sr so tl" },
        { value: "Silence", label: "Silence", data: "tc3 sr so tl" },
        { value: "Sleep", label: "Sleep", data: "tc3 sr so tl" },
        { value: "MagNet", label: "MagNet", data: "tc3 sr so tl" },
        { value: "Drain", label: "Drain", data: "tc3 sr so tl" },
        { value: "Slow", label: "Slow", data: "tc3 sr so tl" },
        { value: "Confuse", label: "Confuse", data: "tc3 sr so tl" },
        { value: "Blind", label: "Blind", data: "tc3 sr so tl" },
        { value: "Immobilize", label: "Immobilize", data: "tc3 sr so tl" },
      ],
    },
    skills: {
      options: [
        { value: "Shield Bash", label: "Shield Bash" },
        { value: "Vital Strike", label: "Vital Strike" },
        { value: "Merciful Blow", label: "Merciful Blow" },
        { value: "Iris Strike", label: "Iris Strike" },
        { value: "Backstab", label: "Backstab" },
        { value: "Frenzied Blows", label: "Frenzied Blows" },
        { value: "Great Cleave", label: "Great Cleave" },
        { value: "Rending Blow", label: "Rending Blow" },
        { value: "Shatter Strike", label: "Shatter Strike" },
        { value: "Skyward Sword", label: "Skyward Sword" },
        { value: "Concussive Strike", label: "Concussive Strike" },
        { value: "FUS RO DAH", label: "FUS RO DAH" },
        { value: "Orbital Friendship Cannon", label: "Orbital Friendship Cannon" },
        { value: "Fiery Blast", label: "Fiery Blast", data: "tc5" },
        { value: "Inferno", label: "Inferno", data: "tc7" },
        { value: "Flames of Loki", label: "Flames of Loki", data: "tc10" },
        { value: "Freeze", label: "Freeze", data: "tc5" },
        { value: "Blizzard", label: "Blizzard", data: "tc7" },
        { value: "Fimbulvetr", label: "Fimbulvetr", data: "tc10" },
        { value: "Gale", label: "Gale", data: "tc5" },
        { value: "Downburst", label: "Downburst", data: "tc7" },
        { value: "Storms of Njord", label: "Storms of Njord", data: "tc10" },
        { value: "Shockblast", label: "Shockblast", data: "tc5" },
        { value: "Chained Lightning", label: "Chained Lightning", data: "tc7" },
        { value: "Wrath of Thor", label: "Wrath of Thor", data: "tc10" },
        { value: "Smite", label: "Smite", data: "tc5" },
        { value: "Banishment", label: "Banishment", data: "tc7" },
        { value: "Paradise Lost", label: "Paradise Lost", data: "tc10" },
        { value: "Corruption", label: "Corruption", data: "tc5" },
        { value: "Disintegrate", label: "Disintegrate", data: "tc7" },
        { value: "Ragnarok", label: "Ragnarok", data: "tc10" },
      ],
    },
    staff: {
      options: [
        { value: "Ether Tap", label: "Ether Tap" },
        { value: "3", label: "T3", data: "tc10" },
        { value: "2", label: "T2", data: "tc7" },
        { value: "1", label: "T1", data: "tc5" },
      ],
    },
  };

  let PauseBattle = getBattle(PAUSE_KEY, false);

  function renderBoxUI(Type = 1) {
    const settingHTML = `<button class="bh-setting" id="bh-setting">BH</button>`;
    const pauseHTML = `<button class="bh-pause" id="bh-pause"></button> <span id="bh-log-title"></span>`;

    const html = Type == 1 ? settingHTML : settingHTML + pauseHTML;

    const hvBHBox = document.createElement("div");
    hvBHBox.id = "bh-box";
    hvBHBox.innerHTML = html;

    document.body.appendChild(hvBHBox);
    document.getElementById("bh-setting").onclick = () => panel.classList.toggle("show");
    addMenuIntegration();

    const pauseBtn = document.getElementById("bh-pause");
    if (pauseBtn) {
      const refreshPause = () => {
        pauseBtn.textContent = PauseBattle ? "▶" : "⏸";
        pauseBtn.setAttribute("data-paused", PauseBattle ? "true" : "false");
      };
      refreshPause();

      function togglePauseBattle() {
        PauseBattle = !PauseBattle;
        setBattle(PAUSE_KEY, PauseBattle);
        refreshPause();
        startBattle();
      }
      pauseBtn.onclick = togglePauseBattle;
      document.addEventListener("keydown", function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === "m") togglePauseBattle();
      });

      if (!cfgBattle) {
        if (!PauseBattle) {
          setBattle(PAUSE_KEY, true);
          refreshPause();
        }

        alert(
          "⚠️ HV战斗助手配置初始化\n\n检测到首次使用或配置丢失，已创建默认配置。\n\n请点击脚本图标打开配置界面，根据需要进行个性化设置。",
        );
      }
    }
  }

  const panel = document.body.appendChild(document.createElement("div"));
  panel.id = "bh-panel";
  panel.innerHTML = `
    <div id="bh-header">
      HV战斗助手
      <div id="bh-close">✖</div>
    </div>

    <div class="bh-body">
      <div class="bh-nav">
        <div data-tab="home" class="active">主页</div>
        <div data-tab="channel">Channel</div>
        <div data-tab="recovery">Recovery</div>
        <div data-tab="buff">Buff</div>
        <div data-tab="debuff">Debuff</div>
        <div data-tab="skill">Skill</div>
        <div data-tab="about">关于</div>
      </div>

      <div class="bh-content">
        <div class="page" id="page-home"></div>
        <div class="page" id="page-channel" style="display:none"></div>
        <div class="page" id="page-recovery" style="display:none"></div>
        <div class="page" id="page-buff" style="display:none"></div>
        <div class="page" id="page-debuff" style="display:none"></div>
        <div class="page" id="page-skill" style="display:none"></div>
        <div class="page" id="page-about" style="display:none"></div>
      </div>
    </div>

    <div id="bh-footer">
      <button id="btn-reset">重置</button>
      <button id="btn-save">保存</button>
      <button id="btn-cancel">取消</button>
    </div>
    `;

  panel.querySelector("#bh-close").onclick = () => panel.classList.remove("show");

  panel.querySelectorAll(".bh-nav div[data-tab]").forEach((b) => {
    b.onclick = () => {
      panel.querySelectorAll(".bh-nav div").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      panel.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
      document.getElementById("page-" + b.dataset.tab).style.display = "block";
    };
  });

  const condHTML = () => `
    <div class="cond">
      <input type="text" name="left" autocomplete="off">
      <select name="operator">
        <option value="1">></option>
        <option value="2"><</option>
        <option value="3">>=</option>
        <option value="4"><=</option>
        <option value="5">==</option>
        <option value="6">!=</option>
      </select>
      <input type="text" name="right" autocomplete="off">
      <button class="del-cond">✖</button>
    </div>`;

  const groupHTML = () => `
    <div class="group">
      <div class="group-left">
        <button class="add-cond">+</button>
        <button class="del-group">-</button>
      </div>
      <div class="cond-list">${condHTML()}</div>
    </div>`;

  const moduleHTML = (options = defaultOptions) => `
    <div class="module">
      <div class="module-head">
        <input name="moduleStatus" type="checkbox" class="enable" checked>
        <select name="moduleType" class="type">
          ${options
            .map((opt) => `<option value="${opt.value}" data-ui="${opt.data || 0}">${opt.label}</option>`)
            .join("")}
        </select>

        <!-- 这里用于放动态 ui -->
       <span name="option_ui" class="option-ui"></span>

        <button class="add-group">添加条件组</button>
        <div style="margin-left:auto">
          <button class="move-up">↑</button>
          <button class="move-down">↓</button>
          <button class="del-module">🗑</button>
        </div>
      </div>
      <hr>
      <div class="groups">${groupHTML()}</div>
    </div>`;

  const attackmodeHTML = () => `
    <div class="attackmode-module">
      <label>
        副本:
        <select name="dungeon">
          <option value="ar">ar</option>
          <option value="rb">rb</option>
          <option value="gf">gf</option>
          <option value="iw">iw</option>
          <option value="re">re</option>
          <option value="tw">tw</option>
        </select>
      </label>

      <label>
        攻击模式:
        <select name="attack-mode">
          <option value="order" selected>顺序攻击</option>
          <option value="reverse">倒序攻击</option>
          <option value="hpMax">最高血量</option>
          <option value="hpMin">最低血量</option>
        </select>
      </label>

      <label>
        <input type="checkbox" name="boss-priority"> 优先Boss
      </label>

      <button type="button" name="remove-attackmode">删除</button>
    </div>`;

  document.getElementById("page-home").innerHTML = `
  <div>战斗风格:
    <select id="fightingStyle">
      <option value="melee" selected>Melee</option>
      <option value="fire">Fire</option>
      <option value="cold">Cold</option>
      <option value="elec">Elec</option>
      <option value="wind">Wind</option>
      <option value="holy">Holy</option>
      <option value="dark">Dark</option>
    </select></div>
  <div>
    攻击模式:
    <select id="defaultAttackMode">
        <option value="order" selected>顺序攻击</option>
        <option value="reverse">倒序攻击</option>
        <option value="hpMax">最高血量</option>
        <option value="hpMin">最低血量</option>
    </select>
    <label>
      <input type="checkbox" id="defaultBossPriority"> 优选boss
    </label>
  </div>
  <div><button id="add-attackmodule">单独配置攻击模式</button>
  <div id="attack-module-list" class="module-list"></div></div>
  <div>
    <label>
      <input type="checkbox" id="autoNextRound"> 跳过回合弹窗(新回合需要按M或点击继续按钮)
    </label>
  </div>
  <div class="module-group">
    <label id="spiritstance">
      <input type="checkbox">Spirit Stance
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>
  <div class="module-group">
    <label id="gem">
      <input type="checkbox">Gem
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>`;

  document.getElementById("page-channel").innerHTML = `
  <div class="module-group">
    <label id="channel">
      <input type="checkbox">Channel
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>`;

  document.getElementById("page-recovery").innerHTML = `
  <div class="module-group">
    <label id="recovery">
      <input type="checkbox">Recovery
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>`;

  document.getElementById("page-buff").innerHTML = `
  <div class="module-group">
    <label id="buffs">
      <input type="checkbox">Buffs
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>
      <div class="module-group">
    <label id="scroll">
      <input type="checkbox">Scroll
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>`;

  document.getElementById("page-debuff").innerHTML = `
    <div class="module-group">
    <label id="debuffs">
      <input type="checkbox">Debuffs
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>`;

  document.getElementById("page-skill").innerHTML = `
    <div class="module-group">
    <label id="skills">
      <input type="checkbox">Skills
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>
    <div class="module-group">
    <label id="staff">
      <input type="checkbox">staff
    </label>
    <button class="add-module">添加</button><div class="module-list"></div></div>
    `;

  document.getElementById("page-about").innerHTML = `
    <div>
      <div>
        保存配置名：
        <input type="text" id="bh-cfg-name">
        <button id="bh-cfg-save">保存配置</button>
      </div>
      <div style="flex-basis: 100%; height: 0;"></div>
      <div>
        已保存配置：
        <select id="bh-cfg-select"></select>
        <button id="bh-cfg-load">读取</button>
        <button id="bh-cfg-delete">删除</button>
      </div> </div>
    <div>
    <button id="bh-cfg-export">导出配置</button>
    <button id="bh-cfg-import-btn">导入配置</button>
    <textarea id="bh-cfg-textarea"></textarea></div>
    <div><a href="https:
  `;

  panel.addEventListener("click", (e) => {
    const m = e.target.closest(".module"),
      g = e.target.closest(".group");
    if (e.target.classList.contains("add-module")) {
      const container = e.target.parentElement;
      const label = container.querySelector("label");
      let options = defaultOptions;
      if (label && label.id && moduleConfigs[label.id]) {
        options = moduleConfigs[label.id].options;
      }
      const nextElement = e.target.nextElementSibling;
      nextElement.insertAdjacentHTML("beforeend", moduleHTML(options));
      nextElement.lastElementChild.querySelector("select")?.click();
    }
    if (e.target.classList.contains("add-group")) {
      m.querySelector(".groups").insertAdjacentHTML("beforeend", groupHTML());
    }
    if (e.target.classList.contains("add-cond")) {
      g.querySelector(".cond-list").insertAdjacentHTML("beforeend", condHTML());
    }
    if (e.target.classList.contains("del-cond")) e.target.closest(".cond").remove();
    if (e.target.classList.contains("del-group")) g.remove();
    if (e.target.classList.contains("move-up")) {
      if (m.previousElementSibling) {
        m.parentNode.insertBefore(m, m.previousElementSibling);
      }
    }
    if (e.target.classList.contains("move-down")) {
      if (m.nextElementSibling) {
        m.parentNode.insertBefore(m.nextElementSibling, m);
      }
    }
    if (e.target.classList.contains("del-module")) m.remove();

    if (e.target.classList.contains("type")) {
      const moduleEl = e.target.closest(".module");
      const selected = e.target.options[e.target.selectedIndex];
      const optionui = selected.dataset.ui;
      if (optionui && optionui !== "0") {
        renderOptionUI(moduleEl, optionui);
      } else {
        renderOptionUI(moduleEl, null);
      }
    }
  });

  document.getElementById("add-attackmodule").addEventListener("click", function () {
    const moduleList = document.getElementById("attack-module-list");
    moduleList.insertAdjacentHTML("beforeend", attackmodeHTML());

    const lastModule = moduleList.lastElementChild;
    const removeBtn = lastModule.querySelector('[name="remove-attackmode"]');
    removeBtn.addEventListener("click", function () {
      lastModule.remove();
    });
  });

  function saveConfigs() {
    const PANEL = document.getElementById("bh-panel");
    const data = {};

    const getVal = (el) => (el.type === "checkbox" ? el.checked : el.value);

    PANEL.querySelectorAll("input[id], select[id], textarea[id]").forEach((el) => {
      if (el.disabled) return;
      if (el.dataset.nosave !== undefined) return;
      if (el.closest("#page-about")) return;
      data[el.id] = getVal(el);
    });

    data.attackModules = [...document.querySelectorAll(".attackmode-module")].map((m) => [
      m.querySelector('[name="dungeon"]')?.value ?? "",
      m.querySelector('[name="attack-mode"]')?.value ?? "",
      m.querySelector('[name="boss-priority"]')?.checked ?? false,
    ]);

    PANEL.querySelectorAll(".module-group").forEach((groupEl) => {
      const label = groupEl.querySelector("label[id]");
      if (!label?.id) return;

      const result = {
        status: groupEl.querySelector("label input")?.checked ?? false,
        modules: {},
      };

      let moduleindex = 0;
      groupEl.querySelectorAll(".module").forEach((moduleEl) => {
        const moduleheader = moduleEl.querySelector(".module-head");
        if (!moduleheader) return;

        const headerData = {};
        moduleheader.querySelectorAll("input[name], select[name]").forEach((el) => {
          if (el.disabled) return;
          if (el.dataset.nosave !== undefined) return;
          headerData[el.name] = getVal(el);
        });

        const moduleType = headerData.moduleType;
        if (!moduleType) return;

        const groups = [...moduleEl.querySelectorAll(".group")].map((g) => {
          return [...g.querySelectorAll(".cond")].reduce((acc, c) => {
            const left = c.querySelector('[name="left"]')?.value?.trim();
            const operator = c.querySelector('[name="operator"]')?.value;
            const right = c.querySelector('[name="right"]')?.value?.trim();

            if (left && right) acc.push([left, operator, right]);
            return acc;
          }, []);
        });

        headerData.conditions = groups;
        result.modules[`${moduleType}_${moduleindex}`] = headerData;
        moduleindex += 1;
      });

      data[label.id] = result;
    });

    GM_setValue(CONFIG_KEY, data);
  }

  function loadConfigs(data) {
    if (!data) return;

    const PANEL = document.getElementById("bh-panel");
    const setVal = (el, v) => (el.type === "checkbox" ? (el.checked = !!v) : (el.value = v));

    Object.entries(data).forEach(([id, value]) => {
      const el = PANEL.querySelector(`#${CSS.escape(id)}`);
      if (!el || el.disabled) return;
      setVal(el, value);
    });

    const attackList = document.getElementById("attack-module-list");
    attackList.innerHTML = "";

    (data.attackModules ?? []).forEach((m) => {
      attackList.insertAdjacentHTML("beforeend", attackmodeHTML());
      const el = attackList.lastElementChild;

      el.querySelector('[name="dungeon"]').value = m[0];
      el.querySelector('[name="attack-mode"]').value = m[1];
      el.querySelector('[name="boss-priority"]').checked = m[2];
      el.querySelector('[name="remove-attackmode"]').onclick = () => el.remove();
    });

    PANEL.querySelectorAll(".module-group").forEach((groupEl) => {
      const label = groupEl.querySelector("label[id]");
      if (!label?.id) return;

      const groupConfig = data[label.id];
      if (!groupConfig) return;

      groupEl.querySelector("label input").checked = groupConfig.status ?? false;

      const list = groupEl.querySelector(".module-list");
      if (!list) return;
      list.innerHTML = "";

      Object.values(groupConfig.modules ?? {}).forEach((moduleData) => {
        const options = moduleConfigs[label.id]?.options ?? defaultOptions;
        list.insertAdjacentHTML("beforeend", moduleHTML(options));

        const moduleEl = list.lastElementChild;
        moduleEl.querySelector(".type").value = moduleData.moduleType;

        const optionui = moduleConfigs[label.id]?.options?.find((o) => o.value === moduleData.moduleType)?.data ?? "0";

        renderOptionUI(moduleEl, optionui !== "0" ? optionui : null);

        const moduleheader = moduleEl.querySelector(".module-head");
        Object.entries(moduleData).forEach(([name, value]) => {
          const el = moduleheader.querySelector(`[name="${CSS.escape(name)}"]`);
          if (!el || el.disabled) return;
          setVal(el, value);
        });

        const groupsEl = moduleEl.querySelector(".groups");
        groupsEl.innerHTML = "";

        (moduleData.conditions ?? []).forEach((cg) => {
          groupsEl.insertAdjacentHTML("beforeend", groupHTML());
          const groupEl = groupsEl.lastElementChild;
          const condList = groupEl.querySelector(".cond-list");
          condList.innerHTML = "";

          cg.forEach((c) => {
            condList.insertAdjacentHTML("beforeend", condHTML());
            const condEl = condList.lastElementChild;
            condEl.querySelector('[name="left"]').value = c[0];
            condEl.querySelector('[name="operator"]').value = c[1];
            condEl.querySelector('[name="right"]').value = c[2];
          });
        });
      });
    });
  }

  function renderOptionUI(moduleEl, data) {
    const container = moduleEl.querySelector(".option-ui");

    const optionHTML = {
      tc: (v) => `技能范围:
      <select name="targetCount" class="option-type">
        ${[0, 1, 2].map((i) => `<option value="${v - i}">${v - i}</option>`).join("")}
      </select>`,

      sr: () => `<label class="option-type">
      <input name="selectRange" type="checkbox" class="enable">ALL</label>`,

      so: () => `<label class="option-type">
      <input name="selectOrder" type="checkbox" class="enable">倒序</label>`,

      tl: () => `<label class="option-type">
       少于<input name="turnsLeft" type="text" value="0" style="width: 24px; height: 22px; text-align: center; box-sizing: border-box; padding: 0; margin: 0 auto; display: block;">回合</label>`,
    };

    if (!data) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = data
      .split(" ")
      .map((part) => {
        if (part.startsWith("tc")) {
          const v = parseInt(part.slice(2));
          return !isNaN(v) ? optionHTML.tc(v) : "";
        }
        return optionHTML[part]?.() ?? "";
      })
      .join("");
  }

  window.addEventListener("load", loadConfigs(GM_getValue(CONFIG_KEY)));

  document.getElementById("btn-save").onclick = () => {
    saveConfigs();
    location.reload();
  };
  document.getElementById("btn-cancel").onclick = () => panel.classList.remove("show");
  document.getElementById("btn-reset").onclick = () =>
    confirm("确定重置？") && (GM_deleteValue(CONFIG_KEY), location.reload());

  updateBackupList();

  document.getElementById("bh-cfg-save").addEventListener("click", () => {
    const name = document.getElementById("bh-cfg-name").value.trim();
    if (!name) return alert("配置名不能为空");

    const backups = GM_getValue(BACKUP_KEY, {});
    if (backups[name]) return alert("配置名已存在");

    saveConfigs();
    backups[name] = GM_getValue(CONFIG_KEY);
    GM_setValue(BACKUP_KEY, backups);
    document.getElementById("bh-cfg-name").value = "";
    updateBackupList();
  });

  document.getElementById("bh-cfg-load").addEventListener("click", () => {
    const name = document.getElementById("bh-cfg-select").value;
    if (!name) return;

    const backups = GM_getValue(BACKUP_KEY, {});
    GM_setValue(CONFIG_KEY, backups[name]);
    alert("配置已加载");
    location.reload();
  });

  document.getElementById("bh-cfg-delete").addEventListener("click", () => {
    const name = document.getElementById("bh-cfg-select").value;
    if (!name) return;

    const isConfirmed = confirm(`确定要删除配置 "${name}" 吗？此操作不可撤销！`);
    if (!isConfirmed) return;

    const backups = GM_getValue(BACKUP_KEY, {});
    delete backups[name];
    GM_setValue(BACKUP_KEY, backups);
    updateBackupList();
  });

  document.getElementById("bh-cfg-export").addEventListener("click", () => {
    saveConfigs();
    const config = GM_getValue(CONFIG_KEY);
    document.getElementById("bh-cfg-textarea").value = JSON.stringify(config, null, 2);
  });

  document.getElementById("bh-cfg-import-btn").addEventListener("click", () => {
    const text = document.getElementById("bh-cfg-textarea").value.trim();
    if (!text) return alert("请输入配置内容");

    try {
      const data = JSON.parse(text);
      loadConfigs(data);
      saveConfigs();
      location.reload();
    } catch (e) {
      alert("配置格式错误: " + e.message);
    }
  });

  function updateBackupList() {
    const select = document.getElementById("bh-cfg-select");
    select.innerHTML = "";

    const backups = GM_getValue(BACKUP_KEY, {});
    Object.keys(backups).forEach((name) => {
      const option = document.createElement("option");
      option.value = option.textContent = name;
      select.appendChild(option);
    });
  }

  GM_addStyle(`
    #bh-box{position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;align-items: flex-end;}
    #bh-box .hbs_menu>span,#bh-box button{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(245,243,235,.95);border:2px solid rgba(150,145,120,.6);color:#4a4a3a;font-weight:700;font-size:15px;cursor:pointer;user-select:none;box-shadow:0 6px 14px rgba(120,115,95,.35),inset 0 0 0 1px rgba(255,255,255,.6);transition:all .25s ease}
    #bh-box .hbs_menu>span:hover,#bh-box button:hover{background:rgba(139,154,110,.22);border-color:#8b9a6e;color:#2f3a1f;transform:translateY(-2px)}
    #bh-box .hbs_menu>span:active,#bh-box button:active{transform:scale(.95)}
    #bh-setting:hover{transform:rotate(90deg)}
    #bh-pause[data-paused=true]{color:#c94a4a;border-color:#c94a4a}
    #bh-pause[data-paused=false]{color:#4f9a62;border-color:#4f9a62}
    #bh-box .hbs_menu{position:relative}
    #bh-box .hbs-menu-list{position:absolute;top:0;right:48px;max-height:calc(100vh - 40px);overflow-y:auto;min-width:190px;padding:6px 0;background:rgba(245,243,235,.98);border:1px solid rgba(150,145,120,.6);border-radius:12px;box-shadow:0 12px 26px rgba(120,115,95,.45),inset 0 0 0 1px rgba(255,255,255,.6);opacity:0;visibility:hidden;transform:translateX(10px);transition:all .25s ease}
    #bh-box .hbs_menu:hover .hbs-menu-list{opacity:1;visibility:visible;transform:translateX(0)}
    #bh-box .hbs-menu-list ul{list-style:none;margin:0;padding:0}
    #bh-box .hbs-menu-list a{display:flex;align-items:center;padding:8px 16px;font-size:13px;color:#4a4a3a;text-decoration:none;transition:all .15s ease}
    #bh-box .hbs-menu-list a:hover{background:rgba(139,154,110,.22);color:#2f3a1f}
    #bh-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:860px;height:645px;background:#edebe0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);display:none;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
    #bh-panel.show{display:flex;flex-direction:column}
  `);

  GM_addStyle(`
    .crystal{color:#ba05b4}
    .credit{color:#a89000}
    .equipment{color:red}
    .token{color:#254117}
    .artifact{color:#00f}
    .trophy{color:#461b7e}
    .consumable{color:#00b000}
    .food{color:#489eff}
    #damagelog{border:2px solid #5c0e13;border-collapse:collapse}
    #damagelog td{border:1px solid #aaa;text-align:center}
  `);

  if (document.getElementById("bh-panel")) {
    GM_addStyle(`
      #bh-header{background:#5a5a5a;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-radius:8px 8px 0 0;font-size:22px}
      #bh-close{cursor:pointer;padding:4px 10px;font-size:22px}
      #bh-footer{padding:15px;border-top:1px solid #d5d3c9;display:flex;justify-content:flex-end;gap:10px;background:#f5f4f0}
      #bh-footer button{padding:4px 10px;font-size:12px;border-radius:4px;cursor:pointer}
      .bh-body{display:flex;flex:1;min-height:0}
      .bh-nav{width:150px;background:#f5f4f0;border-right:1px solid #d5d3c9;padding:20px 0;display:flex;flex-direction:column;font-size:12px;font-weight:700}
      .bh-nav>div{padding:12px 20px;cursor:pointer;border-left:3px solid transparent;transition:all .2s}
      .bh-nav>div:hover{background:#e9e7dd}
      .bh-nav>div.active{background:#f5f4f0;border-left:3px solid #7c7c7c;color:#7c7c7c;font-weight:500}
      .bh-content{width:500px;height:500px;flex:1;padding:5px;overflow-y:auto;text-align:left}
      .bh-contentinput [type=text],input[type=number]{font-size:9pt;margin:0 5px;padding:2px 5px;border-width:1px;line-height:18px}
      .bh-content input[type=checkbox]{width:16px;height:16px;margin:0 2px;position:relative;top:0}
      .bh-content button{font-size:9pt;margin:0 5px;padding:1px 5px;border-width:1px;border-radius:4px;line-height:18px}
      .bh-content select{font-size:9pt;margin:0 5px;padding:2px;border-width:1px;height:calc(4em / 3 + 6px)}
      .bh-content select[size]{height:auto}
      .bh-content option{font-size:inherit}
      .bh-content label{display:inline-flex;align-items:center;gap:2px}
      .page{display:none}
      .page:first-child{display:block}
      .page>div{display:flex;align-items:center;gap:5px 10px;flex-wrap:wrap;border:1px solid #d5d3c9;border-radius:4px;margin:5px 0;padding:8px;background:#f9f8f4}
      .module-list{width:100%;margin-top:1px}
      .attackmode-module{display:flex;align-items:center;gap:1px;margin-bottom:5px}
      .module{border:1px solid #d5d3c9;border-radius:4px;margin:5px 0;padding:5px;background:#f9f8f4}
      .module-head{display:flex;align-items:center;gap:1px 5px;flex-wrap:wrap;margin-bottom:5px}
      .module-head span{display:flex;align-items:center;gap:1px 8px;flex-wrap:wrap}
      .groups>div{border-bottom:1px solid #5c0e13;padding:5px 0;margin:0}
      .groups>div:last-child{border-bottom:none}
      .group{display:flex;gap:5px;margin:5px 0;align-items:flex-start}
      .group-left{display:flex;flex-direction:row;gap:1px}
      .add-cond,.del-group{width:22px;margin:4px 0!important}
      .cond-list{display:grid;grid-template-columns:repeat(3,max-content);gap:5px;flex:1}
      .cond{border:1px solid #d5d3c9;border-radius:4px;margin:0;padding:2px;background:#f9f8f4;display:flex;align-items:center;justify-content:center}
      .cond>*{box-sizing:border-box;vertical-align:top}
      .cond>input[name=left]{width:80px;height:22px;margin:0 1px!important}
      .cond>input[name=right]{width:36px;height:22px;margin:0 1px!important}
      .cond select{margin:0 1px;height:calc(4em / 3 + 6px)}
      .del-cond{width:22px;height:22px;margin:0 1px!important}
      #bh-cfg-textarea{width:100%;height:100px;resize:none;overflow-y:auto;padding:5px 5px;margin:10px 0 0 0;box-sizing:border-box}
    `);
  }

  const export_type = "all";
  const export_limit = 2;
  const stat_rows = ["Average", "Total", "Max", "Min"];

  const default_rows = 50;
  const aggregate_by_day = true;
  const include_manually_ignored_stats = false;
  const default_isekai = ["Persistent", "Isekai"];
  const default_difficulties = ["PFUDOR", "IWBTH", "Nintendo", "Hell", "Nightmare"];
  const default_results = ["Victory", "Flee"];
  const default_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  let table_columns = {
    Speed: [
      { column_name: "Timestamp", field: "timestamp", tooltip: "ignore_button" },

      { column_name: "Diff", field: "difficulty" },

      { column_name: "Rounds", field: "completed_rounds", tooltip: "log" },
      { column_name: "Time", field: "seconds", format: "time_string" },
      { column_name: "TPS", numerator: "turns", denominator: "seconds" },
      { column_name: "Turns", field: "turns", bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" } },
    ],
    Details: [
      {
        column_name: "EXP",
        drops: "EXP",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
        units: "0",
      },

      { column_name: "Persona", field: "persona", tooltip: "equipped" },
    ],
    Money: [
      {
        column_name: "revenue",
        field: "revenue",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
        units: "0",
      },

      {
        column_name: "cost",
        field: "cost1",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
        units: "0",
      },
      {
        column_name: "Profit",
        field: "profit",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
        units: "0",
      },
    ],
    Drops: [
      {
        column_name: "PA",
        drops: "Precursor Artifact",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
      },
      {
        column_name: "Crystals",
        drops: "Crystal",
        bins: { 1: "color: #922099", 2: "color: #299ec4", 3: "color: #209928" },
      },
      { column_name: "Blood", drops: "Blood" },
      { column_name: "Chaos", drops: "Chaos" },
      { column_name: "FC", drops: "Festival Coupon" },
      { column_name: "Legs", drops: "Legendary", tooltip: "Equips", keyword: "Legendary" },
      { column_name: "Peer", drops: "Peerless", tooltip: "Equips", keyword: "Peerless" },
    ],
    "Usage Breakdown": [
      {
        column_name: "Spells",
        sum_usage: [
          "Paradise Lost",
          "Banishment",
          "Smite",
          "Shockblast",
          "Chained Lightning",
          "Wrath of Thor",
          "Fiery Blast",
          "Inferno",
          "Flames of Loki",
          "Freeze",
          "Blizzard",
          "Fimbulvetr",
          "Gale",
          "Downburst",
          "Storms of Njord",
          "Corruption",
          "Disintegrate",
          "Ragnarok",
        ],
        tooltip: "sum_usage",
      },
      { column_name: "DeBuff", sum_usage: ["Imperil", "Weaken", "Sleep", "Silence"], tooltip: "sum_usage" },
      { column_name: "Buff", sum_usage: ["Regen", "Arcane Focus", "Heartseeker"], tooltip: "sum_usage" },
      { column_name: "Heal", sum_usage: ["Full-Cure", "Cure"], tooltip: "sum_usage" },

      { column_name: "Gem", sum_usage: ["Spirit Gem", "Mana Gem", "Health Gem", "Mystic Gem"], tooltip: "sum_usage" },

      { column_name: "spark", field: "spark" },
      { column_name: "horse", field: "horse" },
    ],
    "Consumable Usage": [
      {
        column_name: "SUM",
        sum_usage: [
          "Mana Potion",
          "Spirit Potion",
          "Health Potion",
          "Mana Elixir",
          "Spirit Elixir",
          "Health Elixir",
          "Mana Draught",
          "Spirit Draught",
          "Health Draught",
          "Last Elixir",
        ],
        tooltip: "sum_usage",
      },
      {
        column_name: "消耗品",
        sum_usage: [
          "Mana Potion",
          "Spirit Potion",
          "Health Potion",
          "Mana Elixir",
          "Spirit Elixir",
          "Health Elixir",
          "Mana Draught",
          "Spirit Draught",
          "Health Draught",
          "Last Elixir",
          "Scroll of Life",
          "Scroll of Protection",
          "Scroll of Swiftness",
          "Scroll of Shadows",
          "Scroll of the Avatar",
          "Scroll of the Gods",
          "Infusion of Flames",
          "Infusion of Frost",
          "Infusion of Storms",
          "Infusion of Lightning",
        ],
        tooltip: "sum_usage",
      },
    ],
    "Consumable Diff": [
      {
        column_name: "SUM",
        sum_difference: [
          "Mana Potion",
          "Spirit Potion",
          "Health Potion",
          "Mana Elixir",
          "Spirit Elixir",
          "Health Elixir",
          "Scroll of Protection",
          "Scroll of Swiftness",
          "Scroll of Shadows",
          "Scroll of the Avatar",
          "Scroll of the Gods",
          "Scroll of Life",
          "Mana Draught",
          "Spirit Draught",
          "Health Draught",
          "Aether Shard",
          "Amnesia Shard",
          "Monster Cuisine",
          "Monster Edibles",
          "Infusion of Storms",
          "Infusion of Lightning",
          "Infusion of Divinity",
          "Infusion of Darkness",
          "Happy Pills",
          "Monster Chow",
          "Infusion of Flames",
          "Infusion of Frost",
        ],
        tooltip: "sum_difference",
      },
    ],
  };

  const GodEquips = [
    ["Rapier", "Slaughter"],
    ["Wakizashi", "Battlecaster"],
    ["Buckler", ["Barrier", "Battlecaster"]],
    [["Fiery", "Arctic", "Shocking", "Tempestuous", "Demonic"], "Willow", "Destruction"],
    ["Hallowed", "Oak", ["Focus", "Heimdall"]],
    [["Radiant", "Charged"], "Phase"],
    ["Charged", ["Elementalist", "Heaven-sent", "Demon-fiend"]],
    ["Reinforced", "Leather", "Protection"],
    [["Savage", "Agile"], "Shadowdancer"],
    ["Shielding", "Plate", "Protection"],
    ["Power", "Slaughter"],
  ];

  let prices = JSON.parse(localStorage.getItem("hvbs_prices")) || {};

  let prices_isekai = JSON.parse(localStorage.getItem("hvbs_prices_isekai")) || {};

  class BattleStats {
    constructor(json_obj, detail) {
      if (json_obj) {
        for (let k in json_obj) {
          this[k] = json_obj[k];
        }
      } else {
        if (isIsekai) {
          this.isekai = true;
        }

        let playerInfo = getStorageAll(CONFIG_KEY);
        this.difficulty = playerInfo?.difficulty || "Unknown";
        this.persona = playerInfo?.persona || "Unknown";
        this.equip_set = playerInfo?.equip_set || [];
        this.level = +playerInfo?.level || 0;

        let bs_timeLog = detail.timelog;
        this.fighting_style = bs_timeLog["Fighting Style"] || "Unknown";
        this.timestamp = new Date(bs_timeLog.startTime).toISOString().slice(0, 19).replace("T", " ");
        this.seconds = Math.round((Date.now() - bs_timeLog.startTime) / 10) / 100;
        this.turns = bs_timeLog.action;
        this.date = this.timestamp.substring(0, 10);
        this.rounds = parseInt(bs_timeLog.rounds) || 1;

        this.spark = bs_timeLog.spark || 0;
        this.horse = bs_timeLog.horse || 0;

        var result_text = document.getElementById("btcp").innerText;

        if (result_text.includes("Arena challenge")) {
          if (this.rounds == 1) {
            this.battle_type = "RoB";
            let monsters = Array.from(document.getElementById("pane_monster").children).map(
              (x) => x.getElementsByClassName("fc2")[0].innerText,
            );
            if (monsters.includes("Flying Spaghetti Monster") && monsters.includes("Invisible Pink Unicorn")) {
              this.rob_level = 7;
            } else if (monsters.includes("Flying Spaghetti Monster")) {
              this.rob_level = 6;
            } else if (monsters.includes("Invisible Pink Unicorn")) {
              this.rob_level = 5;
            } else if (monsters.includes("Real Life")) {
              this.rob_level = 4;
            } else if (monsters.includes("Yuki Nagato")) {
              this.rob_level = 3;
            } else if (monsters.includes("Ryouko Asakura")) {
              this.rob_level = 2;
            } else if (monsters.includes("Mikuru Asahina")) {
              this.rob_level = 1;
            } else if (monsters.includes("Konata")) {
              this.rob_level = 0;
            }
          } else {
            this.battle_type = "Arena";
          }
        } else if (result_text.includes("world")) {
          this.battle_type = "IW";
        } else if (result_text.includes("rindfest")) {
          this.battle_type = "GF";
        } else {
          this.battle_type = "RE";
          this.rounds = 1;
        }

        if (result_text.includes("You are victorious!")) {
          this.result = "Victory";
        } else if (result_text.includes("You have been defeated!")) {
          this.result = "Defeat";
          this.completed_rounds = bs_timeLog.round - 1;
          this.log = Array.from(document.getElementById("textlog").rows)
            .map((x) => x.innerText)
            .join("\n");
        } else if (result_text.includes("You have run away!")) {
          this.result = "Flee";
          this.completed_rounds = bs_timeLog.round - 1;
        }

        this.combat = detail.combatlog;

        let drops = detail.droplog;
        let formatted_drops = {};
        let entries = Object.entries(drops);
        for (let i = 0; i < entries.length; i++) {
          if (entries[i][1].constructor === Object) {
            if (entries[i][0] == "Equips") {
              if (Object.entries(entries[i][1]).length > 0) {
                formatted_drops.Equips = entries[i][1];
              }
            } else if (Object.entries(entries[i][1]).length) {
              let sub_entries = Object.entries(entries[i][1]);
              for (let j = 0; j < sub_entries.length; j++) {
                if (entries[i][0] == "proficiency") {
                  if (!this.proficiency) {
                    this.proficiency = {};
                  }
                  this.proficiency[sub_entries[j][0]] = Number(sub_entries[j][1].toFixed(8));
                } else {
                  formatted_drops[sub_entries[j][0]] = sub_entries[j][1];
                }
              }
            }
          } else {
            formatted_drops[entries[i][0]] = entries[i][1];
          }
        }
        this.drops = formatted_drops;
      }
    }
  }

  BattleStats.prototype.generateDBRecord = function () {
    let data = {
      drops: this.drops,
      combat: this.combat,
      timestamp: this.timestamp,
      result: this.result,
      battle_type: this.battle_type,
      rounds: this.rounds,
      turns: this.turns,
      seconds: this.seconds,
      difficulty: this.difficulty,
      fighting_style: this.fighting_style,
      persona: this.persona,
      equip_set: this.equip_set,
      level: this.level,
      date: this.date,
      spark: this.spark,
      horse: this.horse,
    };
    if ("rob_level" in this) {
      data.rob_level = this.rob_level;
    }
    if (this.completed_rounds) {
      data.completed_rounds = this.completed_rounds;
    }
    if (this.proficiency) {
      data.proficiency = this.proficiency;
    }
    if (this.log) {
      data.log = this.log;
    }
    if (this.ignore) {
      data.ignore = this.ignore;
    }
    if (this.isekai) {
      data.isekai = this.isekai;
    }
    return data;
  };

  BattleStats.prototype.saveToDB = function () {
    let pointer = this;
    let request = self.indexedDB.open("Battle Stats");
    request.onsuccess = function (event) {
      let os_req = event.target.result
        .transaction("battles", "readwrite")
        .objectStore("battles")
        .put(pointer.generateDBRecord());
      os_req.onsuccess = function (event) {
        console.log("Battle Stat Successfully Saved");
        console.log(pointer);
        pointer.addSaveText();
      };
    };
  };

  BattleStats.prototype.addSaveText = function () {
    let btcp = document.getElementById("btcp");
    if (btcp) {
      btcp.appendChild(document.createElement("br"));
      let span = btcp.appendChild(document.createElement("span"));
      span.innerText = "Added to Battle Stats!";
    }
  };

  function addData(index, lower_bound, upper_bound, table_div, filters, arena_row = false) {
    getTableParent().children[1].classList.add("hbs-querying");
    let stats = [];
    let request = self.indexedDB.open("Battle Stats");
    request.onsuccess = function (event) {
      let os = event.target.result.transaction("battles", "readonly").objectStore("battles");
      let key_range = IDBKeyRange.bound(lower_bound, upper_bound);
      let key_req = (index === "default" ? os : os.index(index)).openCursor(key_range, "prevunique");
      let i = 0;
      key_req.onsuccess = function (e) {
        if (arena_row || document.getElementById(table_div.id)) {
          let cursor = e.target.result;
          if (cursor && i < filters.limit) {
            if (index.includes("date")) {
              let daily_req;
              if (index === "date") {
                daily_req = os.index("date").getAll(cursor.key);
              } else {
                daily_req = os.index("date,battle_type").getAll([cursor.key[1], lower_bound[0]]);
              }
              daily_req.onsuccess = function (ev) {
                let results = ev.target.result;
                if (results.length > 0) {
                  results = results.map((x) => processData(x)).filter((x) => filterData(x, filters));
                  if (results.length > 0) {
                    i += 1;
                    stats.push(generateAggregate(results, "Total", results[0].date));
                    if (stats.length === filters.limit) {
                      fillTable(stats, table_div, filters);
                    }
                  }
                }
              };
            } else {
              let bs = filterData(processData(cursor.value), filters);
              if (bs) {
                stats.push(bs);
                i += 1;
              }
            }
            cursor.continue();
          } else {
            if (!index.includes("date")) {
              stats = stats.map((x) => processData(x));
              if (arena_row) {
                fillRow(stats, arena_row);
              } else {
                fillTable(stats, table_div, filters);
              }
            } else if (stats.length < filters.limit) {
              fillTable(stats, table_div, filters);
            }
          }
        }
      };
    };
  }

  function filterData(data, filters) {
    if (filters.difficulties) {
      if (!filters.difficulties.includes(data.difficulty)) {
        return false;
      }
    }

    if (!filters.include_ignored) {
      if (data.ignore) {
        return false;
      }
    }

    if (filters.result && !filters.result.includes(data.result)) {
      return false;
    }

    if (filters.days) {
      let day = new Date(data.timestamp.replaceAll("-", "/") + " GMT").getUTCDay();
      if (!filters.days.includes(day)) {
        return false;
      }
    }

    if (filters.arena) {
      if (data.rounds !== filters.arena) {
        return false;
      }
    }
    if ("rob" in filters) {
      if (data.rob_level !== filters.rob) {
        return false;
      }
    }

    if (filters.isekai && !filters.isekai.includes(data.isekai)) {
      return false;
    }

    let input2val = document.querySelector(".hbs_filter_rows2 input").value;
    let startDate = null,
      endDate = null;

    if (/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(input2val)) {
      let [startStr, endStr] = input2val.split("/");
      startDate = new Date(startStr + "T00:00:00Z");
      endDate = new Date(endStr + "T00:00:00Z");
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(input2val)) {
      startDate = new Date(input2val + "T00:00:00Z");
      endDate = new Date(input2val + "T00:00:00Z");
    }
    if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
      let dataDate = new Date(data.date.replaceAll("-", "/") + " GMT");

      if (dataDate < startDate || dataDate > endDate) {
        return false;
      }
    }

    return data;
  }

  function processData(data) {
    if (!data.completed_rounds) {
      data.completed_rounds = data.rounds;
    }

    if (data.battle_type === "GF") {
      data.stamina = 1 + (data.completed_rounds || data.rounds) / 50;
    } else if (data.battle_type === "Arena") {
      data.stamina = (data.completed_rounds || data.rounds) / 50;
    } else if (data.battle_type === "IW") {
      data.stamina = data.rounds / 50;
    } else {
      data.stamina = 0;
    }

    if (data.battle_type === "RoB" && !("rob_level" in data)) {
      data.rob_level = 0;
    }

    if (data.isekai === undefined) {
      data.isekai = "Persistent";
    } else if (data.isekai === true) {
      data.isekai = "Isekai";
    }

    if (!document.prices_updated) {
      let bs_prices = JSON.parse(localStorage.getItem("bs_prices"));
      if (bs_prices) {
        for (let item in prices) {
          if (item in bs_prices) {
            prices[item] = bs_prices[item];
          } else {
            console.log("Couldn't find " + item + ": " + prices[item]);
          }
        }
        console.log("prices automatically loaded");
        console.log(prices);
      }
      document.prices_updated = true;
    }

    data.revenue = calculateRevenue(data);
    data.cost = calculateCost(data);
    data.cost1 = Math.round(calculateCost(data) - prices.Stamina * data.stamina);
    data.profit = Math.round((data.revenue - data.cost) * 100) / 100;

    return data;
  }

  function calculateRevenue(battle_stat) {
    let value = 0;

    if (battle_stat.drops.Credit) {
      value += battle_stat.drops.Credit;
    }

    if (battle_stat.battle_type == "Arena") {
      if (battle_stat.rounds == 5) {
        value += 20;
      }
      if (battle_stat.rounds == 7) {
        value += 200;
      }
      if (battle_stat.rounds == 12) {
        value += 400;
      }
      if (battle_stat.rounds == 15) {
        value += 600;
      }
      if (battle_stat.rounds == 20) {
        value += 800;
      }
      if (battle_stat.rounds > 20) {
        value += 1000;
      }
    } else if (battle_stat.battle_type == "RoB") {
      if (battle_stat.result == "Victory") {
        value += 1000;
      }
    } else if (battle_stat.battle_type == "GF") {
      if (battle_stat.result == "Victory") {
        value += 5000;
      }
    }

    for (let drop in prices) {
      if (battle_stat.drops[drop]) {
        if (drop == "Equipment") {
          value += battle_stat.drops.Equipment * prices.Equipment[battle_stat.difficulty];
        } else if (battle_stat.isekai === "Isekai") {
          if (!!prices_isekai[drop] || prices_isekai[drop] === 0)
            value += battle_stat.drops[drop] * prices_isekai[drop];
          else console.log(drop + ":No price");
        } else {
          value += battle_stat.drops[drop] * prices[drop];
        }
      }
    }
    return Math.round(value * 100) / 100;
  }

  function calculateCost(battle_stat) {
    let value = 0;

    value += prices.Stamina * battle_stat.stamina;

    if (battle_stat.battle_type == "RoB") {
      if (battle_stat.rob_level == 0) {
        value += 1 * prices.Blood;
      } else if (battle_stat.rob_level < 4) {
        value += 2 * prices.Blood;
      } else if (battle_stat.rob_level < 6) {
        value += 3 * prices.Blood;
      } else if (battle_stat.rob_level == 6) {
        value += 5 * prices.Blood;
      } else if (battle_stat.rob_level == 7) {
        value += 10 * prices.Blood;
      }
    }

    for (let usage in prices) {
      if (battle_stat.combat.used[usage]) {
        value +=
          battle_stat.combat.used[usage] * (battle_stat.isekai === "Isekai" ? prices_isekai[usage] : prices[usage]);
      }
    }

    return Math.round(value * 100) / 100;
  }

  function generateAggregate(data_array, type, timestamp_name = null) {
    if (data_array.length === 0) {
      return false;
    } else {
      let length = type === "Average" ? data_array.length : 1;
      let new_data = {};
      new_data.timestamp = timestamp_name || type;
      new_data.result = data_array
        .map((x) => x.result.split(","))
        .flat()
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .join(",");
      new_data.battle_type = data_array
        .map((x) => x.battle_type)
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .join(",");
      new_data.rounds = Math.round((data_array.map((x) => x.rounds).reduce((a, b) => a + b, 0) / length) * 100) / 100;
      new_data.completed_rounds =
        Math.round((data_array.map((x) => x.completed_rounds).reduce((a, b) => a + b, 0) / length) * 100) / 100;
      new_data.difficulty = data_array
        .map((x) => x.difficulty.split(","))
        .flat()
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .join(",");

      new_data.fighting_style = data_array
        .map((x) => (x.fighting_style || "").split(","))
        .flat()
        .filter((item, i, ar) => ar.indexOf(item) === i && item)
        .join(",");
      new_data.persona = data_array
        .map((x) => x.persona.split(","))
        .flat()
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .join(",");
      new_data.equip_set = data_array
        .map((x) => x.equip_set)
        .flat()
        .filter((item, i, ar) => ar.indexOf(item) === i);
      let uniq_isekai = data_array.map((x) => x.isekai).filter((item, i, ar) => ar.indexOf(item) === i);
      new_data.isekai = uniq_isekai.length > 1 ? "Both" : uniq_isekai[0];

      if (typeof data_array[0].level == "string") {
        data_array.level = data_array
          .map((x) => x.level.split(" - "))
          .flat()
          .map((x) => parseInt(x));
      } else {
        data_array.level = data_array.map((x) => x.level);
      }
      new_data.level =
        type === "Average"
          ? Math.round((data_array.level.reduce((a, b) => a + b) / data_array.level.length) * 10) / 10
          : Math.min.apply(null, data_array.level) + " - " + Math.max.apply(null, data_array.level);

      let combat = {};
      let drops = { Equips: {} };
      let proficiency = {};
      for (let i = 0; i < data_array.length; i++) {
        for (let sub_combat in data_array[i].combat) {
          combat[sub_combat] = combat[sub_combat] || {};
          for (let key in data_array[i].combat[sub_combat]) {
            combat[sub_combat][key] = (combat[sub_combat][key] || 0) + data_array[i].combat[sub_combat][key];
          }
        }
        let data_drops = Object.entries(data_array[i].drops);
        for (let j = 0; j < data_drops.length; j++) {
          if (typeof data_drops[j][1] == "number") {
            drops[data_drops[j][0]] = (drops[data_drops[j][0]] || 0) + (data_drops[j][1] || 0);
          } else {
            for (let equip in data_drops[j][1]) {
              drops[data_drops[j][0]][equip] = (drops[data_drops[j][0]][equip] || 0) + data_drops[j][1][equip];
            }
          }
        }
        for (let key in data_array[i].proficiency) {
          if (data_array[i].proficiency.hasOwnProperty(key)) {
            proficiency[key] = parseFloat(((proficiency[key] || 0) + data_array[i].proficiency[key]).toFixed(8));
          }
        }
      }

      if (type === "Average") {
        for (let sub_combat in combat) {
          for (let key in combat[sub_combat]) {
            if (combat[sub_combat].hasOwnProperty(key)) {
              combat[sub_combat][key] = Math.round((combat[sub_combat][key] / length) * 10) / 10;
            }
          }
        }
        for (let key in drops) {
          if (drops.hasOwnProperty(key)) {
            drops[key] = Math.round((drops[key] / length) * 10) / 10;
          }
        }
        for (let key in proficiency) {
          if (proficiency.hasOwnProperty(key)) {
            proficiency[key] = Math.round((proficiency[key] / length) * 100000) / 100000;
          }
        }
      }
      new_data.combat = combat;
      new_data.drops = drops;
      if (Object.entries(proficiency).length > 0) {
        new_data.proficiency = proficiency;
      }

      let total_turns = data_array.map((x) => x.turns).reduce((a, b) => a + b, 0);
      let total_seconds = data_array.map((x) => x.seconds).reduce((a, b) => a + b, 0);
      new_data.turns = type === "Average" ? Math.round((total_turns / length) * 100) / 100 : total_turns;
      new_data.seconds =
        type === "Average" ? Math.round((total_seconds / length) * 100) / 100 : Math.round(total_seconds * 100) / 100;

      new_data.stamina = Math.round((data_array.map((x) => x.stamina).reduce((a, b) => a + b, 0) / length) * 100) / 100;
      new_data.revenue = Math.round((data_array.map((x) => x.revenue).reduce((a, b) => a + b, 0) / length) * 10) / 10;
      new_data.cost = Math.round((data_array.map((x) => x.cost).reduce((a, b) => a + b, 0) / length) * 10) / 10;
      new_data.cost1 = Math.round((data_array.map((x) => x.cost1).reduce((a, b) => a + b, 0) / length) * 10) / 10;
      new_data.profit = Math.round((data_array.map((x) => x.profit).reduce((a, b) => a + b, 0) / length) * 10) / 10;
      new_data.spark = Math.round((data_array.map((x) => x.spark).reduce((a, b) => a + b, 0) / length) * 10) / 10;
      new_data.horse = Math.round((data_array.map((x) => x.horse).reduce((a, b) => a + b, 0) / length) * 10) / 10;

      new_data.agg = true;

      return new_data;
    }
  }

  function generateExtrema(data_array, type) {
    let extrema = {};
    if (type === "Max") {
      extrema = data_array.reduce(getRecursiveMax, extrema);
    } else {
      extrema = data_array.reduce(getRecursiveMin, extrema);
    }
    extrema.timestamp = type;

    extrema.agg = true;

    return extrema;
  }

  function getRecursiveMin(a, b, index) {
    for (let key in b) {
      if (key === "Equips") {
      } else if (typeof b[key] === "number") {
        a[key] = a[key] === undefined ? (index === 0 ? b[key] : 0) : a[key] > b[key] ? b[key] : a[key];
      } else if (typeof b[key] === "object") {
        a[key] = getRecursiveMin(a[key] || {}, b[key], index);
      } else if (typeof b[key] === "string") {
        if (key === "level") {
          let min = Math.min.apply(null, b[key].split(" - "));
          a[key] = a[key] === undefined || a[key] > min ? min : a[key];
        } else {
          a[key] = "";
        }
      }
    }
    return a;
  }

  function getRecursiveMax(a, b) {
    for (let key in b) {
      if (key === "Equips") {
      } else if (typeof b[key] === "number") {
        a[key] = a[key] === undefined || a[key] < b[key] ? b[key] : a[key];
      } else if (typeof b[key] === "object") {
        a[key] = getRecursiveMax(a[key] || {}, b[key]);
      } else if (typeof b[key] === "string") {
        if (key === "level") {
          let max = Math.max.apply(null, b[key].split(" - "));
          a[key] = a[key] === undefined || a[key] < max ? max : a[key];
        } else {
          a[key] = "";
        }
      }
    }
    return a;
  }

  function addPageUI() {
    let url = window.location.href;
    if (url.includes("hentaiverse.org/battle_stats") || url.includes("hentaiverse.org/isekai/battle_stats")) {
      console.log("Loading UI");
      document.title = "HV Battle Stats";
      addSharedCSS();
      addPageCSS();
      addTableCSS();

      let newBody = document.createElement("div");
      newBody.id = "hbs-main";

      document.body.replaceChildren(newBody);

      let menu = generateMenuItems("hbs-menu");
      newBody.appendChild(menu);

      let filters = createFilters();
      newBody.append(filters);

      let tableParent = getTableParent();
      newBody.appendChild(tableParent);

      addUIListeners();
    }
  }

  function addMenuIntegration(parent_name = "bh-box") {
    let nav_bar = document.getElementById(parent_name);
    if (nav_bar) {
      addSharedCSS();
      addMenuCSS();
      addTableCSS();

      let bs_menu = document.createElement("div");
      bs_menu.classList.add("hbs_menu");
      let title_span = document.createElement("span");
      title_span.innerText = "BS";
      let menu_list = generateMenuItems("hbs-menu-list", true);

      bs_menu.appendChild(title_span);
      bs_menu.appendChild(menu_list);

      if (nav_bar) {
        let userMenu = document.getElementById("bh-setting");
        userMenu.after(bs_menu);
      }

      addUIListeners();

      let container = getMainContainer();
      document.getElementById("mainpane").appendChild(container);

      if (!log && document.URL.includes("?s=Battle&ss=ar")) {
        modifyArenaRows("Arena");
      } else if (!log && document.URL.includes("?s=Battle&ss=rb")) {
        modifyArenaRows("RoB");
      }

      console.log("Loaded Battle Stats Menu Integration");
    }
  }

  function modifyArenaRows(type) {
    let challenges = Array.from(document.getElementById("arena_list").rows);
    challenges[0].children[1].innerText = "Avg. Turns";
    challenges[0].children[2].innerText = "Avg. Value/Round";
    challenges[0].children[4].innerText = "Avg. Time";

    for (let i = 1; i < challenges.length; i++) {
      let filters = { limit: default_rows };
      if (type === "Arena") {
        filters["arena"] = parseInt(challenges[i].children[3].innerText);
      } else {
        filters["rob"] = i - 1;
      }
      addData("battle_type,timestamp", [type, 0], [type, "z"], null, filters, challenges[i]);
    }

    if (type === "Arena") {
      let observer = new MutationObserver(function (mutations) {
        for (let mutation of mutations) {
          let rows = mutation.addedNodes;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].tagName === "TR") {
              let rounds = parseInt(rows[i].children[3].innerText);
              let filters = { limit: default_rows, arena: rounds };
              addData("battle_type,timestamp", [type, 0], [type, "z"], null, filters, rows[i]);
            }
          }
        }
      });

      observer.observe(document.getElementById("arena_list").children[0], {
        childList: true,
      });
    }
  }

  function generateMenuItems(className, menu_integration = false) {
    let menu_list = document.createElement("div");
    menu_list.classList.add(className);

    let ul = document.createElement("ul");
    menu_list.appendChild(ul);

    let items = ["All", "Arena", "Ring of Blood", "GrindFest", "Item World", "RE"];
    for (let i = 0; i < items.length; i++) {
      let li = document.createElement("li");
      let link = document.createElement("a");
      link.classList.add("hbs-list-table-link");
      link.href = "#";
      link.innerText = items[i];
      link.dataset.type = items[i];
      if (menu_integration) {
        link.dataset.menu = "True";
      }
      li.appendChild(link);
      ul.appendChild(li);
    }

    let divider_span = document.createElement("span");
    divider_span.classList.add("hbs-menu-divider");
    ul.append(divider_span);

    let li = document.createElement("li");
    li.appendChild(importDataLink());
    ul.appendChild(li);

    li = document.createElement("li");
    li.appendChild(exportDataLink());
    ul.appendChild(li);

    li = document.createElement("li");
    li.appendChild(deleteDataBaseLink());
    ul.appendChild(li);

    divider_span = document.createElement("span");
    divider_span.classList.add("hbs-menu-divider");
    ul.append(divider_span);

    li = document.createElement("li");
    let link = document.createElement("a");
    link.href = menu_integration ? "battle_stats" : "/";
    link.innerText = menu_integration ? "Separate Page" : "Back to HV";
    li.appendChild(link);
    ul.appendChild(li);

    return menu_list;
  }

  async function parseMarketData() {
    const baseUrl = location.origin;
    const suffixUrl = isIsekai ? "isekai/" : "";
    let urlArray = [
      `${baseUrl}/${suffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=co`,
      `${baseUrl}/${suffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=ma`,
      `${baseUrl}/${suffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=tr`,
    ];
    if (!isIsekai) {
      urlArray = urlArray.concat([
        `${baseUrl}/?s=Bazaar&ss=mk&screen=browseitems&filter=ar`,
        `${baseUrl}/?s=Bazaar&ss=mk&screen=browseitems&filter=fi`,
        `${baseUrl}/?s=Bazaar&ss=mk&screen=browseitems&filter=mo`,
      ]);
    }
    let latestPriceData = {
      Stamina: 0,

      Blood: 0,
      Chaos: 0,
      Soul: 0,
      Equipment: {
        PFUDOR: 508,
        IWBTH: 460,
        Nintendo: 400,
        Hell: 375,
        Nightmare: 350,
        Hard: 325,
        Normal: 300,
      },
    };

    await Utils.fetchUrls(urlArray).then((results) => {
      console.log("Utils.fetchUrls Results:");
      console.log(results);

      for (let result of results) {
        if (result["status"] === "rejected") {
          console.error("Fetch error:", result["reason"]);
          continue;
        }

        try {
          let parser = new DOMParser();
          let doc = parser.parseFromString(result["value"]["responseText"], "text/html");
          let itemListTrs = doc.querySelectorAll("#market_itemlist > table > tbody > tr");

          itemListTrs.forEach((itemListTr, index) => {
            if (index === 0) return;

            let itemListTds = itemListTr.querySelectorAll("td");
            if (itemListTds.length >= 4) {
              let name = itemListTds[0].textContent.trim();
              let bid = parseFloat(itemListTds[2].textContent.trim().replace(" C", "").replace(",", ""));
              let ask = parseFloat(itemListTds[3].textContent.trim().replace(" C", "").replace(",", ""));

              if (!isNaN(bid)) {
                latestPriceData[name] = bid;
              } else if (!isNaN(ask)) {
                latestPriceData[name] = ask;
              } else {
                latestPriceData[name] = 0;
              }
            }
          });
        } catch (e) {
          console.error("Parsing error for url: " + result["value"]["url"]);
        }
      }
    });

    if (!isIsekai) {
      const crystalNames = [
        "Crystal of Vigor",
        "Crystal of Finesse",
        "Crystal of Swiftness",
        "Crystal of Fortitude",
        "Crystal of Cunning",
        "Crystal of Knowledge",
        "Crystal of Flames",
        "Crystal of Frost",
        "Crystal of Lightning",
        "Crystal of Tempest",
        "Crystal of Devotion",
        "Crystal of Corruption",
      ];
      let Crystaltotal = crystalNames.reduce((sum, name) => sum + (prices[name] || 0), 0);
      latestPriceData.Crystal = (Crystaltotal / 12).toFixed(3);
      let staminaPrice = (prices["Energy Drink"] || 0) / 10;
      latestPriceData.Stamina = staminaPrice;
      latestPriceData["Energy Drink"] = 0;
      localStorage.setItem("hvbs_prices", JSON.stringify(latestPriceData));
    } else {
      latestPriceData.Stamina = prices.Stamina || 0;
      localStorage.setItem("hvbs_prices_isekai", JSON.stringify(latestPriceData));
    }
    location.reload();
  }

  function getMainContainer(show = false) {
    let container = document.getElementById("hbs_container");
    if (!container) {
      container = document.createElement("div");
      container.id = "hbs_container";
      let filters = createFilters();
      container.append(filters);
      let tableParent = getTableParent();
      container.appendChild(tableParent);

      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("hbs-buttons-container");

      const exit = document.createElement("button");
      exit.innerText = "Close";
      exit.addEventListener("click", function () {
        getMainContainer(false);
      });

      const updateBtn = document.createElement("button");
      updateBtn.innerText = "Update Price";
      updateBtn.addEventListener("click", function () {
        parseMarketData();
      });

      const viewBtn = document.createElement("button");
      viewBtn.innerText = "View Price";
      viewBtn.addEventListener("click", function () {
        const savedPrices = JSON.parse(localStorage.getItem("hvbs_prices")) || {};
        const savedPricesIsekai = JSON.parse(localStorage.getItem("hvbs_prices_isekai")) || {};
        const message = `📋 本地存储的价格：\n\n主世界价格:\n${JSON.stringify(savedPrices, null, 2)}\n\nisekai价格:\n${JSON.stringify(savedPricesIsekai, null, 2)}`;
        console.log(message);
        alert("📋 控制台Console查看！");
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete Price";
      deleteBtn.addEventListener("click", function () {
        localStorage.removeItem("hvbs_prices");
        localStorage.removeItem("hvbs_prices_isekai");

        alert("❌ 已清空所有存储的价格！");
        location.reload();
      });

      buttonsContainer.appendChild(exit);
      buttonsContainer.appendChild(updateBtn);
      buttonsContainer.appendChild(viewBtn);
      buttonsContainer.appendChild(deleteBtn);

      container.appendChild(buttonsContainer);
    }

    if (show) {
      container.classList.add("hbs_visible");
    } else {
      container.classList.remove("hbs_visible");
    }
    return container;
  }

  function importDataLink() {
    let fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.id = "hbs_upload";

    fileSelector.addEventListener("change", function () {
      if (fileSelector.files[0]) {
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
          console.log("loading data!");
          importDB(event.target.result);
        });
        reader.readAsBinaryString(fileSelector.files[0]);
      }
    });

    let selectLink = document.createElement("a");
    selectLink.setAttribute("href", "");
    selectLink.innerText = "Import Data";
    selectLink.href = "#";
    selectLink.onclick = function () {
      fileSelector.click();
      return false;
    };

    return selectLink;
  }

  function exportDataLink() {
    let selectLink = document.createElement("a");
    selectLink.setAttribute("href", "");
    selectLink.innerText = "Export Data";
    selectLink.href = "#";
    selectLink.onclick = function () {
      exportDB();
      return false;
    };
    return selectLink;
  }

  function deleteDataBaseLink() {
    let selectLink = document.createElement("a");
    selectLink.setAttribute("href", "");
    selectLink.innerText = "Delete Database";
    selectLink.href = "#";
    selectLink.onclick = function () {
      deleteDB();
      return false;
    };
    return selectLink;
  }

  function addUIListeners() {
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("hbs-list-table-link")) {
        event.preventDefault();
        current_selection = event.target.dataset.type;
        if (event.target.dataset.menu) {
          let container = getMainContainer(true);
          document.getElementById("mainpane").appendChild(container);
        }
        renderFilters();
        startQuery();
      }
    });
  }

  function startQuery(type = current_selection) {
    if (type) {
      let tableParent = getTableParent(type);
      let existing_tables = tableParent.getElementsByClassName("hbs-table");
      if (existing_tables) {
        Array.from(existing_tables).map((x) => tableParent.removeChild(x));
      }

      let table = generateTable();
      tableParent.appendChild(table);

      let filters = getFilters();

      let index, battle_type, lower_bound, upper_bound;

      if (type === "All") {
        index = filters.aggregate ? "date" : "default";
        lower_bound = 0;
        upper_bound = "z";
      } else {
        index = filters.aggregate ? "battle_type,date" : "battle_type,timestamp";
        if (type === "Arena") {
          battle_type = "Arena";
        } else if (type === "Ring of Blood") {
          battle_type = "RoB";
        } else if (type === "GrindFest") {
          battle_type = "GF";
        } else if (type === "Item World") {
          battle_type = "IW";
        } else if (type === "RE") {
          battle_type = "RE";
        }
        lower_bound = [battle_type, 0];
        upper_bound = [battle_type, "z"];
      }

      addData(index, lower_bound, upper_bound, table, filters);
    }
  }

  function getTableParent(title = "") {
    let parent = document.getElementById("hbs_table_parent");
    if (!parent) {
      parent = document.createElement("div");
      parent.id = "hbs_table_parent";
      parent.classList.add("hbs-table-holder");

      let title_div = document.createElement("div");
      title_div.classList.add("hbs-table-title");
      parent.appendChild(title_div);

      let querying_span = document.createElement("span");
      querying_span.id = "hbs_query_span";
      querying_span.innerText = "Querying";
      parent.appendChild(querying_span);
    }
    if (title) {
      parent.children[0].innerText = title;
    }

    return parent;
  }

  function generateTable() {
    let table = document.createElement("table");
    table.classList.add("hbs-table");
    table.id = "table-id-" + String(Date.now());

    return table;
  }

  function fillTable(stats, table) {
    let columns = getColumns();
    table = document.getElementById(table.id);
    if (stats.length < 1) {
      table.innerText = "No Results. Fight some battles or adjust the filters.";
    } else if (table) {
      let table_header = table.createTHead();

      let grouping_row = table_header.insertRow(-1);
      grouping_row.classList.add("grouping_row");
      for (let i = 0; i < Object.keys(table_columns).length; i++) {
        let length = table_columns[Object.keys(table_columns)[i]].length;
        if (length > 0) {
          let grouping_header = document.createElement("th");
          grouping_header.colSpan = length;
          grouping_header.innerText = Object.keys(table_columns)[i];
          grouping_row.append(grouping_header);
        }
      }

      let header_row = table_header.insertRow(-1);
      header_row.classList.add("header_row");
      for (let i = 0; i < columns.length; i++) {
        let table_header = document.createElement("th");
        table_header.innerText = columns[i].column_name;
        header_row.append(table_header);
      }

      let tbody = table.createTBody();
      let Average_data = generateAggregate(stats, "Average");
      for (let i = 0; i < stats.length; i++) {
        if (stats[i]) {
          let row = generateRow(tbody, -1, stats[i], Average_data);
          row.classList.add("stats_row");
        }
      }

      for (let i = stat_rows.length; i >= 0; i--) {
        if (["Average", "Total", "Max", "Min"].includes(stat_rows[i])) {
          let stat_data = ["Min", "Max"].includes(stat_rows[i])
            ? generateExtrema(stats, stat_rows[i])
            : generateAggregate(stats, stat_rows[i]);
          let row = generateRow(table_header, 2, stat_data, Average_data);
          row.classList.add("agg_row");
          if (i === stat_rows.length - 1) {
            row.classList.add("last_agg_row");
          }
        }
      }
    }
    getTableParent().children[1].classList.remove("hbs-querying");
  }

  function fillRow(stats, row) {
    let avg = generateAggregate(stats, "Average") || {};
    row.children[1].innerText = (avg.turns || 0).toFixed(2);
    row.children[2].innerText = (avg.rounds ? (avg.profit || 0) / avg.rounds : 0).toFixed(2);
    row.children[4].innerText = getTimeString(avg.seconds || 0);
  }

  function generateRow(table, position, data, Average_data) {
    let columns = getColumns();

    let row = table.insertRow(position);
    for (let j = 0; j < columns.length; j++) {
      let table_cell = row.insertCell(-1);
      let cell_content = "Invalid format";
      if ("field" in columns[j]) {
        cell_content = data[columns[j].field] || 0;
      } else if ("numerator" in columns[j]) {
        cell_content = (data[columns[j].numerator] / data[columns[j].denominator]).toFixed(2);
      } else if ("drops" in columns[j]) {
        cell_content = data.drops[columns[j].drops] || 0;
      } else if ("usage" in columns[j]) {
        cell_content = String(Math.round((data.combat.used[columns[j].usage] || 0) * 100) / 100);
      } else if ("difference" in columns[j]) {
        let value =
          Math.round(
            ((data.drops[columns[j].difference] || 0) - (data.combat.used[columns[j].difference] || 0)) * 100,
          ) / 100;
        cell_content = (value > 0 ? "+" : "") + value;
      } else if ("sum_usage" in columns[j]) {
        let value = 0;
        for (let i = 0; i < columns[j].sum_usage.length; i++) {
          value += data.combat.used[columns[j].sum_usage[i]] || 0;
        }
        cell_content = String(Math.round(value * 100) / 100);
      } else if ("sum_drops" in columns[j]) {
        let value = 0;
        for (let i = 0; i < columns[j].sum_drops.length; i++) {
          value += data.drops[columns[j].sum_drops[i]] || 0;
        }
        cell_content = String(Math.round(value * 100) / 100);
      } else if ("sum_difference" in columns[j]) {
        let value = 0;
        for (let i = 0; i < columns[j].sum_difference.length; i++) {
          value +=
            (data.drops[columns[j].sum_difference[i]] || 0) - (data.combat.used[columns[j].sum_difference[i]] || 0);
        }
        cell_content = (value > 0 ? "+" : "") + Math.round(value * 100) / 100;
      } else if ("presence" in columns[j]) {
        cell_content = columns[j].presence in data ? "True" : "False";
      } else {
        console.log("Invalid Format", columns[j]);
      }
      if ("bins" in columns[j]) {
        for (let bin_value in columns[j].bins) {
          if (bin_value == 1 || bin_value == 2 || bin_value == 3) {
            let avg_value = 0;
            if ("field" in columns[j]) {
              avg_value = Average_data[columns[j].field];
            } else if ("drops" in columns[j]) {
              avg_value = Average_data.drops[columns[j].drops];
            }
            if (!!avg_value) {
              if (parseFloat(cell_content) < avg_value && bin_value == 1) {
                table_cell.style.cssText = columns[j].bins[bin_value];
              } else if (parseFloat(cell_content) == avg_value && bin_value == 2) {
                table_cell.style.cssText = columns[j].bins[bin_value];
              } else if (parseFloat(cell_content) > avg_value && bin_value == 3) {
                table_cell.style.cssText = columns[j].bins[bin_value];
              }
            }
          } else {
            if (parseFloat(cell_content) > bin_value) {
              table_cell.style.cssText = columns[j].bins[bin_value];
            }
          }
        }
      }
      if ("units" in columns[j]) {
        let num_cell_content = Number(cell_content);
        if (!isNaN(num_cell_content)) {
          let sign = num_cell_content < 0 ? "-" : "";
          let absNum = Math.abs(num_cell_content);
          if (absNum >= 1e9) {
            cell_content = sign + (absNum / 1e9).toFixed(2) + "b";
          } else if (absNum >= 1e6) {
            cell_content = sign + (absNum / 1e6).toFixed(2) + "m";
          } else if (absNum >= 1e3) {
            cell_content = sign + (absNum / 1e3).toFixed(2) + "k";
          } else {
            cell_content = sign + absNum.toString();
          }
        }
      }
      if ("format" in columns[j]) {
        if (columns[j].format === "time_string") {
          cell_content = getTimeString(cell_content);
        }
      }
      table_cell.innerText = cell_content;
      if ("tooltip" in columns[j]) {
        addTooltip(table_cell, data, columns[j]);
      }
    }
    row.data = data;
    return row;
  }

  function isGodly(item) {
    return GodEquips.some((rule) =>
      rule.every((part) => {
        if (Array.isArray(part)) {
          return part.some((keyword) => item.includes(keyword));
        } else {
          return item.includes(part);
        }
      }),
    );
  }

  function addTooltip(cell, data, col) {
    let holder = [];
    if (col.tooltip === "Equips") {
      for (let key in data.drops.Equips) {
        if (key.includes(col.keyword)) {
          holder.push(key + ": " + data.drops.Equips[key]);
        }
      }
    } else if (col.tooltip === "log" && data.log) {
      let log_arr = data.log.split("\n");
      for (let i = 1; i < log_arr.length; i++) {
        if (!log_arr[i]) holder.push("----------");
        else holder.push(log_arr[i]);
      }
    } else if (col.tooltip === "proficiency") {
      for (let key in data[col.tooltip]) {
        holder.push(key + ": " + data[col.tooltip][key]);
      }
    } else if (col.tooltip === "equipped") {
      for (let i = 0; i < data.equip_set.length; i++) {
        holder.push(data.equip_set[i].replace(",", "/"));
      }
    } else if (col.tooltip === "sum_usage") {
      for (let i = 0; i < col.sum_usage.length; i++) {
        if (col.sum_usage[i] in data.combat.used) {
          holder.push(col.sum_usage[i] + ": " + data.combat.used[col.sum_usage[i]]);
        }
      }
    } else if (col.tooltip === "sum_drops") {
      for (let i = 0; i < col.sum_drops.length; i++) {
        if (col.sum_drops[i] in data.drops) {
          holder.push(col.sum_drops[i] + ": " + data.drops[col.sum_drops[i]]);
        }
      }
    } else if (col.tooltip === "sum_difference") {
      for (let i = 0; i < col.sum_difference.length; i++) {
        let count = 0;
        if (col.sum_difference[i] in data.drops) {
          count += data.drops[col.sum_difference[i]];
        }
        if (col.sum_difference[i] in data.combat.used) {
          count -= data.combat.used[col.sum_difference[i]];
        }
        holder.push(col.sum_difference[i] + ": " + count);
      }
    } else if (col.tooltip === "ignore_button") {
      holder.push("ignore_button");
    }
    if (holder.length === 0) {
      return;
    }

    let tooltip = document.createElement("span");
    tooltip.classList.add("hbs-tooltip");
    for (let i = 0; i < holder.length; i++) {
      let line = document.createElement("div");
      if (holder[i] === "ignore_button") {
        if (data.agg) {
          return line;
        }
        let checked = data.ignore ? true : false;
        let checkbox = createCheckBox("Ignore this entry", false, true, checked, false);
        checkbox.classList.add("hbs_ignore_checkbox");
        checkbox.addEventListener("change", function () {
          ignoreBattleStat(this);
        });
        line.append(checkbox);
      } else {
        if (col.tooltip === "equipped") {
          let equip_link = document.createElement("a");
          equip_link.href = "equip/" + holder[i];
          equip_link.innerText = holder[i];
          line.append(equip_link);
        } else if (col.tooltip === "Equips") {
          const filterisChecked = !!document.querySelector(
            '.hbs_filter_checkbox input[type="checkbox"][value="Filter Equipment"]',
          )?.checked;
          if (isGodly(holder[i])) {
            line.innerHTML = `<span style="
                            color: #FFFF00;
                            background-color: #8080C0;
                        ">${holder[i]}</span>`;
          } else if (!filterisChecked) {
            line.innerHTML = holder[i];
          }
        } else {
          line.innerHTML = holder[i];
        }
      }
      tooltip.appendChild(line);
    }
    let tooltip_parent = document.createElement("span");
    while (cell.childNodes.length) {
      tooltip_parent.appendChild(cell.firstChild);
    }
    tooltip_parent.append(tooltip);
    tooltip_parent.classList.add("hbs-tooltip-parent");
    cell.appendChild(tooltip_parent);
  }

  function getColumns() {
    if (!document.hbs_columns) {
      let bs_columns = JSON.parse(localStorage.getItem("bs_columns"));
      if (bs_columns) {
        table_columns = bs_columns;
      }
      document.hbs_columns = true;
    }

    return Object.values(table_columns).flat();
  }

  function getTimeString(time) {
    if (!time) {
      return "NA";
    }
    let hours = Math.floor(time / 3600),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time % 60),
      ms = time.toString().split(".")[1] || "00";
    return (
      (hours > 0 ? hours + ":" : "") +
      (minutes < 10 && hours > 0 ? "0" : "") +
      minutes +
      (seconds < 10 ? ":0" : ":") +
      seconds +
      (ms.length < 2 ? ".0" : ".") +
      ms
    );
  }

  function ignoreBattleStat(label_div) {
    let checked = label_div.children[0].checked;
    let data = label_div.parentNode.parentNode.parentNode.parentNode.parentNode.data;
    let new_stat = new BattleStats(data);
    new_stat.ignore = checked;
    new_stat.saveToDB();
  }

  function getFilters() {
    let filters = {};
    filters.aggregate = document.getElementById("hbs_filter_aggregate").children[0].children[0].checked;
    filters.include_ignored = document.getElementById("hbs_filter_manual").children[0].children[0].checked;
    filters.limit = parseInt(document.querySelector(".hbs_filter_rows1 input").value) || 1;

    filters.difficulties = Array.from(
      document.getElementById("hbs_filter_difficulties").querySelectorAll("input:checked"),
    ).map((x) => x.value);
    filters.result = Array.from(document.getElementById("hbs_filter_result").querySelectorAll("input:checked")).map(
      (x) => x.value,
    );
    filters.isekai = Array.from(document.getElementById("hbs_filter_isekai").querySelectorAll("input:checked")).map(
      (x) => x.value,
    );
    let days = Array.from(document.getElementById("hbs_filter_days").querySelectorAll("input:checked")).map(
      (x) => x.value,
    );
    let day_mapping = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
    filters.days = days.map((x) => day_mapping[x]);

    let arenas = document.getElementById("hbs_filter_arena");
    if (arenas && !arenas.classList.contains("hbs_hide") && arenas.children[0].value !== "All") {
      filters.arena = parseInt(arenas.children[0].value);
    }

    let rob = document.getElementById("hbs_filter_rob");
    if (rob && !rob.classList.contains("hbs_hide") && rob.children[0].value !== "All") {
      filters.rob = parseInt(rob.children[0].value);
    }

    console.log(filters);

    return filters;
  }

  function createFilters() {
    let filter_div = document.getElementById("hbs_filters");
    if (!filter_div) {
      filter_div = document.createElement("div");
      filter_div.id = "hbs_filters";

      filter_div.append(createCheckBoxes(["Aggregate by Day"], "hbs_filter_aggregate", aggregate_by_day));
      filter_div.append(
        createCheckBoxes(["Include Manually Ignored"], "hbs_filter_manual", include_manually_ignored_stats),
      );
      filter_div.append(createCheckBoxes(["Persistent", "Isekai"], "hbs_filter_isekai", default_isekai));
      filter_div.append(createInput(["显示行数：", "显示日期："], "hbs_filter_rows", [default_rows, ""]));
      filter_div.append(
        createCheckBoxes(
          ["PFUDOR", "IWBTH", "Nintendo", "Hell", "Nightmare", "Hard", "Normal"],
          "hbs_filter_difficulties",
          default_difficulties,
        ),
      );
      filter_div.append(
        createCheckBoxes(["Victory", "Defeat", "Flee", "Filter Equipment"], "hbs_filter_result", default_results),
      );
      filter_div.append(
        createCheckBoxes(
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "hbs_filter_days",
          default_days,
        ),
      );

      let arena_select = createSelect("hbs_filter_arena", [
        ["All", "All"],
        ["First Blood (2)", 2],
        ["Learning Curves (4)", 4],
        ["Graduation (6)", 6],
        ["Road Less Traveled (8)", 8],
        ["A Rolling Stone (10)", 10],
        ["Fresh Meat (12)", 12],
        ["Dark Skies (15)", 15],
        ["Growing Storm (20)", 20],
        ["Power Flux (25)", 25],
        ["Killzone (30)", 30],
        ["Endgame (35)", 35],
        ["Longest Journey (40)", 40],
        ["Dreamfall (45)", 45],
        ["Exile (50)", 50],
        ["Sealed Power (55)", 55],
        ["New Wings (60)", 60],
        ["To Kill a God (65)", 65],
        ["Eve of Death (70)", 70],
        ["The Trio and the Tree (75)", 75],
        ["End of Days (80)", 80],
        ["Eternal Darkness (85)", 85],
        ["A Dance with Dragons (90)", 90],
        ["Post Game Content (95)", 95],
        ["Secret Pony Level (100)", 100],
      ]);
      arena_select.classList.add("hbs_hide");
      filter_div.append(arena_select);

      let rob_select = createSelect("hbs_filter_rob", [
        ["All", "All"],
        ["Konata", 0],
        ["Mikuru Asahina", 1],
        ["Ryouko Asakura", 2],
        ["Yuki Nagato", 3],
        ["Real Life", 4],
        ["Invisible Pink Unicorn", 5],
        ["Flying Spaghetti Monster", 6],
        ["Triple Trio And The Tree", 7],
      ]);
      rob_select.classList.add("hbs_hide");
      filter_div.append(rob_select);
    }

    return filter_div;
  }

  function renderFilters() {
    if (current_selection === "Arena") {
      document.getElementById("hbs_filter_arena").classList.remove("hbs_hide");
    } else {
      document.getElementById("hbs_filter_arena").classList.add("hbs_hide");
    }
    if (current_selection === "Ring of Blood") {
      document.getElementById("hbs_filter_rob").classList.remove("hbs_hide");
    } else {
      document.getElementById("hbs_filter_rob").classList.add("hbs_hide");
    }
  }

  function createInput(text_array, id, default_value) {
    let parent = createFilterParent(id);
    for (let i = 0; i < text_array.length; i++) {
      let wrapper = document.createElement("label");
      wrapper.style.lineHeight = "1.9";

      let input = document.createElement("input");
      if (i == 0) {
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.style.width = "60px";
      } else {
        input.type = "text";
        input.placeholder = "YYYY-MM-DD/YYYY-MM-DD";
        input.style.width = "180px";
      }
      input.value = default_value[i];
      input.addEventListener("change", function () {
        startQuery();
      });

      wrapper.append(document.createTextNode(text_array[i]));
      wrapper.append(input);
      wrapper.classList.add(id + (i + 1));

      parent.append(wrapper);
    }

    return parent;
  }

  function createSelect(id, values) {
    let parent = createFilterParent(id);
    let select = document.createElement("select");
    select.addEventListener("change", function () {
      startQuery();
    });
    for (let i = 0; i < values.length; i++) {
      let option = document.createElement("option");
      option.text = values[i][0];
      option.value = values[i][1];
      select.appendChild(option);
    }
    parent.append(select);
    return parent;
  }

  function createCheckBoxes(text_array, id, defaults) {
    let parent = createFilterParent(id);
    for (let i = 0; i < text_array.length; i++) {
      let checked = true;
      if (typeof defaults === "boolean") {
        checked = defaults;
      } else if (typeof defaults === "object") {
        checked = defaults.includes(text_array[i]);
      }
      let checkbox = createCheckBox(text_array[i], false, text_array[i], checked);
      checkbox.classList.add("hbs_filter_checkbox");
      parent.append(checkbox);
    }
    return parent;
  }

  function createCheckBox(text, id = false, value = "", defaultChecked = true, filter = true) {
    let option = document.createElement("label");
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (filter) {
      checkbox.addEventListener("change", function () {
        startQuery();
      });
    }
    checkbox.defaultChecked = defaultChecked;
    if (id) {
      checkbox.id = "hbs_filter_aggregate";
    }
    if (value) {
      checkbox.value = value;
    }
    option.append(checkbox);
    option.append(text);
    return option;
  }

  function createFilterParent(id) {
    let parent = document.createElement("div");
    parent.classList.add("hbs_filter");
    parent.id = id;
    return parent;
  }

  function createDB() {
    let request = self.indexedDB.open("Battle Stats", 1);
    request.onsuccess = function () {
      console.log("Successfully opened DB");
    };
    request.onerror = function () {
      console.log("[onerror]", request.error);
    };
    request.onupgradeneeded = function (event) {
      let db = event.target.result;

      let battles = db.createObjectStore("battles", { keyPath: "timestamp" });

      battles.createIndex("battle_type,date", ["battle_type", "date"]);
      battles.createIndex("date,battle_type", ["date", "battle_type"]);
      battles.createIndex("date", "date");
      battles.createIndex("battle_type,timestamp", ["battle_type", "timestamp"]);
    };
  }

  function addStorageChangeListener(detail) {
    console.log("All Finished, adding stats to IndexedDB");
    let battle_stats = new BattleStats(false, detail);

    battle_stats.saveToDB();
  }

  function exportDB(limit = export_limit) {
    let count = -1;
    let holder = [];
    let date = "";
    let request = self.indexedDB.open("Battle Stats");
    request.onsuccess = function (event) {
      let os_req = event.target.result
        .transaction("battles", "readwrite")
        .objectStore("battles")
        .index("date")
        .openCursor(null, "prev");
      os_req.onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
          let current_date = cursor.key.substring(0, export_type === "all" ? 0 : export_type === "month" ? 7 : 4);
          if (current_date === date) {
            holder.push(cursor.value);
          } else {
            downloadJSON(holder, date);
            holder = [cursor.value];
            date = current_date;
            count += 1;
          }
          if (count < limit) {
            cursor.continue();
          }
        } else {
          downloadJSON(holder, date);
        }
      };
    };
  }

  function downloadJSON(holder, date) {
    if (holder.length > 0) {
      let blob = new Blob([JSON.stringify(holder)], { type: "application/json" });
      let download_link = document.createElement("a");
      download_link.download = "Battle_Stats_Dump" + (date ? "_" + date : "") + ".json";
      download_link.href = window.URL.createObjectURL(blob);
      download_link.click();
    }
  }

  function importDB(data_string) {
    let data = JSON.parse(data_string);
    for (let i = 0; i < data.length; i++) {
      let battle_stat = new BattleStats(data[i]);

      if (!battle_stat.seconds) {
        if (battle_stat.time_taken) {
          let time_array = battle_stat.time_taken.split(":").map((x) => parseInt(x));
          battle_stat.seconds = time_array[0] * 3600 + time_array[1] * 60 + time_array[2];
        }
      }

      battle_stat.saveToDB();
    }
  }

  function deleteDB() {
    let answer = confirm(
      "WARNING! Please make a backup first with Export Data.\nAre you sure you want to delete the database?",
    );
    if (answer) {
      let request = self.indexedDB.deleteDatabase("Battle Stats");
      request.onsuccess = function () {
        console.log("Successfully deleted DB. Recreating DB Stores.");
        createDB();
      };
    }
  }

  function addPageCSS() {
    GM_addStyle("body {background: #E3E0D1; font-size: 10pt;}");
    GM_addStyle("#hbs-main {margin: auto;text-align: center;}");
    GM_addStyle(".hbs-menu ul li {display: inline; padding: 5px;}");
    GM_addStyle(".hbs-menu ul hr {border-top: 3px dotted; height: 2px;}");
    GM_addStyle(".hbs-table {font-size: 10pt}");
    GM_addStyle(".hbs-menu-divider {border-right: 2px solid;}");
  }

  function addMenuCSS() {
    GM_addStyle(
      "#hbs_container {position: absolute; visibility: hidden; top: 5%; left:3%; width: 90%; height: 90%; overflow-y: auto; background-color: #E3E0D1; color: black; text-align: center; padding: 10px 30px 10px 30px; border-radius: 6px; font-size: 8pt;}",
    );
    GM_addStyle(
      ".hbs-buttons-container {position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px;}",
    );
    GM_addStyle(".hbs-buttons-container button {width: 120px;}");
    GM_addStyle(".hbs-table {font-size: 8pt}");

    GM_addStyle(".hbs_menu ul {list-style: none; padding: 0; line-height: 18px;}");
    GM_addStyle(".hbs_menu a {margin: 5px 0; padding: 0 5px;}");
    GM_addStyle(".hbs-menu-divider {display: block; width: 100%; border-bottom: 2px solid;}");
  }

  function addSharedCSS() {
    GM_addStyle(".hbs_hide {display: none;}");
    GM_addStyle(".hbs_visible {visibility: visible!important;z-index: 9}");
  }

  function addTableCSS() {
    GM_addStyle(".hbs-table-title {font-size: 20pt;}");
    GM_addStyle(".hbs-table {margin-left: auto; margin-right: auto; white-space: nowrap;text-align: center}");
    GM_addStyle(".hbs-table td, table.hbs_table th {padding: 0px 5px 0 5px}");
    GM_addStyle(".hbs-table tr.grouping_row th {border-left: 1px solid black; border-right: 1px solid black;}");
    GM_addStyle(".last_agg_row td { border-bottom: 1px solid #000; }");

    GM_addStyle("#hbs_query_span {display: none}");
    GM_addStyle("#hbs_query_span[class='hbs-querying'] {display: unset; font-size: 16pt;}");

    GM_addStyle(".hbs-tooltip-parent {position: relative; border-bottom: 1px dashed black;}");
    GM_addStyle(".hbs-tooltip-parent:hover {background: #d9d6ca}");
    GM_addStyle(".hbs-tooltip-parent:hover .hbs-tooltip {visibility: visible; z-index: 10;}");
    GM_addStyle(
      ".hbs-tooltip {visibility: hidden; position: absolute; background: #d9d6ca; top: -10px; left: 100%; padding: 5px; border: 1px solid black; border-radius: 6px;}",
    );
  }

  createDB();

  addPageUI();

  let current_selection = "";

  function ShowDamage() {
    const damageTypeSortArray = [
      "fire",
      "cold",
      "wind",
      "elec",
      "holy",
      "dark",
      "crushing",
      "slashing",
      "piercing",
      "void",
      "damagePlus",
    ];
    const resultTypeSortArray = [
      "hit",
      "crit",
      "resist50",
      "resist75",
      "resist90",
      "miss",
      "evade",
      "parry",
      "resist",
      "block",
    ];
    let damageTypeTotalArray = [];
    let resultTypeTotalArray = [];
    let combatlogTBodyInnerHTML = "";

    combatlogTBodyInnerHTML += `
            <tr>
                <td></td>
                <td colspan='3'>damage dealt</td>
                <td colspan='5'>damage taken</td>
            </tr>
            <tr>
                <td></td>
                <td>physical</td>
                <td>magical</td>
                <td>total</td>
                <td>physical</td>
                <td>spirit</td>
                <td>magical</td>
                <td>spirit</td>
                <td>total</td>
            </tr>
        `;

    for (let damageTypeSort of damageTypeSortArray) {
      let damageTypeArray = [
        damageTypeSort,
        combatlog.physicalDealt[damageTypeSort] ?? 0,
        combatlog.magicalDealt[damageTypeSort] ?? 0,
        (combatlog.physicalDealt[damageTypeSort] ?? 0) + (combatlog.magicalDealt[damageTypeSort] ?? 0),
        combatlog.physicalTaken[damageTypeSort] ?? 0,
        combatlog.physicalTaken["spiritShield" + damageTypeSort] ?? 0,
        combatlog.magicalTaken[damageTypeSort] ?? 0,
        combatlog.magicalTaken["spiritShield" + damageTypeSort] ?? 0,
        (combatlog.physicalTaken[damageTypeSort] ?? 0) +
          (combatlog.physicalTaken["spiritShield" + damageTypeSort] ?? 0) +
          (combatlog.magicalTaken[damageTypeSort] ?? 0) +
          (combatlog.magicalTaken["spiritShield" + damageTypeSort] ?? 0),
      ];

      damageTypeTotalArray.push(damageTypeArray);

      combatlogTBodyInnerHTML += "<tr>";

      for (let i = 0; i < damageTypeArray.length; i++) {
        combatlogTBodyInnerHTML += `<td>${(damageTypeArray[i] || "").toLocaleString()}</td>`;
      }

      combatlogTBodyInnerHTML += "</tr>";
    }

    combatlogTBodyInnerHTML += '<tr style="border: 1px solid;"><td>total</td>';

    for (let i = 1; i < damageTypeTotalArray[0].length; i++) {
      let damageTypeTotal = 0;

      for (let j = 0; j < damageTypeTotalArray.length; j++) {
        damageTypeTotal += damageTypeTotalArray[j][i];
      }

      combatlogTBodyInnerHTML += `<td>${(damageTypeTotal || "").toLocaleString()}</td>`;
    }
    combatlogTBodyInnerHTML += "</tr>";

    for (let resultTypeSort of resultTypeSortArray) {
      let resultTypeArray = [
        resultTypeSort,
        combatlog.physicalDealt[resultTypeSort] ?? 0,
        combatlog.magicalDealt[resultTypeSort] ?? 0,
        (combatlog.physicalDealt[resultTypeSort] ?? 0) + (combatlog.magicalDealt[resultTypeSort] ?? 0),
        combatlog.physicalTaken[resultTypeSort] ?? 0,
        combatlog.physicalTaken["spiritShield" + resultTypeSort] ?? 0,
        combatlog.magicalTaken[resultTypeSort] ?? 0,
        combatlog.magicalTaken["spiritShield" + resultTypeSort] ?? 0,
        (combatlog.physicalTaken[resultTypeSort] ?? 0) + (combatlog.magicalTaken[resultTypeSort] ?? 0),
      ];

      resultTypeTotalArray.push(resultTypeArray);

      combatlogTBodyInnerHTML += "<tr>";

      for (let i = 0; i < resultTypeArray.length; i++) {
        combatlogTBodyInnerHTML += `<td>${(resultTypeArray[i] || "").toLocaleString()}</td>`;
      }

      combatlogTBodyInnerHTML += "</tr>";
    }

    combatlogTBodyInnerHTML += '<tr style="border: 1px solid;"><td>total</td>';

    for (let i = 1; i < resultTypeTotalArray[0].length; i++) {
      let resultTypeTotal = 0;

      for (let j = 0; j < resultTypeTotalArray.length; j++) {
        resultTypeTotal += resultTypeTotalArray[j][i];
      }

      combatlogTBodyInnerHTML += `<td>${(resultTypeTotal || "").toLocaleString()}</td>`;
    }
    combatlogTBodyInnerHTML += "</tr>";

    const damagelog = log.parentNode.insertBefore(document.createElement("table"), log);
    damagelog.id = "damagelog";
    damagelog.innerHTML = combatlogTBodyInnerHTML;
  }

  const resultTypeSortArray_isekai = ["glance", "hit", "crit", "miss", "evade", "parry", "resist", "block"];
  const resultTypePartiallySortArray_isekai = ["parryPartially", "resistPartially", "blockPartially"];
  const damageTypeSortArray_isekai = [
    "fire",
    "cold",
    "wind",
    "elec",
    "holy",
    "dark",
    "crushing",
    "slashing",
    "piercing",
    "void",
    "damagePlus",
  ];
  const get = (obj, key) => obj?.[key] ?? 0;
  const td = (v) => `<td>${(v || "").toLocaleString()}</td>`;
  const tr = (arr) => `<tr>${arr.map(td).join("")}</tr>`;

  function buildRow(label, dealtP, dealtM, takenP, takenM, takenSpirit = 0) {
    const dealtTotal = dealtP + dealtM;
    const takenTotal = takenP + takenM + takenSpirit;
    return [label, dealtP, dealtM, dealtTotal, takenP, takenM, takenSpirit, takenTotal];
  }

  function sumColumns(rows, start = 1) {
    return rows[0].map((_, i) => (i < start ? "total" : rows.reduce((s, r) => s + (r[i] || 0), 0)));
  }

  function ShowDamageIsk() {
    let html = `
    <tr>
      <td></td>
      <td colspan="3">damage dealt</td>
      <td colspan="4">damage taken</td>
    </tr>
    <tr>
      <td></td>
      <td>physical</td>
      <td>magical</td>
      <td>total</td>
      <td>physical</td>
      <td>magical</td>
      <td>spirit</td>
      <td>total</td>
    </tr>
  `;

    const damageRows = damageTypeSortArray_isekai.map((type) =>
      buildRow(
        type,
        get(combatlog.physicalDealt, type),
        get(combatlog.magicalDealt, type),
        get(combatlog.physicalTaken, type),
        get(combatlog.magicalTaken, type),
        get(combatlog.physicalTaken, "spiritShield" + type),
      ),
    );

    damageRows.forEach((r) => (html += tr(r)));
    html += `<tr style="border:2px solid #5C0E13;">${sumColumns(damageRows).map(td).join("")}</tr>`;

    const resultRows = resultTypeSortArray_isekai.map((type) =>
      buildRow(
        type,
        get(combatlog.physicalDealt, type),
        get(combatlog.magicalDealt, type),
        get(combatlog.physicalTaken, type),
        get(combatlog.magicalTaken, type),
      ),
    );

    resultRows.forEach((r) => (html += tr(r)));

    const resultTotal = sumColumns(resultRows);
    resultTotal[4] -= get(combatlog.physicalTaken, "blockAndParry");
    html += `<tr style="border:2px solid #5C0E13;">${resultTotal.map(td).join("")}</tr>`;

    resultTypePartiallySortArray_isekai.forEach((type) => {
      html += tr(
        buildRow(
          type,
          get(combatlog.physicalDealt, type),
          get(combatlog.magicalDealt, type),
          get(combatlog.physicalTaken, type),
          get(combatlog.magicalTaken, type),
        ),
      );
    });

    html += `
    <tr style="border:2px solid #5C0E13;">
      <td colspan="2" style="text-align:center;">critStack</td>
      <td colspan="2" style="text-align:center;">debuffResist</td>
      <td colspan="4"></td>
    </tr>
  `;

    const debuffs = ["debuffResist0", "debuffResist1", "debuffResist3"];
    let debuffTotal = 0;

    for (let i = 1; i <= 9; i++) {
      const crit = get(combatlog.physicalDealt, `crit${i}`);
      if (!crit) continue;

      let row = [`${i}x-crit`, crit];

      if (i <= 3) {
        const v = get(combatlog.magicalDealt, debuffs[i - 1]);
        debuffTotal += v;
        row.push(debuffs[i - 1], v);
      } else if (i === 4) {
        row.push("total", debuffTotal);
      } else {
        row.push("", "");
      }

      html += `<tr>${row.map(td).join("")}<td colspan="4"></td></tr>`;
    }

    const damagelog = log.parentNode.insertBefore(document.createElement("table"), log);
    damagelog.id = "damagelog";
    damagelog.innerHTML = html;
  }

  function ShowUsage() {
    if (JSON.stringify(combatlog.used) == "{}") return;
    var td = log
      .insertBefore(document.createElement("tbody"), log.firstChild)
      .appendChild(document.createElement("tr"))
      .appendChild(document.createElement("td"));
    td.className = "tlb";
    td.innerHTML =
      "Used: " +
      JSON.stringify(combatlog.used)
        .replace("{", "")
        .replace("}", "")
        .replace(/"/g, "")
        .replace(/:/g, ": ")
        .replace(/,/g, ", ");
  }

  function ShowDrops() {
    let btcp = document.getElementById("btcp");

    const cfg = {
      selectLog: false,
      consoleLog: false,
      terseLog: false,
      detailedCrystlog: false,
      detailedDroplog: true,
      equipmentCutoff: 3,
      trackProficiency: true,
      trackSpeed: true,
    };

    if (cfg.selectLog) {
      const img = document.querySelector('img[src$="finishbattle.png"]');
      if (img && btcp) {
        img.onclick = btcp.onclick;
        btcp.removeAttribute("onclick");
      }
    }

    btcp.style.cssText = "display:block;height:auto;min-height:120px;max-height:621px;overflow:auto";

    if (cfg.consoleLog) {
      console.log(JSON.stringify(combatlog));
      console.log(JSON.stringify(droplog));
    }

    const sep = () => (cfg.terseLog ? "\t" : " ");

    function addLine(className, html) {
      btcp.appendChild(document.createElement("br"));
      const span = btcp.appendChild(document.createElement("span"));
      span.className = className;
      span.innerHTML = html;
    }

    function renderSimple(key, className, label, plural = "s") {
      const v = droplog[key];
      if (!v) return;
      addLine(className, v.toLocaleString() + sep() + label + (v > 1 && !cfg.terseLog ? plural : ""));
    }

    function renderMap(map, className) {
      if (!map) return;
      for (const k in map) {
        addLine(className, map[k].toLocaleString() + (cfg.terseLog ? "\t" : "x ") + k);
      }
    }

    if (droplog.Crystal) {
      renderSimple("Crystal", "drop crystal", "Crystal");
      if (cfg.detailedCrystlog) {
        renderMap(droplog.Crystals, "drop crystal");
      }
    }

    renderSimple("Credit", "drop credit", "Credit");

    const EQUIPMENT_TIERS = [
      "Peerless",
      "Legendary",
      "Magnificent",
      "Exquisite",
      "Superior",
      "Average",
      "Fair",
      "Crude",
    ];
    const TIER_INDEX = Object.fromEntries(EQUIPMENT_TIERS.map((q, i) => [q, i]));
    let lesserCount = 0;

    if (cfg.detailedDroplog) {
      Object.entries(droplog.Equips || {}).forEach(([name, count]) => {
        const match = name.match(regExp.quality);
        if (!match) return;

        const quality = match[1];
        const tierIndex = TIER_INDEX[quality];

        if (tierIndex !== undefined && tierIndex < cfg.equipmentCutoff) {
          addLine("drop equipment", count.toLocaleString() + (cfg.terseLog ? "\t" : "x ") + name);
        } else {
          lesserCount += count;
        }
      });
    } else {
      EQUIPMENT_TIERS.forEach((tier, index) => {
        const count = droplog[tier] || 0;
        if (!count) return;

        if (index < cfg.equipmentCutoff) {
          addLine("drop equipment", count.toLocaleString() + (cfg.terseLog ? "\t" : "x ") + tier + " Equipment");
        } else {
          lesserCount += count;
        }
      });
    }
    if (lesserCount > 0) {
      droplog.Equipment = lesserCount;
      addLine(
        "drop equipment",
        lesserCount.toLocaleString() +
          (cfg.terseLog ? "\t" : "x ") +
          (cfg.equipmentCutoff > 0 ? "Lesser " : "") +
          "Equipment",
      );
    }

    if (cfg.detailedDroplog) {
      renderMap(droplog.Mats, "drop equipment");
    } else {
      renderSimple("Material", "drop equipment", "Material");
    }

    [
      ["Chaos", "Chaos Token"],
      ["Blood", "Token of Blood"],
      ["Soul", "Soul Fragment"],
    ].forEach(([k, label]) => renderSimple(k, "drop token", label));

    if (cfg.detailedDroplog) {
      renderMap(droplog.Artifacts, "drop artifact");
      renderMap(droplog.Figurines, "drop artifact");
      renderMap(droplog.Trophies, "drop trophy");
      renderMap(droplog.Consumables, "drop consumable");
      renderMap(droplog.Foods, "drop food");
    } else {
      renderSimple("Artifact", "drop artifact", "Artifact");
      renderSimple("Figurine", "drop artifact", "Figurine");
      renderSimple("Trophy", "drop trophy", "Trophy", "ies");
      renderSimple("Consumable", "drop consumable", "Consumable");
      renderSimple("Food", "drop food", "Food");
    }

    renderSimple("EXP", "drop", "EXP", "");

    if (cfg.trackProficiency && droplog.proficiency) {
      for (const p in droplog.proficiency) {
        addLine("drop", droplog.proficiency[p].toFixed(3) + sep() + p);
      }
    }

    if (cfg.trackSpeed && timelog.action && timelog.startTime) {
      btcp.appendChild(document.createElement("br"));
      btcp.appendChild(document.createElement("br"));

      const time = (Date.now() - timelog.startTime) / 1000;
      const t = Math.round(time);
      const h = Math.floor(t / 3600);
      const m = Math.floor(t / 60) % 60;
      const s = t % 60;
      const tps = timelog.action / time;

      addLine(
        "speed",
        timelog.action.toLocaleString() +
          " turns  " +
          h +
          ":" +
          (m < 10 ? "0" : "") +
          m +
          ":" +
          (s < 10 ? "0" : "") +
          s +
          "  (" +
          tps.toLocaleString() +
          " t/s)" +
          (timelog.spark ? "  " + timelog.spark + " spark" : "") +
          (timelog.horse ? "  " + timelog.horse + " horse" : ""),
      );
    }
  }

  const cfgBattle = GM_getValue(CONFIG_KEY);
  let hvBH = JSON.parse(GM_getValue(BATTLE_KEY) || "{}");
  hvBH.speedtime = Date.now();
  let dummy = document.createElement("div");
  let doInitDoBattle = false;
  let lastActionTimestamp = Date.now();
  let lastLogTimestamp = Date.now();
  let log;
  let timelog = {};
  let combatlog = {};
  let droplog = {};
  let actionCounts = {};
  let readyNext = 0;
  let regExp = {
    playerInfo: /(\w+) Lv\.(\d+)/,
    battleTypeLog: /Initializing (.*) \.\.\./,
    floor: /Floor (\d+)/,
    round: /Round (\d+) \/ (\d+)/,
    monster: /MID=(\d+) \(([^<>]+)\) \LV=(\d+) HP=(\d+)/g,

    spellMatch: /\('(?<name>[\w\s-]+)(?:\s\(x(?<stack>\d+)\))?',\s?(?<description>.*),\s?(?<turns>.*)\)/,
    spellInfo: /\('([\w\s-]+)'.*, '(\w+)', (\d+), (\d+), (\d+)\)/,
    itemInfo: /set_infopane_item\((\d+)/,

    turnLog: /([^]+?)<tr><td class="tls">/,
    action: />([^<>]+)<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
    action2:
      />([^<>]+)<\/td><\/tr><tr><td class="tlb?">[^<>]+<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,

    zeroturn: /You use\s*(\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Gum))/,
    use: /You (cast|use) ([\w\s-]+)/,

    damage: /[^<>]+damage( \([^<>]+\))*(<\/td><\/tr><tr><td class="tlb">Your spirit shield absorbs \d+ |<|\.)/g,
    damageType: /for (\d+) (\w+) damage/,
    spiritShield: /absorbs (\d+)/,
    crit: /(You crit| crits | blasts )/,
    strike: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits/,
    damagePlus: /for (\d+) damage/,
    damagePhysicalPlus: /(Bleeding Wound|Spreading Poison)/,
    damagePoints: /for (\d+) points of (\w+) damage/,
    counter: />You counter/g,

    magicalDealtMiss: /to connect\./g,
    magicalDealtEvade: /evades your spell\./g,
    magicalDealtResist50: / (?:hits|blasts) [^y][^<>]+50%/g,
    magicalDealtResist75: / (?:hits|blasts) [^y][^<>]+75%/g,
    magicalDealtResist90: / (?:hits|blasts) [^y][^<>]+90%/g,
    magicalDealtResist: /resists your spell\./g,

    physicalDealtMiss: /its mark\./g,
    physicalDealtEvade: /(?: dodges your attack\.|evades your offhand attack\.)/g,
    physicalDealtParry: /parries your attack\./g,

    magicalTakenEvade: / casts [^<>]+evade the attack\./g,
    magicalTakenBlock: / casts [^<>]+block the attack\./g,
    magicalTakenResist50: / (?:hits|blasts) y[^<>]+50%/g,
    magicalTakenResist75: / (?:hits|blasts) y[^<>]+75%/g,
    magicalTakenResist90: / (?:hits|blasts) y[^<>]+90%/g,

    physicalTakenMiss: /misses the attack against you\./g,
    physicalTakenEvade: /(>You evade| uses [^<>]+evade the attack\.)/g,
    physicalTakenParry: /(>You parry| uses [^<>]+parry the attack\.)/g,
    physicalTakenBlock: /(>You block| uses [^<>]+block the attack\.)/g,

    damage_isekai: /[^<>]+damage/g,
    damageTaken1_isekai: /(?<v>glances|hits|crits) you.*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageTaken2_isekai: /which (?<v>glances|hits|crits).*?(?<n>\d+).*?(?<t>\w+) damage/,
    spiritShield_isekai: /absorbs (\d+)/,
    damageDealt1_isekai:
      /(?:You|Your offhand attack|Arcane Blow) (?:(?<s>\d)x-)*(?<v>glance|hit|crit).*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageDealt2_isekai: /(?:(?<s>\d)x-)*(?<v>glanced|hit|crit|eviscerated) for (?<n>\d+) (?<t>\w+) damage/,
    strike_isekai: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits.*?(\d+).*?(\w+) damage/,
    explode_isekai: /explodes for (\d+) (\w+) damage/,
    damagePlus_isekai: /for (\d+) damage/,
    damagePhysicalPlus_isekai: /(Bleeding Wound|Spreading Poison)/,
    damagePoints_isekai: /for (\d+) points of (\w+) damage/,
    debuffLog_isekai:
      /(?:<tr><td class="tlb?">[^<>]+(?: gains the effect | partially resists the effects of your spell\.| shrugs off the effects of your spell\.)+[^<>]*<\/td><\/tr>)+<tr><td class="tl">You cast [a-zA-Z]+\.<\/td><\/tr>/,
    debuffResist0_isekai: / gains the effect /g,
    debuffResist1_isekai: / partially resists the effects of your spell\./g,
    debuffResist3_isekai: / shrugs off the effects of your spell\./g,
    counter_isekai: />You counter/g,

    magicalDealtMiss_isekai: / to connect\./g,
    magicalDealtEvade_isekai: / evades your spell\./g,
    magicalDealtResistPartially_isekai: / resists, and was/g,
    magicalDealtResist_isekai: / resists your spell\./g,

    physicalDealtMiss_isekai: / its mark\./g,
    physicalDealtEvade_isekai: / dodges your attack\./g,
    physicalDealtParryPartially_isekai: / parries[^<>]+?(\d+)[^<>]+?(\w+) damage/g,
    physicalDealtParry_isekai: / parries your attack\./g,

    magicalTakenMiss_isekai: /(?:casts[^<>]+, but misses the attack\.|casts[^<>]+, missing you completely\.)/g,
    magicalTakenEvade_isekai: />You evade the attack\./g,
    magicalTakenResistPartially_isekai: / resist the attack/g,
    magicalTakenBlockPartially_isekai: /casts[^<>]+partially block (?:and|resist| )*the attack/g,
    magicalTakenBlock_isekai: /(?<!partially )block (?:and|resist| )*the attack\./g,

    physicalTakenMiss_isekai:
      /(?:uses[^<>]+, but misses the attack\.|(?:vigorously whiffs at a shadow|uses[^<>]+), missing you completely\.)/g,
    physicalTakenEvade_isekai: />You evade the attack from/g,
    physicalTakenParryPartially_isekai: /partially parry the attack/g,
    physicalTakenParry_isekai: /(?<!partially )parry the attack/g,
    physicalTakenBlockPartially_isekai:
      /(?:(?:uses[^<>]+|>)You|you) partially block (?:and|partially|parry| )*the attack/g,
    physicalTakenBlock_isekai: /(?<!partially )block (?:and|partially|parry| )*the attack/g,

    gainExp: /gain (\d+) EXP/,
    gainCredit: /gain (\d+) Credit/,
    proficiencies: /\d+\.\d+ points of [^<>]+ proficiency/g,
    proficiency: /(\d+\.\d+) points of ([^<>]+) proficiency/,
    dropsLogs: /\S+ <span style="color:.{7}">\[[^<>]+\](<\/span><\/td><\/tr><tr><td class="tlb">A traveling)*/g,
    drop: /(\S+) \<.*#(.{6}).*\[(.*)\](.)*/,
    quality: /(Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/,
    credit: /(\d+) Credit/,
    crystal: /(?:(\d+)x )?(Crystal of \w+)/,
  };

  const bossTypes = {
    Rare: new Set(["Manbearpig", "White Bunneh", "Mithra", "Dalek"]),
    Legendary: new Set(["Konata", "Mikuru Asahina", "Ryouko Asakura", "Yuki Nagato"]),
    Ultimate: new Set([
      "Skuld",
      "Urd",
      "Verdandi",
      "Yggdrasil",
      "Real Life",
      "Invisible Pink Unicorn",
      "Flying Spaghetti Monster",
    ]),
    Arena300: new Set(["Drogon", "Rhaegal", "Viserion"]),
    Arena400: new Set([
      "New Game +",
      "Bottomless Dungeon",
      "Recycled Boss Rush",
      "Time Trial Mode",
      "Achievement Grind",
      "Hardcore Mode",
    ]),
    Arena500: new Set([
      "Angel Bunny",
      "Applejack",
      "Fluttershy",
      "Gummy",
      "Pinkie Pie",
      "Rarity",
      "Spike",
      "Rainbow Dash",
      "Twilight Sparkle",
    ]),
  };

  const itemMap = {
    10005: "Health Gem",
    10006: "Mana Gem",
    10007: "Spirit Gem",
    10008: "Mystic Gem",
    11191: "Health Draught",
    11195: "Health Potion",
    11199: "Health Elixir",
    11291: "Mana Draught",
    11295: "Mana Potion",
    11299: "Mana Elixir",
    11391: "Spirit Draught",
    11395: "Spirit Potion",
    11399: "Spirit Elixir",
    11401: "Energy Drink",
    11402: "Caffeinated Candy",
    11501: "Last Elixir",
    12101: "Infusion of Flames",
    12201: "Infusion of Frost",
    12301: "Infusion of Lightning",
    12401: "Infusion of Storms",
    12501: "Infusion of Divinity",
    12601: "Infusion of Darkness",
    13101: "Scroll of Swiftness",
    13111: "Scroll of Protection",
    13199: "Scroll of the Avatar",
    13201: "Scroll of Absorption",
    13211: "Scroll of Shadows",
    13221: "Scroll of Life",
    13299: "Scroll of the Gods",
    19111: "Flower Vase",
    19131: "Bubble-Gum",
  };
  const TOGGLE = ["Spirit", "Defend", "Focus"];
  const buffMap = {
    "Scroll of Swiftness": "Hastened",
    "Scroll of Protection": "Protection",
    "Scroll of the Avatar": ["Hastened", "Protection"],
    "Scroll of Absorption": "Absorbing Ward",
    "Scroll of Shadows": "Shadow Veil",
    "Scroll of Life": "Spark of Life",
    "Scroll of the Gods": ["Absorbing Ward", "Shadow Veil", "Spark of Life"],
    Channeling: "Channeling",
    "Health Draught": "Regeneration",
    "Mana Draught": "Replenishment",
    "Spirit Draught": "Refreshment",
    Regen: "Regen",
    Heartseeker: "Heartseeker",
    "Arcane Focus": "Arcane Focus",
    "Flower Vase": "Sleeper Imprint",
    "Bubble-Gum": "Kicking Ass",
    Protection: "Protection",
    Haste: "Hastened",
    "Shadow Veil": "Shadow Veil",
    Absorb: "Absorbing Ward",
    "Spark of Life": "Spark of Life",
    "Spirit Shield": "Spirit Shield",
    "Infused Flames": "Infused Flames",
    "Infused Frost": "Infused Frost",
    "Infused Storms": "Infused Storms",
    "Infused Lightning": "Infused Lightning",
    "Infused Divinity": "Infused Divinity",
    "Infused Darkness": "Infused Darkness",
    Focus: "Focusing",
    Energized: "Energized",
    Defending: "Defending",
    "Overwhelming Strikes": "Overwhelming Strikes",
    "Ether Tap": "Ether Tap",
    "Cloak of the Fallen": "Cloak of the Fallen",
    "Blessing of the RiddleMaster": "Blessing of the RiddleMaster",
  };

  const debuffMap = {
    Imperil: "Imperiled",
    Weaken: "Weakened",
    Silence: "Silenced",
    Sleep: "Asleep",
    MagNet: "Magically Snared",
    Drain: ["Vital Theft", "Ether Theft", "Spirit Theft"],
    Slow: "Slowed",
    Confuse: "Confused",
    Blind: "Blinded",
    Immobilize: "Immobilized",
  };
  const spellsDamageObj = {
    fire: ["Fiery Blast", "Inferno", "Flames of Loki"],
    cold: ["Freeze", "Blizzard", "Fimbulvetr"],
    wind: ["Gale", "Downburst", "Storms of Njord"],
    elec: ["Shockblast", "Chained Lightning", "Wrath of Thor"],
    holy: ["Smite", "Banishment", "Paradise Lost"],
    dark: ["Corruption", "Disintegrate", "Ragnarok"],
  };
  const PLAYER_EFFECTS = [
    "Channeling",
    "Regeneration",
    "Replenishment",
    "Refreshment",
    "Regen",
    "Heartseeker",
    "Arcane Focus",
    "Hastened",
    "Protection",
    "Absorbing Ward",
    "Shadow Veil",
    "Spark of Life",
    "Spirit Shield",
    "Infused Flames",
    "Infused Frost",
    "Infused Storms",
    "Infused Lightning",
    "Infused Divinity",
    "Infused Darkness",
    "Energized",
    "Sleeper Imprint",
    "Kicking Ass",
    "Overwhelming Strikes",
    "Ether Tap",
    "Cloak of the Fallen",
    "Blessing of the RiddleMaster",
    "Defending",
    "Focusing",
  ];
  const EFFECTS = [
    "Vital Theft",
    "Ether Theft",
    "Spirit Theft",

    "Weakened",
    "Imperiled",
    "Slowed",
    "Asleep",
    "Confused",
    "Blinded",
    "Silenced",
    "Magically Snared",
    "Immobilized",
    "Stunned",
    "Penetrated Armor",
    "Bleeding Wound",
    "Spreading Poison",
    "Coalesced Mana",

    "Searing Skin",
    "Freezing Limbs",
    "Turbulent Air",
    "Deep Burns",
    "Breached Defense",
    "Blunted Attack",
    "Burning Soul",
    "Ripened Soul",

    "Fury of the Sisters",
    "Lamentations of the Future",
    "Screams of the Past",
    "Wails of the Present",
    "Absorbing Ward",
  ];

  function setStorage(storageName, key, value) {
    let data = localStorage.getItem(storageName);
    data = data ? JSON.parse(data) : {};
    data[key] = value;
    localStorage.setItem(storageName, JSON.stringify(data));
  }

  function getStorage(storageName, key) {
    const data = localStorage.getItem(storageName);
    if (!data) return null;
    const obj = JSON.parse(data);
    return obj[key] ?? null;
  }

  function getStorageAll(storageName) {
    const data = localStorage.getItem(storageName);
    return data ? JSON.parse(data) : null;
  }

  function getBattle(field, defaultValue = null) {
    const data = JSON.parse(GM_getValue(BATTLE_KEY) || "{}");
    return data[field] !== undefined ? data[field] : defaultValue;
  }

  function setBattle(field, value) {
    const data = JSON.parse(GM_getValue(BATTLE_KEY) || "{}");
    data[field] = value;
    GM_setValue(BATTLE_KEY, JSON.stringify(data));
  }

  const BattleStatusUtils = {
    getVitals() {
      if (document.querySelector("#vbh")) {
        const hpImg = document.querySelector("#vbh>div>img");
        const mpImg = document.querySelector("#vbm>div>img");
        const spImg = document.querySelector("#vbs>div>img");

        hvBH.hp = hpImg ? (hpImg.offsetWidth / 500) * 100 : 0;
        hvBH.mp = mpImg ? (mpImg.offsetWidth / 210) * 100 : 0;
        hvBH.sp = spImg ? (spImg.offsetWidth / 210) * 100 : 0;

        const ocElements = document.querySelectorAll("#vcp>div>div");
        const ocExcludeElements = document.querySelectorAll("#vcp>div>div#vcr");
        hvBH.oc = ocElements.length > 0 ? (ocElements.length - ocExcludeElements.length) * 25 : 0;
      } else {
        const hpImg2 = document.querySelector("#dvbh>div>img");
        const mpImg2 = document.querySelector("#dvbm>div>img");
        const spImg2 = document.querySelector("#dvbs>div>img");

        hvBH.hp = hpImg2 ? (hpImg2.offsetWidth / 418) * 100 : 0;
        hvBH.mp = mpImg2 ? (mpImg2.offsetWidth / 418) * 100 : 0;
        hvBH.sp = spImg2 ? (spImg2.offsetWidth / 418) * 100 : 0;

        const ocElement = document.querySelector("#dvrc");
        hvBH.oc = ocElement ? ocElement.textContent : 0;
      }
    },
    getSpiritStatus() {
      let ckey_spirit = document.querySelector("#ckey_spirit");
      let spiritStatus = ckey_spirit.outerHTML.includes("spirit_a.png");
      hvBH.ss = spiritStatus;
    },
    getPlayerEffect() {
      let playerEffectObj = {};
      let scrollEffectObj = {};
      let stackEffectObj = {};
      let effectsPane = document.querySelector("#pane_effects");
      let effects = Array.from(effectsPane.getElementsByTagName("img"));
      let playerEffectsLength = effects.length;

      effects.forEach((effect, index) => {
        let tooltip = effect.getAttribute("onmouseover");
        if (!tooltip) return;

        let matches = tooltip.match(regExp.spellMatch);
        if (!matches?.groups) return;

        let effname = matches.groups.name;
        let effturns = matches.groups.turns;
        let effstack = matches.groups.stack ?? 1;

        let isScroll = matches.groups.description.includes("(Scroll)");
        if (isScroll) {
          if (index < playerEffectsLength && effname) scrollEffectObj[effname] = effturns;
        }

        if (index < playerEffectsLength && effname) stackEffectObj[effname] = effstack;
        if (index < playerEffectsLength && effname) playerEffectObj[effname] = effturns;
      });

      hvBH.playerEffectObj = playerEffectObj;
      hvBH.scrollEffectObj = scrollEffectObj;
      hvBH.stackEffectObj = stackEffectObj;
    },
    getActionCooldowns() {
      function scan({ selector, regexp, getName }) {
        let result = {};

        for (const slot of document.querySelectorAll(selector)) {
          let tooltip = slot.getAttribute("onmouseover");
          let matches = tooltip?.match(regexp);

          let name;
          if (matches) {
            name = getName(matches);
          } else {
            name = slot.textContent?.trim();
          }
          if (!name) continue;

          let cooldown;
          let onClick = slot.getAttribute("onclick");
          if (onClick) {
            cooldown = 0;
            result[name] = 0;
          } else {
            cooldown = 1;
            result[name] = 1;
          }
        }
        return result;
      }

      let spellCooldowns = scan({
        selector: ".bts > div[onmouseover]",
        regexp: regExp.spellInfo,
        getName: (m) => m[1],
      });

      let itemCooldowns = scan({
        selector: ".bti3 > div",
        regexp: regExp.itemInfo,
        getName: (m) => itemMap[+m[1]],
      });

      hvBH.spellCD = spellCooldowns;
      hvBH.itemCD = itemCooldowns;
    },
    getMonsters() {
      let monsters = [];

      [...document.getElementsByClassName("btm1")].forEach((monster_btm1, index) => {
        let monster = {
          index: index,
          click: function () {
            monster_btm1.click();
          },
          name: "Unknown",
          type: "Normal",
          isBoss: false,
          mid: 0,
          maxhp: 0,
          curhp: 0,
          hp: 0,
          mp: 0,
          sp: 0,
          isAlive: monster_btm1.hasAttribute("onclick"),
          effectObj: {},
          effCount: 0,
        };

        let monster_btm3 = monster_btm1.querySelector(".btm3");
        let nameContainer = monster_btm3.querySelector("div");
        monster.name = nameContainer.textContent.trim();
        for (const [type, names] of Object.entries(bossTypes)) {
          if (names.has(monster.name)) {
            monster.type = type;
            monster.isBoss = true;

            break;
          }
        }

        let monster_btm4 = monster_btm1.querySelector(".btm4");
        let healthBar = monster_btm4.querySelector('img[src$="nbargreen.png"]');
        monster.hp = Math.round((parseInt(healthBar?.style.width, 10) / 120) * 100) / 100 || 0;
        let manaBar = monster_btm4.querySelector('img[src$="nbarblue.png"]');
        monster.mp = Math.round((parseInt(manaBar?.style.width, 10) / 120) * 100) / 100 || 0;
        let spiritBar = monster_btm4.querySelector('img[src$="nbarred.png"]');
        monster.sp = Math.round((parseInt(spiritBar?.style.width, 10) / 120) * 100) / 100 || 0;

        monster.maxhp = hvBH.monsterData?.[index]?.maxhp ?? 300000;
        monster.curhp = monster.hp * monster.maxhp;
        monster.mid = hvBH.monsterData?.[index]?.mid ?? 0;

        let monster_btm6 = monster_btm1.querySelector(".btm6");
        monster_btm6.querySelectorAll("img").forEach((effect) => {
          let tooltip = effect.getAttribute("onmouseover");
          if (!tooltip) return;
          let matches = tooltip.match(regExp.spellMatch);
          if (!matches?.groups) return;
          let effname = matches.groups.name;
          let effturns = matches.groups.turns;
          if (effname) monster.effectObj[effname] = effturns;
        });
        monster.effCount = Object.keys(monster.effectObj).length;

        monsters.push(monster);
      });

      hvBH.monsters = monsters;
      hvBH.totalMon = monsters.length;
      hvBH.aliveMon = monsters.filter((monsters) => monsters.isAlive).length;
      hvBH.totalBoss = monsters.filter((monsters) => monsters.isBoss).length;
      hvBH.aliveBoss = monsters.filter((monster) => monster.isAlive && monster.isBoss).length;
    },

    getAttackMode() {
      const matched = cfgBattle.attackModules?.find(([dungeon]) => hvBH.battleType === dungeon);

      hvBH.attackMode = matched?.[1] ?? cfgBattle.defaultAttackMode;
      hvBH.attackBossPriority = matched?.[2] ?? cfgBattle.defaultBossPriority;
    },
  };

  const ConditionsUtils = {
    compareValue(left, op, right) {
      switch (+op) {
        case 1:
          return left > right;
        case 2:
          return left < right;
        case 3:
          return left >= right;
        case 4:
          return left <= right;
        case 5:
          return left == right;
        case 6:
          return left != right;
        default:
          return false;
      }
    },

    /** 核心：统一取值入口 */
    getContextValue(key, curMon) {
      if (key in hvBH) return hvBH[key];

      if (["ar", "rb", "gf", "iw", "re", "tw"].includes(key)) {
        return key;
      }

      if (["hp", "mp", "sp", "oc", "ss"].includes(key)) {
        return Number(hvBH[key] ?? 0);
      }

      if (key.startsWith("isCD_")) {
        return Number(this.checkCD(key.slice(5)).cd);
      }

      if (key.startsWith("buff_")) {
        return this.getBuffTurns(key.slice(5));
      }

      if (key.startsWith("scroll_")) {
        return this.getScrollTurns(key.slice(5));
      }

      if (key.startsWith("allRange_")) {
        return this.getUncoveredCount(key.slice(9));
      }

      if (curMon) {
        if (key == "mon_curhp") return curMon.curhp;
        if (key === "mon_maxhp") return curMon.maxhp;

        if (key == "mon_hp") return curMon.hp * 100;
        if (key == "mon_mp") return curMon.mp * 100;
        if (key == "mon_sp") return curMon.sp * 100;
        if (key == "isBoss") return Number(curMon.isBoss);

        if (key.startsWith("debuff_")) {
          return this.getDebuffTurns(key.slice(7), curMon);
        }
      }

      return undefined;
    },

    /** AND 组 */
    checkAnd(group, curMon) {
      return group.every(([key, op, rawRight]) => {
        const left = this.getContextValue(key, curMon);
        if (left === undefined) return false;

        const right = isNaN(rawRight) ? this.getContextValue(rawRight, curMon) : Number(rawRight);

        if (right === undefined) return false;

        return this.compareValue(left, op, right);
      });
    },

    checkCD(name) {
      if (name in hvBH.itemCD) {
        return {
          type: "item",
          canUse: hvBH.itemCD[name] == 0,
          cd: hvBH.itemCD[name],
        };
      }
      if (name in hvBH.spellCD) {
        return {
          type: "spell",
          canUse: hvBH.spellCD[name] == 0,
          cd: hvBH.spellCD[name],
        };
      }
      return {
        type: "unknown",
        canUse: false,
        cd: 1,
      };
    },

    getScrollTurns(statusName) {
      const effect = PLAYER_EFFECTS.includes(statusName) ? statusName : buffMap[statusName];
      const effects = hvBH.scrollEffectObj;
      if (!effect || !effects) return -1;

      if (Array.isArray(effect)) {
        for (const e of effect) {
          const turnValue = effects[e];
          if (turnValue !== undefined) {
            if (isNaN(turnValue)) return 999;
            return Number(turnValue) || 0;
          }
        }
      }

      const turnValue = effects[effect];
      if (turnValue === undefined) return -1;

      if (isNaN(turnValue)) return 999;
      return Number(turnValue) || 0;
    },

    getBuffTurns(statusName) {
      const effect = PLAYER_EFFECTS.includes(statusName) ? statusName : buffMap[statusName];
      const effects = hvBH.playerEffectObj;
      if (!effect || !effects) return -1;

      const turnValue = effects[effect];
      if (turnValue === undefined) return -1;

      if (isNaN(turnValue)) return 999;
      return Number(turnValue) || 0;
    },

    getDebuffTurns(statusName, monster, isSleep = false) {
      const effect = EFFECTS.includes(statusName) ? statusName : debuffMap[statusName];
      const effects = monster?.effectObj;

      if (!effect || !effects) return -1;
      if (statusName != "Sleep" && isSleep && effects.Asleep !== undefined) return 999;

      if (Array.isArray(effect)) {
        for (const e of effect) {
          const turnValue = effects[e];
          if (turnValue !== undefined) {
            if (isNaN(turnValue)) return 999;
            return Number(turnValue) || 0;
          }
        }
      }

      const turnValue = effects[effect];
      if (turnValue == undefined) return -1;

      if (isNaN(turnValue)) return 999;
      return Number(turnValue) || 0;
    },

    getUncoveredCount(debuffName) {
      let count = 0;

      for (const monster of hvBH.monsters) {
        if (this.getDebuffTurns(debuffName, monster) < 0) {
          count++;
        }
      }

      return count;
    },

    check(conditions) {
      if (!conditions || conditions.length === 0) return true;

      const valid = conditions.filter((g) => Array.isArray(g) && g.length > 0);
      if (valid.length === 0) return true;

      const curMon = selectMonsterUtils.baseTarget(hvBH.monsters);
      return valid.some((g) => this.checkAnd(g, curMon));
    },
  };

  const selectMonsterUtils = {
    getRange(center, range) {
      const half = Math.floor(range / 2);
      const left = range % 2 === 0 ? half : half;
      const right = range % 2 === 0 ? half - 1 : half;
      return {
        start: center - left,
        end: center + right,
      };
    },

    betterIndex(a, b, reverse) {
      if (!b) return true;
      return reverse ? a.index > b.index : a.index < b.index;
    },

    baseTarget(monsters) {
      let list = monsters.filter((m) => m.isAlive);
      if (list.length === 0) return null;
      const yggdrasil = monsters.find((m) => m.isAlive && m.name == "Yggdrasil");
      if (yggdrasil) return yggdrasil;

      if (hvBH.attackBossPriority) {
        const bosses = list.filter((m) => m.isBoss);
        if (bosses.length > 0) list = bosses;
      }

      const sortMap = {
        order: (a, b) => a.index - b.index,
        reverse: (a, b) => b.index - a.index,
        hpMax: (a, b) => b.curhp - a.curhp,
        hpMin: (a, b) => a.curhp - b.curhp,
      };

      return [...list].sort(sortMap[hvBH.attackMode] ?? sortMap.order)[0];
    },

    scanBestCenter(monsters, range, { mustCoverIndex = null, debuffName = null, reverse = false, turnsLeft = 0 } = {}) {
      let best = null;
      let bestScore = -1;

      for (const center of monsters) {
        if (!center.isAlive) continue;
        let { start, end } = this.getRange(center.index, range);
        if (start < 0) {
          end = end - start;
          start = 0;
        }

        if (mustCoverIndex !== null && (mustCoverIndex < start || mustCoverIndex > end)) continue;

        let score = 0;
        for (const m of monsters) {
          if (
            m.isAlive &&
            m.index >= start &&
            m.index <= end &&
            (!debuffName || ConditionsUtils.getDebuffTurns(debuffName, m, true) < turnsLeft)
          ) {
            score++;
          }
        }

        if (score < 1) continue;
        if (score > bestScore || (score === bestScore && this.betterIndex(center, best, reverse))) {
          bestScore = score;
          best = center;
        }
      }
      return best;
    },

    selectMonster(range, debuffName = null, isAllRange = false, reverse = false, turnsLeft = 0) {
      const monsters = hvBH.monsters;
      if (!monsters?.length) return null;

      const alive = monsters.filter((m) => m.isAlive);
      if (!alive.length) return null;

      if (debuffName && isAllRange) {
        return this.scanBestCenter(alive, range, {
          debuffName,
          reverse,
          turnsLeft,
        });
      }

      const base = this.baseTarget(alive);
      if (!base || (debuffName && ConditionsUtils.getDebuffTurns(debuffName, base, true) >= turnsLeft)) {
        return null;
      }

      if (range == 1) return base;

      return this.scanBestCenter(alive, range, {
        mustCoverIndex: base.index,
        debuffName,
        turnsLeft,
      });
    },
  };

  const ActionsUtils = {
    spellAttack(spell, monster) {
      readyNext = 0;
      if (monster.isAlive) {
        this.cast(spell);
        monster.click();
        return true;
      }
      return false;
    },

    Attack(monster) {
      readyNext = 0;
      if (monster.isAlive) {
        monster.click();
        return true;
      }
      return false;
    },

    toggle(name) {
      let state = document.querySelector("#ckey_" + name.toLowerCase());
      if (state) {
        dummy.setAttribute("onclick", state.getAttribute("onmouseover"));
        dummy.click();
        state.click();
      }
    },

    cast(name) {
      let spell = document.querySelector(".bts > div[onclick][onmouseover*=\"'" + name + "'\"]");
      if (document.getElementsByClassName("btii")[0].innerHTML != name && spell) {
        dummy.setAttribute("onclick", spell.getAttribute("onmouseover"));
        dummy.click();
        spell.click();
      }
    },

    use(name) {
      let id = Object.entries(itemMap).find(([id, _name]) => _name === name)?.[0];
      if (!id) {
        return;
      }
      let itemArray = Array.from(document.querySelectorAll(".bti3 > div[onclick][onmouseover]"));
      let item = itemArray.find((div) => div.outerHTML.includes(id));
      if (item) {
        dummy.setAttribute("onclick", item.getAttribute("onmouseover"));
        dummy.click();
        item.click();
      }
    },
    useByType(name, type) {
      if (type === "spell") {
        if (TOGGLE.includes(name)) {
          this.toggle(name);
        } else {
          this.cast(name);
        }
        return;
      }
      if (type === "item") {
        this.use(name);
        return;
      }
      return;
    },
  };

  const Utils = {
    throttle(func, cooldownMillis, trailing = false) {
      let lastRan = 0;
      let timeoutId = null;
      let trailingThis = null;
      let trailingArgs = null;

      return (...args) => {
        if (Date.now() - lastRan > cooldownMillis) {
          lastRan = Date.now();
          func.call(this, ...args);
        } else if (trailing) {
          trailingThis = this;
          trailingArgs = args;
          if (!timeoutId) {
            timeoutId = setTimeout(
              () => {
                lastRan = Date.now();
                timeoutId = null;
                func.call(trailingThis, ...trailingArgs);
              },
              cooldownMillis - (Date.now() - lastRan),
            );
          }
        }
      };
    },

    inc(obj, key, step = 1) {
      if (!obj || key == null) return;
      obj[key] = (obj[key] ?? 0) + step;
    },

    lowerFirst(str) {
      if (!str) return str;
      return str.charAt(0).toLowerCase() + str.slice(1);
    },

    isEmpty(obj) {
      for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) return false;
      }

      return true;
    },

    matchAny(str, ...regexps) {
      for (const regexp of regexps) {
        let matches = str.match(regexp);
        if (matches) {
          return matches;
        }
      }
      return null;
    },

    delay: (ms) => new Promise((r) => setTimeout(r, ms)),

    async fetchUrls(urlArray, interval = 250) {
      const tasks = urlArray.map((url, index) =>
        (async () => {
          await Utils.delay(index * interval);
          console.info("fetchUrls:", url);

          const res = await fetch(url);
          if (!res.ok) {
            throw { url, status: res.status };
          }

          return {
            url,
            responseText: await res.text(),
          };
        })(),
      );

      return Promise.allSettled(tasks);
    },
  };

  function updateLogTitle() {
    const element = document.getElementById("bh-log-title");
    const Speed = (1000 / (Date.now() - hvBH.speedtime)).toFixed(2);
    if (element) {
      element.innerHTML = `
      Speed:${Speed}t/s
      <br>Turns:${timelog.action}t
      <br>Round:${hvBH.curRound}/${hvBH.totalRound}
      <br>Enemies:${hvBH.aliveMon}/${hvBH.totalMon}
      <br>Battle Modes:${hvBH.battleType}`;
    }
    hvBH.speedtime = Date.now();
  }

  function battleRecorder() {
    let turnLog = log.innerHTML.match(regExp.turnLog)?.[0];
    if (!turnLog) return;

    let action = turnLog.match(regExp.action)?.[1];
    if (!action) {
      if (turnLog.includes("<strong>Scanning")) {
        turnLog = turnLog.replace(/[\t\r\n]+/g, "").replace(/>\s+</g, "><");
        action = "You use Scan";
      } else {
        return;
      }
    }

    if (action.includes("gains the effect")) {
      let action2 = turnLog.match(regExp.action2)?.[1];
      action2 && (action = action2);
    }
    let use = action.match(regExp.use)?.[2];

    timeRecorder(action, use);

    if (!isIsekai) {
      combatRecorder(turnLog, action, use);
    } else {
      combatRecorder_isekai(turnLog, action, use);
    }

    revenueRecorder(turnLog, action, use);
    updateLogTitle();
  }

  function storeTmp() {
    if (log) {
      let btcp = document.querySelector("#btcp");
      let finishBattle = document.querySelector('img[src$="finishbattle.png"]');

      if (!btcp) {
        setBattle("monsterData", hvBH.monsterData);
      }
      if (!finishBattle) {
        setStorage(LOG_KEY, "timelog", timelog);
        setStorage(LOG_KEY, "combatlog", combatlog);
        setStorage(LOG_KEY, "droplog", droplog);
      }
    }
  }

  function timeRecorder(action, use) {
    timelog["startTime"] ??= Date.now();
    timelog["action"] += 1;

    if (!regExp.zeroturn.test(action)) timelog["turn"] += 1;
    if (use) timelog["lastUse"][use] = timelog["turn"];
  }

  function riddleRecorder() {
    timelog = getStorage(LOG_KEY, "timelog");
    if (Utils.isEmpty(timelog)) {
      timelog = {
        action: 0,
        turn: 0,
        horse: 0,
        spark: 0,
        lastUse: {},
      };
    }
    timelog["horse"] += 1;
    setStorage(LOG_KEY, "timelog", timelog);
  }

  function combatRecorder(turnLog, action, use) {
    if (use) {
      if (!regExp.zeroturn.test(action) || use.includes("Gem")) {
        Utils.inc(combatlog.used, use);
        Utils.inc(actionCounts, use);
      }
    } else if (action.includes("Spirit Stance Engaged")) {
      Utils.inc(combatlog.used, "Spirit");
      Utils.inc(actionCounts, "Spirit");
    } else if (action.includes("Defending.")) {
      Utils.inc(combatlog.used, "Defend");
      Utils.inc(actionCounts, "Defend");
    } else if (action.includes("Focusing.")) {
      Utils.inc(combatlog.used, "Focus");
      Utils.inc(actionCounts, "Focus");
    } else {
      Utils.inc(combatlog.used, "Attack");
      Utils.inc(actionCounts, "Attack");
    }

    if (turnLog.includes("You gain the effect Cloak of the Fallen.")) {
      Utils.inc(combatlog.used, "Cloak of the Fallen");
      Utils.inc(actionCounts, "Cloak of the Fallen");
      timelog.spark = (timelog.spark ?? 0) + 1;
    }

    let damage = turnLog.match(regExp.damage);
    if (damage) {
      let cast = action.includes("You cast");

      for (let i = 0; i < damage.length; i++) {
        let damageType = damage[i].match(regExp.damageType);
        let damagePlus = damage[i].match(regExp.damagePlus);
        let damagePoints = damage[i].match(regExp.damagePoints);

        if (damageType) {
          if (damage[i].includes("its you for")) {
            let crit = damage[i].includes(" crits ");
            let spiritShield = damage[i].match(regExp.spiritShield);

            if (damage[i].includes(" casts ")) {
              combatlog["magicalTaken"]["hit"] += 1;
              crit && (combatlog["magicalTaken"]["crit"] += 1);
              Utils.inc(combatlog.magicalTaken, damageType[2], +damageType[1]);

              if (spiritShield) {
                Utils.inc(combatlog.magicalTaken, "spiritShield" + "hit");
                if (crit) Utils.inc(combatlog.magicalTaken, "spiritShield" + "crit");
                Utils.inc(combatlog.magicalTaken, "spiritShield" + damageType[2], +spiritShield[1]);
              }
            } else {
              combatlog["physicalTaken"]["hit"] += 1;
              crit && (combatlog["physicalTaken"]["crit"] += 1);
              Utils.inc(combatlog.physicalTaken, damageType[2], +damageType[1]);

              if (spiritShield) {
                Utils.inc(combatlog.physicalTaken, "spiritShield" + "hit");
                if (crit) Utils.inc(combatlog.physicalTaken, "spiritShield" + "crit");
                Utils.inc(combatlog.physicalTaken, "spiritShield" + damageType[2], +spiritShield[1]);
              }
            }
          } else {
            if (cast) {
              if (!damage[i].includes(" explodes ")) {
                combatlog["magicalDealt"]["hit"] += 1;

                if (damage[i].includes(" blasts ")) {
                  combatlog["magicalDealt"]["crit"] += 1;
                }
              }
              Utils.inc(combatlog.magicalDealt, damageType[2], +damageType[1]);
            } else {
              if (!regExp.strike.test(damage[i])) {
                combatlog["physicalDealt"]["hit"] += 1;

                if (regExp.crit.test(damage[i])) {
                  combatlog["physicalDealt"]["crit"] += 1;
                }
              }

              Utils.inc(combatlog.physicalDealt, damageType[2], +damageType[1]);
            }
          }
        } else if (damagePlus) {
          if (regExp.damagePhysicalPlus.test(damage[i])) {
            Utils.inc(combatlog.physicalDealt, "damagePlus", +damagePlus[1]);
          } else {
            Utils.inc(combatlog.magicalDealt, "damagePlus", +damagePlus[1]);
          }
        } else if (damagePoints) {
          if (damage[i].includes("You counter")) {
            combatlog["physicalDealt"]["hit"] += 1;
            Utils.inc(combatlog.physicalDealt, damagePoints[2], +damagePoints[1]);
          } else {
            Utils.inc(combatlog.magicalDealt, damagePoints[2], +damagePoints[1]);
          }
        }
      }
    }

    let combatlogFactory = (regexp, combatlogType, combatlogKey) => {
      let match = turnLog.match(regexp);
      if (match) Utils.inc(combatlog[combatlogType], combatlogKey, match.length);
    };

    combatlogFactory(regExp.magicalDealtMiss, "magicalDealt", "miss");
    combatlogFactory(regExp.magicalDealtEvade, "magicalDealt", "evade");
    combatlogFactory(regExp.magicalDealtResist50, "magicalDealt", "resist50");
    combatlogFactory(regExp.magicalDealtResist75, "magicalDealt", "resist75");
    combatlogFactory(regExp.magicalDealtResist90, "magicalDealt", "resist90");
    combatlogFactory(regExp.magicalDealtResist, "magicalDealt", "resist");

    combatlogFactory(regExp.physicalDealtMiss, "physicalDealt", "miss");
    combatlogFactory(regExp.physicalDealtEvade, "physicalDealt", "evade");
    combatlogFactory(regExp.physicalDealtParry, "physicalDealt", "parry");

    combatlogFactory(regExp.magicalTakenEvade, "magicalTaken", "evade");
    combatlogFactory(regExp.magicalTakenResist50, "magicalTaken", "resist50");
    combatlogFactory(regExp.magicalTakenResist75, "magicalTaken", "resist75");
    combatlogFactory(regExp.magicalTakenResist90, "magicalTaken", "resist90");

    combatlogFactory(regExp.magicalTakenBlock, "magicalTaken", "block");

    combatlogFactory(regExp.physicalTakenMiss, "physicalTaken", "miss");
    combatlogFactory(regExp.physicalTakenEvade, "physicalTaken", "evade");
    combatlogFactory(regExp.physicalTakenParry, "physicalTaken", "parry");
    combatlogFactory(regExp.physicalTakenBlock, "physicalTaken", "block");

    combatlogFactory(regExp.counter, "used", "Counter");
  }

  function combatRecorder_isekai(turnLog, action, use) {
    if (use) {
      if (!regExp.zeroturn.test(action) || use.includes("Gem")) {
        Utils.inc(combatlog.used, use);
        Utils.inc(actionCounts, use);
      }
    } else if (action.includes("Spirit Stance Engaged")) {
      Utils.inc(combatlog.used, "Spirit");
      Utils.inc(actionCounts, "Spirit");
    } else if (action.includes("Defending.")) {
      Utils.inc(combatlog.used, "Defend");
      Utils.inc(actionCounts, "Defend");
    } else if (action.includes("Focusing.")) {
      Utils.inc(combatlog.used, "Focus");
      Utils.inc(actionCounts, "Focus");
    } else {
      Utils.inc(combatlog.used, "Attack");
      Utils.inc(actionCounts, "Attack");
    }

    if (turnLog.includes("You gain the effect Cloak of the Fallen.")) {
      Utils.inc(combatlog.used, "Cloak of the Fallen");
      Utils.inc(actionCounts, "Cloak of the Fallen");
    }

    let damage = turnLog.match(regExp.damage_isekai);
    if (damage) {
      for (let i = 0; i < damage.length; i++) {
        let damageTaken = Utils.matchAny(damage[i], regExp.damageTaken1_isekai, regExp.damageTaken2_isekai);
        let spiritShield = damage[i].match(regExp.spiritShield_isekai);
        let damageDealt = Utils.matchAny(damage[i], regExp.damageDealt1_isekai, regExp.damageDealt2_isekai);
        let strike = damage[i].match(regExp.strike_isekai);
        let explode = damage[i].match(regExp.explode_isekai);
        let damagePlus = damage[i].match(regExp.damagePlus_isekai);
        let damagePoints = damage[i].match(regExp.damagePoints_isekai);

        if (damageTaken?.groups) {
          let glance = damageTaken.groups["v"].includes("glance");
          let crit = damageTaken.groups["v"].includes("crit");
          let hit = !glance && !crit;
          let damageType = Utils.lowerFirst(damageTaken.groups["t"]);

          if (damage[i].includes(" casts ")) {
            glance && (combatlog["magicalTaken"]["glance"] += 1);
            hit && (combatlog["magicalTaken"]["hit"] += 1);
            crit && (combatlog["magicalTaken"]["crit"] += 1);
            Utils.inc(combatlog.magicalTaken, damageType, +damageTaken.groups["n"]);
          } else {
            glance && (combatlog["physicalTaken"]["glance"] += 1);
            hit && (combatlog["physicalTaken"]["hit"] += 1);
            crit && (combatlog["physicalTaken"]["crit"] += 1);
            Utils.inc(combatlog.physicalTaken, damageType, +damageTaken.groups["n"]);
          }
        } else if (spiritShield) {
          Utils.inc(combatlog.physicalTaken, "spiritShield" + "hit");
          Utils.inc(combatlog.physicalTaken, "spiritShield" + "damagePlus", +spiritShield[1]);
        } else if (damageDealt?.groups) {
          let glance = damageDealt.groups["v"].includes("glance");
          let crit = damageDealt.groups["v"].includes("crit");
          let critStack = parseInt(damageDealt.groups["s"]) || 1;
          let hit = !glance && !crit;
          let damageType = Utils.lowerFirst(damageDealt.groups["t"]);

          if (action.includes("You cast")) {
            glance && (combatlog["magicalDealt"]["glance"] += 1);
            hit && (combatlog["magicalDealt"]["hit"] += 1);
            crit && (combatlog["magicalDealt"]["crit"] += 1);
            Utils.inc(combatlog.magicalDealt, damageType, +damageDealt.groups["n"]);
          } else {
            glance && (combatlog["physicalDealt"]["glance"] += 1);
            hit && (combatlog["physicalDealt"]["hit"] += 1);
            if (crit) {
              combatlog["physicalDealt"]["crit"] += 1;
              Utils.inc(combatlog.physicalDealt, `crit${critStack}`);
            }
            Utils.inc(combatlog.physicalDealt, damageType, +damageDealt.groups["n"]);
          }
        } else if (strike) {
          let damageType = Utils.lowerFirst(strike[3]);
          Utils.inc(combatlog.physicalDealt, damageType, +strike[2]);
        } else if (explode) {
          let damageType = Utils.lowerFirst(explode[2]);
          Utils.inc(combatlog.magicalDealt, damageType, +explode[1]);
        } else if (damagePlus) {
          if (regExp.damagePhysicalPlus_isekai.test(damage[i])) {
            Utils.inc(combatlog.physicalDealt, "damagePlus", +damagePlus[1]);
          } else {
            Utils.inc(combatlog.magicalDealt, "damagePlus", +damagePlus[1]);
          }
        } else if (damagePoints) {
          let damageType = Utils.lowerFirst(damagePoints[2]);

          if (damage[i].includes("You counter")) {
            combatlog["physicalDealt"]["hit"] += 1;
            Utils.inc(combatlog.physicalDealt, damageType, +damagePoints[1]);
          } else {
            Utils.inc(combatlog.magicalDealt, damageType, +damagePoints[1]);
          }
        }
      }
    }

    let debuffLog = turnLog.match(regExp.debuffLog_isekai)?.[0];
    if (debuffLog) {
      let debuffResist0 = debuffLog.match(regExp.debuffResist0_isekai)?.length || 0;
      let debuffResist1 = debuffLog.match(regExp.debuffResist1_isekai)?.length || 0;
      let debuffResist3 = debuffLog.match(regExp.debuffResist3_isekai)?.length || 0;
      Utils.inc(combatlog.magicalDealt, "debuffResist0", debuffResist0 - debuffResist1);
      Utils.inc(combatlog.magicalDealt, "debuffResist1", debuffResist1);
      Utils.inc(combatlog.magicalDealt, "debuffResist3", debuffResist3);
    }

    let patchBlock = turnLog.match(/You block the attack\./g);
    if (patchBlock) Utils.inc(combatlog.magicalTaken, "block", -patchBlock.length);
    let patchBlockAndParry = turnLog.match(/You block and parry the attack/g);
    if (patchBlockAndParry) Utils.inc(combatlog.physicalTaken, "blockAndParry", patchBlockAndParry.length);

    let combatlogFactory = (regexp, combatlogType, combatlogKey) => {
      let match = turnLog.match(regexp);
      if (match) Utils.inc(combatlog[combatlogType], combatlogKey, match.length);
    };

    combatlogFactory(regExp.magicalDealtMiss_isekai, "magicalDealt", "miss");
    combatlogFactory(regExp.magicalDealtEvade_isekai, "magicalDealt", "evade");
    combatlogFactory(regExp.magicalDealtResistPartially_isekai, "magicalDealt", "resistPartially");
    combatlogFactory(regExp.magicalDealtResist_isekai, "magicalDealt", "resist");

    combatlogFactory(regExp.physicalDealtMiss_isekai, "physicalDealt", "miss");
    combatlogFactory(regExp.physicalDealtEvade_isekai, "physicalDealt", "evade");
    combatlogFactory(regExp.physicalDealtParryPartially_isekai, "physicalDealt", "parryPartially");
    combatlogFactory(regExp.physicalDealtParry_isekai, "physicalDealt", "parry");

    combatlogFactory(regExp.magicalTakenMiss_isekai, "magicalTaken", "miss");
    combatlogFactory(regExp.magicalTakenEvade_isekai, "magicalTaken", "evade");
    combatlogFactory(regExp.magicalTakenBlockPartially_isekai, "magicalTaken", "blockPartially");
    combatlogFactory(regExp.magicalTakenBlock_isekai, "magicalTaken", "block");
    combatlogFactory(regExp.magicalTakenResistPartially_isekai, "magicalTaken", "resistPartially");

    combatlogFactory(regExp.physicalTakenMiss_isekai, "physicalTaken", "miss");
    combatlogFactory(regExp.physicalTakenEvade_isekai, "physicalTaken", "evade");
    combatlogFactory(regExp.physicalTakenParryPartially_isekai, "physicalTaken", "parryPartially");
    combatlogFactory(regExp.physicalTakenParry_isekai, "physicalTaken", "parry");
    combatlogFactory(regExp.physicalTakenBlockPartially_isekai, "physicalTaken", "blockPartially");
    combatlogFactory(regExp.physicalTakenBlock_isekai, "physicalTaken", "block");

    combatlogFactory(regExp.counter_isekai, "used", "Counter");
  }

  function revenueRecorder(turnLog, action, use) {
    if (
      use &&
      regExp.zeroturn.test(action) &&
      !use.includes("Gem") &&
      !use.includes("Caffeinated Candy") &&
      !use.includes("Energy Drink")
    ) {
      combatlog.used[use] ??= 0;
      combatlog.used[use] += 1;
      Utils.inc(actionCounts, use);
    }

    let gainExp = turnLog.match(regExp.gainExp);
    if (gainExp) {
      droplog["EXP"] += +gainExp[1];
    }

    let gainCredit = turnLog.match(regExp.gainCredit);
    if (gainCredit) {
      droplog["Credit"] += +gainCredit[1];
    }

    let proficiencies = turnLog.match(regExp.proficiencies);
    if (proficiencies) {
      for (let i = 0; i < proficiencies.length; i++) {
        let proficiency = proficiencies[i].match(regExp.proficiency);
        if (proficiency) {
          let prof = parseFloat(proficiency[1]);
          if (prof > 0) {
            Utils.inc(droplog.proficiency, proficiency[2], prof);
          }
        }
      }
    }

    let dropLogs = turnLog.match(regExp.dropsLogs) || [];
    for (let dropLog of dropLogs) {
      let drop = dropLog.match(regExp.drop) || [];
      switch (drop[2]) {
        case "FF0000": {
          if (!drop[4]) {
            let quality = drop[3].match(regExp.quality)?.[1];
            if (quality) {
              droplog[quality] = (droplog[quality] ?? 0) + 1;
              droplog.Equips[drop[3]] = (droplog.Equips[drop[3]] ?? 0) + 1;
            } else {
              droplog.Material = (droplog.Material ?? 0) + (parseInt(drop[1]) || 1);
              Utils.inc(droplog.Mats, drop[3], parseInt(drop[1]) || 1);
            }
          }
          break;
        }

        case "A89000": {
          let credit = drop[3].match(regExp.credit);
          if (credit) {
            droplog["Credit"] += parseInt(credit[1]) || 1;
          }
          break;
        }

        case "00B000": {
          if (!drop[3].includes("Gem")) {
            droplog.Consumable = (droplog.Consumable ?? 0) + 1;
            droplog["Consumables"][drop[3]] ??= 0;
            droplog["Consumables"][drop[3]] += 1;
          }
          break;
        }

        case "254117": {
          if (drop[3].includes("Blood")) {
            Utils.inc(droplog, "Blood");
          } else if (drop[3].includes("Chaos")) {
            Utils.inc(droplog, "Chaos");
          } else if (drop[3].includes("Soul")) {
            Utils.inc(droplog, "Soul", drop[1] === "five" ? 5 : +drop[1].match(/\d+/)?.[0] || 1);
          }
          break;
        }

        case "489EFF": {
          droplog.Food = (droplog.Food ?? 0) + 1;
          Utils.inc(droplog.Foods, drop[3]);
          break;
        }

        case "0000FF": {
          if (drop[3].includes("Figurine")) {
            droplog.Figurine = (droplog.Figurine ?? 0) + 1;
            Utils.inc(droplog.Figurines, drop[3]);
          } else {
            droplog.Artifact = (droplog.Artifact ?? 0) + 1;
            Utils.inc(droplog.Artifacts, drop[3]);
          }
          break;
        }

        case "461B7E": {
          if (drop[3].includes("World Seed")) {
            droplog.Consumable = (droplog.Consumable ?? 0) + 1;
            droplog["Consumables"][drop[3]] ??= 0;
            droplog["Consumables"][drop[3]] += +drop[1].match(/\d+/)?.[0] || 1;
          } else {
            droplog.Trophy = (droplog.Trophy ?? 0) + 1;
            Utils.inc(droplog.Trophies, drop[3]);
          }
          break;
        }

        case "BA05B4": {
          let crystal = drop[3].match(regExp.crystal);
          if (crystal) {
            droplog.Crystal = (droplog.Crystal ?? 0) + (parseInt(crystal[1]) || 1);
            Utils.inc(droplog.Crystals, crystal[2], parseInt(crystal[1]) || 1);
          }
          break;
        }
      }
    }
  }

  function init() {
    window.addEventListener("beforeunload", storeTmp);

    log = document.querySelector("#textlog");

    if (log && !doInitDoBattle) {
      renderBoxUI(2);
      doInitDoBattle = true;
      preBattle();
      return;
    }

    if (document.querySelector("#riddlemaster")) {
      riddleRecorder();
      return;
    }

    if (!log) {
      let difficulty = getStorage(CONFIG_KEY, "difficulty") || "undefined";
      let level = getStorage(CONFIG_KEY, "level") || 0;
      let persona = getStorage(CONFIG_KEY, "persona") || "undefined";
      let equip_set = getStorage(CONFIG_KEY, "equip_set") || [];
      const currentUrl = window.location.href;

      if (/Battle/i.test(currentUrl)) {
        let levelReadout = document.querySelector("#level_readout > div > div")?.innerText;
        let playerInfo = levelReadout.match(regExp.playerInfo);
        if (difficulty != playerInfo[1]) setStorage(CONFIG_KEY, "difficulty", playerInfo[1]);
        if (level != playerInfo[2]) setStorage(CONFIG_KEY, "level", playerInfo[2]);
      } else if (/Character&ss=eq/i.test(currentUrl)) {
        equip_set = extractEquipIdsAndKValues();
        setStorage(CONFIG_KEY, "equip_set", equip_set);
      }
      let personaSelected = document.querySelector("#persona_form > select > option[selected]")?.innerText;
      if (personaSelected && persona != personaSelected) {
        setStorage(CONFIG_KEY, "persona", personaSelected);
      }

      renderBoxUI(1);

      GM_deleteValue(BATTLE_KEY);
    }
    return;
  }

  function extractEquipIdsAndKValues() {
    let _window = typeof unsafeWindow === "undefined" ? window : unsafeWindow;
    let dynjs_equip = _window.dynjs_equip || {};
    const results = [];
    const eqbElements = document.querySelectorAll("#eqsb .eqb");

    eqbElements.forEach((eqb) => {
      const equipDiv = eqb.querySelector("div:nth-child(2)");

      if (equipDiv && equipDiv.hasAttribute("onmouseover")) {
        const onmouseoverAttr = equipDiv.getAttribute("onmouseover");
        const idMatch = onmouseoverAttr.match(/equips\.set\((\d+),/);

        if (idMatch && idMatch[1]) {
          const id = idMatch[1];
          let kValue = "undefined";

          if (typeof dynjs_equip !== "undefined" && dynjs_equip[id]) {
            kValue = dynjs_equip[id].k || "undefined";
          }

          if (kValue) {
            results.push(`${id},${kValue}`);
          }
        } else {
          results.push("undefined,undefined");
        }
      } else {
        results.push("undefined,undefined");
      }
    });

    return results;
  }

  function preBattle() {
    timelog = getStorage(LOG_KEY, "timelog");
    if (Utils.isEmpty(timelog)) {
      timelog = {
        action: 0,
        turn: 0,
        horse: 0,
        spark: 0,
        lastUse: {},
      };
    }

    combatlog = getStorage(LOG_KEY, "combatlog");
    if (Utils.isEmpty(combatlog)) {
      combatlog = {
        physicalDealt: { glance: 0, hit: 0, crit: 0, miss: 0, evade: 0, parryPartially: 0, parry: 0 },
        magicalDealt: {
          glance: 0,
          hit: 0,
          crit: 0,
          miss: 0,
          evade: 0,
          resist50: 0,
          resist75: 0,
          resist90: 0,
          resistPartially: 0,
          resist: 0,
        },
        physicalTaken: {
          glance: 0,
          hit: 0,
          crit: 0,
          spiritShield: 0,
          miss: 0,
          evade: 0,
          parryPartially: 0,
          parry: 0,
          blockPartially: 0,
          block: 0,
        },
        magicalTaken: {
          glance: 0,
          hit: 0,
          crit: 0,
          miss: 0,
          evade: 0,
          resist50: 0,
          resist75: 0,
          resist90: 0,
          resistPartially: 0,
          resist: 0,
          blockPartially: 0,
          block: 0,
        },
        used: {},
      };
    }

    droplog = getStorage(LOG_KEY, "droplog");
    if (Utils.isEmpty(droplog)) {
      droplog = {
        Crystals: {},
        Equips: {},
        Mats: {},
        Artifacts: {},
        Figurines: {},
        Trophies: {},
        Consumables: {},
        Foods: {},
        proficiency: {},
        Credit: 0,
        EXP: 0,
      };
    }

    log = document.querySelector("#textlog");

    let battleTypeLog = log.innerHTML.match(regExp.battleTypeLog);
    if (battleTypeLog) {
      if (battleTypeLog[1].includes("arena challenge") && !battleTypeLog[1].includes("Round 1 / 1)")) {
        hvBH.battleType = "ar";
      } else if (battleTypeLog[1].includes("random encounter")) {
        hvBH.battleType = "re";
      } else if (battleTypeLog[1].includes("arena challenge") && battleTypeLog[1].includes("Round 1 / 1)")) {
        hvBH.battleType = "rb";
      } else if (battleTypeLog[1].includes("Grindfest")) {
        hvBH.battleType = "gf";
      } else if (battleTypeLog[1].includes("Item World")) {
        hvBH.battleType = "iw";
      } else if (battleTypeLog[1].includes("The Tower")) {
        hvBH.battleType = "tw";
      }
    }
    if (hvBH.battleType) {
      setBattle("battleType", hvBH.battleType);
    } else {
      hvBH.battleType = getBattle("battleType", "");
    }

    let round = log.innerHTML.match(regExp.round);
    if (hvBH.battleType !== "re") {
      if (round) {
        hvBH.curRound = +round[1];
        hvBH.totalRound = +round[2];
        setBattle("curRound", hvBH.curRound);
        setBattle("totalRound", hvBH.totalRound);
      } else {
        hvBH.curRound = getBattle("curRound", 1);
        hvBH.totalRound = getBattle("totalRound", 1);
      }
    }

    let matches;
    hvBH.monsterData = [];
    while ((matches = regExp.monster.exec(log.innerHTML)) !== null) {
      hvBH.monsterData.unshift({
        mid: +matches[1],
        name: matches[2],
        level: +matches[3],
        maxhp: +matches[4],
      });
    }

    if (hvBH.monsterData.length) {
      setBattle("monsterData", hvBH.monsterData);
    } else {
      hvBH.monsterData = getBattle("monsterData", []);
    }

    let throttledPreProcessLog = Utils.throttle(preProcessLog, 200, true);
    let obs = new MutationObserver(throttledPreProcessLog);
    obs.observe(log.firstChild, {
      childList: true,
    });

    getBattleStatus();
  }

  function preProcessLog() {
    lastActionTimestamp = lastLogTimestamp;
    lastLogTimestamp = Date.now();

    let td = Array.from(log.getElementsByTagName("td"));
    for (let i = 0; i < td.length; i++) {
      if (td[i].className == "tls") {
        td[i].innerHTML = "<hr>";
      }
    }

    battleRecorder();

    let btcp = document.querySelector("#btcp");
    let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
    if (btcp) {
      setBattle("monsterData", []);
      if (finishBattle) {
        if (!isIsekai) {
          ShowDamage();
        } else {
          ShowDamageIsk();
        }
        ShowUsage();
        ShowDrops();
        timelog.round = hvBH.curRound;
        timelog.rounds = hvBH.totalRound;
        timelog["Fighting Style"] = cfgBattle.fightingStyle;
        let detail = {
          timelog: timelog,
          combatlog: combatlog,
          droplog: droplog,
        };

        addStorageChangeListener(detail);
        GM_deleteValue(BATTLE_KEY);
        localStorage.removeItem(LOG_KEY);
      }
    }

    getBattleStatus();
  }

  function getBattleStatus() {
    BattleStatusUtils.getVitals();
    BattleStatusUtils.getSpiritStatus();
    BattleStatusUtils.getPlayerEffect();
    BattleStatusUtils.getActionCooldowns();
    BattleStatusUtils.getMonsters();
    BattleStatusUtils.getAttackMode();

    startBattle();
  }

  function startBattle() {
    if (!PauseBattle) {
      let btcp = document.querySelector("#btcp");
      let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
      if (hvBH.aliveMon <= 0) {
        if (cfgBattle.autoNextRound && btcp && !finishBattle) {
          setBattle(PAUSE_KEY, true);
          btcp.click();
          btcp.style.visibility = "hidden";
        }
        return;
      }

      switch (readyNext) {
        case -1:
          break;
        default:
          readyNext = -1;
          setTimeout(() => {
            smartBattle();
          }, 0);
          break;
      }
    }
  }

  const actionHandlers = {
    processModules(config, executor) {
      if (!config?.status || !config.modules) return false;
      for (const module of Object.values(config.modules)) {
        if (!module?.moduleStatus) continue;

        if (executor(module.moduleType, module) === true) {
          readyNext = 0;
          return true;
        }
      }
      return false;
    },

    handleModules(config) {
      return this.processModules(config, (moduleName, module) => {
        const cdInfo = ConditionsUtils.checkCD(moduleName);
        if (!cdInfo.canUse) return false;
        if (!ConditionsUtils.check(module.conditions)) return false;

        ActionsUtils.useByType(moduleName, cdInfo.type);
        return true;
      });
    },

    handleChannel(config) {
      if (!hvBH.playerEffectObj.Channeling) return false;
      return this.handleModules(config);
    },

    handleBuffs(config) {
      return this.processModules(config, (moduleName, module) => {
        if (ConditionsUtils.getBuffTurns(moduleName) >= 0) return false;

        const cdInfo = ConditionsUtils.checkCD(moduleName);
        if (!cdInfo.canUse) return false;
        if (!ConditionsUtils.check(module.conditions)) return false;

        ActionsUtils.useByType(moduleName, cdInfo.type);
        return true;
      });
    },

    handleScroll(config) {
      return this.processModules(config, (moduleName, module) => {
        if (ConditionsUtils.getScrollTurns(moduleName) >= 0) return false;

        const cdInfo = ConditionsUtils.checkCD(moduleName);
        if (!cdInfo.canUse) return false;
        if (!ConditionsUtils.check(module.conditions)) return false;

        ActionsUtils.useByType(moduleName, cdInfo.type);
        return true;
      });
    },

    handleDebuff(config) {
      return this.processModules(config, (moduleName, module) => {
        const cdInfo = ConditionsUtils.checkCD(moduleName);
        if (!cdInfo.canUse) return false;
        if (!ConditionsUtils.check(module.conditions)) return false;

        if (moduleName === "Sleep" && ConditionsUtils.getUncoveredCount(moduleName) < 2) {
          return false;
        }

        const range = module.targetCount ?? 1;
        const isAllRange = module.selectRange ?? false;
        const reverse = module.selectOrder ?? false;
        const turnsLeft = module.turnsLeft ?? 0;

        const target = selectMonsterUtils.selectMonster(range, moduleName, isAllRange, reverse, turnsLeft);

        if (!target) return false;
        return ActionsUtils.spellAttack(moduleName, target);
      });
    },

    handleSpiritstance(config) {
      return this.processModules(config, (moduleName, module) => {
        const shouldOn = moduleName == "spiriton";
        if (shouldOn == hvBH.ss) return false;

        if (!ConditionsUtils.check(module.conditions)) return false;

        ActionsUtils.toggle("Spirit");
        return true;
      });
    },

    handleSkills(config) {
      return this.processModules(config, (moduleName, module) => {
        const cdInfo = ConditionsUtils.checkCD(moduleName);
        if (!cdInfo.canUse) return false;
        if (!ConditionsUtils.check(module.conditions)) return false;

        const range = module.targetCount ?? 1;
        const target = selectMonsterUtils.selectMonster(range);
        if (!target) return false;

        return ActionsUtils.spellAttack(moduleName, target);
      });
    },

    handleAttack() {
      const fightingStyle = cfgBattle.fightingStyle;
      const spells = spellsDamageObj[fightingStyle];

      if (spells) {
        const staffCfg = cfgBattle.staff;
        if (staffCfg?.status && ConditionsUtils.getBuffTurns("Ether Tap") < 2) {
          for (const [moduleName, module] of Object.entries(staffCfg.modules)) {
            if (!moduleName.startsWith("Ether Tap")) continue;
            if (!module?.moduleStatus) continue;
            if (!ConditionsUtils.check(module.conditions)) continue;
            const monster = selectMonsterUtils.baseTarget(hvBH.monsters);
            if (monster?.effectObj?.["Coalesced Mana"]) {
              return ActionsUtils.Attack(monster);
            }
          }
        }

        const spellsRange = [10, 7, 5];
        const reversed = spells.slice().reverse();

        for (let index = 0; index < reversed.length; index++) {
          const spell = reversed[index];
          const cdInfo = ConditionsUtils.checkCD(spell);
          if (!cdInfo.canUse) continue;

          const module = staffCfg?.modules?.[3 - index];
          const pass = !module || (module.status && ConditionsUtils.check(module.conditions || []));

          if (!pass) continue;

          const range = module?.targetCount ?? spellsRange[index];
          const monster = selectMonsterUtils.selectMonster(range);
          if (!monster) continue;

          return ActionsUtils.spellAttack(spell, monster);
        }
      }

      const monster = selectMonsterUtils.baseTarget(hvBH.monsters);
      return ActionsUtils.Attack(monster);
    },
  };

  function smartBattle() {
    const actions = [
      () => actionHandlers.handleModules(cfgBattle.gem),
      () => actionHandlers.handleScroll(cfgBattle.scroll),
      () => actionHandlers.handleChannel(cfgBattle.channel),
      () => actionHandlers.handleModules(cfgBattle.recovery),
      () => actionHandlers.handleBuffs(cfgBattle.buffs),
      () => actionHandlers.handleDebuff(cfgBattle.debuffs),
      () => actionHandlers.handleSpiritstance(cfgBattle.spiritstance),
      () => actionHandlers.handleSkills(cfgBattle.skills),
      () => actionHandlers.handleAttack(),
    ];

    for (const action of actions) {
      if (action() === true) break;
    }
  }

  init();
})();
