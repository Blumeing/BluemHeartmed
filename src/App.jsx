import { useMemo, useState } from "react";

const attachmentOne = "/assets/attachment-sdv.png";
const attachmentTwo = "/assets/attachment-admission.png";

const categoryTags = [
  "知情同意书",
  "合并用药",
  "入院记录",
  "手术记录",
  "出院记录",
  "身高体重",
  "血压",
  "血糖",
  "心率",
  "病史采集",
];

const panels = [
  {
    name: "入院记录",
    count: 4,
    fields: [
      { label: "入院日期", ocr: "2026-08-11", editor: "date" },
      { label: "入院原因", ocr: "计划入院", editor: "admissionReason" },
      { label: "主诉", ocr: "发货后股份回购", editor: "chiefComplaint" },
      { label: "计划二次入院", ocr: "否", editor: "secondAdmission" },
    ],
  },
  {
    name: "血压",
    count: 3,
    fields: [
      { label: "记录时间", ocr: "2024-11-07 08:25:07", editor: "datetime", value: "2024-11-07 08:25:07" },
      { label: "收缩压(mmHg)", ocr: "129", editor: "input", value: "129" },
      { label: "舒张压(mmHg)", ocr: "65", editor: "input", value: "65" },
    ],
  },
  {
    name: "血糖",
    count: 3,
    fields: [
      { label: "记录时间", ocr: "--", editor: "datetime" },
      { label: "类型", ocr: "--", editor: "bloodSugarType" },
      { label: "血糖(mmol/L)", ocr: "--", editor: "input", placeholder: "请输入" },
    ],
  },
  {
    name: "身高体重",
    count: 5,
    fields: [
      { label: "记录时间", ocr: "--", editor: "datetime" },
      { label: "身高(cm)", ocr: "--", editor: "height" },
      { label: "体重(kg)", ocr: "--", editor: "weight" },
      { label: "BMI", ocr: "--", editor: "bmi" },
      { label: "腰围(cm)", ocr: "--", editor: "input", placeholder: "请输入" },
    ],
  },
  {
    name: "心率",
    count: 2,
    fields: [
      { label: "记录时间", ocr: "--", editor: "datetime" },
      { label: "心率(次/分钟)", ocr: "--", editor: "input", placeholder: "请输入" },
    ],
  },
  {
    name: "病史采集",
    count: 4,
    fields: [
      { label: "诊断", ocr: "腰痛待查", editor: "diagnosis" },
      { label: "既往史", ocr: "否认高血压、糖尿病病史", editor: "pastHistory" },
      { label: "家族史", ocr: "无特殊", editor: "familyHistory" },
      { label: "个人史", ocr: "无吸烟史，偶饮酒", editor: "personalHistory" },
    ],
  },
];

function DateInput({ value, placeholder = "请选择" }) {
  return (
    <label className="date-editor">
      <span>◷</span>
      <input defaultValue={value} placeholder={placeholder} />
    </label>
  );
}

function NarrativeEditor({ value, tags }) {
  return (
    <div className="complaint-editor">
      <textarea defaultValue={value} />
      <button>结构化</button>
      <div className="complaint-tags">
        {tags.map((item) => (
          <span key={item}>
            {item}
            <button>×</button>
          </span>
        ))}
      </div>
      <select defaultValue="">
        <option value="" disabled>
          请选择
        </option>
        <option>眼睑眼痛</option>
        <option>血便</option>
        <option>视力衰退</option>
      </select>
    </div>
  );
}

