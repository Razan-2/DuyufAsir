"use strict";

const modal = document.querySelector("#agentModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalIcon = document.querySelector("#modalIcon i");
const welcomeMessage = document.querySelector("#welcomeMessage");
const messages = document.querySelector("#messages");
const userInput = document.querySelector("#userInput");
const themeButton = document.querySelector("#themeBtn");
const listTitle = document.querySelector("#listTitle");
const recommendationsList = document.querySelector("#recommendationsList");
const loginModal = document.querySelector("#loginModal");
const feedbackModal = document.querySelector("#feedbackModal");
const loginForm = document.querySelector("#loginForm");
const feedbackForm = document.querySelector("#feedbackForm");
const loginButton = document.querySelector(".login-btn");
const logoutButton = document.querySelector("#logoutBtn");
const bookingModal = document.querySelector("#bookingModal");
const bookingForm = document.querySelector("#bookingForm");
const bookingHotel = document.querySelector("#bookingHotel");
const bookingHotelName = document.querySelector("#bookingHotelName");
const bookingCheckIn = document.querySelector("#bookingCheckIn");
const bookingCheckOut = document.querySelector("#bookingCheckOut");
const bookingGuests = document.querySelector("#bookingGuests");
const bookingTotal = document.querySelector("#bookingTotal");
const abhaVideoPage = document.querySelector("#abhaVideoPage");
const abhaVideo = document.querySelector("#abhaVideo");
const mainAssistantForm = document.querySelector("#mainAssistantForm");
const mainAssistantInput = document.querySelector("#mainAssistantInput");
const mainAssistantOutput = document.querySelector("#mainAssistantOutput");
const signupModal = document.querySelector("#signupModal");
const signupForm = document.querySelector("#signupForm");
const utilityModal = document.querySelector("#utilityModal");
const utilityTitle = document.querySelector("#utilityTitle");
const utilityIcon = document.querySelector("#utilityIcon i");
const utilityContent = document.querySelector("#utilityContent");
const quickSearchBtn = document.querySelector("#quickSearchBtn");
const notificationsBtn = document.querySelector("#notificationsBtn");
const notificationCount = document.querySelector("#notificationCount");
const languageBtn = document.querySelector("#languageBtn");
const profileBtn = document.querySelector("#profileBtn");
const voiceSearchBtn = document.querySelector("#voiceSearchBtn");
const chatAgentName = document.querySelector("#chatAgentName");
const suggestedPrompts = document.querySelector("#suggestedPrompts");
const clearAgentChat = document.querySelector("#clearAgentChat");
const smartRequestSuggestions = document.querySelector("#smartRequestSuggestions");
const agentWorkspace = document.querySelector(".agent-workspace");
const agentChatToggle = document.querySelector("#agentChatToggle");
let selectedBooking = null;

const heroSection = document.querySelector(".hero");
const servicesSection = document.querySelector(".services");
const mainAssistantSection = document.querySelector(".main-assistant-section");
if (heroSection && servicesSection) {
    (mainAssistantSection || heroSection).insertAdjacentElement("afterend", servicesSection);
}

const agents = {
    transport: { icon: "fa-bus", listTitle: "خيارات المواصلات في أبها", features: [
        ["fa-route", "اقتراح أفضل وسيلة نقل"],
        ["fa-coins", "حساب تكلفة الرحلة"],
        ["fa-clock", "تقدير وقت الوصول"],
        ["fa-bookmark", "حفظ الرحلات المتكررة"],
        ["fa-location-crosshairs", "اقتراح أقرب موقف أو محطة"]
    ], items: [
        { name: "هوندا سيتي", company: "yelo", companyName: "يلو", location: "فرع مطار أبها", image: "assets/vehicles/honda-city.jpg", category: "economy", year: 2023, seats: 5, bags: 2, dailyRate: 110, baseRate: 12, kilometerRate: 2, speed: 45, wait: 6 },
        { name: "تويوتا كورولا", company: "yelo", companyName: "يلو", location: "فرع وسط أبها", image: "assets/agents/transport-abha-v2.png", category: "sedan", year: 2024, seats: 5, bags: 3, dailyRate: 165, baseRate: 14, kilometerRate: 2.1, speed: 45, wait: 7 },
        { name: "هيونداي توسان", company: "yelo", companyName: "يلو", location: "فرع مطار أبها", image: "assets/agents/transport-abha-v2.png", category: "family-small", year: 2024, seats: 5, bags: 4, dailyRate: 260, baseRate: 20, kilometerRate: 2.4, speed: 48, wait: 8 },
        { name: "مرسيدس E-Class", company: "yelo", companyName: "يلو", location: "توصيل داخل أبها", image: "assets/vehicles/mercedes-eclass.jpg", category: "sedan", year: 2024, seats: 5, bags: 3, dailyRate: 650, baseRate: 35, kilometerRate: 3.5, speed: 48, wait: 10 },
        { name: "هيونداي إلنترا", company: "yelo", companyName: "يلو", location: "فرع مطار أبها", image: "assets/agents/transport-abha-v2.png", category: "sedan", year: 2025, seats: 5, bags: 3, dailyRate: 210, baseRate: 16, kilometerRate: 2.2, speed: 46, wait: 7 },
        { name: "فورد تيريتوري", company: "yelo", companyName: "يلو", location: "فرع أبها", image: "assets/vehicles/ford-territory.jpg", category: "family-small", year: 2025, seats: 5, bags: 4, dailyRate: 360, baseRate: 25, kilometerRate: 2.7, speed: 48, wait: 9 },
        { name: "هوندا أكورد", company: "alfaris", companyName: "الفارس", location: "فرع أبها", image: "assets/agents/transport-abha-v2.png", category: "sedan", year: 2023, seats: 5, bags: 3, dailyRate: 190, baseRate: 15, kilometerRate: 2.2, speed: 45, wait: 7 },
        { name: "نيسان صني", company: "alfaris", companyName: "الفارس", location: "فرع خميس مشيط", image: "assets/agents/transport-abha-v2.png", category: "economy", year: 2023, seats: 5, bags: 2, dailyRate: 120, baseRate: 12, kilometerRate: 2, speed: 45, wait: 6 },
        { name: "تويوتا فورتشنر", company: "alfaris", companyName: "الفارس", location: "أبها وخميس مشيط", image: "assets/vehicles/toyota-fortuner.jpg", category: "family-large", year: 2024, seats: 7, bags: 5, dailyRate: 390, baseRate: 28, kilometerRate: 2.8, speed: 50, wait: 12 },
        { name: "مرسيدس C-Class", company: "alfaris", companyName: "الفارس", location: "توصيل داخل أبها", image: "assets/agents/transport-abha-v2.png", category: "sedan", year: 2024, seats: 5, bags: 3, dailyRate: 590, baseRate: 32, kilometerRate: 3.3, speed: 48, wait: 10 },
        { name: "تويوتا يارس", company: "alfaris", companyName: "الفارس", location: "فرع أبها", image: "assets/agents/transport-abha-v2.png", category: "economy", year: 2024, seats: 5, bags: 2, dailyRate: 135, baseRate: 12, kilometerRate: 2, speed: 45, wait: 6 },
        { name: "كيا سبورتاج", company: "alfaris", companyName: "الفارس", location: "أبها وخميس مشيط", image: "assets/agents/transport-abha-v2.png", category: "family-small", year: 2024, seats: 5, bags: 4, dailyRate: 295, baseRate: 22, kilometerRate: 2.5, speed: 48, wait: 9 },
        { name: "هيونداي أكسنت", company: "abudiyab", companyName: "أبو ذياب", location: "فرع خميس مشيط", image: "assets/agents/transport-abha-v2.png", category: "economy", year: 2024, seats: 5, bags: 2, dailyRate: 125, baseRate: 12, kilometerRate: 2, speed: 45, wait: 6 },
        { name: "هوندا سيفيك", company: "abudiyab", companyName: "أبو ذياب", location: "خميس مشيط وأبها", image: "assets/agents/transport-abha-v2.png", category: "sedan", year: 2024, seats: 5, bags: 3, dailyRate: 185, baseRate: 15, kilometerRate: 2.2, speed: 46, wait: 7 },
        { name: "تويوتا راف فور", company: "abudiyab", companyName: "أبو ذياب", location: "توصيل داخل منطقة عسير", image: "assets/agents/transport-abha-v2.png", category: "family-small", year: 2024, seats: 5, bags: 4, dailyRate: 285, baseRate: 22, kilometerRate: 2.5, speed: 48, wait: 9 },
        { name: "مرسيدس GLC", company: "abudiyab", companyName: "أبو ذياب", location: "فرع خميس مشيط", image: "assets/agents/transport-abha-v2.png", category: "family-large", year: 2024, seats: 5, bags: 4, dailyRate: 720, baseRate: 38, kilometerRate: 3.6, speed: 48, wait: 10 }
        ,{ name: "نيسان كيكس", company: "abudiyab", companyName: "أبو ذياب", location: "أبها وخميس مشيط", image: "assets/agents/transport-abha-v2.png", category: "family-small", year: 2024, seats: 5, bags: 3, dailyRate: 245, baseRate: 20, kilometerRate: 2.4, speed: 47, wait: 8 }
        ,{ name: "هيونداي ستاريا", company: "abudiyab", companyName: "أبو ذياب", location: "منطقة عسير", image: "assets/agents/transport-abha-v2.png", category: "family-large", year: 2024, seats: 7, bags: 6, dailyRate: 430, baseRate: 30, kilometerRate: 3, speed: 48, wait: 11 }
        ,{ name: "هوندا سيتي", company: "lumi", companyName: "لومي", location: "فرع خميس مشيط", image: "assets/vehicles/honda-city.jpg", category: "economy", year: 2024, seats: 5, bags: 2, dailyRate: 145, baseRate: 13, kilometerRate: 2, speed: 45, wait: 6 }
        ,{ name: "فورد تيريتوري", company: "lumi", companyName: "لومي", location: "فرع خميس مشيط", image: "assets/vehicles/ford-territory.jpg", category: "family-small", year: 2024, seats: 5, bags: 4, dailyRate: 340, baseRate: 24, kilometerRate: 2.6, speed: 48, wait: 9 }
        ,{ name: "تويوتا فورتشنر", company: "budget", companyName: "بدجت", location: "فرع أبها", image: "assets/vehicles/toyota-fortuner.jpg", category: "family-large", year: 2024, seats: 7, bags: 5, dailyRate: 410, baseRate: 29, kilometerRate: 2.9, speed: 50, wait: 11 }
        ,{ name: "مرسيدس E-Class", company: "budget", companyName: "بدجت", location: "فرع أبها", image: "assets/vehicles/mercedes-eclass.jpg", category: "sedan", year: 2024, seats: 5, bags: 3, dailyRate: 690, baseRate: 36, kilometerRate: 3.5, speed: 48, wait: 10 }
        ,{ name: "فورد تيريتوري", company: "alfaris", companyName: "الفارس", location: "فرع أبها", image: "assets/vehicles/ford-territory.jpg", category: "family-small", year: 2024, seats: 5, bags: 4, dailyRate: 325, baseRate: 23, kilometerRate: 2.6, speed: 48, wait: 9 }
        ,{ name: "هوندا سيتي", company: "abudiyab", companyName: "أبو ذياب", location: "فرع خميس مشيط", image: "assets/vehicles/honda-city.jpg", category: "economy", year: 2024, seats: 5, bags: 2, dailyRate: 135, baseRate: 12, kilometerRate: 2, speed: 45, wait: 6 }
    ], description: "أخبرني بوجهتك داخل أبها وعدد الركاب والموعد لأقترح وسيلة المواصلات المناسبة.", reply: "يسعدني ترتيب تنقلك في أبها. ما نقطة الانطلاق والوجهة وعدد الركاب والموعد؟" },
    housing: { icon: "fa-house", listTitle: "السكن والفنادق المتاحة في أبها", features: [
        ["fa-magnifying-glass", "البحث عن شقق وفلل وفنادق"],
        ["fa-sliders", "فلترة حسب المدينة والميزانية"],
        ["fa-map-location-dot", "عرض الموقع على الخريطة"],
        ["fa-heart", "حفظ الأماكن في المفضلة"],
        ["fa-code-compare", "مقارنة أكثر من سكن"]
    ], items: [
        { name: "سيتادينز أبها", location: "طريق الملك فهد – أبها", people: "2–5 أشخاص", rooms: "استديو وشقق بغرفة أو غرفتين", nightly: "السعر حسب التاريخ", nightlyRate: 0, monthly: "حسب مدة الإقامة", monthlyRate: 0, image: "assets/properties/studio.png", mapUrl: "https://www.google.com/maps/search/?api=1&query=Citadines+Abha", bookingUrl: "https://www.discoverasr.com/en/citadines/saudi-arabia/citadines-abha", phone: "+966118349647", bookable: true },
        { name: "فندق سروات بارك أبها", location: "طريق الملك عبدالعزيز، الشفاء – أبها", people: "2–4 أشخاص", rooms: "غرف وأجنحة وفلل", nightly: "السعر حسب التاريخ", nightlyRate: 0, monthly: "حسب مدة الإقامة", monthlyRate: 0, image: "assets/properties/apartment-2br.png", mapUrl: "https://www.google.com/maps/search/?api=1&query=Sarwat+Park+Hotel+Abha", bookingUrl: "https://sarwatpark.com/st_hotel/sarawat-park-hotel-abha/?lang=en", phone: "0172400004", bookable: true },
        { name: "فندق بلو إن بوتيك", location: "طريق الملك سعود – وسط أبها", people: "شخصان", rooms: "غرف وأجنحة", nightly: "السعر حسب التاريخ", nightlyRate: 0, monthly: "حسب مدة الإقامة", monthlyRate: 0, image: "assets/properties/apartment-3br.png", mapUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Inn+Boutique+Abha", bookingUrl: "https://www.booking.com/hotel/sa/blue-inn-boutique.ar.html", phone: "0172305000", bookable: true },
        { name: "فندق بريرا أبها", location: "قرب حديقة السد – أبها", people: "2–4 أشخاص", rooms: "غرف وأجنحة", nightly: "السعر حسب التاريخ", nightlyRate: 0, monthly: "حسب مدة الإقامة", monthlyRate: 0, image: "assets/properties/villa.png", mapUrl: "https://www.google.com/maps/search/?api=1&query=Braira+Abha+Hotel", bookingUrl: "https://www.booking.com/searchresults.ar.html?ss=Braira+Abha+Hotel", bookable: true }
    ], description: "اختر عقاراً داخل أبها أو أخبرني بالحي والميزانية وعدد الأشخاص ومدة السكن.", reply: "ممتاز! سأقارن لك خيارات السكن داخل أبها بالسعر الشهري والسنوي. هل تريد مفروشاً أم غير مفروش؟" },
    hr: { icon: "fa-briefcase", listTitle: "جهات وشركات في أبها وخميس مشيط", features: [
        ["fa-file-pen", "إنشاء السيرة الذاتية"]
    ], items: [
        { name: "شركة لينكس لتقنية المعلومات", location: "خميس مشيط — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=%D8%B4%D8%B1%D9%83%D8%A9+%D9%84%D9%8A%D9%86%D9%83%D8%B3+%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9+%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA+%D8%AE%D9%85%D9%8A%D8%B3+%D9%85%D8%B4%D9%8A%D8%B7", image: "assets/entities/lynx-official.png", imageType: "logo", type: "تقنية معلومات وحلول رقمية", details: ["الأنظمة والمنصات", "تطبيقات الجوال", "الذكاء الاصطناعي", "البنية التحتية"], phone: "0566751164", phoneDial: "+966566751164", applicationKey: "lynx", applicationEmail: "info@lynxco.net", careersUrl: "https://lynxco.net/", vacancySpecialties: ["علوم الحاسب", "تقنية المعلومات", "برمجة", "ذكاء اصطناعي", "أمن سيبراني", "شبكات"] },
        { name: "شركة الكهرباء السعودية", location: "طريق الملك فهد، المدينة الصناعية، أبها", mapUrl: "https://www.google.com/maps/search/?api=1&query=%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A9+%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9+%D9%84%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1+%D8%A3%D8%A8%D9%87%D8%A7", image: "assets/entities/saudi-electricity.jpg", imageType: "logo", type: "طاقة وخدمات كهربائية", details: ["الفواتير", "بلاغات الأعطال", "طلبات الخدمة"], careersUrl: "https://jobs.se.com.sa/", vacancySpecialties: ["هندسة كهربائية", "هندسة ميكانيكية", "هندسة صناعية", "علوم الحاسب", "أمن سيبراني", "إدارة أعمال"] },
        { name: "stc", location: "فروع أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=stc+Abha", image: "assets/entities/stc.png", imageType: "logo", type: "اتصالات وتقنية", details: ["الجوال", "الإنترنت المنزلي", "الألياف البصرية"], phone: "900", phoneDial: "900", applicationKey: "stc", applicationEmail: "razanalqobti@gmail.com", careersUrl: "https://careers.stc.com.sa/", vacancySpecialties: ["علوم الحاسب", "تقنية المعلومات", "هندسة اتصالات", "ذكاء اصطناعي", "أمن سيبراني", "إدارة أعمال", "تسويق", "مالية"] },
        { name: "مصرف الراجحي", location: "فروع أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=Al+Rajhi+Bank+Abha", image: "assets/entities/alrajhi.png", imageType: "logo", type: "خدمات مصرفية", details: ["الحسابات", "البطاقات", "التمويل", "خدمة العملاء"], careersUrl: "https://careers.alrajhibank.com.sa/", vacancySpecialties: ["مالية", "محاسبة", "إدارة أعمال", "علوم الحاسب", "أمن سيبراني", "خدمة عملاء"] },
        { name: "شركة النهدي الطبية", location: "صيدليات أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nahdi+Pharmacy+Abha", image: "assets/entities/nahdi.png", imageType: "logo", type: "صيدليات ورعاية صحية", details: ["الأدوية", "العناية الصحية", "الطلبات والاستفسارات"], careersUrl: "https://careers.nahdi.sa/", vacancySpecialties: ["صيدلة", "طب", "تمريض", "إدارة صحية", "علوم الحاسب", "خدمة عملاء"] },
        { name: "شركة زين السعودية", location: "فروع أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=Zain+Abha", image: "assets/entities/zain.png", imageType: "logo", type: "اتصالات وإنترنت", details: ["الجوال", "الجيل الخامس", "باقات البيانات"], careersUrl: "https://careers.zain.com/", vacancySpecialties: ["هندسة اتصالات", "علوم الحاسب", "تقنية المعلومات", "ذكاء اصطناعي", "تسويق", "خدمة عملاء"] },
        { name: "البريد السعودي | سبل", location: "فروع أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=SPL+Saudi+Post+Abha", image: "assets/entities/spl.png", imageType: "logo", type: "بريد وخدمات لوجستية", details: ["الشحن", "العنوان الوطني", "محطات الطرود"], careersUrl: "https://career.splonline.com.sa/", vacancySpecialties: ["إدارة لوجستية", "سلاسل الإمداد", "إدارة أعمال", "علوم الحاسب", "خدمة عملاء"] },
        { name: "شركة جرير للتسويق", location: "فرع أبها — افتح الخريطة", mapUrl: "https://www.google.com/maps/search/?api=1&query=Jarir+Bookstore+Abha", image: "assets/entities/jarir.png", imageType: "logo", type: "تجزئة وتقنية", details: ["الإلكترونيات", "الكتب", "الأدوات المكتبية", "الصيانة"], careersUrl: "https://jobapp.jarir.com/?lang=sa", vacancySpecialties: ["مبيعات", "محاسبة", "خدمة عملاء", "صيانة جوالات", "علوم الحاسب", "إدارة أعمال"] }
    ], description: "أخبرني عن الوظيفة أو جهة العمل التي تبحث عنها في أبها أو خميس مشيط.", reply: "يسعدني مساعدتك. ما مجالك وخبرتك ونوع العمل الذي تفضله في منطقة عسير؟" },
    education: { icon: "fa-graduation-cap", listTitle: "التعليم والدورات في أبها", items: [
        { name: "جامعة الملك خالد", location: "أبها", image: "assets/entities/kku.png", imageType: "logo", group: "universities", type: "جامعة حكومية", details: ["علوم الحاسب", "الذكاء الاصطناعي", "الطب والعلوم الطبية", "الهندسة", "الأعمال", "اللغات والترجمة"], fee: "الانتظام الحكومي دون رسوم، وتوجد برامج دراسات عليا مدفوعة وغير مدفوعة", admissionUrls: { bachelor: "https://www.kku.edu.sa/ar", master: "https://www.kku.edu.sa/ar", doctorate: "https://www.kku.edu.sa/ar" }, publicFees: { bachelor: "برامج البكالوريوس والدبلوم انتظام حكومي دون رسوم دراسية للمقبولين وفق شروط القبول.", master: "توجد برامج بدون مقابل مالي وأخرى بمقابل مالي؛ يظهر مبلغ كل برنامج في إعلان الدراسات العليا قبل التقديم.", doctorate: "توجد برامج بدون مقابل مالي وأخرى بمقابل مالي؛ يظهر مبلغ كل برنامج في إعلان الدراسات العليا قبل التقديم." } },
        { name: "الكلية التقنية بأبها", location: "أبها", image: "assets/entities/tvtc.png", imageType: "logo", group: "universities", type: "كلية حكومية", details: ["التقنية الكهربائية", "الميكانيكية", "المدنية والمعمارية", "الحاسب وتقنية الأعمال"], fee: "برامج التدريب الحكومية بحسب شروط قبولي", admissionUrls: { bachelor: "https://adm.tvtc.gov.sa/auth", master: "https://adm.tvtc.gov.sa/auth", doctorate: "https://adm.tvtc.gov.sa/auth" }, publicFees: { bachelor: "لا تُفرض رسوم دراسية على البرامج الحكومية الصباحية المؤهلة، وقد تُصرف مكافأة شهرية للمستحقين.", master: "لا يتوفر برنامج ماجستير ضمن هذه الجهة.", doctorate: "لا يتوفر برنامج دكتوراه ضمن هذه الجهة." } },
        { name: "الكلية التقنية التطبيقية بأبها", location: "أبها", image: "assets/entities/tvtc.png", imageType: "logo", group: "universities", type: "كلية حكومية تطبيقية", details: ["برامج الدبلوم", "برامج البكالوريوس", "تدريب تقني ومهني"], fee: "الرسوم والمكافأة بحسب نوع البرنامج في قبولي", admissionUrls: { bachelor: "https://adm.tvtc.gov.sa/auth", master: "https://adm.tvtc.gov.sa/auth", doctorate: "https://adm.tvtc.gov.sa/auth" }, publicFees: { bachelor: "يعرض نظام قبولي نوع البرنامج وهل هو حكومي صباحي أو مسائي عند فتح التسجيل.", master: "لا يتوفر برنامج ماجستير ضمن هذه الجهة.", doctorate: "لا يتوفر برنامج دكتوراه ضمن هذه الجهة." } },
        { name: "كليات الغد الدولية للعلوم الصحية", location: "فرع أبها", image: "assets/entities/alghad.png", imageType: "logo", group: "universities", type: "كلية أهلية صحية", details: ["التمريض", "طب الطوارئ", "الأشعة", "المختبرات الطبية"], fee: "المبلغ يختلف حسب البرنامج والمنح", admissionUrls: { bachelor: "https://mygate.gc.edu.sa/alghad/init", master: "https://mygate.gc.edu.sa/alghad/init", doctorate: "https://mygate.gc.edu.sa/alghad/init" }, publicFees: { bachelor: "لا تنشر الكلية مبلغًا موحدًا لكل التخصصات؛ يمكن الاطلاع على طرق السداد دون تسجيل دخول، ويؤكد الفرع مبلغ البرنامج.", master: "تحقق من توفر البرنامج ورسومه لدى الكلية.", doctorate: "تحقق من توفر البرنامج ورسومه لدى الكلية." } },
        { name: "كلية البترجي الطبية", location: "فرع عسير — خميس مشيط", image: "assets/entities/bmc.svg", imageType: "logo", group: "universities", type: "كلية طبية أهلية", details: ["الطب العام", "التمريض", "العلاج التنفسي", "الإدارة الصحية"], fee: "رسوم التسجيل 4,500 ر.س، ورسوم الدراسة تختلف حسب البرنامج", admissionUrls: { bachelor: "https://qazwas.bmc.edu.sa/ar/Admissions-Aid/Admissions", master: "https://qazwas.bmc.edu.sa/ar/Admissions-Aid/Admissions", doctorate: "https://qazwas.bmc.edu.sa/ar/Admissions-Aid/Admissions" }, publicFees: { bachelor: "رسوم التسجيل المنشورة 4,500 ر.س. مثال منشور: برنامج العلاج الوظيفي 25,000 ر.س للفصل؛ بقية البرامج لها رسوم مختلفة.", master: "تختلف الرسوم حسب برنامج الدراسات العليا وتظهر في صفحة البرنامج الرسمية.", doctorate: "تحقق من توفر برنامج الدكتوراه ورسومه في صفحة القبول الرسمية." } },
        { name: "مدارس الأندلس الأهلية", location: "فرع أبها", image: "assets/entities/alandalus-schools.png", imageType: "logo", group: "private-schools", type: "مدرسة أهلية", details: ["رياض الأطفال", "ابتدائي", "متوسط", "ثانوي"], fees: { "رياض الأطفال": 10000, "ابتدائي": 12500, "متوسط": 15500, "ثانوي": 19000 }, fee: "تُعتمد الرسوم النهائية من المدرسة", strengths: ["الرياضيات", "العلوم", "الحاسب"], officialUrl: "https://as.edu.sa/andalus-private-school-abha/", mapUrl: "https://www.google.com/maps/search/?api=1&query=مدارس+الأندلس+الأهلية+أبها" },
        { name: "مدارس التربية المتميزة", location: "حي المشرفية – أبها", image: "assets/entities/tarbiyah-schools.png", imageType: "logo", group: "private-schools", type: "مدرسة أهلية", details: ["رياض الأطفال", "ابتدائي", "متوسط", "ثانوي"], fees: { "رياض الأطفال": 20400, "ابتدائي": 23500, "متوسط": 26400, "ثانوي": 29400 }, fee: "تُعتمد الرسوم النهائية من المدرسة", strengths: ["اللغة الإنجليزية", "العلوم", "الرياضيات"], officialUrl: "https://ibnroshdschools.edu.sa/register", mapUrl: "https://www.google.com/maps/search/?api=1&query=مدارس+التربية+المتميزة+أبها" },
        { name: "مدارس ابن رشد التعليمية", location: "أبها وخميس مشيط", image: "assets/entities/ibn-roshd.png", imageType: "logo", group: "private-schools", type: "مدارس أهلية وعالمية", details: ["رياض الأطفال", "ابتدائي", "متوسط", "ثانوي", "بنين وبنات"], fees: { "رياض الأطفال": 12000, "ابتدائي": 14000, "متوسط": 17000, "ثانوي": 21000 }, fee: "تُعتمد الرسوم النهائية من المدرسة", strengths: ["اللغة العربية", "الحاسب", "اللغة الإنجليزية"], officialUrl: "https://ibnroshdschools.edu.sa/register", mapUrl: "https://www.google.com/maps/search/?api=1&query=مدارس+ابن+رشد+أبها" },
        { name: "المدارس الحكومية", location: "أحياء أبها", image: "assets/entities/moe.png", imageType: "logo", group: "government-schools", type: "تعليم حكومي", details: ["ابتدائي", "متوسط", "ثانوي", "بنين وبنات"], fee: "دون رسوم دراسية" },
        { name: "أساسيات البرمجة", location: "دورة إلكترونية", image: "assets/entities/tvtc.png", imageType: "logo", group: "courses", courseTrack: "علوم الحاسب", type: "تقنية وبرمجة", details: ["مستوى مبتدئ", "20 ساعة", "شهادة إتمام"], fee: "مجانية", price: 0 },
        { name: "معسكر لينكس", location: "تدريب تقني", image: "assets/entities/lynx-official.png", imageType: "logo", group: "courses", courseTrack: "علوم الحاسب", type: "تقنية وأنظمة تشغيل", details: ["تطبيق عملي", "أساسيات Linux", "شهادة إتمام"], fee: "450 ر.س", price: 450 },
        { name: "مقدمة في الذكاء الاصطناعي", location: "دورة إلكترونية", image: "assets/entities/tvtc.png", imageType: "logo", group: "courses", courseTrack: "الذكاء الاصطناعي", type: "ذكاء اصطناعي", details: ["تعلم الآلة", "تطبيقات عملية", "مستوى مبتدئ"], fee: "500 ر.س", price: 500 },
        { name: "مهارات الحاسب وExcel", location: "الكلية التقنية بأبها", image: "assets/entities/tvtc.png", imageType: "logo", group: "courses", courseTrack: "إدارة الأعمال", type: "مهارات رقمية", details: ["تطبيق عملي", "15 ساعة", "مستوى مبتدئ"], fee: "300 ر.س", price: 300 },
        { name: "اللغة الإنجليزية للعمل", location: "دورة إلكترونية", image: "assets/entities/ipa.png", imageType: "logo", group: "courses", courseTrack: "اللغة الإنجليزية", type: "لغة وتطوير مهني", details: ["محادثة", "مصطلحات وظيفية", "اختبار مستوى"], fee: "250 ر.س", price: 250 },
        { name: "الأمن السيبراني للمبتدئين", location: "دورة إلكترونية", image: "assets/entities/tvtc.png", imageType: "logo", group: "courses", courseTrack: "الأمن السيبراني", type: "أمن وتقنية", details: ["حماية الحسابات", "أساسيات الشبكات", "توعية رقمية"], fee: "400 ر.س", price: 400 },
        { name: "إدارة المشاريع", location: "دورة إلكترونية", image: "assets/entities/ipa.png", imageType: "logo", group: "courses", courseTrack: "إدارة الأعمال", type: "إدارة وتطوير مهني", details: ["التخطيط", "إدارة الوقت", "متابعة التنفيذ"], fee: "350 ر.س", price: 350 },
        { name: "التسويق الرقمي", location: "دورة إلكترونية", image: "assets/entities/tvtc.png", imageType: "logo", group: "courses", courseTrack: "التسويق", type: "تسويق وأعمال", details: ["المحتوى", "منصات التواصل", "تحليل النتائج"], fee: "300 ر.س", price: 300 }
    ], description: "أخبرني بالتخصص أو الدورة التي تريدها داخل أبها.", reply: "رائع! اذكر التخصص والمستوى والميزانية لأبحث عن الخيارات التعليمية في أبها." },
    entertainment: { icon: "fa-ticket", listTitle: "الترفيه في أبها", items: [
        { name: "مأكولات الأسر المنتجة", location: "أسواق وفعاليات أبها", image: "assets/entertainment/productive-families-abha.jpg", imageType: "photo", group: "restaurants", featuredLocal: true, type: "أسر منتجة ومطبخ عسيري", details: ["خبز البر", "أكلات شعبية", "منتجات محلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=productive+families+market+Abha" },
        { name: "فيرندا كافيه", location: "أبها", image: "assets/entertainment/veranda-abha.jpg", imageType: "photo", group: "cafes", type: "كوفي وقهوة مختصة", details: ["قهوة", "مخبوزات", "جلسات داخلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Veranda+Cafe+Abha" },
        { name: "جوي فينيو كافيه", location: "ممشى الضباب – أبها", image: "assets/entertainment/joy-venue-cafe.jpg", imageType: "photo", group: "cafes", type: "كوفي بإطلالة", details: ["قهوة", "حلويات", "إطلالة جبلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Joy+Venue+Abha" },
        { name: "مقهى سذاب", location: "حي الضباب – أبها", image: "assets/entertainment/food-cafe.jpg", imageType: "photo", group: "cafes", type: "قهوة مختصة بهوية عسيرية", details: ["V60", "قهوة سعودية", "جلسات فنية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Sthab+Cafe+Abha" },
        { name: "ريشيو كافيه", location: "حي النهضة – أبها", image: "assets/entertainment/venue-veranda.jpg", imageType: "photo", group: "cafes", type: "قهوة مختصة وفطور", details: ["قهوة مختصة", "مخبوزات", "حلويات"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Ratio+Cafe+Abha" },
        { name: "بالم كورت كافيه", location: "أبها", image: "assets/entertainment/food-date-cake.webp", imageType: "photo", group: "cafes", type: "مقهى وجلسات", details: ["قهوة", "حلويات", "جلسات عائلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Palm+Court+Cafe+Abha" },
        { name: "مطعم جوي فينيو", location: "ممشى الضباب – أبها", image: "assets/entertainment/joy-venue-restaurant.jpg", imageType: "photo", group: "restaurants", type: "مطعم وجلسات مطلة", details: ["عائلات", "وجبات متنوعة", "إطلالة"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Joy+Venue+Restaurant+Abha" },
        { name: "مطعم أبها قالا", location: "أبها", image: "assets/entertainment/abha-gala.jpg", imageType: "photo", group: "restaurants", type: "مطعم بإطلالة", details: ["غداء", "عشاء", "جلسات خارجية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Abha+Gala+Restaurant" },
        { name: "مطعم سدف", location: "أبها", image: "assets/entertainment/venue-veranda.jpg", imageType: "photo", group: "restaurants", type: "مأكولات جنوبية", details: ["فطور جنوبي", "عريكة", "خبز جنوبي"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Sadf+Restaurant+Abha" },
        { name: "بيت الشعبيات", location: "أبها", image: "assets/entertainment/tuesday-market-crafts.jpg", imageType: "photo", group: "restaurants", type: "مأكولات شعبية", details: ["عريكة", "فتة", "أطباق فطور"], mapUrl: "https://www.google.com/maps/search/?api=1&query=بيت+الشعبيات+أبها" },
        { name: "مطعم حراء", location: "شمسان – أبها", image: "assets/agents/entertainment-abha-authentic.jpg", imageType: "photo", group: "restaurants", type: "مندي ومأكولات محلية", details: ["مندي", "مضغوط", "جلسات عائلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Hira+Restaurant+Abha" },
        { name: "مطعم الدوار بفندق قصر أبها", location: "قصر أبها – أبها", image: "assets/entertainment/venue-abha-palace.webp", imageType: "photo", group: "restaurants", type: "مطعم بإطلالة بانورامية", details: ["مأكولات متنوعة", "إطلالة", "جلسات عائلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Abha+Palace+Revolving+Restaurant" },
        { name: "سينما الراشد مول", location: "أبها", image: "assets/entertainment/movie-toy-story-5.jpg", imageType: "photo", group: "movies", type: "أفلام وعروض سينمائية", details: ["عائلي", "أكشن", "رسوم متحركة"], mapUrl: "https://ksa.empirecinemas.com/ar/showtimes/0" },
        { name: "سڤن أبها", location: "أبها", image: "assets/agents/entertainment-abha-authentic.jpg", imageType: "photo", group: "activities", type: "تجارب ترفيهية", details: ["ألعاب", "تحديات", "مناسب للعائلة"], mapUrl: "https://www.google.com/maps/search/?api=1&query=SEVEN+Abha" },
        { name: "الأعمال الحرفية في سوق الثلاثاء", location: "سوق الثلاثاء – أبها", image: "assets/entertainment/tuesday-market-crafts.jpg", imageType: "photo", group: "activities", type: "حرف وتراث عسيري", details: ["الخوص", "الفضيات", "الثوب العسيري", "هدايا محلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Tuesday+Market+Abha" },
        { name: "حديقة السلام", location: "أبها", image: "assets/entities/al-salam-park-abha.jpg", imageType: "photo", group: "activities", type: "نشاط عائلي", details: ["تنزه", "ألعاب", "جلسات"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Al+Salam+Park+Abha" },
        { name: "ممشى الضباب", location: "حي الضباب – أبها", image: "assets/entertainment/activity-art-night.jpg", imageType: "photo", group: "activities", type: "مشي وإطلالة", details: ["مجاني", "تصوير", "إطلالة جبلية"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Al+Dabab+Walkway+Abha" }
    ], description: "اختر مكاناً ترفيهياً في أبها أو أخبرني بالنشاط الذي تفضله.", reply: "لنخطط لوقت ممتع في أبها! أخبرني باهتماماتك والموعد والميزانية." }
};

let activeAgent = "housing";
let lastFocusedElement = null;
const housingState = {
    query: "",
    area: "all",
    maxBudget: Infinity,
    favoritesOnly: false,
    favorites: new Set(JSON.parse(localStorage.getItem("housingFavorites") || "[]")),
    comparison: new Set()
};
const transportState = {
    from: "",
    to: "",
    distance: 10,
    option: "0",
    savedTrips: JSON.parse(localStorage.getItem("savedTransportTrips") || "[]"),
    maxPrice: 800,
    company: "",
    category: "economy",
    rentalCity: "أبها",
    pickupDate: "",
    returnDate: "",
    rentalSearchReady: false,
    showAllRentalCompanies: false,
    mode: ""
};
const hrState = {
    applications: JSON.parse(localStorage.getItem("jobApplications") || "[]"),
    specialty: ""
};
const educationState = {
    progress: JSON.parse(localStorage.getItem("educationProgress") || "[]"),
    courseTrack: "all"
};
const entertainmentState = {
    savedPlaces: JSON.parse(localStorage.getItem("savedEntertainmentPlaces") || "[]")
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

const mainAgentRoutes = [
    { type: "housing", title: "وكيل السكن", icon: "fa-house", keywords: ["سكن", "شقة", "شقق", "فندق", "فنادق", "فيلا", "إيجار", "غرفة", "قريب"] },
    { type: "transport", title: "وكيل المواصلات", icon: "fa-bus", keywords: ["مواصلات", "نقل", "سيارة", "تاكسي", "حافلة", "رحلة", "محطة", "توصيل"] },
    { type: "hr", title: "وكيل الموارد البشرية", icon: "fa-briefcase", keywords: ["وظيفة", "وظائف", "عمل", "شركة", "توظيف", "سيرة", "مقابلة", "راتب"] },
    { type: "education", title: "وكيل التعليم", icon: "fa-graduation-cap", keywords: ["تعليم", "جامعة", "مدرسة", "دورة", "تخصص", "دراسة", "تعلم", "كلية"] },
    { type: "entertainment", title: "وكيل الترفيه", icon: "fa-ticket", keywords: ["ترفيه", "فعالية", "مطعم", "مقهى", "سياحة", "فيلم", "مسلسل", "حديقة", "مكان"] }
];

const agentPromptSuggestions = {
    housing: ["أبحث عن فندق لعائلة", "قارن لي بين شقتين", "ما السكن المناسب لميزانيتي؟"],
    transport: ["احسب تكلفة رحلتي", "ما أفضل وسيلة نقل؟", "أين أقرب محطة؟"],
    hr: ["حسّن سيرتي الذاتية", "ابحث عن وظيفة مناسبة", "جهزني للمقابلة"],
    education: ["اقترح تخصصًا مناسبًا", "أنشئ لي خطة تعلم", "ابحث عن جامعة"],
    entertainment: ["اقترح فعالية اليوم", "أريد مطعمًا عائليًا", "ما أفضل الأماكن السياحية؟"]
};

const supervisorSuggestions = [
    "أبحث عن وظيفة وسكن قريب في خميس مشيط",
    "أحتاج فندقًا ومواصلات لعائلة في أبها",
    "اقترح جامعة وسكنًا بميزانية مناسبة",
    "خطط لي يومًا سياحيًا مع مطعم ومواصلات",
    "حسّن سيرتي وابحث عن شركات مناسبة"
];

if (localStorage.getItem("loyaltyProgressResetV2") !== "done") {
    localStorage.setItem("loyaltyRequestCount", "2");
    localStorage.setItem("asirRewardCoupons", "[]");
    localStorage.setItem("loyaltyProgressResetV2", "done");
}

function getAgentMemory(agentType) {
    const memories = JSON.parse(localStorage.getItem("agentMemories") || "{}");
    return memories[agentType] || [];
}

function saveAgentMemory(agentType, role, text) {
    const memories = JSON.parse(localStorage.getItem("agentMemories") || "{}");
    memories[agentType] = [...(memories[agentType] || []), { role, text, date: Date.now() }].slice(-20);
    localStorage.setItem("agentMemories", JSON.stringify(memories));
}

function clearAgentMemory(agentType) {
    const memories = JSON.parse(localStorage.getItem("agentMemories") || "{}");
    delete memories[agentType];
    localStorage.setItem("agentMemories", JSON.stringify(memories));
}

function registerLoyaltyRequest() {
    const requestCount = Number(localStorage.getItem("loyaltyRequestCount") || 0) + 1;
    localStorage.setItem("loyaltyRequestCount", String(requestCount));
    if (requestCount % 5 !== 0) return;
    const coupons = JSON.parse(localStorage.getItem("asirRewardCoupons") || "[]").map((coupon) => ({ ...coupon, title: "جولة مع نفس للسياحة لمدة يوم واحد مجانًا" }));
    localStorage.setItem("asirRewardCoupons", JSON.stringify(coupons));
    const coupon = {
        id: `ASIR-RIDE-${String(requestCount / 5).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        title: "جولة مع نفس للسياحة لمدة يوم واحد مجانًا",
        createdAt: new Date().toISOString(),
        usedAt: null
    };
    coupons.unshift(coupon);
    localStorage.setItem("asirRewardCoupons", JSON.stringify(coupons));
    addNotification(`مبروك! حصلت على كوبون ${coupon.title}.`);
}

function showRewards() {
    const count = Number(localStorage.getItem("loyaltyRequestCount") || 0);
    const progress = count % 5;
    const remaining = progress === 0 && count > 0 ? 5 : 5 - progress;
    const coupons = JSON.parse(localStorage.getItem("asirRewardCoupons") || "[]").map((coupon) => ({ ...coupon, title: "جولة مع نفس للسياحة لمدة يوم واحد مجانًا" }));
    localStorage.setItem("asirRewardCoupons", JSON.stringify(coupons));
    openUtility("مكافآت ضيوف عسير", "fa-ticket", `<div class="loyalty-card"><i class="fa-solid fa-route"></i><span><small>مكافأة كل 5 طلبات</small><h3>جولة مع نفس للسياحة لمدة يوم واحد مجانًا</h3><p><b>أكملت ${progress} من 5 طلبات</b> · متبقي ${remaining} للمكافأة التالية</p></span></div><div class="loyalty-progress"><span style="width:${progress / 5 * 100}%"></span></div><div class="coupon-list">${coupons.length ? coupons.map((coupon) => `<article class="reward-coupon ${coupon.usedAt ? "used" : ""}"><div><i class="fa-solid fa-ticket"></i><span><strong>${coupon.title}</strong><code>${coupon.id}</code><small>${coupon.usedAt ? `تم الاستخدام في ${new Date(coupon.usedAt).toLocaleDateString("ar-SA")}` : "متاح للاستخدام"}</small></span></div>${coupon.usedAt ? "" : `<button type="button" data-redeem-coupon="${coupon.id}">استخدام الكوبون</button>`}</article>`).join("") : `<p class="coupon-empty">أكمل 5 طلبات لدى الوكلاء للحصول على أول كوبون.</p>`}</div>`);
    utilityContent.querySelector(".coupon-list")?.addEventListener("click", (event) => {
        const redeemButton = event.target.closest("[data-redeem-coupon]");
        if (!redeemButton) return;
        const savedCoupons = JSON.parse(localStorage.getItem("asirRewardCoupons") || "[]");
        const selectedCoupon = savedCoupons.find((coupon) => coupon.id === redeemButton.dataset.redeemCoupon);
        if (!selectedCoupon || selectedCoupon.usedAt) return;
        selectedCoupon.usedAt = new Date().toISOString();
        localStorage.setItem("asirRewardCoupons", JSON.stringify(savedCoupons));
        addNotification(`تم استخدام الكوبون ${selectedCoupon.id}. سيتواصل معك فريق الخدمة لتأكيد الجولة.`);
        showRewards();
    });
}

function getMainAssistantItems(type, requestText = "") {
    const ignoredSearchWords = new Set(["شركة", "فندق", "فنادق", "شقة", "سكن", "جامعة", "مدرسة", "وكيل", "أبها", "خميس", "مشيط"]);
    const normalizedRequest = requestText.trim().toLowerCase();
    const exactEntries = agents[type].items.filter((entry) => {
        const name = String(entry.name || entry[0] || "");
        const meaningfulWords = name.split(/[\s|–—-]+/).filter((word) => word.length >= 4 && !ignoredSearchWords.has(word));
        const englishName = interfaceTranslations[name] || "";
        const englishWords = englishName.split(/[\s|–—-]+/).filter((word) => word.length >= 4 && !["company", "hotel", "agent", "school", "university"].includes(word.toLowerCase()));
        return [...meaningfulWords, ...englishWords].some((word) => normalizedRequest.includes(word.toLowerCase()));
    });
    const entries = exactEntries.length ? exactEntries : agents[type].items.slice(0, 3);
    return entries.map((entry) => {
        const name = entry.name || entry[0];
        const secondary = type === "housing"
            ? `${entry.location} · ${entry.nightly || entry.monthly}`
            : type === "hr"
                ? `${entry.type || entry.location}${entry.phone ? ` · ${entry.phone}` : ""}`
                : `${entry.location}${entry.fee ? ` · ${entry.fee}` : ""}`;
        return `<li class="main-result-item" tabindex="0" role="button" data-result-agent="${type}" data-result-name="${escapeHtml(name)}" data-result-group="${entry.group || ""}"><i class="fa-solid fa-circle-check"></i><span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(secondary)}</small></span><i class="fa-solid fa-arrow-left"></i></li>`;
    }).join("");
}

function openExactAgentResult(type, name, group = "") {
    const route = mainAgentRoutes.find((item) => item.type === type);
    if (!route) return;
    openAgent(route.title, route.type);
    if (type === "education" && group) renderRecommendations(agents.education, group);
    const cards = [...recommendationsList.querySelectorAll(".recommendation-item")];
    cards.forEach((card) => {
        const isTarget = card.querySelector("strong")?.textContent.trim() === name;
        card.hidden = !isTarget;
        card.classList.toggle("search-target", isTarget);
        if (isTarget) window.setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
    });
    listTitle.textContent = `نتيجة البحث: ${name}`;
    userInput.value = `أريد تفاصيل ${name}`;
}

function runMainAssistant(requestText) {
    const normalizedRequest = requestText.trim().toLowerCase();
    let selectedRoutes = mainAgentRoutes.filter((route) => route.keywords.some((keyword) => normalizedRequest.includes(keyword)));
    if (!selectedRoutes.length) selectedRoutes = mainAgentRoutes;
    saveConversation("المستخدم", requestText, "المساعد الرئيسي");
    registerLoyaltyRequest();

    mainAssistantOutput.hidden = false;
    mainAssistantOutput.innerHTML = `
        <div class="assistant-analysis">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span><strong>جاري تحليل الطلب</strong><small>تحديد الوكلاء المناسبين وتجهيز النتائج...</small></span>
        </div>`;

    window.setTimeout(() => {
        mainAssistantOutput.innerHTML = `
            <div class="activated-agents">
                <div class="results-summary-bar">
                    <strong><i class="fa-solid fa-diagram-project"></i> تم تشغيل ${selectedRoutes.length} ${selectedRoutes.length === 1 ? "وكيل" : "وكلاء"}</strong>
                    <button class="close-main-search" type="button" aria-label="إغلاق نتائج البحث" title="إغلاق نتائج البحث"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div>${selectedRoutes.map((route) => `<span><i class="fa-solid ${route.icon}"></i>${route.title}<b>نشط</b></span>`).join("")}</div>
            </div>
            <div class="combined-results">
                ${selectedRoutes.map((route) => `<article>
                    <header><i class="fa-solid ${route.icon}"></i><span><strong>${route.title}</strong><small>${agents[route.type].description}</small></span></header>
                    <ul>${getMainAssistantItems(route.type, requestText)}</ul>
                    <div class="result-card-actions"><button type="button" data-rate-result="up" aria-label="إعجاب"><i class="fa-regular fa-thumbs-up"></i></button><button type="button" data-rate-result="down" aria-label="عدم إعجاب"><i class="fa-regular fa-thumbs-down"></i></button></div>
                    <button type="button" data-open-main-agent="${route.type}" data-agent-title="${route.title}">فتح الوكيل والتفاصيل <i class="fa-solid fa-arrow-left"></i></button>
                </article>`).join("")}
            </div><button class="share-results-btn" type="button"><i class="fa-solid fa-share-nodes"></i> مشاركة النتائج</button>`;
        saveConversation("المساعد", `تم تشغيل: ${selectedRoutes.map((route) => route.title).join("، ")}`, "المساعد الرئيسي");
        addNotification(`اكتمل تحليل طلبك بواسطة ${selectedRoutes.length} ${selectedRoutes.length === 1 ? "وكيل" : "وكلاء"}.`);
    }, 650);
}

function saveConversation(role, text, agentName) {
    const history = JSON.parse(localStorage.getItem("conversationHistory") || "[]");
    history.unshift({ role, text, agent: agentName, date: new Date().toLocaleString("ar-SA") });
    localStorage.setItem("conversationHistory", JSON.stringify(history.slice(0, 100)));
}

function showModal() {
    lastFocusedElement = document.activeElement;
    modal.classList.add("show");
    document.body.classList.add("modal-open");
    window.setTimeout(() => userInput.focus(), 100);
}

function openAgent(title, type) {
    activeAgent = agents[type] ? type : "housing";
    const agent = agents[activeAgent];
    modalTitle.textContent = title;
    modalDescription.textContent = agent.description;
    chatAgentName.textContent = title;
    modalIcon.className = `fa-solid ${agent.icon}`;
    welcomeMessage.textContent = "مرحباً! كيف يمكنني مساعدتك اليوم؟";
    messages.replaceChildren();
    getAgentMemory(activeAgent).slice(-6).forEach((memory) => appendMessage(memory.text, memory.role === "assistant" ? "bot-message" : "user-message", false));
    userInput.value = "";
    suggestedPrompts.hidden = false;
    suggestedPrompts.innerHTML = agentPromptSuggestions[activeAgent].map((prompt) => `<button type="button">${prompt}</button>`).join("");
    agentWorkspace.classList.add("chat-collapsed");
    agentChatToggle.setAttribute("aria-expanded", "false");
    agentChatToggle.innerHTML = '<i class="fa-solid fa-robot"></i><span>افتح الوكيل الذكي</span>';
    renderRecommendations(agent);
    showModal();
}

function renderRecommendations(agent, educationGroup = "universities") {
    document.querySelector(".education-filters")?.remove();
    document.querySelector(".education-side-tools")?.remove();
    document.querySelector(".entertainment-filters")?.remove();
    document.querySelector(".agent-features")?.remove();
    document.querySelector(".housing-controls")?.remove();
    document.querySelector(".comparison-summary")?.remove();
    document.querySelector(".transport-controls")?.remove();
    document.querySelector(".transport-result")?.remove();
    document.querySelector(".hr-toolbox")?.remove();
    document.querySelector(".agent-toolbox")?.remove();
    if (agent.features && agent !== agents.transport && agent !== agents.housing && agent !== agents.education) {
        const features = document.createElement("div");
        features.className = "agent-features";
        features.innerHTML = agent.features.map(([icon, label, action], index) => `<button type="button" data-feature="${action ?? index}"><i class="fa-solid ${icon}"></i>${label}</button>`).join("");
        recommendationsList.before(features);
        features.addEventListener("click", (event) => {
            const featureButton = event.target.closest("button");
            if (!featureButton) return;
            features.querySelectorAll("button").forEach((button) => button.classList.remove("selected"));
            featureButton.classList.add("selected");
            const action = Number(featureButton.dataset.feature);
            if (agent === agents.housing) {
                if (action === 0) document.querySelector("#housingSearch")?.focus();
                if (action === 1) document.querySelector("#housingArea")?.focus();
                if (action === 2) window.open("https://www.google.com/maps/search/?api=1&query=hotels+and+apartments+in+Abha", "_blank", "noopener,noreferrer");
                if (action === 3) {
                    housingState.favoritesOnly = !housingState.favoritesOnly;
                    renderRecommendations(agent);
                }
                if (action === 4) showHousingComparison();
            }
            if (agent === agents.transport) {
                if (action <= 2) document.querySelector(action === 0 ? "#transportOption" : "#transportDistance")?.focus();
                if (action === 3) showSavedTransportTrips();
                if (action === 4) window.open("https://www.google.com/maps/search/?api=1&query=bus+station+taxi+stand+near+me+Abha", "_blank", "noopener,noreferrer");
            }
            if (agent === agents.hr) showHrTool(action);
            if (agent === agents.education) showEducationTool(action);
            if (agent === agents.entertainment) showEntertainmentTool(action);
        });
    }
    let visibleItems = agent.items;
    if (agent === agents.transport) {
        const rentalCompanies = [
            { value: "yelo", label: "يلو", logo: "assets/transport-companies/yelo.svg", url: "https://www.iyelo.com/" },
            { value: "lumi", label: "لومي", logo: "assets/transport-companies/lumi.svg", url: "https://lumirental.com/" },
            { value: "budget", label: "بدجت", logo: "assets/transport-companies/budget.svg", url: "https://www.budgetsaudi.com/" },
            { value: "alfaris", label: "الفارس", logo: "assets/transport-companies/alfaris.svg", url: "https://www.google.com/maps/search/?api=1&query=الفارس+لتأجير+السيارات+أبها" },
            { value: "abudiyab", label: "أبو ذياب", logo: "assets/transport-companies/abu-diyab.svg", url: "https://www.google.com/maps/search/?api=1&query=أبو+ذياب+لتأجير+السيارات+أبها" }
        ];
        const rideCompanies = [
            { label: "أوبر", icon: "fa-uber", brand: true, url: "https://www.uber.com/global/ar/r/cities/abha-asir-sa/", note: "اطلب مشوارًا داخل أبها" },
            { label: "كريم", icon: "fa-car", url: "https://www.careem.com/en-AE/ksa-rides/", note: "مشاوير متاحة على مدار الساعة" },
            { label: "جيني", icon: "fa-route", url: "https://www.jeeny.me/ar/home", note: "خيارات اقتصادية للمشاوير" },
            { label: "كيان", icon: "fa-taxi", url: "https://kaiian.net/Indexkaian.aspx", note: "توصيل وتتبع مباشر للرحلة" }
        ];
        const rentalCategoryLabels = { economy: "اقتصادية", sedan: "سيدان", "family-small": "عائلية صغيرة", "family-large": "عائلية واسعة" };
        const rentalToday = new Date();
        const rentalTomorrow = new Date(rentalToday);
        rentalTomorrow.setDate(rentalTomorrow.getDate() + 1);
        const rentalDateValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (!transportState.pickupDate) transportState.pickupDate = rentalDateValue(rentalToday);
        if (!transportState.returnDate) transportState.returnDate = rentalDateValue(rentalTomorrow);
        const suitableRentalCompanies = rentalCompanies
            .map((company) => ({ ...company, lowestRate: Math.min(...agent.items.filter((item) => item.company === company.value && (transportState.showAllRentalCompanies || item.category === transportState.category) && item.image.startsWith("assets/vehicles/")).map((item) => item.dailyRate)) }))
            .filter((company) => Number.isFinite(company.lowestRate))
            .sort((first, second) => first.lowestRate - second.lowestRate);
        const controls = document.createElement("div");
        controls.className = "transport-controls simple-transport-filters";
        controls.innerHTML = `
            <div class="transport-mode-tabs"><button type="button" data-transport-mode="rental" class="${transportState.mode === "rental" ? "active" : ""}"><i class="fa-solid fa-key"></i><span><strong>تأجير سيارات</strong><small>اختر شركة ثم شاهد السيارات</small></span></button><button type="button" data-transport-mode="ride" class="${transportState.mode === "ride" ? "active" : ""}"><i class="fa-solid fa-taxi"></i><span><strong>طلب سيارة</strong><small>أوبر وكريم وجيني وكيان</small></span></button></div>
            ${transportState.mode === "rental" ? `
                <form class="rental-search-form"><label><span>المدينة</span><select id="rentalCity">${["أبها", "خميس مشيط", "أحد رفيدة", "محايل عسير"].map((city) => `<option ${transportState.rentalCity === city ? "selected" : ""}>${city}</option>`).join("")}</select></label><label><span>تاريخ الاستلام</span><input id="rentalPickup" type="date" min="${rentalDateValue(rentalToday)}" value="${transportState.pickupDate}" required></label><label><span>تاريخ التسليم</span><input id="rentalReturn" type="date" min="${transportState.pickupDate}" value="${transportState.returnDate}" required></label><label><span>نوع السيارة</span><select id="rentalCategory">${Object.entries(rentalCategoryLabels).map(([value, label]) => `<option value="${value}" ${transportState.category === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><div class="rental-search-actions"><button type="submit" data-rental-search="best"><i class="fa-solid fa-wand-magic-sparkles"></i> اقتراح أفضل الشركات</button></div></form>
                ${transportState.rentalSearchReady ? `<section class="transport-company-filter"><h4>الشركات المناسبة لطلبك</h4><div class="rental-company-grid">${suitableRentalCompanies.map((company, index) => `<article class="${index === 0 ? "recommended" : ""}">${index === 0 ? `<em class="best-company-badge">أفضل سعر</em>` : ""}<img src="${company.logo}" alt="شعار ${company.label}"><strong>${company.label}</strong><small>يبدأ من ${company.lowestRate} ر.س يوميًا</small><button type="button" data-select-rental-company="${company.value}"><i class="fa-solid fa-circle-check"></i> اختيار الشركة</button></article>`).join("")}</div></section>` : ""}` : transportState.mode === "ride" ? `
                <div class="ride-company-grid">${rideCompanies.map((company, index) => `<article class="ride-service-card"><i class="fa-${company.brand ? "brands" : "solid"} ${company.icon}"></i><span><strong>${company.label}</strong><small>${company.note}</small></span><div><a href="${company.url}" target="_blank" rel="noopener noreferrer">اطلب من الموقع <i class="fa-solid fa-arrow-up-right-from-square"></i></a><button type="button" data-ride-payment="${index}"><i class="fa-solid fa-lock"></i> الدفع داخل التطبيق <small>قريبًا</small></button></div></article>`).join("")}</div>
                <div class="ride-payment-note"><i class="fa-solid fa-shield-halved"></i><span><strong>الحجز والدفع حاليًا عبر الموقع الرسمي</strong><small>اختاري التطبيق أعلاه لإكمال الرحلة بأمان. مستقبلًا سيتوفر الدفع مباشرة داخل ضيوف عسير بعد التكامل الرسمي.</small></span></div>` : ""}`;
        recommendationsList.before(controls);
        controls.querySelector(".transport-mode-tabs").addEventListener("click", (event) => {
            const modeButton = event.target.closest("[data-transport-mode]");
            if (!modeButton) return;
            transportState.mode = modeButton.dataset.transportMode;
            transportState.company = "";
            transportState.rentalSearchReady = false;
            transportState.showAllRentalCompanies = false;
            renderRecommendations(agent);
        });
        controls.querySelector(".rental-search-form")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const pickup = controls.querySelector("#rentalPickup");
            const returnDate = controls.querySelector("#rentalReturn");
            returnDate.setCustomValidity(returnDate.value <= pickup.value ? "يجب أن يكون تاريخ التسليم بعد تاريخ الاستلام" : "");
            if (!event.currentTarget.reportValidity()) return;
            transportState.rentalCity = controls.querySelector("#rentalCity").value;
            transportState.pickupDate = pickup.value;
            transportState.returnDate = returnDate.value;
            transportState.category = controls.querySelector("#rentalCategory").value;
            transportState.showAllRentalCompanies = event.submitter?.dataset.rentalSearch === "best";
            transportState.rentalSearchReady = true;
            renderRecommendations(agent);
        });
        controls.querySelector(".transport-company-filter")?.addEventListener("click", (event) => {
            const companyButton = event.target.closest("[data-select-rental-company]");
            if (!companyButton) return;
            const company = suitableRentalCompanies.find((item) => item.value === companyButton.dataset.selectRentalCompany);
            if (company) openRentalCompanyRequest(company, rentalCategoryLabels[transportState.category], company.lowestRate);
        });
        controls.querySelector(".ride-company-grid")?.addEventListener("click", (event) => {
            const paymentButton = event.target.closest("[data-ride-payment]");
            if (!paymentButton) return;
            const company = rideCompanies[Number(paymentButton.dataset.ridePayment)];
            const requestId = createFutureOrderId("RIDE");
            openFuturePaymentPreview({ id: requestId, company: company.label, service: "طلب سيارة", summary: company.note, city: "منطقة عسير", total: 0, createdAt: new Date().toISOString() });
        });
        controls.querySelector("#transportPrice")?.addEventListener("input", (event) => {
            controls.querySelector("#transportPriceOutput").textContent = `حتى ${event.target.value} ر.س`;
        });
        controls.querySelector("#transportPrice")?.addEventListener("change", (event) => {
            transportState.maxPrice = Number(event.target.value);
            renderRecommendations(agent);
        });
        controls.querySelector(".transport-category-filter")?.addEventListener("click", (event) => {
            const categoryButton = event.target.closest("[data-transport-category]");
            if (!categoryButton) return;
            transportState.category = categoryButton.dataset.transportCategory;
            renderRecommendations(agent);
        });
        visibleItems = [];
        listTitle.textContent = transportState.mode === "ride" ? "اختر تطبيق طلب السيارة" : transportState.mode === "rental" ? transportState.rentalSearchReady ? "اختاري الشركة المناسبة" : "أدخلي بيانات التأجير" : "اختر تأجير سيارات أو طلب سيارة";
    } else if (agent === agents.housing) {
        const controls = document.createElement("form");
        controls.className = "housing-controls simple-housing-controls";
        controls.innerHTML = `
            <div class="housing-search-row"><input id="housingSearch" type="search" value="${escapeHtml(housingState.query)}" placeholder="ابحث عن شقة أو فندق أو فيلا" aria-label="البحث عن سكن"><button type="submit"><i class="fa-solid fa-magnifying-glass"></i><span>بحث</span></button></div>
            <details class="housing-advanced-filters">
                <summary><i class="fa-solid fa-map-location-dot"></i> خريطة الفنادق</summary>
                <div>
                    <p class="map-description">اعرض مواقع الفنادق في أبها مباشرة على الخريطة.</p>
                    <button id="housingMapBtn" class="housing-map-button" type="button"><i class="fa-solid fa-map-location-dot"></i> عرض مواقع الفنادق</button>
                </div>
            </details>`;
        recommendationsList.before(controls);
        controls.querySelector("#housingMapBtn").addEventListener("click", showServiceMap);
        controls.addEventListener("submit", (event) => {
            event.preventDefault();
            housingState.query = controls.querySelector("#housingSearch").value.trim();
            housingState.area = "all";
            housingState.maxBudget = Infinity;
            renderRecommendations(agent);
        });
        visibleItems = agent.items.filter((item) => {
            const matchesQuery = !housingState.query || `${item.name} ${item.location}`.includes(housingState.query);
            const matchesArea = housingState.area === "all" || item.location === housingState.area;
            const matchesBudget = item.monthlyRate <= housingState.maxBudget;
            const matchesFavorites = !housingState.favoritesOnly || housingState.favorites.has(item.name);
            return matchesQuery && matchesArea && matchesBudget && matchesFavorites;
        });
        listTitle.textContent = housingState.favoritesOnly ? "المساكن المحفوظة في المفضلة" : agent.listTitle;
    } else if (agent === agents.hr) {
        listTitle.textContent = agent.listTitle;
    } else if (agent === agents.education) {
        const filters = document.createElement("div");
        filters.className = "education-filters";
        const choices = [
            ["universities", "الجامعات والكليات", "fa-building-columns"],
            ["government-schools", "مدارس حكومية", "fa-school"],
            ["private-schools", "مدارس أهلية / خاصة", "fa-graduation-cap"],
            ["courses", "الدورات", "fa-laptop-file"]
        ];
        choices.forEach(([value, label, icon]) => {
            const filterButton = document.createElement("button");
            filterButton.type = "button";
            filterButton.className = value === educationGroup ? "active" : "";
            filterButton.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
            filterButton.addEventListener("click", () => renderRecommendations(agent, value));
            filters.appendChild(filterButton);
        });
        recommendationsList.before(filters);
        const sideTools = document.createElement("div");
        sideTools.className = "education-side-tools";
        if (educationGroup === "private-schools") sideTools.innerHTML = `<button type="button" data-school-fit-tool><i class="fa-solid fa-wand-magic-sparkles"></i><span>اكتشف المدرسة المناسبة لابنك</span></button><button type="button" data-nearest-private-school><i class="fa-solid fa-location-crosshairs"></i><span>أقرب مدرسة أهلية لي</span></button>`;
        if (educationGroup === "government-schools") sideTools.innerHTML = `<button type="button" data-nearest-school><i class="fa-solid fa-location-crosshairs"></i><span>أقرب مدرسة حكومية لي</span></button>`;
        if (educationGroup === "courses") sideTools.innerHTML = `<label class="course-track-filter"><span>ما تخصصك؟</span><select><option value="all">عرض جميع الدورات</option>${["علوم الحاسب", "الذكاء الاصطناعي", "الأمن السيبراني", "إدارة الأعمال", "التسويق", "اللغة الإنجليزية"].map((track) => `<option value="${track}" ${educationState.courseTrack === track ? "selected" : ""}>${track}</option>`).join("")}</select></label>`;
        if (sideTools.innerHTML) {
            filters.after(sideTools);
            sideTools.querySelector("[data-school-fit-tool]")?.addEventListener("click", openSchoolFitAssessment);
            sideTools.querySelector("[data-nearest-school]")?.addEventListener("click", () => findNearestGovernmentSchool("government"));
            sideTools.querySelector("[data-nearest-private-school]")?.addEventListener("click", () => findNearestGovernmentSchool("private"));
            sideTools.querySelector(".course-track-filter select")?.addEventListener("change", (event) => { educationState.courseTrack = event.target.value; renderRecommendations(agent, "courses"); });
        }
        visibleItems = agent.items.filter((item) => item.group === educationGroup && (educationGroup !== "courses" || educationState.courseTrack === "all" || item.courseTrack === educationState.courseTrack));
        const titles = { universities: "الجامعات والكليات في أبها", "government-schools": "المدارس الحكومية في أبها", "private-schools": "المدارس الأهلية والخاصة في أبها", courses: "الدورات المتاحة" };
        listTitle.textContent = titles[educationGroup];
    } else if (agent === agents.entertainment) {
        const selectedGroup = ["cafes", "restaurants", "movies", "activities"].includes(educationGroup) ? educationGroup : "restaurants";
        const filters = document.createElement("div");
        filters.className = "entertainment-filters";
        const choices = [
            ["cafes", "كوفيهات", "fa-mug-hot"],
            ["restaurants", "مطاعم", "fa-utensils"],
            ["movies", "أفلام", "fa-film"],
            ["activities", "أنشطة", "fa-person-hiking"]
        ];
        filters.innerHTML = choices.map(([value, label, icon]) => `<button type="button" data-entertainment-group="${value}" class="${value === selectedGroup ? "active" : ""}"><i class="fa-solid ${icon}"></i><span>${label}</span></button>`).join("");
        filters.addEventListener("click", (event) => {
            const filterButton = event.target.closest("[data-entertainment-group]");
            if (filterButton) renderRecommendations(agent, filterButton.dataset.entertainmentGroup);
        });
        recommendationsList.before(filters);
        visibleItems = agent.items.filter((item) => item.group === selectedGroup);
        visibleItems.sort((first, second) => Number(Boolean(second.featuredLocal)) - Number(Boolean(first.featuredLocal)));
        listTitle.textContent = { cafes: "كوفيهات في أبها", restaurants: "مطاعم في أبها", movies: "الأفلام ودور السينما", activities: "أنشطة في أبها" }[selectedGroup];
    } else {
        listTitle.textContent = agent.listTitle;
    }
    recommendationsList.replaceChildren();
    recommendationsList.style.display = agent === agents.transport ? "none" : "";
    visibleItems.forEach((entry) => {
        const rich = !Array.isArray(entry) && Boolean(entry.monthly);
        const visual = !Array.isArray(entry) && Boolean(entry.image) && !rich;
        const transportCard = agent === agents.transport;
        const name = Array.isArray(entry) ? entry[0] : entry.name;
        const detail = Array.isArray(entry) ? entry[1] : entry.location;
        const button = document.createElement(rich || transportCard || visual ? "article" : "button");
        if (!rich && !transportCard && !visual) button.type = "button";
        button.className = transportCard ? "recommendation-item transport-vehicle-card" : rich ? "recommendation-item property-item" : visual ? `recommendation-item visual-option-item ${entry.imageType || "photo"}${entry.featuredLocal ? " productive-family-card" : ""}` : "recommendation-item";
        button.innerHTML = transportCard
            ? `<img src="${entry.image}" alt="${name}" loading="lazy"><span class="transport-vehicle-content"><span class="transport-card-top"><span class="transport-year">${entry.year}</span><span class="transport-company-badge">${entry.companyName}</span></span><strong>${name}</strong><small><i class="fa-solid fa-location-dot"></i> ${detail}</small><span class="transport-specs"><em><i class="fa-solid fa-user-group"></i>${entry.seats} ركاب</em><em><i class="fa-solid fa-suitcase-rolling"></i>${entry.bags} حقائب</em><em><i class="fa-solid fa-gears"></i>أوتوماتيك</em></span><span class="transport-booking-row"><b>${entry.dailyRate} ر.س<small>/ يوم</small></b><button type="button" data-book-transport><i class="fa-solid fa-calendar-check"></i> احجز الآن</button></span></span>`
            : rich
            ? `<img src="${entry.image}" alt="${name}" loading="lazy"><span class="property-content"><span class="property-top"><strong>${name}</strong></span><span class="hotel-availability"><i class="fa-solid fa-circle-check"></i><span><strong>الحجز متاح</strong><small>السعر والتوفر يظهران في موقع الفندق</small></span></span><span class="property-actions simple-property-actions"><button type="button" data-action="map"><i class="fa-solid fa-map-location-dot"></i> الموقع</button><button type="button" data-action="favorite" class="${housingState.favorites.has(name) ? "active" : ""}"><i class="fa-${housingState.favorites.has(name) ? "solid" : "regular"} fa-heart"></i> حفظ</button>${entry.bookable ? `<button class="official-hotel-booking" type="button" data-action="book"><i class="fa-solid fa-arrow-up-right-from-square"></i> احجز من موقع الفندق</button><button class="hotel-future-payment" type="button" data-action="future-payment"><i class="fa-solid fa-lock"></i> الدفع داخل التطبيق <small>قريبًا</small></button>` : ""}</span></span>`
            : visual
                ? `${entry.featuredLocal ? `<span class="productive-family-symbol"><i class="fa-solid fa-house-chimney-heart"></i></span><span class="productive-family-badge">منتج محلي من أسر عسير</span>` : `<img src="${entry.image}" alt="${name}" loading="lazy">`}<span class="visual-option-content"><strong>${name}</strong>${entry.featuredLocal ? "" : entry.mapUrl ? `<span class="entity-location" data-map="${entry.mapUrl}"><i class="fa-solid fa-location-dot"></i> ${detail}</span>` : `<small><i class="fa-solid fa-location-dot"></i> ${detail}</small>`}${entry.type ? `<span class="education-type">${entry.type}</span>` : ""}${entry.details ? `<span class="education-details">${entry.details.map((item) => `<em>${item}</em>`).join("")}</span>` : ""}${entry.fee ? `<b class="education-fee"><i class="fa-solid fa-coins"></i> ${entry.fee}</b>` : ""}${entry.phone && agent !== agents.hr ? `<span class="entity-phone" data-phone="${entry.phoneDial}"><i class="fa-solid fa-phone"></i><b dir="ltr">${entry.phone}</b><em>اضغط للاتصال</em></span>` : ""}${agent === agents.hr ? `<span class="company-application-actions"><button class="company-apply-button" type="button" data-company-apply><i class="fa-solid fa-arrow-up-right-from-square"></i> الموقع الرسمي</button><button class="company-apply-button future" type="button" data-company-future-apply><i class="fa-solid fa-file-arrow-up"></i> التقديم داخل ضيوف عسير <small>قريبًا</small></button></span>` : ""}${agent === agents.education && entry.group === "universities" ? `<button class="education-primary-action" type="button" data-education-action="admission"><i class="fa-solid fa-calendar-days"></i> مواعيد التسجيل والتنبيه</button>` : ""}${agent === agents.education && entry.group === "courses" ? `<button class="education-primary-action future" type="button" data-education-action="course"><i class="fa-solid fa-calendar-check"></i> التسجيل والدفع <small>قريبًا</small></button>` : ""}${agent === agents.education && entry.group === "private-schools" ? `<span class="education-registration-actions"><button class="education-primary-action" type="button" data-education-official><i class="fa-solid fa-arrow-up-right-from-square"></i> موقع المدرسة</button><button class="education-primary-action future" type="button" data-education-action="school"><i class="fa-solid fa-file-pen"></i> التسجيل والدفع <small>قريبًا</small></button></span>` : ""}${agent === agents.entertainment ? `<span class="entertainment-card-actions">${entry.featuredLocal ? `<button type="button" data-entertainment-action="families"><i class="fa-solid fa-store"></i> عرض الأسر والمنتجات</button>` : ["cafes", "restaurants"].includes(entry.group) ? `<button type="button" data-entertainment-action="table"><i class="fa-solid fa-chair"></i> احجز طاولة</button><button class="entertainment-order-future" type="button" data-entertainment-action="order"><i class="fa-solid fa-bag-shopping"></i> اطلب الآن <small>قريبًا</small></button>` : `<button type="button" data-entertainment-official><i class="fa-solid fa-arrow-up-right-from-square"></i> الحجز عبر الموقع الرسمي</button><button type="button" data-entertainment-action="${entry.group === "activities" ? "activity" : "movie"}"><i class="fa-solid fa-ticket"></i> الحجز داخل ضيوف عسير <small>قريبًا</small></button>`}</span>` : ""}</span>`
                : `<i class="fa-solid ${agent.icon}"></i><span><strong>${name}</strong><small>${detail}</small></span>`;
        if (agent === agents.hr && !entry.careersUrl) button.querySelector("[data-company-apply]")?.remove();
        if (agent === agents.hr && entry.careersUrl) {
            const officialApplyButton = button.querySelector("[data-company-apply]");
            if (officialApplyButton) officialApplyButton.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> التقديم في الموقع الرسمي';
        }
        button.addEventListener("click", (event) => {
            const educationAction = event.target.closest("[data-education-action]");
            if (agent === agents.education && event.target.closest("[data-education-official]")) {
                if (entry.officialUrl) window.open(entry.officialUrl, "_blank", "noopener,noreferrer");
                return;
            }
            if (agent === agents.education && educationAction) {
                if (educationAction.dataset.educationAction === "admission") openUniversityAdmissionTracker(entry);
                else if (educationAction.dataset.educationAction === "fit") openSchoolFitAssessment(entry);
                else openEducationEnrollment(entry, educationAction.dataset.educationAction);
                return;
            }
            if (agent === agents.hr && event.target.closest("[data-company-future-apply]")) {
                openCompanyApplication(entry);
                return;
            }
            if (agent === agents.hr && event.target.closest("[data-company-apply]")) {
                window.open(entry.careersUrl, "_blank", "noopener,noreferrer");
                return;
            }
            const entertainmentAction = event.target.closest("[data-entertainment-action]");
            if (agent === agents.entertainment && event.target.closest("[data-entertainment-official]")) {
                window.open(entry.bookingUrl || entry.mapUrl, "_blank", "noopener,noreferrer");
                return;
            }
            if (agent === agents.entertainment && entertainmentAction) {
                const entertainmentActionName = entertainmentAction.dataset.entertainmentAction;
                if (entertainmentActionName === "families") {
                    openProductiveFamilies(entry);
                    return;
                }
                if (entertainmentActionName === "order") {
                    openVenueMenu(entry);
                    return;
                }
                if (entertainmentActionName === "movie") {
                    openMovieSelection(entry);
                    return;
                }
                openEntertainmentBooking(entry, entertainmentActionName);
                return;
            }
            const transportBooking = event.target.closest("[data-book-transport]");
            if (transportCard && transportBooking) {
                transportState.option = String(agent.items.indexOf(entry));
                const departure = document.querySelector("#transportFrom")?.value.trim() || "موقعك الحالي";
                const destination = document.querySelector("#transportTo")?.value.trim() || "الوجهة المختارة";
                transportState.from = departure;
                transportState.to = destination;
                openTransportBooking(entry, departure, destination);
                return;
            }
            const actionButton = event.target.closest("[data-action]");
            if (rich && actionButton) {
                const action = actionButton.dataset.action;
                if (action === "map") window.open(entry.mapUrl, "_blank", "noopener,noreferrer");
                if (action === "call") window.location.href = `tel:${entry.phone}`;
                if (action === "favorite") {
                    housingState.favorites.has(name) ? housingState.favorites.delete(name) : housingState.favorites.add(name);
                    localStorage.setItem("housingFavorites", JSON.stringify([...housingState.favorites]));
                    renderRecommendations(agent);
                }
                if (action === "compare") {
                    housingState.comparison.has(name) ? housingState.comparison.delete(name) : housingState.comparison.add(name);
                    renderRecommendations(agent);
                }
                if (action === "book" && entry.bookingUrl) window.open(entry.bookingUrl, "_blank", "noopener,noreferrer");
                if (action === "future-payment") {
                    openHotelFuturePayment(entry);
                }
                return;
            }
            userInput.value = rich
                ? `أريد تفاصيل ${name} في ${detail}، السعر ${entry.monthly} شهرياً` 
                : `أريد معلومات عن ${name}`;
            userInput.focus();
        });
        button.querySelector(".entity-phone")?.addEventListener("click", (event) => {
            event.stopPropagation();
            window.location.href = `tel:${event.currentTarget.dataset.phone}`;
        });
        button.querySelector(".entity-location")?.addEventListener("click", (event) => {
            event.stopPropagation();
            window.open(event.currentTarget.dataset.map, "_blank", "noopener,noreferrer");
        });
        recommendationsList.appendChild(button);
    });
    if (!visibleItems.length) {
        recommendationsList.innerHTML = agent === agents.transport
            ? transportState.mode === "rental"
                ? transportState.rentalSearchReady
                    ? ``
                    : ``
                : `<p class="housing-empty"><i class="fa-solid fa-taxi"></i> اختاري تطبيق التوصيل المناسب من الأعلى.</p>`
            : `<p class="housing-empty"><i class="fa-solid fa-house-circle-xmark"></i> لا توجد نتائج مطابقة. غيّر خيارات البحث أو الميزانية.</p>`;
    }
}

function showHousingComparison() {
    document.querySelector(".comparison-summary")?.remove();
    const selectedItems = agents.housing.items.filter((item) => housingState.comparison.has(item.name));
    const summary = document.createElement("div");
    summary.className = "comparison-summary";
    summary.innerHTML = selectedItems.length >= 2
        ? `<strong>مقارنة المساكن المختارة</strong>${selectedItems.map((item) => `<div><b>${item.name}</b><span>${item.location}</span><span>${item.monthly} شهرياً</span><span>${item.people}</span></div>`).join("")}`
        : `<p>اختر مسكنين أو أكثر باستخدام زر «مقارنة» لعرض المقارنة هنا.</p>`;
    recommendationsList.before(summary);
}

function createFutureOrderId(prefix = "WK") {
    const now = new Date();
    const dateCode = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const orders = JSON.parse(localStorage.getItem("futurePaymentOrders") || "[]");
    const sequence = orders.filter((item) => String(item.id || "").startsWith(`${prefix}-${dateCode}-`)).length + 1;
    return `${prefix}-${dateCode}-${String(sequence).padStart(6, "0")}`;
}

function openFuturePaymentPreview(order) {
    const normalizedOrder = {
        ...order,
        returnAgent: order.returnAgent || (order.category === "hotel" || String(order.service || "").includes("فندق") ? "housing" : String(order.service || "").includes("سيارة") || String(order.id || "").startsWith("WK-") || String(order.id || "").startsWith("RIDE-") ? "transport" : "")
    };
    const orders = JSON.parse(localStorage.getItem("futurePaymentOrders") || "[]");
    const existingIndex = orders.findIndex((item) => item.id === normalizedOrder.id);
    if (existingIndex >= 0) orders[existingIndex] = normalizedOrder;
    else orders.push(normalizedOrder);
    localStorage.setItem("futurePaymentOrders", JSON.stringify(orders));
    if (normalizedOrder.returnAgent && document.body.classList.contains("agents-only-page")) {
        const returnUrl = new URL(window.location.href);
        returnUrl.searchParams.set("agent", normalizedOrder.returnAgent);
        window.history.replaceState({}, "", returnUrl);
    }
    window.location.href = `payment-preview.html?order=${encodeURIComponent(normalizedOrder.id)}`;
}

function openHotelFuturePayment(entry) {
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 1);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    openUtility("بيانات حجز الفندق", "fa-hotel", `
        <form id="hotelFuturePaymentForm" class="transport-booking-form">
            <div class="transport-booking-summary"><span>حجز فندقي</span><h4>${escapeHtml(entry.name)}</h4><p>${escapeHtml(entry.location || "أبها")}</p><b>السعر النهائي حسب توفر الفندق</b></div>
            <div class="transport-booking-dates"><label><span>تاريخ الدخول</span><input name="checkIn" type="date" min="${formatDate(checkInDate)}" value="${formatDate(checkInDate)}" required></label><label><span>تاريخ الخروج</span><input name="checkOut" type="date" min="${formatDate(checkOutDate)}" value="${formatDate(checkOutDate)}" required></label></div>
            <label><span>نوع الغرفة</span><select name="roomType" required><option>غرفة قياسية</option><option>غرفة بإطلالة</option><option>جناح عائلي</option><option>جناح تنفيذي</option></select></label>
            <div class="transport-booking-dates"><label><span>عدد الغرف</span><input name="rooms" type="number" min="1" max="10" value="1" required></label><label><span>عدد البالغين</span><input name="adults" type="number" min="1" max="20" value="2" required></label></div>
            <label><span>عدد الأطفال</span><input name="children" type="number" min="0" max="10" value="0" required></label>
            <button type="submit"><i class="fa-solid fa-lock"></i> متابعة إلى معاينة الدفع <small>قريبًا</small></button>
            <small>هذه معاينة مستقبلية فقط، ولا يتم تنفيذ حجز أو دفع حقيقي.</small>
        </form>`);
    const form = utilityContent.querySelector("#hotelFuturePaymentForm");
    const checkIn = form.elements.checkIn;
    const checkOut = form.elements.checkOut;
    checkIn.addEventListener("change", () => {
        const minimum = new Date(`${checkIn.value}T00:00:00`);
        minimum.setDate(minimum.getDate() + 1);
        checkOut.min = formatDate(minimum);
        if (checkOut.value < checkOut.min) checkOut.value = checkOut.min;
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form));
        const nights = Math.max(1, Math.ceil((new Date(`${values.checkOut}T00:00:00`) - new Date(`${values.checkIn}T00:00:00`)) / 86400000));
        const estimatedNightlyRate = Number(entry.nightlyRate || entry.monthlyRate || 0);
        openFuturePaymentPreview({
            id: createFutureOrderId("HOTEL"), category: "hotel", company: entry.name, service: "حجز فندق",
            summary: `${values.roomType} · ${nights} ليلة`, city: entry.location || "أبها", total: estimatedNightlyRate > 0 ? estimatedNightlyRate * nights * Number(values.rooms) : 0,
            checkIn: values.checkIn, checkOut: values.checkOut, roomType: values.roomType, rooms: Number(values.rooms), adults: Number(values.adults), children: Number(values.children), nights,
            returnAgent: "housing", createdAt: new Date().toISOString()
        });
    });
}

function openRentalCompanyRequest(company, carType, dailyRate) {
    const bookings = JSON.parse(localStorage.getItem("transportBookings") || "[]");
    const now = new Date();
    const dateCode = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const sequence = bookings.filter((item) => String(item.id || "").startsWith(`WK-${dateCode}-`)).length + 1;
    const pickup = new Date(`${transportState.pickupDate}T00:00:00`);
    const returnDate = new Date(`${transportState.returnDate}T00:00:00`);
    const rentalDays = Math.max(1, Math.ceil((returnDate - pickup) / 86400000) || 1);
    const request = {
        id: `WK-${dateCode}-${String(sequence).padStart(6, "0")}`,
        company: company.label,
        companyKey: company.value,
        companyWebsite: company.url,
        city: transportState.rentalCity,
        pickupDate: transportState.pickupDate,
        returnDate: transportState.returnDate,
        carType,
        days: rentalDays,
        dailyRate,
        total: rentalDays * dailyRate,
        status: "بانتظار الإكمال لدى الشركة",
        createdAt: now.toISOString()
    };
    bookings.push(request);
    localStorage.setItem("transportBookings", JSON.stringify(bookings));
    addNotification(`تم إنشاء الطلب ${request.id} لدى ${request.company}`);
    openUtility("تم إنشاء طلب التأجير", "fa-circle-check", `
        <div class="rental-request-confirmation">
            <span class="transport-order-number"><small>رقم الطلب الداخلي</small><strong dir="ltr">${request.id}</strong></span>
            <div class="rental-request-company"><img src="${company.logo}" alt="شعار ${company.label}"><span><small>الشركة المختارة</small><strong>${company.label}</strong></span></div>
            <dl><div><dt>المدينة</dt><dd>${request.city}</dd></div><div><dt>نوع السيارة</dt><dd>${request.carType}</dd></div><div><dt>تاريخ الاستلام</dt><dd dir="ltr">${request.pickupDate}</dd></div><div><dt>تاريخ التسليم</dt><dd dir="ltr">${request.returnDate}</dd></div></dl>
            <a class="complete-company-booking" href="${company.url}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i><span><strong>زيارة الموقع الرسمي</strong><small>إكمال الحجز لدى ${company.label}</small></span></a>
            <button class="in-app-payment-soon" type="button"><i class="fa-solid fa-lock"></i><span><strong>الدفع داخل التطبيق</strong><small>قريبًا</small></span></button>
            <p>تم حفظ رقم الطلب داخل ضيوف عسير، ويمكنك الاحتفاظ به بعد الانتقال إلى الشركة.</p>
        </div>`);
    utilityContent.querySelector(".in-app-payment-soon")?.addEventListener("click", () => {
        openFuturePaymentPreview({ ...request, service: "تأجير سيارة", summary: request.carType, returnAgent: "transport" });
    });
}

function openTransportBooking(entry) {
    const formatLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const today = formatLocalDate(todayDate);
    const tomorrow = formatLocalDate(tomorrowDate);
    const companyWebsites = {
        yelo: "https://www.iyelo.com/",
        lumi: "https://lumirental.com/",
        budget: "https://www.budgetsaudi.com/",
        alfaris: "https://www.google.com/maps/search/?api=1&query=الفارس+لتأجير+السيارات+أبها",
        abudiyab: "https://www.google.com/maps/search/?api=1&query=أبو+ذياب+لتأجير+السيارات+أبها"
    };
    const categoryLabels = { economy: "اقتصادية", sedan: "سيدان", "family-small": "عائلية صغيرة", "family-large": "عائلية واسعة" };
    openUtility("إتمام حجز السيارة", "fa-car-side", `
        <form id="transportBookingForm" class="transport-booking-form">
            <div class="transport-booking-summary"><span>${entry.companyName}</span><h4>${entry.name}</h4><p>أكملي البيانات لإنشاء الطلب داخل ضيوف عسير</p><b>${entry.dailyRate} ر.س / يوم</b></div>
            <label><span>المدينة</span><select id="transportBookingCity" required><option>أبها</option><option>خميس مشيط</option><option>أحد رفيدة</option><option>محايل عسير</option></select></label>
            <div class="transport-booking-dates"><label><span>تاريخ الاستلام</span><input id="transportPickupDate" type="date" min="${today}" value="${today}" required></label><label><span>تاريخ التسليم</span><input id="transportReturnDate" type="date" min="${tomorrow}" value="${tomorrow}" required></label></div>
            <label><span>نوع السيارة</span><select id="transportCarType" required>${Object.entries(categoryLabels).map(([value, label]) => `<option value="${value}" ${entry.category === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
            <label><span>رقم الجوال</span><input id="transportBookingPhone" type="tel" inputmode="tel" pattern="05[0-9]{8}" placeholder="05XXXXXXXX" required></label>
            <div class="transport-booking-total"><span>الإجمالي التقديري</span><strong id="transportBookingTotal">${entry.dailyRate} ر.س</strong></div>
            <button type="submit"><i class="fa-solid fa-calendar-check"></i> إنشاء طلب الحجز</button>
            <small>لن يتم خصم مبلغ الآن. بعد إنشاء الطلب يمكنك الانتقال إلى الموقع الرسمي للشركة.</small>
        </form>`);
    const form = utilityContent.querySelector("#transportBookingForm");
    const pickupInput = form.querySelector("#transportPickupDate");
    const returnInput = form.querySelector("#transportReturnDate");
    const totalOutput = form.querySelector("#transportBookingTotal");
    const updateTransportTotal = () => {
        const pickup = new Date(`${pickupInput.value}T00:00:00`);
        const returnDate = new Date(`${returnInput.value}T00:00:00`);
        const days = Math.max(1, Math.ceil((returnDate - pickup) / 86400000) || 1);
        totalOutput.textContent = `${(days * entry.dailyRate).toLocaleString("ar-SA")} ر.س`;
    };
    pickupInput.addEventListener("change", () => {
        const minimumReturn = new Date(`${pickupInput.value}T00:00:00`);
        minimumReturn.setDate(minimumReturn.getDate() + 1);
        returnInput.min = formatLocalDate(minimumReturn);
        if (returnInput.value < returnInput.min) returnInput.value = returnInput.min;
        updateTransportTotal();
    });
    returnInput.addEventListener("change", updateTransportTotal);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        returnInput.setCustomValidity("");
        if (!form.reportValidity()) return;
        const pickup = new Date(`${pickupInput.value}T00:00:00`);
        const returnDate = new Date(`${returnInput.value}T00:00:00`);
        if (returnDate <= pickup) {
            returnInput.setCustomValidity("يجب أن يكون تاريخ التسليم بعد تاريخ الاستلام");
            returnInput.reportValidity();
            return;
        }
        const days = Math.ceil((returnDate - pickup) / 86400000);
        const bookings = JSON.parse(localStorage.getItem("transportBookings") || "[]");
        const dateCode = today.replaceAll("-", "");
        const sequence = bookings.filter((item) => String(item.id || "").startsWith(`WK-${dateCode}-`)).length + 1;
        const selectedCategory = form.querySelector("#transportCarType").value;
        const booking = {
            id: `WK-${dateCode}-${String(sequence).padStart(6, "0")}`,
            company: entry.companyName,
            companyKey: entry.company,
            companyWebsite: companyWebsites[entry.company],
            car: entry.name,
            carType: categoryLabels[selectedCategory],
            city: form.querySelector("#transportBookingCity").value,
            pickupDate: pickupInput.value,
            returnDate: returnInput.value,
            days,
            phone: form.querySelector("#transportBookingPhone").value,
            dailyRate: entry.dailyRate,
            total: days * entry.dailyRate,
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);
        localStorage.setItem("transportBookings", JSON.stringify(bookings));
        addNotification(`تم إنشاء الطلب ${booking.id} لدى ${entry.companyName}`);
        utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-circle-check"></i><h4>تم إنشاء طلب الحجز</h4><span class="transport-order-number"><small>رقم الطلب</small><strong dir="ltr">${booking.id}</strong></span><dl><div><dt>الشركة</dt><dd>${booking.company}</dd></div><div><dt>المدينة</dt><dd>${booking.city}</dd></div><div><dt>السيارة</dt><dd>${booking.car}</dd></div><div><dt>النوع</dt><dd>${booking.carType}</dd></div><div><dt>الاستلام</dt><dd dir="ltr">${booking.pickupDate}</dd></div><div><dt>التسليم</dt><dd dir="ltr">${booking.returnDate}</dd></div><div><dt>المدة</dt><dd>${booking.days} يوم</dd></div><div><dt>الإجمالي التقديري</dt><dd>${booking.total.toLocaleString("ar-SA")} ر.س</dd></div></dl><a class="complete-company-booking" href="${booking.companyWebsite}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> إكمال الحجز في موقع ${booking.company}</a><small>احتفظي برقم الطلب؛ تم حفظه داخل تطبيق ضيوف عسير.</small></div>`;
    });
}

function openEducationEnrollment(entry, kind) {
    const isSchool = kind === "school";
    const stages = isSchool ? Object.entries(entry.fees || {}) : [];
    const initialAmount = isSchool ? (stages[0]?.[1] || 0) : Number(entry.price || 0);
    const isFreeCourse = !isSchool && initialAmount === 0;
    openUtility(isSchool ? "التسجيل في المدرسة" : "التسجيل في الدورة", isSchool ? "fa-school" : "fa-laptop-file", `
        <form id="educationEnrollmentForm" class="education-enrollment-form">
            <div class="education-enrollment-heading"><img src="${entry.image}" alt="${entry.name}"><span><small>${isSchool ? "طلب تسجيل طالب" : "حجز مقعد تدريبي"}</small><strong>${entry.name}</strong><em>${entry.location}</em></span></div>
            <label><span>${isSchool ? "اسم الطالب" : "اسم المتدرب"}</span><input name="studentName" autocomplete="name" required></label>
            ${isSchool ? `<label><span>المرحلة الدراسية</span><select name="stage" id="schoolStageSelect">${stages.map(([stage, price]) => `<option value="${stage}" data-price="${price}">${stage} — ${price.toLocaleString("ar-SA")} ر.س سنويًا</option>`).join("")}</select></label>` : `<div class="course-enrollment-summary"><span>رسوم الدورة</span><strong>${isFreeCourse ? "مجانية" : `${initialAmount.toLocaleString("ar-SA")} ر.س`}</strong></div>`}
            <div class="education-enrollment-grid"><label><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" pattern="05[0-9]{8}" placeholder="05XXXXXXXX" required></label><label><span>البريد الإلكتروني</span><input name="email" type="email" placeholder="name@example.com" required></label></div>
            <input name="amount" id="educationEnrollmentAmount" type="hidden" value="${initialAmount}">
            ${isFreeCourse ? `<div class="free-table-booking-note"><i class="fa-solid fa-gift"></i><span><strong>التسجيل مجاني</strong><small>لن يُطلب منك إدخال وسيلة دفع.</small></span></div>` : `<div class="education-payable-total"><span>${isSchool ? "الرسوم السنوية للمرحلة" : "رسوم الدورة"}</span><strong id="educationPayableTotal">${initialAmount.toLocaleString("ar-SA")} ر.س</strong></div><fieldset class="payment-methods education-payment-methods"><legend>طريقة الدفع التجريبية <small class="soon-label">قريبًا</small></legend><label><input type="radio" name="payment" value="applepay" checked><span class="payment-logo applepay-logo"><i class="fa-brands fa-apple"></i> Pay</span><b>Apple Pay</b></label><label><input type="radio" name="payment" value="tabby"><img class="payment-brand-image" src="assets/payment/tabby-logo.svg" alt="Tabby"><b>تابي</b></label><label><input type="radio" name="payment" value="tamara"><img class="payment-brand-image" src="assets/payment/tamara-logo.svg" alt="Tamara"><b>تمارا</b></label></fieldset>`}
            <div class="future-service-note"><i class="fa-solid fa-shield-halved"></i><span><strong>تسجيل ودفع تجريبي</strong><small>لا يتم تنفيذ دفع حقيقي أو حفظ بيانات مالية.</small></span></div>
            <p class="payment-form-message" role="status" hidden></p>
            <button type="submit"><i class="fa-solid fa-credit-card"></i> متابعة التسجيل والدفع</button>
        </form>`);
    const form = utilityContent.querySelector("#educationEnrollmentForm");
    const stageSelect = form.querySelector("#schoolStageSelect");
    stageSelect?.addEventListener("change", () => {
        const amount = Number(stageSelect.selectedOptions[0].dataset.price);
        form.querySelector("#educationEnrollmentAmount").value = amount;
        form.querySelector("#educationPayableTotal").textContent = `${amount.toLocaleString("ar-SA")} ر.س`;
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form));
        const request = { id: `EDU-${Date.now().toString().slice(-8)}`, company: entry.name, service: isSchool ? "تسجيل مدرسة أهلية" : "تسجيل دورة", summary: isSchool ? `${values.stage} — ${values.studentName}` : `${entry.name} — ${values.studentName}`, city: entry.location, total: Number(values.amount || 0), createdAt: new Date().toISOString() };
        if (isFreeCourse) {
            utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-circle-check"></i><h4>تم إنشاء طلب تسجيل تجريبي</h4><strong>${escapeHtml(entry.name)}</strong><b>رقم الطلب: ${request.id}</b><small>سيتم تفعيل التسجيل المباشر بعد الربط مع الجهات التعليمية.</small></div>`;
            return;
        }
        openFuturePaymentPreview(request);
    });
}

function openSchoolFitAssessment() {
    const allSchools = agents.education.items.filter((item) => item.group === "private-schools");
    openUtility("اختيار المدرسة المناسبة", "fa-calculator", `
        <form id="schoolFitForm" class="school-fit-form">
            <p>حدد المادة التي يحتاج الطالب دعمًا فيها والمرحلة الدراسية لاقتراح مدرسة مناسبة.</p>
            <label><span>ما المادة التي يحتاج دعمًا فيها؟</span><select name="subject"><option>الرياضيات</option><option>العلوم</option><option>الحاسب</option><option>اللغة الإنجليزية</option><option>اللغة العربية</option><option>القراءة والكتابة</option><option>المهارات الدراسية</option></select></label>
            <label><span>مقدار الدعم المطلوب</span><select name="level"><option value="2">يحتاج دعمًا بسيطًا</option><option value="1">يحتاج دعمًا مكثفًا</option><option value="3">يريد تطوير مستواه</option></select></label>
            <label><span>المرحلة الدراسية</span><select name="stage"><option>ابتدائي</option><option>متوسط</option><option>ثانوي</option></select></label>
            <button type="submit"><i class="fa-solid fa-wand-magic-sparkles"></i> عرض المدرسة الأنسب</button>
            <div class="school-fit-result" hidden></div>
        </form>`);
    const form = utilityContent.querySelector("#schoolFitForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form));
        const candidates = allSchools.filter((school) => school.fees?.[values.stage]);
        const selected = candidates.find((school) => school.strengths?.includes(values.subject)) || candidates[0];
        const price = selected.fees?.[values.stage];
        const result = form.querySelector(".school-fit-result");
        result.hidden = false;
        result.innerHTML = `<i class="fa-solid fa-award"></i><span><small>الاقتراح الأنسب مبدئيًا</small><strong>${selected.name}</strong><p>تتوافق مع المادة المحددة، وننصح بالتواصل مع المدرسة للتأكد من توفر برنامج دعم ${values.subject} وإجراء تقييم مستوى قبل التسجيل.</p><b>${values.stage}: تُعتمد الرسوم والتوفر من المدرسة</b><button type="button" data-enroll-suggested>فتح التسجيل الرسمي</button></span>`;
        result.querySelector("[data-enroll-suggested]").addEventListener("click", () => {
            if (selected.officialUrl) window.open(selected.officialUrl, "_blank", "noopener,noreferrer");
            else openEducationEnrollment(selected, "school");
        });
    });
}

function findNearestGovernmentSchool(kind = "government") {
    const isPrivate = kind === "private";
    const schoolType = isPrivate ? "مدرسة أهلية" : "مدرسة حكومية";
    if (!navigator.geolocation) {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${schoolType} قريبة في أبها`)}`, "_blank", "noopener,noreferrer");
        return;
    }
    openUtility(`أقرب ${schoolType}`, "fa-location-crosshairs", `<div class="location-loading"><i class="fa-solid fa-spinner fa-spin"></i><strong>جاري تحديد موقعك…</strong><small>سيطلب المتصفح السماح بالوصول إلى الموقع.</small></div>`);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
        const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(schoolType)}/@${coords.latitude},${coords.longitude},14z`;
        utilityContent.innerHTML = `<div class="nearest-school-result"><i class="fa-solid fa-school"></i><h4>تم تحديد موقعك</h4><p>افتح الخريطة لعرض ${isPrivate ? "المدارس الأهلية" : "المدارس الحكومية"} الأقرب وترتيبها حسب المسافة.</p><a href="${mapUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-map-location-dot"></i> عرض المدارس القريبة</a></div>`;
    }, () => {
        utilityContent.innerHTML = `<div class="nearest-school-result"><i class="fa-solid fa-location-dot"></i><h4>تعذر الوصول إلى موقعك</h4><p>اسمح للموقع باستخدام موقع الجهاز ثم حاول مجددًا.</p><a href="https://www.google.com/maps/search/${encodeURIComponent(`${schoolType} في أبها`)}" target="_blank" rel="noopener noreferrer">البحث في خريطة أبها</a></div>`;
    }, { enableHighAccuracy: true, timeout: 10000 });
}

function openUniversityAdmissionTracker(universityEntry = agents.education.items.find((item) => item.name === "جامعة الملك خالد")) {
    const officialUrls = universityEntry.admissionUrls || {};
    const schedules = {
        bachelor: { label: "بكالوريوس", university: universityEntry.name, status: "تحقق من حالة القبول في موقع الجهة الرسمي", date: "تُعرض المواعيد المحدثة في بوابة الجهة الرسمية", url: officialUrls.bachelor || "https://dar.kku.edu.sa/" },
        master: { label: "ماجستير", university: universityEntry.name, status: "تحقق من توفر البرنامج وشروطه في الموقع الرسمي", date: "تُعرض المواعيد المحدثة في بوابة الجهة الرسمية", url: officialUrls.master || officialUrls.bachelor || "https://dps.kku.edu.sa/" },
        doctorate: { label: "دكتوراه", university: universityEntry.name, status: "تحقق من توفر البرنامج وشروطه في الموقع الرسمي", date: "تُعرض المواعيد المحدثة في بوابة الجهة الرسمية", url: officialUrls.doctorate || officialUrls.master || "https://dps.kku.edu.sa/" }
    };
    const specialties = [...new Set([...(universityEntry.details || []), "علوم الحاسب", "الذكاء الاصطناعي"])];
    openUtility("مواعيد القبول الجامعي", "fa-calendar-days", `<form id="admissionTrackerForm" class="admission-tracker-form"><p>حدد الدرجة والتخصص لعرض الموعد الرسمي المتاح وتفعيل التنبيه.</p><label><span>الدرجة العلمية</span><select name="degree"><option value="bachelor">بكالوريوس</option><option value="master">ماجستير</option><option value="doctorate">دكتوراه</option></select></label><label><span>التخصص المطلوب</span><select name="specialty">${specialties.map((item) => `<option>${item}</option>`).join("")}</select></label><button type="submit"><i class="fa-solid fa-magnifying-glass"></i> عرض موعد التسجيل</button><div class="admission-schedule-result" hidden></div></form>`);
    const form = utilityContent.querySelector("#admissionTrackerForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form));
        const schedule = schedules[values.degree];
        const result = form.querySelector(".admission-schedule-result");
        result.hidden = false;
        const publicFee = universityEntry.publicFees?.[values.degree] || "تختلف الرسوم حسب البرنامج، وتُعتمد من الجهة الرسمية قبل تقديم الطلب.";
        const fallbackLink = universityEntry.fallbackUrl ? `<a class="admission-fallback-link" href="${universityEntry.fallbackUrl}" target="_blank" rel="noopener noreferrer">رابط قبول بديل</a>` : "";
        result.innerHTML = `<small>${schedule.university} · ${schedule.label}</small><strong>${values.specialty}</strong><p><i class="fa-solid fa-calendar"></i> ${schedule.date}</p><section class="public-fee-summary"><i class="fa-solid fa-coins"></i><span><b>الرسوم بدون تسجيل دخول</b><small>${publicFee}</small></span></section><em>${schedule.status}</em><div><a href="${schedule.url}" target="_blank" rel="noopener noreferrer">فتح صفحة القبول الرسمية</a>${fallbackLink}<button type="button" data-admission-alert><i class="fa-solid fa-bell"></i> نبّهني عند فتح التسجيل</button></div><small class="official-date-note">المواعيد والمبالغ تتغير؛ يتم اعتماد الإعلان الموجود في موقع الجهة الرسمي قبل الدفع.</small>`;
        result.querySelector("[data-admission-alert]").addEventListener("click", (clickEvent) => {
            const alerts = JSON.parse(localStorage.getItem("admissionAlerts") || "[]");
            const alert = { degree: values.degree, specialty: values.specialty, university: schedule.university, url: schedule.url };
            if (!alerts.some((item) => item.degree === alert.degree && item.specialty === alert.specialty)) alerts.push(alert);
            localStorage.setItem("admissionAlerts", JSON.stringify(alerts));
            addNotification(`تم تفعيل تنبيه قبول ${schedule.label} في تخصص ${values.specialty}`);
            clickEvent.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> تم تفعيل التنبيه';
            clickEvent.currentTarget.disabled = true;
        });
    });
}

function openVenueMenu(entry) {
    const cafeMenu = [
        { name: "قهوة سعودية", description: "دلة قهوة سعودية", price: 18, image: "assets/entertainment/menu/saudi-coffee.png" },
        { name: "لاتيه", description: "ساخن أو بارد", price: 19, image: "assets/entertainment/menu/latte.png" },
        { name: "V60", description: "محصول اليوم", price: 22, image: "assets/entertainment/menu/v60-coffee.png" },
        { name: "كيكة التمر", description: "قطعة مع صوص التمر", price: 24, image: "assets/entertainment/food-date-cake.webp" }
    ];
    const restaurantMenu = entry.name.includes("سدف") || entry.name.includes("الشعبيات") || entry.name.includes("حراء")
        ? [
            { name: "عريكة", description: "عريكة بالعسل والسمن", price: 28, image: "assets/entertainment/productive-families-abha.jpg" },
            { name: "مندي دجاج", description: "أرز مندي مع نصف دجاجة", price: 32, image: "assets/entertainment/food-burger.jpeg" },
            { name: "مضغوط لحم", description: "أرز مضغوط مع اللحم", price: 48, image: "assets/entertainment/food-burger.jpeg" },
            { name: "خبز جنوبي", description: "خبز طازج", price: 8, image: "assets/entertainment/tuesday-market-crafts.jpg" }
        ]
        : [
            { name: "وجبة فطور", description: "تشكيلة فطور لشخص واحد", price: 42, image: "assets/entertainment/food-cafe.jpg" },
            { name: "برجر دجاج", description: "برجر مع البطاطس", price: 38, image: "assets/entertainment/food-burger.jpeg" },
            { name: "باستا", description: "باستا بصوص كريمي", price: 44, image: "assets/entertainment/food-burger.jpeg" },
            { name: "سلطة موسمية", description: "خضار طازجة", price: 25, image: "assets/entertainment/food-cafe.jpg" }
        ];
    const menu = entry.group === "cafes" ? cafeMenu : restaurantMenu;
    const cart = new Map();
    openUtility(`منيو ${entry.name}`, "fa-utensils", `
        <div class="venue-menu-page">
            <div class="venue-menu-heading"><span><small>${entry.group === "cafes" ? "منيو الكوفي" : "منيو المطعم"}</small><h3>${entry.name}</h3><p>اختر المنتجات وحدد الكمية، وسيُحسب الإجمالي تلقائيًا.</p></span><i class="fa-solid ${entry.group === "cafes" ? "fa-mug-hot" : "fa-utensils"}"></i></div>
            <div class="venue-menu-items">${menu.map((item, index) => `<article><img src="${item.image}" alt="${item.name}" loading="lazy"><span><strong>${item.name}</strong><small>${item.description}</small></span><b>${item.price} ر.س</b><label><span>الكمية</span><input type="number" min="1" max="20" value="1" data-menu-quantity="${index}"></label><button type="button" data-menu-add="${index}"><i class="fa-solid fa-cart-plus"></i> أضف</button></article>`).join("")}</div>
            <div id="venueMenuCart" class="venue-menu-cart" hidden></div>
        </div>`);
    const cartArea = utilityContent.querySelector("#venueMenuCart");
    const renderMenuCart = () => {
        const items = [...cart.values()];
        cartArea.hidden = !items.length;
        if (!items.length) return;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartArea.innerHTML = `<div><span><small>إجمالي الطلب</small><strong>${items.map((item) => `${item.name} × ${item.quantity}`).join("، ")}</strong></span><b>${total.toLocaleString("ar-SA")} ر.س</b></div><button type="button" data-menu-checkout><i class="fa-solid fa-credit-card"></i> إكمال الطلب والدفع</button>`;
    };
    utilityContent.querySelector(".venue-menu-items").addEventListener("click", (event) => {
        const addButton = event.target.closest("[data-menu-add]");
        if (!addButton) return;
        const index = Number(addButton.dataset.menuAdd);
        const item = menu[index];
        const quantity = Number(utilityContent.querySelector(`[data-menu-quantity="${index}"]`).value || 1);
        cart.set(item.name, { ...item, quantity });
        renderMenuCart();
        cartArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    cartArea.addEventListener("click", (event) => {
        if (!event.target.closest("[data-menu-checkout]")) return;
        const items = [...cart.values()];
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const summary = items.map((item) => `${item.name} × ${item.quantity}`).join("، ");
        openEntertainmentBooking(entry, "order", { name: summary, price: total, lockedCart: true });
    });
}

function openMovieSelection(entry) {
    const movies = [
        { name: "Toy Story 5", genre: "رسوم متحركة", duration: "عائلي · 2026", price: 45, image: "assets/entertainment/movie-toy-story-5.jpg" },
        { name: "Coyote vs. Acme", genre: "كوميدي", duration: "مغامرة · 2026", price: 45, image: "assets/entertainment/movie-coyote-acme.jpg" },
        { name: "Colony", genre: "أكشن", duration: "رعب وتشويق · 2026", price: 45, image: "assets/entertainment/movie-colony.webp" }
    ];
    openUtility("اختر نوع الفيلم", "fa-film", `
        <div class="movie-selection-page">
            <div class="movie-genre-filters">${["الكل", "عائلي", "أكشن", "رسوم متحركة", "كوميدي"].map((genre, index) => `<button type="button" data-movie-genre="${genre}" class="${index === 0 ? "active" : ""}">${genre}</button>`).join("")}</div>
            <div class="movie-options">${movies.map((movie, index) => `<article data-movie-card data-genre="${movie.genre}"><img src="${movie.image}" alt="ملصق ${movie.name}" loading="lazy"><span><small>${movie.genre}</small><strong>${movie.name}</strong><em>${movie.duration}</em></span><b>${movie.price} ر.س</b><button type="button" data-movie-select="${index}">اختيار الفيلم</button></article>`).join("")}</div><p class="cinema-source-note">العروض تتغير حسب اليوم والفرع؛ تأكد من الموعد النهائي في إمباير سينما الراشد مول قبل الدفع.</p>
        </div>`);
    utilityContent.querySelector(".movie-genre-filters").addEventListener("click", (event) => {
        const filter = event.target.closest("[data-movie-genre]");
        if (!filter) return;
        utilityContent.querySelectorAll("[data-movie-genre]").forEach((button) => button.classList.toggle("active", button === filter));
        utilityContent.querySelectorAll("[data-movie-card]").forEach((card) => { card.hidden = filter.dataset.movieGenre !== "الكل" && card.dataset.genre !== filter.dataset.movieGenre; });
    });
    utilityContent.querySelector(".movie-options").addEventListener("click", (event) => {
        const selectButton = event.target.closest("[data-movie-select]");
        if (!selectButton) return;
        const movie = movies[Number(selectButton.dataset.movieSelect)];
        openEntertainmentBooking({ ...entry, name: movie.name }, "movie", { name: movie.name, price: movie.price });
    });
}

function openProductiveFamilies(entry) {
    const families = [
        { name: "أم سعود", specialty: "مأكولات جنوبية منزلية", image: "assets/entertainment/productive-families-abha.jpg", products: [
            { name: "عريكة عسيرية", description: "عريكة طازجة بالعسل والسمن", price: 28 },
            { name: "خبز بر جنوبي", description: "خبز منزلي طازج", price: 12 }
        ] },
        { name: "أم محمد", specialty: "حلويات وأطباق شعبية", image: "assets/entertainment/tuesday-market-crafts.jpg", products: [
            { name: "عريكة بالقشطة", description: "عريكة بالقشطة والعسل", price: 32 },
            { name: "حنيني عسيري", description: "حنيني منزلي بالتمر", price: 24 }
        ] },
        { name: "أم عبدالله", specialty: "مخبوزات جنوبية", products: [
            { name: "خبز مسمن", description: "خبز مسمن منزلي طازج", price: 15 },
            { name: "ميفا جنوبي", description: "خبز ميفا بالطريقة التقليدية", price: 10 }
        ] },
        { name: "أم خالد", specialty: "وجبات وأطباق شعبية", products: [
            { name: "مرقوق جنوبي", description: "طبق مرقوق منزلي", price: 35 },
            { name: "عصيدة", description: "عصيدة بالسمن والعسل", price: 26 }
        ] },
        { name: "أم نورة", specialty: "حلويات منزلية", products: [
            { name: "حنيني بالتمر", description: "حنيني طازج بالتمر والسمن", price: 24 },
            { name: "كليجا منزلية", description: "علبة كليجا محشوة", price: 22 }
        ] }
    ];
    const cart = new Map();
    openUtility("أسر عسير المنتجة", "fa-house-chimney-heart", `
        <div class="productive-families-page">
            <section class="productive-family-portal">
                <div><span>بوابة خاصة بالأسر المنتجة</span><h3>هل أنتِ من الأسر المنتجة؟</h3><p>قدّمي طلب الانضمام أو ادخلي لمتابعة حالة طلبك. هذه البوابة مخصصة لمقدمي المنتجات فقط.</p></div>
                <div class="productive-family-portal-actions"><button type="button" data-family-portal="register"><i class="fa-solid fa-user-plus"></i> طلب التسجيل</button><button type="button" data-family-portal="login"><i class="fa-solid fa-right-to-bracket"></i> دخول الأسر المنتجة</button></div>
                <form id="productiveFamilyRegister" class="productive-family-portal-form" hidden>
                    <h4>طلب تسجيل أسرة منتجة</h4>
                    <div><label><span>اسم الأسرة أو المشروع</span><input name="familyName" required></label><label><span>اسم صاحبة المشروع</span><input name="ownerName" required></label></div>
                    <div><label><span>البريد الإلكتروني</span><input name="email" type="email" required></label><label><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" pattern="05[0-9]{8}" placeholder="05XXXXXXXX" required></label></div>
                    <label><span>نوع المنتجات</span><textarea name="products" rows="3" placeholder="مثال: عريكة، خبز بر، حلويات منزلية" required></textarea></label>
                    <button type="submit"><i class="fa-solid fa-paper-plane"></i> إرسال طلب التسجيل</button><p role="status" hidden></p>
                </form>
                <form id="productiveFamilyLogin" class="productive-family-portal-form compact" hidden>
                    <h4>دخول الأسر المنتجة</h4>
                    <label><span>البريد الإلكتروني المسجل</span><input name="email" type="email" required></label>
                    <label><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" required></label>
                    <button type="submit"><i class="fa-solid fa-right-to-bracket"></i> دخول</button><p role="status" hidden></p>
                </form>
            </section>
            <div class="productive-families-intro"><span>منتجات منزلية محلية</span><h3>اختر الأسرة ثم اطلب المنتج</h3><p>تُجهّز الطلبات منزليًا ويظهر السعر قبل الانتقال للدفع.</p></div>
            <div class="productive-vendors">${families.map((family, familyIndex) => `<button type="button" data-family-index="${familyIndex}"><span class="family-letter">${family.name.replace("أم ", "")}</span><span><strong>${family.name}</strong><small>${family.specialty}</small><em>عرض المنتجات <i class="fa-solid fa-arrow-left"></i></em></span></button>`).join("")}</div>
            <div id="productiveProducts" class="productive-products" hidden></div>
            <div id="productiveCart" class="productive-cart" hidden></div>
        </div>`);
    const productsArea = utilityContent.querySelector("#productiveProducts");
    const cartArea = utilityContent.querySelector("#productiveCart");
    const registerForm = utilityContent.querySelector("#productiveFamilyRegister");
    const familyLoginForm = utilityContent.querySelector("#productiveFamilyLogin");
    utilityContent.querySelector(".productive-family-portal-actions").addEventListener("click", (event) => {
        const button = event.target.closest("[data-family-portal]");
        if (!button) return;
        const isRegister = button.dataset.familyPortal === "register";
        registerForm.hidden = !isRegister;
        familyLoginForm.hidden = isRegister;
        (isRegister ? registerForm : familyLoginForm).scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = registerForm.querySelector('[role="status"]');
        const submitButton = registerForm.querySelector('[type="submit"]');
        const values = Object.fromEntries(new FormData(registerForm));
        status.hidden = true;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب';
        try {
            const response = await fetch("https://formsubmit.co/ajax/razanalqobti@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ _subject: `طلب تسجيل أسرة منتجة: ${values.familyName}`, "اسم الأسرة أو المشروع": values.familyName, "صاحبة المشروع": values.ownerName, "البريد الإلكتروني": values.email, "رقم الجوال": values.phone, "المنتجات": values.products })
            });
            if (!response.ok) throw new Error("Registration delivery failed");
            localStorage.setItem("productiveFamilyRegistration", JSON.stringify({ ...values, status: "pending", createdAt: new Date().toISOString() }));
            status.textContent = "تم إرسال طلبك إلى إدارة ضيوف عسير، وسنتواصل معك بعد المراجعة.";
            status.className = "success";
            status.hidden = false;
            registerForm.reset();
        } catch (error) {
            status.textContent = "تعذر إرسال الطلب الآن. تحققي من اتصال الإنترنت وحاولي مرة أخرى.";
            status.className = "error";
            status.hidden = false;
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال طلب التسجيل';
        }
    });
    familyLoginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = familyLoginForm.querySelector('[role="status"]');
        const values = Object.fromEntries(new FormData(familyLoginForm));
        const saved = JSON.parse(localStorage.getItem("productiveFamilyRegistration") || "null");
        const matches = saved && saved.email === values.email && saved.phone === values.phone;
        status.textContent = matches ? "تم العثور على طلبك، وحالته الآن: قيد المراجعة." : "لم نجد طلبًا مطابقًا على هذا الجهاز. قدّمي طلب تسجيل أولًا.";
        status.className = matches ? "success" : "error";
        status.hidden = false;
    });
    const renderCart = () => {
        const items = [...cart.values()];
        cartArea.hidden = items.length === 0;
        if (!items.length) return;
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartArea.innerHTML = `<div class="productive-cart-heading"><span><small>سلة الطلب</small><strong>${items.length} منتجات مختارة</strong></span><b>${total.toLocaleString("ar-SA")} ر.س</b></div><div class="productive-cart-items">${items.map((item) => `<div><span><strong>${item.name}</strong><small>${item.family}</small></span><label><button type="button" data-cart-minus="${item.key}">−</button><b>${item.quantity}</b><button type="button" data-cart-plus="${item.key}">+</button></label><em>${(item.price * item.quantity).toLocaleString("ar-SA")} ر.س</em><button type="button" data-cart-remove="${item.key}" aria-label="حذف"><i class="fa-solid fa-xmark"></i></button></div>`).join("")}</div><button class="productive-cart-checkout" type="button"><i class="fa-solid fa-bag-shopping"></i> إكمال الطلب والدفع</button>`;
    };
    utilityContent.querySelector(".productive-vendors").addEventListener("click", (event) => {
        const familyButton = event.target.closest("[data-family-index]");
        if (!familyButton) return;
        const family = families[Number(familyButton.dataset.familyIndex)];
        utilityContent.querySelectorAll("[data-family-index]").forEach((button) => button.classList.toggle("active", button === familyButton));
        productsArea.hidden = false;
        productsArea.innerHTML = `<div class="productive-products-heading"><span><small>منتجات</small><strong>${family.name}</strong></span><i class="fa-solid fa-bowl-food"></i></div>${family.products.map((product, productIndex) => `<article><span><strong>${product.name}</strong><small>${product.description}</small></span><b>${product.price} ر.س</b><label class="product-quantity"><span>الكمية</span><input type="number" min="1" max="20" value="1" data-product-quantity="${productIndex}"></label><button type="button" data-family-order="${productIndex}"><i class="fa-solid fa-cart-plus"></i> أضف للسلة</button></article>`).join("")}`;
        productsArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
        productsArea.onclick = (productEvent) => {
            const orderButton = productEvent.target.closest("[data-family-order]");
            if (!orderButton) return;
            const product = family.products[Number(orderButton.dataset.familyOrder)];
            const quantity = Number(productsArea.querySelector(`[data-product-quantity="${orderButton.dataset.familyOrder}"]`).value || 1);
            const key = `${family.name}-${product.name}`;
            cart.set(key, { ...product, key, family: family.name, quantity });
            renderCart();
            cartArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
        };
    });
    cartArea.addEventListener("click", (event) => {
        const plus = event.target.closest("[data-cart-plus]");
        const minus = event.target.closest("[data-cart-minus]");
        const remove = event.target.closest("[data-cart-remove]");
        const key = plus?.dataset.cartPlus || minus?.dataset.cartMinus || remove?.dataset.cartRemove;
        if (key && cart.has(key)) {
            const item = cart.get(key);
            if (plus) item.quantity = Math.min(20, item.quantity + 1);
            if (minus) item.quantity = Math.max(1, item.quantity - 1);
            if (remove) cart.delete(key);
            renderCart();
            return;
        }
        if (event.target.closest(".productive-cart-checkout")) {
            const items = [...cart.values()];
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const summary = items.map((item) => `${item.name} × ${item.quantity}`).join("، ");
            openEntertainmentBooking({ ...entry, name: "طلب الأسر المنتجة", image: "assets/brand/duof-asir-logo-v2.png" }, "order", { name: summary, price: total, lockedCart: true });
        }
    });
}

function openEntertainmentBooking(entry, action, selectedProduct = null) {
    const actionNames = { table: "حجز طاولة", order: "طلب من المكان", activity: "حجز النشاط", movie: "حجز تذكرة" };
    const today = new Date().toISOString().slice(0, 10);
    const isOrder = action === "order";
    const isFreeTable = action === "table";
    const baseAmount = isFreeTable ? 0 : (selectedProduct?.price || entry.orderPrice || ({ order: 25, activity: 75, movie: 45 }[action] || 25));
    openUtility(actionNames[action] || "إكمال الطلب", isOrder ? "fa-bag-shopping" : "fa-ticket", `
        <form id="entertainmentBookingForm" class="entertainment-booking-form">
            <div class="entertainment-order-place"><img src="${entry.image}" alt="${entry.name}"><span><small>${actionNames[action]}</small><strong>${entry.name}</strong><em>${entry.location}</em></span></div>
            ${isOrder ? `<label><span>تفاصيل الطلب</span><textarea name="orderDetails" rows="3" placeholder="مثال: قهوة لاتيه وقطعة حلى" required ${selectedProduct?.lockedCart ? "readonly" : ""}>${selectedProduct ? selectedProduct.name : ""}</textarea></label><div class="entertainment-booking-grid">${selectedProduct?.lockedCart ? "" : `<label><span>الكمية</span><input name="quantity" id="orderQuantity" type="number" min="1" max="20" value="1" required></label>`}<label><span>طريقة الاستلام</span><select name="delivery" id="orderDelivery"><option value="pickup">استلام من المكان</option><option value="delivery">توصيل إلى موقعي (+10 ر.س)</option></select></label></div>` : `<div class="entertainment-booking-grid"><label><span>التاريخ</span><input name="date" type="date" min="${today}" value="${today}" required></label><label><span>الوقت</span><input name="time" type="time" value="18:00" required></label></div><label><span>عدد الأشخاص</span><input name="guests" id="bookingGuestsCount" type="number" min="1" max="20" value="2" required></label><label><span>ملاحظاتك</span><textarea name="notes" rows="3" placeholder="مثال: طاولة داخلية أو كرسي أطفال"></textarea></label>`}
            <input name="amount" id="calculatedOrderAmount" type="hidden" value="${baseAmount}">
            ${isFreeTable ? `<div class="free-table-booking-note"><i class="fa-solid fa-circle-check"></i><span><strong>حجز الطاولة مجاني</strong><small>لن يُطلب منك دفع أي رسوم عند إرسال الحجز.</small></span></div>` : `<div class="entertainment-booking-grid"><div class="calculated-order-total"><span>الإجمالي المحسوب</span><strong id="calculatedOrderTotal">${baseAmount.toLocaleString("ar-SA")} ر.س</strong><small>${selectedProduct ? `سعر ${selectedProduct.name}` : "يُحسب تلقائيًا حسب نوع الطلب"}</small></div><label><span>البريد الإلكتروني</span><input name="email" type="email" autocomplete="email" placeholder="name@example.com" required></label></div>`}
            <label><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" pattern="05[0-9]{8}" placeholder="05XXXXXXXX" required></label>
            ${isFreeTable ? `<input type="hidden" name="payment" value="free">` : `<fieldset class="payment-methods"><legend>طريقة الدفع</legend>
                <label><input type="radio" name="payment" value="onsite" checked><span class="payment-logo cash-logo"><i class="fa-solid fa-money-bill-wave"></i></span><b>عند الاستلام</b><small>ادفع عند استلام الطلب</small></label>
                <label><input type="radio" name="payment" value="tabby"><span class="payment-logo tabby-logo">tabby</span><b>تابي</b><small>قسّمها على دفعات</small></label>
                <label><input type="radio" name="payment" value="tamara"><span class="payment-logo tamara-logo">تمارا</span><b>تمارا</b><small>اشتر الآن وادفع لاحقًا</small></label>
                <label><input type="radio" name="payment" value="applepay"><span class="payment-logo applepay-logo"><i class="fa-brands fa-apple"></i> Pay</span><b>Apple Pay</b><small>دفع سريع وآمن</small></label>
            </fieldset>
            <div class="safe-payment-note"><i class="fa-solid fa-shield-halved"></i><span>بيانات الدفع تُعالج لدى مزود الدفع ولا تُحفظ داخل ضيوف عسير. يتطلب الدفع الإلكتروني حساب تاجر مفعّل.</span></div>`}
            <p class="payment-form-message" role="status" hidden></p>
            <button type="submit"><i class="fa-solid fa-circle-check"></i> تأكيد ${actionNames[action]}</button>
        </form>`);
    const form = utilityContent.querySelector("#entertainmentBookingForm");
    const deliverySelect = form.querySelector("#orderDelivery");
    const orderQuantity = form.querySelector("#orderQuantity");
    const guestsCount = form.querySelector("#bookingGuestsCount");
    const updateCalculatedTotal = () => {
        const units = isOrder && !selectedProduct?.lockedCart ? Number(orderQuantity?.value || 1) : ["activity", "movie"].includes(action) ? Number(guestsCount?.value || 1) : 1;
        const total = (baseAmount * units) + (deliverySelect?.value === "delivery" ? 10 : 0);
        form.querySelector("#calculatedOrderAmount").value = total;
        const totalDisplay = form.querySelector("#calculatedOrderTotal");
        if (totalDisplay) totalDisplay.textContent = `${total.toLocaleString("ar-SA")} ر.س`;
    };
    deliverySelect?.addEventListener("change", updateCalculatedTotal);
    orderQuantity?.addEventListener("input", updateCalculatedTotal);
    guestsCount?.addEventListener("input", updateCalculatedTotal);
    updateCalculatedTotal();
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form));
        if (["activity", "movie"].includes(action)) {
            utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-clock"></i><h4>الحجز داخل ضيوف عسير</h4><strong>${escapeHtml(entry.name)}</strong><p>${escapeHtml(actionNames[action])}</p><b>قريبًا</b><small>ستكون هذه الميزة متاحة بعد الربط مع الجهات المنظمة للفعاليات.</small></div>`;
            return;
        }
        const request = { id: `ENT-${Date.now().toString().slice(-6)}`, place: entry.name, action, ...values, createdAt: new Date().toISOString() };
        const requests = JSON.parse(localStorage.getItem("entertainmentBookings") || "[]");
        requests.push(request);
        localStorage.setItem("entertainmentBookings", JSON.stringify(requests));
        addNotification(`تم إنشاء رقم طلب داخلي لـ ${actionNames[action]} لدى ${entry.name}`);
        if (isFreeTable) {
            const officialUrl = entry.bookingUrl || entry.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(entry.name + " أبها");
            utilityContent.innerHTML = `<div class="venue-booking-confirmation"><header><i class="fa-solid fa-calendar-check"></i><span><small>طلب حجز داخلي</small><h4>بانتظار إكمال الحجز من الموقع الرسمي</h4></span></header><span class="transport-order-number"><small>رقم الطلب الداخلي</small><strong dir="ltr">${request.id}</strong></span><dl><div><dt>المطعم أو الكوفي</dt><dd>${escapeHtml(entry.name)}</dd></div><div><dt>المدينة</dt><dd>أبها</dd></div><div><dt>التاريخ</dt><dd dir="ltr">${escapeHtml(values.date)}</dd></div><div><dt>الوقت</dt><dd dir="ltr">${escapeHtml(values.time)}</dd></div><div><dt>عدد الأشخاص</dt><dd>${escapeHtml(values.guests)}</dd></div><div><dt>نوع الحجز</dt><dd>حجز طاولة مجاني</dd></div><div class="wide"><dt>ملاحظات المستخدم</dt><dd>${escapeHtml(values.notes || "لا توجد ملاحظات")}</dd></div></dl><div class="booking-platform-warning"><i class="fa-solid fa-triangle-exclamation"></i><span>رقم الطلب خاص بمنصة ضيوف عسير، ولا يعني أن الحجز تم تأكيده من المطعم أو الكوفي.</span></div><div class="venue-confirmation-actions"><a href="${officialUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> زيارة الموقع الرسمي وإكمال الحجز</a><button type="button" data-future-venue-booking><i class="fa-solid fa-calendar-plus"></i> الحجز داخل ضيوف عسير <small>قريبًا</small></button></div></div>`;
            utilityContent.querySelector("[data-future-venue-booking]").addEventListener("click", () => {
                utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-clock"></i><h4>الحجز داخل ضيوف عسير</h4><strong>${escapeHtml(entry.name)}</strong><p>ستتمكن مستقبلًا من إرسال بيانات الطاولة ومتابعة حالة التأكيد من داخل المنصة.</p><b>قريبًا</b><small>ستكون هذه الميزة متاحة بعد الربط الرسمي مع المطاعم والكوفيهات وأنظمة الحجز المعتمدة.</small></div>`;
            });
            return;
        }
        utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-circle-check"></i><h4>تم إنشاء طلبك</h4><strong>${entry.name}</strong><p>${actionNames[action]}</p><b>رقم الطلب: ${request.id}</b><button class="in-app-payment-soon entertainment-future-payment" type="button"><i class="fa-solid fa-lock"></i><span><strong>الدفع داخل التطبيق</strong><small>قريبًا</small></span></button><small>يمكنك استعراض تجربة الدفع المستقبلية دون تنفيذ أي عملية مالية.</small></div>`;
        utilityContent.querySelector(".entertainment-future-payment")?.addEventListener("click", () => {
            openFuturePaymentPreview({ id: request.id, company: entry.name, service: actionNames[action], summary: values.orderDetails || `${actionNames[action]} لدى ${entry.name}`, city: entry.location, total: Number(values.amount || 0), createdAt: request.createdAt });
        });
    });
}

function openCompanyApplication(entry) {
    const account = JSON.parse(localStorage.getItem("wakala-account") || "null");
    const savedEmail = localStorage.getItem("wakala-user") || account?.email || "";
    openUtility("التقديم على الشركة", "fa-briefcase", `
        <form id="companyApplicationForm" class="company-application-form">
            <div class="company-application-heading"><img src="${entry.image}" alt="${entry.name}"><span><small>طلب توظيف جديد</small><strong>${entry.name}</strong><em>${entry.location}</em></span></div>
            <label><span>الاسم الكامل</span><input name="name" value="${escapeHtml(account?.name || "")}" autocomplete="name" required></label>
            <div class="company-application-grid"><label><span>البريد الإلكتروني</span><input name="email" type="email" value="${escapeHtml(savedEmail)}" autocomplete="email" required></label><label><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" pattern="05[0-9]{8}" placeholder="05XXXXXXXX" required></label></div>
            <label class="cv-upload-field"><span>السيرة الذاتية PDF</span><input name="cv" type="file" accept="application/pdf,.pdf" required><small>ملف PDF بحد أقصى 5 ميجابايت</small></label>
            <button type="submit"><i class="fa-solid fa-paper-plane"></i> إرسال طلب التقديم</button>
        </form>`);
    const form = utilityContent.querySelector("#companyApplicationForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const formData = new FormData(form);
        const cvFile = formData.get("cv");
        if (cvFile?.size > 5 * 1024 * 1024) {
            form.querySelector(".cv-upload-field small").textContent = "حجم الملف أكبر من 5 ميجابايت.";
            return;
        }
        utilityContent.innerHTML = `<div class="transport-booking-confirmation"><i class="fa-solid fa-clock"></i><h4>التقديم داخل ضيوف عسير</h4><strong>${escapeHtml(entry.name)}</strong><p>تمت معاينة بيانات الطلب فقط، ولم يتم إرسالها إلى الشركة.</p><b>قريبًا</b><small>سيتم تفعيل التقديم المباشر داخل منصة ضيوف عسير بعد الربط الرسمي مع الشركات وأنظمة التوظيف.</small></div>`;
    });
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("تعذر قراءة ملف السيرة الذاتية."));
        reader.readAsDataURL(file);
    });
}

function showTransportEstimate() {
    document.querySelector(".transport-result")?.remove();
    const option = agents.transport.items[Number(transportState.option)];
    const cost = Math.round((option.baseRate + transportState.distance * option.kilometerRate) * 100) / 100;
    const minutes = Math.max(1, Math.round((transportState.distance / option.speed) * 60 + option.wait));
    const result = document.createElement("div");
    result.className = "transport-result";
    result.innerHTML = `<div><i class="fa-solid fa-route"></i><span><small>الوسيلة المقترحة</small><strong>${option.name}</strong></span></div><div><i class="fa-solid fa-coins"></i><span><small>التكلفة التقديرية</small><strong>${cost.toLocaleString("ar-SA")} ر.س</strong></span></div><div><i class="fa-solid fa-clock"></i><span><small>وقت الوصول التقريبي</small><strong>${minutes} دقيقة</strong></span></div><button type="button"><i class="fa-solid fa-bookmark"></i> حفظ الرحلة</button>`;
    result.querySelector("button").addEventListener("click", () => {
        const trip = { from: transportState.from, to: transportState.to, distance: transportState.distance, option: option.name, cost, minutes };
        const duplicate = transportState.savedTrips.some((item) => item.from === trip.from && item.to === trip.to && item.option === trip.option);
        if (!duplicate) transportState.savedTrips.push(trip);
        localStorage.setItem("savedTransportTrips", JSON.stringify(transportState.savedTrips));
        result.querySelector("button").innerHTML = `<i class="fa-solid fa-check"></i> تم حفظ الرحلة`;
    });
    recommendationsList.before(result);
}

function showSavedTransportTrips() {
    document.querySelector(".transport-result")?.remove();
    const result = document.createElement("div");
    result.className = "transport-result saved-trips";
    result.innerHTML = transportState.savedTrips.length
        ? `<strong>الرحلات المحفوظة</strong>${transportState.savedTrips.map((trip, index) => `<div><span><b>${trip.from}</b> ← <b>${trip.to}</b><small>${trip.option} · ${trip.cost} ر.س · ${trip.minutes} دقيقة</small></span><button type="button" data-trip="${index}" aria-label="حذف الرحلة"><i class="fa-solid fa-trash"></i></button></div>`).join("")}`
        : `<p>لا توجد رحلات محفوظة حتى الآن.</p>`;
    result.addEventListener("click", (event) => {
        const deleteButton = event.target.closest("[data-trip]");
        if (!deleteButton) return;
        transportState.savedTrips.splice(Number(deleteButton.dataset.trip), 1);
        localStorage.setItem("savedTransportTrips", JSON.stringify(transportState.savedTrips));
        showSavedTransportTrips();
    });
    recommendationsList.before(result);
}

function showHrTool(action) {
    const currentToolbox = document.querySelector(".hr-toolbox");
    if (currentToolbox?.dataset.action === String(action)) {
        currentToolbox.remove();
        document.querySelector('.agent-features button.selected')?.classList.remove("selected");
        return;
    }
    currentToolbox?.remove();
    const toolbox = document.createElement("section");
    toolbox.className = "hr-toolbox";
    toolbox.dataset.action = String(action);

    if (action === 0) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-file-pen"></i> إنشاء سيرة ذاتية حقيقية</h4><form class="cv-builder-form"><label class="cv-language-field"><span>لغة السيرة الذاتية</span><select name="language"><option value="ar">العربية</option><option value="en">English</option></select><small>للنسخة الإنجليزية اكتبي بياناتك بالإنجليزية.</small></label><div><label><span>الاسم الكامل / Full name</span><input name="name" required></label><label><span>المسمى المهني / Job title</span><input name="title" placeholder="مثال: مطورة برمجيات / Software Developer" required></label></div><div><label><span>البريد الإلكتروني / Email</span><input name="email" type="email" required></label><label><span>رقم الجوال / Phone</span><input name="phone" type="tel" pattern="05[0-9]{8}" required></label></div><label><span>الملخص المهني / Professional summary</span><textarea name="summary" rows="3" required></textarea></label><label><span>التعليم / Education</span><textarea name="education" rows="3" required></textarea></label><label><span>الخبرات / Experience</span><textarea name="experience" rows="4"></textarea></label><label><span>المهارات / Skills</span><textarea name="skills" rows="3" required></textarea></label><button type="submit" class="hr-primary-action"><i class="fa-solid fa-file-lines"></i> إنشاء السيرة / Create CV</button></form><div class="hr-tool-result cv-result"></div>`;
        toolbox.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
            if (!event.currentTarget.reportValidity()) return;
            const values = Object.fromEntries(new FormData(event.currentTarget));
            const lines = (text) => escapeHtml(text).split(/\r?\n/).filter(Boolean).map((line) => `<li>${line}</li>`).join("");
            const english = values.language === "en";
            const labels = english ? { summary: "Professional Summary", education: "Education", experience: "Experience", skills: "Skills", print: "Print or save as PDF" } : { summary: "الملخص المهني", education: "التعليم", experience: "الخبرات", skills: "المهارات", print: "طباعة أو حفظ PDF" };
            toolbox.querySelector(".cv-result").innerHTML = `<article class="cv-paper" id="generatedCv" lang="${english ? "en" : "ar"}" dir="${english ? "ltr" : "rtl"}"><header><h2>${escapeHtml(values.name)}</h2><strong>${escapeHtml(values.title)}</strong><p><span>${escapeHtml(values.email)}</span><span dir="ltr">${escapeHtml(values.phone)}</span></p></header><section><h3>${labels.summary}</h3><p>${escapeHtml(values.summary)}</p></section><section><h3>${labels.education}</h3><ul>${lines(values.education)}</ul></section>${values.experience ? `<section><h3>${labels.experience}</h3><ul>${lines(values.experience)}</ul></section>` : ""}<section><h3>${labels.skills}</h3><ul>${escapeHtml(values.skills).split(/[،,\n]/).filter(Boolean).map((skill) => `<li>${skill.trim()}</li>`).join("")}</ul></section></article><button type="button" class="print-cv-button"><i class="fa-solid fa-print"></i> ${labels.print}</button>`;
            toolbox.querySelector(".print-cv-button").addEventListener("click", () => window.print());
            toolbox.querySelector(".cv-result").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    if (action === 2) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-chart-pie"></i> تحليل توافق السيرة مع الوظيفة</h4><div class="hr-match-fields"><textarea rows="4" placeholder="الصق نص السيرة الذاتية" required></textarea><textarea rows="4" placeholder="الصق وصف الوظيفة المطلوبة" required></textarea></div><button type="button" class="hr-primary-action">احسب نسبة التوافق</button><div class="hr-tool-result"></div>`;
        toolbox.querySelector("button").addEventListener("click", () => {
            const [resumeField, jobField] = toolbox.querySelectorAll("textarea");
            const resumeTerms = new Set(resumeField.value.trim().toLowerCase().split(/\s+/).filter((term) => term.length > 2));
            const jobTerms = [...new Set(jobField.value.trim().toLowerCase().split(/\s+/).filter((term) => term.length > 2))];
            if (!resumeTerms.size || !jobTerms.length) {
                toolbox.querySelector(".hr-tool-result").textContent = "أدخل السيرة الذاتية ووصف الوظيفة أولًا.";
                return;
            }
            const matchedTerms = jobTerms.filter((term) => resumeTerms.has(term));
            const score = Math.min(100, Math.round((matchedTerms.length / jobTerms.length) * 100));
            const missingTerms = jobTerms.filter((term) => !resumeTerms.has(term)).slice(0, 8);
            toolbox.querySelector(".hr-tool-result").innerHTML = `<strong class="match-score">${score}% توافق</strong><p>${score >= 60 ? "توافق جيد. حسّن السيرة بإضافة المهارات الناقصة عند امتلاكها." : "التوافق يحتاج إلى تحسين قبل التقديم."}</p>${missingTerms.length ? `<small>كلمات مهمة غير موجودة: ${missingTerms.map(escapeHtml).join("، ")}</small>` : ""}`;
        });
    }

    if (action === 3) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-comments"></i> التحضير للمقابلة</h4><div class="hr-interview-form"><input placeholder="المسمى الوظيفي" required><select><option>مقابلة عامة</option><option>مقابلة تقنية</option><option>مقابلة إدارية</option></select><button type="button">جهّز الأسئلة</button></div><div class="hr-tool-result"></div>`;
        toolbox.querySelector("button").addEventListener("click", () => {
            const role = toolbox.querySelector("input").value.trim();
            if (!role) return toolbox.querySelector("input").focus();
            const questions = [`عرّفنا بنفسك ولماذا تهتم بوظيفة ${role}؟`, "ما أبرز إنجاز مهني حققته؟", "صف تحديًا واجهته وكيف تعاملت معه.", `ما المهارات التي تجعلك مناسبًا لوظيفة ${role}؟`, "ما توقعاتك وأهدافك خلال السنوات القادمة؟"];
            toolbox.querySelector(".hr-tool-result").innerHTML = `<strong>أسئلة مقترحة للمقابلة</strong><ol>${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol><small>نصيحة: أجب بأمثلة حقيقية واستخدم أسلوب الموقف والمهمة والإجراء والنتيجة.</small>`;
        });
    }

    if (action === 4) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-list-check"></i> متابعة طلبات التوظيف</h4><form class="hr-application-form"><input name="company" placeholder="اسم الشركة" required><input name="role" placeholder="المسمى الوظيفي" required><select name="status"><option>تم التقديم</option><option>مقابلة</option><option>عرض وظيفي</option><option>مرفوض</option></select><button type="submit">إضافة</button></form><div class="hr-applications"></div>`;
        toolbox.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            hrState.applications.push({ company: formData.get("company"), role: formData.get("role"), status: formData.get("status"), date: new Date().toLocaleDateString("ar-SA") });
            localStorage.setItem("jobApplications", JSON.stringify(hrState.applications));
            event.currentTarget.reset();
            renderHrApplications(toolbox.querySelector(".hr-applications"));
        });
        renderHrApplications(toolbox.querySelector(".hr-applications"));
    }

    recommendationsList.before(toolbox);
}

function renderHrApplications(container) {
    container.innerHTML = hrState.applications.length
        ? hrState.applications.map((application, index) => `<article><span><strong>${escapeHtml(application.role)}</strong><small>${escapeHtml(application.company)} · ${escapeHtml(application.date)}</small></span><select data-status="${index}">${["تم التقديم", "مقابلة", "عرض وظيفي", "مرفوض"].map((status) => `<option ${status === application.status ? "selected" : ""}>${status}</option>`).join("")}</select><button type="button" data-delete-application="${index}" aria-label="حذف الطلب"><i class="fa-solid fa-trash"></i></button></article>`).join("")
        : `<p>لم تضف أي طلب توظيف حتى الآن.</p>`;
    container.onchange = (event) => {
        const statusSelect = event.target.closest("[data-status]");
        if (!statusSelect) return;
        hrState.applications[Number(statusSelect.dataset.status)].status = statusSelect.value;
        localStorage.setItem("jobApplications", JSON.stringify(hrState.applications));
    };
    container.onclick = (event) => {
        const deleteButton = event.target.closest("[data-delete-application]");
        if (!deleteButton) return;
        hrState.applications.splice(Number(deleteButton.dataset.deleteApplication), 1);
        localStorage.setItem("jobApplications", JSON.stringify(hrState.applications));
        renderHrApplications(container);
    };
}

function showEducationTool(action) {
    document.querySelector(".agent-toolbox")?.remove();
    const toolbox = document.createElement("section");
    toolbox.className = "agent-toolbox";

    if (action === 0) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-school"></i> البحث عن الجامعات والمدارس</h4><p>استخدم التصنيفات الموجودة بالأعلى للتبديل بين الجامعات والمدارس الحكومية والمدارس الأهلية.</p>`;
        window.setTimeout(() => document.querySelector(".education-filters button")?.focus(), 0);
    }

    if (action === 1) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-compass"></i> اقتراح التخصص المناسب</h4><div class="tool-form-grid"><select id="studyInterest"><option value="technology">التقنية والحاسب</option><option value="health">الصحة والعلوم</option><option value="business">الإدارة والأعمال</option><option value="creative">الفنون والإبداع</option><option value="social">التواصل وخدمة المجتمع</option></select><select id="studyStrength"><option value="analysis">التحليل وحل المشكلات</option><option value="communication">التواصل والعمل الجماعي</option><option value="design">التصميم والابتكار</option><option value="organization">التنظيم والقيادة</option></select><button type="button">اقترح التخصص</button></div><div class="agent-tool-result"></div>`;
        toolbox.querySelector("button").addEventListener("click", () => {
            const interest = toolbox.querySelector("#studyInterest").value;
            const strength = toolbox.querySelector("#studyStrength").value;
            const suggestions = {
                technology: ["علوم الحاسب", "الأمن السيبراني", "نظم المعلومات"],
                health: ["الطب والعلوم الطبية", "التمريض", "الصحة العامة"],
                business: ["إدارة الأعمال", "المحاسبة", "التسويق"],
                creative: ["التصميم", "الإعلام الرقمي", "العمارة"],
                social: ["علم النفس", "الخدمة الاجتماعية", "اللغة والترجمة"]
            };
            const strengthAdvice = { analysis: "تناسبك المسارات التي تعتمد على التحليل.", communication: "تتميز في المسارات التي تتطلب تواصلًا وتعاونًا.", design: "لديك ميول مناسبة للتخصصات الإبداعية.", organization: "قد تنجح في التخصصات الإدارية والقيادية." };
            toolbox.querySelector(".agent-tool-result").innerHTML = `<strong>التخصصات المقترحة</strong><div class="suggestion-tags">${suggestions[interest].map((item) => `<span>${item}</span>`).join("")}</div><p>${strengthAdvice[strength]}</p>`;
        });
    }

    if (action === 2) {
        const courses = [
            ["معسكر لينكس", "تقنية وأنظمة تشغيل · 450 ر.س"],
            ["أساسيات البرمجة", "تقنية · مبتدئ"], ["اللغة الإنجليزية", "لغات · جميع المستويات"],
            ["تحليل البيانات", "تقنية · متوسط"], ["إدارة المشاريع", "إدارة · متوسط"],
            ["التسويق الرقمي", "أعمال · مبتدئ"], ["مهارات المقابلة", "تطوير مهني · مبتدئ"]
        ];
        toolbox.innerHTML = `<h4><i class="fa-solid fa-laptop-file"></i> البحث عن الدورات</h4><form class="tool-search"><input type="search" placeholder="ابحث باسم الدورة أو المجال" required><button type="submit">بحث</button></form><div class="course-results"></div>`;
        const renderCourses = (query = "") => {
            const results = courses.filter((course) => course.join(" ").includes(query));
            toolbox.querySelector(".course-results").innerHTML = results.length ? results.map(([name, detail]) => `<article><i class="fa-solid fa-circle-play"></i><span><strong>${name}</strong><small>${detail}</small></span></article>`).join("") : `<p>لا توجد دورات مطابقة.</p>`;
        };
        toolbox.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); renderCourses(event.currentTarget.querySelector("input").value.trim()); });
        renderCourses();
    }

    if (action === 3) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-calendar-days"></i> إنشاء خطة تعلم</h4><div class="tool-form-grid"><input id="learningGoal" placeholder="ما المهارة التي تريد تعلمها؟" required><input id="learningWeeks" type="number" min="2" max="12" value="4" aria-label="عدد الأسابيع"><button type="button">أنشئ الخطة</button></div><div class="agent-tool-result"></div>`;
        toolbox.querySelector("button").addEventListener("click", () => {
            const goal = toolbox.querySelector("#learningGoal").value.trim();
            const weeks = Number(toolbox.querySelector("#learningWeeks").value);
            if (!goal) return toolbox.querySelector("#learningGoal").focus();
            const safeGoal = escapeHtml(goal);
            toolbox.querySelector(".agent-tool-result").innerHTML = `<strong>خطة تعلم ${safeGoal}</strong><ol>${Array.from({ length: weeks }, (_, index) => `<li><b>الأسبوع ${index + 1}:</b> ${index === 0 ? "تعلّم الأساسيات وحدد المصادر." : index === weeks - 1 ? "نفّذ مشروعًا تطبيقيًا وقيّم مستواك." : "تعلّم مفهومًا جديدًا وطبّقه بتمرين عملي."}</li>`).join("")}</ol>`;
        });
    }

    if (action === 4) {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-chart-line"></i> تتبع التقدم</h4><form class="tool-search"><input name="task" placeholder="أضف مهمة تعليمية" required><button type="submit">إضافة</button></form><div class="progress-list"></div>`;
        toolbox.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
            const task = new FormData(event.currentTarget).get("task").trim();
            educationState.progress.push({ task, done: false });
            localStorage.setItem("educationProgress", JSON.stringify(educationState.progress));
            event.currentTarget.reset();
            renderEducationProgress(toolbox.querySelector(".progress-list"));
        });
        renderEducationProgress(toolbox.querySelector(".progress-list"));
    }

    recommendationsList.before(toolbox);
}

