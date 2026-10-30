/**
 * PSYCHO-PROFILE // ANALYZER
 * Multilingual Dictionary & Typology Database (i18n.js)
 * Supported Steam Release Locales: RU, EN, ZH, DE, JA
 */
(function (global) {
  'use strict';

  const SUPPORTED_LANGS = ['ru', 'en', 'zh', 'de', 'ja'];

  const LANGUAGE_NAMES = {
    ru: 'RU // РУССКИЙ',
    en: 'EN // ENGLISH',
    zh: 'ZH // 简体中文',
    de: 'DE // DEUTSCH',
    ja: 'JA // 日本語'
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
      app_title: 'PSYCHO-PROFILE // АНАЛИЗАТОР',
      app_subtitle: 'ТЕРМИНАЛ КРИМИНАЛИСТИЧЕСКОЙ ПСИХОСОФИИ v2.4 [STEAM AUTONOMOUS BUILD]',
      loading_status: 'ИНИЦИАЛИЗАЦИЯ ЯДРА И ВАЛИДАЦИЯ СХЕМЫ ДАННЫХ...',
      menu_start_btn: '[ НАЧАТЬ РАССЛЕДОВАНИЕ ]',
      menu_tutorial_btn: '[ БАЗА ТИПОЛОГИЙ // ОБУЧЕНИЕ ]',
      menu_settings_btn: '[ НАСТРОЙКИ И ЯЗЫК ]',
      menu_select_mode: 'РЕЖИМ ПРОФИЛИРОВАНИЯ',
      mode_scout_name: 'КАДЕТ // НОВИЧОК (SCOUT)',
      mode_scout_desc: 'На кнопках отображаются оси функции, таймер расширен до 30 сек, открыт «Анализ улик».',
      mode_mindhunter_name: 'ПРОФАЙЛЕР // ПРОФИ (MINDHUNTER)',
      mode_mindhunter_desc: 'Только голые коды функций, жесткий кризис-таймер 15 сек, без подсказок, очки x1.5.',
      hud_case: 'ДЕЛО',
      hud_phase: 'ФАЗА',
      hud_accuracy: 'ТОЧНОСТЬ',
      hud_score: 'СЧЕТ',
      hud_timer: 'НАПРЯЖЕНИЕ',
      hud_backlog_btn: 'ИСТОРИЯ [L]',
      hud_menu_btn: 'МЕНЮ [ESC]',
      dlg_continue: 'SPACE / ENTER / КЛИК — ДАЛЕЕ ▸',
      dlg_climax_badge: 'КУЛЬМИНАЦИЯ // СКАЧОК ПУЛЬСА',
      verdict_header: 'ВЫНЕСИТЕ ВЕРДИКТ',
      verdict_subheader_scout: 'РЕЖИМ КАДЕТА: ОСИ АКТИВНЫ',
      verdict_subheader_pro: 'РЕЖИМ ПРОФИ: КРИЗИС-ТАЙМЕР',
      hint_btn_label: '[H] АНАЛИЗ УЛИК',
      hint_box_title: 'ТАКТИЧЕСКАЯ ПОДСКАЗКА ПРОФАЙЛЕРА:',
      controls_bar: '[SPACE/ENTER] Далее/Выбор  •  [↑/↓] Навигация  •  [1-4] Быстрый вердикт  •  [L / Колесо↑] История  •  [ESC] Пауза',
      verdict_win_tag: 'BREAKTHROUGH // ПСИХОЗАЩИТА ВСКРЫТА',
      verdict_lose_tag: 'ОШИБКА АНАЛИЗА // НЕВЕРНЫЙ ВЕРДИКТ',
      verdict_timeout_tag: 'СТУПОР ВОЛИ // ИСТЕЧЕНИЕ ВРЕМЕНИ',
      verdict_chosen_label: 'ВАШ ВЫБОР:',
      verdict_correct_label: 'ИСТИННЫЙ ПРОФИЛЬ:',
      verdict_timeout_value: 'НЕРЕШИТЕЛЬНОСТЬ [ТАЙМ-АУТ]',
      verdict_axes_label: 'КАНОНИЧЕСКИЕ ОСИ ФУНКЦИИ:',
      verdict_breakdown_label: 'ПСИХОСОФСКОЕ ВСКРЫТИЕ ( ПО АФАНАСЬЕВУ ):',
      verdict_to_summary_btn: '[ ПЕРЕЙТИ К СВОДКЕ ДЕЛА ▸ ]',
      summary_header: 'ИТОГОВОЕ ДОСЬЕ СЛЕДСТВИЯ',
      summary_status_solved: 'СТАТУС: СУБЪЕКТ РАСКОЛОТ (ПРОРЫВ)',
      summary_status_failed: 'СТАТУС: ОШИБКА ПРОФИЛИРОВАНИЯ',
      summary_metric_case: 'ОБЪЕКТ АНАЛИЗА',
      summary_metric_profile: 'ДОМИНАНТНЫЙ РАДИКАЛ СЦЕНЫ',
      summary_metric_score: 'НАБРАННЫЕ ОЧКИ СЕССИИ',
      summary_metric_accuracy: 'ОБЩАЯ ТОЧНОСТЬ ПРОФАЙЛЕРА',
      summary_metric_time: 'ОСТАТОК КРИЗИС-ТАЙМЕРА',
      summary_next_case_btn: '[ СЛЕДУЮЩЕЕ ДЕЛО ▸ ]',
      summary_retry_btn: '[ ПОВТОРИТЬ СЦЕНУ ]',
      summary_menu_btn: '[ В ГЛАВНОЕ МЕНЮ ]',
      backlog_title: 'ЖУРНАЛ ДОПРОСА // BACKLOG',
      backlog_empty: 'Записи реплик пока отсутствуют.',
      backlog_current_tag: 'ТЕКУЩЕЕ ДЕЛО',
      backlog_past_tag: 'АРХИВ СЕССИИ',
      close_btn: '[ ЗАКРЫТЬ // ESC ]',
      settings_title: 'СИСТЕМНЫЕ НАСТРОЙКИ ТЕРМИНАЛА',
      settings_lang_label: 'ЯЗЫК ИНТЕРФЕЙСА И СЦЕНАРИЕВ (STEAM i18n):',
      settings_audio_label: 'СИНТЕЗАТОР ЗВУКА (WEB AUDIO API):',
      settings_audio_on: 'ВКЛЮЧЕН',
      settings_audio_off: 'ВЫКЛЮЧЕН',
      settings_scout_notimer_label: 'ТАЙМЕР В РЕЖИМЕ НОВИЧКА:',
      settings_scout_30s: '30 СЕКУНД (СТАНДАРТ)',
      settings_scout_off: 'ОТКЛЮЧЕН (БЕЗ ЛИМИТА)',
      settings_resume_btn: '[ ПРОДОЛЖИТЬ ]',
      settings_to_menu_btn: '[ ВЫЙТИ В ГЛАВНОЕ МЕНЮ ]',
      ach_unlocked_prefix: 'ДОСТИЖЕНИЕ STEAM ОТКРЫТО',
      ach_names: {
        FIRST_BREAKTHROUGH: 'Первое вскрытие (First Breakthrough)',
        MINDHUNTER_MASTERY: 'Хладнокровный Профайлер (Mindhunter)',
        WILL_STUPOR: 'Ступор Воли (Paralysis of Choice)',
        THEORY_INITIATE: 'Адепт Синтаксиса (Typology Initiate)',
        FULL_DOSSIER_CLEAR: 'Архивариус Душ (Full Dossier)'
      },
      tutorial: {
        header: 'ОБУЧЕНИЕ // БАЗА ТИПОЛОГИЙ АФАНАСЬЕВА',
        back_btn: '[ ◂ ВЕРНУТЬСЯ В МЕНЮ ]',
        start_case_btn: '[ СРАЗУ К РАССЛЕДОВАНИЮ ▸ ]',
        tab_aspects: '01 // 4 АСПЕКТА',
        tab_positions: '02 // 4 ПОЗИЦИИ И ОСИ',
        tab_simulator: '03 // ТРЕНАЖЕР BREAKTHROUGH',
        aspects_intro: 'Психософия исследует приоритеты информационно-энергетического обмена человека по четырем фундаментальным аспектам бытия:',
        aspects_list: [
          {
            code: 'В // ВОЛЯ',
            title: 'ВОЛЯ (Субъектность, Власть, Стержень)',
            desc: 'Отвечает за чувство собственного достоинства, право принимать решения, иерархию, ответственность за судьбу и устойчивость намерения.',
            markers: 'Маркеры в допросе: реакция на унижение, приказы, выбор в тупике, фразы «я решу сам», «я ничтожество» или «будет по-моему».'
          },
          {
            code: 'Л // ЛОГИКА',
            title: 'ЛОГИКА (Истина, Структура, Доказательство)',
            desc: 'Отвечает за построение причинно-следственных связей, отношение к аргументам, теориям, сомнениям и интеллектуальному авторитету.',
            markers: 'Маркеры в допросе: отношение к спору, страх логической ошибки, догматизм выводов либо бесконечная перепроверка фактов.'
          },
          {
            code: 'Ф // ФИЗИКА',
            title: 'ФИЗИКА (Материя, Тело, Ресурс, Пространство)',
            desc: 'Отвечает за контакт с телом, болью, вещами, деньгами, территорией, бытом и инстинктом физического выживания.',
            markers: 'Маркеры в допросе: телесная скованность или ловкость, брезгливость, жадность/щедрость, реакция на физическую угрозу.'
          },
          {
            code: 'Э // ЭМОЦИЯ',
            title: 'ЭМОЦИЯ (Аффект, Переживание, Экспрессия)',
            desc: 'Отвечает за глубину и громкость чувств, драматизм, искренность интонаций, эмоциональное заражение или холодный штиль.',
            markers: 'Маркеры в допросе: слезы, пафос, истерика, стыд за проявление чувств либо полное отключение эмоций в кризисе.'
          }
        ],
        positions_intro: 'Каждый из 4 аспектов занимает строго одну позицию в иерархии (от 1-й до 4-й). Позиция определяется пересечением трех осей:',
        axes_legend: '[СИЛЬНАЯ / СЛАБАЯ] — запас энергии  •  [РЕЗУЛЬТАТИВНАЯ / ПРОЦЕССИОННАЯ] — монолог или диалог  •  [ДОМИНАНТНАЯ / ПОДСТРАИВАЮЩАЯСЯ] — принципиальность «Я» или учет «Другого»',
        positions_list: [
          {
            pos: '1-я ПОЗИЦИЯ // «ЦАРЬ» (МОЛОТ)',
            axes: ['СИЛЬНАЯ', 'РЕЗУЛЬТАТИВНАЯ', 'ДОМИНАНТНАЯ'],
            summary: 'Избыток и монолог. Уверена в своем праве по умолчанию, не нуждается в обсуждении и не зависит от чужой оценки. Действует сверху вниз, быстро и бескомпромиссно.'
          },
          {
            pos: '2-я ПОЗИЦИЯ // «МАСТЕР» (РЕКА)',
            axes: ['СИЛЬНАЯ', 'ПРОЦЕССИОННАЯ', 'ПОДСТРАИВАЮЩАЯСЯ'],
            summary: 'Норма, гибкость и диалог. Свободно и без страха вовлекает других в совместный процесс, легко маневрирует, не самоутверждается за чужой счет.'
          },
          {
            pos: '3-я ПОЗИЦИЯ // «ЯЗВА» (КОМПЛЕКС)',
            axes: ['СЛАБАЯ', 'ПРОЦЕССИОННАЯ', 'ДОМИНАНТНАЯ'],
            summary: 'Уязвимость, защита и суперпроцесс. Мучительно сомневается в себе, гиперчувствительна к насмешкам, но яростно отказывается подчиняться. В кризисе способна на отчаянное сверхусилие.'
          },
          {
            pos: '4-я ПОЗИЦИЯ // «ШТИЛЬ» (ПУСТЯЧОК)',
            axes: ['СЛАБАЯ', 'РЕЗУЛЬТАТИВНАЯ', 'ПОДСТРАИВАЮЩАЯСЯ'],
            summary: 'Безразличие и энергосбережение. Легко делегирует сферу другим, принимает готовый результат, а в экстремальной перегрузке первой «отключается».'
          }
        ],
        sim_title: 'ПРАКТИЧЕСКИЙ СИМУЛЯТОР // МЕХАНИКА BREAKTHROUGH',
        sim_instruction: 'Прочитайте тестовую реплику подозреваемого и нажмите на плашку верной функции, чтобы испытать эффект «Прорыва» (Breakthrough):',
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
            feedback: 'BREAKTHROUGH АКТИВИРОВАН! Когда вы точно определяете все три оси ядра подозреваемого ([СЛАБАЯ] дрожь и боль самооценки + [ПРОЦЕССИОННАЯ] фиксация на чужом шепоте + [ДОМИНАНТНАЯ] «не позволю решать за меня»), защита субъекта рушится, фиксируя психологический прорыв!'
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
      app_title: 'PSYCHO-PROFILE // ANALYZER',
      app_subtitle: 'FORENSIC PSYCHOSOPHY TERMINAL v2.4 [STEAM AUTONOMOUS BUILD]',
      loading_status: 'INITIALIZING ENGINE CORE & VALIDATING DATA SCHEMA...',
      menu_start_btn: '[ START INVESTIGATION ]',
      menu_tutorial_btn: '[ TYPOLOGY DATABASE // TUTORIAL ]',
      menu_settings_btn: '[ SETTINGS & LANGUAGE ]',
      menu_select_mode: 'SELECT PROFILING DIFFICULTY',
      mode_scout_name: 'CADET // SCOUT MODE',
      mode_scout_desc: 'Verdict plates display function axes, Crisis Timer extended to 30s, Evidence Hint unlocked.',
      mode_mindhunter_name: 'PROFILER // MINDHUNTER MODE',
      mode_mindhunter_desc: 'Bare function codes only, strict 15s red Crisis Timer, hints disabled, 1.5x score multiplier.',
      hud_case: 'CASE',
      hud_phase: 'PHASE',
      hud_accuracy: 'ACCURACY',
      hud_score: 'SCORE',
      hud_timer: 'TENSION',
      hud_backlog_btn: 'BACKLOG [L]',
      hud_menu_btn: 'MENU [ESC]',
      dlg_continue: 'SPACE / ENTER / CLICK — ADVANCE ▸',
      dlg_climax_badge: 'CLIMAX // BIOMETRIC SPIKE',
      verdict_header: 'LOCK YOUR VERDICT',
      verdict_subheader_scout: 'SCOUT MODE: AXES VISIBLE',
      verdict_subheader_pro: 'MINDHUNTER: CRISIS TIMER ACTIVE',
      hint_btn_label: '[H] EVIDENCE CLUE',
      hint_box_title: 'TACTICAL PROFILER CLUE:',
      controls_bar: '[SPACE/ENTER] Advance/Confirm  •  [↑/↓] Navigate  •  [1-4] Quick Verdict  •  [L / Wheel↑] Backlog  •  [ESC] Pause',
      verdict_win_tag: 'BREAKTHROUGH // DEFENSE SHATTERED',
      verdict_lose_tag: 'ANALYSIS ERROR // MISJUDGMENT',
      verdict_timeout_tag: 'WILL STUPOR // TIME EXPIRED',
      verdict_chosen_label: 'YOUR VERDICT:',
      verdict_correct_label: 'TRUE PROFILE:',
      verdict_timeout_value: 'INDECISION [TIMEOUT]',
      verdict_axes_label: 'CANONICAL FUNCTION AXES:',
      verdict_breakdown_label: 'PSYCHOSOPHICAL AUTOPSY (AFANASYEV MODEL):',
      verdict_to_summary_btn: '[ PROCEED TO CASE SUMMARY ▸ ]',
      summary_header: 'FINAL INVESTIGATION DOSSIER',
      summary_status_solved: 'STATUS: SUBJECT PROFILED (BREAKTHROUGH)',
      summary_status_failed: 'STATUS: PROFILING FAILURE',
      summary_metric_case: 'ANALYZED CASE',
      summary_metric_profile: 'CORE SCENE FUNCTION',
      summary_metric_score: 'SESSION SCORE',
      summary_metric_accuracy: 'OVERALL PROFILER ACCURACY',
      summary_metric_time: 'REMAINING CRISIS WINDOW',
      summary_next_case_btn: '[ NEXT CASE ▸ ]',
      summary_retry_btn: '[ RETRY SCENE ]',
      summary_menu_btn: '[ MAIN MENU ]',
      backlog_title: 'INTERROGATION LOG // BACKLOG',
      backlog_empty: 'No dialogue entries recorded yet.',
      backlog_current_tag: 'ACTIVE CASE',
      backlog_past_tag: 'SESSION ARCHIVE',
      close_btn: '[ CLOSE // ESC ]',
      settings_title: 'TERMINAL SYSTEM SETTINGS',
      settings_lang_label: 'INTERFACE & SCENARIO LANGUAGE (STEAM i18n):',
      settings_audio_label: 'WEB AUDIO SYNTHESIZER:',
      settings_audio_on: 'ENABLED',
      settings_audio_off: 'MUTED',
      settings_scout_notimer_label: 'SCOUT MODE TIMER:',
      settings_scout_30s: '30 SECONDS (DEFAULT)',
      settings_scout_off: 'DISABLED (UNLIMITED)',
      settings_resume_btn: '[ RESUME ]',
      settings_to_menu_btn: '[ RETURN TO MAIN MENU ]',
      ach_unlocked_prefix: 'STEAM ACHIEVEMENT UNLOCKED',
      ach_names: {
        FIRST_BREAKTHROUGH: 'First Breakthrough',
        MINDHUNTER_MASTERY: 'Cold-Blooded Mindhunter',
        WILL_STUPOR: 'Will Stupor (Paralysis of Choice)',
        THEORY_INITIATE: 'Syntax Initiate',
        FULL_DOSSIER_CLEAR: 'Archivist of Souls'
      },
      tutorial: {
        header: 'TUTORIAL // AFANASYEV TYPOLOGY DATABASE',
        back_btn: '[ ◂ BACK TO MENU ]',
        start_case_btn: '[ JUMP TO INVESTIGATION ▸ ]',
        tab_aspects: '01 // 4 ASPECTS',
        tab_positions: '02 // 4 POSITIONS & AXES',
        tab_simulator: '03 // BREAKTHROUGH SIMULATOR',
        aspects_intro: 'Psychosophy maps human cognitive-energetic priorities across four fundamental aspects of existence:',
        aspects_list: [
          {
            code: 'W // WILL (В)',
            title: 'WILL (Agency, Sovereignty, Core Drive)',
            desc: 'Governs personal dignity, decision-making authority, hierarchy, ownership of fate, and resolve under pressure.',
            markers: 'Interrogation markers: reaction to humiliation, orders, deadlocks, phrases like "I decide my fate" or acute status shame.'
          },
          {
            code: 'L // LOGIC (Л)',
            title: 'LOGIC (Truth, Structure, Proof)',
            desc: 'Governs causal reasoning, attitude toward arguments, theories, skepticism, and intellectual rigor.',
            markers: 'Interrogation markers: debate behavior, fear of logical flaws, dogmatic conclusions vs endless proof-checking.'
          },
          {
            code: 'P // PHYSICS (Ф)',
            title: 'PHYSICS (Matter, Body, Territory, Survival)',
            desc: 'Governs bodily awareness, pain threshold, material resources, space, comfort, and physical instinct.',
            markers: 'Interrogation markers: motor confidence vs somatic paralysis, territoriality, reaction to physical hazard.'
          },
          {
            code: 'E // EMOTION (Э)',
            title: 'EMOTION (Affect, Expression, Resonance)',
            desc: 'Governs emotional intensity, dramatic expression, tonal sincerity, affective contagion, or emotional shutdown.',
            markers: 'Interrogation markers: tears, rage outbursts, vulnerability about feelings, or icy affective flatness in crisis.'
          }
        ],
        positions_intro: 'Each of the 4 aspects occupies exactly one rank (1st through 4th), defined by three intersecting axes:',
        axes_legend: '[STRONG / WEAK] — energy reserve  •  [RESULTATIVE / PROCESSIONAL] — monologue vs dialogue  •  [DOMINANT / ADAPTING] — self-priority vs alignment',
        positions_list: [
          {
            pos: '1ST POSITION // "TSAR" (EXCESS)',
            axes: ['STRONG', 'RESULTATIVE', 'DOMINANT'],
            summary: 'Abundance and monologue. Treats its authority as self-evident, needs no debate, and ignores external judgment. Acts swiftly top-down.'
          },
          {
            pos: '2ND POSITION // "MASTER" (NORM)',
            axes: ['STRONG', 'PROCESSIONAL', 'ADAPTING'],
            summary: 'Balanced mastery and dialogue. Engages others fluidly without ego defensiveness, adapting creatively in real time.'
          },
          {
            pos: '3RD POSITION // "ULCER" (COMPLEX)',
            axes: ['WEAK', 'PROCESSIONAL', 'DOMINANT'],
            summary: 'Vulnerability, defense, and hyper-process. Suffers acute self-doubt and sensitivity to mockery, yet fiercely refuses submission—capable of explosive breakthroughs.'
          },
          {
            pos: '4TH POSITION // "STILLNESS" (INDIFFERENCE)',
            axes: ['WEAK', 'RESULTATIVE', 'ADAPTING'],
            summary: 'Energy conservation and calm delegation. Accepts ready-made outcomes and powers down first during extreme stress.'
          }
        ],
        sim_title: 'INTERACTIVE TRAINER // BREAKTHROUGH MECHANIC',
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
      app_title: 'PSYCHO-PROFILE // 心理侧写分析仪',
      app_subtitle: '刑侦心理苏菲终端 v2.4 [STEAM 离线独立版]',
      loading_status: '正在初始化引擎内核并校验数据库结构...',
      menu_start_btn: '[ 开始调查 ]',
      menu_tutorial_btn: '[ 类型学数据库 // 教程 ]',
      menu_settings_btn: '[ 终端设置与语言 ]',
      menu_select_mode: '选择侧写难度模式',
      mode_scout_name: '学员 // 新手模式 (SCOUT)',
      mode_scout_desc: '裁决按钮显示功能坐标轴，危机计时延长至30秒，开放“证据分析”提示。',
      mode_mindhunter_name: '侧写师 // 专家模式 (MINDHUNTER)',
      mode_mindhunter_desc: '按钮仅显示纯粹功能代号，严格15秒红色危机倒计时，无提示，得分 x1.5。',
      hud_case: '案件',
      hud_phase: '阶段',
      hud_accuracy: '准确率',
      hud_score: '得分',
      hud_timer: '危机张力',
      hud_backlog_btn: '对话记录 [L]',
      hud_menu_btn: '菜单 [ESC]',
      dlg_continue: 'SPACE / ENTER / 点击 — 继续 ▸',
      dlg_climax_badge: '高潮临界 // 心率激增',
      verdict_header: '锁定心理侧写裁决',
      verdict_subheader_scout: '学员模式：维度提示已激活',
      verdict_subheader_pro: '专家模式：高压倒计时',
      hint_btn_label: '[H] 证据线索分析',
      hint_box_title: '侧写师战术提示：',
      controls_bar: '[SPACE/ENTER] 继续/确认  •  [↑/↓] 选择  •  [1-4] 快捷裁决  •  [L / 滚轮↑] 历史记录  •  [ESC] 暂停',
      verdict_win_tag: 'BREAKTHROUGH // 心理防线击破',
      verdict_lose_tag: '分析失误 // 侧写偏差',
      verdict_timeout_tag: '意志僵直 // 超时失利',
      verdict_chosen_label: '你的判定：',
      verdict_correct_label: '真实侧写：',
      verdict_timeout_value: '决断迟疑 [超时]',
      verdict_axes_label: '功能标准三轴属性：',
      verdict_breakdown_label: '阿法纳西耶夫心理苏菲深度剖析：',
      verdict_to_summary_btn: '[ 查看案件总结档案 ▸ ]',
      summary_header: '调查结案档案',
      summary_status_solved: '状态：目标防线已击破 (BREAKTHROUGH)',
      summary_status_failed: '状态：侧写判定失败',
      summary_metric_case: '分析对象',
      summary_metric_profile: '核心主导功能',
      summary_metric_score: '本局累计得分',
      summary_metric_accuracy: '侧写总体准确率',
      summary_metric_time: '剩余危机时间',
      summary_next_case_btn: '[ 下一案件 ▸ ]',
      summary_retry_btn: '[ 重试本幕 ]',
      summary_menu_btn: '[ 返回主菜单 ]',
      backlog_title: '审讯对话档案 // BACKLOG',
      backlog_empty: '暂无已记录的审讯对话。',
      backlog_current_tag: '当前案件',
      backlog_past_tag: '历史归档',
      close_btn: '[ 关闭 // ESC ]',
      settings_title: '终端系统设置',
      settings_lang_label: '界面与剧本语言 (STEAM i18n)：',
      settings_audio_label: '程序化音效合成 (WEB AUDIO)：',
      settings_audio_on: '已开启',
      settings_audio_off: '已静音',
      settings_scout_notimer_label: '新手模式计时器：',
      settings_scout_30s: '30秒（标准）',
      settings_scout_off: '关闭（无限制）',
      settings_resume_btn: '[ 继续行动 ]',
      settings_to_menu_btn: '[ 返回主菜单 ]',
      ach_unlocked_prefix: 'STEAM 成就已解锁',
      ach_names: {
        FIRST_BREAKTHROUGH: '初次击破 (First Breakthrough)',
        MINDHUNTER_MASTERY: '冷血侧写师 (Mindhunter)',
        WILL_STUPOR: '意志僵直 (Will Stupor)',
        THEORY_INITIATE: '类型学入门者 (Syntax Initiate)',
        FULL_DOSSIER_CLEAR: '灵魂档案员 (Full Dossier)'
      },
      tutorial: {
        header: '教程 // 阿法纳西耶夫类型学数据库',
        back_btn: '[ ◂ 返回主菜单 ]',
        start_case_btn: '[ 立即开始调查 ▸ ]',
        tab_aspects: '01 // 四大要素',
        tab_positions: '02 // 四个位置与三轴',
        tab_simulator: '03 // BREAKTHROUGH 模拟器',
        aspects_intro: '心理苏菲学派通过四个核心要素解析人类在高压情境下的精神优先级：',
        aspects_list: [
          {
            code: 'В // 意志 (WILL)',
            title: '意志（主体性、尊严、决断力）',
            desc: '掌管自我价值感、命运主导权、等级意识与面对压迫时的精神脊梁。',
            markers: '审讯特征：面对羞辱与命令的反应、绝境中的自主抉择或自卑反扑。'
          },
          {
            code: 'Л // 逻辑 (LOGIC)',
            title: '逻辑（真理、结构、严密证明）',
            desc: '掌管因果推理、论证体系、怀疑精神以及对智识权威的态度。',
            markers: '审讯特征：辩论姿态、对逻辑漏洞的恐惧、独断定论或无限验算。'
          },
          {
            code: 'Ф // 物理 (PHYSICS)',
            title: '物理（躯体、物质、空间、本能）',
            desc: '掌管身体协调、痛觉、资源占有、环境安全感与物理求生本能。',
            markers: '审讯特征：肢体僵硬或灵活掌控、对物理危险的直接躯体反应。'
          },
          {
            code: 'Э // 情感 (EMOTION)',
            title: '情感（情绪张力、共鸣、表达）',
            desc: '掌管情绪浓度、戏剧化宣泄、感染力，或危机下的情绪切断。',
            markers: '审讯特征：泪水与怒吼、情绪羞耻感，或高压下的冷漠平静。'
          }
        ],
        positions_intro: '每个要素占据第1至第4位中的一个位置，由三条正交属性轴共同决定：',
        axes_legend: '【强势 / 弱势】能量储备  •  【结果型 / 过程型】独白或反复拉锯  •  【主导型 / 适应型】自我优先或顺应他人',
        positions_list: [
          {
            pos: '第1位置 // “君王”（过剩）',
            axes: ['强势', '结果型', '主导型'],
            summary: '能量充沛且独白式输出。视自身主权为理所当然，无需争辩，不受外界嘲讽动摇。'
          },
          {
            pos: '第2位置 // “大师”（规范）',
            axes: ['强势', '过程型', '适应型'],
            summary: '游刃有余的双向互动。灵活协调，乐于对话，没有病态防御心。'
          },
          {
            pos: '第3位置 // “裂痕 / 痛处”（情结）',
            axes: ['弱势', '过程型', '主导型'],
            summary: '脆弱、防御与过度纠结。深陷自我怀疑且极度在意他人目光，但绝不肯屈服，绝境中能爆发出极限突破。'
          },
          {
            pos: '第4位置 // “静默”（淡漠）',
            axes: ['弱势', '结果型', '适应型'],
            summary: '节能与顺应。乐于交出主导权，在极端高压下最先关闭消耗。'
          }
        ],
        sim_title: '实战训练器 // BREAKTHROUGH 击破机制',
        sim_instruction: '阅读下方测试嫌疑人证词，点击匹配的功能铭牌体验“心理击破”（Breakthrough）：',
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
            feedback: 'BREAKTHROUGH 击破成功！当你同时锁定【弱势】自我怀疑、【过程型】对旁人目光的敏感拉锯与【主导型】夺回自主权的执念时，即可瞬间瓦解目标心理防线！'
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
      app_title: 'PSYCHO-PROFILE // ANALYSATOR',
      app_subtitle: 'FORENSISCHES PSYCHOSOPHIE-TERMINAL v2.4 [AUTONOMER STEAM-BUILD]',
      loading_status: 'ENGINE-KERN WIRD INITIALISIERT & DATENSCHEMA VALIDIERT...',
      menu_start_btn: '[ ERMITTLUNG STARTEN ]',
      menu_tutorial_btn: '[ TYPOLOGIE-DATENBANK // TRAINING ]',
      menu_settings_btn: '[ EINSTELLUNGEN & SPRACHE ]',
      menu_select_mode: 'PROFILING-MODUS WÄHLEN',
      mode_scout_name: 'KADETT // EINSTEIGER (SCOUT)',
      mode_scout_desc: 'Funktionsachsen auf Urteilstasten sichtbar, Timer auf 30 Sek. erhöht, Beweisanalyse verfügbar.',
      mode_mindhunter_name: 'PROFILER // PROFI (MINDHUNTER)',
      mode_mindhunter_desc: 'Nur nackte Funktionscodes, strikter 15-Sek.-Krisentimer, keine Hinweise, Punkte x1.5.',
      hud_case: 'FALL',
      hud_phase: 'PHASE',
      hud_accuracy: 'PRÄZISION',
      hud_score: 'PUNKTE',
      hud_timer: 'SPANNUNG',
      hud_backlog_btn: 'PROTOKOLL [L]',
      hud_menu_btn: 'MENÜ [ESC]',
      dlg_continue: 'LEERTASTE / ENTER / KLICK — WEITER ▸',
      dlg_climax_badge: 'KLIMAX // PULSSPITZE',
      verdict_header: 'URTEIL FESTLEGEN',
      verdict_subheader_scout: 'KADETTENMODUS: ACHSEN AKTIV',
      verdict_subheader_pro: 'PROFIMODUS: KRISENTIMER LÄUFT',
      hint_btn_label: '[H] BEWEISANALYSE',
      hint_box_title: 'TAKTISCHER PROFILER-HINWEIS:',
      controls_bar: '[SPACE/ENTER] Weiter/Wahl  •  [↑/↓] Navigation  •  [1-4] Schnellwahl  •  [L / Mausrad↑] Protokoll  •  [ESC] Pause',
      verdict_win_tag: 'BREAKTHROUGH // ABWEHR DURCHBROCHEN',
      verdict_lose_tag: 'ANALYSEFEHLER // FEHLURTEIL',
      verdict_timeout_tag: 'WILLENSSTARRE // ZEITÜBERSCHREITUNG',
      verdict_chosen_label: 'IHRE WAHL:',
      verdict_correct_label: 'WAHRES PROFIL:',
      verdict_timeout_value: 'UNENTSCHLOSSENHEIT [TIMEOUT]',
      verdict_axes_label: 'KANONISCHE FUNKTIONSACHSEN:',
      verdict_breakdown_label: 'PSYCHOSOPHISCHE AUTOPSIE (NACH AFANASSJEW):',
      verdict_to_summary_btn: '[ ZUR FALLAKTE WEITERGEHEN ▸ ]',
      summary_header: 'ABSCHLUSSBERICHT DER ERMITTLUNG',
      summary_status_solved: 'STATUS: SUBJEKT ENTSCHLÜSSELT (BREAKTHROUGH)',
      summary_status_failed: 'STATUS: PROFILING FEHLGESCHLAGEN',
      summary_metric_case: 'UNTERSUCHTER FALL',
      summary_metric_profile: 'KERNFUNKTION DER SZENE',
      summary_metric_score: 'SITZUNGSPUNKTE',
      summary_metric_accuracy: 'GESAMTPRÄZISION',
      summary_metric_time: 'VERBLEIBENDES ZEITFENSTER',
      summary_next_case_btn: '[ NÄCHSTER FALL ▸ ]',
      summary_retry_btn: '[ SZENE WIEDERHOLEN ]',
      summary_menu_btn: '[ HAUPTMENÜ ]',
      backlog_title: 'VERHÖRPROTOKOLL // BACKLOG',
      backlog_empty: 'Noch keine Dialogeinträge gespeichert.',
      backlog_current_tag: 'AKTIVER FALL',
      backlog_past_tag: 'ARCHIV',
      close_btn: '[ SCHLIESSEN // ESC ]',
      settings_title: 'SYSTEMEINSTELLUNGEN DES TERMINALS',
      settings_lang_label: 'OBERFLÄCHEN- & SZENARIOSPRACHE (STEAM i18n):',
      settings_audio_label: 'WEB-AUDIO-SYNTHESIZER:',
      settings_audio_on: 'AKTIV',
      settings_audio_off: 'STUMM',
      settings_scout_notimer_label: 'TIMER IM EINSTEIGERMODUS:',
      settings_scout_30s: '30 SEKUNDEN (STANDARD)',
      settings_scout_off: 'DEAKTIVIERT (OHNE LIMIT)',
      settings_resume_btn: '[ FORTSETZEN ]',
      settings_to_menu_btn: '[ ZUM HAUPTMENÜ ]',
      ach_unlocked_prefix: 'STEAM-ERRUNGENSCHAFT FREIGESCHALTET',
      ach_names: {
        FIRST_BREAKTHROUGH: 'Erster Durchbruch (First Breakthrough)',
        MINDHUNTER_MASTERY: 'Kaltblütiger Profiler (Mindhunter)',
        WILL_STUPOR: 'Willensstarre (Will Stupor)',
        THEORY_INITIATE: 'Adept der Typologie (Syntax Initiate)',
        FULL_DOSSIER_CLEAR: 'Archivar der Seelen (Full Dossier)'
      },
      tutorial: {
        header: 'TRAINING // TYPOLOGIE-DATENBANK NACH AFANASSJEW',
        back_btn: '[ ◂ ZURÜCK ZUM MENÜ ]',
        start_case_btn: '[ DIREKT ZUR ERMITTLUNG ▸ ]',
        tab_aspects: '01 // 4 ASPEKTE',
        tab_positions: '02 // 4 POSITIONEN & ACHSEN',
        tab_simulator: '03 // BREAKTHROUGH-SIMULATOR',
        aspects_intro: 'Die Psychosophie analysiert menschliche Prioritäten über vier fundamentale Existenzaspekte:',
        aspects_list: [
          {
            code: 'W // WILLE (В)',
            title: 'WILLE (Selbstbestimmung, Würde, Führung)',
            desc: 'Steuert Selbstwert, Entscheidungsmacht, Hierarchie und Widerstandskraft des Ichs.',
            markers: 'Verhörmarker: Reaktion auf Demütigung, Befehle, Selbstzweifel oder kompromissloser Eigenwille.'
          },
          {
            code: 'L // LOGIK (Л)',
            title: 'LOGIK (Wahrheit, Struktur, Beweisführung)',
            desc: 'Steuert Kausalanalyse, Argumentation, Skepsis und den Anspruch auf geistige Präzision.',
            markers: 'Verhörmarker: Diskussionsstil, Angst vor Denkfehlern, Dogmatismus vs. endloses Nachprüfen.'
          },
          {
            code: 'P // PHYSIK (Ф)',
            title: 'PHYSIK (Körper, Materie, Raum, Überleben)',
            desc: 'Steuert Körpergefühl, Schmerz, Ressourcen, Territorium und physischen Instinkt.',
            markers: 'Verhörmarker: Motorische Ruhe vs. Erstarrung, Umgang mit körperlicher Bedrohung.'
          },
          {
            code: 'E // EMOTION (Э)',
            title: 'EMOTION (Affekt, Ausdruck, Resonanz)',
            desc: 'Steuert Gefühlsintensität, Dramatik, Stimmfärbung oder emotionale Abschaltung.',
            markers: 'Verhörmarker: Tränen, Wutausbrüche, Scham über Gefühle oder kühle Stille in der Krise.'
          }
        ],
        positions_intro: 'Jeder Aspekt besetzt genau eine Position (1. bis 4.), definiert durch drei Achsen:',
        axes_legend: '[STARK / SCHWACH] Energie  •  [RESULTATIV / PROZESSHAFT] Monolog vs. Ringen  •  [DOMINANT / ANPASSEND] Eigenanspruch vs. Ausgleich',
        positions_list: [
          {
            pos: '1. POSITION // „ZAR“ (ÜBERFLUSS)',
            axes: ['STARK', 'RESULTATIV', 'DOMINANT'],
            summary: 'Monolog und Gewissheit. Beansprucht Führung selbstverständlich und ist immun gegen fremden Spott.'
          },
          {
            pos: '2. POSITION // „MEISTER“ (NORM)',
            axes: ['STARK', 'PROZESSHAFT', 'ANPASSEND'],
            summary: 'Flexibler Dialog auf Augenhöhe. Souverän, kreativ und frei von schmerzhafter Abwehr.'
          },
          {
            pos: '3. POSITION // „WUNDE“ (KOMPLEX)',
            axes: ['SCHWACH', 'PROZESSHAFT', 'DOMINANT'],
            summary: 'Verletzlichkeit und Abwehr. Quälende Selbstzweifel bei gleichzeitigem Stolz — fähig zum explosiven Durchbruch.'
          },
          {
            pos: '4. POSITION // „STILLE“ (GLEICHMUT)',
            axes: ['SCHWACH', 'RESULTATIV', 'ANPASSEND'],
            summary: 'Energiesparmodus. Delegiert mühelos und schaltet unter Extremlast zuerst ab.'
          }
        ],
        sim_title: 'PRAXISTRAINER // BREAKTHROUGH-MECHANIK',
        sim_instruction: 'Lesen Sie die Test-Aussage und klicken Sie auf die passende Funktion, um einen Breakthrough auszulösen:',
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
            feedback: 'BREAKTHROUGH AKTIVIERT! Die Kombination aus [SCHWACH] Zittern & Scham, [PROZESSHAFT] Fokus auf fremde Blicke und [DOMINANT] unbeugsamem Selbstbestimmungsdrang sprengt die Schutzmauer!'
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
      app_title: 'PSYCHO-PROFILE // アナライザー',
      app_subtitle: '犯罪捜査サイコソフィー端末 v2.4 [STEAM スタンドアロン版]',
      loading_status: 'エンジンコア初期化およびスキーマ検証を実行中...',
      menu_start_btn: '[ 捜査を開始する ]',
      menu_tutorial_btn: '[ 類型論データベース // 訓練 ]',
      menu_settings_btn: '[ 端末設定・言語 ]',
      menu_select_mode: 'プロファイリング難易度選択',
      mode_scout_name: 'カデット // 新人モード (SCOUT)',
      mode_scout_desc: '判定プレートに機能軸を表示、タイマー30秒に緩和、「証拠分析ヒント」が使用可能。',
      mode_mindhunter_name: 'プロファイラー // 熟練モード (MINDHUNTER)',
      mode_mindhunter_desc: '素の機能コードのみ表示、厳格な15秒クライシスタイマー、ヒントなし、スコア1.5倍。',
      hud_case: '事件',
      hud_phase: 'フェーズ',
      hud_accuracy: '精度',
      hud_score: 'スコア',
      hud_timer: '緊張度',
      hud_backlog_btn: '履歴 [L]',
      hud_menu_btn: 'メニュー [ESC]',
      dlg_continue: 'SPACE / ENTER / クリック — 次へ ▸',
      dlg_climax_badge: 'クライマックス // 心拍急上昇',
      verdict_header: '最終プロファイルを断定せよ',
      verdict_subheader_scout: 'カデット：軸ガイド有効',
      verdict_subheader_pro: 'プロ：15秒クライシスタイマー',
      hint_btn_label: '[H] 証拠分析ヒント',
      hint_box_title: '戦術プロファイリング・ヒント：',
      controls_bar: '[SPACE/ENTER] 次へ/決定  •  [↑/↓] 選択  •  [1-4] 即時判定  •  [L / ホイール↑] 履歴  •  [ESC] 一時停止',
      verdict_win_tag: 'BREAKTHROUGH // 心理防壁を撃破',
      verdict_lose_tag: '分析エラー // 判定不一致',
      verdict_timeout_tag: '意志硬直 // タイムアウト',
      verdict_chosen_label: 'あなたの判定：',
      verdict_correct_label: '真のプロファイル：',
      verdict_timeout_value: '決断不全 [時間切れ]',
      verdict_axes_label: '機能のカノン3軸特性：',
      verdict_breakdown_label: 'アファナシェフ類型論による心理プロファイル解剖：',
      verdict_to_summary_btn: '[ 事件総括レポートへ進む ▸ ]',
      summary_header: '捜査最終プロファイル調書',
      summary_status_solved: 'ステータス：被験者の核心を撃破 (BREAKTHROUGH)',
      summary_status_failed: 'ステータス：プロファイリング失敗',
      summary_metric_case: '分析対象ケース',
      summary_metric_profile: '場面の中核機能',
      summary_metric_score: 'セッションスコア',
      summary_metric_accuracy: '総合プロファイル精度',
      summary_metric_time: '残りクライシス時間',
      summary_next_case_btn: '[ 次の事件へ ▸ ]',
      summary_retry_btn: '[ シーンを再挑戦 ]',
      summary_menu_btn: '[ メインメニューへ ]',
      backlog_title: '尋問ログ // BACKLOG',
      backlog_empty: '記録された発言ログはまだありません。',
      backlog_current_tag: '進行中の事件',
      backlog_past_tag: '過去ログ',
      close_btn: '[ 閉じる // ESC ]',
      settings_title: 'ターミナル環境設定',
      settings_lang_label: 'UIおよびシナリオ言語 (STEAM i18n)：',
      settings_audio_label: 'Web Audio 音響シンセサイザー：',
      settings_audio_on: 'ON（有効）',
      settings_audio_off: 'OFF（ミュート）',
      settings_scout_notimer_label: '新人モードのタイマー設定：',
      settings_scout_30s: '30秒（標準）',
      settings_scout_off: '無制限（タイマーなし）',
      settings_resume_btn: '[ 捜査に戻る ]',
      settings_to_menu_btn: '[ メインメニューへ戻る ]',
      ach_unlocked_prefix: 'STEAM 実績解除',
      ach_names: {
        FIRST_BREAKTHROUGH: '初の心理撃破 (First Breakthrough)',
        MINDHUNTER_MASTERY: '冷徹なる分析官 (Mindhunter)',
        WILL_STUPOR: '意志硬直 (Will Stupor)',
        THEORY_INITIATE: '類型論の修習者 (Syntax Initiate)',
        FULL_DOSSIER_CLEAR: '魂の記録官 (Full Dossier)'
      },
      tutorial: {
        header: '訓練 // アファナシェフ類型論データベース',
        back_btn: '[ ◂ メニューに戻る ]',
        start_case_btn: '[ 直ちに捜査を開始 ▸ ]',
        tab_aspects: '01 // 4つの側面',
        tab_positions: '02 // 4つの順位と3軸',
        tab_simulator: '03 // BREAKTHROUGH 演習',
        aspects_intro: 'サイコソフィー（心理ソフィー）は、人間の精神的優先順位を4つの根源的側面から解明します：',
        aspects_list: [
          {
            code: 'В // 意志 (WILL)',
            title: '意志（主体性・尊厳・自己決定）',
            desc: '自尊心、決断権、序列意識、自らの運命を握る推進力を司る中核側面。',
            markers: '尋問サイン：屈辱や命令への反応、極限での決断、自己卑下と強烈な意地の交錯。'
          },
          {
            code: 'Л // 論理 (LOGIC)',
            title: '論理（真理・構造・証明）',
            desc: '因果関係、議論、懐疑、論理的整合性と知的権威への態度を司る。',
            markers: '尋問サイン：議論への姿勢、論理的欠陥への恐怖、独断または無限の再検証。'
          },
          {
            code: 'Ф // 物理 (PHYSICS)',
            title: '物理（身体・物質・空間・生存本能）',
            desc: '身体感覚、痛み、資源、縄張り、物理的な生存感覚を司る。',
            markers: '尋問サイン：身体の硬直または柔軟な身のこなし、物理的脅威への反応。'
          },
          {
            code: 'Э // 感情 (EMOTION)',
            title: '感情（情動・表現・共鳴）',
            desc: '感情の振幅、劇的な表現、声の熱量、あるいは危機における感情遮断を司る。',
            markers: '尋問サイン：涙や激昂、感情露出への羞恥、または死線での冷ややかな凪。'
          }
        ],
        positions_intro: '4つの側面はそれぞれ第1〜第4順位のいずれかを占め、3つの軸の交差点で定義されます：',
        axes_legend: '【強 / 弱】エネルギー量  •  【リザルト / プロセス】独白か反芻か  •  【ドミナント / アジャスト】自己優先か調和か',
        positions_list: [
          {
            pos: '第1順位 // 『王』（過剰・独白）',
            axes: ['強', 'リザルト', 'ドミナント'],
            summary: '圧倒的な確信とトップダウンの決断。他者の嘲笑に揺らがず、議論を必要としない。'
          },
          {
            pos: '第2順位 // 『職人』（規範・対話）',
            axes: ['強', 'プロセス', 'アジャスト'],
            summary: '柔軟で安定した対話型。防衛的にならず、状況や他者と自在に協調できる。'
          },
          {
            pos: '第3順位 // 『傷口 / コンプレックス』（防衛）',
            axes: ['弱', 'プロセス', 'ドミナント'],
            summary: '過敏な傷つきやすさと強烈なプライドの同居。激しい自己疑念に苦しみながらも決して屈服せず、極限で爆発的な突破を見せる。'
          },
          {
            pos: '第4順位 // 『凪』（省エネ・受容）',
            axes: ['弱', 'リザルト', 'アジャスト'],
            summary: '執着の薄さと委任。極限ストレス下では真っ先にスイッチを切って消耗を防ぐ。'
          }
        ],
        sim_title: '実践シミュレーター // BREAKTHROUGH（心理撃破）演習',
        sim_instruction: '以下のテスト証言を読み、該当する機能プレートをクリックして Breakthrough 演出を確認せよ：',
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
            feedback: 'BREAKTHROUGH 発動！【弱】震えと自己疑念＋【プロセス】周囲の視線への過敏な反応＋【ドミナント】決定権を譲らない意地の3軸が一致し、心理防壁が撃破された！'
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
