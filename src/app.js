const LEVELS = [
  { id: "level1", title: "Level 1 Foundation", zh: "基础入门", note: "拼音、汉字、基础理解与表达" },
  { id: "level2", title: "Level 2 Core Expression", zh: "核心表达", note: "日常词汇、句子表达、语法运用" },
  { id: "level3", title: "Level 3 Accelerated Foundation", zh: "加速入门", note: "汉语基础、常用表达、提升输出" },
];

const QUESTION_TYPES = [
  ["matching", "拖拽对应题"],
  ["multiple_choice", "Multiple choice 选择题"],
  ["multi_select", "Multiple select 多项选择题"],
  ["fill_blank", "Fill in the blank 填空题"],
  ["sentence_ordering", "Sentence ordering 词语排序题"],
  ["sentence_building", "Sentence building 拼装句子"],
  ["open_response", "Open response 开放回答题"],
];

const QUESTION_CATEGORIES = [
  { id: "vocabulary", label: "词汇基础", note: "检查汉字、词义、拼音、图片/英文对应等基础掌握。" },
  { id: "grammar", label: "语法掌控", note: "检查关键语法、语序、时间地点顺序、句式判断。" },
  { id: "sentence", label: "句子拼装", note: "用给定词汇拼装句子，或从词库中选择合适词汇回应题干。" },
  { id: "expression", label: "自由表达", note: "开放式问题，学生根据自身情况自由作答。" },
];

const SKILL_TAG_OPTIONS = ["识字", "句法", "运用", "表达"];
const GRAMMAR_TAG_OPTIONS = ["语序", "虚词", "搭配", "语用"];

const QUESTION_TEMPLATES = [
  {
    id: "vocab_match_han_en",
    type: "matching",
    category: "vocabulary",
    label: "配对题（汉/英）",
    defaultPrompt: "请为汉字选择正确的英文意思。 / Match each Chinese word with the correct English meaning.",
    note: "左侧输入汉字，右侧输入英文，一一对应；学生端顺序打乱后匹配，匹配错误扣分。",
    optionsHelp: "左侧每行一个汉字/词语，可用 汉字|拼音。\n水|shuǐ\n山|shān\n朋友|péng you",
    answerHelp: "右侧每行一个英文意思，与左侧逐行对应。\nwater\nmountain\nfriend",
  },
  {
    id: "vocab_match_han_image",
    type: "matching",
    category: "vocabulary",
    label: "配对题（汉/图）",
    defaultPrompt: "请为汉字选择搭配的图片。 / Match each Chinese word with the correct picture.",
    note: "左侧输入汉字，右侧输入图片 URL 或图片说明；学生端顺序打乱后匹配。",
    optionsHelp: "左侧每行一个汉字/词语，可用 汉字|拼音。\n水|shuǐ\n山|shān",
    answerHelp: "右侧每行一张图片 URL 或图片说明，与左侧逐行对应。\nhttps://...\nhttps://...",
  },
  {
    id: "vocab_input_hanzi",
    type: "fill_blank",
    category: "vocabulary",
    label: "输入汉字题（英/汉）",
    defaultPrompt: "请输入下列英文词的汉语意思。 / Type the Chinese meaning for each English word.",
    note: "左侧输入英文提示，右侧输入标准汉字答案；学生端只显示英文提示并输入汉字。",
    optionsHelp: "左侧输入英文提示。\nwater",
    answerHelp: "右侧输入对应汉字。\n水",
  },
  {
    id: "grammar_true_false",
    type: "multiple_choice",
    category: "grammar",
    label: "判断句子对错",
    defaultPrompt: "请判断句子是否正确。 / Decide whether each sentence is correct or incorrect.",
    note: "老师输入一个句子，并选择它是正确还是错误；学生判断结果必须与老师设置一致。",
    optionsHelp: "输入要判断的句子。\n我昨天去学校。",
    answerHelp: "选择：正确 / 错误",
  },
  {
    id: "grammar_multi_correct",
    type: "multi_select",
    category: "grammar",
    label: "多选题（正确句子）",
    defaultPrompt: "请选择所有正确的句子。 / Select all correct sentences.",
    note: "老师输入四个句子，并勾选正确句子；学生需要选中所有正确句子。",
    optionsHelp: "每行一个句子。\n我昨天去了学校。\n我昨天去学校了。",
    answerHelp: "勾选正确句子。",
  },
  {
    id: "grammar_multi_wrong",
    type: "multi_select",
    category: "grammar",
    label: "多选题（错误句子）",
    defaultPrompt: "请选择所有错误的句子。 / Select all incorrect sentences.",
    note: "老师输入四个句子，并勾选错误句子；学生需要选中所有错误句子。",
    optionsHelp: "每行一个句子。",
    answerHelp: "勾选错误句子。",
  },
  {
    id: "grammar_fill_blank_multi",
    type: "fill_blank",
    category: "grammar",
    label: "填空题",
    defaultPrompt: "请依次填入句子缺失的部分。 / Fill in the missing parts in order.",
    note: "老师输入不完整句子，并在右侧逐行输入每个空的标准答案。",
    optionsHelp: "输入带空格的句子。\n我___在学校___中文。",
    answerHelp: "每行一个空的答案，按顺序填写。\n今天\n学习",
  },
  {
    id: "grammar_keyword_match",
    type: "sentence_building",
    category: "grammar",
    label: "匹配关键词",
    defaultPrompt: "请按顺序选择合适的关键词。 / Choose the correct keywords in order.",
    note: "老师输入候选词和正确词顺序，可加入干扰项；学生在下拉菜单里选择。",
    optionsHelp: "候选词，每行一个，包含正确词和干扰项。\n今天\n学校\n篮球\n学习",
    answerHelp: "正确关键词，每行一个，按顺序填写。\n今天\n学校\n学习",
  },
  {
    id: "sentence_ordering_all",
    type: "sentence_ordering",
    category: "sentence",
    label: "排序题",
    defaultPrompt: "请排列所给词汇，组成语法正确的句子。 / Put the words in order to make a correct sentence.",
    note: "老师按正确顺序输入词汇；学生端词序会被打乱，学生需要恢复正确顺序。",
    optionsHelp: "按正确顺序输入词汇。",
    answerHelp: "按正确顺序输入词汇。",
  },
  {
    id: "sentence_building_select",
    type: "sentence_building",
    category: "sentence",
    label: "选词回答问题",
    defaultPrompt: "请选择合适的词语组成句子，回答问题。 / Choose suitable words to answer the question.",
    note: "老师先输入问题，再按正确顺序输入答案词；可勾选干扰项。",
    optionsHelp: "输入问题和候选词。",
    answerHelp: "未勾选干扰项的词为正确答案。",
  },
  {
    id: "sentence_building_translate",
    type: "sentence_building",
    category: "sentence",
    label: "选词翻译",
    defaultPrompt: "请选择合适的词语翻译句子。 / Choose suitable words to translate the sentence.",
    note: "老师输入英文句子，再按正确顺序输入中文词；可勾选干扰项。",
    optionsHelp: "输入英文句子和候选词。",
    answerHelp: "未勾选干扰项的词为正确答案。",
  },
  {
    id: "expression_text_text",
    type: "open_response",
    category: "expression",
    label: "开放输入题：文字问题",
    defaultPrompt: "请阅读问题，并用中文输入回答。 / Read the question and type your answer in Chinese.",
    note: "老师输入汉语问题，学生输入文字回答。",
    optionsHelp: "老师输入汉语问题。",
    answerHelp: "学生输入文字回答。",
  },
  {
    id: "expression_audio_text",
    type: "open_response",
    category: "expression",
    label: "开放输入题：录音问题",
    defaultPrompt: "请听录音问题，并用中文输入回答。 / Listen to the question and type your answer in Chinese.",
    note: "老师录音提问，学生输入文字回答。",
    optionsHelp: "老师录音问题。",
    answerHelp: "学生输入文字回答。",
  },
  {
    id: "expression_text_audio",
    type: "open_response",
    category: "expression",
    label: "自由表达：录音回答",
    defaultPrompt: "请阅读问题，并用录音回答。 / Read the question and answer by recording.",
    note: "老师输入汉语问题，学生录音回答。",
    optionsHelp: "老师输入汉语问题。",
    answerHelp: "学生录音回答。",
  },
  {
    id: "expression_audio_audio",
    type: "open_response",
    category: "expression",
    label: "交流互动：录音问答",
    defaultPrompt: "请听录音问题，并用录音回答。 / Listen to the question and answer by recording.",
    note: "老师录音提问，学生录音回答。",
    optionsHelp: "老师录音问题。",
    answerHelp: "学生录音回答。",
  },
  {
    id: "vocab_input_english",
    type: "fill_blank",
    category: "vocabulary",
    label: "输入英文题（汉/英）",
    defaultPrompt: "请输入下列汉字的英文意思。 / Type the English meaning for each Chinese word.",
    note: "左侧输入汉字提示，右侧输入英文答案；学生端只显示汉字并输入英文意思。",
    optionsHelp: "左侧输入汉字提示。\n水",
    answerHelp: "右侧输入对应英文。\nwater",
  },
];

const STORAGE_KEY = "chinese-tiered-practice-mvp";
const CONFIG_KEY = "chinese-tiered-practice-supabase";

const state = {
  view: "home",
  level: "",
  student: null,
  selectedTaskId: null,
  activeQuestion: 0,
  answers: {},
  feedback: {},
  summary: null,
  practiceStartedAt: null,
  teacher: null,
  adminTab: "tasks",
  adminTaskLevel: "level1",
  adminClassId: "",
  analyticsClassId: "",
  analyticsGroupId: "",
  analyticsTaskId: "",
  analyticsStudentName: "",
  analyticsStudentSort: "name",
  pendingReviews: {},
  editingTaskId: null,
  taskDraft: null,
  editingQuestion: null,
  pendingQuestions: [],
  data: null,
  message: "",
  loading: false,
  config: loadConfig(),
  recording: null,
};

let supabaseClient = null;

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY)) || { url: "", anonKey: "" };
  } catch {
    return { url: "", anonKey: "" };
  }
}

function saveConfig(config) {
  state.config = config;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  supabaseClient = null;
}

function getSupabase() {
  if (!state.config.url || !state.config.anonKey || !window.supabase) return null;
  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(state.config.url, state.config.anonKey);
  }
  return supabaseClient;
}

function isLocalPreview() {
  return ["127.0.0.1", "localhost", ""].includes(window.location.hostname);
}

function defaultPreviewStudent() {
  const data = loadLocalData();
  const classRow = data.classes[0];
  const studentRow = data.class_students.find((item) => item.class_id === classRow?.id && item.active !== false) || data.class_students[0];
  if (!classRow || !studentRow) return null;
  return {
    student_id: studentRow.id,
    class_id: classRow.id,
    class_code: classRow.class_code,
    class_name: classRow.name,
    student_name: studentRow.student_name,
    gender: studentRow.gender || "",
    access_code: studentAccessCode(studentRow, classRow.class_code),
  };
}

function previewStudentForLevel(levelId) {
  const data = loadLocalData();
  const previewByLevel = {
    level1: { codePrefix: "G5", classCode: "G5LOCAL", className: "G5 Chinese Preview", studentName: "G5 Preview" },
    level2: { codePrefix: "G6", classCode: "G6LOCAL", className: "G6 Chinese Preview", studentName: "G6 Preview" },
    level3: { codePrefix: "G7", classCode: "G7LOCAL", className: "G7/8 Chinese Preview", studentName: "G7 Preview" },
  };
  const fallback = previewByLevel[levelId] || previewByLevel.level1;
  const classRow = data.classes.find((item) => classGroupKey(item.class_code) === fallback.codePrefix);
  const studentRow = data.class_students.find((item) => item.class_id === classRow?.id && item.active !== false);
  if (classRow && studentRow) {
    return {
      student_id: studentRow.id,
      class_id: classRow.id,
      class_code: classRow.class_code,
      class_name: classRow.name,
      student_name: studentRow.student_name,
      gender: studentRow.gender || "",
      access_code: studentAccessCode(studentRow, classRow.class_code),
    };
  }
  return {
    student_id: `${levelId}-preview-student`,
    class_id: `${levelId}-preview-class`,
    class_code: fallback.classCode,
    class_name: fallback.className,
    student_name: fallback.studentName,
    gender: "",
    access_code: buildAccessCode(fallback.classCode, fallback.studentName),
  };
}

function loadLocalPreviewLevel(levelId) {
  const data = loadLocalData();
  const previewStudent = previewStudentForLevel(levelId);
  const tasks = sortTasksByTitle(data.tasks.filter((task) => task.level === levelId && task.status === "published"));
  const taskIds = new Set(tasks.map((task) => task.id));
  state.student = previewStudent;
  state.level = levelId;
  state.data = {
    classes: [{
      id: previewStudent.class_id,
      class_code: previewStudent.class_code,
      name: previewStudent.class_name,
    }],
    class_students: [{
      id: previewStudent.student_id,
      class_id: previewStudent.class_id,
      student_name: previewStudent.student_name,
      gender: previewStudent.gender || "",
      access_code: studentAccessCode(previewStudent, previewStudent.class_code),
      active: true,
    }],
    tasks,
    questions: data.questions.filter((question) => taskIds.has(question.task_id)),
    student_attempts: [],
    student_answers: [],
    student_task_scores: data.student_task_scores.filter((score) => (
      taskIds.has(score.task_id) &&
      normalizeAnswer(score.class_code) === normalizeAnswer(previewStudent.class_code) &&
      normalizeAnswer(score.student_name) === normalizeAnswer(previewStudent.student_name)
    )),
  };
}

function seedData() {
  return {
    classes: [
      { id: "demo-class-1", class_code: "G7CN", name: "Grade 7 Chinese" },
      { id: "demo-class-2", class_code: "G8CN", name: "Grade 8 Chinese" },
    ],
    class_students: [
      { id: "demo-student-1", class_id: "demo-class-1", student_name: "Kevin", gender: "Male", access_code: "G7CNKevin", active: true },
      { id: "demo-student-2", class_id: "demo-class-1", student_name: "王明", gender: "男", access_code: "G7CN王明", active: true },
    ],
    tasks: [
      {
        id: "demo-task-1",
        class_id: "demo-class-1",
        title: "基础词句诊断包",
        topic: "自我介绍与基础名词",
        description: "复习水、山、朋友等基础词汇，并练习简单句子理解与排序。",
        practice_number: 1,
        level: "level1",
        status: "published",
        created_at: new Date().toISOString(),
      },
    ],
    questions: [
      {
        id: "demo-q-1",
        task_id: "demo-task-1",
        type: "matching",
        prompt: "把汉字和英文意思对应起来。",
        options: [
          { left: "水", pinyin: "shuǐ", right: "water" },
          { left: "山", pinyin: "shān", right: "mountain" },
          { left: "朋友", pinyin: "péng you", right: "friend" },
        ],
        correct_answer: { 水: "water", 山: "mountain", 朋友: "friend" },
        skill_tag: "vocabulary",
        grammar_tag: "",
        sort_order: 1,
      },
      {
        id: "demo-q-2",
        task_id: "demo-task-1",
        type: "multiple_choice",
        prompt: "“我喜欢学习中文。” 的英文意思最接近哪一个？",
        options: ["I like learning Chinese.", "I do not like Chinese.", "Chinese is difficult."],
        correct_answer: "I like learning Chinese.",
        skill_tag: "reading",
        grammar_tag: "sentence meaning",
        sort_order: 2,
      },
      {
        id: "demo-q-3",
        task_id: "demo-task-1",
        type: "fill_blank",
        prompt: "请填空：我___学生。",
        options: [],
        correct_answer: "是",
        skill_tag: "grammar",
        grammar_tag: "是",
        sort_order: 3,
      },
      {
        id: "demo-q-4",
        task_id: "demo-task-1",
        type: "sentence_ordering",
        prompt: "请把词语排成句子。",
        options: ["我", "今天", "很", "高兴"],
        correct_answer: ["我", "今天", "很", "高兴"],
        skill_tag: "syntax",
        grammar_tag: "word order",
        sort_order: 4,
      },
      {
        id: "demo-q-5",
        task_id: "demo-task-1",
        type: "sentence_building",
        prompt: "请选择合适的词回答：你喜欢什么运动？",
        options: ["我", "喜欢", "打", "篮球", "看", "书"],
        correct_answer: ["我", "喜欢", "打", "篮球"],
        skill_tag: "speaking",
        grammar_tag: "answer building",
        sort_order: 5,
      },
      {
        id: "demo-q-6",
        task_id: "demo-task-1",
        type: "open_response",
        prompt: "请用中文写一句话介绍你今天的心情。",
        options: [],
        correct_answer: "",
        skill_tag: "writing",
        grammar_tag: "",
        sort_order: 6,
      },
    ],
    student_attempts: [],
    student_answers: [],
    student_task_scores: [],
  };
}

function loadLocalData() {
  try {
    const data = normalizeData(JSON.parse(localStorage.getItem(STORAGE_KEY)) || seedData());
    if (data.__repaired) {
      delete data.__repaired;
      saveLocalData(data);
    }
    return data;
  } catch {
    return normalizeData(seedData());
  }
}

function saveLocalData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeData(data) {
  const classStudents = data.class_students || [];
  const tasks = data.tasks || [];
  const questions = data.questions || [];
  let repaired = false;
  if (!classStudents.length && (data.classes || []).some((item) => item.id === "demo-class-1")) {
    classStudents.push(
      { id: "demo-student-1", class_id: "demo-class-1", student_name: "Kevin", gender: "Male", access_code: "G7CNKevin", active: true },
      { id: "demo-student-2", class_id: "demo-class-1", student_name: "王明", gender: "男", access_code: "G7CN王明", active: true },
    );
  }
  const knownTaskIds = new Set(tasks.map((task) => task.id).filter(Boolean));
  const orphanTaskIds = [];
  questions.forEach((question) => {
    if (question.task_id && !knownTaskIds.has(question.task_id) && !orphanTaskIds.includes(question.task_id)) {
      orphanTaskIds.push(question.task_id);
    }
  });
  const seenTaskIds = new Set();
  tasks.forEach((task) => {
    if (!task.id || seenTaskIds.has(task.id)) {
      task.id = orphanTaskIds.find((id) => !seenTaskIds.has(id)) || crypto.randomUUID();
      repaired = true;
    }
    seenTaskIds.add(task.id);
  });
  const seenQuestionIds = new Set();
  questions.forEach((question) => {
    if (!question.id || seenQuestionIds.has(question.id)) {
      question.id = crypto.randomUUID();
      repaired = true;
    }
    seenQuestionIds.add(question.id);
  });
  return {
    classes: data.classes || [],
    class_students: classStudents,
    tasks,
    questions,
    student_attempts: data.student_attempts || [],
    student_answers: data.student_answers || [],
    student_task_scores: data.student_task_scores || [],
    ...(repaired ? { __repaired: true } : {}),
  };
}

const localApi = {
  async loadAll() {
    state.data = loadLocalData();
    return state.data;
  },
  async validateStudent(classCode, studentName) {
    const data = loadLocalData();
    const loginCode = String(classCode || "").trim();
    if (!loginCode) throw new Error("请输入组合代码。");
    const parsedCode = parseAccessCode(loginCode, data.classes);
    let classRow = parsedCode.classRow || data.classes.find((item) => (
      normalizeAnswer(item.class_code) === normalizeAnswer(parsedCode.classCode)
    )) || null;
    let studentRow = classRow ? data.class_students.find((item) => (
      item.class_id === classRow.id &&
      item.active !== false &&
      (
        accessCodeMatches(loginCode, item, classRow.class_code) ||
        normalizeAnswer(item.student_name) === normalizeAnswer(parsedCode.studentName)
      )
    )) : null;
    if (!studentRow && studentName) {
      classRow = data.classes.find((item) => item.class_code.toLowerCase() === loginCode.toLowerCase());
      studentRow = data.class_students.find((item) => (
        item.class_id === classRow?.id &&
        item.active !== false &&
        normalizeAnswer(item.student_name) === normalizeAnswer(studentName)
      ));
    }
    if (!classRow || !studentRow) throw new Error("没有找到匹配的学生组合代码，请检查后再试。");
    state.student = {
      student_id: studentRow.id,
      class_id: classRow.id,
      class_code: classRow.class_code,
      class_name: classRow.name,
      student_name: studentRow.student_name,
      gender: studentRow.gender || "",
      access_code: studentAccessCode(studentRow, classRow.class_code),
    };
    state.data = { ...data, classes: [classRow], class_students: [studentRow] };
    return state.student;
  },
  async loadStudentLevel(classCode, studentName, level) {
    const data = loadLocalData();
    const classRow = data.classes.find((item) => item.class_code.toLowerCase() === classCode.toLowerCase());
    if (!classRow) throw new Error("没有找到这个班级 code，请检查后再试。");
    const studentRow = data.class_students.find((item) => (
      item.class_id === classRow.id &&
      item.active !== false &&
      normalizeAnswer(item.student_name) === normalizeAnswer(studentName)
    ));
    if (!studentRow) throw new Error("这个姓名不在该班级名单中，请检查姓名或联系老师。");
    const tasks = data.tasks.filter((task) => task.level === level && task.status === "published");
    const taskIds = new Set(tasks.map((task) => task.id));
    state.data = {
      classes: [classRow],
      class_students: [studentRow],
      tasks,
      questions: data.questions.filter((question) => taskIds.has(question.task_id)),
      student_attempts: [],
      student_answers: [],
      student_task_scores: data.student_task_scores.filter((score) => (
        taskIds.has(score.task_id) &&
        normalizeAnswer(score.class_code) === normalizeAnswer(classRow.class_code) &&
        normalizeAnswer(score.student_name) === normalizeAnswer(studentRow.student_name)
      )),
    };
    return state.data;
  },
  async signIn(email, password) {
    if ((email === "teacher" || email.includes("@")) && password) {
      state.teacher = { email };
      return;
    }
    throw new Error("请输入老师账号和密码。");
  },
  async signOut() {
    state.teacher = null;
  },
  async upsertClass(payload) {
    const data = loadLocalData();
    const existing = data.classes.find((item) => item.class_code === payload.class_code);
    if (existing) Object.assign(existing, payload);
    else data.classes.push({ id: crypto.randomUUID(), ...payload });
    saveLocalData(data);
    state.data = data;
  },
  async deleteClass(classId) {
    const data = loadLocalData();
    const classRow = data.classes.find((item) => item.id === classId);
    data.classes = data.classes.filter((item) => item.id !== classId);
    data.class_students = data.class_students.filter((student) => student.class_id !== classId);
    data.student_attempts = data.student_attempts.filter((attempt) => (
      normalizeAnswer(attempt.class_code) !== normalizeAnswer(classRow?.class_code)
    ));
    const remainingAttemptIds = new Set(data.student_attempts.map((attempt) => attempt.id));
    data.student_answers = data.student_answers.filter((answer) => remainingAttemptIds.has(answer.attempt_id));
    data.student_task_scores = data.student_task_scores.filter((score) => (
      normalizeAnswer(score.class_code) !== normalizeAnswer(classRow?.class_code)
    ));
    saveLocalData(data);
    state.data = data;
  },
  async saveStudent(payload) {
    const data = loadLocalData();
    const classRow = data.classes.find((item) => item.id === payload.class_id);
    const cleanPayload = {
      ...payload,
      access_code: compactAccessCode(payload.access_code || buildAccessCode(classRow?.class_code, payload.student_name)),
    };
    const existing = data.class_students.find((item) => (
      item.class_id === cleanPayload.class_id &&
      (
        accessCodeMatches(cleanPayload.access_code, item, classRow?.class_code || "") ||
        normalizeAnswer(item.student_name) === normalizeAnswer(cleanPayload.student_name)
      )
    ));
    if (existing) Object.assign(existing, cleanPayload, { active: true });
    else data.class_students.push({ id: crypto.randomUUID(), active: true, ...cleanPayload });
    saveLocalData(data);
    state.data = data;
  },
  async deleteStudent(studentId) {
    const data = loadLocalData();
    data.class_students = data.class_students.filter((item) => item.id !== studentId);
    saveLocalData(data);
    state.data = data;
  },
  async saveTask(payload) {
    const data = loadLocalData();
    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
    let taskId = payload.id;
    if (taskId) {
      const task = data.tasks.find((item) => item.id === payload.id);
      if (!task) throw new Error("没有找到要编辑的任务包。");
      Object.assign(task, cleanPayload);
    } else {
      taskId = crypto.randomUUID();
      data.tasks.push({ ...cleanPayload, id: taskId, created_at: new Date().toISOString() });
    }
    saveLocalData(data);
    state.data = data;
    return taskId;
  },
  async deleteTask(taskId) {
    const data = loadLocalData();
    const removedAttemptIds = new Set(data.student_attempts
      .filter((attempt) => attempt.task_id === taskId)
      .map((attempt) => attempt.id));
    data.tasks = data.tasks.filter((item) => item.id !== taskId);
    data.questions = data.questions.filter((item) => item.task_id !== taskId);
    data.student_attempts = data.student_attempts.filter((attempt) => attempt.task_id !== taskId);
    data.student_answers = data.student_answers.filter((answer) => !removedAttemptIds.has(answer.attempt_id));
    data.student_task_scores = data.student_task_scores.filter((score) => score.task_id !== taskId);
    saveLocalData(data);
    state.data = data;
  },
  async deleteQuestion(questionId) {
    const data = loadLocalData();
    data.questions = data.questions.filter((item) => item.id !== questionId);
    saveLocalData(data);
    state.data = data;
  },
  async clearTaskHistory(taskId, classCode) {
    const data = loadLocalData();
    const removedAttemptIds = new Set(data.student_attempts
      .filter((attempt) => (
        attempt.task_id === taskId &&
        normalizeAnswer(attempt.class_code) === normalizeAnswer(classCode)
      ))
      .map((attempt) => attempt.id));
    data.student_attempts = data.student_attempts.filter((attempt) => !removedAttemptIds.has(attempt.id));
    data.student_answers = data.student_answers.filter((answer) => !removedAttemptIds.has(answer.attempt_id));
    data.student_task_scores = data.student_task_scores.filter((score) => !(
      score.task_id === taskId &&
      normalizeAnswer(score.class_code) === normalizeAnswer(classCode)
    ));
    saveLocalData(data);
    state.data = data;
  },
  async saveQuestion(payload) {
    const data = loadLocalData();
    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
    if (payload.id) {
      const question = data.questions.find((item) => item.id === payload.id);
      if (!question) throw new Error("没有找到要编辑的题目。");
      Object.assign(question, cleanPayload);
    } else {
      data.questions.push({ ...cleanPayload, id: crypto.randomUUID() });
    }
    saveLocalData(data);
    state.data = data;
  },
  async submitAttempt(attempt, answers) {
    const data = loadLocalData();
    const attemptId = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    data.student_attempts.push({ id: attemptId, submitted_at: submittedAt, ...attempt });
    answers.forEach((answer) => {
      data.student_answers.push({ id: crypto.randomUUID(), attempt_id: attemptId, ...answer });
    });
    const scoreRow = data.student_task_scores.find((item) => (
      item.task_id === attempt.task_id &&
      normalizeAnswer(item.class_code) === normalizeAnswer(attempt.class_code) &&
      normalizeAnswer(item.student_name) === normalizeAnswer(attempt.student_name)
    ));
    const scorePayload = {
      id: scoreRow?.id || crypto.randomUUID(),
      task_id: attempt.task_id,
      class_code: attempt.class_code,
      student_name: attempt.student_name,
      level: attempt.level,
      latest_score: attempt.score,
      latest_max_score: attempt.max_score,
      latest_accuracy: attempt.accuracy,
      latest_duration_seconds: attempt.duration_seconds || null,
      best_score: Math.max(scoreRow?.best_score || 0, attempt.score),
      attempts_count: (scoreRow?.attempts_count || 0) + 1,
      updated_at: submittedAt,
    };
    if (scoreRow) Object.assign(scoreRow, scorePayload);
    else data.student_task_scores.push(scorePayload);
    saveLocalData(data);
    state.data = data;
    return attemptId;
  },
  async reviewAnswer(answerId, isCorrect) {
    const data = loadLocalData();
    recalculateReviewedAnswer(data, answerId, isCorrect);
    saveLocalData(data);
    state.data = data;
  },
};