function renderEducationProgress(container) {
    const completed = educationState.progress.filter((item) => item.done).length;
    const percentage = educationState.progress.length ? Math.round(completed / educationState.progress.length * 100) : 0;
    container.innerHTML = `<div class="progress-meter"><span style="width:${percentage}%"></span></div><small>نسبة الإنجاز: ${percentage}%</small>${educationState.progress.length ? educationState.progress.map((item, index) => `<label class="${item.done ? "done" : ""}"><input type="checkbox" data-progress="${index}" ${item.done ? "checked" : ""}><span>${escapeHtml(item.task)}</span><button type="button" data-delete-progress="${index}"><i class="fa-solid fa-trash"></i></button></label>`).join("") : `<p>لم تضف أي مهام تعليمية بعد.</p>`}`;
    container.onchange = (event) => {
        const checkbox = event.target.closest("[data-progress]");
        if (!checkbox) return;
        educationState.progress[Number(checkbox.dataset.progress)].done = checkbox.checked;
        localStorage.setItem("educationProgress", JSON.stringify(educationState.progress));
        renderEducationProgress(container);
    };
    container.onclick = (event) => {
        const deleteButton = event.target.closest("[data-delete-progress]");
        if (!deleteButton) return;
        educationState.progress.splice(Number(deleteButton.dataset.deleteProgress), 1);
        localStorage.setItem("educationProgress", JSON.stringify(educationState.progress));
        renderEducationProgress(container);
    };
}

