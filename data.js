// ===================== بيانات تجريبية لمدرسة النور القرآنية =====================

const SURAHS = [
  {n:1,name:"الفاتحة",ayat:7},{n:2,name:"البقرة",ayat:286},{n:3,name:"آل عمران",ayat:200},
  {n:4,name:"النساء",ayat:176},{n:5,name:"المائدة",ayat:120},{n:6,name:"الأنعام",ayat:165},
  {n:7,name:"الأعراف",ayat:206},{n:8,name:"الأنفال",ayat:75},{n:9,name:"التوبة",ayat:129},
  {n:10,name:"يونس",ayat:109},{n:11,name:"هود",ayat:123},{n:12,name:"يوسف",ayat:111},
  {n:13,name:"الرعد",ayat:43},{n:14,name:"إبراهيم",ayat:52},{n:15,name:"الحجر",ayat:99},
  {n:16,name:"النحل",ayat:128},{n:17,name:"الإسراء",ayat:111},{n:18,name:"الكهف",ayat:110},
  {n:19,name:"مريم",ayat:98},{n:20,name:"طه",ayat:135},{n:21,name:"الأنبياء",ayat:112},
  {n:22,name:"الحج",ayat:78},{n:23,name:"المؤمنون",ayat:118},{n:24,name:"النور",ayat:64},
  {n:25,name:"الفرقان",ayat:77},{n:26,name:"الشعراء",ayat:227},{n:27,name:"النمل",ayat:93},
  {n:28,name:"القصص",ayat:88},{n:29,name:"العنكبوت",ayat:69},{n:30,name:"الروم",ayat:60},
  {n:31,name:"لقمان",ayat:34},{n:32,name:"السجدة",ayat:30},{n:33,name:"الأحزاب",ayat:73},
  {n:34,name:"سبأ",ayat:54},{n:35,name:"فاطر",ayat:45},{n:36,name:"يس",ayat:83},
  {n:37,name:"الصافات",ayat:182},{n:38,name:"ص",ayat:88},{n:39,name:"الزمر",ayat:75},
  {n:40,name:"غافر",ayat:85},{n:41,name:"فصلت",ayat:54},{n:42,name:"الشورى",ayat:53},
  {n:43,name:"الزخرف",ayat:89},{n:44,name:"الدخان",ayat:59},{n:45,name:"الجاثية",ayat:37},
  {n:46,name:"الأحقاف",ayat:35},{n:47,name:"محمد",ayat:38},{n:48,name:"الفتح",ayat:29},
  {n:49,name:"الحجرات",ayat:18},{n:50,name:"ق",ayat:45},{n:51,name:"الذاريات",ayat:60},
  {n:52,name:"الطور",ayat:49},{n:53,name:"النجم",ayat:62},{n:54,name:"القمر",ayat:55},
  {n:55,name:"الرحمن",ayat:78},{n:56,name:"الواقعة",ayat:96},{n:57,name:"الحديد",ayat:29},
  {n:58,name:"المجادلة",ayat:22},{n:59,name:"الحشر",ayat:24},{n:60,name:"الممتحنة",ayat:13},
  {n:61,name:"الصف",ayat:14},{n:62,name:"الجمعة",ayat:11},{n:63,name:"المنافقون",ayat:11},
  {n:64,name:"التغابن",ayat:18},{n:65,name:"الطلاق",ayat:12},{n:66,name:"التحريم",ayat:12},
  {n:67,name:"الملك",ayat:30},{n:68,name:"القلم",ayat:52},{n:69,name:"الحاقة",ayat:52},
  {n:70,name:"المعارج",ayat:44},{n:71,name:"نوح",ayat:28},{n:72,name:"الجن",ayat:28},
  {n:73,name:"المزمل",ayat:20},{n:74,name:"المدثر",ayat:56},{n:75,name:"القيامة",ayat:40},
  {n:76,name:"الإنسان",ayat:31},{n:77,name:"المرسلات",ayat:50},{n:78,name:"النبأ",ayat:40},
  {n:79,name:"النازعات",ayat:46},{n:80,name:"عبس",ayat:42},{n:81,name:"التكوير",ayat:29},
  {n:82,name:"الانفطار",ayat:19},{n:83,name:"المطففين",ayat:36},{n:84,name:"الانشقاق",ayat:25},
  {n:85,name:"البروج",ayat:22},{n:86,name:"الطارق",ayat:17},{n:87,name:"الأعلى",ayat:19},
  {n:88,name:"الغاشية",ayat:26},{n:89,name:"الفجر",ayat:30},{n:90,name:"البلد",ayat:20},
  {n:91,name:"الشمس",ayat:15},{n:92,name:"الليل",ayat:21},{n:93,name:"الضحى",ayat:11},
  {n:94,name:"الشرح",ayat:8},{n:95,name:"التين",ayat:8},{n:96,name:"العلق",ayat:19},
  {n:97,name:"القدر",ayat:5},{n:98,name:"البينة",ayat:8},{n:99,name:"الزلزلة",ayat:8},
  {n:100,name:"العاديات",ayat:11},{n:101,name:"القارعة",ayat:11},{n:102,name:"التكاثر",ayat:8},
  {n:103,name:"العصر",ayat:3},{n:104,name:"الهمزة",ayat:9},{n:105,name:"الفيل",ayat:5},
  {n:106,name:"قريش",ayat:4},{n:107,name:"الماعون",ayat:7},{n:108,name:"الكوثر",ayat:3},
  {n:109,name:"الكافرون",ayat:6},{n:110,name:"النصر",ayat:3},{n:111,name:"المسد",ayat:5},
  {n:112,name:"الإخلاص",ayat:4},{n:113,name:"الفلق",ayat:5},{n:114,name:"الناس",ayat:6}
];