const supabaseApi = {
  async loadAll() {
    const client = getSupabase();
    if (!client) return localApi.loadAll();
    if (!state.teacher) {
      state.data = { classes: [], class_students: [], tasks: [], questions: [], student_attempts: [], student_answers: [], student_task_scores: [] };
      return state.data;
    }
    const [classes, students, tasks, questions] = await Promise.all([
      client.from("classes").select("*").order("name"),
      client.from("class_students").select("*").order("student_name"),
      client.from("tasks").select("*").order("created_at", { ascending: false }),
      client.from("questions").select("*").order("sort_order"),
    ]);
    [classes, students, tasks, questions].forEach((result) => {
      if (result.error) throw result.error;
    });
    let attempts = { data: [] };
    let answers = { data: [] };
    let scores = { data: [] };
    if (state.teacher) {
      [attempts, answers, scores] = await Promise.all([
        client.from("student_attempts").select("*").order("submitted_at", { ascending: false }).limit(300),
        client.from("student_answers").select("*").limit(2000),
        client.from("student_task_scores").select("*").order("updated_at", { ascending: false }).limit(500),
      ]);
      [attempts, answers, scores].forEach((result) => {
        if (result.error) throw result.error;
      });
    }
    state.data = {
      classes: classes.data || [],
      class_students: students.data || [],
      tasks: tasks.data || [],
      questions: questions.data || [],
      student_attempts: attempts.data || [],
      student_answers: answers.data || [],
      student_task_scores: scores.data || [],
    };
    return state.data;
  },
  async validateStudent(classCode, studentName) {
    const client = getSupabase();
    if (!client) return localApi.validateStudent(classCode, studentName);
    const parsedCode = studentName ? { classCode, studentName } : parseAccessCode(classCode, state.data?.classes || []);
    const { data, error } = await client.rpc("get_student_class", {
      p_class_code: parsedCode.classCode,
      p_student_name: parsedCode.studentName,
    });
    if (error) throw error;
    const classRow = Array.isArray(data) ? data[0] : data;
    if (!classRow) throw new Error("没有找到这个班级 code，请检查后再试。");
    state.student = {
      student_id: classRow.student_id,
      class_id: classRow.id,
      class_code: classRow.class_code,
      class_name: classRow.name,
      student_name: classRow.student_name,
      gender: classRow.gender || "",
      access_code: studentAccessCode(classRow, classRow.class_code),
    };
    state.data = { classes: [classRow], class_students: [{ id: classRow.student_id, class_id: classRow.id, student_name: classRow.student_name, gender: classRow.gender || "", access_code: studentAccessCode(classRow, classRow.class_code), active: true }], tasks: [], questions: [], student_attempts: [], student_answers: [], student_task_scores: [] };
    return state.student;
  },
  async loadStudentLevel(classCode, studentName, level) {
    const client = getSupabase();
    if (!client) return localApi.loadStudentLevel(classCode, studentName, level);
    const [tasksResult, questionsResult, scoresResult] = await Promise.all([
      client.rpc("get_student_tasks", { p_class_code: classCode, p_student_name: studentName, p_level: level }),
      client.rpc("get_student_questions", { p_class_code: classCode, p_student_name: studentName, p_level: level }),
      client.rpc("get_student_scores", { p_class_code: classCode, p_student_name: studentName, p_level: level }),
    ]);
    if (tasksResult.error) throw tasksResult.error;
    if (questionsResult.error) throw questionsResult.error;
    if (scoresResult.error) throw scoresResult.error;
    state.data = {
      classes: state.student ? [{
        id: state.student.class_id,
        class_code: state.student.class_code,
        name: state.student.class_name,
      }] : [],
      class_students: state.student ? [{
        id: state.student.student_id,
        class_id: state.student.class_id,
        student_name: state.student.student_name,
        gender: state.student.gender || "",
        access_code: state.student.access_code || "",
        active: true,
      }] : [],
      tasks: tasksResult.data || [],
      questions: questionsResult.data || [],
      student_attempts: [],
      student_answers: [],
      student_task_scores: scoresResult.data || [],
    };
    return state.data;
  },
  async signIn(email, password) {
    const client = getSupabase();
    if (!client) return localApi.signIn(email, password);
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    state.teacher = data.user;
  },
  async signOut() {
    const client = getSupabase();
    if (client) await client.auth.signOut();
    state.teacher = null;
  },
  async upsertClass(payload) {
    const client = getSupabase();
    if (!client) return localApi.upsertClass(payload);
    const { error } = await client.from("classes").upsert(payload, { onConflict: "class_code" });
    if (error) throw error;
    await api.loadAll();
  },
  async deleteClass(classId) {
    const client = getSupabase();
    if (!client) return localApi.deleteClass(classId);
    const { error } = await client.from("classes").delete().eq("id", classId);
    if (error) throw error;
    await api.loadAll();
  },
  async saveStudent(payload) {
    const client = getSupabase();
    if (!client) return localApi.saveStudent(payload);
    const { error } = await client.from("class_students").upsert(payload).select().single();
    if (error) throw error;
    await api.loadAll();
  },
  async deleteStudent(studentId) {
    const client = getSupabase();
    if (!client) return localApi.deleteStudent(studentId);
    const { error } = await client.from("class_students").delete().eq("id", studentId);
    if (error) throw error;
    await api.loadAll();
  },
  async saveTask(payload) {
    const client = getSupabase();
    if (!client) return localApi.saveTask(payload);
    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
    const { data, error } = await client.from("tasks").upsert(cleanPayload).select().single();
    if (error) throw error;
    await api.loadAll();
    return data?.id || payload.id;
  },
  async deleteTask(taskId) {
    const client = getSupabase();
    if (!client) return localApi.deleteTask(taskId);
    const { error } = await client.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
    await api.loadAll();
  },
  async deleteQuestion(questionId) {
    const client = getSupabase();
    if (!client) return localApi.deleteQuestion(questionId);
    const { error } = await client.from("questions").delete().eq("id", questionId);
    if (error) throw error;
    await api.loadAll();
  },
  async clearTaskHistory(taskId, classCode) {
    const client = getSupabase();
    if (!client) return localApi.clearTaskHistory(taskId, classCode);
    const scoreResult = await client
      .from("student_task_scores")
      .delete()
      .eq("task_id", taskId)
      .eq("class_code", classCode);
    if (scoreResult.error) throw scoreResult.error;
    const attemptResult = await client
      .from("student_attempts")
      .delete()
      .eq("task_id", taskId)
      .eq("class_code", classCode);
    if (attemptResult.error) throw attemptResult.error;
    await api.loadAll();
  },
  async saveQuestion(payload) {
    const client = getSupabase();
    if (!client) return localApi.saveQuestion(payload);
    const { optionsDraft, answerDraft, category, pairRows, answerRows, keywordRows, sentenceRows, manualSentenceRows, sentencePrompt, expressionPrompt, expressionAudio, ...cleanPayload } = payload;
    const { error } = await client.from("questions").upsert(cleanPayload).select().single();
    if (error) throw error;
    await api.loadAll();
  },
  async submitAttempt(attempt, answers) {
    const client = getSupabase();
    if (!client) return localApi.submitAttempt(attempt, answers);
    const attemptId = crypto.randomUUID();
    const { error } = await client.from("student_attempts").insert({ id: attemptId, ...attempt });
    if (error) throw error;
    const rows = answers.map((answer) => ({ ...answer, attempt_id: attemptId }));
    const answerResult = await client.from("student_answers").insert(rows);
    if (answerResult.error) throw answerResult.error;
    const scoreResult = await client.rpc("upsert_student_task_score", {
      p_task_id: attempt.task_id,
      p_class_code: attempt.class_code,
      p_student_name: attempt.student_name,
      p_level: attempt.level,
      p_score: attempt.score,
      p_max_score: attempt.max_score,
      p_accuracy: attempt.accuracy,
      p_duration_seconds: attempt.duration_seconds,
    });
    if (scoreResult.error) throw scoreResult.error;
    return attemptId;
  },
  async reviewAnswer(answerId, isCorrect) {
    const client = getSupabase();
    if (!client) return localApi.reviewAnswer(answerId, isCorrect);
    const data = structuredClone(state.data || { student_attempts: [], student_answers: [], student_task_scores: [] });
    const review = recalculateReviewedAnswer(data, answerId, isCorrect);
    const answerResult = await client
      .from("student_answers")
      .update({ is_correct: review.answer.is_correct, score: review.answer.score })
      .eq("id", answerId);
    if (answerResult.error) throw answerResult.error;
    const attemptResult = await client
      .from("student_attempts")
      .update({
        score: review.attempt.score,
        max_score: review.attempt.max_score,
        accuracy: review.attempt.accuracy,
      })
      .eq("id", review.attempt.id);
    if (attemptResult.error) throw attemptResult.error;
    const scoreResult = await client.from("student_task_scores").upsert(review.scorePayload);
    if (scoreResult.error) throw scoreResult.error;
    await api.loadAll();
  },
};

const api = supabaseApi;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isImageValue(value) {
  const text = String(value || "").trim();
  return text.startsWith("data:image/")
    || /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(text);
}

function isAudioValue(value) {
  const text = String(value || "").trim();
  return text.startsWith("data:audio/") || /^https?:\/\/.+\.(mp3|m4a|wav|ogg|webm)(\?.*)?$/i.test(text);
}

function imageOptionLabel(value, index) {
  return isImageValue(value) ? `图片 ${index + 1}` : value;
}

function compactAnswerValue(value) {
  return compactMediaValue(value);
}

function displayAnswerValue(value) {
  if (value === "正确") return "正确 / Correct";
  if (value === "错误") return "错误 / Incorrect";
  return compactAnswerValue(value);
}

function compactMediaValue(value) {
  if (isImageValue(value)) return "[图片]";
  if (isAudioValue(value)) return "[录音]";
  return value;
}

function renderImageThumb(value, label = "图片") {
  if (!isImageValue(value)) return "";
  return `<img class="match-image" src="${escapeHtml(value)}" alt="${escapeHtml(label)}" />`;
}

function renderAudioPlayer(value, label = "录音") {
  if (!isAudioValue(value)) return "";
  return `
    <div class="audio-preview">
      <span>${escapeHtml(label)}</span>
      <audio controls src="${escapeHtml(value)}"></audio>
    </div>
  `;
}

function answerAudioValue(value) {
  if (typeof value === "string" && value.trim().startsWith("{")) {
    try {
      return answerAudioValue(JSON.parse(value));
    } catch {
      return "";
    }
  }
  if (value && typeof value === "object" && isAudioValue(value.audio)) return value.audio;
  if (isAudioValue(value)) return value;
  return "";
}

function questionNeedsAudioAnswer(question) {
  if (!question || !isExpressionTemplate(question.template_id)) return false;
  const options = getExpressionOptions(question);
  return (options.answerMode || expressionModes(question.template_id).answerMode) === "audio";
}

function renderTeacherAnswerValue(answer, question = null) {
  const audio = answerAudioValue(answer);
  if (audio) {
    return `
      <div class="teacher-audio-answer">
        <strong>学生录音回答 / Student recording</strong>
        ${renderAudioPlayer(audio, "播放录音 / Play recording")}
      </div>
    `;
  }
  if (questionNeedsAudioAnswer(question)) {
    return `<span class="missing-audio-answer">未提交录音 / No recording submitted</span>`;
  }
  return escapeHtml(formatAnswerForStudent(answer));
}

function renderTeacherAnswerReviewHint(question, row) {
  if (!row || !isOpenQuestion(question)) return "";
  const result = analyzeOpenResponse(row.student_answer);
  return `
    <small class="auto-review-hint">
      自动建议：${escapeHtml(result.label)} · ${escapeHtml(result.hint)}
    </small>
  `;
}

function answerResultLabel(question, row) {
  if (!row) return "未作答";
  if (row.is_correct === null) return isOpenQuestion(question) ? "待老师确认" : "开放题";
  return row.is_correct ? "做对" : "做错";
}

function renderTeacherReviewControls(row) {
  if (!row) return "未作答";
  const current = row.is_correct === true ? "当前：做对" : row.is_correct === false ? "当前：做错" : "当前：未复判";
  const hasPending = Object.prototype.hasOwnProperty.call(state.pendingReviews || {}, row.id);
  const staged = hasPending ? state.pendingReviews[row.id] : row.is_correct;
  return `
    <div class="teacher-review-controls">
      <span>${escapeHtml(current)}</span>
      <button class="secondary compact ${staged === true ? "active" : ""}" data-action="set-review-answer" data-answer="${escapeHtml(row.id)}" data-correct="true">判对</button>
      <button class="secondary compact ${staged === false ? "active warning-text" : ""}" data-action="set-review-answer" data-answer="${escapeHtml(row.id)}" data-correct="false">判错</button>
    </div>
  `;
}

function renderTeacherReviewHeader() {
  const pendingCount = Object.keys(state.pendingReviews || {}).length;
  return `
    <div class="teacher-review-head">
      <span>老师复判</span>
      <button class="compact" data-action="save-review-answers" ${pendingCount ? "" : "disabled"}>
        保存${pendingCount ? ` ${pendingCount}` : ""}
      </button>
    </div>
  `;
}

function normalizeAnswer(value) {
  if (Array.isArray(value)) return value.map((item) => normalizeAnswer(typeof item === "object" ? item.word : item)).join(" ");
  if (value && typeof value === "object" && "word" in value) return normalizeAnswer(value.word);
  return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function buildAccessCode(classCode, studentName) {
  return `${String(classCode || "").trim().toUpperCase()}${String(studentName || "").trim()}`;
}

function compactAccessCode(value) {
  return String(value || "").trim().replace(/-/g, "").replace(/\s+/g, "");
}

function parseAccessCode(loginCode, classes = []) {
  const raw = String(loginCode || "").trim();
  const compact = compactAccessCode(raw).toUpperCase();
  const classRows = [...classes]
    .filter((item) => item?.class_code)
    .sort((a, b) => String(b.class_code).length - String(a.class_code).length);
  const classRow = classRows.find((item) => compact.startsWith(compactAccessCode(item.class_code).toUpperCase()));
  if (classRow) {
    const classCode = String(classRow.class_code).trim();
    const nameStart = String(classRow.class_code).length;
    const studentName = compactAccessCode(raw).slice(nameStart).trim();
    return { classCode, studentName, classRow };
  }
  const fallback = raw.match(/^([A-Za-z]\d[A-Za-z]+)-?(.+)$/);
  return fallback ? { classCode: fallback[1].toUpperCase(), studentName: fallback[2].trim(), classRow: null } : { classCode: raw, studentName: "", classRow: null };
}

function studentAccessCode(student, classCode) {
  return buildAccessCode(classCode, student?.student_name || "");
}

function accessCodeMatches(input, student, classCode) {
  const compactInput = compactAccessCode(input).toLowerCase();
  return compactInput === compactAccessCode(student?.access_code).toLowerCase()
    || compactInput === compactAccessCode(studentAccessCode(student, classCode)).toLowerCase();
}

function isOpenQuestion(question) {
  return question.type === "open_response";
}

function getQuestions(taskId) {
  return (state.data?.questions || [])
    .filter((question) => question.task_id === taskId)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
}

function sortTasksByTitle(tasks) {
  return [...tasks].sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "zh-Hans-CN", {
    numeric: true,
    sensitivity: "base",
  }));
}

function sortTasksForStudent(tasks) {
  return [...tasks].sort((a, b) => {
    const dateDiff = new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (dateDiff) return dateDiff;
    return String(a.title || "").localeCompare(String(b.title || ""), "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base",
    });
  });
}

function getTask(taskId) {
  return (state.data?.tasks || []).find((task) => task.id === taskId);
}

function getClass(classId) {
  return (state.data?.classes || []).find((item) => item.id === classId);
}

function getLevel(levelId) {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
}

function levelForClassCode(classCode = "") {
  const match = String(classCode).trim().toUpperCase().match(/^G(\d+)/);
  const grade = match ? Number(match[1]) : 5;
  if (grade >= 7) return "level3";
  if (grade === 6) return "level2";
  return "level1";
}

function classGroupKey(classCode = "") {
  const clean = String(classCode || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, 2) || "NA";
}

function classGroupTitle(groupKey) {
  return groupKey === "NA" ? "Unassigned Chinese Class" : `${groupKey} Chinese Class`;
}

function groupedClassesByCode(classes) {
  const groups = new Map();
  classes.forEach((classRow) => {
    const key = classGroupKey(classRow.class_code);
    if (!groups.has(key)) groups.set(key, { id: key, title: classGroupTitle(key), classes: [] });
    groups.get(key).classes.push(classRow);
  });
  return [...groups.values()]
    .map((group) => ({
      ...group,
      classes: group.classes.sort((a, b) => String(a.class_code || "").localeCompare(String(b.class_code || ""), "en", {
        numeric: true,
        sensitivity: "base",
      })),
    }))
    .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true, sensitivity: "base" }));
}

function getQuestionTypeLabel(type, templateId = "") {
  return getTemplate(templateId)?.label || QUESTION_TYPES.find(([id]) => id === type)?.[1] || type;
}

function getTemplatesForCategory(categoryId) {
  return QUESTION_TEMPLATES.filter((template) => template.category === categoryId);
}

function getTemplate(templateId) {
  return QUESTION_TEMPLATES.find((template) => template.id === templateId);
}

function categoryForQuestionType(typeOrTemplateId) {
  const template = QUESTION_TEMPLATES.find((item) => item.id === typeOrTemplateId || item.type === typeOrTemplateId);
  return template?.category || "vocabulary";
}

function templateForQuestion(typeOrTemplateId, categoryId) {
  const templates = getTemplatesForCategory(categoryId);
  return templates.find((template) => template.id === typeOrTemplateId || template.type === typeOrTemplateId) || templates[0] || QUESTION_TEMPLATES[0];
}

function nextQuestionSortOrder() {
  const questions = state.editingTaskId ? getQuestions(state.editingTaskId) : state.pendingQuestions;
  const maxSort = questions.reduce((max, question) => Math.max(max, Number(question.sort_order) || 0), 0);
  return maxSort + 1;
}

function blankQuestionDraftForTemplate(templateId, { sortOrder } = {}) {
  const template = getTemplate(templateId) || QUESTION_TEMPLATES[0];
  return {
    type: template.type,
    template_id: template.id,
    category: template.category,
    prompt: template.defaultPrompt || "",
    sort_order: sortOrder || nextQuestionSortOrder(),
    skill_tag: "",
    grammar_tag: "",
    optionsDraft: "",
    answerDraft: "",
    pairRows: null,
    answerRows: null,
    keywordRows: null,
    sentenceRows: null,
    manualSentenceRows: false,
    sentencePrompt: "",
    expressionPrompt: "",
    expressionAudio: "",
  };
}

function isPairBuilderTemplate(templateId) {
  return ["vocab_match_han_en", "vocab_match_han_image", "vocab_input_hanzi", "vocab_input_english", "grammar_true_false"].includes(templateId);
}