function showEntertainmentTool(action) {
    document.querySelector(".agent-toolbox")?.remove();
    const toolbox = document.createElement("section");
    toolbox.className = "agent-toolbox";
    const suggestions = {
        0: [["فعاليات شارع الفن", "المفتاحة"], ["جولة المدينة العالية", "أبها"], ["نزهة عائلية في حديقة السلام", "أبها"]],
        1: [["مقهى بإطلالة جبلية", "طريق السودة"], ["مطعم مأكولات جنوبية", "وسط أبها"], ["مقهى عائلي", "المدينة العالية"]],
        2: [["جبل السودة", "غرب أبها"], ["قرية المفتاحة", "وسط أبها"], ["بحيرة سد أبها", "غرب أبها"]],
        3: [["فيلم عائلي", "مناسب لجميع أفراد العائلة"], ["مسلسل اجتماعي", "دراما خفيفة"], ["فيلم مغامرات", "تشويق ورحلات"]]
    };
    const titles = ["فعاليات مقترحة", "مطاعم ومقاهٍ مقترحة", "أماكن سياحية مقترحة", "أفلام ومسلسلات مقترحة"];
    const icons = ["fa-calendar-days", "fa-utensils", "fa-camera-retro", "fa-film"];

    if (action < 4) {
        toolbox.innerHTML = `<h4><i class="fa-solid ${icons[action]}"></i> ${titles[action]}</h4><div class="entertainment-suggestions">${suggestions[action].map(([name, detail]) => `<article><span><strong>${name}</strong><small>${detail}</small></span><button type="button" data-save-name="${name}" data-save-detail="${detail}"><i class="fa-regular fa-bookmark"></i> حفظ</button></article>`).join("")}</div>`;
        toolbox.addEventListener("click", (event) => {
            const saveButton = event.target.closest("[data-save-name]");
            if (!saveButton) return;
            const item = { name: saveButton.dataset.saveName, detail: saveButton.dataset.saveDetail };
            if (!entertainmentState.savedPlaces.some((saved) => saved.name === item.name)) entertainmentState.savedPlaces.push(item);
            localStorage.setItem("savedEntertainmentPlaces", JSON.stringify(entertainmentState.savedPlaces));
            saveButton.innerHTML = `<i class="fa-solid fa-check"></i> محفوظ`;
        });
    } else {
        toolbox.innerHTML = `<h4><i class="fa-solid fa-bookmark"></i> الأماكن والاقتراحات المحفوظة</h4><div class="saved-entertainment"></div>`;
        renderSavedEntertainment(toolbox.querySelector(".saved-entertainment"));
    }
    recommendationsList.before(toolbox);
}