const HALAQAT = [
  {id:1, name:"حلقة الفاتحين", level:"جزء عمّ", teacher:"أحمد العلوي", students:5, time:"بعد صلاة العصر"},
  {id:2, name:"حلقة البراعم", level:"جزء تبارك", teacher:"محمد الفاسي", students:6, time:"بعد صلاة المغرب"},
  {id:3, name:"حلقة النجباء", level:"جزء قد سمع", teacher:"عبد الرحمن البكري", students:5, time:"بعد صلاة العصر"},
  {id:4, name:"حلقة الحفاظ الصغار", level:"حفظ كامل", teacher:"عبد الرحمن البكري", students:4, time:"يوميًا صباحًا"}
];

const STUDENTS = [
  {id:1, name:"يوسف الإدريسي", phone:"0661112233", halaqa:"حلقة الفاتحين", level:"جزء عمّ", status:"نشيط", attendance:81, progress:0.5, rating:3.0},
  {id:2, name:"أمين بنعلي", phone:"0662223344", halaqa:"حلقة الفاتحين", level:"جزء عمّ", status:"نشيط", attendance:74, progress:0.4, rating:4.0},
  {id:3, name:"عبد الله المغربي", phone:"0663334455", halaqa:"حلقة الفاتحين", level:"جزء عمّ", status:"نشيط", attendance:88, progress:0.6, rating:5.0},
  {id:4, name:"حمزة الشرقاوي", phone:"0664445566", halaqa:"حلقة الفاتحين", level:"جزء عمّ", status:"نشيط", attendance:69, progress:0.3, rating:3.5},
  {id:5, name:"آدم التازي", phone:"0665556677", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"نشيط", attendance:90, progress:0.7, rating:4.5},
  {id:6, name:"إلياس العمراني", phone:"0666667788", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"نشيط", attendance:85, progress:0.55, rating:4.0},
  {id:7, name:"أنس الحسني", phone:"0667778899", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"نشيط", attendance:60, progress:0.35, rating:3.0},
  {id:8, name:"زكرياء بوزيد", phone:"0668889900", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"نشيط", attendance:77, progress:0.4, rating:3.5},
  {id:9, name:"بلال المراكشي", phone:"0669990011", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"نشيط", attendance:82, progress:0.5, rating:4.0},
  {id:10, name:"أيوب المنصوري", phone:"0661011122", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:70, progress:0.45, rating:3.5},
  {id:11, name:"إبراهيم السعدي", phone:"0661122233", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:91, progress:0.65, rating:4.5},
  {id:12, name:"نوح الريفي", phone:"0661233344", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:55, progress:0.3, rating:2.5},
  {id:13, name:"عمر الفهري", phone:"0661344455", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:73, progress:0.4, rating:3.0},
  {id:14, name:"أحمد العلوي الصغير", phone:"0661455566", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:80, progress:0.5, rating:4.0},
  {id:15, name:"خديجة الراشدي", phone:"0661566677", halaqa:"حلقة الحفاظ الصغار", level:"حفظ كامل", status:"نشيط", attendance:95, progress:0.85, rating:5.0},
  {id:16, name:"سارة الوزاني", phone:"0661677788", halaqa:"حلقة الحفاظ الصغار", level:"حفظ كامل", status:"نشيط", attendance:88, progress:0.78, rating:4.5},
  {id:17, name:"فاطمة الزهراء بنحدو", phone:"0661788899", halaqa:"حلقة الحفاظ الصغار", level:"حفظ كامل", status:"نشيط", attendance:92, progress:0.8, rating:5.0},
  {id:18, name:"مريم الزهراوي", phone:"0661899900", halaqa:"حلقة الحفاظ الصغار", level:"حفظ كامل", status:"نشيط", attendance:83, progress:0.7, rating:4.0},
  {id:19, name:"رقية البركاني", phone:"0661900011", halaqa:"حلقة البراعم", level:"جزء تبارك", status:"غير نشيط", attendance:40, progress:0.2, rating:2.5},
  {id:20, name:"ياسين الدكالي", phone:"0662011122", halaqa:"حلقة النجباء", level:"جزء قد سمع", status:"نشيط", attendance:76, progress:0.42, rating:3.5}
];