function EdcEditor({ field, height, weight, setHeight, setWeight, bmi }) {
  if (field.editor === "date") return <DateInput placeholder="选择日期" />;
  if (field.editor === "datetime") return <DateInput value={field.value} placeholder="请选择" />;

  if (field.editor === "admissionReason") {
    return (
      <div className="radio-editor">
        {["首次入院", "计划入院", "其他非不良事件", "不良事件"].map((item) => (
          <label key={item}>
            <input type="radio" name="admissionReason" defaultChecked={item === "计划入院"} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.editor === "secondAdmission") {
    return (
      <div className="radio-editor compact">
        {["是", "否"].map((item) => (
          <label key={item}>
            <input type="radio" name="secondAdmission" defaultChecked={item === "否"} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.editor === "bloodSugarType") {
    return (
      <select className="edc-select" defaultValue="">
        <option value="" disabled>
          请选择
        </option>
        <option>空腹</option>
        <option>餐后2小时血糖</option>
        <option>随机血糖</option>
      </select>
    );
  }

  if (field.editor === "height") {
    return (
      <input
        className="edc-input"
        value={height}
        onChange={(event) => setHeight(event.target.value)}
        placeholder="请输入"
      />
    );
  }

  if (field.editor === "weight") {
    return (
      <input
        className="edc-input"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        placeholder="请输入"
      />
    );
  }

  if (field.editor === "bmi") return <input className="edc-input readonly" value={bmi} readOnly />;

  const narrativeMap = {
    chiefComplaint: { value: "腰痛，流泪", tags: ["畏光流泪", "腰痛"] },
    diagnosis: { value: "腰痛待查", tags: ["腰痛"] },
    pastHistory: { value: "否认高血压、糖尿病病史", tags: ["无高血压史", "无糖尿病史"] },
    familyHistory: { value: "无特殊", tags: ["无特殊"] },
    personalHistory: { value: "无吸烟史，偶饮酒", tags: ["无吸烟史", "偶饮酒"] },
  };

  if (narrativeMap[field.editor]) return <NarrativeEditor {...narrativeMap[field.editor]} />;

  return <input className="edc-input" defaultValue={field.value} placeholder={field.placeholder} />;
}

function PanelBody({ fields, height, weight, setHeight, setWeight, bmi }) {
  return (
    <div className="panel-body">
      <div className="field-header">
        <span>字段</span>
        <span>OCR识别值</span>
        <span>EDC待录入值</span>
      </div>
      {fields.map((field) => (
        <div className={`field-row ${field.editor?.includes("History") || field.editor === "chiefComplaint" || field.editor === "diagnosis" ? "rich-row" : ""}`} key={field.label}>
          <label className="metric-label">
            <input type="checkbox" defaultChecked />
            <span>{field.label}</span>
          </label>
          <div className="ocr-value">{field.ocr}</div>
          <div className="edc-target">
            <EdcEditor
              field={field}
              height={height}
              weight={weight}
              setHeight={setHeight}
              setWeight={setWeight}
              bmi={bmi}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [openPanels, setOpenPanels] = useState({
    入院记录: true,
    血压: true,
    血糖: true,
    身高体重: true,
    心率: true,
    病史采集: true,
  });

  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!h || !w) return "0";
    return (w / (h * h)).toFixed(1);
  }, [height, weight]);

  const togglePanel = (name) => {
    setOpenPanels((current) => ({ ...current, [name]: !current[name] }));
  };

  return (
    <main className="ocr-shell">
      <header className="topbar">
        <div>
          <strong>附件分类确认与OCR指标录入</strong>
          <span>崔惠霞 · 基线记录 2024-11-06</span>
        </div>
        <button className="close-btn" aria-label="关闭">×</button>
      </header>

      <section className="workspace">
        <aside className="preview-pane">
          <h2>全部附件(2)</h2>
          <div className="thumb-row">
            <button className="thumb active">
              <span>SDV</span>
              <img src={attachmentOne} alt="合并用药附件缩略图" />
              <em>合并用药</em>
            </button>
            <button className="thumb selected">
              <span>待录入</span>
              <img src={attachmentTwo} alt="入院记录附件缩略图" />
              <em>电解质、肝...</em>
            </button>
          </div>

          <div className="document-stage">
            <div className="document-crop" aria-label="入院记录附件预览">
              <img src={attachmentTwo} alt="" />
            </div>
            <div className="zoom-tools">
              <span>⌕</span>
              <span>100%</span>
              <span>⌕</span>
              <span>↻</span>
            </div>
          </div>
        </aside>

        <section className="entry-pane">
          <div className="status-row">
            <strong>待录入</strong>
            <i />
            <span>AI结构化完成度:</span>
            <div className="progress"><b /></div>
            <span>0%</span>
          </div>
          <p className="hint">AI结构化完成，待人工确认录入</p>

          <div className="form-line">
            <span className="label">CRF一级分类</span>
            <div className="select-chip">
              <span>检查</span>
              <button>×</button>
              <small>⌄</small>
            </div>
          </div>

          <div className="section-title">二级分类标签</div>
          <div className="tag-list">
            {categoryTags.map((tag) => (
              <button
                className={
                  ["入院记录", "身高体重", "血压", "血糖", "心率", "病史采集"].includes(tag)
                    ? "tag active"
                    : "tag"
                }
                key={tag}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="section-title current-title">当前图片组</div>
          <button className="image-group">
            <strong>入院记录P1/血压P1/血糖P1/身高体重P1/心率P1/病史采集P1</strong>
            <span>入院记录、血压、血糖、身高体重、心率、病史采集</span>
          </button>

          <div className="accordion">
            {panels.map((panel) => {
              const isOpen = Boolean(openPanels[panel.name]);
              return (
                <article className={`panel ${isOpen ? "open" : ""}`} key={panel.name}>
                  <button className="panel-head" onClick={() => togglePanel(panel.name)}>
                    <span className="plus">{isOpen ? "−" : "+"}</span>
                    <strong>{panel.name}</strong>
                    <em>{panel.count}个指标</em>
                    <span>0/{panel.count} 已确认</span>
                  </button>
                  {isOpen && (
                    <PanelBody
                      fields={panel.fields}
                      height={height}
                      weight={weight}
                      setHeight={setHeight}
                      setWeight={setWeight}
                      bmi={bmi}
                    />
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </section>

      <footer className="actions">
        <button className="ghost">取消</button>
        <button className="primary">确认分类并标记SDV</button>
        <button className="primary">确认并录入EDC</button>
      </footer>
    </main>
  );
}