function renderSavedEntertainment(container) {
    container.innerHTML = entertainmentState.savedPlaces.length ? entertainmentState.savedPlaces.map((item, index) => `<article><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span><button type="button" data-delete-place="${index}"><i class="fa-solid fa-trash"></i></button></article>`).join("") : `<p>لا توجد أماكن محفوظة حتى الآن.</p>`;
    container.onclick = (event) => {
        const deleteButton = event.target.closest("[data-delete-place]");
        if (!deleteButton) return;
        entertainmentState.savedPlaces.splice(Number(deleteButton.dataset.deletePlace), 1);
        localStorage.setItem("savedEntertainmentPlaces", JSON.stringify(entertainmentState.savedPlaces));
        renderSavedEntertainment(container);
    };
}

function updateBookingTotal() {
    if (!selectedBooking || !bookingCheckIn.value || !bookingCheckOut.value) {
        bookingTotal.textContent = "اختر تاريخ الدخول والخروج لعرض الإجمالي";
        return;
    }
    const start = new Date(`${bookingCheckIn.value}T00:00:00`);
    const end = new Date(`${bookingCheckOut.value}T00:00:00`);
    const nights = Math.round((end - start) / 86400000);
    if (nights < 1) {
        bookingTotal.textContent = "يجب أن يكون تاريخ الخروج بعد تاريخ الدخول";
        return;
    }
    if (!selectedBooking.nightlyRate) {
        bookingTotal.textContent = `${nights} ليلة — سيظهر السعر النهائي والتوفر في صفحة الفندق`;
        return;
    }
    const total = nights * selectedBooking.nightlyRate;
    bookingTotal.textContent = `${nights} ليلة × ${selectedBooking.nightlyRate.toLocaleString("ar-SA")} ر.س = ${total.toLocaleString("ar-SA")} ر.س`;
}