const MEMORIZATION_LOG = [
  {id:1, student:"عبد الله المغربي", surah:"العلق", from:4, to:11, type:"جديد", rating:5, note:""},
  {id:2, student:"إلياس العمراني", surah:"عبس", from:8, to:17, type:"مراجعة", rating:4, note:"أحسنت، استمر"},
  {id:3, student:"خديجة الراشدي", surah:"الرعد", from:1, to:6, type:"مراجعة", rating:4, note:""},
  {id:4, student:"سارة الوزاني", surah:"الحشر", from:1, to:14, type:"مراجعة", rating:4, note:"راجع التجويد"},
  {id:5, student:"عمر الفهري", surah:"الجن", from:1, to:10, type:"جديد", rating:3, note:"يحتاج مراجعة أكثر"},
  {id:6, student:"مريم الزهراوي", surah:"نوح", from:4, to:12, type:"جديد", rating:4, note:""},
  {id:7, student:"فاطمة الزهراء بنحدو", surah:"المجادلة", from:1, to:9, type:"جديد", rating:5, note:""},
  {id:8, student:"ياسين الدكالي", surah:"يونس", from:2, to:7, type:"جديد", rating:4, note:"بارك الله فيك"},
  {id:9, student:"رقية البركاني", surah:"التوبة", from:1, to:5, type:"مراجعة", rating:4, note:"تحسن ملحوظ"},
  {id:10, student:"يوسف الإدريسي", surah:"النبأ", from:1, to:20, type:"جديد", rating:3, note:""}
];

const PAYMENTS_MONTH = {month:"شتنبر", year:2026, total:1350, unpaid:11, paid:9, amount:150};

const USERS = [
  {id:1, name:"عبد الرحمن البكري", username:"teacher1", phone:"0611223344", role:"محفظ", status:"نشيط"},
  {id:2, name:"محمد الفاسي", username:"teacher2", phone:"0622334455", role:"محفظ", status:"نشيط"},
  {id:3, name:"أحمد العلوي", username:"teacher3", phone:"0633445566", role:"محفظ", status:"نشيط"},
  {id:4, name:"المدير", username:"admin", phone:"-", role:"مدير", status:"نشيط"}
];

const NOTES = [
  {id:1, student:"فاطمة الزهراء بنحدو", type:"سلوك", rating:"ممتاز", date:"2026-09-04", by:"محمد الفاسي", text:"سلوك حسن ما شاء الله، قدوة لزملائه"},
  {id:2, student:"إلياس العمراني", type:"سلوك", rating:"ممتاز", date:"2026-08-31", by:"أحمد العلوي", text:"مستوى جيد في التلاوة، يحتاج تقوية الحفظ"},
  {id:3, student:"نوح الريفي", type:"تفاعل", rating:"ضعيف", date:"2026-08-29", by:"محمد الفاسي", text:"يجب الانتباه لأحكام التجويد أثناء التسميع"},
  {id:4, student:"عبد الله المغربي", type:"أداء", rating:"ممتاز", date:"2026-08-29", by:"أحمد العلوي", text:"تحسن كبير في الأداء مقارنة بالشهر الماضي"},
  {id:5, student:"مريم الزهراوي", type:"تفاعل", rating:"جيد", date:"2026-08-29", by:"عبد الرحمن البكري", text:"يحتاج تشجيع أكثر على المواظبة والحضور"},
  {id:6, student:"خديجة الراشدي", type:"سلوك", rating:"ممتاز", date:"2026-08-28", by:"عبد الرحمن البكري", text:"ملتزمة ومنضبطة في جميع الحصص"}
];

const ANNOUNCEMENTS = [
  {id:1, title:"اختبار نهاية الشهر", date:"2026-09-08", audience:"جميع الطلاب", text:"سيقام اختبار الحفظ الشهري يوم السبت القادم بعد صلاة العصر، نرجو من الجميع المراجعة الجيدة."},
  {id:2, title:"تذكير بأداء الاشتراك الشهري", date:"2026-09-05", audience:"أولياء الأمور", text:"نذكركم بضرورة أداء اشتراك شهر شتنبر قبل نهاية الأسبوع الجاري."},
  {id:3, title:"عطلة بمناسبة عيد المولد النبوي", date:"2026-08-25", audience:"جميع الطلاب", text:"تعلن إدارة المدرسة عن توقف الدراسة ليومين بمناسبة الذكرى النبوية الشريفة."}
];
