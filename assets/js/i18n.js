/**
 * PSYCHO-PROFILE // ANALYZER
 * Multilingual Dictionary & Typology Database (i18n.js)
 * Supported Steam Release Locales: RU, EN, ZH, DE, JA
 */
(function (global) {
  'use strict';

  const SUPPORTED_LANGS = ['ru', 'en', 'zh', 'de', 'ja'];

  const LANGUAGE_NAMES = {
    ru: 'РУССКИЙ',
    en: 'ENGLISH',
    zh: '简体中文',
    de: 'DEUTSCH',
    ja: '日本語'
  };

  const BARE_FUNCTION_LABELS = {
    '1В': { ru: '1-я Воля', en: '1st Will [1W]', zh: '第一意志 [1W]', de: '1. Wille [1W]', ja: '第1意志 [1W]' },
    '2В': { ru: '2-я Воля', en: '2nd Will [2W]', zh: '第二意志 [2W]', de: '2. Wille [2W]', ja: '第2意志 [2W]' },
    '3В': { ru: '3-я Воля', en: '3rd Will [3W]', zh: '第三意志 [3W]', de: '3. Wille [3W]', ja: '第3意志 [3W]' },
    '4В': { ru: '4-я Воля', en: '4th Will [4W]', zh: '第四意志 [4W]', de: '4. Wille [4W]', ja: '第4意志 [4W]' },
    '1Л': { ru: '1-я Логика', en: '1st Logic [1L]', zh: '第一逻辑 [1L]', de: '1. Logik [1L]', ja: '第1論理 [1L]' },
    '2Л': { ru: '2-я Логика', en: '2nd Logic [2L]', zh: '第二逻辑 [2L]', de: '2. Logik [2L]', ja: '第2論理 [2L]' },
    '3Л': { ru: '3-я Логика', en: '3rd Logic [3L]', zh: '第三逻辑 [3L]', de: '3. Logik [3L]', ja: '第3論理 [3L]' },
    '4Л': { ru: '4-я Логика', en: '4th Logic [4L]', zh: '第四逻辑 [4L]', de: '4. Logik [4L]', ja: '第4論理 [4L]' },
    '1Ф': { ru: '1-я Физика', en: '1st Physics [1P]', zh: '第一物理 [1P]', de: '1. Physik [1P]', ja: '第1物理 [1P]' },
    '2Ф': { ru: '2-я Физика', en: '2nd Physics [2P]', zh: '第二物理 [2P]', de: '2. Physik [2P]', ja: '第2物理 [2P]' },
    '3Ф': { ru: '3-я Физика', en: '3rd Physics [3P]', zh: '第三物理 [3P]', de: '3. Physik [3P]', ja: '第3物理 [3P]' },
    '4Ф': { ru: '4-я Физика', en: '4th Physics [4P]', zh: '第四物理 [4P]', de: '4. Physik [4P]', ja: '第4物理 [4P]' },
    '1Э': { ru: '1-я Эмоция', en: '1st Emotion [1E]', zh: '第一情感 [1E]', de: '1. Emotion [1E]', ja: '第1感情 [1E]' },
    '2Э': { ru: '2-я Эмоция', en: '2nd Emotion [2E]', zh: '第二情感 [2E]', de: '2. Emotion [2E]', ja: '第2感情 [2E]' },
    '3Э': { ru: '3-я Эмоция', en: '3rd Emotion [3E]', zh: '第三情感 [3E]', de: '3. Emotion [3E]', ja: '第3感情 [3E]' },
    '4Э': { ru: '4-я Эмоция', en: '4th Emotion [4E]', zh: '第四情感 [4E]', de: '4. Emotion [4E]', ja: '第4感情 [4E]' }
  };

  const DICTIONARIES = {
    ru: {
      app_title: 'PSYCHO-PROFILE',
      loading_status: 'ИНИЦИАЛИЗАЦИЯ ЯДРА И ВАЛИДАЦИЯ СХЕМЫ ДАННЫХ...',
      menu_start_btn: '[ НАЧАТЬ РАССЛЕДОВАНИЕ ]',
      menu_tutorial_btn: '[ БАЗА ТИПОЛОГИЙ ]',
      menu_settings_btn: '[ НАСТРОЙКИ ]',
      menu_select_mode: 'РЕЖИМ ПРОФИЛИРОВАНИЯ',
      mode_scout_name: 'КАДЕТ',
      mode_scout_desc: 'Оси функций на кнопках, расширенный таймер 60 сек и доступ к подсказкам по уликам.',
      mode_mindhunter_name: 'ПРОФАЙЛЕР',
      mode_mindhunter_desc: 'Только коды функций, жесткий таймер 30 сек без подсказок, множитель очков ×1.5.',
      hud_case: 'ДЕЛО',
      hud_accuracy: 'ТОЧНОСТЬ',
      hud_score: 'СЧЕТ',
      hud_timer: 'ТАЙМЕР',
      timer_sec_unit: 'сек',
      hud_menu_btn: 'МЕНЮ',
      dlg_continue: 'ДАЛЕЕ ▸',
      dlg_climax_badge: 'КУЛЬМИНАЦИЯ — СКАЧОК ПУЛЬСА',
      verdict_header: 'ВЫНЕСИТЕ ВЕРДИКТ',
      verdict_subheader_scout: 'РЕЖИМ КАДЕТА: ОСИ АКТИВНЫ',
      verdict_subheader_pro: 'РЕЖИМ ПРОФИ: КРИЗИС-ТАЙМЕР',
      hint_btn_label: '[ АНАЛИЗ УЛИК ]',
      hint_box_title: 'ТАКТИЧЕСКАЯ ПОДСКАЗКА ПРОФАЙЛЕРА:',
      verdict_win_tag: 'ПРОРЫВ — ПСИХОЗАЩИТА ПРЕОДОЛЕНА',
      verdict_lose_tag: 'ОШИБКА АНАЛИЗА — НЕВЕРНЫЙ ВЕРДИКТ',
      verdict_timeout_tag: 'СТУПОР ВОЛИ — ВРЕМЯ ИСТЕКЛО',
      verdict_chosen_label: 'ВАШ ВЫБОР:',
      verdict_correct_label: 'ИСТИННЫЙ ПРОФИЛЬ:',
      verdict_timeout_value: 'ТАЙМ-АУТ — ВРЕМЯ ИСТЕКЛО',
      verdict_axes_label: 'КАНОНИЧЕСКИЕ ОСИ ФУНКЦИИ:',
      verdict_breakdown_label: 'АНАЛИТИЧЕСКОЕ ЗАКЛЮЧЕНИЕ:',
      verdict_to_summary_btn: '[ ПЕРЕЙТИ К СВОДКЕ ДЕЛА ▸ ]',
      summary_header: 'ИТОГОВОЕ ДОСЬЕ СЛЕДСТВИЯ',
      summary_status_solved: 'СТАТУС: СУБЪЕКТ РАСКОЛОТ (ПРОРЫВ)',
      summary_status_failed: 'СТАТУС: ОШИБКА ПРОФИЛИРОВАНИЯ',
      summary_failed_explanation_prefix: 'Профилирование провалено. Эталонная функция объекта: ',
      summary_metric_case: 'ОБЪЕКТ АНАЛИЗА',
      summary_metric_profile: 'КЛЮЧЕВАЯ ФУНКЦИЯ',
      summary_metric_score: 'НАБРАННЫЕ ОЧКИ СЕССИИ',
      summary_metric_accuracy: 'ОБЩАЯ ТОЧНОСТЬ ПРОФАЙЛЕРА',
      summary_metric_time: 'ОСТАТОК ТАЙМЕРА',
      summary_next_case_btn: '[ СЛЕДУЮЩЕЕ ДЕЛО ▸ ]',
      summary_retry_btn: '[ ПОВТОРИТЬ СЦЕНУ ]',
      summary_menu_btn: '[ В ГЛАВНОЕ МЕНЮ ]',
      close_btn: '[ ЗАКРЫТЬ ]',
      settings_title: 'НАСТРОЙКИ',
      settings_sec_lang: 'ЯЗЫК ИНТЕРФЕЙСА',
      settings_sec_audio: 'АУДИО',
      settings_master_vol: 'Общая громкость',
      settings_bgm_label: 'Музыка',
      settings_sfx_label: 'Звуковые эффекты',
      settings_sink_label: 'Устройство вывода',
      settings_sink_default: 'По умолчанию (Динамики / Наушники)',
      settings_sink_fallback_prefix: 'Аудиовыход',
      settings_sink_unsupported: 'Системный аудиовыход (по умолчанию)',
      settings_sec_visual: 'ВИЗУАЛ',
      settings_shake_label: 'Тряска экрана',
      settings_crt_label: 'Эффект экрана и сканлайны',
      settings_fullscreen_label: 'Полноэкранный режим',
      settings_fullscreen_enter: '[ НА ВЕСЬ ЭКРАН ]',
      settings_fullscreen_exit: '[ ОКОННЫЙ РЕЖИМ ]',
      toggle_on: 'ВКЛ',
      toggle_off: 'ВЫКЛ',
      settings_resume_btn: '[ ПРОДОЛЖИТЬ ]',
      settings_to_menu_btn: '[ ВЫЙТИ В ГЛАВНОЕ МЕНЮ ]',
      breakthrough_banner: 'ПРОРЫВ',
      ach_unlocked_prefix: 'ДОСТИЖЕНИЕ ОТКРЫТО',
      ach_names: {
        FIRST_BREAKTHROUGH: 'Первый прорыв',
        MINDHUNTER_MASTERY: 'Хладнокровный профайлер',
        WILL_STUPOR: 'Ступор воли',
        THEORY_INITIATE: 'Адепт типологии',
        FULL_DOSSIER_CLEAR: 'Архивариус душ'
      },
      tutorial: {
        header: 'БАЗА ТИПОЛОГИЙ',
        back_btn: '[ ◂ ВЕРНУТЬСЯ В МЕНЮ ]',
        start_case_btn: '[ СРАЗУ К РАССЛЕДОВАНИЮ ▸ ]',
        tab_aspects: '01 — 4 АСПЕКТА',
        tab_positions: '02 — 4 ПОЗИЦИИ И ОСИ',
        tab_simulator: '03 — ТРЕНАЖЕР ПРОРЫВА',
        aspects_intro: 'Психософия исследует приоритеты информационно-энергетического обмена человека по четырем фундаментальным аспектам бытия:',
        aspects_list: [
          {
            code: 'В — ВОЛЯ',
            title: 'ВОЛЯ (Субъектность, Власть, Стержень)',
            desc: 'Отвечает за чувство собственного достоинства, право принимать решения, иерархию, ответственность за судьбу и устойчивость намерения.',
            markers: 'Маркеры в допросе: реакция на унижение, приказы, выбор в тупике, фразы «я решу сам», «я ничтожество» или «будет по-моему».'
          },
          {
            code: 'Л — ЛОГИКА',
            title: 'ЛОГИКА (Истина, Структура, Доказательство)',
            desc: 'Отвечает за построение причинно-следственных связей, отношение к аргументам, теориям, сомнениям и интеллектуальному авторитету.',
            markers: 'Маркеры в допросе: отношение к спору, страх логической ошибки, догматизм выводов либо бесконечная перепроверка фактов.'
          },
          {
            code: 'Ф — ФИЗИКА',
            title: 'ФИЗИКА (Материя, Тело, Ресурс, Пространство)',
            desc: 'Отвечает за контакт с телом, болью, вещами, деньгами, территорией, бытом и инстинктом физического выживания.',
            markers: 'Маркеры в допросе: телесная скованность или ловкость, брезгливость, жадность или щедрость, реакция на физическую угрозу.'
          },
          {
            code: 'Э — ЭМОЦИЯ',
            title: 'ЭМОЦИЯ (Аффект, Переживание, Экспрессия)',
            desc: 'Отвечает за глубину и громкость чувств, драматизм, искренность интонаций, эмоциональное заражение или холодный штиль.',
            markers: 'Маркеры в допросе: слезы, пафос, истерика, стыд за проявление чувств либо полное отключение эмоций в кризисе.'
          }
        ],
        positions_intro: 'Каждый из 4 аспектов занимает строго одну позицию в иерархии (от 1-й до 4-й). Позиция определяется пересечением трех осей:',
        axes_legend: '[СИЛЬНАЯ / СЛАБАЯ] — запас энергии  •  [РЕЗУЛЬТАТИВНАЯ / ПРОЦЕССИОННАЯ] — монолог или диалог  •  [ДОМИНАНТНАЯ / ПОДСТРАИВАЮЩАЯСЯ] — принципиальность «Я» или учет «Другого»',
        positions_list: [
          {
            pos: '1-я ПОЗИЦИЯ — «ЦАРЬ» (МОЛОТ)',
            axes: ['СИЛЬНАЯ', 'РЕЗУЛЬТАТИВНАЯ', 'ДОМИНАНТНАЯ'],
            summary: 'Избыток и монолог. Уверена в своем праве по умолчанию, не нуждается в обсуждении и не зависит от чужой оценки. Действует сверху вниз, быстро и бескомпромиссно.'
          },
          {
            pos: '2-я ПОЗИЦИЯ — «МАСТЕР» (РЕКА)',
            axes: ['СИЛЬНАЯ', 'ПРОЦЕССИОННАЯ', 'ПОДСТРАИВАЮЩАЯСЯ'],
            summary: 'Норма, гибкость и диалог. Свободно и без страха вовлекает других в совместный процесс, легко маневрирует, не самоутверждается за чужой счет.'
          },
          {
            pos: '3-я ПОЗИЦИЯ — «ЯЗВА» (КОМПЛЕКС)',
            axes: ['СЛАБАЯ', 'ПРОЦЕССИОННАЯ', 'ДОМИНАНТНАЯ'],
            summary: 'Уязвимость, защита и суперпроцесс. Мучительно сомневается в себе, гиперчувствительна к насмешкам, но яростно отказывается подчиняться. В кризисе способна на отчаянное сверхусилие.'
          },
          {
            pos: '4-я ПОЗИЦИЯ — «ШТИЛЬ» (ПУСТЯЧОК)',
            axes: ['СЛАБАЯ', 'РЕЗУЛЬТАТИВНАЯ', 'ПОДСТРАИВАЮЩАЯСЯ'],
            summary: 'Безразличие и энергосбережение. Легко делегирует сферу другим, принимает готовый результат, а в экстремальной перегрузке первой «отключается».'
          }
        ],
        sim_title: 'ПРАКТИЧЕСКИЙ СИМУЛЯТОР — МЕХАНИКА ПРОРЫВА',
        sim_instruction: 'Прочитайте тестовую реплику подозреваемого и нажмите на плашку верной функции, чтобы испытать эффект психологического прорыва:',
        sim_quote: '«Вы все за спиной шепчетесь, будто я пешка без хребта?! Да, у меня дрожат руки... но клянусь, я НЕ ПОЗВОЛЮ вам решать за меня — я сам сделаю этот шаг!»',
        sim_options: [
          {
            code: '1В',
            label: '1-я Воля (Сильная / Результативная / Доминантная)',
            correct: false,
            feedback: 'Мимо: 1-я Воля не фиксируется на перешептываниях за спиной и не оправдывается за дрожащие руки.'
          },
          {
            code: '3В',
            label: '3-я Воля (Слабая / Процессионная / Доминантная)',
            correct: true,
            feedback: 'ПРОРЫВ АКТИВИРОВАН! Когда вы точно определяете все три оси ядра подозреваемого ([СЛАБАЯ] дрожь и боль самооценки + [ПРОЦЕССИОННАЯ] фиксация на чужом шепоте + [ДОМИНАНТНАЯ] «не позволю решать за меня»), защита субъекта рушится, фиксируя психологический прорыв!'
          },
          {
            code: '4В',
            label: '4-я Воля (Слабая / Результативная / Подстраивающаяся)',
            correct: false,
            feedback: 'Мимо: 4-я Воля спокойно уступает инициативу в кризисе и не идет на яростный бунт ради самоутверждения.'
          }
        ]
      }
    },

    en: {
      app_title: 'PSYCHO-PROFILE',
      loading_status: 'INITIALIZING ENGINE CORE & VALIDATING DATA SCHEMA...',
      menu_start_btn: '[ START INVESTIGATION ]',
      menu_tutorial_btn: '[ TYPOLOGY DATABASE ]',
      menu_settings_btn: '[ SETTINGS ]',
      menu_select_mode: 'PROFILING MODE',
      mode_scout_name: 'CADET',
      mode_scout_desc: 'Function axes displayed on plates, extended 60s timer, and Evidence Clue unlocked.',
      mode_mindhunter_name: 'PROFILER',
      mode_mindhunter_desc: 'Bare function codes only, strict 30s Crisis Timer, no hints, ×1.5 score multiplier.',
      hud_case: 'CASE',
      hud_accuracy: 'ACCURACY',
      hud_score: 'SCORE',
      hud_timer: 'TIMER',
      timer_sec_unit: 'sec',
      hud_menu_btn: 'MENU',
      dlg_continue: 'NEXT ▸',
      dlg_climax_badge: 'CLIMAX — BIOMETRIC SPIKE',
      verdict_header: 'LOCK YOUR VERDICT',
      verdict_subheader_scout: 'CADET MODE: AXES VISIBLE',
      verdict_subheader_pro: 'PROFILER: CRISIS TIMER ACTIVE',
      hint_btn_label: '[ EVIDENCE CLUE ]',
      hint_box_title: 'TACTICAL PROFILER CLUE:',
      verdict_win_tag: 'BREAKTHROUGH — DEFENSES OVERCOME',
      verdict_lose_tag: 'ANALYSIS ERROR — MISJUDGMENT',
      verdict_timeout_tag: 'WILL STUPOR — TIME EXPIRED',
      verdict_chosen_label: 'YOUR VERDICT:',
      verdict_correct_label: 'TRUE PROFILE:',
      verdict_timeout_value: 'TIMEOUT — TIME EXPIRED',
      verdict_axes_label: 'CANONICAL FUNCTION AXES:',
      verdict_breakdown_label: 'ANALYTICAL CONCLUSION:',
      verdict_to_summary_btn: '[ PROCEED TO CASE SUMMARY ▸ ]',
      summary_header: 'FINAL INVESTIGATION DOSSIER',
      summary_status_solved: 'STATUS: SUBJECT PROFILED (BREAKTHROUGH)',
      summary_status_failed: 'STATUS: PROFILING FAILURE',
      summary_failed_explanation_prefix: 'Profiling failed. Benchmark object function: ',
      summary_metric_case: 'ANALYZED CASE',
      summary_metric_profile: 'KEY FUNCTION',
      summary_metric_score: 'SESSION SCORE',
      summary_metric_accuracy: 'OVERALL PROFILER ACCURACY',
      summary_metric_time: 'REMAINING TIMER',
      summary_next_case_btn: '[ NEXT CASE ▸ ]',
      summary_retry_btn: '[ RETRY SCENE ]',
      summary_menu_btn: '[ MAIN MENU ]',
      close_btn: '[ CLOSE ]',
      settings_title: 'SETTINGS',
      settings_sec_lang: 'INTERFACE LANGUAGE',
      settings_sec_audio: 'AUDIO',
      settings_master_vol: 'Master Volume',
      settings_bgm_label: 'Music (BGM)',
      settings_sfx_label: 'Sound Effects (SFX)',
      settings_sink_label: 'Audio Output Device',
      settings_sink_default: 'System Default (Speakers / Headphones)',
      settings_sink_fallback_prefix: 'Audio Output',
      settings_sink_unsupported: 'System Default Output',
      settings_sec_visual: 'VISUALS',
      settings_shake_label: 'Screen Shake',
      settings_crt_label: 'CRT Effects / Scanlines',
      settings_fullscreen_label: 'Fullscreen Mode',
      settings_fullscreen_enter: '[ FULLSCREEN ]',
      settings_fullscreen_exit: '[ WINDOWED ]',
      toggle_on: 'ON',
      toggle_off: 'OFF',
      settings_resume_btn: '[ RESUME ]',
      settings_to_menu_btn: '[ RETURN TO MAIN MENU ]',
      breakthrough_banner: 'BREAKTHROUGH',
      ach_unlocked_prefix: 'ACHIEVEMENT UNLOCKED',
      ach_names: {
        FIRST_BREAKTHROUGH: 'First Breakthrough',
        MINDHUNTER_MASTERY: 'Cold-Blooded Mindhunter',
        WILL_STUPOR: 'Will Stupor (Paralysis of Choice)',
        THEORY_INITIATE: 'Syntax Initiate',
        FULL_DOSSIER_CLEAR: 'Archivist of Souls'
      },
      tutorial: {
        header: 'TYPOLOGY DATABASE',
        back_btn: '[ ◂ BACK TO MENU ]',
        start_case_btn: '[ JUMP TO INVESTIGATION ▸ ]',
        tab_aspects: '01 — 4 ASPECTS',
        tab_positions: '02 — 4 POSITIONS & AXES',
        tab_simulator: '03 — BREAKTHROUGH SIMULATOR',
        aspects_intro: 'Psychosophy maps human cognitive-energetic priorities across four fundamental aspects of existence:',
        aspects_list: [
          {
            code: 'W — WILL (В)',
            title: 'WILL (Agency, Sovereignty, Core Drive)',
            desc: 'Governs personal dignity, decision-making authority, hierarchy, ownership of fate, and resolve under pressure.',
            markers: 'Interrogation markers: reaction to humiliation, orders, deadlocks, phrases like "I decide my fate" or acute status shame.'
          },
          {
            code: 'L — LOGIC (Л)',
            title: 'LOGIC (Truth, Structure, Proof)',
            desc: 'Governs causal reasoning, attitude toward arguments, theories, skepticism, and intellectual rigor.',
            markers: 'Interrogation markers: debate behavior, fear of logical flaws, dogmatic conclusions vs endless proof-checking.'
          },
          {
            code: 'P — PHYSICS (Ф)',
            title: 'PHYSICS (Matter, Body, Territory, Survival)',
            desc: 'Governs bodily awareness, pain threshold, material resources, space, comfort, and physical instinct.',
            markers: 'Interrogation markers: motor confidence vs somatic paralysis, territoriality, reaction to physical hazard.'
          },
          {
            code: 'E — EMOTION (Э)',
            title: 'EMOTION (Affect, Expression, Resonance)',
            desc: 'Governs emotional intensity, dramatic expression, tonal sincerity, affective contagion, or emotional shutdown.',
            markers: 'Interrogation markers: tears, rage outbursts, vulnerability about feelings, or icy affective flatness in crisis.'
          }
        ],
        positions_intro: 'Each of the 4 aspects occupies exactly one rank (1st through 4th), defined by three intersecting axes:',
        axes_legend: '[STRONG / WEAK] — energy reserve  •  [RESULTATIVE / PROCESSIONAL] — monologue vs dialogue  •  [DOMINANT / ADAPTING] — self-priority vs alignment',
        positions_list: [
          {
            pos: '1ST POSITION — "TSAR" (EXCESS)',
            axes: ['STRONG', 'RESULTATIVE', 'DOMINANT'],
            summary: 'Abundance and monologue. Treats its authority as self-evident, needs no debate, and ignores external judgment. Acts swiftly top-down.'
          },
          {
            pos: '2ND POSITION — "MASTER" (NORM)',
            axes: ['STRONG', 'PROCESSIONAL', 'ADAPTING'],
            summary: 'Balanced mastery and dialogue. Engages others fluidly without ego defensiveness, adapting creatively in real time.'
          },
          {
            pos: '3RD POSITION — "ULCER" (COMPLEX)',
            axes: ['WEAK', 'PROCESSIONAL', 'DOMINANT'],
            summary: 'Vulnerability, defense, and hyper-process. Suffers acute self-doubt and sensitivity to mockery, yet fiercely refuses submission—capable of explosive breakthroughs.'
          },
          {
            pos: '4TH POSITION — "STILLNESS" (INDIFFERENCE)',
            axes: ['WEAK', 'RESULTATIVE', 'ADAPTING'],
            summary: 'Energy conservation and calm delegation. Accepts ready-made outcomes and powers down first during extreme stress.'
          }
        ],
        sim_title: 'INTERACTIVE TRAINER — BREAKTHROUGH MECHANIC',
        sim_instruction: 'Read the test suspect statement below and click the matching function plate to trigger a live Breakthrough:',
        sim_quote: '"You are all whispering behind my back like I am a spineless pawn?! Yes, my hands are shaking... but I swear I WILL NOT let you decide for me—I will take this step myself!"',
        sim_options: [
          {
            code: '1В',
            label: '1st Will (Strong / Resultative / Dominant)',
            correct: false,
            feedback: 'Miss: 1st Will does not obsess over whispers behind its back or apologize for trembling hands.'
          },
          {
            code: '3В',
            label: '3rd Will (Weak / Processional / Dominant)',
            correct: true,
            feedback: 'BREAKTHROUGH TRIGGERED! Locking onto all three axes ([WEAK] trembling self-doubt + [PROCESSIONAL] fixation on observers + [DOMINANT] fierce claim to autonomy) shatters the psychological barrier!'
          },
          {
            code: '4В',
            label: '4th Will (Weak / Resultative / Adapting)',
            correct: false,
            feedback: 'Miss: 4th Will yields initiative calmly rather than erupting in defiant pride.'
          }
        ]
      }
    },

    zh: {
      app_title: 'PSYCHO-PROFILE',
      loading_status: '正在初始化引擎内核并校验数据库结构...',
      menu_start_btn: '[ 开始调查 ]',
      menu_tutorial_btn: '[ 类型学数据库 ]',
      menu_settings_btn: '[ 设置 ]',
      menu_select_mode: '侧写模式',
      mode_scout_name: '学员',
      mode_scout_desc: '裁决按钮显示功能坐标轴，计时延长至60秒，开放证据线索提示。',
      mode_mindhunter_name: '侧写师',
      mode_mindhunter_desc: '仅显示纯粹功能代号，严格30秒危机倒计时，无提示，得分 ×1.5。',
      hud_case: '案件',
      hud_accuracy: '准确率',
      hud_score: '得分',
      hud_timer: '计时器',
      timer_sec_unit: '秒',
      hud_menu_btn: '菜单',
      dlg_continue: '继续 ▸',
      dlg_climax_badge: '高潮临界 — 心率激增',
      verdict_header: '锁定心理侧写裁决',
      verdict_subheader_scout: '学员模式：维度提示已激活',
      verdict_subheader_pro: '侧写师模式：高压倒计时',
      hint_btn_label: '[ 证据线索分析 ]',
      hint_box_title: '侧写师战术提示：',
      verdict_win_tag: '心理击破 — 防线瓦解',
      verdict_lose_tag: '分析失误 — 侧写偏差',
      verdict_timeout_tag: '意志僵直 — 超时失利',
      verdict_chosen_label: '你的判定：',
      verdict_correct_label: '真实侧写：',
      verdict_timeout_value: '超时 — 时间耗尽',
      verdict_axes_label: '功能标准三轴属性：',
      verdict_breakdown_label: '分析结论：',
      verdict_to_summary_btn: '[ 查看案件总结档案 ▸ ]',
      summary_header: '调查结案档案',
      summary_status_solved: '状态：目标防线已击破',
      summary_status_failed: '状态：侧写判定失败',
      summary_failed_explanation_prefix: '侧写失败。对象基准机能：',
      summary_metric_case: '分析对象',
      summary_metric_profile: '核心机能',
      summary_metric_score: '本局累计得分',
      summary_metric_accuracy: '侧写总体准确率',
      summary_metric_time: '剩余时间',
      summary_next_case_btn: '[ 下一案件 ▸ ]',
      summary_retry_btn: '[ 重试本幕 ]',
      summary_menu_btn: '[ 返回主菜单 ]',
      close_btn: '[ 关闭 ]',
      settings_title: '设置',
      settings_sec_lang: '界面语言',
      settings_sec_audio: '音频',
      settings_master_vol: '主音量',
      settings_bgm_label: '背景音乐 (BGM)',
      settings_sfx_label: '音效 (SFX)',
      settings_sink_label: '音频输出设备',
      settings_sink_default: '系统默认（扬声器 / 耳机）',
      settings_sink_fallback_prefix: '音频输出',
      settings_sink_unsupported: '系统默认输出',
      settings_sec_visual: '画面',
      settings_shake_label: '屏幕震动',
      settings_crt_label: 'CRT 扫描线效果',
      settings_fullscreen_label: '全屏模式',
      settings_fullscreen_enter: '[ 全屏显示 ]',
      settings_fullscreen_exit: '[ 窗口模式 ]',
      toggle_on: '开',
      toggle_off: '关',
      settings_resume_btn: '[ 继续行动 ]',
      settings_to_menu_btn: '[ 返回主菜单 ]',
      breakthrough_banner: '心理击破',
      ach_unlocked_prefix: '成就已解锁',
      ach_names: {
        FIRST_BREAKTHROUGH: '初次击破',
        MINDHUNTER_MASTERY: '冷血侧写师',
        WILL_STUPOR: '意志僵直',
        THEORY_INITIATE: '类型学入门者',
        FULL_DOSSIER_CLEAR: '灵魂档案员'
      },
      tutorial: {
        header: '类型学数据库',
        back_btn: '[ ◂ 返回主菜单 ]',
        start_case_btn: '[ 立即开始调查 ▸ ]',
        tab_aspects: '01 — 四大要素',
        tab_positions: '02 — 四个位置与三轴',
        tab_simulator: '03 — 击破模拟器',
        aspects_intro: '心理苏菲学派通过四个核心要素解析人类在高压情境下的精神优先级：',
        aspects_list: [
          {
            code: 'В — 意志 (WILL)',
            title: '意志（主体性、尊严、决断力）',
            desc: '掌管自我价值感、命运主导权、等级意识与面对压迫时的精神脊梁。',
            markers: '审讯特征：面对羞辱与命令的反应、绝境中的自主抉择或自卑反扑。'
          },
          {
            code: 'Л — 逻辑 (LOGIC)',
            title: '逻辑（真理、结构、严密证明）',
            desc: '掌管因果推理、论证体系、怀疑精神以及对智识权威的态度。',
            markers: '审讯特征：辩论姿态、对逻辑漏洞的恐惧、独断定论或无限验算。'
          },
          {
            code: 'Ф — 物理 (PHYSICS)',
            title: '物理（躯体、物质、空间、本能）',
            desc: '掌管身体协调、痛觉、资源占有、环境安全感与物理求生本能。',
            markers: '审讯特征：肢体僵硬或灵活掌控、对物理危险的直接躯体反应。'
          },
          {
            code: 'Э — 情感 (EMOTION)',
            title: '情感（情绪张力、共鸣、表达）',
            desc: '掌管情绪浓度、戏剧化宣泄、感染力，或危机下的情绪切断。',
            markers: '审讯特征：泪水与怒吼、情绪羞耻感，或高压下的冷漠平静。'
          }
        ],
        positions_intro: '每个要素占据第1至第4位中的一个位置，由三条正交属性轴共同决定：',
        axes_legend: '【强势 / 弱势】能量储备  •  【结果型 / 过程型】独白或反复拉锯  •  【主导型 / 适应型】自我优先或顺应他人',
        positions_list: [
          {
            pos: '第1位置 — “君王”（过剩）',
            axes: ['强势', '结果型', '主导型'],
            summary: '能量充沛且独白式输出。视自身主权为理所当然，无需争辩，不受外界嘲讽动摇。'
          },
          {
            pos: '第2位置 — “大师”（规范）',
            axes: ['强势', '过程型', '适应型'],
            summary: '游刃有余的双向互动。灵活协调，乐于对话，没有病态防御心。'
          },
          {
            pos: '第3位置 — “裂痕 / 痛处”（情结）',
            axes: ['弱势', '过程型', '主导型'],
            summary: '脆弱、防御与过度纠结。深陷自我怀疑且极度在意他人目光，但绝不肯屈服，绝境中能爆发出极限突破。'
          },
          {
            pos: '第4位置 — “静默”（淡漠）',
            axes: ['弱势', '结果型', '适应型'],
            summary: '节能与顺应。乐于交出主导权，在极端高压下最先关闭消耗。'
          }
        ],
        sim_title: '实战训练器 — 心理击破机制',
        sim_instruction: '阅读下方测试嫌疑人证词，点击匹配的功能铭牌体验“心理击破”：',
        sim_quote: '“你们都在背后窃窃私语，觉得我是个没骨气的棋子吗？！没错，我的手在发抖……但我绝不让你们替我做决定——这一步我自己走！”',
        sim_options: [
          {
            code: '1В',
            label: '第一意志（强势 / 结果型 / 主导型）',
            correct: false,
            feedback: '偏差：第一意志不会在意背后的议论，更不会为双手发抖而产生屈辱感。'
          },
          {
            code: '3В',
            label: '第三意志（弱势 / 过程型 / 主导型）',
            correct: true,
            feedback: '心理击破成功！当你同时锁定【弱势】自我怀疑、【过程型】对旁人目光的敏感拉锯与【主导型】夺回自主权的执念时，即可瞬间瓦解目标心理防线！'
          },
          {
            code: '4В',
            label: '第四意志（弱势 / 结果型 / 适应型）',
            correct: false,
            feedback: '偏差：第四意志在危机中倾向于平静让渡决定权，而非激烈反抗。'
          }
        ]
      }
    },

    de: {
      app_title: 'PSYCHO-PROFILE',
      loading_status: 'ENGINE-KERN WIRD INITIALISIERT & DATENSCHEMA VALIDIERT...',
      menu_start_btn: '[ ERMITTLUNG STARTEN ]',
      menu_tutorial_btn: '[ TYPOLOGIE-DATENBANK ]',
      menu_settings_btn: '[ EINSTELLUNGEN ]',
      menu_select_mode: 'PROFILING-MODUS',
      mode_scout_name: 'KADETT',
      mode_scout_desc: 'Funktionsachsen sichtbar, Timer auf 60 Sek. erweitert, Beweisanalyse verfügbar.',
      mode_mindhunter_name: 'PROFILER',
      mode_mindhunter_desc: 'Nur Funktionscodes, strikter 30-Sek.-Krisentimer, keine Hinweise, Punkte ×1.5.',
      hud_case: 'FALL',
      hud_accuracy: 'PRÄZISION',
      hud_score: 'PUNKTE',
      hud_timer: 'TIMER',
      timer_sec_unit: 'Sek.',
      hud_menu_btn: 'MENÜ',
      dlg_continue: 'WEITER ▸',
      dlg_climax_badge: 'KLIMAX — PULSSPITZE',
      verdict_header: 'URTEIL FESTLEGEN',
      verdict_subheader_scout: 'KADETTENMODUS: ACHSEN AKTIV',
      verdict_subheader_pro: 'PROFILER: KRISENTIMER LÄUFT',
      hint_btn_label: '[ BEWEISANALYSE ]',
      hint_box_title: 'TAKTISCHER PROFILER-HINWEIS:',
      verdict_win_tag: 'DURCHBRUCH — ABWEHR DURCHBROCHEN',
      verdict_lose_tag: 'ANALYSEFEHLER — FEHLURTEIL',
      verdict_timeout_tag: 'WILLENSSTARRE — ZEIT ABGELAUFEN',
      verdict_chosen_label: 'IHRE WAHL:',
      verdict_correct_label: 'WAHRES PROFIL:',
      verdict_timeout_value: 'ZEITÜBERSCHREITUNG — ZEIT ABGELAUFEN',
      verdict_axes_label: 'KANONISCHE FUNKTIONSACHSEN:',
      verdict_breakdown_label: 'ANALYTISCHE SCHLUSSFOLGERUNG:',
      verdict_to_summary_btn: '[ ZUR FALLAKTE WEITERGEHEN ▸ ]',
      summary_header: 'ABSCHLUSSBERICHT DER ERMITTLUNG',
      summary_status_solved: 'STATUS: SUBJEKT ENTSCHLÜSSELT (DURCHBRUCH)',
      summary_status_failed: 'STATUS: PROFILING FEHLGESCHLAGEN',
      summary_failed_explanation_prefix: 'Profilierung fehlgeschlagen. Referenzfunktion des Objekts: ',
      summary_metric_case: 'UNTERSUCHTER FALL',
      summary_metric_profile: 'SCHLÜSSELFUNKTION',
      summary_metric_score: 'SITZUNGSPUNKTE',
      summary_metric_accuracy: 'GESAMTPRÄZISION',
      summary_metric_time: 'VERBLEIBENDE ZEIT',
      summary_next_case_btn: '[ NÄCHSTER FALL ▸ ]',
      summary_retry_btn: '[ SZENE WIEDERHOLEN ]',
      summary_menu_btn: '[ HAUPTMENÜ ]',
      close_btn: '[ SCHLIESSEN ]',
      settings_title: 'EINSTELLUNGEN',
      settings_sec_lang: 'SPRACHE',
      settings_sec_audio: 'AUDIO',
      settings_master_vol: 'Gesamtlautstärke',
      settings_bgm_label: 'Musik (BGM)',
      settings_sfx_label: 'Soundeffekte (SFX)',
      settings_sink_label: 'Ausgabegerät',
      settings_sink_default: 'Systemstandard (Lautsprecher / Kopfhörer)',
      settings_sink_fallback_prefix: 'Audioausgang',
      settings_sink_unsupported: 'Systemstandard-Ausgang',
      settings_sec_visual: 'GRAFIK',
      settings_shake_label: 'Bildschirmwackeln',
      settings_crt_label: 'CRT-Effekte / Scanlines',
      settings_fullscreen_label: 'Vollbildmodus',
      settings_fullscreen_enter: '[ VOLLBILD ]',
      settings_fullscreen_exit: '[ FENSTERMODUS ]',
      toggle_on: 'EIN',
      toggle_off: 'AUS',
      settings_resume_btn: '[ FORTSETZEN ]',
      settings_to_menu_btn: '[ ZUM HAUPTMENÜ ]',
      breakthrough_banner: 'DURCHBRUCH',
      ach_unlocked_prefix: 'ERRUNGENSCHAFT FREIGESCHALTET',
      ach_names: {
        FIRST_BREAKTHROUGH: 'Erster Durchbruch',
        MINDHUNTER_MASTERY: 'Kaltblütiger Profiler',
        WILL_STUPOR: 'Willensstarre',
        THEORY_INITIATE: 'Adept der Typologie',
        FULL_DOSSIER_CLEAR: 'Archivar der Seelen'
      },
      tutorial: {
        header: 'TYPOLOGIE-DATENBANK',
        back_btn: '[ ◂ ZURÜCK ZUM MENÜ ]',
        start_case_btn: '[ DIREKT ZUR ERMITTLUNG ▸ ]',
        tab_aspects: '01 — 4 ASPEKTE',
        tab_positions: '02 — 4 POSITIONEN & ACHSEN',
        tab_simulator: '03 — DURCHBRUCH-SIMULATOR',
        aspects_intro: 'Die Psychosophie analysiert menschliche Prioritäten über vier fundamentale Existenzaspekte:',
        aspects_list: [
          {
            code: 'W — WILLE (В)',
            title: 'WILLE (Selbstbestimmung, Würde, Führung)',
            desc: 'Steuert Selbstwert, Entscheidungsmacht, Hierarchie und Widerstandskraft des Ichs.',
            markers: 'Verhörmarker: Reaktion auf Demütigung, Befehle, Selbstzweifel oder kompromissloser Eigenwille.'
          },
          {
            code: 'L — LOGIK (Л)',
            title: 'LOGIK (Wahrheit, Struktur, Beweisführung)',
            desc: 'Steuert Kausalanalyse, Argumentation, Skepsis und den Anspruch auf geistige Präzision.',
            markers: 'Verhörmarker: Diskussionsstil, Angst vor Denkfehlern, Dogmatismus vs. endloses Nachprüfen.'
          },
          {
            code: 'P — PHYSIK (Ф)',
            title: 'PHYSIK (Körper, Materie, Raum, Überleben)',
            desc: 'Steuert Körpergefühl, Schmerz, Ressourcen, Territorium und physischen Instinkt.',
            markers: 'Verhörmarker: Motorische Ruhe vs. Erstarrung, Umgang mit körperlicher Bedrohung.'
          },
          {
            code: 'E — EMOTION (Э)',
            title: 'EMOTION (Affekt, Ausdruck, Resonanz)',
            desc: 'Steuert Gefühlsintensität, Dramatik, Stimmfärbung oder emotionale Abschaltung.',
            markers: 'Verhörmarker: Tränen, Wutausbrüche, Scham über Gefühle oder kühle Stille in der Krise.'
          }
        ],
        positions_intro: 'Jeder Aspekt besetzt genau eine Position (1. bis 4.), definiert durch drei Achsen:',
        axes_legend: '[STARK / SCHWACH] Energie  •  [RESULTATIV / PROZESSHAFT] Monolog vs. Ringen  •  [DOMINANT / ANPASSEND] Eigenanspruch vs. Ausgleich',
        positions_list: [
          {
            pos: '1. POSITION — „ZAR“ (ÜBERFLUSS)',
            axes: ['STARK', 'RESULTATIV', 'DOMINANT'],
            summary: 'Monolog und Gewissheit. Beansprucht Führung selbstverständlich und ist immun gegen fremden Spott.'
          },
          {
            pos: '2. POSITION — „MEISTER“ (NORM)',
            axes: ['STARK', 'PROZESSHAFT', 'ANPASSEND'],
            summary: 'Flexibler Dialog auf Augenhöhe. Souverän, kreativ und frei von schmerzhafter Abwehr.'
          },
          {
            pos: '3. POSITION — „WUNDE“ (KOMPLEX)',
            axes: ['SCHWACH', 'PROZESSHAFT', 'DOMINANT'],
            summary: 'Verletzlichkeit und Abwehr. Quälende Selbstzweifel bei gleichzeitigem Stolz — fähig zum explosiven Durchbruch.'
          },
          {
            pos: '4. POSITION — „STILLE“ (GLEICHMUT)',
            axes: ['SCHWACH', 'RESULTATIV', 'ANPASSEND'],
            summary: 'Energiesparmodus. Delegiert mühelos und schaltet unter Extremlast zuerst ab.'
          }
        ],
        sim_title: 'PRAXISTRAINER — DURCHBRUCH-MECHANIK',
        sim_instruction: 'Lesen Sie die Test-Aussage und klicken Sie auf die passende Funktion, um einen Durchbruch auszulösen:',
        sim_quote: '„Ihr flüstert hinter meinem Rücken, als wäre ich eine rückgratlose Figur?! Ja, meine Hände zittern... aber ich lasse euch NICHT über mich bestimmen — diesen Schritt gehe ich selbst!“',
        sim_options: [
          {
            code: '1В',
            label: '1. Wille (Stark / Resultativ / Dominant)',
            correct: false,
            feedback: 'Verfehlt: Der 1. Wille kümmert sich nicht um Geflüster hinter seinem Rücken.'
          },
          {
            code: '3В',
            label: '3. Wille (Schwach / Prozesshaft / Dominant)',
            correct: true,
            feedback: 'DURCHBRUCH AKTIVIERT! Die Kombination aus [SCHWACH] Zittern & Scham, [PROZESSHAFT] Fokus auf fremde Blicke und [DOMINANT] unbeugsamem Selbstbestimmungsdrang sprengt die Schutzmauer!'
          },
          {
            code: '4В',
            label: '4. Wille (Schwach / Resultativ / Anpassend)',
            correct: false,
            feedback: 'Verfehlt: Der 4. Wille gibt in Krisen ruhig nach, statt stolz zu rebellieren.'
          }
        ]
      }
    },

    ja: {
      app_title: 'PSYCHO-PROFILE',
      loading_status: 'エンジンコア初期化およびスキーマ検証を実行中...',
      menu_start_btn: '[ 捜査を開始する ]',
      menu_tutorial_btn: '[ 類型論データベース ]',
      menu_settings_btn: '[ 設定 ]',
      menu_select_mode: 'プロファイリングモード',
      mode_scout_name: 'カデット',
      mode_scout_desc: '機能軸を表示、タイマー60秒に緩和、証拠分析ヒントが使用可能。',
      mode_mindhunter_name: 'プロファイラー',
      mode_mindhunter_desc: '機能コードのみ表示、厳格な30秒クライシスタイマー、ヒントなし、スコア×1.5。',
      hud_case: '事件',
      hud_accuracy: '精度',
      hud_score: 'スコア',
      hud_timer: 'タイマー',
      timer_sec_unit: '秒',
      hud_menu_btn: 'メニュー',
      dlg_continue: '次へ ▸',
      dlg_climax_badge: 'クライマックス — 心拍急上昇',
      verdict_header: '最終プロファイルを断定せよ',
      verdict_subheader_scout: 'カデット：軸ガイド有効',
      verdict_subheader_pro: 'プロ：クライシスタイマー稼働中',
      hint_btn_label: '[ 証拠分析ヒント ]',
      hint_box_title: '戦術プロファイリング・ヒント：',
      verdict_win_tag: '心理撃破 — 防壁を粉砕',
      verdict_lose_tag: '分析エラー — 判定不一致',
      verdict_timeout_tag: '意志硬直 — タイムアウト',
      verdict_chosen_label: 'あなたの判定：',
      verdict_correct_label: '真のプロファイル：',
      verdict_timeout_value: 'タイムアウト — 時間切れ',
      verdict_axes_label: '機能のカノン3軸特性：',
      verdict_breakdown_label: '分析結果：',
      verdict_to_summary_btn: '[ 事件総括レポートへ進む ▸ ]',
      summary_header: '捜査最終プロファイル調書',
      summary_status_solved: 'ステータス：被験者の核心を撃破',
      summary_status_failed: 'ステータス：プロファイリング失敗',
      summary_failed_explanation_prefix: 'プロファイリング失敗。対象の基準機能：',
      summary_metric_case: '分析対象ケース',
      summary_metric_profile: '主要機能',
      summary_metric_score: 'セッションスコア',
      summary_metric_accuracy: '総合プロファイル精度',
      summary_metric_time: '残り時間',
      summary_next_case_btn: '[ 次の事件へ ▸ ]',
      summary_retry_btn: '[ シーンを再挑戦 ]',
      summary_menu_btn: '[ メインメニューへ ]',
      close_btn: '[ 閉じる ]',
      settings_title: '設定',
      settings_sec_lang: '言語',
      settings_sec_audio: 'オーディオ',
      settings_master_vol: 'マスター音量',
      settings_bgm_label: '音楽 (BGM)',
      settings_sfx_label: '効果音 (SFX)',
      settings_sink_label: '出力デバイス',
      settings_sink_default: 'システム既定（スピーカー / ヘッドホン）',
      settings_sink_fallback_prefix: 'オーディオ出力',
      settings_sink_unsupported: 'システム既定の出力',
      settings_sec_visual: 'ビジュアル',
      settings_shake_label: '画面シェイク',
      settings_crt_label: 'CRT / スキャンライン',
      settings_fullscreen_label: '表示モード',
      settings_fullscreen_enter: '[ フルスクリーン ]',
      settings_fullscreen_exit: '[ ウィンドウ表示 ]',
      toggle_on: 'ON',
      toggle_off: 'OFF',
      settings_resume_btn: '[ 捜査に戻る ]',
      settings_to_menu_btn: '[ メインメニューへ戻る ]',
      breakthrough_banner: '心理撃破',
      ach_unlocked_prefix: '実績解除',
      ach_names: {
        FIRST_BREAKTHROUGH: '初の心理撃破',
        MINDHUNTER_MASTERY: '冷徹なる分析官',
        WILL_STUPOR: '意志硬直',
        THEORY_INITIATE: '類型論の修習者',
        FULL_DOSSIER_CLEAR: '魂の記録官'
      },
      tutorial: {
        header: '類型論データベース',
        back_btn: '[ ◂ メニューに戻る ]',
        start_case_btn: '[ 直ちに捜査を開始 ▸ ]',
        tab_aspects: '01 — 4つの側面',
        tab_positions: '02 — 4つの順位と3軸',
        tab_simulator: '03 — 心理撃破演習',
        aspects_intro: 'サイコソフィー（心理ソフィー）は、人間の精神的優先順位を4つの根源的側面から解明します：',
        aspects_list: [
          {
            code: 'В — 意志 (WILL)',
            title: '意志（主体性・尊厳・自己決定）',
            desc: '自尊心、決断権、序列意識、自らの運命を握る推進力を司る中核側面。',
            markers: '尋問サイン：屈辱や命令への反応、極限での決断、自己卑下と強烈な意地の交錯。'
          },
          {
            code: 'Л — 論理 (LOGIC)',
            title: '論理（真理・構造・証明）',
            desc: '因果関係、議論、懐疑、論理的整合性と知的権威への態度を司る。',
            markers: '尋問サイン：議論への姿勢、論理的欠陥への恐怖、独断または無限の再検証。'
          },
          {
            code: 'Ф — 物理 (PHYSICS)',
            title: '物理（身体・物質・空間・生存本能）',
            desc: '身体感覚、痛み、資源、縄張り、物理的な生存感覚を司る。',
            markers: '尋問サイン：身体の硬直または柔軟な身のこなし、物理的脅威への反応。'
          },
          {
            code: 'Э — 感情 (EMOTION)',
            title: '感情（情動・表現・共鳴）',
            desc: '感情の振幅、劇的な表現、声の熱量、あるいは危機における感情遮断を司る。',
            markers: '尋問サイン：涙や激昂、感情露出への羞恥、または死線での冷ややかな凪。'
          }
        ],
        positions_intro: '4つの側面はそれぞれ第1〜第4順位のいずれかを占め、3つの軸の交差点で定義されます：',
        axes_legend: '【強 / 弱】エネルギー量  •  【リザルト / プロセス】独白か反芻か  •  【ドミナント / アジャスト】自己優先か調和か',
        positions_list: [
          {
            pos: '第1順位 — 『王』（過剰・独白）',
            axes: ['強', 'リザルト', 'ドミナント'],
            summary: '圧倒的な確信とトップダウンの決断。他者の嘲笑に揺らがず、議論を必要としない。'
          },
          {
            pos: '第2順位 — 『職人』（規範・対話）',
            axes: ['強', 'プロセス', 'アジャスト'],
            summary: '柔軟で安定した対話型。防衛的にならず、状況や他者と自在に協調できる。'
          },
          {
            pos: '第3順位 — 『傷口 / コンプレックス』（防衛）',
            axes: ['弱', 'プロセス', 'ドミナント'],
            summary: '過敏な傷つきやすさと強烈なプライドの同居。激しい自己疑念に苦しみながらも決して屈服せず、極限で爆発的な突破を見せる。'
          },
          {
            pos: '第4順位 — 『凪』（省エネ・受容）',
            axes: ['弱', 'リザルト', 'アジャスト'],
            summary: '執着の薄さと委任。極限ストレス下では真っ先にスイッチを切って消耗を防ぐ。'
          }
        ],
        sim_title: '実践シミュレーター — 心理撃破演習',
        sim_instruction: '以下のテスト証言を読み、該当する機能プレートをクリックして心理撃破演出を確認せよ：',
        sim_quote: '「お前ら全員、陰で俺を骨抜きだと笑っているのか！？ああ、手は震えてるさ……だが断じてお前らには決めさせねえ、この一歩は俺自身が踏み出すっ！」',
        sim_options: [
          {
            code: '1В',
            label: '第1意志（強 / リザルト / ドミナント）',
            correct: false,
            feedback: '不一致：第1意志は陰口に過敏に反応したり、手の震えに引け目を感じたりしない。'
          },
          {
            code: '3В',
            label: '第3意志（弱 / プロセス / ドミナント）',
            correct: true,
            feedback: '心理撃破発動！【弱】震えと自己疑念＋【プロセス】周囲の視線への過敏な反応＋【ドミナント】決定権を譲らない意地の3軸が一致し、心理防壁が撃破された！'
          },
          {
            code: '4В',
            label: '第4意志（弱 / リザルト / アジャスト）',
            correct: false,
            feedback: '不一致：第4意志は危機において穏やかに主導権を委ねるため、激しい反発は起こさない。'
          }
        ]
      }
    }
  };

  class I18nManager {
    constructor() {
      this._lang = 'ru';
    }

    getSupportedLanguages() {
      return SUPPORTED_LANGS.slice();
    }

    getLanguageNames() {
      return LANGUAGE_NAMES;
    }

    getLang() {
      return this._lang;
    }

    setLang(code) {
      if (SUPPORTED_LANGS.includes(code)) {
        this._lang = code;
        return true;
      }
      return false;
    }

    /**
     * Resolve UI dictionary key for active language with RU/EN fallback.
     * @param {string} key
     * @returns {*}
     */
    t(key) {
      const dict = DICTIONARIES[this._lang] || DICTIONARIES.ru;
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        return dict[key];
      }
      if (Object.prototype.hasOwnProperty.call(DICTIONARIES.ru, key)) {
        return DICTIONARIES.ru[key];
      }
      return key;
    }

    /**
     * Resolve localized field from scenarios.json (`{"ru": "...", "en": "...", ...}`)
     * @param {Object|string} field
     * @returns {string}
     */
    localizeField(field) {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      if (typeof field === 'object') {
        return field[this._lang] || field.ru || field.en || Object.values(field)[0] || '';
      }
      return String(field);
    }

    /**
     * Return bare function name for Mindhunter Mode (e.g. "[3В] 3-я Воля")
     * @param {string} functionCode
     * @returns {string}
     */
    getBareFunctionLabel(functionCode) {
      const entry = BARE_FUNCTION_LABELS[functionCode];
      if (!entry) return `[${functionCode}]`;
      const name = entry[this._lang] || entry.ru;
      return `[${functionCode}] ${name}`;
    }

    getAchievementTitle(id) {
      const dict = DICTIONARIES[this._lang] || DICTIONARIES.ru;
      return (dict.ach_names && dict.ach_names[id]) || id;
    }
  }

  global.PsychoI18n = new I18nManager();
})(window);