function openBooking(entry) {
    selectedBooking = entry;
    bookingHotel.value = entry.name;
    bookingHotelName.textContent = `${entry.name} — اختر التواريخ ثم انتقل إلى الحجز الفعلي`;
    bookingForm.reset();
    bookingHotel.value = entry.name;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formatDate = (date) => date.toISOString().slice(0, 10);
    bookingCheckIn.min = formatDate(today);
    bookingCheckOut.min = formatDate(tomorrow);
    bookingCheckIn.value = formatDate(today);
    bookingCheckOut.value = formatDate(tomorrow);
    document.querySelector("#bookingStatus").textContent = "";
    updateBookingTotal();
    closeAgent();
    window.setTimeout(() => openSimpleModal(bookingModal), 120);
}

function closeAgent() {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
}

function appendMessage(text, className, save = true) {
    const item = document.createElement("div");
    item.className = className;
    const messageText = document.createElement("span");
    messageText.textContent = text;
    item.appendChild(messageText);
    if (className === "bot-message") {
        const rating = document.createElement("span");
        rating.className = "message-rating";
        rating.innerHTML = `<button type="button" data-message-rating="up" aria-label="رد مفيد"><i class="fa-regular fa-thumbs-up"></i></button><button type="button" data-message-rating="down" aria-label="رد غير مفيد"><i class="fa-regular fa-thumbs-down"></i></button>`;
        item.appendChild(rating);
    }
    messages.appendChild(item);
    if (save) {
        const role = className === "bot-message" ? "assistant" : "user";
        saveConversation(role === "assistant" ? "المساعد" : "المستخدم", text, activeAgent);
        saveAgentMemory(activeAgent, role, text);
    }
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) {
        userInput.focus();
        userInput.classList.add("input-error");
        window.setTimeout(() => userInput.classList.remove("input-error"), 500);
        return;
    }
    const previousUserMessage = getAgentMemory(activeAgent).filter((memory) => memory.role === "user").at(-1)?.text;
    appendMessage(text, "user-message");
    registerLoyaltyRequest();
    userInput.value = "";
    suggestedPrompts.hidden = true;
    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = `<span></span><span></span><span></span>`;
    messages.appendChild(typing);
    typing.scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.setTimeout(() => {
        typing.remove();
        const contextualReply = previousUserMessage ? `${agents[activeAgent].reply} وسأراعي أيضًا سياق طلبك السابق: «${previousUserMessage}».` : agents[activeAgent].reply;
        appendMessage(contextualReply, "bot-message");
    }, 700);
}