function readPairRowsFromDom() {
  const rows = Array.from(document.querySelectorAll("[data-pair-row]"));
  if (!rows.length) return null;
  return rows.map((row) => ({
    left: row.querySelector("[data-pair-left]")?.value.trim() || "",
    right: row.querySelector("[data-pair-right]")?.value.trim() || "",
  }));
}

function getPairRowsForEdit(question) {
  if (Array.isArray(question.pairRows) && question.pairRows.length) return question.pairRows;
  const leftLines = formatOptionsForEdit(question).split("\n");
  const rightLines = formatAnswerForEdit(question).split("\n");
  const defaultCount = String(question.template_id || "").startsWith("vocab_") ? 3 : 1;
  const rowCount = Math.max(defaultCount, leftLines.filter(Boolean).length, rightLines.filter(Boolean).length);
  return Array.from({ length: rowCount }).map((_, index) => ({
    left: leftLines[index] || "",
    right: rightLines[index] || "",
  }));
}

function renderPairBuilder(activeTemplate, editing) {
  const rows = getPairRowsForEdit({ ...editing, template_id: activeTemplate.id });
  const leftLabel = activeTemplate.id === "grammar_true_false" ? "句子" : activeTemplate.id === "vocab_input_hanzi" ? "英文提示" : "汉字 / 词语";
  const rightLabel = activeTemplate.id === "grammar_true_false" ? "判断结果" : activeTemplate.id === "vocab_match_han_image" ? "图片 URL / 图片说明" : activeTemplate.id === "vocab_input_hanzi" ? "正确汉字" : "正确英文";
  const isImageMatch = activeTemplate.id === "vocab_match_han_image";
  return `
    <div class="pair-builder">
      <div class="pair-builder__head">
        <span>${escapeHtml(leftLabel)}</span>
        <span>${escapeHtml(rightLabel)}</span>
        <span>操作</span>
      </div>
      ${rows.map((pair, index) => `
        <div class="pair-builder__row ${isImageMatch ? "image-row" : ""}" data-pair-row>
          <input data-pair-left value="${escapeHtml(pair.left)}" placeholder="${escapeHtml(leftLabel)} ${index + 1}" />
          ${activeTemplate.id === "grammar_true_false" ? `
            <select data-pair-right>
              <option value="正确" ${!pair.right || pair.right === "正确" ? "selected" : ""}>正确</option>
              <option value="错误" ${pair.right === "错误" ? "selected" : ""}>错误</option>
            </select>
          ` : isImageMatch ? `
            <div class="image-upload-cell">
              <div class="image-upload-row">
                <label class="secondary compact image-upload-button">
                  上传图片
                  <input data-pair-image-input data-index="${index}" type="file" accept="image/*" />
                </label>
                ${isImageValue(pair.right) ? `<span class="image-upload-preview">${renderImageThumb(pair.right, `${leftLabel} ${index + 1}`)}</span>` : `<span class="muted">支持小图或图片 URL</span>`}
              </div>
              <input data-pair-right value="${escapeHtml(pair.right)}" placeholder="${escapeHtml(rightLabel)} ${index + 1}" />
            </div>
          ` : `<input data-pair-right value="${escapeHtml(pair.right)}" placeholder="${escapeHtml(rightLabel)} ${index + 1}" />`}
          <div class="pair-builder__actions">
            <button class="secondary compact" data-action="add-question-pair" title="增加一对">+</button>
            <button class="secondary compact" data-action="remove-question-pair" data-index="${index}" title="删除这一对" ${rows.length <= 1 ? "disabled" : ""}>-</button>
          </div>
        </div>
      `).join("")}
      <textarea id="question-options" hidden>${escapeHtml(rows.map((pair) => pair.left).join("\n"))}</textarea>
      <textarea id="question-answer" hidden>${escapeHtml(rows.map((pair) => pair.right).join("\n"))}</textarea>
    </div>
  `;
}

function readAnswerRowsFromDom() {
  const rows = Array.from(document.querySelectorAll("[data-answer-row]"));
  if (!rows.length) return null;
  return rows.map((row) => row.querySelector("[data-answer-row-input]")?.value.trim() || "");
}

function getAnswerRowsForEdit(question, activeTemplate = null) {
  const templateId = activeTemplate?.id || question.template_id || "";
  const defaultCount = templateId === "grammar_fill_blank_multi" ? 3 : 1;
  if (Array.isArray(question.answerRows) && question.answerRows.length) {
    return question.answerRows;
  }
  const rows = formatAnswerForEdit(question).split("\n").filter(Boolean);
  return rows.length ? rows : Array.from({ length: defaultCount }).map(() => "");
}

function renderAnswerBuilder(editing, activeTemplate) {
  const rows = getAnswerRowsForEdit(editing, activeTemplate);
  return `
    <div class="answer-builder">
      <div class="answer-builder__head">
        <span>正确答案</span>
        <span>操作</span>
      </div>
      ${rows.map((answer, index) => `
        <div class="answer-builder__row" data-answer-row>
          <input data-answer-row-input value="${escapeHtml(answer)}" placeholder="第 ${index + 1} 空答案" />
          <div class="pair-builder__actions">
            <button class="secondary compact" data-action="add-blank-answer" title="增加一个答案">+</button>
            <button class="secondary compact" data-action="remove-blank-answer" data-index="${index}" title="删除这个答案" ${rows.length <= 1 ? "disabled" : ""}>-</button>
          </div>
        </div>
      `).join("")}
      <textarea id="question-answer" hidden>${escapeHtml(rows.join("\n"))}</textarea>
    </div>
  `;
}

function readKeywordRowsFromDom() {
  const rows = Array.from(document.querySelectorAll("[data-keyword-row]"));
  if (!rows.length) return null;
  return rows.map((row) => ({
    word: row.querySelector("[data-keyword-word]")?.value.trim() || "",
    distractor: Boolean(row.querySelector("[data-keyword-distractor]")?.checked),
  }));
}

function getKeywordRowsForEdit(question) {
  if (Array.isArray(question.keywordRows) && question.keywordRows.length) return question.keywordRows;
  const candidates = Array.isArray(question.options?.candidates)
    ? question.options.candidates
    : Array.isArray(question.options)
      ? question.options
      : formatOptionsForEdit(question).split("\n").filter(Boolean);
  const correctSet = new Set((Array.isArray(question.correct_answer) ? question.correct_answer : formatAnswerForEdit(question).split("\n")).map(normalizeAnswer));
  const rows = candidates.map((word) => ({ word, distractor: !correctSet.has(normalizeAnswer(word)) }));
  return rows.length ? rows : [{ word: "", distractor: false }];
}

function renderKeywordBuilder(editing, activeTemplate) {
  const rows = getKeywordRowsForEdit(editing);
  const sentence = typeof editing.options === "object" && !Array.isArray(editing.options)
    ? editing.options.sentence || ""
    : formatOptionsForEdit(editing);
  return `
    <div class="grid question-template-fields keyword-match-fields">
      <label class="keyword-sentence-field"><span>带空格的句子</span>
        <input id="question-options" value="${escapeHtml(sentence)}" placeholder="例如：我___在学校___中文。" />
      </label>
      <div class="keyword-builder">
        <div class="keyword-builder__head">
          <span>正确答案 / 候选词（按空格顺序填写）</span>
          <span>操作</span>
        </div>
        ${rows.map((row, index) => `
          <div class="keyword-builder__row" data-keyword-row>
            <div class="keyword-answer-cell">
              <input data-keyword-word value="${escapeHtml(row.word)}" placeholder="第 ${index + 1} 个词 / 候选词" />
              <label class="keyword-distractor-toggle">
                <input data-keyword-distractor type="checkbox" ${row.distractor ? "checked" : ""} />
                干扰项
              </label>
            </div>
            <div class="pair-builder__actions">
              <button class="secondary compact" data-action="add-keyword-option" title="增加候选词">+</button>
              <button class="secondary compact" data-action="remove-keyword-option" data-index="${index}" title="删除候选词" ${rows.length <= 1 ? "disabled" : ""}>-</button>
            </div>
          </div>
        `).join("")}
        <textarea id="question-answer" hidden>${escapeHtml(rows.filter((row) => !row.distractor).map((row) => row.word).join("\n"))}</textarea>
      </div>
    </div>
  `;
}

function isSentenceWordTemplate(templateId) {
  return ["sentence_ordering_all", "sentence_building_select", "sentence_building_translate"].includes(templateId);
}

function readSentenceRowsFromDom() {
  const rows = Array.from(document.querySelectorAll("[data-sentence-word-row]"));
  if (!rows.length) return null;
  return rows.map((row) => ({
    word: row.querySelector("[data-sentence-word]")?.value.trim() || "",
    distractor: Boolean(row.querySelector("[data-sentence-distractor]")?.checked),
  }));
}

function getSentenceRowsForEdit(question, activeTemplate) {
  const template = activeTemplate || getTemplate(question.template_id) || QUESTION_TEMPLATES.find((item) => item.category === "sentence");
  if (Array.isArray(question.sentenceRows) && question.sentenceRows.length) {
    const defaultCount = 4;
    const allBlank = question.sentenceRows.every((row) => !row.word);
    if (
      template.id === "sentence_ordering_all" &&
      !question.id &&
      !question.manualSentenceRows &&
      allBlank &&
      question.sentenceRows.length > defaultCount
    ) {
      return question.sentenceRows.slice(0, defaultCount);
    }
    return question.sentenceRows;
  }
  const candidates = Array.isArray(question.options?.candidates)
    ? question.options.candidates
    : Array.isArray(question.options)
      ? question.options
      : [];
  const answerSource = Array.isArray(question.correct_answer) ? question.correct_answer : formatAnswerForEdit(question).split("|");
  const correctSet = new Set(answerSource.map(normalizeAnswer));
  if (candidates.length) {
    return candidates.map((word) => ({
      word,
      distractor: template.id !== "sentence_ordering_all" && !correctSet.has(normalizeAnswer(word)),
    }));
  }
  const defaultCount = 4;
  return Array.from({ length: defaultCount }).map(() => ({ word: "", distractor: false }));
}

function renderSentenceWordBuilder(activeTemplate, editing) {
  const rows = getSentenceRowsForEdit(editing, activeTemplate);
  const usesPrompt = activeTemplate.id !== "sentence_ordering_all";
  const promptLabel = activeTemplate.id === "sentence_building_translate" ? "英文句子" : "问题";
  const promptPlaceholder = activeTemplate.id === "sentence_building_translate" ? "例如：I go to school today." : "例如：你今天做什么？";
  const sourcePrompt = editing.sentencePrompt || (typeof editing.options === "object" && !Array.isArray(editing.options) ? editing.options.prompt || "" : "");
  return `
    <div class="sentence-word-editor">
      ${usesPrompt ? `
        <label>${promptLabel}
          <input id="sentence-task-prompt" value="${escapeHtml(sourcePrompt)}" placeholder="${escapeHtml(promptPlaceholder)}" />
        </label>
      ` : ""}
      <div class="keyword-builder sentence-word-builder ${activeTemplate.id === "sentence_ordering_all" ? "no-distractors" : ""}">
        <div class="keyword-builder__head">
          <span>${activeTemplate.id === "sentence_ordering_all" ? "词汇（按正确顺序填写）" : "正确词 / 候选词（按正确顺序填写）"}</span>
          <span>操作</span>
        </div>
        ${rows.map((row, index) => `
          <div class="keyword-builder__row" data-sentence-word-row>
            <div class="keyword-answer-cell">
              <input data-sentence-word value="${escapeHtml(row.word)}" placeholder="词 ${index + 1}" />
              ${activeTemplate.id === "sentence_ordering_all" ? "" : `
                <label class="keyword-distractor-toggle">
                  <input data-sentence-distractor type="checkbox" ${row.distractor ? "checked" : ""} />
                  干扰项
                </label>
              `}
            </div>
            <div class="pair-builder__actions">
              <button class="secondary compact" data-action="add-sentence-word" title="增加词汇">+</button>
              <button class="secondary compact" data-action="remove-sentence-word" data-index="${index}" title="删除词汇" ${rows.length <= 1 ? "disabled" : ""}>-</button>
            </div>
          </div>
        `).join("")}
        <textarea id="question-options" hidden>${escapeHtml(sourcePrompt)}</textarea>
        <textarea id="question-answer" hidden>${escapeHtml(rows.filter((row) => row.word && !row.distractor).map((row) => row.word).join("\n"))}</textarea>
      </div>
    </div>
  `;
}

function isExpressionTemplate(templateId) {
  return ["expression_text_text", "expression_audio_text", "expression_text_audio", "expression_audio_audio"].includes(templateId);
}

function expressionModes(templateId) {
  return {
    promptMode: templateId === "expression_audio_text" || templateId === "expression_audio_audio" ? "audio" : "text",
    answerMode: templateId === "expression_text_audio" || templateId === "expression_audio_audio" ? "audio" : "text",
  };
}

function getExpressionOptions(question) {
  return question.options && typeof question.options === "object" && !Array.isArray(question.options)
    ? question.options
    : {};
}

function recordingKey(scope, questionId = "") {
  return `${scope}:${questionId || "draft"}`;
}

function renderRecordControl(scope, questionId = "", label = "录音", { disabled = false } = {}) {
  const key = recordingKey(scope, questionId);
  const active = state.recording?.key === key;
  return `
    <button type="button" class="${active ? "warning" : "secondary"} compact" data-action="${active ? "stop-recording" : "start-recording"}" data-record-scope="${scope}" data-question="${escapeHtml(questionId)}" ${disabled ? "disabled" : ""}>
      ${active ? "停止录音" : label}
    </button>
    ${active ? `<span class="muted">录音中，最长 5 分钟。</span>` : ""}
  `;
}

function renderExpressionBuilder(activeTemplate, editing) {
  const modes = expressionModes(activeTemplate.id);
  const options = getExpressionOptions(editing);
  const textPrompt = editing.expressionPrompt ?? options.prompt ?? "";
  const audioPrompt = editing.expressionAudio ?? options.audio ?? "";
  return `
    <div class="grid expression-builder">
      <div class="expression-side">
        <strong>${modes.promptMode === "audio" ? "左侧：老师录音问题" : "左侧：汉语问题"}</strong>
        ${modes.promptMode === "audio" ? `
          <div class="row wrap">
            ${renderRecordControl("teacher-question", "", audioPrompt ? "重新录音" : "录音问题")}
          </div>
          ${renderAudioPlayer(audioPrompt, "老师问题录音")}
        ` : `
          <input id="expression-text-prompt" value="${escapeHtml(textPrompt)}" placeholder="请输入汉语问题" />
        `}
      </div>
      <div class="expression-side">
        <strong>${modes.answerMode === "audio" ? "右侧：学生录音回答" : "右侧：学生文字输入"}</strong>
        ${modes.answerMode === "audio" ? `
          <div class="record-placeholder">学生端显示录音按钮，确认后开始录音，最长 5 分钟。</div>
        ` : `
          <textarea class="compact-textarea" disabled placeholder="学生端会显示汉字输入框"></textarea>
        `}
      </div>
      <textarea id="question-options" hidden>${escapeHtml(textPrompt)}</textarea>
      <textarea id="question-answer" hidden></textarea>
    </div>
  `;
}