function openInfo(title, description, icon = "fa-circle-info") {
    document.querySelector(".agent-features")?.remove();
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalIcon.className = `fa-solid ${icon}`;
    welcomeMessage.textContent = description;
    messages.replaceChildren();
    listTitle.textContent = "معلومات";
    recommendationsList.replaceChildren();
    const note = document.createElement("div");
    note.className = "recommendation-item";
    note.innerHTML = `<i class="fa-solid ${icon}"></i><span><strong>${title}</strong><small>منصة ضيوف عسير</small></span>`;
    recommendationsList.appendChild(note);
    showModal();
}

function closeAbhaVideo() {
    abhaVideo.pause();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    abhaVideoPage.classList.remove("show");
    abhaVideoPage.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function openAbhaVideo() {
    abhaVideoPage.classList.add("show");
    abhaVideoPage.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    abhaVideo.currentTime = 0;
    abhaVideo.muted = false;
    abhaVideo.volume = 1;
    abhaVideo.play().catch(() => {});
    abhaVideo.requestFullscreen?.().catch(() => {});
}

window.openAgent = openAgent;
window.closeAgent = closeAgent;

const requestedAgent = new URLSearchParams(window.location.search).get("agent");
if (document.body.classList.contains("agents-only-page") && agents[requestedAgent]) {
    window.setTimeout(() => {
        const route = mainAgentRoutes.find((item) => item.type === requestedAgent);
        if (route) openAgent(route.title, route.type);
    }, 80);
}

agentChatToggle.addEventListener("click", () => {
    const willOpen = agentWorkspace.classList.contains("chat-collapsed");
    agentWorkspace.classList.toggle("chat-collapsed", !willOpen);
    agentChatToggle.setAttribute("aria-expanded", String(willOpen));
    agentChatToggle.innerHTML = willOpen
        ? '<i class="fa-solid fa-xmark"></i><span>إخفاء الوكيل</span>'
        : '<i class="fa-solid fa-robot"></i><span>افتح الوكيل الذكي</span>';
    if (willOpen) window.setTimeout(() => userInput.focus(), 180);
});
window.sendMessage = sendMessage;

themeButton.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark-mode");
    themeButton.querySelector("i").className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeButton.setAttribute("aria-label", dark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي");
    localStorage.setItem("wakala-theme", dark ? "dark" : "light");
});

if (localStorage.getItem("wakala-theme") === "dark") themeButton.click();

function openSimpleModal(target) {
    lastFocusedElement = document.activeElement;
    target.classList.add("show");
    document.body.classList.add("modal-open");
    window.setTimeout(() => target.querySelector("input, textarea, button")?.focus(), 100);
}

function closeSimpleModal(target) {
    target.classList.remove("show");
    if (!document.querySelector(".modal.show")) document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
}

function addNotification(text) {
    const notifications = JSON.parse(localStorage.getItem("appNotifications") || "[]");
    notifications.unshift({ text, date: new Date().toLocaleString("ar-SA"), read: false });
    localStorage.setItem("appNotifications", JSON.stringify(notifications.slice(0, 30)));
    updateNotificationCount();
    showLiveToast(text);
}

function showLiveToast(text) {
    document.querySelector(".live-notification-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "live-notification-toast";
    toast.innerHTML = `<i class="fa-solid fa-bell"></i><span><strong>تحديث جديد</strong><small>${escapeHtml(text)}</small></span><button type="button" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>`;
    document.body.appendChild(toast);
    toast.querySelector("button").addEventListener("click", () => toast.remove());
    window.setTimeout(() => toast.remove(), 6000);
}

function updateNotificationCount() {
    const notifications = JSON.parse(localStorage.getItem("appNotifications") || "[]");
    const unread = notifications.filter((item) => !item.read).length;
    notificationCount.textContent = unread;
    notificationCount.hidden = unread === 0;
}

function openUtility(title, icon, content) {
    utilityTitle.textContent = title;
    utilityIcon.className = `fa-solid ${icon}`;
    utilityContent.innerHTML = content;
    openSimpleModal(utilityModal);
}

function showProfile() {
    const account = JSON.parse(localStorage.getItem("wakala-account") || "null");
    const email = localStorage.getItem("wakala-user");
    const roleNames = { user: "مستخدم عادي", company: "شركة", university: "جامعة", admin: "مدير" };
    const favoriteCount = housingState.favorites.size + entertainmentState.savedPlaces.length;
    openUtility("الملف الشخصي", "fa-user-circle", `
        <div class="profile-summary">
            <div>${escapeHtml((account?.name || email || "م").charAt(0))}</div>
            <h3>${escapeHtml(account?.name || "مستخدم ضيوف عسير")}</h3>
            <p>${escapeHtml(email || account?.email || "")}</p>
            <b class="role-badge"><i class="fa-solid fa-key"></i> ${roleNames[account?.role] || roleNames.user}</b>
            <span><i class="fa-solid fa-shield-check"></i> حساب محلي محفوظ بأمان على هذا الجهاز</span>
        </div>
        <div class="simple-profile-actions">
            <button id="profileRewardsBtn" class="profile-rewards-button" type="button"><i class="fa-solid fa-ticket"></i><span><strong>المكافآت والكوبونات</strong><small>تابع تقدمك واستعرض كوبوناتك</small></span></button>
            <button id="profileFavoritesBtn" type="button"><i class="fa-solid fa-heart"></i><span><strong>المفضلة</strong><small>${favoriteCount} عناصر محفوظة</small></span></button>
        </div>`);
    utilityContent.querySelector("#profileRewardsBtn").addEventListener("click", showRewards);
    utilityContent.querySelector("#profileFavoritesBtn").addEventListener("click", showAllFavorites);
}

function showDashboard() {
    const history = JSON.parse(localStorage.getItem("conversationHistory") || "[]");
    const usage = mainAgentRoutes.map((route) => ({ ...route, count: history.filter((item) => item.agent === route.type || item.agent === route.title).length })).sort((a, b) => b.count - a.count);
    const account = JSON.parse(localStorage.getItem("wakala-account") || "null");
    const activeRole = account?.role || "user";
    const rolePermissions = {
        user: ["استخدام الوكلاء", "حفظ المفضلة", "متابعة الطلبات"],
        company: ["نشر الوظائف", "متابعة المتقدمين", "إدارة بيانات الشركة"],
        university: ["إدارة البرامج", "تحديث القبول", "نشر الإعلانات التعليمية"],
        admin: ["إدارة المستخدمين", "إدارة المحتوى", "عرض جميع الإحصائيات"]
    };
    const roleNames = { user: "مستخدم عادي", company: "شركة", university: "جامعة", admin: "مدير" };
    openUtility("لوحة التحكم", "fa-chart-pie", `<div class="dashboard-summary"><div><i class="fa-solid fa-comments"></i><strong>${history.length}</strong><small>إجمالي المحادثات</small></div><div><i class="fa-solid fa-robot"></i><strong>${usage[0]?.title || "—"}</strong><small>الوكيل الأكثر استخدامًا</small></div><div><i class="fa-solid fa-key"></i><strong>${roleNames[activeRole]}</strong><small>مستوى الصلاحية</small></div></div><h3 class="dashboard-title">صلاحيات الحساب</h3><div class="permission-list">${rolePermissions[activeRole].map((permission) => `<span><i class="fa-solid fa-check"></i>${permission}</span>`).join("")}</div><h3 class="dashboard-title">استخدام الوكلاء</h3><div class="agent-usage-chart">${usage.map((item) => `<div><span><i class="fa-solid ${item.icon}"></i>${item.title}</span><b>${item.count}</b><em style="width:${Math.max(5, item.count / Math.max(1, usage[0].count) * 100)}%"></em></div>`).join("")}</div><h3 class="dashboard-title">أحدث الطلبات</h3><div class="utility-list">${history.slice(0, 5).map((item) => `<article><i class="fa-solid fa-message"></i><span><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.date)}</small></span></article>`).join("") || "<p>لا توجد طلبات حديثة.</p>"}</div>`);
}

function showServiceMap() {
    openUtility("خريطة فنادق أبها", "fa-map-location-dot", `<p class="map-description">مواقع الفنادق في أبها فقط، بدون فلترة حسب السعر.</p><iframe class="service-map" title="مواقع الفنادق في أبها" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent("فنادق أبها")}&output=embed"></iframe>`);
}

function showConversationHistory() {
    const history = JSON.parse(localStorage.getItem("conversationHistory") || "[]");
    openUtility("سجل المحادثات", "fa-clock-rotate-left", `<div class="utility-list">${history.length ? history.map((item) => `<article><i class="fa-solid ${item.role === "المستخدم" ? "fa-user" : "fa-wand-magic-sparkles"}"></i><span><strong>${escapeHtml(item.role)} · ${escapeHtml(item.agent)}</strong><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.date)}</small></span></article>`).join("") : `<p>لا توجد محادثات محفوظة حتى الآن.</p>`}</div><button class="utility-danger" id="clearHistoryBtn" type="button">مسح السجل</button>`);
    utilityContent.querySelector("#clearHistoryBtn").addEventListener("click", () => { localStorage.removeItem("conversationHistory"); showConversationHistory(); });
}

function showAllFavorites() {
    const housingFavorites = [...housingState.favorites].map((name) => [name, "سكن"]);
    const entertainmentFavorites = entertainmentState.savedPlaces.map((item) => [item.name, item.detail]);
    const favorites = [...housingFavorites, ...entertainmentFavorites];
    openUtility("المفضلة", "fa-heart", `<div class="utility-list">${favorites.length ? favorites.map(([name, detail]) => `<article><i class="fa-solid fa-heart"></i><span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(detail)}</small></span></article>`).join("") : `<p>لا توجد عناصر في المفضلة.</p>`}</div>`);
}

function showNotifications() {
    const notifications = JSON.parse(localStorage.getItem("appNotifications") || "[]").map((item) => ({ ...item, read: true }));
    localStorage.setItem("appNotifications", JSON.stringify(notifications));
    updateNotificationCount();
    openUtility("الإشعارات", "fa-bell", `<div class="utility-list">${notifications.length ? notifications.map((item) => `<article><i class="fa-solid fa-bell"></i><span><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.date)}</small></span></article>`).join("") : `<p>لا توجد إشعارات جديدة.</p>`}</div>`);
}

function showQuickSearch() {
    const searchableItems = [
        ...mainAgentRoutes.map((route) => ({ name: route.title, detail: agents[route.type].description, type: route.type, agentOnly: true })),
        ...agents.housing.items.map((item) => ({ name: item.name, detail: item.location, type: "housing" })),
        ...agents.transport.items.map((item) => ({ name: item.name || item[0], detail: item.location || item[1], type: "transport" })),
        ...agents.hr.items.map((item) => ({ name: item.name, detail: item.type, type: "hr" })),
        ...agents.education.items.map((item) => ({ name: item.name, detail: item.type, type: "education", group: item.group })),
        ...agents.entertainment.items.map((item) => ({ name: item.name, detail: item.location, type: "entertainment" }))
    ];
    openUtility("البحث السريع", "fa-magnifying-glass", `<form class="quick-search-form"><input type="search" placeholder="ابحث عن وكيل أو خدمة أو مكان" autofocus><button type="submit">بحث</button></form><div class="quick-search-results"></div>`);
    const form = utilityContent.querySelector("form");
    const results = utilityContent.querySelector(".quick-search-results");
    const render = (query = "") => {
        const matches = searchableItems.filter((item) => !query || `${item.name} ${item.detail}`.includes(query)).slice(0, 12);
        results.innerHTML = matches.map((item) => `<button type="button" data-search-index="${searchableItems.indexOf(item)}"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail || "")}</small><i class="fa-solid fa-arrow-left"></i></button>`).join("");
    };
    form.addEventListener("submit", (event) => { event.preventDefault(); render(form.querySelector("input").value.trim()); });
    results.addEventListener("click", (event) => {
        const result = event.target.closest("[data-search-index]");
        if (!result) return;
        const selectedItem = searchableItems[Number(result.dataset.searchIndex)];
        closeSimpleModal(utilityModal);
        const route = mainAgentRoutes.find((item) => item.type === selectedItem.type);
        openAgent(route.title, route.type);
        if (selectedItem.agentOnly) return;
        if (selectedItem.type === "education" && selectedItem.group) {
            renderRecommendations(agents.education, selectedItem.group);
        }
        const recommendationCards = [...recommendationsList.querySelectorAll(".recommendation-item")];
        recommendationCards.forEach((card) => {
            const isTarget = card.querySelector("strong")?.textContent.trim() === selectedItem.name;
            card.hidden = !isTarget;
            card.classList.toggle("search-target", isTarget);
            if (isTarget) window.setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
        });
        listTitle.textContent = `نتيجة البحث: ${selectedItem.name}`;
        userInput.value = `أريد تفاصيل ${selectedItem.name}`;
    });
    render();
}

const interfaceTranslations = {
    "ضيوف عسير": "Guests of Asir", "دليلك الذكي في أبها": "Your smart guide in Abha", "دليلك الذكي في عسير": "Your smart guide in Asir",
    "الرئيسية": "Home", "الوكلاء": "Agents", "الخدمات": "Services", "عن المنصة": "About", "الدعم الفني": "Support",
    "تسجيل الدخول": "Sign in", "تسجيل الخروج": "Sign out", "الملف الشخصي": "Profile", "إنشاء حساب": "Create account", "إنشاء الحساب": "Create account",
    "عسير أقرب": "Asir is closer", "بتفاصيلها وأهلها": "Through its details and people",
    "استكشف الوكلاء الآن": "Explore agents now", "نبذة عن أبها": "About Abha", "ابدأ الآن": "Get started",
    "الوكيل الرئيسي · Supervisor Agent": "Main Supervisor Agent", "اكتب طلبك مرة واحدة": "Write your request once", "ما الذي تبحث عنه؟": "What are you looking for?", "حلّل طلبي": "Analyze my request",
    "رفع ملف PDF": "Upload PDF", "رفع صورة": "Upload image", "لم يتم إرفاق ملفات": "No files attached",
    "اختر الوكيل الذي": "Choose the agent that", "يناسب احتياجك": "fits your needs", "الوكلاء الذكيون": "Smart agents",
    "وكيل السكن والفنادق": "Housing and Hotels Agent", "وكيل المواصلات": "Transportation Agent", "وكيل الموارد البشرية": "Human Resources Agent", "وكيل التعليم": "Education Agent", "وكيل الترفيه": "Entertainment Agent",
    "السكن والفنادق": "Housing and hotels", "المواصلات": "Transportation", "الموارد البشرية": "Human resources", "التعليم": "Education", "الترفيه": "Entertainment",
    "استكشف الآن": "Explore now", "شقق": "Apartments", "فلل": "Villas", "فنادق": "Hotels", "تأجير": "Rentals", "توصيل": "Ride services", "أجرة": "Taxi", "حافلات": "Buses",
    "وظائف": "Jobs", "شركات": "Companies", "تدريب": "Training", "استشارات": "Consulting", "جامعات": "Universities", "مدارس": "Schools", "دورات": "Courses", "منح": "Scholarships", "فعاليات": "Events", "مطاعم": "Restaurants", "أماكن": "Places", "أنشطة": "Activities",
    "سريع": "Fast", "ذكي": "Smart", "متكامل": "Integrated", "كل خدماتك": "All your services", "في منصة واحدة": "in one platform", "لماذا ضيوف عسير؟": "Why Guests of Asir?",
    "خيارات حقيقية": "Real options", "القائمة المقترحة": "Suggested list", "وكيل ذكي": "Smart agent", "الوكيل الذكي": "Smart agent", "متصل الآن": "Online now", "محادثة جديدة": "New chat", "افتح الوكيل الذكي": "Open smart agent", "إخفاء الوكيل": "Hide agent", "رجوع للخلف": "Go back",
    "البريد الإلكتروني": "Email", "البريد الإلكتروني أو رقم الجوال": "Email or mobile number", "رقم الجوال": "Mobile number", "العمر": "Age", "كلمة المرور": "Password", "نوع الحساب": "Account type", "الاسم": "Name", "دخول": "Sign in",
    "مستخدم عادي": "Regular user", "شركة": "Company", "جامعة": "University", "مدير": "Administrator", "ليس لديك حساب؟ أنشئ حسابًا": "No account? Create one",
    "شاركنا رأيك": "Share your feedback", "رأيك يهمنا": "Your feedback matters", "كيف كانت تجربتك؟": "How was your experience?", "ملاحظتك": "Your feedback", "إرسال التقييم": "Submit rating", "ممتازة": "Excellent", "جيدة": "Good", "مقبولة": "Acceptable", "سيئة": "Bad",
    "الأسئلة الشائعة": "Frequently asked questions", "سياسة الخصوصية": "Privacy policy", "الشروط والأحكام": "Terms and conditions", "المساعدة": "Help", "المنصة": "Platform",
    "سياسة الخصوصية": "Privacy Policy", "خصوصيتك تهمنا": "Your privacy matters", "البيانات التي نجمعها": "Data we collect", "كيفية استخدام البيانات": "How we use data", "حماية المعلومات": "Information protection", "الموقع والملفات": "Location and files", "حقوقك": "Your rights",
    "الأسئلة الشائعة": "Frequently Asked Questions", "كيف يمكننا مساعدتك؟": "How can we help?", "ما هي منصة ضيوف عسير؟": "What is Guests of Asir?", "كيف أختار الوكيل المناسب؟": "How do I choose the right agent?", "هل يلزم إنشاء حساب؟": "Do I need an account?", "كيف أتواصل مع الدعم الفني؟": "How do I contact support?", "هل يمكنني حذف سجل المحادثات؟": "Can I delete chat history?",
    "الشروط والأحكام": "Terms and Conditions", "شروط استخدام ضيوف عسير": "Guests of Asir Terms of Use", "استخدام المنصة": "Platform use", "الحساب والعمر": "Account and age", "المعلومات والاقتراحات": "Information and suggestions", "الحجوزات والخدمات الخارجية": "Bookings and external services", "السلوك المقبول": "Acceptable use", "التحديثات": "Updates",
    "خريطة السكن والفنادق": "Housing and hotels map", "بحث": "Search", "كل المواقع": "All locations", "كل الميزانيات": "All budgets", "مفضلة": "Favorite", "مقارنة": "Compare", "احجز": "Book", "متاح للحجز": "Available to book", "الخريطة": "Map",
    "تاريخ الدخول": "Check-in date", "تاريخ الخروج": "Check-out date", "عدد الأشخاص": "Number of guests", "تأكيد الحجز": "Confirm booking", "حجز غرفة فندقية": "Book a hotel room",
    "لوحة التحكم": "Dashboard", "سجل المحادثات": "Chat history", "المفضلة": "Favorites", "الإشعارات": "Notifications", "البحث السريع": "Quick search", "الأدوات": "Tools", "معلومات": "Information",
    "إجمالي المحادثات": "Total conversations", "الوكيل الأكثر استخدامًا": "Most used agent", "مستوى الصلاحية": "Permission level", "صلاحيات الحساب": "Account permissions", "استخدام الوكلاء": "Agent usage", "أحدث الطلبات": "Recent requests",
    "مرحباً! كيف يمكنني مساعدتك اليوم؟": "Hello! How can I help you today?", "اكتب طلبك هنا...": "Type your request here...", "ابحث عن وكيل أو خدمة أو مكان": "Search for an agent, service, or place",
    "© 2026 ضيوف عسير - جميع الحقوق محفوظة": "© 2026 Guests of Asir — All rights reserved"
};

Object.assign(interfaceTranslations, {
    "مكافآت ضيوف عسير": "Guests of Asir Rewards", "المكافآت": "Rewards", "المكافآت والكوبونات": "Rewards and coupons", "تابع تقدمك واستعرض كوبوناتك": "Track your progress and view your coupons", "عناصر محفوظة": "saved items", "مكافأة ضيوف عسير": "Guests of Asir reward", "مكافأة كل 5 طلبات": "A reward every 5 requests", "كل 5 طلبات تمنحك كوبون جولة مجانية": "Every 5 requests earn you a free tour coupon", "جولة مع نفس للسياحة لمدة يوم واحد مجانًا": "A free one-day tour with Nafs Tourism", "شاهد كوبوناتك": "View your coupons", "استخدام الكوبون": "Redeem coupon", "متاح للاستخدام": "Available to redeem",
    "منصة ضيوف عسير تقدم لك كوبونًا بعد إكمال كل 5 طلبات لدى أي وكيل، لتحصل على جولة مع «نفس للسياحة» لمدة يوم واحد مجانًا.": "Guests of Asir gives you a coupon after every 5 completed agent requests for a free one-day tour with Nafs Tourism.",
    "دليلك الذكي لاكتشاف السكن والمواصلات والعمل والتعليم والترفيه في أبها وخميس مشيط ومحافظات منطقة عسير.": "Your smart guide to housing, transportation, work, education, and entertainment across Abha, Khamis Mushait, and the Asir region.",
    "سأفهم احتياجك، وأشغّل الوكلاء المناسبين تلقائيًا، ثم أدمج النتائج لك في شاشة واحدة.": "I will understand your needs, run the right agents automatically, and combine their results in one view.",
    "كل وكيل ذكي صُمم لمساعدتك وتوفير الوقت والجهد.": "Each smart agent is designed to help you save time and effort.",
    "أخبرني بوجهتك داخل أبها وعدد الركاب والموعد لأقترح وسيلة المواصلات المناسبة.": "Tell me your destination in Abha, passenger count, and time so I can recommend the best transport option.",
    "اختر عقاراً داخل أبها أو أخبرني بالحي والميزانية وعدد الأشخاص ومدة السكن.": "Choose a property in Abha or tell me the district, budget, guest count, and length of stay.",
    "أخبرني عن الوظيفة أو جهة العمل التي تبحث عنها في أبها أو خميس مشيط.": "Tell me about the job or employer you are looking for in Abha or Khamis Mushait.",
    "أخبرني بالتخصص أو الدورة التي تريدها داخل أبها.": "Tell me which major or course you want in Abha.",
    "اختر مكاناً ترفيهياً في أبها أو أخبرني بالنشاط الذي تفضله.": "Choose an entertainment destination in Abha or tell me your preferred activity.",
    "خيارات المواصلات في أبها": "Transportation options in Abha", "السكن والفنادق المتاحة في أبها": "Available housing and hotels in Abha", "جهات وشركات في أبها وخميس مشيط": "Organizations and companies in Abha and Khamis Mushait", "الجامعات والمدارس في أبها": "Universities and schools in Abha", "أماكن ترفيه في أبها": "Entertainment destinations in Abha",
    "اقتراح أفضل وسيلة نقل": "Recommend the best transport", "حساب تكلفة الرحلة": "Calculate trip cost", "تقدير وقت الوصول": "Estimate arrival time", "حفظ الرحلات المتكررة": "Save frequent trips", "اقتراح أقرب موقف أو محطة": "Find the nearest stop or station",
    "البحث عن شقق وفلل وفنادق": "Search apartments, villas, and hotels", "فلترة حسب المدينة والميزانية": "Filter by city and budget", "عرض الموقع على الخريطة": "Show location on map", "حفظ الأماكن في المفضلة": "Save places to favorites", "مقارنة أكثر من سكن": "Compare properties",
    "البحث عن الوظائف": "Search jobs", "إنشاء وتحسين السيرة الذاتية": "Create and improve a CV", "متابعة طلبات التوظيف": "Track job applications",
    "سيارات الأجرة": "Taxis", "تطبيقات التوصيل": "Ride-hailing apps", "حافلات النقل": "Public buses", "تأجير السيارات": "Car rental",
    "غرفة فندقية مطلة": "Hotel room with a view", "جناح فندقي عائلي": "Family hotel suite", "استديو مفروش": "Furnished studio", "شقة غرفتين": "Two-bedroom apartment", "شقة عائلية": "Family apartment", "فيلا مستقلة": "Detached villa",
    "جامعة الملك خالد": "King Khalid University", "الكلية التقنية بأبها": "Abha Technical College", "مدارس الأندلس الأهلية": "Al Andalus Private Schools", "مدارس التربية الأهلية": "Al Tarbiyah Private Schools", "المدارس الحكومية": "Public schools",
    "المدينة العالية": "High City", "شارع الفن": "Art Street", "بحيرة سد أبها": "Abha Dam Lake", "حديقة السلام": "Al Salam Park",
    "شركة لينكس لتقنية المعلومات": "Lynx Information Technology", "شركة الكهرباء السعودية": "Saudi Electricity Company", "مصرف الراجحي": "Al Rajhi Bank", "شركة النهدي الطبية": "Nahdi Medical Company", "شركة زين السعودية": "Zain Saudi Arabia", "البريد السعودي | سبل": "Saudi Post | SPL", "شركة جرير للتسويق": "Jarir Marketing Company"
});

const translationReplacements = [
    ["أكملت", "Completed"], ["من 5 طلبات", "of 5 requests"], ["متبقي", "remaining"], ["للمكافأة التالية", "until the next reward"], ["أبها", "Abha"], ["خميس مشيط", "Khamis Mushait"], ["عسير", "Asir"], ["السكن", "housing"], ["الفنادق", "hotels"], ["الشقق", "apartments"], ["الفلل", "villas"], ["المواصلات", "transportation"], ["الوظائف", "jobs"], ["التعليم", "education"], ["الترفيه", "entertainment"], ["الجامعات", "universities"], ["المدارس", "schools"], ["الشركات", "companies"], ["الخدمات", "services"], ["المعلومات", "information"], ["الحساب", "account"], ["المحادثات", "conversations"], ["الطلبات", "requests"], ["السعر", "price"], ["شهرياً", "monthly"], ["سنوياً", "yearly"], ["لليلة", "per night"], ["اضغط للاتصال", "Tap to call"], ["افتح الخريطة", "Open map"], ["نتيجة البحث", "Search result"], ["آخر تحديث", "Last updated"]
];

const originalNodeText = new WeakMap();
const originalAttributes = new WeakMap();
let activeInterfaceLanguage = "ar";

function translateInterfaceText(value) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const normalized = trimmed.replace(/\s+/g, " ");
    let translated = interfaceTranslations[normalized] || normalized;
    if (translated === normalized) {
        translationReplacements.forEach(([arabic, english]) => { translated = translated.replaceAll(arabic, english); });
    }
    return value.replace(trimmed, translated);
}

function translateInterfaceTree(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
        if (node.parentElement?.closest("script, style")) return;
        if (activeInterfaceLanguage === "en" && /[\u0600-\u06ff]/.test(node.nodeValue)) originalNodeText.set(node, node.nodeValue);
        const original = originalNodeText.get(node) || node.nodeValue;
        node.nodeValue = activeInterfaceLanguage === "en" ? translateInterfaceText(original) : original;
    });
    root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach((element) => {
        if (!originalAttributes.has(element)) originalAttributes.set(element, {});
        const saved = originalAttributes.get(element);
        ["placeholder", "title", "aria-label"].forEach((attribute) => {
            if (!element.hasAttribute(attribute)) return;
            const current = element.getAttribute(attribute);
            if (activeInterfaceLanguage === "en" && /[\u0600-\u06ff]/.test(current)) saved[attribute] = current;
            const original = saved[attribute] || current;
            element.setAttribute(attribute, activeInterfaceLanguage === "en" ? translateInterfaceText(original) : original);
        });
    });
}