function stableHash(value) {
  let hash = 2166136261;
  String(value).split("").forEach((char) => {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return hash >>> 0;
}

function stableShuffle(items, seed, keyFn = (item) => item) {
  const shuffled = [...items]
    .map((item, index) => ({
      item,
      index,
      key: stableHash(`${seed}:${index}:${normalizeAnswer(keyFn(item))}`),
    }))
    .sort((a, b) => (a.key - b.key) || (a.index - b.index))
    .map(({ item }) => item);
  if (
    shuffled.length > 1 &&
    shuffled.every((item, index) => item === items[index])
  ) {
    return [...shuffled.slice(1), shuffled[0]];
  }
  return shuffled;
}

function renderQuestionTemplatePicker(activeCategory, activeTemplate, categoryTemplates, { compact = false } = {}) {
  return `
    <div class="question-template-panel ${compact ? "compact" : ""}">
      <h3>题目类型 / Question types</h3>
      <div class="template-category-grid">
        ${QUESTION_CATEGORIES.map((category) => `
          <button class="template-category ${activeCategory === category.id ? "active" : ""}" data-action="select-question-category" data-category="${category.id}">
            <strong>${escapeHtml(category.label)}</strong>
          </button>
        `).join("")}
      </div>
      <div class="grid">
        <label>题型选择
          <select id="question-type">
            ${categoryTemplates.map((template) => `<option value="${template.id}" ${activeTemplate.id === template.id ? "selected" : ""}>${escapeHtml(template.label)}</option>`).join("")}
          </select>
        </label>
      </div>
    </div>
  `;
}

function renderQuestionDraftForm(activeTemplate, questions) {
  const editing = state.editingQuestion || {};
  const activeType = editing.type || activeTemplate.type || activeTemplate.id;
  const isMatching = activeType === "matching";
  const isFillBlank = activeType === "fill_blank";
  const promptValue = activeTemplate.defaultPrompt || editing.prompt || "";
  const optionLines = formatOptionsForEdit(editing).split("\n");
  const answerText = formatAnswerForEdit(editing);
  const answerLines = answerText.split("\n");
  const checkedSet = new Set(answerText.split("\n").map((line) => normalizeAnswer(line)).filter(Boolean));
  const isSentenceSelection = activeTemplate.id === "grammar_multi_correct" || activeTemplate.id === "grammar_multi_wrong";
  const pairBuilder = isPairBuilderTemplate(activeTemplate.id);
  return `
    <div class="question-draft-form stack">
      <div class="grid">
        <label>排序
          <input id="question-order" type="number" min="1" value="${escapeHtml(editing.sort_order || questions.length + 1)}" />
        </label>
        <label>技能标签
          <select id="question-skill">
            <option value="">请选择</option>
            ${SKILL_TAG_OPTIONS.map((option) => `<option value="${escapeHtml(option)}" ${editing.skill_tag === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            ${editing.skill_tag && !SKILL_TAG_OPTIONS.includes(editing.skill_tag) ? `<option value="${escapeHtml(editing.skill_tag)}" selected>${escapeHtml(editing.skill_tag)}</option>` : ""}
          </select>
        </label>
        <label>语法标签
          <select id="question-grammar">
            <option value="">请选择</option>
            ${GRAMMAR_TAG_OPTIONS.map((option) => `<option value="${escapeHtml(option)}" ${editing.grammar_tag === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            ${editing.grammar_tag && !GRAMMAR_TAG_OPTIONS.includes(editing.grammar_tag) ? `<option value="${escapeHtml(editing.grammar_tag)}" selected>${escapeHtml(editing.grammar_tag)}</option>` : ""}
          </select>
        </label>
      </div>
      <div class="fixed-prompt" id="question-prompt" data-value="${escapeHtml(promptValue)}">
        <span>题干 / Prompt</span>
        <strong>${escapeHtml(promptValue)}</strong>
      </div>
      ${pairBuilder ? `
        ${renderPairBuilder(activeTemplate, editing)}
      ` : isSentenceSelection ? `
        <div class="sentence-check-list">
          ${Array.from({ length: 4 }).map((_, index) => {
            const sentence = optionLines[index] || "";
            return `
              <label class="sentence-check-row">
                <input id="grammar-check-${index}" type="checkbox" ${checkedSet.has(normalizeAnswer(sentence)) ? "checked" : ""} />
                <input id="grammar-sentence-${index}" value="${escapeHtml(sentence)}" placeholder="句子 ${index + 1}" />
              </label>
            `;
          }).join("")}
        </div>
        <textarea id="question-options" hidden>${escapeHtml(formatOptionsForEdit(editing))}</textarea>
        <textarea id="question-answer" hidden>${escapeHtml(answerText)}</textarea>
      ` : activeTemplate.id === "grammar_fill_blank_multi" ? `
        <div class="grid question-template-fields">
          <label>提示输入框 / 句子
            <textarea class="compact-textarea" id="question-options" placeholder="${escapeHtml(activeTemplate.optionsHelp)}">${escapeHtml(formatOptionsForEdit(editing))}</textarea>
          </label>
          ${renderAnswerBuilder(editing, activeTemplate)}
        </div>
      ` : activeTemplate.id === "grammar_keyword_match" ? `
        ${renderKeywordBuilder(editing, activeTemplate)}
      ` : isSentenceWordTemplate(activeTemplate.id) ? `
        ${renderSentenceWordBuilder(activeTemplate, editing)}
      ` : isExpressionTemplate(activeTemplate.id) ? `
        ${renderExpressionBuilder(activeTemplate, editing)}
      ` : `
        <div class="grid question-template-fields">
          <label>${isMatching ? "左侧输入框" : isFillBlank ? "提示输入框 / 句子" : "选项 / 候选词"}
            <textarea id="question-options" placeholder="${escapeHtml(activeTemplate.optionsHelp)}">${escapeHtml(formatOptionsForEdit(editing))}</textarea>
          </label>
          <label>${isMatching ? "右侧对应框" : activeTemplate.id === "grammar_keyword_match" ? "正确关键词顺序" : "正确答案"}
            <textarea id="question-answer" placeholder="${escapeHtml(activeTemplate.answerHelp)}">${escapeHtml(answerLines.join("\n"))}</textarea>
          </label>
        </div>
      `}
      <div class="row wrap">
        <button data-action="save-question">${editing.id ? "保存题目" : "保存题目"}</button>
        <button class="secondary" data-action="clear-question-form">清空题目表单</button>
      </div>
    </div>
  `;
}

function renderQuestionTable(questions, { pending = false } = {}) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>排序</th><th>题型</th><th>题干</th><th>标签</th><th>操作</th></tr></thead>
        <tbody>
          ${questions.length ? questions.map((question) => `
            <tr>
              <td>${escapeHtml(question.sort_order)}</td>
              <td>${escapeHtml(getQuestionTypeLabel(question.type, question.template_id))}</td>
              <td>${escapeHtml(question.prompt)}</td>
              <td>${escapeHtml([question.skill_tag, question.grammar_tag].filter(Boolean).join(" / "))}</td>
              <td class="row wrap">
                <button class="secondary" data-action="${pending ? "edit-pending-question" : "edit-question"}" data-question="${question.id}">编辑</button>
                <button class="warning" data-action="${pending ? "delete-pending-question" : "delete-question"}" data-question="${question.id}">删除</button>
              </td>
            </tr>
          `).join("") : `<tr><td colspan="5">还没有保存题目。</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function getStudentTaskScore(taskId) {
  return (state.data?.student_task_scores || []).find((item) => (
    item.task_id === taskId &&
    normalizeAnswer(item.class_code) === normalizeAnswer(state.student?.class_code) &&
    normalizeAnswer(item.student_name) === normalizeAnswer(state.student?.student_name)
  ));
}

function taskMeta(task) {
  const practice = task.practice_number ? `第 ${task.practice_number} 次练习` : "练习包";
  const topic = task.topic || "综合练习";
  return `${practice} · ${topic}`;
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "未记录";
  const minutes = Math.floor(value / 60);
  const remaining = Math.round(value % 60);
  if (minutes <= 0) return `${remaining} 秒`;
  return `${minutes} 分 ${String(remaining).padStart(2, "0")} 秒`;
}

function averageNumber(values) {
  const clean = values.map(Number).filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function recalculateReviewedAnswer(data, answerId, isCorrect) {
  const answer = data.student_answers.find((item) => item.id === answerId);
  if (!answer) throw new Error("没有找到这条学生答案。");
  const attempt = data.student_attempts.find((item) => item.id === answer.attempt_id);
  if (!attempt) throw new Error("没有找到这次提交记录。");
  answer.is_correct = Boolean(isCorrect);
  answer.score = answer.is_correct ? 1 : 0;

  const attemptAnswers = data.student_answers.filter((item) => item.attempt_id === attempt.id);
  const scoredAnswers = attemptAnswers.filter((item) => item.is_correct !== null && item.is_correct !== undefined);
  const score = scoredAnswers.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const maxScore = scoredAnswers.length;
  attempt.score = score;
  attempt.max_score = maxScore;
  attempt.accuracy = maxScore ? Math.round((score / maxScore) * 100) : 0;

  const sameAttempts = data.student_attempts
    .filter((item) => (
      item.task_id === attempt.task_id &&
      normalizeAnswer(item.class_code) === normalizeAnswer(attempt.class_code) &&
      normalizeAnswer(item.student_name) === normalizeAnswer(attempt.student_name)
    ))
    .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
  const latestAttempt = sameAttempts[0] || attempt;
  const scoreRow = data.student_task_scores.find((item) => (
    item.task_id === attempt.task_id &&
    normalizeAnswer(item.class_code) === normalizeAnswer(attempt.class_code) &&
    normalizeAnswer(item.student_name) === normalizeAnswer(attempt.student_name)
  ));
  const scorePayload = {
    id: scoreRow?.id || crypto.randomUUID(),
    task_id: attempt.task_id,
    class_code: attempt.class_code,
    student_name: attempt.student_name,
    level: attempt.level,
    latest_score: latestAttempt.score,
    latest_max_score: latestAttempt.max_score,
    latest_accuracy: latestAttempt.accuracy,
    latest_duration_seconds: latestAttempt.duration_seconds || latestAttempt.latest_duration_seconds || null,
    best_score: sameAttempts.reduce((best, item) => Math.max(best, Number(item.score || 0)), 0),
    attempts_count: sameAttempts.length,
    updated_at: new Date().toISOString(),
  };
  if (scoreRow) Object.assign(scoreRow, scorePayload);
  else data.student_task_scores.push(scorePayload);
  return { answer, attempt, scorePayload };
}

function latestAttemptForStudent(attempts, studentName) {
  return attempts
    .filter((attempt) => normalizeAnswer(attempt.student_name) === normalizeAnswer(studentName))
    .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0))[0] || null;
}

function latestAttemptsByStudent(attempts) {
  const names = [...new Set(attempts.map((attempt) => attempt.student_name).filter(Boolean).map(normalizeAnswer))];
  return names
    .map((name) => attempts
      .filter((attempt) => normalizeAnswer(attempt.student_name) === name)
      .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0))[0] || null)
    .filter(Boolean);
}

function latestPublishedTaskForLevel(tasks, levelId) {
  return tasks
    .filter((task) => task.status === "published" && task.level === levelId)
    .sort((a, b) => {
      const dateDiff = new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (dateDiff) return dateDiff;
      return String(b.title || "").localeCompare(String(a.title || ""), "en", { numeric: true, sensitivity: "base" });
    })[0] || null;
}

function latestPublishedTaskIdForLevel(tasks, levelId) {
  return latestPublishedTaskForLevel(tasks, levelId)?.id || "";
}

function demoWrongAnswer(question, correctAnswer) {
  if (question.type === "matching" && correctAnswer && typeof correctAnswer === "object" && !Array.isArray(correctAnswer)) {
    const entries = Object.entries(correctAnswer);
    if (entries.length < 2) return Object.fromEntries(entries.map(([left]) => [left, "Not sure"]));
    const shifted = entries.map(([, right], index) => entries[(index + 1) % entries.length][1]);
    return Object.fromEntries(entries.map(([left], index) => [left, shifted[index]]));
  }
  if (Array.isArray(correctAnswer)) {
    if (question.template_id === "grammar_true_false") return correctAnswer.includes("正确") ? ["错误"] : ["正确"];
    if (correctAnswer.length < 2) return ["错误"];
    return [...correctAnswer].reverse();
  }
  if (question.type === "open_response") return "啊发生的奥德赛阿斯蒂芬";
  if (typeof correctAnswer === "string" && correctAnswer) return `${correctAnswer} 错`;
  return "错误";
}

function demoStudentAnswer(question, variant) {
  const correctAnswer = question.correct_answer;
  if (question.type === "open_response") {
    if (variant % 5 === 0) {
      return {
        type: "audio",
        audio: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
      };
    }
    if (variant % 4 === 0) return "啊发生的奥德赛阿斯蒂芬";
    if (variant % 3 === 0) return "我昨天去了北京，也吃了很多好吃的东西。";
    return "我今天很开心，因为我学习了中文。";
  }
  if (variant % 3 === 0) return demoWrongAnswer(question, correctAnswer);
  if (variant % 4 === 0 && Array.isArray(correctAnswer) && correctAnswer.length > 1) return correctAnswer.slice(0, -1);
  if (correctAnswer && typeof correctAnswer === "object" && !Array.isArray(correctAnswer)) return { ...correctAnswer };
  if (Array.isArray(correctAnswer)) return [...correctAnswer];
  return correctAnswer || "正确";
}

function upsertDemoStudent(data, classRow, studentName, gender) {
  const existing = data.class_students.find((student) => (
    student.class_id === classRow.id &&
    normalizeAnswer(student.student_name) === normalizeAnswer(studentName)
  ));
  const payload = {
    class_id: classRow.id,
    student_name: studentName,
    gender,
    access_code: buildAccessCode(classRow.class_code, studentName),
    active: true,
  };
  if (existing) {
    Object.assign(existing, payload);
    return existing;
  }
  const student = { id: crypto.randomUUID(), ...payload };
  data.class_students.push(student);
  return student;
}

function upsertDemoScore(data, attempt) {
  const sameAttempts = data.student_attempts
    .filter((item) => (
      item.task_id === attempt.task_id &&
      normalizeAnswer(item.class_code) === normalizeAnswer(attempt.class_code) &&
      normalizeAnswer(item.student_name) === normalizeAnswer(attempt.student_name)
    ))
    .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
  const latestAttempt = sameAttempts[0] || attempt;
  const scoreRow = data.student_task_scores.find((item) => (
    item.task_id === attempt.task_id &&
    normalizeAnswer(item.class_code) === normalizeAnswer(attempt.class_code) &&
    normalizeAnswer(item.student_name) === normalizeAnswer(attempt.student_name)
  ));
  const scorePayload = {
    id: scoreRow?.id || crypto.randomUUID(),
    task_id: attempt.task_id,
    class_code: attempt.class_code,
    student_name: attempt.student_name,
    level: attempt.level,
    latest_score: latestAttempt.score,
    latest_max_score: latestAttempt.max_score,
    latest_accuracy: latestAttempt.accuracy,
    latest_duration_seconds: latestAttempt.duration_seconds || null,
    best_score: sameAttempts.reduce((best, item) => Math.max(best, Number(item.score || 0)), 0),
    attempts_count: sameAttempts.length,
    updated_at: latestAttempt.submitted_at || new Date().toISOString(),
  };
  if (scoreRow) Object.assign(scoreRow, scorePayload);
  else data.student_task_scores.push(scorePayload);
}

function seedDiverseLocalAttempts() {
  const data = loadLocalData();
  data.student_attempts = data.student_attempts || [];
  data.student_answers = data.student_answers || [];
  data.student_task_scores = data.student_task_scores || [];
  const demoNames = [
    ["Mia", "Female"],
    ["Leo", "Male"],
    ["Anna", "Female"],
    ["小林", "女"],
    ["Noah", "Male"],
    ["Lina", "Female"],
  ];
  let attemptCount = 0;
  let answerCount = 0;
  const now = Date.now();
  (data.classes || []).forEach((classRow, classIndex) => {
    const classLevel = levelForClassCode(classRow.class_code);
    const classTasks = sortTasksByTitle((data.tasks || []).filter((task) => task.level === classLevel && task.status === "published")).slice(0, 2);
    if (!classTasks.length) return;
    const students = demoNames.slice(0, 3).map(([name, gender], index) => (
      upsertDemoStudent(data, classRow, `${name}${classGroupKey(classRow.class_code)}${index + 1}`, gender)
    ));
    classTasks.forEach((task, taskIndex) => {
      const questions = (data.questions || [])
        .filter((question) => question.task_id === task.id)
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
      if (!questions.length) return;
      students.forEach((student, studentIndex) => {
        const submittedAt = new Date(now - ((classIndex * 12 + taskIndex * 4 + studentIndex) * 7 * 60 * 1000)).toISOString();
        const answers = questions.map((question, questionIndex) => {
          const studentAnswer = demoStudentAnswer(question, classIndex + taskIndex + studentIndex + questionIndex);
          const result = evaluate(question, studentAnswer);
          return {
            id: crypto.randomUUID(),
            question_id: question.id,
            question_type: question.type,
            student_answer: studentAnswer,
            is_correct: result.isCorrect,
            score: result.score,
          };
        });
        const objectiveRows = answers.filter((row) => row.is_correct !== null);
        const score = objectiveRows.reduce((sum, row) => sum + Number(row.score || 0), 0);
        const maxScore = objectiveRows.length;
        const attempt = {
          id: crypto.randomUUID(),
          task_id: task.id,
          class_code: classRow.class_code,
          student_name: student.student_name,
          level: task.level,
          score,
          max_score: maxScore,
          accuracy: maxScore ? Math.round((score / maxScore) * 100) : 0,
          completed_count: answers.filter((row) => row.student_answer !== null && row.student_answer !== undefined && row.student_answer !== "").length,
          total_count: questions.length,
          duration_seconds: 95 + ((classIndex + taskIndex + studentIndex) * 37),
          submitted_at: submittedAt,
        };
        data.student_attempts.push(attempt);
        answers.forEach((answer) => {
          data.student_answers.push({ ...answer, attempt_id: attempt.id });
        });
        upsertDemoScore(data, attempt);
        attemptCount += 1;
        answerCount += answers.length;
      });
    });
  });
  saveLocalData(data);
  state.data = data;
  return { attemptCount, answerCount };
}

function averageAccuracyForTask(attempts, taskId, classCodes) {
  const codeSet = new Set(classCodes.map((code) => normalizeAnswer(code)).filter(Boolean));
  const rows = attempts.filter((attempt) => (
    attempt.task_id === taskId &&
    codeSet.has(normalizeAnswer(attempt.class_code))
  ));
  const latest = latestAttemptsByStudent(rows);
  return averageNumber(latest.map((attempt) => attempt.accuracy));
}

function formatAccuracy(value) {
  return value === null || value === undefined ? "暂无" : `${value}%`;
}

function commonErrorTags(questionStats) {
  return questionStats
    .map((item) => ({
      ...item,
      wrong: Math.max(0, Number(item.total || 0) - Number(item.correct || 0)),
    }))
    .filter((item) => item.wrong > 0)
    .sort((a, b) => {
      if (b.wrong !== a.wrong) return b.wrong - a.wrong;
      return a.rate - b.rate;
    })
    .slice(0, 3)
    .map((item) => {
      const tags = [item.question.skill_tag, item.question.grammar_tag]
        .map((tag) => String(tag || "").trim())
        .filter(Boolean);
      return tags.length ? `${tags.join(" / ")}（错${item.wrong}）` : "";
    })
    .filter(Boolean);
}

function analyticsForClassTask(task, classRow, attempts, answers, questions) {
  if (!task || !classRow) return null;
  const taskAttempts = attempts.filter((attempt) => (
    attempt.task_id === task.id &&
    normalizeAnswer(attempt.class_code) === normalizeAnswer(classRow.class_code)
  ));
  const taskAttemptIds = new Set(taskAttempts.map((attempt) => attempt.id));
  const taskAnswers = answers.filter((answer) => taskAttemptIds.has(answer.attempt_id));
  const taskQuestions = questions.filter((question) => question.task_id === task.id);
  const questionStats = taskQuestions.map((question) => {
    const rows = taskAnswers.filter((answer) => answer.question_id === question.id && answer.is_correct !== null);
    const correct = rows.filter((answer) => answer.is_correct).length;
    return {
      question,
      total: rows.length,
      correct,
      rate: rows.length ? Math.round((correct / rows.length) * 100) : 0,
    };
  });
  const latestByStudent = latestAttemptsByStudent(taskAttempts);
  return {
    task,
    taskAttempts,
    taskAnswers,
    taskQuestions,
    questionStats,
    latestByStudent,
    averageAccuracy: averageNumber(latestByStudent.map((attempt) => attempt.accuracy)),
  };
}

function classStatusSummary(averageAccuracy, latestByStudent) {
  if (averageAccuracy === null || averageAccuracy === undefined) {
    return { label: "暂无数据", text: "最新任务还没有提交记录。" };
  }
  const rates = latestByStudent.map((attempt) => Number(attempt.accuracy)).filter((rate) => Number.isFinite(rate));
  const spread = rates.length ? Math.max(...rates) - Math.min(...rates) : 0;
  if (averageAccuracy > 85 && spread <= 20) {
    return { label: "整体稳定", text: `整体准确率 ${averageAccuracy}%，学生成绩差异不大。` };
  }
  if (averageAccuracy > 85) {
    return { label: "整体不错", text: `整体准确率 ${averageAccuracy}%，但学生个体差异较大。` };
  }
  if (averageAccuracy >= 65) {
    return { label: "需要复习", text: `整体准确率 ${averageAccuracy}%，学生个体差异一般。` };
  }
  return { label: "重点关注", text: `整体准确率 ${averageAccuracy}%，学生个体差异较大。` };
}

function truncateText(value, max = 30) {
  const text = String(value || "").trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function renderSummaryList(items, emptyText) {
  if (!items.length) return `<strong class="summary-empty">${escapeHtml(emptyText)}</strong>`;
  return `
    <ol class="summary-list">
      ${items.map((item, index) => `
        <li>
          <span>${index + 1}</span>
          <strong>${escapeHtml(item)}</strong>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderAnalyticsSummary(summary) {
  if (!summary) {
    return `<div class="analytics-summary notice">暂无可分析的最新任务。</div>`;
  }
  const weakQuestions = summary.questionStats
    .filter((item) => item.total > 0)
    .sort((a, b) => (a.rate - b.rate) || (b.total - a.total))
    .slice(0, 3);
  const weakStudents = summary.latestByStudent
    .slice()
    .sort((a, b) => Number(a.accuracy || 0) - Number(b.accuracy || 0))
    .slice(0, 3);
  const tags = commonErrorTags(summary.questionStats);
  const status = classStatusSummary(summary.averageAccuracy, summary.latestByStudent);
  const weakQuestionItems = weakQuestions.map((item) => `${truncateText(item.question.prompt, 24)}（${item.rate}%）`);
  const weakStudentItems = weakStudents.map((attempt) => `${attempt.student_name}（${attempt.accuracy}%）`);
  const tagItems = tags.map((tag) => truncateText(tag, 24));
  return `
    <section class="analytics-summary">
      <div class="analytics-summary__head">
        <span class="pill">最新任务摘要</span>
        <strong>${escapeHtml(summary.task.title || "未命名任务")}</strong>
      </div>
      <div class="analytics-summary__grid">
        <div class="summary-card">
          <span>最需要关注的题目</span>
          ${renderSummaryList(weakQuestionItems, "暂无错题数据")}
        </div>
        <div class="summary-card">
          <span>最需要关注的学生</span>
          ${renderSummaryList(weakStudentItems, "暂无提交")}
        </div>
        <div class="summary-card">
          <span>建议复习标签</span>
          ${renderSummaryList(tagItems, "暂无")}
        </div>
        <div class="summary-card status-card">
          <span>本班状态</span>
          <strong>${escapeHtml(status.label)}</strong>
          <small>${escapeHtml(status.text)}</small>
        </div>
      </div>
    </section>
  `;
}

function renderAnalyticsTaskDetail({
  activeTask,
  activeClass,
  activeClassStudents,
  taskAttempts,
  taskQuestions,
  questionStats,
  selectedAttempt,
  selectedAnswers,
}) {
  if (!activeTask || !activeClass) return "";
  const latestByStudent = latestAttemptsByStudent(taskAttempts);
  const classAverageAccuracy = averageNumber(latestByStudent.map((attempt) => attempt.accuracy));
  const classAverageDuration = averageNumber(latestByStudent.map((attempt) => attempt.duration_seconds || attempt.latest_duration_seconds).filter(Boolean));
  const weakQuestionCount = questionStats.filter((item) => item.total && item.rate < 50).length;
  const tags = commonErrorTags(questionStats);
  const participantNames = [...new Set(taskAttempts.map((attempt) => attempt.student_name).filter(Boolean))];
  const studentRows = participantNames.map((studentName) => {
    const student = activeClassStudents.find((item) => normalizeAnswer(item.student_name) === normalizeAnswer(studentName)) || { student_name: studentName };
    const studentAttempts = taskAttempts.filter((attempt) => normalizeAnswer(attempt.student_name) === normalizeAnswer(studentName));
    const latestAttempt = latestAttemptForStudent(taskAttempts, studentName);
    return { student, studentAttempts, latestAttempt };
  }).sort((a, b) => {
    if (state.analyticsStudentSort === "accuracy") {
      const aRate = a.latestAttempt ? Number(a.latestAttempt.accuracy || 0) : -1;
      const bRate = b.latestAttempt ? Number(b.latestAttempt.accuracy || 0) : -1;
      if (bRate !== aRate) return bRate - aRate;
    }
    return String(a.student.student_name || "").localeCompare(String(b.student.student_name || ""), "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base",
    });
  });
  return `
    <div class="analytics-task-detail stack">
      <div class="metric-row task-metrics">
        <div class="metric"><span class="muted">班级准确率</span><strong>${classAverageAccuracy === null ? "暂无" : `${classAverageAccuracy}%`}</strong></div>
        <div class="metric"><span class="muted">平均用时</span><strong>${classAverageDuration === null ? "暂无" : formatDuration(classAverageDuration)}</strong></div>
        <div class="metric"><span class="muted">未掌握内容</span><strong>${weakQuestionCount}</strong></div>
        <div class="metric error-tag-metric"><span class="muted">常见错误点</span><strong>${escapeHtml(tags.length ? tags.join("；") : "暂无")}</strong></div>
      </div>
      <div class="analytics-table-head">
        <h3>学生完成记录 / 最近得分</h3>
        <div class="segmented-control" aria-label="学生排序">
          <button class="secondary compact ${state.analyticsStudentSort === "name" ? "active" : ""}" data-action="sort-analytics-students" data-sort="name">按姓名排序</button>
          <button class="secondary compact ${state.analyticsStudentSort === "accuracy" ? "active" : ""}" data-action="sort-analytics-students" data-sort="accuracy">按准确率排序</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>学生</th><th>最近成绩</th><th>正确率</th><th>提交次数</th><th>答题用时</th><th>更新时间</th><th>查看详情</th></tr></thead>
          <tbody>
            ${studentRows.length ? studentRows.map(({ student, studentAttempts, latestAttempt }) => {
              const isSelectedStudent = normalizeAnswer(state.analyticsStudentName) === normalizeAnswer(student.student_name);
              return `
                <tr>
                  <td>${escapeHtml(student.student_name)}</td>
                  <td>${latestAttempt ? `${escapeHtml(latestAttempt.score)} / ${escapeHtml(latestAttempt.max_score)}` : "暂无"}</td>
                  <td>${latestAttempt ? accuracyText(latestAttempt.accuracy) : "暂无"}</td>
                  <td>${studentAttempts.length}</td>
                  <td>${latestAttempt ? formatDuration(latestAttempt.duration_seconds || latestAttempt.latest_duration_seconds) : "未完成"}</td>
                  <td>${latestAttempt?.submitted_at ? new Date(latestAttempt.submitted_at).toLocaleString() : "暂无"}</td>
                  <td><button class="secondary compact" data-action="select-analytics-student" data-student="${escapeHtml(student.student_name)}">${isSelectedStudent ? "收起 / Hide" : "查看 / View"}</button></td>
                </tr>
              `;
            }).join("") : `<tr><td colspan="7">当前任务还没有学生提交。</td></tr>`}
          </tbody>
        </table>
      </div>
      ${selectedAttempt ? `
        <div class="student-detail stack">
          <div class="row wrap">
            <h3 style="flex: 1">${escapeHtml(state.analyticsStudentName)} 的做题详情</h3>
            <span class="pill">${escapeHtml(selectedAttempt.score)} / ${escapeHtml(selectedAttempt.max_score)} · ${escapeHtml(selectedAttempt.accuracy)}%</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>题目</th><th>题型</th><th>学生答案</th><th>结果</th><th>${renderTeacherReviewHeader()}</th></tr></thead>
              <tbody>
                ${taskQuestions.map((question) => {
                  const row = selectedAnswers.find((answer) => answer.question_id === question.id);
                  const isWrong = row && row.is_correct === false;
                  return `
                    <tr class="${isWrong ? "answer-wrong" : ""}">
                      <td>${escapeHtml(question.prompt)}</td>
                      <td>${escapeHtml(question.type)}</td>
                      <td>${renderTeacherAnswerValue(row?.student_answer, question)}${renderTeacherAnswerReviewHint(question, row)}</td>
                      <td>${answerResultLabel(question, row)}</td>
                      <td>${renderTeacherReviewControls(row)}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      ` : ""}
      <h3>班级准确率/错题追踪</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>题目</th><th>题型</th><th>作答</th><th>正确率</th></tr></thead>
          <tbody>
            ${questionStats.length ? questionStats.map((item) => `
              <tr>
                <td>${escapeHtml(item.question.prompt)}</td>
                <td>${escapeHtml(item.question.type)}</td>
                <td>${item.correct}/${item.total}</td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-bar" aria-label="正确率 ${item.rate}%">
                      <span style="width: ${item.rate}%"></span>
                    </div>
                    ${accuracyText(item.rate)}
                  </div>
                </td>
              </tr>
            `).join("") : `<tr><td colspan="4">这个任务包还没有答题记录。</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="row wrap">
        <h3 style="flex: 1">提交历史</h3>
        <button class="warning compact" data-action="clear-task-history" data-task="${activeTask.id}" data-class-code="${escapeHtml(activeClass.class_code)}">清空历史记录 / Clear history</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>时间</th><th>学生</th><th>得分</th><th>正确率</th><th>答题用时</th></tr></thead>
          <tbody>
            ${taskAttempts.length ? taskAttempts.map((attempt) => `
              <tr>
                <td>${escapeHtml(attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "暂无")}</td>
                <td>${escapeHtml(attempt.student_name)}</td>
                <td>${escapeHtml(attempt.score)} / ${escapeHtml(attempt.max_score)}</td>
                <td>${accuracyText(attempt.accuracy)}</td>
                <td>${formatDuration(attempt.duration_seconds)}</td>
              </tr>
            `).join("") : `<tr><td colspan="5">这个任务包还没有提交记录。</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

const PINYIN_MAP = {
  水: "shuǐ",
  山: "shān",
  朋友: "péng you",
  我: "wǒ",
  喜欢: "xǐ huan",
  打: "dǎ",
  篮球: "lán qiú",
  看: "kàn",
  书: "shū",
  今天: "jīn tiān",
  很: "hěn",
  高兴: "gāo xìng",
  学生: "xué sheng",
  中文: "zhōng wén",
};

function pinyinFor(value) {
  const text = String(value || "").trim();
  return PINYIN_MAP[text] || "";
}

function accuracyClass(value) {
  const rate = Number(value || 0);
  if (rate < 40) return "accuracy-low";
  if (rate <= 60) return "accuracy-mid";
  return "accuracy-ok";
}

function accuracyText(value) {
  const rate = Number(value || 0);
  return `<span class="accuracy-value ${accuracyClass(rate)}">${escapeHtml(rate)}%</span>`;
}

function hanziWithPinyin(text, pinyin) {
  const reading = pinyin || pinyinFor(text);
  if (!reading) return escapeHtml(text);
  return `
    <span class="hanzi-reading">
      <span class="hanzi-reading__pinyin">${escapeHtml(reading)}</span>
      <span class="hanzi-reading__hanzi">${escapeHtml(text)}</span>
    </span>
  `;
}

function setMessage(message) {
  state.message = cleanMessage(message);
}

function cleanMessage(message) {
  const text = String(message || "");
  if (!text) return "";
  if (text.includes("Cannot read properties of null")) return "";
  if (text.includes("Cannot read property")) return "";
  if (text.includes("reading 'value'")) return "";
  return text;
}

async function run(action) {
  state.loading = true;
  setMessage("");
  render();
  try {
    await action();
  } catch (error) {
    setMessage(error.message || String(error));
  } finally {
    state.loading = false;
    render();
  }
}

function go(view, extra = {}) {
  Object.assign(state, extra, { view });
  render();
}

function taskDraftFromTask(task = null) {
  return {
    title: task?.title || "",
    topic: task?.topic || "",
    description: task?.description || "",
  };
}

function currentTaskDraft() {
  const task = state.editingTaskId ? getTask(state.editingTaskId) : null;
  if (!state.taskDraft) state.taskDraft = taskDraftFromTask(task);
  return state.taskDraft;
}

function syncTaskDraft() {
  const title = document.querySelector("#task-title");
  const topic = document.querySelector("#task-topic");
  const description = document.querySelector("#task-description");
  if (!title && !topic && !description) return;
  state.taskDraft = {
    title: title?.value || "",
    topic: topic?.value || "",
    description: description?.value || "",
  };
}

function retakeCurrentTask() {
  if (!state.selectedTaskId) return;
  go("practice", {
    activeQuestion: 0,
    answers: {},
    feedback: {},
    summary: null,
    practiceStartedAt: Date.now(),
  });
}

function layout(content) {
  const teacherLabel = state.teacher ? `<span class="pill">${escapeHtml(state.teacher.email || "Teacher")}</span>` : "";
  return `
    <main class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark" aria-label="分层诊断">
            <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
              <rect class="brand-mark__paper" x="5" y="5" width="38" height="38" rx="10" />
              <path class="brand-mark__fold" d="M31 5h2.5c5.2 0 9.5 4.3 9.5 9.5V17L31 5Z" />
              <circle class="brand-mark__seal" cx="18" cy="18" r="8" />
              <text class="brand-mark__han" x="18" y="22">汉</text>
              <path class="brand-mark__step" d="M14 34h6v-5h6v-5h6v-5h5" />
              <path class="brand-mark__check" d="M30 33l3 3 6-7" />
            </svg>
          </div>
          <div>
            <div class="brand-title">分层练习与诊断</div>
            <div class="brand-subtitle muted">Tiered Practice & Diagnostic</div>
          </div>
        </div>
        <nav class="nav">
          ${teacherLabel}
          <button class="secondary" data-action="home">学生首页</button>
          <button class="secondary" data-action="teacher">老师后台</button>
        </nav>
      </header>
      ${state.message ? `<div class="notice error">${escapeHtml(state.message)}</div>` : ""}
      ${content}
    </main>
  `;
}

function renderHome() {
  const localMode = isLocalPreview() && !getSupabase();
  return layout(`
    <section class="student-login-page">
      <div class="student-login-scene" aria-hidden="true">
        <div class="login-orbit login-orbit--one">声调</div>
        <div class="login-orbit login-orbit--two">汉字</div>
        <div class="login-orbit login-orbit--three">表达</div>
      </div>
      <section class="student-login-card">
        <div class="student-login-brand">
          <span class="login-kicker">${localMode ? "Local Preview" : "Student Entry"}</span>
          <h1>轻松开始中文练习</h1>
          <p>输入班级 code 和姓名，系统会带你进入合适的任务包。Use your class code and name to start your Chinese practice.</p>
        </div>
        <div class="student-login-form">
          <div class="student-login-form__title">
            <h2>学生登录</h2>
            <span>Student Login</span>
          </div>
          <label>班级 code / Class code
            <input id="student-login-class-code" value="${escapeHtml(state.student?.class_code || "")}" placeholder="例如 G5E" autocomplete="off" />
          </label>
          <label>学生姓名 / Name
            <input id="student-login-name" value="${escapeHtml(state.student?.student_name || "")}" placeholder="例如 Kevin" autocomplete="off" />
          </label>
          ${localMode ? `<p class="local-login-hint">本地测试：班级 code 输入 G5 / G6 / G7 可直接进入对应 Level。正式版本不会启用。</p>` : ""}
          <button data-action="student-login">进入练习 / Start</button>
        </div>
      </section>
    </section>
  `);
}

function renderLevelSelect() {
  return renderTaskList();
}

function renderStudentEntry() {
  return state.student ? renderLevelSelect() : renderHome();
}

function renderTaskList() {
  const classRow = state.data.classes.find((item) => item.id === state.student.class_id) || {
    id: state.student.class_id,
    class_code: state.student.class_code,
    name: state.student.class_name,
  };
  const tasks = sortTasksForStudent(state.data.tasks.filter((task) => task.level === state.level && task.status === "published"));
  const level = getLevel(state.level);
  const latestTaskId = latestPublishedTaskIdForLevel(state.data.tasks, state.level);
  return layout(`
    <section class="view">
      <div class="panel row wrap student-task-header">
        <div class="student-task-header__text">
          <span class="pill">${escapeHtml(classRow.name)} · ${escapeHtml(level.zh)}</span>
          <h2>${escapeHtml(state.student.student_name)} 的任务包 / Tasks</h2>
        </div>
      </div>
      <div class="task-list-grid">
        ${tasks.length ? tasks.map((task, index) => {
          const score = getStudentTaskScore(task.id);
          const isLatest = task.id === latestTaskId;
          return `
            <article class="card student-task-card">
              <div class="student-task-card__badges">
                ${isLatest ? `<span class="pill task-badge latest">Latest task</span>` : ""}
                <span class="pill task-badge ${score ? "complete" : "incomplete"}">${score ? "Completed" : "Incomplete"}</span>
              </div>
              <div class="row wrap student-task-card__meta">
                <span class="pill">${escapeHtml(taskMeta(task))}</span>
              </div>
              <h2>${escapeHtml(task.title)}</h2>
              <div class="student-task-card__footer">
                <span class="pill">${getQuestions(task.id).length} 道题</span>
                ${score ? `<span class="pill">最近 ${score.latest_score}/${score.latest_max_score} · ${score.latest_accuracy}%</span>` : `<span class="pill">尚未完成</span>`}
                <button data-action="open-task" data-task="${task.id}">${score ? "再次练习 / Try again" : "开始练习 / Start"}</button>
              </div>
            </article>
          `;
        }).join("") : `<div class="panel muted">这个班级下暂时没有已发布任务。</div>`}
      </div>
    </section>
  `);
}

function renderQuestion(question) {
  const answer = state.answers[question.id];
  const locked = Boolean(state.feedback[question.id]);
  if (question.template_id === "grammar_keyword_match") {
    const selected = Array.isArray(answer) ? answer : [];
    const blanks = Array.isArray(question.correct_answer) ? question.correct_answer.length : 1;
    const sentence = typeof question.options === "object" && !Array.isArray(question.options) ? question.options.sentence : "";
    const candidates = typeof question.options === "object" && !Array.isArray(question.options)
      ? question.options.candidates || []
      : question.options || [];
    const shuffledCandidates = stableShuffle(candidates, question.id);
    return `
      ${sentence ? `<div class="notice">${escapeHtml(sentence)}</div>` : ""}
      <div class="stack">
        ${Array.from({ length: blanks }).map((_, index) => `
          <select data-keyword-select="${question.id}" data-index="${index}" ${locked ? "disabled" : ""}>
            <option value="">选择关键词</option>
            ${shuffledCandidates.map((word) => `<option value="${escapeHtml(word)}" ${selected[index] === word ? "selected" : ""}>${escapeHtml(word)}</option>`).join("")}
          </select>
        `).join("")}
      </div>
    `;
  }
  if (question.template_id === "grammar_true_false" && Array.isArray(question.correct_answer)) {
    const selected = Array.isArray(answer) ? answer : [];
    return `
      <div class="stack">
        ${(question.options || []).map((sentence, index) => `
          <div class="sentence-judge-row">
            <strong>${escapeHtml(sentence)}</strong>
            <div class="choice-list compact-choice-list">
              ${["正确", "错误"].map((option) => `
                <button class="choice ${selected[index] === option ? "selected" : ""}" data-action="set-judge-answer" data-question="${question.id}" data-index="${index}" data-value="${escapeHtml(option)}" ${locked ? "disabled" : ""}>${escapeHtml(displayAnswerValue(option))}</button>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
  if (question.type === "multiple_choice") {
    const shuffledOptions = stableShuffle(question.options || [], `${question.id}:multiple-choice`);
    return `
      <div class="choice-list">
        ${shuffledOptions.map((option) => `
          <button class="choice ${answer === option ? "selected" : ""}" data-action="set-answer" data-question="${question.id}" data-value="${escapeHtml(option)}" ${locked ? "disabled" : ""}>${escapeHtml(option)}</button>
        `).join("")}
      </div>
    `;
  }
  if (question.type === "multi_select") {
    const selected = Array.isArray(answer) ? answer : [];
    const shuffledOptions = stableShuffle(question.options || [], `${question.id}:multi-select`);
    return `
      <div class="choice-list">
        ${shuffledOptions.map((option) => `
          <button class="choice ${selected.includes(option) ? "selected" : ""}" data-action="toggle-multi-answer" data-question="${question.id}" data-value="${escapeHtml(option)}" ${locked ? "disabled" : ""}>${escapeHtml(option)}</button>
        `).join("")}
      </div>
    `;
  }
  if (question.type === "fill_blank") {
    if (Array.isArray(question.correct_answer)) {
      const selected = Array.isArray(answer) ? answer : [];
      const blanks = Array.isArray(question.correct_answer) ? question.correct_answer.length : 1;
      return `
        ${(question.options || []).length ? `<div class="cue-list">${(question.options || []).map((cue) => `<span class="pill">${escapeHtml(cue)}</span>`).join("")}</div>` : ""}
        <div class="stack">
          ${Array.from({ length: blanks }).map((_, index) => `
            <input data-blank-input="${question.id}" data-index="${index}" value="${escapeHtml(selected[index] || "")}" placeholder="第 ${index + 1} 空" ${locked ? "disabled" : ""} />
          `).join("")}
        </div>
      `;
    }
    return `
      ${(question.options || []).length ? `
        <div class="cue-list">
          ${(question.options || []).map((cue) => `<span class="pill">${escapeHtml(cue)}</span>`).join("")}
        </div>
      ` : ""}
      <input data-answer-input="${question.id}" value="${escapeHtml(answer || "")}" placeholder="请输入答案" ${locked ? "disabled" : ""} />
    `;
  }
  if (question.type === "sentence_ordering" || question.type === "sentence_building") {
    const chosen = Array.isArray(answer) ? answer : [];
    const chosenIndexes = new Set(chosen.map((item) => typeof item === "object" ? item.index : null));
    const promptText = typeof question.options === "object" && !Array.isArray(question.options) ? question.options.prompt || "" : "";
    const candidates = typeof question.options === "object" && !Array.isArray(question.options) ? question.options.candidates || [] : question.options || [];
    const shuffledWords = stableShuffle(
      candidates.map((word, index) => ({ word, index })),
      `${question.id}:word-bank`,
      (item) => `${item.word}:${item.index}`,
    );
    return `
      ${promptText ? `<div class="notice">${escapeHtml(promptText)}</div>` : ""}
      <div class="word-bank">
        ${shuffledWords.map((item) => {
          const used = chosenIndexes.has(item.index);
          return `
            <button class="word ${used ? "selected" : ""}" data-action="add-word" data-question="${question.id}" data-word="${escapeHtml(item.word)}" data-index="${item.index}" ${used || locked ? "disabled" : ""}>${escapeHtml(item.word)}</button>
          `;
        }).join("")}
      </div>
      <div class="sentence-answer-box">
        <div class="sentence-answer-box__label">当前句子 / Current sentence</div>
        <div class="sentence-answer-box__content">
          ${chosen.length ? `
            <div class="sentence-answer-words">
              ${chosen.map((item) => `<span>${escapeHtml(typeof item === "object" ? item.word : item)}</span>`).join("")}
            </div>
          ` : `<span class="sentence-answer-placeholder">请选择词语组成句子</span>`}
        </div>
      </div>
      ${locked ? "" : `<button class="secondary" data-action="clear-words" data-question="${question.id}">清空重排</button>`}
    `;
  }
  if (question.type === "matching") {
    const pairs = question.options || [];
    const current = answer || {};
    const rights = pairs.map((pair) => pair.right);
    const rightEntries = stableShuffle(
      rights.map((right, index) => ({ right, label: imageOptionLabel(right, index) })),
      `${question.id}:matching-right`,
      (item) => `${item.right}:${item.label}`,
    );
    return `
      <div class="match-board">
        <div class="stack">
          ${pairs.map((pair) => `
            <div class="drop-row" data-drop-left="${escapeHtml(pair.left)}">
              <strong>${hanziWithPinyin(pair.left, pair.pinyin)}</strong>
              <select data-match-select="${question.id}" data-left="${escapeHtml(pair.left)}" ${locked ? "disabled" : ""}>
                <option value="">选择 / 拖拽</option>
                ${rightEntries.map(({ right, label }) => {
                  const selectedByCurrent = current[pair.left] === right;
                  const usedByOther = Object.entries(current).some(([left, value]) => left !== pair.left && value === right);
                  return `<option value="${escapeHtml(right)}" ${selectedByCurrent ? "selected" : ""} ${usedByOther ? "disabled" : ""}>${escapeHtml(label)}</option>`;
                }).join("")}
              </select>
            </div>
          `).join("")}
        </div>
        <div class="stack">
          ${rightEntries.map(({ right, label }) => {
            const used = Object.values(current).some((value) => value === right);
            return `
              <div class="drag-chip ${isImageValue(right) ? "image" : ""} ${used || locked ? "disabled" : ""}" draggable="${used || locked ? "false" : "true"}" aria-disabled="${used || locked ? "true" : "false"}" data-drag-value="${escapeHtml(right)}">
                ${renderImageThumb(right, label)}
                <span>${escapeHtml(label)}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }
  if (isExpressionTemplate(question.template_id)) {
    const options = getExpressionOptions(question);
    const answerMode = options.answerMode || expressionModes(question.template_id).answerMode;
    const audioAnswer = answer && typeof answer === "object" ? answer.audio || "" : "";
    return `
      <div class="expression-practice stack">
        ${options.prompt ? `<div class="notice">${escapeHtml(options.prompt)}</div>` : ""}
        ${options.audio ? renderAudioPlayer(options.audio, "老师问题录音") : ""}
        ${answerMode === "audio" ? `
          <div class="row wrap">
            ${renderRecordControl("student-answer", question.id, audioAnswer ? "重新录音回答" : "录音回答", { disabled: locked })}
          </div>
          ${renderAudioPlayer(audioAnswer, "你的录音回答")}
        ` : `
          <textarea data-answer-input="${question.id}" placeholder="请输入你的中文回答" ${locked ? "disabled" : ""}>${escapeHtml(answer || "")}</textarea>
        `}
      </div>
    `;
  }
  return `<textarea data-answer-input="${question.id}" placeholder="请输入你的回答" ${locked ? "disabled" : ""}>${escapeHtml(answer || "")}</textarea>`;
}

function renderPractice() {
  const task = getTask(state.selectedTaskId);
  const questions = getQuestions(task.id);
  const question = questions[state.activeQuestion];
  const feedback = state.feedback[question?.id];
  const needsFeedback = question ? currentQuestionNeedsFeedback(question) : false;
  const isLastQuestion = state.activeQuestion >= questions.length - 1;
  const forwardLabel = isLastQuestion
    ? (needsFeedback ? "检查本题 / Check" : "提交练习 / Submit")
    : (needsFeedback ? "检查本题 / Check" : "下一题 / Next");
  return layout(`
    <section class="view">
      <div class="panel row wrap">
        <div style="flex: 1">
          <span class="pill">${state.activeQuestion + 1} / ${questions.length}</span>
          <h2>${escapeHtml(task.title)}</h2>
          <p class="muted">${escapeHtml(taskMeta(task))}</p>
        </div>
        <button class="secondary" data-action="task-list">返回任务列表 / Back</button>
      </div>
      <article class="panel question">
        <span class="pill">${escapeHtml(QUESTION_TYPES.find(([id]) => id === question.type)?.[1] || question.type)}</span>
        <h2>${escapeHtml(question.prompt)}</h2>
        ${renderQuestion(question)}
        ${feedback ? `<div class="feedback ${feedback.correct === true ? "correct" : feedback.correct === false ? "incorrect" : ""}">${escapeHtml(studentFeedbackText(feedback.text))}</div>` : ""}
        <div class="row wrap">
          <button class="secondary" data-action="prev-question" ${state.activeQuestion === 0 ? "disabled" : ""}>上一题 / Previous</button>
          ${state.activeQuestion < questions.length - 1
            ? `<button data-action="next-question">${forwardLabel}</button>`
            : `<button data-action="submit-task">${forwardLabel}</button>`}
        </div>
      </article>
    </section>
  `);
}

function renderSummary() {
  const summary = state.summary;
  const task = getTask(state.selectedTaskId);
  const scoreText = summary.maxScore ? `${summary.score}/${summary.maxScore}` : summary.openCount ? "Awaiting review" : "0/0";
  const accuracyTextValue = summary.maxScore ? `${summary.accuracy}%` : summary.openCount ? "Pending" : "0%";
  return layout(`
    <section class="view">
      <div class="panel row wrap">
        <div style="flex: 1">
          <span class="pill live">完成</span>
          <h2>完成总结 / Completion Summary</h2>
          <p class="muted">${escapeHtml(task?.title || "")} · ${escapeHtml(task ? taskMeta(task) : "")}</p>
        </div>
        <button data-action="retake-task">再次练习 / Try again</button>
        <button class="secondary" data-action="task-list">返回任务列表 / Back</button>
      </div>
      <div class="grid">
        <div class="card"><span class="muted">Score</span><div class="result-number">${escapeHtml(scoreText)}</div></div>
        <div class="card"><span class="muted">Accuracy</span><div class="result-number">${escapeHtml(accuracyTextValue)}</div></div>
        <div class="card"><span class="muted">Completed</span><div class="result-number">${summary.completed}/${summary.total}</div></div>
      </div>
      ${summary.openCount ? `<div class="notice">Open-response answers are waiting for teacher review and are not included in the automatic score yet.</div>` : ""}
    </section>
  `);
}

function renderConfig() {
  return layout(`
    <section class="panel stack">
      <h2>系统设置</h2>
      <p class="muted">Supabase 连接属于网站基础配置，只在老师后台维护。正式部署时建议写入环境配置或固定在代码中，平时不需要频繁修改。</p>
      <label>Supabase URL
        <input id="config-url" value="${escapeHtml(state.config.url)}" placeholder="https://xxxx.supabase.co" />
      </label>
      <label>Anon / public key
        <textarea id="config-key" placeholder="eyJ...">${escapeHtml(state.config.anonKey)}</textarea>
      </label>
      <div class="row wrap">
        <button data-action="save-config">保存设置</button>
        <button class="secondary" data-action="teacher">返回后台</button>
      </div>
    </section>
  `);
}

function renderTeacherLogin() {
  return layout(`
    <section class="panel stack">
      <h2>老师登录 / Teacher Login</h2>
      <p class="muted">配置 Supabase 后使用老师邮箱和密码登录。未配置时可用任意邮箱或 teacher + 任意密码进入本地演示。</p>
      <div class="grid">
        <label>邮箱 / Email
          <input id="teacher-email" value="teacher" />
        </label>
        <label>密码 / Password
          <input id="teacher-password" type="password" value="teacher" />
        </label>
      </div>
      <button data-action="teacher-login">登录</button>
    </section>
  `);
}

function renderTaskEditor() {
  const task = state.editingTaskId ? getTask(state.editingTaskId) : null;
  const questions = task ? getQuestions(task.id) : state.pendingQuestions;
  const taskDraft = currentTaskDraft();
  const editing = state.editingQuestion || {};
  const activeCategory = editing.category || categoryForQuestionType(editing.template_id || editing.type || "vocab_match_han_en");
  const categoryTemplates = getTemplatesForCategory(activeCategory);
  const activeTemplate = templateForQuestion(editing.template_id || editing.type || categoryTemplates[0]?.id, activeCategory);
  const currentLevel = getLevel(state.adminTaskLevel);
  return `
    <section class="panel stack">
      <h2>${task ? "编辑任务包" : "创建任务包"}</h2>
      <span class="pill">当前学习路径：${escapeHtml(currentLevel.title)} / ${escapeHtml(currentLevel.zh)}</span>
      <div class="grid">
        <label>任务标题
          <input id="task-title" value="${escapeHtml(taskDraft.title)}" />
        </label>
        <label>涉及话题
          <input id="task-topic" value="${escapeHtml(taskDraft.topic)}" placeholder="例如 自我介绍 / 家庭 / 时间表达" />
        </label>
        <label>任务简介
          <input id="task-description" value="${escapeHtml(taskDraft.description)}" placeholder="简要说明这个任务包练什么。" />
        </label>
      </div>
      ${task ? "" : `
        ${renderQuestionTemplatePicker(activeCategory, activeTemplate, categoryTemplates, { compact: true })}
        ${renderQuestionDraftForm(activeTemplate, questions)}
        <h3>已保存题目 / Saved questions</h3>
        ${renderQuestionTable(questions, { pending: true })}
      `}
      ${task ? "" : `<div class="row wrap">
        <button data-action="save-task">保存任务包</button>
      </div>`}
    </section>
    ${task ? `
      <section class="panel stack">
        <h2>题目编辑器</h2>
        ${renderQuestionTemplatePicker(activeCategory, activeTemplate, categoryTemplates)}
        ${renderQuestionDraftForm(activeTemplate, questions)}
        <h3>已保存题目 / Saved questions</h3>
        ${renderQuestionTable(questions)}
        <div class="row wrap">
          <button data-action="save-task">保存任务包</button>
        </div>
      </section>
    ` : ""}
  `;
}

function renderTeacherDashboard() {
  const tasks = state.data.tasks || [];
  const currentLevel = getLevel(state.adminTaskLevel);
  const levelTasks = sortTasksByTitle(tasks.filter((task) => task.level === state.adminTaskLevel));
  return layout(`
    <section class="split">
      <aside class="panel stack">
        <button class="tab ${state.adminTab === "tasks" ? "active" : ""}" data-action="admin-tab" data-tab="tasks">任务包</button>
        <button class="tab ${state.adminTab === "classes" ? "active" : ""}" data-action="admin-tab" data-tab="classes">班级</button>
        <button class="tab ${state.adminTab === "analytics" ? "active" : ""}" data-action="admin-tab" data-tab="analytics">数据反馈</button>
        <button class="tab ${state.adminTab === "settings" ? "active" : ""}" data-action="admin-tab" data-tab="settings">系统设置</button>
        <button class="secondary" data-action="teacher-logout">退出登录</button>
      </aside>
      <div class="view">
        ${state.adminTab === "tasks" ? `
          <section class="panel stack">
            <div class="row wrap">
              <h2 style="flex: 1">任务包列表 · ${escapeHtml(currentLevel.title)}</h2>
            </div>
            <div class="level-tabs">
              ${LEVELS.map((level) => `
                <button class="level-tab ${state.adminTaskLevel === level.id ? "active" : ""}" data-action="select-task-level" data-level="${level.id}">
                  <strong>${escapeHtml(level.title)}</strong>
                  <span>${escapeHtml(level.zh)}</span>
                </button>
              `).join("")}
            </div>
            <div class="table-wrap">
              <table class="task-package-table">
                <colgroup>
                  <col class="task-col-title" />
                  <col class="task-col-topic" />
                  <col class="task-col-description" />
                  <col class="task-col-count" />
                  <col class="task-col-actions" />
                </colgroup>
                <thead><tr><th>任务标题</th><th>核心话题</th><th>任务简介</th><th>题目总数</th><th>操作</th></tr></thead>
                <tbody>
                  ${levelTasks.length ? levelTasks.map((task) => `
                    <tr>
                      <td>${escapeHtml(task.title)}</td>
                      <td>${escapeHtml(task.topic || "暂无")}</td>
                      <td>${escapeHtml(task.description || "暂无")}</td>
                      <td>${getQuestions(task.id).length}</td>
                      <td class="task-actions">
                        <button class="secondary compact" data-action="edit-task" data-task="${task.id}">编辑</button>
                        <button class="${task.status === "published" ? "secondary" : ""} compact" data-action="toggle-task-status" data-task="${task.id}">
                          ${task.status === "published" ? "取消发布" : "发布"}
                        </button>
                        <button class="secondary compact danger-button" data-action="delete-task" data-task="${task.id}" data-title="${escapeHtml(task.title)}">删除</button>
                      </td>
                    </tr>
                  `).join("") : `<tr><td colspan="5">当前学习路径还没有任务包。</td></tr>`}
                </tbody>
              </table>
            </div>
          </section>
          ${renderTaskEditor()}
        ` : ""}
        ${state.adminTab === "classes" ? renderClassAdmin() : ""}
        ${state.adminTab === "analytics" ? renderAnalytics() : ""}
        ${state.adminTab === "settings" ? renderConfigPanel() : ""}
      </div>
    </section>
  `);
}

function renderConfigPanel() {
  return `
    <section class="panel stack">
      <h2>系统设置</h2>
      <p class="muted">Supabase URL 和 anon/public key 是网站基础连接配置。正式上线后通常固定好，不建议让学生看到，也不需要日常修改。</p>
      <label>Supabase URL
        <input id="config-url" value="${escapeHtml(state.config.url)}" placeholder="https://xxxx.supabase.co" />
      </label>
      <label>Anon / public key
        <textarea id="config-key" placeholder="eyJ...">${escapeHtml(state.config.anonKey)}</textarea>
      </label>
      <button data-action="save-config">保存设置</button>
    </section>
  `;
}

function renderClassAdmin() {
  const classes = state.data.classes || [];
  const activeClass = state.adminClassId === "__closed" ? null : classes.find((item) => item.id === state.adminClassId) || null;
  const students = state.data.class_students || [];
  const tasks = state.data.tasks || [];
  const attempts = state.data.student_attempts || [];
  const scores = state.data.student_task_scores || [];
  return `
    <section class="panel stack">
      <h2>班级管理</h2>
      <h3>创建班级</h3>
      <div class="grid">
        <label>班级 code
          <input id="class-code" placeholder="例如 G7CN" />
        </label>
        <label>班级名称
          <input id="class-name" placeholder="例如 Grade 7 Chinese" />
        </label>
      </div>
      <button data-action="save-class">保存班级</button>
      <h3>班级条</h3>
      <p class="muted">班级 code 用来识别学生归属班级，并把学生答题信息归入对应班级。基础数据页的班级分类以这里登记的学生和班级 code 为依据；当前 G7CN/G8CN 只是本地试运行示例。</p>
      <div class="class-strip-list">
        ${classes.length ? classes.map((item) => {
          const isOpen = activeClass?.id === item.id;
          const classStudents = students.filter((student) => student.class_id === item.id && student.active !== false);
          return `
            <article class="class-strip ${isOpen ? "is-open" : ""}">
              <button class="class-strip__button" data-action="select-class" data-class="${item.id}">
                <span>
                  <strong>${escapeHtml(item.name)}</strong>
                  <small>${escapeHtml(item.class_code)}</small>
                </span>
                <span class="class-strip__meta">
                  <span>${classStudents.length} 名学生</span>
                  <span>${isOpen ? "收起" : "打开"}</span>
                </span>
              </button>
              ${isOpen ? `
                <div class="class-detail stack">
                  <div class="metric-row compact-metrics">
                    <div class="metric"><span class="muted">注册学生</span><strong>${classStudents.length}</strong></div>
                    <div class="metric"><span class="muted">班级 code</span><strong>${escapeHtml(item.class_code)}</strong></div>
                  </div>
                  <h3>注册新学生 / Register Student</h3>
                  <div class="student-register-grid">
                    <label>学生姓名 / Name
                      <input id="registered-student-name" placeholder="例如 Kevin / 王明" />
                    </label>
                    <label>性别 / Gender
                      <input id="registered-student-gender" placeholder="例如 Male / Female / 男 / 女" />
                    </label>
                    <label>当前班级
                      <input value="${escapeHtml(item.name)} (${escapeHtml(item.class_code)})" disabled />
                    </label>
                    <label>组合代码 / Login Code
                      <input id="registered-student-code" placeholder="${escapeHtml(item.class_code)}Kevin" />
                    </label>
                    <button class="compact student-add-button" data-action="save-allowed-student" data-class="${item.id}" data-class-code="${escapeHtml(item.class_code)}">新增</button>
                  </div>
                  <div class="table-wrap">
                    <table>
                      <thead><tr><th>学生姓名</th><th>性别</th><th>学生班级</th><th>组合代码</th><th>操作</th></tr></thead>
                      <tbody>
                        ${classStudents.length ? classStudents.map((student) => `
                          <tr>
                            <td>${escapeHtml(student.student_name)}</td>
                            <td>${escapeHtml(student.gender || "暂无")}</td>
                            <td>${escapeHtml(item.name)}</td>
                            <td>${escapeHtml(studentAccessCode(student, item.class_code))}</td>
                            <td><button class="secondary compact" data-action="delete-student" data-student="${student.id}" data-class="${item.id}">删除 / Delete</button></td>
                          </tr>
                        `).join("") : `<tr><td colspan="5">这个班级还没有注册学生。</td></tr>`}
                      </tbody>
                    </table>
                  </div>
                  <div class="danger-zone">
                    <button class="warning" data-action="delete-class" data-class="${item.id}">删除班级 / Delete class</button>
                  </div>
                </div>
              ` : ""}
            </article>
          `;
        }).join("") : `<div class="notice">还没有班级。请先在上方创建班级。</div>`}
      </div>
    </section>
  `;
}

function renderAnalytics() {
  const classes = state.data.classes || [];
  const attempts = state.data.student_attempts || [];
  const answers = state.data.student_answers || [];
  const scores = state.data.student_task_scores || [];
  const tasks = state.data.tasks || [];
  const questions = state.data.questions || [];
  const students = state.data.class_students || [];
  const classGroups = groupedClassesByCode(classes);
  const activeGroup = state.analyticsGroupId === "__closed"
    ? null
    : classGroups.find((group) => group.id === state.analyticsGroupId) || null;
  const activeGroupClasses = activeGroup?.classes || [];
  const activeClass = state.analyticsClassId === "__closed"
    ? null
    : activeGroupClasses.find((item) => item.id === state.analyticsClassId) || null;
  const activeClassLevel = activeClass ? levelForClassCode(activeClass.class_code) : "";
  const publishedTasks = activeClass
    ? sortTasksByTitle(tasks.filter((task) => task.status === "published" && task.level === activeClassLevel))
    : [];
  const activeTask = state.analyticsTaskId === "__closed" ? null : publishedTasks.find((task) => task.id === state.analyticsTaskId) || publishedTasks[0] || null;
  if (activeTask && state.analyticsTaskId !== activeTask.id) state.analyticsTaskId = activeTask.id;
  const activeClassStudents = activeClass ? students.filter((student) => student.class_id === activeClass.id && student.active !== false) : [];
  const taskAttempts = activeClass && activeTask ? attempts.filter((attempt) => (
    attempt.task_id === activeTask.id &&
    normalizeAnswer(attempt.class_code) === normalizeAnswer(activeClass.class_code)
  )) : [];
  const taskAttemptIds = new Set(taskAttempts.map((attempt) => attempt.id));
  const taskAnswers = answers.filter((answer) => taskAttemptIds.has(answer.attempt_id));
  const taskQuestions = activeTask ? questions.filter((question) => question.task_id === activeTask.id) : [];
  const questionStats = taskQuestions.map((question) => {
    const rows = taskAnswers.filter((answer) => answer.question_id === question.id && answer.is_correct !== null);
    const correct = rows.filter((answer) => answer.is_correct).length;
    return {
      question,
      total: rows.length,
      correct,
      rate: rows.length ? Math.round((correct / rows.length) * 100) : 0,
    };
  });
  const selectedStudentAttempts = state.analyticsStudentName ? taskAttempts
    .filter((attempt) => normalizeAnswer(attempt.student_name) === normalizeAnswer(state.analyticsStudentName))
    .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0)) : [];
  const selectedAttempt = selectedStudentAttempts[0] || null;
  const selectedAnswers = selectedAttempt ? taskAnswers.filter((answer) => answer.attempt_id === selectedAttempt.id) : [];
  return `
    <section class="panel stack">
      <h2>数据分析</h2>
      <div class="class-strip-list">
        ${classGroups.length ? classGroups.map((group) => {
          const isGroupOpen = activeGroup?.id === group.id;
          const groupLevel = levelForClassCode(group.id);
          const groupTasks = tasks.filter((task) => task.status === "published" && task.level === groupLevel);
          const groupTaskIds = new Set(groupTasks.map((task) => task.id));
          const groupAttempts = attempts.filter((attempt) => (
            classGroupKey(attempt.class_code) === group.id &&
            groupTaskIds.has(attempt.task_id)
          ));
          const groupLatestTask = latestPublishedTaskForLevel(tasks, groupLevel);
          const groupAverageAccuracy = groupLatestTask
            ? averageAccuracyForTask(attempts, groupLatestTask.id, group.classes.map((item) => item.class_code))
            : null;
          const groupTaskCount = groupTasks.length;
          return `
            <article class="class-group-strip ${isGroupOpen ? "is-open" : ""}">
              <button class="class-group-strip__button" data-action="select-analytics-group" data-group="${escapeHtml(group.id)}">
                <span>
                  <strong>${escapeHtml(group.title)}</strong>
                  <small>${group.classes.length} 个班级</small>
                </span>
                <span class="class-strip__meta">
                  <span class="latest-accuracy">最新任务准确率 ${formatAccuracy(groupAverageAccuracy)}</span>
                  <span>${groupTaskCount} 个已发布任务</span>
                  <span>${groupAttempts.length} 次提交</span>
                  <span>${isGroupOpen ? "收起" : "打开"}</span>
                </span>
              </button>
              ${isGroupOpen ? `
                <div class="class-group-detail">
                  ${group.classes.map((item) => {
          const isOpen = activeClass?.id === item.id;
          const classLevel = levelForClassCode(item.class_code);
          const classTasks = sortTasksByTitle(tasks.filter((task) => task.status === "published" && task.level === classLevel));
          const classTaskIds = new Set(classTasks.map((task) => task.id));
          const classAttempts = attempts.filter((attempt) => (
            normalizeAnswer(attempt.class_code) === normalizeAnswer(item.class_code) &&
            classTaskIds.has(attempt.task_id)
          ));
          const latestClassTask = latestPublishedTaskForLevel(tasks, classLevel);
          const classLatestAverageAccuracy = latestClassTask
            ? averageAccuracyForTask(attempts, latestClassTask.id, [item.class_code])
            : null;
          const classSummary = analyticsForClassTask(latestClassTask, item, attempts, answers, questions);
          const classScores = scores.filter((score) => (
            normalizeAnswer(score.class_code) === normalizeAnswer(item.class_code) &&
            classTaskIds.has(score.task_id)
          ));
          const participantCount = new Set(classAttempts.map((attempt) => normalizeAnswer(attempt.student_name)).filter(Boolean)).size;
          const answerPersonTimes = classAttempts.length;
          const bestRatesByStudent = Object.values(classScores.reduce((map, score) => {
            const key = normalizeAnswer(score.student_name);
            const bestRate = Number(score.latest_max_score || 0)
              ? Math.round((Number(score.best_score || 0) / Number(score.latest_max_score || 1)) * 100)
              : Number(score.latest_accuracy || 0);
            map[key] = Math.max(map[key] || 0, bestRate);
            return map;
          }, {}));
          const classBestAverage = bestRatesByStudent.length
            ? Math.round(bestRatesByStudent.reduce((sum, rate) => sum + rate, 0) / bestRatesByStudent.length)
            : null;
          return `
            <article class="class-strip ${isOpen ? "is-open" : ""}">
              <button class="class-strip__button" data-action="select-analytics-class" data-class="${item.id}">
                <span>
                  <strong>${escapeHtml(item.name)}</strong>
                  <small>${escapeHtml(item.class_code)}</small>
                </span>
                <span class="class-strip__meta">
                  <span class="latest-accuracy">最新任务准确率 ${formatAccuracy(classLatestAverageAccuracy)}</span>
                  <span>${classTasks.length} 个已发布任务</span>
                  <span>${classAttempts.length} 次提交</span>
                  <span>${isOpen ? "收起" : "打开"}</span>
                </span>
              </button>
              ${isOpen ? `
                <div class="class-detail stack">
                  ${renderAnalyticsSummary(classSummary)}
                  <div class="metric-row">
                    <div class="metric"><span class="muted">发布任务</span><strong>${classTasks.length}</strong></div>
                    <div class="metric"><span class="muted">参与学生</span><strong>${participantCount}</strong></div>
                    <div class="metric"><span class="muted">答题人次</span><strong>${answerPersonTimes}</strong></div>
                    <div class="metric"><span class="muted">最好均分</span><strong>${classBestAverage === null ? "暂无" : `${classBestAverage}%`}</strong></div>
                  </div>
                  <h3>已发布任务包</h3>
                  <div class="task-strip-list">
                    ${classTasks.length ? classTasks.map((task) => {
                      const isTaskOpen = activeTask?.id === task.id;
                      const currentTaskAttempts = classAttempts.filter((attempt) => attempt.task_id === task.id);
                      return `
                        <div class="task-strip-item">
                          <button class="task-strip ${isTaskOpen ? "active" : ""}" data-action="select-analytics-task" data-task="${task.id}">
                            <span><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(taskMeta(task))}</small></span>
                            <span>${currentTaskAttempts.length} 次提交</span>
                          </button>
                          ${isTaskOpen ? renderAnalyticsTaskDetail({
                            activeTask,
                            activeClass,
                            activeClassStudents,
                            taskAttempts,
                            taskQuestions,
                            questionStats,
                            selectedAttempt,
                            selectedAnswers,
                          }) : ""}
                        </div>
                      `;
                    }).join("") : `<div class="notice">这个班级还没有已发布任务包。</div>`}
                  </div>
                  ${false && activeTask ? `
                    <div class="metric-row task-metrics">
                      ${(() => {
                        const latestByStudent = latestAttemptsByStudent(taskAttempts);
                        const classAverageAccuracy = averageNumber(latestByStudent.map((attempt) => attempt.accuracy));
                        const classAverageDuration = averageNumber(latestByStudent.map((attempt) => attempt.duration_seconds || attempt.latest_duration_seconds).filter(Boolean));
                        const weakQuestionCount = questionStats.filter((item) => item.total && item.rate < 50).length;
                        const tags = commonErrorTags(questionStats);
                        return `
                          <div class="metric"><span class="muted">班级准确率</span><strong>${classAverageAccuracy === null ? "暂无" : `${classAverageAccuracy}%`}</strong></div>
                          <div class="metric"><span class="muted">平均用时</span><strong>${classAverageDuration === null ? "暂无" : formatDuration(classAverageDuration)}</strong></div>
                          <div class="metric"><span class="muted">未掌握内容</span><strong>${weakQuestionCount}</strong></div>
                          <div class="metric error-tag-metric"><span class="muted">常见错误点</span><strong>${escapeHtml(tags.length ? tags.join("；") : "暂无")}</strong></div>
                        `;
                      })()}
                    </div>
                    <div class="analytics-table-head">
                      <h3>学生完成记录 / 最近得分</h3>
                      <div class="segmented-control" aria-label="学生排序">
                        <button class="secondary compact ${state.analyticsStudentSort === "name" ? "active" : ""}" data-action="sort-analytics-students" data-sort="name">按姓名排序</button>
                        <button class="secondary compact ${state.analyticsStudentSort === "accuracy" ? "active" : ""}" data-action="sort-analytics-students" data-sort="accuracy">按准确率排序</button>
                      </div>
                    </div>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>学生</th><th>最近成绩</th><th>正确率</th><th>提交次数</th><th>答题用时</th><th>更新时间</th><th>查看详情</th></tr></thead>
                        <tbody>
                          ${(() => {
                            const participantNames = [...new Set(taskAttempts.map((attempt) => attempt.student_name).filter(Boolean))];
                            const studentRows = participantNames.map((studentName) => {
                              const student = activeClassStudents.find((item) => normalizeAnswer(item.student_name) === normalizeAnswer(studentName)) || { student_name: studentName };
                              const studentAttempts = taskAttempts.filter((attempt) => normalizeAnswer(attempt.student_name) === normalizeAnswer(studentName));
                              const latestAttempt = latestAttemptForStudent(taskAttempts, studentName);
                              return { student, studentAttempts, latestAttempt };
                            }).sort((a, b) => {
                              if (state.analyticsStudentSort === "accuracy") {
                                const aRate = a.latestAttempt ? Number(a.latestAttempt.accuracy || 0) : -1;
                                const bRate = b.latestAttempt ? Number(b.latestAttempt.accuracy || 0) : -1;
                                if (bRate !== aRate) return bRate - aRate;
                              }
                              return String(a.student.student_name || "").localeCompare(String(b.student.student_name || ""), "zh-Hans-CN", {
                                numeric: true,
                                sensitivity: "base",
                              });
                            });
                            return studentRows.length ? studentRows.map(({ student, studentAttempts, latestAttempt }) => {
                            const isSelectedStudent = normalizeAnswer(state.analyticsStudentName) === normalizeAnswer(student.student_name);
                            return `
                              <tr>
                                <td>${escapeHtml(student.student_name)}</td>
                                <td>${latestAttempt ? `${escapeHtml(latestAttempt.score)} / ${escapeHtml(latestAttempt.max_score)}` : "暂无"}</td>
                                <td>${latestAttempt ? accuracyText(latestAttempt.accuracy) : "暂无"}</td>
                                <td>${studentAttempts.length}</td>
                                <td>${latestAttempt ? formatDuration(latestAttempt.duration_seconds || latestAttempt.latest_duration_seconds) : "未完成"}</td>
                                <td>${latestAttempt?.submitted_at ? new Date(latestAttempt.submitted_at).toLocaleString() : "暂无"}</td>
                                <td><button class="secondary compact" data-action="select-analytics-student" data-student="${escapeHtml(student.student_name)}">${isSelectedStudent ? "收起 / Hide" : "查看 / View"}</button></td>
                              </tr>
                            `;
                            }).join("") : `<tr><td colspan="7">当前任务还没有学生提交。</td></tr>`;
                          })()}
                        </tbody>
                      </table>
                    </div>
                    ${selectedAttempt ? `
                      <div class="student-detail stack">
                        <div class="row wrap">
                          <h3 style="flex: 1">${escapeHtml(state.analyticsStudentName)} 的做题详情</h3>
                          <span class="pill">${escapeHtml(selectedAttempt.score)} / ${escapeHtml(selectedAttempt.max_score)} · ${escapeHtml(selectedAttempt.accuracy)}%</span>
                        </div>
                        <div class="table-wrap">
                          <table>
                            <thead><tr><th>题目</th><th>题型</th><th>学生答案</th><th>结果</th><th>${renderTeacherReviewHeader()}</th></tr></thead>
                            <tbody>
                              ${taskQuestions.map((question) => {
                                const row = selectedAnswers.find((answer) => answer.question_id === question.id);
                                const isWrong = row && row.is_correct === false;
                                return `
                                  <tr class="${isWrong ? "answer-wrong" : ""}">
                                    <td>${escapeHtml(question.prompt)}</td>
                                    <td>${escapeHtml(question.type)}</td>
                                    <td>${renderTeacherAnswerValue(row?.student_answer, question)}${renderTeacherAnswerReviewHint(question, row)}</td>
                                    <td>${answerResultLabel(question, row)}</td>
                                    <td>${renderTeacherReviewControls(row)}</td>
                                  </tr>
                                `;
                              }).join("")}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ` : ""}
                    <h3>班级准确率/错题追踪</h3>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>题目</th><th>题型</th><th>作答</th><th>正确率</th></tr></thead>
                        <tbody>
                          ${questionStats.length ? questionStats.map((item) => `
                            <tr>
                              <td>${escapeHtml(item.question.prompt)}</td>
                              <td>${escapeHtml(item.question.type)}</td>
                              <td>${item.correct}/${item.total}</td>
                              <td>
                                <div class="progress-cell">
                                  <div class="progress-bar" aria-label="正确率 ${item.rate}%">
                                    <span style="width: ${item.rate}%"></span>
                                  </div>
                                  ${accuracyText(item.rate)}
                                </div>
                              </td>
                            </tr>
                          `).join("") : `<tr><td colspan="4">这个任务包还没有答题记录。</td></tr>`}
                        </tbody>
                      </table>
                    </div>
                    <div class="row wrap">
                      <h3 style="flex: 1">提交历史</h3>
                      <button class="warning compact" data-action="clear-task-history" data-task="${activeTask.id}" data-class-code="${escapeHtml(activeClass.class_code)}">清空历史记录 / Clear history</button>
                    </div>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>时间</th><th>学生</th><th>得分</th><th>正确率</th><th>答题用时</th></tr></thead>
                        <tbody>
                          ${taskAttempts.length ? taskAttempts.map((attempt) => `
                            <tr>
                              <td>${escapeHtml(attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "暂无")}</td>
                              <td>${escapeHtml(attempt.student_name)}</td>
                              <td>${escapeHtml(attempt.score)} / ${escapeHtml(attempt.max_score)}</td>
                              <td>${accuracyText(attempt.accuracy)}</td>
                              <td>${formatDuration(attempt.duration_seconds)}</td>
                            </tr>
                          `).join("") : `<tr><td colspan="5">这个任务包还没有提交记录。</td></tr>`}
                        </tbody>
                      </table>
                    </div>
                  ` : ""}
                </div>
              ` : ""}
            </article>
          `;
                  }).join("")}
                </div>
              ` : ""}
            </article>
          `;
        }).join("") : `<div class="notice">还没有班级数据。</div>`}
      </div>
    </section>
  `;
}

function formatOptionsForEdit(question) {
  if (question.optionsDraft !== undefined) return question.optionsDraft;
  if (!question.options) return "";
  if (question.template_id === "grammar_keyword_match" && typeof question.options === "object" && !Array.isArray(question.options)) {
    return question.options.sentence || "";
  }
  if (isExpressionTemplate(question.template_id) && typeof question.options === "object" && !Array.isArray(question.options)) {
    return question.options.prompt || "";
  }
  if (question.type === "matching") {
    return question.options.map((pair) => `${pair.left}${pair.pinyin ? `|${pair.pinyin}` : ""}`).join("\n");
  }
  return Array.isArray(question.options) ? question.options.join("\n") : "";
}

function formatAnswerForEdit(question) {
  if (question.answerDraft !== undefined) return question.answerDraft;
  if (!question.correct_answer) return "";
  if (question.type === "matching") {
    return Object.values(question.correct_answer).join("\n");
  }
  if (Array.isArray(question.correct_answer)) {
    return ["grammar_multi_correct", "grammar_multi_wrong", "grammar_fill_blank_multi", "grammar_keyword_match"].includes(question.template_id)
      ? question.correct_answer.join("\n")
      : question.correct_answer.join("|");
  }
  return String(question.correct_answer);
}

function formatAnswerForStudent(value) {
  if (value === null || value === undefined || value === "") return "No answer yet";
  if (Array.isArray(value)) return value.length ? value.map((item) => displayAnswerValue(typeof item === "object" ? item.word : item)).join(" ") : "No answer yet";
  if (typeof value === "object") {
    if (value.type === "audio" || value.audio) return value.audio ? "[录音回答]" : "No answer yet";
    const entries = Object.entries(value).filter(([, answer]) => answer);
    return entries.length ? entries.map(([left, right]) => `${left} → ${displayAnswerValue(right)}`).join("; ") : "No answer yet";
  }
  return String(displayAnswerValue(value));
}

function parseQuestionForm(taskId) {
  const templateId = document.querySelector("#question-type").value;
  const selectedTemplate = getTemplate(templateId) || QUESTION_TEMPLATES[0];
  const type = selectedTemplate.type || selectedTemplate.id;
  const sentenceSelection = templateId === "grammar_multi_correct" || templateId === "grammar_multi_wrong";
  const pairRows = readPairRowsFromDom();
  const answerRows = readAnswerRowsFromDom();
  const keywordRows = readKeywordRowsFromDom();
  const sentenceRows = readSentenceRowsFromDom();
  const sentencePrompt = document.querySelector("#sentence-task-prompt")?.value.trim() || "";
  const expressionQuestionText = document.querySelector("#expression-text-prompt")?.value.trim() || "";
  const optionSource = sentenceSelection
    ? Array.from({ length: 4 }).map((_, index) => document.querySelector(`#grammar-sentence-${index}`)?.value.trim() || "").filter(Boolean).join("\n")
    : pairRows
      ? pairRows.map((pair) => pair.left).join("\n")
    : document.querySelector("#question-options").value;
  const answerSource = sentenceSelection
    ? Array.from({ length: 4 }).map((_, index) => {
      const sentence = document.querySelector(`#grammar-sentence-${index}`)?.value.trim() || "";
      const checked = document.querySelector(`#grammar-check-${index}`)?.checked;
      return checked && sentence ? sentence : "";
    }).filter(Boolean).join("\n")
    : pairRows
      ? pairRows.map((pair) => pair.right).join("\n")
    : answerRows
      ? answerRows.join("\n")
    : (document.querySelector("#question-answer")?.value || "");
  const optionLines = optionSource.split("\n").map((line) => line.trim()).filter(Boolean);
  const answerText = answerSource.trim();
  const answerLines = answerText.split("\n").map((line) => line.trim()).filter(Boolean);
  const validPairRows = pairRows ? pairRows.filter((pair) => pair.left && pair.right) : [];
  let options = optionLines;
  let correct_answer = answerText;

  if (templateId === "grammar_keyword_match") {
    const candidates = (keywordRows || []).map((row) => row.word).filter(Boolean);
    options = {
      sentence: optionSource,
      candidates,
    };
    correct_answer = (keywordRows || []).filter((row) => row.word && !row.distractor).map((row) => row.word);
  }

  if (isSentenceWordTemplate(templateId)) {
    const rows = sentenceRows || [];
    const candidates = rows.map((row) => row.word).filter(Boolean);
    const correctWords = templateId === "sentence_ordering_all"
      ? candidates
      : rows.filter((row) => row.word && !row.distractor).map((row) => row.word);
    options = templateId === "sentence_ordering_all" ? candidates : { prompt: sentencePrompt, candidates };
    correct_answer = correctWords;
  }

  if (isExpressionTemplate(templateId)) {
    const modes = expressionModes(templateId);
    const expressionAudio = state.editingQuestion?.expressionAudio || getExpressionOptions(state.editingQuestion || {}).audio || "";
    options = {
      promptMode: modes.promptMode,
      answerMode: modes.answerMode,
      prompt: modes.promptMode === "text" ? expressionQuestionText : "",
      audio: modes.promptMode === "audio" ? expressionAudio : "",
    };
    correct_answer = "";
  }

  if (templateId === "grammar_true_false") {
    options = optionLines;
    correct_answer = answerLines.length ? answerLines : ["正确"];
  }

  if (type === "matching") {
    const sourceRows = validPairRows.length ? validPairRows : optionLines.map((line, index) => ({ left: line, right: answerLines[index] || "" }));
    options = sourceRows.map((pair) => {
      const [hanzi, pinyin] = pair.left.split("|");
      const right = pair.right || "";
      return { left: hanzi.trim(), pinyin: (pinyin || "").trim(), right };
    }).filter((pair) => pair.left && pair.right);
    correct_answer = Object.fromEntries(options.map((pair) => [pair.left, pair.right]));
  }

  if (type === "fill_blank" && optionLines.length) {
    options = validPairRows.length ? validPairRows.map((pair) => pair.left) : optionLines;
    correct_answer = templateId === "grammar_fill_blank_multi"
      ? answerLines
      : validPairRows.length
        ? validPairRows.map((pair) => pair.right)
        : answerLines[0] || answerText;
  }

  if (type === "multi_select") {
    correct_answer = answerLines.length ? answerLines : answerText.split("|").map((word) => word.trim()).filter(Boolean);
  }

  if (!isSentenceWordTemplate(templateId) && (type === "sentence_ordering" || (type === "sentence_building" && templateId !== "grammar_keyword_match"))) {
    correct_answer = answerLines.length ? answerLines : answerText.split("|").map((word) => word.trim()).filter(Boolean);
  }

  return {
    id: state.editingQuestion?.id,
    task_id: taskId,
    type,
    template_id: templateId,
    prompt: document.querySelector("#question-prompt")?.dataset.value?.trim() || selectedTemplate.defaultPrompt || "",
    options,
    correct_answer,
    skill_tag: document.querySelector("#question-skill").value.trim(),
    grammar_tag: document.querySelector("#question-grammar").value.trim(),
    sort_order: Number(document.querySelector("#question-order").value || 1),
  };
}

function questionDraftFromForm(overrides = {}) {
  const templateId = document.querySelector("#question-type")?.value || overrides.template_id || state.editingQuestion?.template_id || "vocab_match_han_en";
  const selectedTemplate = getTemplate(templateId);
  const type = overrides.type || selectedTemplate?.type || state.editingQuestion?.type || "matching";
  const pairRows = readPairRowsFromDom();
  const answerRows = readAnswerRowsFromDom();
  const keywordRows = readKeywordRowsFromDom();
  const sentenceRows = readSentenceRowsFromDom();
  const sentencePrompt = document.querySelector("#sentence-task-prompt")?.value || state.editingQuestion?.sentencePrompt || "";
  const expressionPrompt = document.querySelector("#expression-text-prompt")?.value || state.editingQuestion?.expressionPrompt || "";
  return {
    ...state.editingQuestion,
    type,
    template_id: selectedTemplate?.id || templateId,
    category: overrides.category || selectedTemplate?.category || categoryForQuestionType(type),
    prompt: overrides.prompt ?? document.querySelector("#question-prompt")?.dataset.value ?? selectedTemplate?.defaultPrompt ?? "",
    sort_order: Number(document.querySelector("#question-order")?.value || state.editingQuestion?.sort_order || 1),
    skill_tag: document.querySelector("#question-skill")?.value || "",
    grammar_tag: document.querySelector("#question-grammar")?.value || "",
    optionsDraft: pairRows ? pairRows.map((pair) => pair.left).join("\n") : document.querySelector("#question-options")?.value || "",
    answerDraft: pairRows ? pairRows.map((pair) => pair.right).join("\n") : answerRows ? answerRows.join("\n") : keywordRows ? keywordRows.filter((row) => !row.distractor).map((row) => row.word).join("\n") : sentenceRows ? sentenceRows.filter((row) => !row.distractor).map((row) => row.word).join("\n") : document.querySelector("#question-answer")?.value || "",
    pairRows: pairRows || state.editingQuestion?.pairRows,
    answerRows: answerRows || state.editingQuestion?.answerRows,
    keywordRows: keywordRows || state.editingQuestion?.keywordRows,
    sentenceRows: sentenceRows || state.editingQuestion?.sentenceRows,
    sentencePrompt,
    expressionPrompt,
    expressionAudio: state.editingQuestion?.expressionAudio || getExpressionOptions(state.editingQuestion || {}).audio || "",
    ...overrides,
  };
}

function evaluate(question, answer) {
  if (isOpenQuestion(question)) {
    const result = analyzeOpenResponse(answer);
    return {
      isCorrect: null,
      score: 0,
      text: `Teacher review needed\nYour answer: ${formatAnswerForStudent(answer)}\nAuto suggestion: ${result.label}\nReason: ${result.hint}\nThis answer is not counted in the score until your teacher confirms it.`,
    };
  }
  let correct = false;
  if (question.type === "matching") {
    const expected = question.correct_answer || {};
    correct = Object.keys(expected).every((left) => normalizeAnswer(answer?.[left]) === normalizeAnswer(expected[left]));
  } else if (question.template_id === "grammar_true_false" && Array.isArray(question.correct_answer)) {
    const selected = Array.isArray(answer) ? answer.map(normalizeAnswer) : [];
    const expected = question.correct_answer.map(normalizeAnswer);
    correct = selected.length === expected.length && selected.every((item, index) => item === expected[index]);
  } else if (question.type === "multi_select") {
    const selected = Array.isArray(answer) ? answer.map(normalizeAnswer) : [];
    const expected = Array.isArray(question.correct_answer) ? question.correct_answer.map(normalizeAnswer) : [];
    correct = selected.length === expected.length && expected.every((item) => selected.includes(item));
  } else if ((question.type === "fill_blank" && Array.isArray(question.correct_answer)) || question.template_id === "grammar_keyword_match") {
    const selected = Array.isArray(answer) ? answer.map(normalizeAnswer) : [];
    const expected = Array.isArray(question.correct_answer) ? question.correct_answer.map(normalizeAnswer) : [];
    correct = selected.length === expected.length && selected.every((item, index) => item === expected[index]);
  } else if (question.type === "sentence_ordering" || question.type === "sentence_building") {
    correct = normalizeAnswer(answer) === normalizeAnswer(question.correct_answer);
  } else {
    correct = normalizeAnswer(answer) === normalizeAnswer(question.correct_answer);
  }
  return {
    isCorrect: correct,
    score: correct ? 1 : 0,
    text: feedbackText(question, answer, correct),
  };
}

function scoreOpenResponse(answer) {
  return analyzeOpenResponse(answer).level === "likely_correct" ? 1 : 0;
}

function analyzeOpenResponse(answer) {
  if (answer && typeof answer === "object" && answer.audio) {
    return {
      level: "needs_review",
      label: "Needs teacher review",
      hint: "Audio answer recorded. Your teacher will listen and confirm the score.",
    };
  }
  const text = String(answer || "").trim();
  if (!text) {
    return {
      level: "likely_incomplete",
      label: "Likely incomplete",
      hint: "Write at least one short Chinese sentence.",
    };
  }

  const chars = [...text.replace(/\s+/g, "")];
  const chineseChars = chars.filter((char) => /[\u3400-\u9fff]/.test(char));
  const latinChars = chars.filter((char) => /[A-Za-z]/.test(char));
  if (!chineseChars.length) {
    return {
      level: "likely_incomplete",
      label: "Likely incomplete",
      hint: "Please answer in Chinese characters, not English or pinyin only.",
    };
  }
  if (latinChars.length > chineseChars.length / 2) {
    return {
      level: "likely_incomplete",
      label: "Likely incomplete",
      hint: "Use mainly Chinese characters. English can only be a small helper, not the main answer.",
    };
  }
  if (chineseChars.length < 4) {
    return {
      level: "likely_incomplete",
      label: "Likely incomplete",
      hint: "Write a complete short Chinese sentence, not only one word or a few characters.",
    };
  }

  const chineseOnly = chineseChars.join("");
  const uniqueRatio = new Set(chineseChars).size / chineseChars.length;
  if (/(.)\1{2,}/u.test(chineseOnly) || (chineseChars.length >= 6 && uniqueRatio < 0.45)) {
    return {
      level: "likely_incomplete",
      label: "Likely incomplete",
      hint: "This does not look like a clear Chinese sentence. Please write a real sentence.",
    };
  }

  const hasSubjectLikeWord = /(我|我们|你|你们|他|她|他们|老师|学生|朋友|同学|家人|妈妈|爸爸|学校|中文|汉语|旅行|旅游|今天|昨天|明天|周末|上午|下午|晚上|这个|那个)/.test(text);
  const hasPredicateLikeWord = /(是|有|在|去|来|到|看|吃|喝|买|学|学习|喜欢|想|要|会|能|可以|觉得|认为|参加|玩|住|做|写|说|听|读|坐|走|跑|开心|高兴|难过|忙|累|好|不错|有趣|漂亮|重要)/.test(text);
  const hasSentenceEnding = /[。！？!?]$/.test(text) || /(了|的|吗|呢|吧|过)$/.test(text);
  const hasSentencePattern = /(我|我们|你|他|她|老师|学生|朋友|同学|家人|学校|中文|汉语|今天|昨天|明天|周末).{0,12}(是|有|在|去|来|到|看|吃|喝|买|学|喜欢|想|要|会|觉得|玩|做|写|说|听|读|开心|高兴|忙|累)/.test(text);

  if (!(hasSubjectLikeWord && hasPredicateLikeWord && (hasSentenceEnding || hasSentencePattern))) {
    return {
      level: "needs_review",
      label: "Needs teacher review",
      hint: "The answer uses Chinese, but the sentence structure or meaning is not clear enough for automatic confirmation.",
    };
  }

  return {
    level: "likely_correct",
    label: "Likely acceptable",
    hint: "Your answer looks like a basic Chinese sentence. Your teacher still needs to confirm it.",
  };
}

function openResponseHint(answer, passed) {
  return analyzeOpenResponse(answer).hint;
}

function feedbackText(question, answer, correct) {
  const yourAnswer = formatAnswerForStudent(answer);
  const correctAnswer = formatAnswerForStudent(question.correct_answer);
  if (correct) {
    return `Correct\nYour answer: ${yourAnswer}\nHint: Your answer matches the expected response. You can move on to the next question.`;
  }
  return `Incorrect\nYour answer: ${yourAnswer}\nCorrect answer: ${correctAnswer}\nHint: ${feedbackHint(question)}`;
}

function studentFeedbackText(text) {
  return String(text || "")
    .replaceAll("Correct / 正确", "Correct")
    .replaceAll("Incorrect / 不正确", "Incorrect")
    .replaceAll("你的答案：", "Your answer: ")
    .replaceAll("正确答案：", "Correct answer: ")
    .replaceAll("提示：", "Hint: ")
    .replaceAll("；", "; ");
}

function feedbackHint(question) {
  if (question.type === "matching") return "Check each pair carefully. The item on the left must match the meaning, pinyin, or image on the right.";
  if (question.type === "multiple_choice") return "Compare your choice with the meaning of the sentence.";
  if (question.type === "fill_blank") return "Check the key word, spelling, and the grammar pattern in the sentence.";
  if (question.type === "sentence_ordering") return "Look at the normal Chinese word order. Start with the subject, then place time, description, or action in the right position.";
  if (question.type === "sentence_building") return "Choose only the words needed to answer the question, then put them in a natural order.";
  return "Compare your answer with the correct answer and check the meaning, order, or key words.";
}

function answerKey(answer) {
  return JSON.stringify(answer ?? null);
}

function currentQuestion() {
  const task = getTask(state.selectedTaskId);
  if (!task) return null;
  return getQuestions(task.id)[state.activeQuestion] || null;
}

function applyFeedback(question) {
  syncInputs();
  const result = evaluate(question, state.answers[question.id]);
  state.feedback[question.id] = {
    correct: result.isCorrect,
    text: result.text,
    answerKey: answerKey(state.answers[question.id]),
  };
}

function currentQuestionNeedsFeedback(question) {
  const feedback = state.feedback[question.id];
  return !feedback || feedback.answerKey !== answerKey(state.answers[question.id]);
}

function syncInputs() {
  document.querySelectorAll("[data-answer-input]").forEach((input) => {
    state.answers[input.dataset.answerInput] = input.value;
  });
  document.querySelectorAll("[data-blank-input]").forEach((input) => {
    const current = Array.isArray(state.answers[input.dataset.blankInput]) ? [...state.answers[input.dataset.blankInput]] : [];
    current[Number(input.dataset.index)] = input.value;
    state.answers[input.dataset.blankInput] = current;
  });
  document.querySelectorAll("[data-keyword-select]").forEach((select) => {
    const current = Array.isArray(state.answers[select.dataset.keywordSelect]) ? [...state.answers[select.dataset.keywordSelect]] : [];
    current[Number(select.dataset.index)] = select.value;
    state.answers[select.dataset.keywordSelect] = current;
  });
  document.querySelectorAll("[data-match-select]").forEach((select) => {
    const questionId = select.dataset.matchSelect;
    if (state.feedback[questionId]) {
      select.disabled = true;
      return;
    }
    state.answers[questionId] = state.answers[questionId] || {};
    state.answers[questionId][select.dataset.left] = select.value;
  });
}

async function startRecording(scope, questionId = "") {
  if (state.recording) {
    state.message = "当前已有录音正在进行，请先停止。";
    render();
    return;
  }
  if (!confirm("确认后开始录音，最长 5 分钟。")) return;
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    state.message = "当前浏览器不支持录音功能。";
    render();
    return;
  }
  let stream;
  let recorder;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
      .find((type) => MediaRecorder.isTypeSupported?.(type));
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  } catch (error) {
    stream?.getTracks().forEach((track) => track.stop());
    state.recording = null;
    state.message = error?.name === "NotAllowedError"
      ? "浏览器没有获得麦克风权限，请允许麦克风后再录音。"
      : `录音启动失败：${error?.message || "请检查浏览器麦克风权限。"}`;
    render();
    return;
  }
  const chunks = [];
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data?.size) chunks.push(event.data);
  });
  recorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    stream.getTracks().forEach((track) => track.stop());
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const audio = String(reader.result || "");
      if (scope === "teacher-question") {
        const draft = questionDraftFromForm();
        state.editingQuestion = { ...draft, expressionAudio: audio };
        state.message = "老师录音问题已保存到当前题目草稿，请点击“保存题目”或“保存任务包”。";
      } else if (scope === "student-answer") {
        state.answers[questionId] = { type: "audio", audio };
        delete state.feedback[questionId];
        state.message = "录音回答已保存，请继续检查或提交。";
      }
      state.recording = null;
      render();
    });
    reader.readAsDataURL(blob);
  });
  state.recording = {
    key: recordingKey(scope, questionId),
    recorder,
    timeoutId: setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, 5 * 60 * 1000),
  };
  try {
    recorder.start();
    render();
  } catch (error) {
    clearTimeout(state.recording.timeoutId);
    stream.getTracks().forEach((track) => track.stop());
    state.recording = null;
    state.message = `录音启动失败：${error?.message || "当前浏览器无法启动录音。"}`;
    render();
  }
}

function stopRecording() {
  const current = state.recording;
  if (!current) return;
  clearTimeout(current.timeoutId);
  if (current.recorder.state !== "inactive") current.recorder.stop();
}

function bindEvents() {
  ["#task-title", "#task-topic", "#task-description"].forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) input.addEventListener("input", syncTaskDraft);
  });
  document.querySelectorAll("[data-answer-input]").forEach((input) => {
    input.addEventListener("input", () => {
      state.answers[input.dataset.answerInput] = input.value;
      delete state.feedback[input.dataset.answerInput];
    });
  });
  document.querySelectorAll("[data-blank-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const current = Array.isArray(state.answers[input.dataset.blankInput]) ? [...state.answers[input.dataset.blankInput]] : [];
      current[Number(input.dataset.index)] = input.value;
      state.answers[input.dataset.blankInput] = current;
      delete state.feedback[input.dataset.blankInput];
    });
  });
  document.querySelectorAll("[data-keyword-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const current = Array.isArray(state.answers[select.dataset.keywordSelect]) ? [...state.answers[select.dataset.keywordSelect]] : [];
      current[Number(select.dataset.index)] = select.value;
      state.answers[select.dataset.keywordSelect] = current;
      delete state.feedback[select.dataset.keywordSelect];
      render();
    });
  });
  document.querySelectorAll("[data-match-select]").forEach((select) => {
    select.addEventListener("change", () => {
      if (state.feedback[select.dataset.matchSelect]) return;
      delete state.feedback[select.dataset.matchSelect];
      syncInputs();
      render();
    });
  });
  const questionTypeSelect = document.querySelector("#question-type");
  if (questionTypeSelect) {
    questionTypeSelect.addEventListener("change", () => {
      syncTaskDraft();
      const selectedTemplate = getTemplate(questionTypeSelect.value);
      state.editingQuestion = questionDraftFromForm({
        type: selectedTemplate?.type || questionTypeSelect.value,
        template_id: selectedTemplate?.id || questionTypeSelect.value,
        category: selectedTemplate?.category || state.editingQuestion?.category || categoryForQuestionType(questionTypeSelect.value),
        prompt: selectedTemplate?.defaultPrompt || "",
        pairRows: null,
        answerRows: selectedTemplate?.id === "grammar_fill_blank_multi" ? ["", "", ""] : null,
        keywordRows: null,
        sentenceRows: null,
        manualSentenceRows: false,
        sentencePrompt: "",
        expressionPrompt: "",
        expressionAudio: "",
      });
      render();
    });
  }
  document.querySelectorAll("[data-pair-image-input]").forEach((input) => {
    input.addEventListener("change", () => {
      syncTaskDraft();
      const file = input.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        state.message = "请上传图片文件。";
        render();
        return;
      }
      if (file.size > 500 * 1024) {
        state.message = "图片太大，请使用 500KB 以内的小图。";
        render();
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const draft = questionDraftFromForm();
        const rows = Array.isArray(draft.pairRows) && draft.pairRows.length ? draft.pairRows : getPairRowsForEdit(draft);
        const index = Number(input.dataset.index);
        rows[index] = {
          left: rows[index]?.left || "",
          right: String(reader.result || ""),
        };
        state.editingQuestion = { ...draft, pairRows: rows, answerDraft: rows.map((pair) => pair.right).join("\n") };
        state.message = "";
        render();
      });
      reader.readAsDataURL(file);
    });
  });
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", async (event) => {
      event.preventDefault();
      const action = element.dataset.action;
      if (!["new-task", "edit-task", "select-task-level"].includes(action)) syncTaskDraft();
      if (action === "home") go("home", { student: null, level: "", selectedTaskId: null, answers: {}, feedback: {}, summary: null });
      if (action === "config") go(state.teacher ? "config" : "teacher-login");
      if (action === "teacher") {
        if (!state.teacher && isLocalPreview() && !getSupabase()) {
          await run(async () => {
            state.teacher = { email: "本地调试" };
            await api.loadAll();
            state.view = "teacher-dashboard";
          });
        } else {
          go(state.teacher ? "teacher-dashboard" : "teacher-login");
        }
      }
      if (action === "retake-task") retakeCurrentTask();
      if (action === "start-level") {
        await run(async () => {
          if (!state.student) throw new Error("请先输入班级 code 和学生姓名。");
          await api.loadStudentLevel(state.student.class_code, state.student.student_name, element.dataset.level);
          state.level = element.dataset.level;
          state.view = "task-list";
        });
      }
      if (action === "level-select") go("level-select");
      if (action === "student-reset") go("home", { student: null, level: "", selectedTaskId: null, answers: {}, feedback: {}, summary: null });
      if (action === "task-list") go("task-list");
      if (action === "open-task") go("practice", { selectedTaskId: element.dataset.task, activeQuestion: 0, answers: {}, feedback: {}, summary: null, practiceStartedAt: Date.now() });
      if (action === "prev-question") {
        syncInputs();
        go("practice", { activeQuestion: Math.max(0, state.activeQuestion - 1) });
      }
      if (action === "next-question") {
        syncInputs();
        const question = currentQuestion();
        if (question && currentQuestionNeedsFeedback(question)) {
          applyFeedback(question);
          render();
          return;
        }
        go("practice", { activeQuestion: state.activeQuestion + 1 });
      }
      if (action === "set-answer") {
        if (state.feedback[element.dataset.question]) return;
        state.answers[element.dataset.question] = element.dataset.value;
        delete state.feedback[element.dataset.question];
        render();
      }
      if (action === "toggle-multi-answer") {
        const questionId = element.dataset.question;
        if (state.feedback[questionId]) return;
        state.answers[questionId] = Array.isArray(state.answers[questionId]) ? state.answers[questionId] : [];
        const value = element.dataset.value;
        if (state.answers[questionId].includes(value)) {
          state.answers[questionId] = state.answers[questionId].filter((item) => item !== value);
        } else {
          state.answers[questionId].push(value);
        }
        delete state.feedback[questionId];
        render();
      }
      if (action === "set-judge-answer") {
        const questionId = element.dataset.question;
        if (state.feedback[questionId]) return;
        const current = Array.isArray(state.answers[questionId]) ? [...state.answers[questionId]] : [];
        current[Number(element.dataset.index)] = element.dataset.value;
        state.answers[questionId] = current;
        delete state.feedback[questionId];
        render();
      }
      if (action === "add-word") {
        const questionId = element.dataset.question;
        if (state.feedback[questionId]) return;
        state.answers[questionId] = Array.isArray(state.answers[questionId]) ? state.answers[questionId] : [];
        const wordIndex = Number(element.dataset.index);
        const alreadyUsed = state.answers[questionId].some((item) => (
          typeof item === "object" ? item.index === wordIndex : false
        ));
        if (alreadyUsed) return;
        state.answers[questionId].push({ word: element.dataset.word, index: wordIndex });
        delete state.feedback[questionId];
        render();
      }
      if (action === "clear-words") {
        if (state.feedback[element.dataset.question]) return;
        state.answers[element.dataset.question] = [];
        delete state.feedback[element.dataset.question];
        render();
      }
      if (action === "start-recording") {
        await startRecording(element.dataset.recordScope, element.dataset.question || "");
      }
      if (action === "stop-recording") {
        stopRecording();
      }
      if (action === "check-question") {
        const question = state.data.questions.find((item) => item.id === element.dataset.question);
        applyFeedback(question);
        render();
      }
      if (action === "student-login") {
        const classCode = document.querySelector("#student-login-class-code")?.value.trim() || "";
        const studentName = document.querySelector("#student-login-name")?.value.trim() || "";
        await run(async () => {
          const shortcutLevel = {
            G5: "level1",
            G6: "level2",
            G7: "level3",
            G8: "level3",
          }[classCode.toUpperCase()];
          if (isLocalPreview() && !getSupabase() && shortcutLevel && !studentName) {
            loadLocalPreviewLevel(shortcutLevel);
            state.view = "task-list";
            return;
          }
          if (!classCode || !studentName) throw new Error("请输入班级 code 和学生姓名。");
          await api.validateStudent(classCode, studentName);
          state.level = levelForClassCode(state.student?.class_code);
          await api.loadStudentLevel(state.student.class_code, state.student.student_name, state.level);
          state.view = "task-list";
        });
      }
      if (action === "student-preview-login") {
        await run(async () => {
          const previewStudent = defaultPreviewStudent();
          if (!previewStudent) throw new Error("本地演示数据中没有学生。");
          state.student = previewStudent;
          state.level = levelForClassCode(previewStudent.class_code);
          await api.loadAll();
          await api.loadStudentLevel(previewStudent.class_code, previewStudent.student_name, state.level);
          state.view = "task-list";
        });
      }
      if (action === "preview-level") {
        await run(async () => {
          if (!isLocalPreview()) throw new Error("这个入口只用于本地调试。");
          loadLocalPreviewLevel(element.dataset.level);
          state.view = "task-list";
        });
      }
      if (action === "submit-task") {
        syncInputs();
        const question = currentQuestion();
        if (question && currentQuestionNeedsFeedback(question)) {
          applyFeedback(question);
          render();
          return;
        }
        await submitTask();
      }
      if (action === "save-config") {
        const url = document.querySelector("#config-url").value.trim();
        const anonKey = document.querySelector("#config-key").value.trim();
        saveConfig({
          url,
          anonKey,
        });
        await run(async () => {
          await api.loadAll();
          state.adminTab = "settings";
          state.view = state.teacher ? "teacher-dashboard" : "home";
        });
      }
      if (action === "teacher-login") {
        const email = document.querySelector("#teacher-email").value.trim();
        const password = document.querySelector("#teacher-password").value;
        await run(async () => {
          await api.signIn(email, password);
          await api.loadAll();
          state.view = "teacher-dashboard";
        });
      }
      if (action === "teacher-logout") {
        await run(async () => {
          await api.signOut();
          state.view = "home";
        });
      }
      if (action === "admin-tab") go("teacher-dashboard", { adminTab: element.dataset.tab });
      if (action === "select-task-level") {
        go("teacher-dashboard", {
          adminTab: "tasks",
          adminTaskLevel: element.dataset.level,
          editingTaskId: null,
          taskDraft: taskDraftFromTask(),
          editingQuestion: null,
          pendingQuestions: [],
        });
      }
      if (action === "select-class") {
        const nextClassId = state.adminClassId === element.dataset.class ? "__closed" : element.dataset.class;
        go("teacher-dashboard", { adminTab: "classes", adminClassId: nextClassId });
      }
      if (action === "select-analytics-class") {
        const nextClassId = state.analyticsClassId === element.dataset.class ? "__closed" : element.dataset.class;
        go("teacher-dashboard", {
          adminTab: "analytics",
          analyticsClassId: nextClassId,
          analyticsTaskId: "",
          analyticsStudentName: "",
        });
      }
      if (action === "select-analytics-group") {
        const nextGroupId = state.analyticsGroupId === element.dataset.group ? "__closed" : element.dataset.group;
        go("teacher-dashboard", {
          adminTab: "analytics",
          analyticsGroupId: nextGroupId,
          analyticsClassId: "",
          analyticsTaskId: "",
          analyticsStudentName: "",
        });
      }
      if (action === "select-analytics-task") {
        const nextTaskId = state.analyticsTaskId === element.dataset.task ? "__closed" : element.dataset.task;
        go("teacher-dashboard", {
          adminTab: "analytics",
          analyticsTaskId: nextTaskId,
          analyticsStudentName: "",
        });
      }
      if (action === "select-analytics-student") {
        const nextStudentName = state.analyticsStudentName === element.dataset.student ? "" : element.dataset.student;
        go("teacher-dashboard", {
          adminTab: "analytics",
          analyticsStudentName: nextStudentName,
        });
      }
      if (action === "sort-analytics-students") {
        go("teacher-dashboard", {
          adminTab: "analytics",
          analyticsStudentSort: element.dataset.sort || "name",
        });
      }
      if (action === "set-review-answer") {
        state.pendingReviews = {
          ...(state.pendingReviews || {}),
          [element.dataset.answer]: element.dataset.correct === "true",
        };
        render();
      }
      if (action === "save-review-answers") {
        await run(async () => {
          const entries = Object.entries(state.pendingReviews || {});
          if (!entries.length) return;
          for (const [answerId, isCorrect] of entries) {
            await api.reviewAnswer(answerId, isCorrect);
          }
          state.pendingReviews = {};
          state.view = "teacher-dashboard";
          state.adminTab = "analytics";
          state.analyticsStudentName = state.analyticsStudentName || element.dataset.student || "";
        });
        render();
      }
      if (action === "new-task") go("teacher-dashboard", { adminTab: "tasks", editingTaskId: null, taskDraft: taskDraftFromTask(), editingQuestion: null, pendingQuestions: [] });
      if (action === "edit-task") {
        const task = getTask(element.dataset.task);
        go("teacher-dashboard", { adminTab: "tasks", adminTaskLevel: task?.level || state.adminTaskLevel, editingTaskId: element.dataset.task, taskDraft: taskDraftFromTask(task), editingQuestion: null, pendingQuestions: [] });
      }
      if (action === "save-class") {
        const class_code = document.querySelector("#class-code").value.trim();
        const name = document.querySelector("#class-name").value.trim();
        await run(async () => {
          if (!class_code || !name) throw new Error("请填写班级 code 和班级名称。");
          await api.upsertClass({ class_code, name });
          state.adminClassId = (state.data.classes || []).find((item) => item.class_code === class_code)?.id || state.adminClassId;
          state.adminTab = "classes";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "save-allowed-student") {
        const class_id = element.dataset.class || document.querySelector("#student-class-id")?.value || state.adminClassId;
        const classCode = element.dataset.classCode || "";
        const student_name = document.querySelector("#registered-student-name")?.value.trim() || document.querySelector("#allowed-student-name")?.value.trim() || "";
        const gender = document.querySelector("#registered-student-gender")?.value.trim() || "";
        const access_code = document.querySelector("#registered-student-code")?.value.trim() || (classCode && student_name ? buildAccessCode(classCode, student_name) : "");
        await run(async () => {
          if (!class_id || !student_name) throw new Error("请选择班级并填写学生姓名。");
          if (!access_code) throw new Error("请填写组合代码。");
          await api.saveStudent({ class_id, student_name, gender, access_code, active: true });
          state.adminClassId = class_id;
          state.adminTab = "classes";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "delete-student") {
        if (!confirm("是否要删除该学生注册信息，删除之后不可恢复！")) return;
        await run(async () => {
          await api.deleteStudent(element.dataset.student);
          state.adminClassId = element.dataset.class || state.adminClassId;
          state.adminTab = "classes";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "delete-class") {
        if (!confirm("是否要删除该班级及其学生、任务和答题记录，删除之后不可恢复！")) return;
        await run(async () => {
          await api.deleteClass(element.dataset.class);
          state.adminClassId = "__closed";
          state.analyticsClassId = "__closed";
          state.analyticsGroupId = "__closed";
          state.analyticsTaskId = "";
          state.analyticsStudentName = "";
          state.adminTab = "classes";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "clear-task-history") {
        if (!confirm("是否要清空该班级在当前任务包下的所有提交历史，清空后不可恢复！")) return;
        await run(async () => {
          await api.clearTaskHistory(element.dataset.task, element.dataset.classCode);
          state.analyticsStudentName = "";
          state.adminTab = "analytics";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "save-task") {
        syncTaskDraft();
        const wasNewTask = !state.editingTaskId;
        const pendingQuestions = state.pendingQuestions.map((question) => ({ ...question }));
        const taskPayload = {
          id: state.editingTaskId || undefined,
          title: state.taskDraft?.title?.trim() || "",
          topic: state.taskDraft?.topic?.trim() || "",
          description: state.taskDraft?.description?.trim() || "",
          practice_number: getTask(state.editingTaskId)?.practice_number || 1,
          class_id: getTask(state.editingTaskId)?.class_id || state.data.classes?.[0]?.id,
          level: state.adminTaskLevel,
          status: state.editingTaskId ? undefined : "draft",
        };
        await run(async () => {
          if (!taskPayload.title) throw new Error("请填写任务标题。");
          if (!taskPayload.class_id) throw new Error("请先在班级页创建一个班级，用于兼容本地数据结构。");
          const taskId = await api.saveTask(taskPayload);
          if (wasNewTask && pendingQuestions.length) {
            for (const [index, question] of pendingQuestions.entries()) {
              await api.saveQuestion({
                ...question,
                id: undefined,
                task_id: taskId,
                sort_order: Number(question.sort_order || index + 1),
              });
            }
          }
          await api.loadAll();
          state.editingTaskId = taskId;
          state.taskDraft = taskDraftFromTask(getTask(taskId));
          state.editingQuestion = null;
          state.pendingQuestions = [];
          state.adminTab = "tasks";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "toggle-task-status") {
        const task = getTask(element.dataset.task);
        if (!task) return;
        await run(async () => {
          await api.saveTask({
            id: task.id,
            status: task.status === "published" ? "draft" : "published",
          });
          state.adminTab = "tasks";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "delete-task") {
        const task = getTask(element.dataset.task);
        const title = task?.title || element.dataset.title || "这个任务包";
        if (!confirm(`是否要删除任务包「${title}」？删除后该任务下的题目、提交记录和成绩都会删除，且不可恢复。`)) return;
        await run(async () => {
          await api.deleteTask(element.dataset.task);
          if (state.editingTaskId === element.dataset.task) state.editingTaskId = null;
          if (state.analyticsTaskId === element.dataset.task) state.analyticsTaskId = "";
          state.editingQuestion = null;
          state.pendingQuestions = [];
          state.adminTab = "tasks";
          state.view = "teacher-dashboard";
        });
      }
      if (action === "edit-question") {
        state.editingQuestion = state.data.questions.find((question) => question.id === element.dataset.question);
        render();
      }
      if (action === "edit-pending-question") {
        state.editingQuestion = state.pendingQuestions.find((question) => question.id === element.dataset.question) || null;
        render();
      }
      if (action === "clear-question-form") {
        const draft = questionDraftFromForm();
        state.editingQuestion = blankQuestionDraftForTemplate(draft.template_id, {
          sortOrder: draft.sort_order || nextQuestionSortOrder(),
        });
        render();
      }
      if (action === "add-question-pair") {
        const draft = questionDraftFromForm();
        const rows = draft.pairRows?.length ? [...draft.pairRows] : getPairRowsForEdit(draft);
        rows.push({ left: "", right: "" });
        state.editingQuestion = { ...draft, pairRows: rows };
        render();
      }
      if (action === "remove-question-pair") {
        const draft = questionDraftFromForm();
        const rows = (draft.pairRows?.length ? [...draft.pairRows] : getPairRowsForEdit(draft))
          .filter((_, index) => index !== Number(element.dataset.index));
        state.editingQuestion = { ...draft, pairRows: rows.length ? rows : [{ left: "", right: "" }] };
        render();
      }
      if (action === "add-blank-answer") {
        const draft = questionDraftFromForm();
        const rows = draft.answerRows?.length ? [...draft.answerRows] : getAnswerRowsForEdit(draft, getTemplate(draft.template_id));
        rows.push("");
        state.editingQuestion = { ...draft, answerRows: rows };
        render();
      }
      if (action === "remove-blank-answer") {
        const draft = questionDraftFromForm();
        const fallbackRows = getAnswerRowsForEdit(draft, getTemplate(draft.template_id));
        const rows = (draft.answerRows?.length ? [...draft.answerRows] : fallbackRows)
          .filter((_, index) => index !== Number(element.dataset.index));
        state.editingQuestion = { ...draft, answerRows: rows.length ? rows : fallbackRows };
        render();
      }
      if (action === "add-keyword-option") {
        const draft = questionDraftFromForm();
        const rows = draft.keywordRows?.length ? [...draft.keywordRows] : getKeywordRowsForEdit(draft);
        rows.push({ word: "", distractor: false });
        state.editingQuestion = { ...draft, keywordRows: rows };
        render();
      }
      if (action === "remove-keyword-option") {
        const draft = questionDraftFromForm();
        const rows = (draft.keywordRows?.length ? [...draft.keywordRows] : getKeywordRowsForEdit(draft))
          .filter((_, index) => index !== Number(element.dataset.index));
        state.editingQuestion = { ...draft, keywordRows: rows.length ? rows : [{ word: "", distractor: false }] };
        render();
      }
      if (action === "add-sentence-word") {
        const draft = questionDraftFromForm();
        const template = getTemplate(draft.template_id);
        const rows = draft.sentenceRows?.length ? [...draft.sentenceRows] : getSentenceRowsForEdit(draft, template);
        rows.push({ word: "", distractor: false });
        state.editingQuestion = { ...draft, sentenceRows: rows, manualSentenceRows: true };
        render();
      }
      if (action === "remove-sentence-word") {
        const draft = questionDraftFromForm();
        const template = getTemplate(draft.template_id);
        const rows = (draft.sentenceRows?.length ? [...draft.sentenceRows] : getSentenceRowsForEdit(draft, template))
          .filter((_, index) => index !== Number(element.dataset.index));
        state.editingQuestion = { ...draft, sentenceRows: rows.length ? rows : [{ word: "", distractor: false }], manualSentenceRows: true };
        render();
      }
      if (action === "select-question-category") {
        const templates = getTemplatesForCategory(element.dataset.category);
        const selectedTemplate = templates[0];
        state.editingQuestion = questionDraftFromForm({
          category: element.dataset.category,
          template_id: selectedTemplate?.id || "vocab_match_han_en",
          type: selectedTemplate?.type || "matching",
          prompt: selectedTemplate?.defaultPrompt || "",
          pairRows: null,
          answerRows: null,
          keywordRows: null,
          sentenceRows: null,
          manualSentenceRows: false,
          sentencePrompt: "",
          expressionPrompt: "",
          expressionAudio: "",
        });
        render();
      }
      if (action === "delete-question") {
        if (!confirm("是否要删除这道题？删除之后不可恢复。")) return;
        await run(async () => {
          await api.deleteQuestion(element.dataset.question);
          state.editingQuestion = null;
          state.view = "teacher-dashboard";
        });
      }
      if (action === "delete-pending-question") {
        state.pendingQuestions = state.pendingQuestions.filter((question) => question.id !== element.dataset.question);
        if (state.editingQuestion?.id === element.dataset.question) state.editingQuestion = null;
        render();
      }
      if (action === "save-question") {
        const payload = parseQuestionForm(state.editingTaskId);
        await run(async () => {
          if (!payload.prompt) throw new Error("请填写题干。");
          if (!state.editingTaskId) {
            const pendingPayload = {
              ...payload,
              id: payload.id || crypto.randomUUID(),
              task_id: "",
            };
            const index = state.pendingQuestions.findIndex((question) => question.id === pendingPayload.id);
            if (index >= 0) state.pendingQuestions[index] = pendingPayload;
            else state.pendingQuestions.push(pendingPayload);
          } else {
            await api.saveQuestion(payload);
          }
          state.editingQuestion = blankQuestionDraftForTemplate(payload.template_id, {
            sortOrder: nextQuestionSortOrder(),
          });
          state.view = "teacher-dashboard";
        });
      }
    });
  });

  document.querySelectorAll("[data-drag-value]").forEach((chip) => {
    chip.addEventListener("dragstart", (event) => {
      if (chip.classList.contains("disabled") || chip.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", chip.dataset.dragValue);
    });
  });
  document.querySelectorAll("[data-drop-left]").forEach((row) => {
    row.addEventListener("dragover", (event) => event.preventDefault());
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      const value = event.dataTransfer.getData("text/plain");
      const select = row.querySelector("select");
      if (!select || select.disabled) return;
      const questionId = select.dataset.matchSelect;
      const current = state.answers[questionId] || {};
      const usedByOther = Object.entries(current).some(([left, answer]) => left !== select.dataset.left && answer === value);
      if (usedByOther) return;
      select.value = value;
      syncInputs();
      render();
    });
  });
}

async function submitTask() {
  await run(async () => {
    const task = getTask(state.selectedTaskId);
    const questions = getQuestions(task.id);
    const answerRows = questions.map((question) => {
      const result = evaluate(question, state.answers[question.id]);
      return {
        question_id: question.id,
        question_type: question.type,
        student_answer: state.answers[question.id] ?? null,
        is_correct: result.isCorrect,
        score: result.score,
      };
    });
    const objectiveRows = answerRows.filter((row) => row.is_correct !== null);
    const score = objectiveRows.reduce((sum, row) => sum + row.score, 0);
    const maxScore = objectiveRows.length;
    const durationSeconds = state.practiceStartedAt
      ? Math.max(1, Math.round((Date.now() - Number(state.practiceStartedAt)) / 1000))
      : null;
    const completed = answerRows.filter((row) => {
      const answer = row.student_answer;
      if (Array.isArray(answer)) return answer.length > 0;
      if (answer && typeof answer === "object") return Object.values(answer).some(Boolean);
      return String(answer ?? "").trim() !== "";
    }).length;
    const attempt = {
      task_id: task.id,
      class_code: state.student.class_code,
      student_name: state.student.student_name,
      level: task.level,
      score,
      max_score: maxScore,
      accuracy: maxScore ? Math.round((score / maxScore) * 100) : 0,
      completed_count: completed,
      total_count: questions.length,
      duration_seconds: durationSeconds,
    };
    const previousScore = getStudentTaskScore(task.id);
    await api.submitAttempt(attempt, answerRows);
    const currentScore = getStudentTaskScore(task.id);
    const updatedAt = new Date().toISOString();
    const scorePayload = {
      id: currentScore?.id || crypto.randomUUID(),
      task_id: task.id,
      class_code: state.student.class_code,
      student_name: state.student.student_name,
      level: task.level,
      latest_score: score,
      latest_max_score: maxScore,
      latest_accuracy: attempt.accuracy,
      latest_duration_seconds: durationSeconds,
      best_score: Math.max(previousScore?.best_score || 0, score),
      attempts_count: (previousScore?.attempts_count || 0) + 1,
      updated_at: updatedAt,
    };
    state.data.student_task_scores = state.data.student_task_scores || [];
    if (currentScore) Object.assign(currentScore, scorePayload);
    else state.data.student_task_scores.push(scorePayload);
    state.summary = {
      score,
      maxScore,
      accuracy: attempt.accuracy,
      completed,
      total: questions.length,
      openCount: answerRows.filter((row) => row.is_correct === null).length,
      durationSeconds,
    };
    state.view = "summary";
  });
}

function render() {
  const root = document.querySelector("#app");
  if (!state.data) {
    root.innerHTML = layout(`<section class="panel">正在加载...</section>`);
    return;
  }
  if (state.loading) {
    root.innerHTML = layout(`<section class="panel">处理中...</section>`);
    return;
  }
  const views = {
    home: renderHome,
    "level-select": renderLevelSelect,
    "student-entry": renderStudentEntry,
    "task-list": renderTaskList,
    practice: renderPractice,
    summary: renderSummary,
    config: renderConfig,
    "teacher-login": renderTeacherLogin,
    "teacher-dashboard": renderTeacherDashboard,
  };
  root.innerHTML = (views[state.view] || renderHome)();
  bindEvents();
}

async function init() {
  try {
    const client = getSupabase();
    if (client) {
      const { data } = await client.auth.getSession();
      state.teacher = data.session?.user || null;
    }
    await api.loadAll();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("seed-demo-answers") && isLocalPreview()) {
      const seeded = seedDiverseLocalAttempts();
      state.teacher = state.teacher || { email: "本地调试" };
      state.view = "teacher-dashboard";
      state.adminTab = "analytics";
      state.analyticsGroupId = "G5";
      state.analyticsClassId = "";
      state.analyticsTaskId = "";
      state.analyticsStudentName = "";
      setMessage(`已追加 ${seeded.attemptCount} 次测试提交、${seeded.answerCount} 条测试答案。`);
      render();
      return;
    }
    const previewLevel = searchParams.get("preview-level");
    if (previewLevel && isLocalPreview()) {
      loadLocalPreviewLevel(previewLevel);
      state.view = "task-list";
    }
  } catch (error) {
    state.data = loadLocalData();
    state.message = "当前使用本地演示数据。";
  }
  render();
}

init();