function applyLanguage(language) {
    activeInterfaceLanguage = language === "en" ? "en" : "ar";
    document.documentElement.lang = activeInterfaceLanguage;
    document.documentElement.dir = activeInterfaceLanguage === "en" ? "ltr" : "rtl";
    document.body.classList.toggle("english-mode", activeInterfaceLanguage === "en");
    translateInterfaceTree(document.body);
    languageBtn.textContent = activeInterfaceLanguage === "en" ? "AR" : "EN";
    localStorage.setItem("appLanguage", activeInterfaceLanguage);
}

const languageObserver = new MutationObserver((mutations) => {
    if (activeInterfaceLanguage !== "en") return;
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && /[\u0600-\u06ff]/.test(node.nodeValue)) {
            originalNodeText.set(node, node.nodeValue);
            node.nodeValue = translateInterfaceText(node.nodeValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) translateInterfaceTree(node);
    }));
});
languageObserver.observe(document.body, { childList: true, subtree: true });

loginButton.addEventListener("click", () => openSimpleModal(loginModal));
document.querySelector("#feedbackBtn").addEventListener("click", () => openSimpleModal(feedbackModal));
document.querySelector(".watch-btn").addEventListener("click", openAbhaVideo);
abhaVideoPage.addEventListener("click", (event) => { if (event.target === abhaVideoPage) closeAbhaVideo(); });
abhaVideo.addEventListener("ended", closeAbhaVideo);
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && abhaVideoPage.classList.contains("show")) closeAbhaVideo();
});
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = `${Math.min(userInput.scrollHeight, 130)}px`;
});
suggestedPrompts.addEventListener("click", (event) => {
    const promptButton = event.target.closest("button");
    if (!promptButton) return;
    userInput.value = promptButton.textContent;
    sendMessage();
});
clearAgentChat.addEventListener("click", () => {
    clearAgentMemory(activeAgent);
    messages.replaceChildren();
    userInput.value = "";
    userInput.style.height = "auto";
    suggestedPrompts.hidden = false;
    suggestedPrompts.innerHTML = agentPromptSuggestions[activeAgent].map((prompt) => `<button type="button">${prompt}</button>`).join("");
    welcomeMessage.textContent = "مرحباً! بدأت محادثة جديدة، كيف يمكنني مساعدتك؟";
    userInput.focus();
});
modal.addEventListener("click", (event) => { if (event.target === modal) closeAgent(); });
document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeSimpleModal(document.querySelector(`#${button.dataset.close}`)));
});

[loginModal, feedbackModal, bookingModal, signupModal, utilityModal].forEach((target) => {
    target.addEventListener("click", (event) => { if (event.target === target) closeSimpleModal(target); });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal.classList.contains("show")) closeAgent();
    if (loginModal.classList.contains("show")) closeSimpleModal(loginModal);
    if (feedbackModal.classList.contains("show")) closeSimpleModal(feedbackModal);
    if (bookingModal.classList.contains("show")) closeSimpleModal(bookingModal);
    if (signupModal.classList.contains("show")) closeSimpleModal(signupModal);
    if (utilityModal.classList.contains("show")) closeSimpleModal(utilityModal);
});

bookingCheckIn.addEventListener("change", () => {
    if (bookingCheckIn.value) {
        const nextDay = new Date(`${bookingCheckIn.value}T00:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        bookingCheckOut.min = nextDay.toISOString().slice(0, 10);
        if (!bookingCheckOut.value || bookingCheckOut.value <= bookingCheckIn.value) bookingCheckOut.value = bookingCheckOut.min;
    }
    updateBookingTotal();
});
bookingCheckOut.addEventListener("change", updateBookingTotal);

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateBookingTotal();
    const start = new Date(`${bookingCheckIn.value}T00:00:00`);
    const end = new Date(`${bookingCheckOut.value}T00:00:00`);
    const nights = Math.round((end - start) / 86400000);
    const status = document.querySelector("#bookingStatus");
    if (!selectedBooking || nights < 1) {
        status.classList.remove("success");
        status.textContent = "تحقق من تواريخ الحجز أولاً.";
        return;
    }
    const booking = {
        id: `DA-${Date.now().toString().slice(-6)}`,
        hotel: selectedBooking.name,
        checkIn: bookingCheckIn.value,
        checkOut: bookingCheckOut.value,
        guests: Number(bookingGuests.value),
        nights,
        total: selectedBooking.nightlyRate ? nights * selectedBooking.nightlyRate : null
    };
    const bookings = JSON.parse(localStorage.getItem("dhayf-asir-bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("dhayf-asir-bookings", JSON.stringify(bookings));
    status.classList.add("success");
    status.textContent = `تم حفظ اختيارك. جارٍ فتح صفحة الحجز للتحقق من السعر والتوفر.`;
    addNotification(`تم حفظ طلب ${booking.hotel}. أكمل الحجز من صفحة الفندق.`);
    if (selectedBooking.bookingUrl) window.open(selectedBooking.bookingUrl, "_blank", "noopener,noreferrer");
});

async function saveSignedInUser(fullName, email) {
    const response = await fetch("/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email })
    });
    if (!response.ok && response.status !== 409) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "تعذر حفظ المستخدم في قاعدة البيانات.");
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#loginEmail");
    const password = document.querySelector("#loginPassword");
    const status = document.querySelector("#loginStatus");
    status.classList.remove("success");
    const identity = email.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
    const normalizedPhone = identity.replace(/[\s-]/g, "");
    const isPhone = /^(?:\+?966|0)?5\d{8}$/.test(normalizedPhone);
    if (!isEmail && !isPhone) {
        status.textContent = "فضلاً أدخل بريدًا إلكترونيًا أو رقم جوال سعوديًا صحيحًا.";
        email.focus();
        return;
    }
    if (password.value.length < 6 || !/[A-Za-z]/.test(password.value)) {
        status.textContent = "كلمة المرور يجب أن تكون 6 خانات على الأقل وبها حرف إنجليزي كبير أو صغير.";
        password.focus();
        return;
    }
    const savedAccount = JSON.parse(localStorage.getItem("wakala-account") || "null");
    if (savedAccount && identity !== savedAccount.email && normalizedPhone !== savedAccount.phone) {
        status.textContent = "لا يوجد حساب مسجل بهذه البيانات. يمكنك إنشاء حساب جديد.";
        email.focus();
        return;
    }
    const accountEmail = savedAccount?.email || (isEmail ? identity : "");
    if (accountEmail) {
        try {
            await saveSignedInUser(savedAccount?.name || identity.split("@")[0], accountEmail);
        } catch (error) {
            status.textContent = error.message;
            return;
        }
    }
    localStorage.setItem("wakala-user", savedAccount?.email || identity);
    status.textContent = "تم تسجيل الدخول بنجاح.";
    status.classList.add("success");
    loginButton.hidden = true;
    logoutButton.hidden = false;
    profileBtn.hidden = false;
    addNotification("تم تسجيل الدخول إلى حسابك بنجاح.");
    window.setTimeout(() => closeSimpleModal(loginModal), 700);
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("wakala-user");
    loginForm.reset();
    document.querySelector("#loginStatus").textContent = "";
    logoutButton.hidden = true;
    loginButton.hidden = false;
    profileBtn.hidden = true;
    loginButton.innerHTML = '<i class="fa-solid fa-user"></i> تسجيل الدخول';
});

feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const rating = feedbackForm.querySelector('input[name="rating"]:checked');
    const message = document.querySelector("#feedbackMessage");
    const status = document.querySelector("#feedbackStatus");
    status.classList.remove("success");
    if (!rating || !message.value.trim()) {
        status.textContent = "اختر التقييم واكتب ملاحظتك أولاً.";
        return;
    }
    const feedback = JSON.parse(localStorage.getItem("wakala-feedback") || "[]");
    const account = JSON.parse(localStorage.getItem("wakala-account") || "null");
    const feedbackEntry = { rating: Number(rating.value), message: message.value.trim(), user: account?.email || localStorage.getItem("wakala-user") || "زائر", date: new Date().toISOString() };
    feedback.push(feedbackEntry);
    localStorage.setItem("wakala-feedback", JSON.stringify(feedback));
    const submitButton = feedbackForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال';
    try {
        const response = await fetch("https://formsubmit.co/ajax/razanalqobti@gmail.com", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                _subject: `تقييم جديد لمنصة ضيوف عسير (${feedbackEntry.rating}/5)`,
                التقييم: `${feedbackEntry.rating} من 5`,
                المستخدم: feedbackEntry.user,
                التاريخ: new Date(feedbackEntry.date).toLocaleString("ar-SA"),
                الملاحظة: feedbackEntry.message
            })
        });
        if (!response.ok) throw new Error("Feedback delivery failed");
        status.textContent = "شكرًا لك، تم إرسال تقييمك بنجاح.";
        status.classList.add("success");
        feedbackForm.reset();
        window.setTimeout(() => closeSimpleModal(feedbackModal), 1200);
    } catch (error) {
        status.textContent = "تعذر إرسال التقييم الآن. تحقق من الإنترنت وحاول مرة أخرى.";
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال التقييم';
    }
});

if (localStorage.getItem("wakala-user")) {
    loginButton.hidden = true;
    logoutButton.hidden = false;
    profileBtn.hidden = false;
}

document.querySelector("#openSignupBtn").addEventListener("click", () => {
    closeSimpleModal(loginModal);
    window.setTimeout(() => openSimpleModal(signupModal), 120);
});

document.querySelector("#signupBackBtn")?.addEventListener("click", () => {
    closeSimpleModal(signupModal);
    window.setTimeout(() => openSimpleModal(loginModal), 120);
});

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const phone = String(formData.get("phone") || "").replace(/[\s-]/g, "");
    const age = Number(formData.get("age"));
    const status = document.querySelector("#signupStatus");
    status.classList.remove("success");
    if (!signupForm.checkValidity()) return signupForm.reportValidity();
    if (!/^(?:\+?966|0)?5\d{8}$/.test(phone)) {
        status.textContent = "أدخل رقم جوال سعوديًا صحيحًا يبدأ بـ 05.";
        signupForm.elements.phone.focus();
        return;
    }
    if (!Number.isInteger(age) || age < 16 || age > 100) {
        status.textContent = "يجب أن يكون العمر 16 سنة أو أكثر لاستخدام المنصة.";
        signupForm.elements.age.focus();
        return;
    }
    const account = { name: formData.get("name").trim(), email: formData.get("email").trim(), phone, age, role: "user" };
    try {
        await saveSignedInUser(account.name, account.email);
    } catch (error) {
        status.textContent = error.message;
        return;
    }
    localStorage.setItem("wakala-account", JSON.stringify(account));
    localStorage.setItem("wakala-user", account.email);
    status.textContent = "تم إنشاء الحساب وتسجيل الدخول بنجاح.";
    status.classList.add("success");
    loginButton.hidden = true;
    logoutButton.hidden = false;
    profileBtn.hidden = false;
    addNotification(`مرحبًا ${account.name}، تم إنشاء حسابك بنجاح.`);
    window.setTimeout(() => closeSimpleModal(signupModal), 800);
});

profileBtn.addEventListener("click", showProfile);
document.querySelector("#aboutRewardsBtn")?.addEventListener("click", showRewards);
quickSearchBtn.addEventListener("click", showQuickSearch);
notificationsBtn.addEventListener("click", showNotifications);
languageBtn.addEventListener("click", () => applyLanguage(document.documentElement.lang === "en" ? "ar" : "en"));
voiceSearchBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showLiveToast("البحث الصوتي غير مدعوم في هذا المتصفح.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang === "en" ? "en-US" : "ar-SA";
    recognition.interimResults = false;
    voiceSearchBtn.classList.add("listening");
    recognition.start();
    recognition.onresult = (event) => { mainAssistantInput.value = event.results[0][0].transcript; };
    recognition.onerror = () => showLiveToast("تعذر التقاط الصوت. حاول مرة أخرى.");
    recognition.onend = () => voiceSearchBtn.classList.remove("listening");
});

mainAssistantInput.addEventListener("input", () => {
    const query = mainAssistantInput.value.trim();
    const suggestions = supervisorSuggestions.filter((suggestion) => !query || suggestion.includes(query) || query.split(/\s+/).some((word) => word.length > 2 && suggestion.includes(word))).slice(0, 4);
    smartRequestSuggestions.innerHTML = query && suggestions.length ? suggestions.map((suggestion) => `<button type="button">${suggestion}</button>`).join("") : "";
});

smartRequestSuggestions.addEventListener("click", (event) => {
    const suggestionButton = event.target.closest("button");
    if (!suggestionButton) return;
    mainAssistantInput.value = suggestionButton.textContent;
    smartRequestSuggestions.replaceChildren();
    mainAssistantInput.focus();
});

messages.addEventListener("click", (event) => {
    const ratingButton = event.target.closest("[data-message-rating]");
    if (!ratingButton) return;
    ratingButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
    ratingButton.classList.add("active");
    const ratings = JSON.parse(localStorage.getItem("agentResponseRatings") || "[]");
    ratings.push({ value: ratingButton.dataset.messageRating, agent: activeAgent, date: new Date().toISOString() });
    localStorage.setItem("agentResponseRatings", JSON.stringify(ratings));
});

updateNotificationCount();
if (localStorage.getItem("appLanguage") === "en") applyLanguage("en");
if (!sessionStorage.getItem("liveUpdateShown")) {
    sessionStorage.setItem("liveUpdateShown", "true");
    window.setTimeout(() => {
        const liveUpdates = ["تمت إضافة فرصة وظيفية جديدة في خميس مشيط.", "توجد فعالية عائلية جديدة في أبها هذا الأسبوع.", "تم تحديث خيارات السكن المتاحة في وسط أبها.", "تم تحديث معلومات القبول في الجهات التعليمية."];
        addNotification(liveUpdates[Math.floor(Math.random() * liveUpdates.length)]);
    }, 12000);
}

mainAssistantForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestText = mainAssistantInput.value.trim();
    if (!requestText) return mainAssistantInput.focus();
    const submitButton = document.querySelector("#mainAssistantSubmit");
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>جاري التحليل...</span>`;
    runMainAssistant(requestText);
    window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i><span>تحليل طلب جديد</span>`;
    }, 700);
});

mainAssistantOutput?.addEventListener("click", (event) => {
    const closeSearchButton = event.target.closest(".close-main-search");
    if (closeSearchButton) {
        mainAssistantOutput.replaceChildren();
        mainAssistantOutput.hidden = true;
        mainAssistantInput.value = "";
        smartRequestSuggestions?.replaceChildren();
        const submitButton = document.querySelector("#mainAssistantSubmit");
        if (submitButton) submitButton.innerHTML = `<i class="fa-solid fa-paper-plane"></i><span>حلّل طلبي</span>`;
        mainAssistantInput.focus();
        return;
    }
    const exactResult = event.target.closest("[data-result-agent]");
    if (exactResult) return openExactAgentResult(exactResult.dataset.resultAgent, exactResult.dataset.resultName, exactResult.dataset.resultGroup);
    const agentButton = event.target.closest("[data-open-main-agent]");
    if (agentButton) return openAgent(agentButton.dataset.agentTitle, agentButton.dataset.openMainAgent);
    const ratingButton = event.target.closest("[data-rate-result]");
    if (ratingButton) {
        ratingButton.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
        ratingButton.classList.add("active");
        const ratings = JSON.parse(localStorage.getItem("agentResponseRatings") || "[]");
        ratings.push({ value: ratingButton.dataset.rateResult, agent: ratingButton.closest("article")?.querySelector("header strong")?.textContent || "المساعد الرئيسي", date: new Date().toISOString() });
        localStorage.setItem("agentResponseRatings", JSON.stringify(ratings));
        return;
    }
    const shareButton = event.target.closest(".share-results-btn");
    if (!shareButton) return;
    const shareText = mainAssistantOutput.innerText;
    if (navigator.share) navigator.share({ title: "نتائج ضيوف عسير", text: shareText }).catch(() => {});
    else navigator.clipboard.writeText(shareText).then(() => { shareButton.innerHTML = `<i class="fa-solid fa-check"></i> تم نسخ النتائج`; });
});

document.querySelectorAll('.footer-links a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const title = link.textContent.trim();
        if (title === "سياسة الخصوصية") {
            openUtility("سياسة الخصوصية", "fa-shield-halved", `
                <div class="privacy-content">
                    <header>
                        <i class="fa-solid fa-shield-halved"></i>
                        <div><h3>خصوصيتك تهمنا</h3><p>توضح هذه السياسة كيفية تعامل منصة ضيوف عسير مع بياناتك عند استخدام الخدمات.</p></div>
                    </header>
                    <section><h4>البيانات التي نجمعها</h4><p>نجمع البيانات التي تدخلها عند إنشاء الحساب، مثل الاسم والبريد الإلكتروني ورقم الجوال والعمر، إضافة إلى الطلبات والمفضلة اللازمة لتقديم الخدمة.</p></section>
                    <section><h4>كيفية استخدام البيانات</h4><p>تُستخدم بياناتك لتشغيل الوكلاء، تخصيص الاقتراحات، حفظ المحادثات، إدارة الحجوزات، وتحسين تجربة الاستخدام.</p></section>
                    <section><h4>حماية المعلومات</h4><p>نطبق إجراءات مناسبة لحماية معلوماتك، ولا نبيع بياناتك الشخصية. في هذه النسخة التجريبية تُحفظ بيانات الحساب محليًا على جهازك.</p></section>
                    <section><h4>الموقع والملفات</h4><p>لا نصل إلى موقعك أو ملفاتك إلا بعد موافقتك واختيارك الصريح. وتُستخدم الصلاحية لتنفيذ الطلب الذي حددته فقط.</p></section>
                    <section><h4>حقوقك</h4><p>يمكنك مراجعة بياناتك أو تعديلها أو حذف السجل والمفضلة وتسجيل الخروج في أي وقت من خلال الملف الشخصي.</p></section>
                    <footer><i class="fa-solid fa-calendar-check"></i> آخر تحديث: أغسطس 2026</footer>
                </div>`);
            return;
        }
        if (title === "الأسئلة الشائعة") {
            openUtility("الأسئلة الشائعة", "fa-circle-question", `
                <div class="privacy-content faq-content">
                    <header><i class="fa-solid fa-circle-question"></i><div><h3>كيف يمكننا مساعدتك؟</h3><p>إجابات سريعة عن أكثر الأسئلة شيوعًا حول منصة ضيوف عسير.</p></div></header>
                    <details open><summary>ما هي منصة ضيوف عسير؟</summary><p>منصة رقمية تجمع وكلاء متخصصين للسكن والمواصلات والوظائف والتعليم والترفيه في منطقة عسير.</p></details>
                    <details><summary>كيف أختار الوكيل المناسب؟</summary><p>يمكنك اختيار الوكيل مباشرة، أو كتابة طلبك في المساعد الرئيسي ليحدد الوكلاء المناسبين تلقائيًا.</p></details>
                    <details><summary>هل يلزم إنشاء حساب؟</summary><p>يمكن تصفح الخدمات دون حساب، لكن التسجيل مطلوب لحفظ المحادثات والمفضلة والحجوزات والطلبات.</p></details>
                    <details><summary>هل معلومات السكن والأسعار نهائية؟</summary><p>الأسعار والتوفر قابلة للتحديث. راجع تفاصيل الخيار وتأكد من السعر النهائي قبل تأكيد الحجز.</p></details>
                    <details><summary>كيف أتواصل مع الدعم الفني؟</summary><p>من صفحة الدعم الفني أو عبر رقم التواصل 0556202380.</p></details>
                    <details><summary>هل يمكنني حذف سجل المحادثات؟</summary><p>نعم، افتح الملف الشخصي ثم سجل المحادثات واختر مسح السجل.</p></details>
                </div>`);
            return;
        }
        if (title === "الشروط والأحكام") {
            openUtility("الشروط والأحكام", "fa-file-signature", `
                <div class="privacy-content terms-content">
                    <header><i class="fa-solid fa-file-signature"></i><div><h3>شروط استخدام ضيوف عسير</h3><p>باستخدام المنصة فإنك توافق على الالتزام بالشروط الموضحة أدناه.</p></div></header>
                    <section><h4>استخدام المنصة</h4><p>تُستخدم المنصة للأغراض النظامية فقط، ويلتزم المستخدم بإدخال بيانات صحيحة وعدم إساءة استخدام الخدمات أو الحسابات.</p></section>
                    <section><h4>الحساب والعمر</h4><p>الحد الأدنى لإنشاء الحساب 16 سنة، ويتحمل المستخدم مسؤولية حماية بيانات الدخول والأنشطة المنفذة من حسابه.</p></section>
                    <section><h4>المعلومات والاقتراحات</h4><p>تقدم الوكلاء اقتراحات مساعدة، وقد تتغير الأسعار والمواعيد والتوفر. يجب التحقق من الجهة المقدمة للخدمة قبل اتخاذ القرار النهائي.</p></section>
                    <section><h4>الحجوزات والخدمات الخارجية</h4><p>تخضع الحجوزات والخرائط والجهات الخارجية لشروط مقدم الخدمة، ولا تُعد المنصة طرفًا في الاتفاق النهائي إلا إذا ذُكر خلاف ذلك.</p></section>
                    <section><h4>السلوك المقبول</h4><p>يُمنع رفع محتوى ضار أو مخالف، أو محاولة الوصول غير المصرح به، أو استخدام المنصة للإضرار بالمستخدمين أو الجهات.</p></section>
                    <section><h4>التحديثات</h4><p>قد يتم تحديث هذه الشروط عند تطوير الخدمات، ويظهر تاريخ آخر تحديث داخل الصفحة.</p></section>
                    <footer><i class="fa-solid fa-calendar-check"></i> آخر تحديث: أغسطس 2026</footer>
                </div>`);
            return;
        }
        openInfo(title, `صفحة ${title} قيد الإعداد وستتوفر قريباً.`, "fa-file-lines");
    });
});

if (!document.body.classList.contains("section-page")) {
    const sections = [...document.querySelectorAll("main section[id], footer[id]")];
    const navItems = [...document.querySelectorAll(".nav-links a")];
    window.addEventListener("scroll", () => {
        const current = sections.filter((section) => section.offsetTop <= window.scrollY + 180).at(-1);
        if (!current) return;
        navItems.forEach((link) => link.classList.toggle("active", link.hash === `#${current.id}`));
    }, { passive: true });
}
const apiChatForm = document.querySelector("#apiChatForm");
const apiAgentSelect = document.querySelector("#apiAgentSelect");
const apiChatMessage = document.querySelector("#apiChatMessage");
const apiChatSubmit = document.querySelector("#apiChatSubmit");
const apiChatStatus = document.querySelector("#apiChatStatus");
const apiRegisterForm = document.querySelector("#apiRegisterForm");
const apiRegisterSubmit = document.querySelector("#apiRegisterSubmit");
const apiRegisterStatus = document.querySelector("#apiRegisterStatus");
const prayerTimesForm = document.querySelector("#prayerTimesForm");
const prayerTimesSubmit = document.querySelector("#prayerTimesSubmit");
const prayerTimesStatus = document.querySelector("#prayerTimesStatus");
const prayerTimesResults = document.querySelector("#prayerTimesResults");
const apiConversationHistory = document.querySelector("#apiConversationHistory");
const apiHistoryStatus = document.querySelector("#apiHistoryStatus");

function showBackendStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `backend-status ${type}`;
    element.hidden = false;
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => ({}));
    // Validate every API response before using it.
    if (!response.ok) throw new Error(payload.detail || `Request failed with status ${response.status}.`);
    return payload;
}

async function loadApiAgents() {
    if (!apiAgentSelect) return;
    try {
        const availableAgents = await apiRequest("/agents");
        apiAgentSelect.innerHTML = availableAgents.map((agent) => `<option value="${escapeHtml(agent.id)}">${escapeHtml(agent.name)}</option>`).join("");
    } catch (error) {
        apiAgentSelect.innerHTML = `<option value="">Agents unavailable</option>`;
        showBackendStatus(apiChatStatus, error.message, "error");
    }
}

async function loadApiConversations() {
    if (!apiConversationHistory) return;
    showBackendStatus(apiHistoryStatus, "Loading conversation history...", "loading");
    try {
        const conversations = await apiRequest("/conversations");
        apiConversationHistory.innerHTML = conversations.length
            ? conversations.map((item) => `<article><strong>${escapeHtml(item.agent)}</strong><p>${escapeHtml(item.user_message)}</p><small>${escapeHtml(item.ai_response)}</small></article>`).join("")
            : `<p class="empty-backend-state">No saved conversations yet.</p>`;
        apiHistoryStatus.hidden = true;
    } catch (error) {
        showBackendStatus(apiHistoryStatus, error.message, "error");
    }
}

apiChatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    apiChatSubmit.disabled = true;
    apiChatSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Waiting for AI...`;
    showBackendStatus(apiChatStatus, "The selected AI agent is preparing a response...", "loading");
    try {
        const result = await apiRequest("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agent: apiAgentSelect.value, message: apiChatMessage.value.trim() })
        });
        showBackendStatus(apiChatStatus, `${result.selected_agent}: ${result.ai_response}`, "success");
        apiChatMessage.value = "";
        await loadApiConversations();
    } catch (error) {
        showBackendStatus(apiChatStatus, error.message, "error");
    } finally {
        apiChatSubmit.disabled = false;
        apiChatSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send message`;
    }
});

apiRegisterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    apiRegisterSubmit.disabled = true;
    showBackendStatus(apiRegisterStatus, "Creating the user account...", "loading");
    try {
        const result = await apiRequest("/register-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: document.querySelector("#apiFullName").value.trim(),
                email: document.querySelector("#apiEmail").value.trim()
            })
        });
        showBackendStatus(apiRegisterStatus, `User ${result.full_name} was registered successfully.`, "success");
        apiRegisterForm.reset();
    } catch (error) {
        showBackendStatus(apiRegisterStatus, error.message, "error");
    } finally {
        apiRegisterSubmit.disabled = false;
    }
});

prayerTimesForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    prayerTimesSubmit.disabled = true;
    prayerTimesResults.replaceChildren();
    showBackendStatus(prayerTimesStatus, "Loading prayer times...", "loading");
    try {
        const city = document.querySelector("#prayerCity").value.trim();
        const result = await apiRequest(`/prayer-times/${encodeURIComponent(city)}`);
        const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        prayerTimesResults.innerHTML = prayerNames.map((name) => `<div><strong>${name}</strong><span>${escapeHtml(result[name])}</span></div>`).join("");
        showBackendStatus(prayerTimesStatus, `Prayer times loaded for ${result.city}.`, "success");
    } catch (error) {
        showBackendStatus(prayerTimesStatus, error.message, "error");
    } finally {
        prayerTimesSubmit.disabled = false;
    }
});

document.querySelector("#refreshApiHistory")?.addEventListener("click", loadApiConversations);
loadApiAgents();
loadApiConversations();
