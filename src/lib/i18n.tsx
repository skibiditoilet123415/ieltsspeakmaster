import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "vi";

const dict = {
  en: {
    "app.name": "IELTS Speaking AI",
    "app.tagline": "Practice. Learn. Reach Band 7+",
    "nav.home": "Home",
    "nav.speaking": "Speaking",
    "nav.vocab": "Vocabulary",
    "nav.history": "History",
    "nav.settings": "Settings",
    "auth.signin": "Sign in",
    "auth.signup": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.google": "Continue with Google",
    "auth.or": "or",
    "auth.have_account": "Already have an account?",
    "auth.no_account": "Don't have an account?",
    "auth.logout": "Log out",
    "dash.hi": "Hi",
    "dash.start": "Start Speaking",
    "dash.practice": "Practice Mode",
    "dash.history": "History",
    "dash.avg_band": "Average band",
    "dash.target_band": "Target band",
    "dash.upgrade": "Upgrade Premium",
    "dash.upgrade_price": "$7.99 / month",
    "dash.recent": "Recent sessions",
    "dash.no_sessions": "No sessions yet. Start your first test!",
    "speaking.intro": "Introduction",
    "speaking.part1": "Part 1",
    "speaking.part2": "Part 2",
    "speaking.part3": "Part 3",
    "speaking.done": "Finish & Score",
    "speaking.mic": "Hold to speak",
    "speaking.listening": "Listening…",
    "speaking.send": "Send",
    "speaking.type": "Type your answer…",
    "speaking.scoring": "Scoring your performance…",
    "speaking.overall": "Overall Band",
    "speaking.fluency": "Fluency",
    "speaking.vocabulary": "Vocabulary",
    "speaking.grammar": "Grammar",
    "speaking.pronunciation": "Pronunciation",
    "speaking.mistakes": "Mistakes & Corrections",
    "speaking.better_vocab": "Better vocabulary",
    "speaking.plan": "Improvement plan",
    "speaking.saved_vocab": "Saved {n} new words to your vocabulary",
    "speaking.pick_topic": "Pick a topic to begin",
    "speaking.random": "Random topic",
    "speaking.limit": "Daily limit reached (2/2). Upgrade to Premium for unlimited tests.",
    "speaking.xp_earned": "+{n} XP for using new vocabulary!",
    "speaking.used_words": "Words you reused: {words}",
    "dash.xp": "XP",
    "dash.streak": "Day streak",
    "dash.trend": "Band trend",
    "dash.no_trend": "Complete a few tests to see your improvement.",
    "dash.daily_left": "{n} of 2 free tests left today",
    "dash.daily_unlimited": "Unlimited tests (Premium)",
    "history.title": "History",
    "history.empty": "No sessions yet.",
    "history.detail": "Session details",
    "history.back": "Back to history",
    "vocab.title": "My Vocabulary",
    "vocab.filter_all": "All",
    "vocab.filter_due": "Due today",
    "vocab.flashcards": "Flashcards",
    "vocab.empty": "No vocabulary yet. Finish a speaking test to save useful words.",
    "vocab.know": "I know",
    "vocab.dont": "Don't know",
    "vocab.done": "Great work! No cards left for today.",
    "vocab.meaning": "Meaning",
    "vocab.example": "Example",
    "vocab.synonyms": "Synonyms",
    "vocab.tip": "IELTS tip",
    "vocab.flip": "Tap to flip",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.target": "Target band",
    "settings.save": "Save",
    "settings.saved": "Saved",
    "common.loading": "Loading…",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.start": "Start",
    "common.error": "Something went wrong",
  },
  vi: {
    "app.name": "IELTS Speaking AI",
    "app.tagline": "Luyện tập. Học từ. Đạt Band 7+",
    "nav.home": "Trang chủ",
    "nav.speaking": "Nói",
    "nav.vocab": "Từ vựng",
    "nav.history": "Lịch sử",
    "nav.settings": "Cài đặt",
    "auth.signin": "Đăng nhập",
    "auth.signup": "Đăng ký",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.name": "Tên",
    "auth.google": "Tiếp tục với Google",
    "auth.or": "hoặc",
    "auth.have_account": "Đã có tài khoản?",
    "auth.no_account": "Chưa có tài khoản?",
    "auth.logout": "Đăng xuất",
    "dash.hi": "Xin chào",
    "dash.start": "Bắt đầu luyện nói",
    "dash.practice": "Chế độ luyện tập",
    "dash.history": "Lịch sử",
    "dash.avg_band": "Band trung bình",
    "dash.target_band": "Band mục tiêu",
    "dash.upgrade": "Nâng cấp Premium",
    "dash.upgrade_price": "$7.99 / tháng",
    "dash.recent": "Bài gần đây",
    "dash.no_sessions": "Chưa có bài nào. Hãy bắt đầu bài đầu tiên!",
    "speaking.intro": "Giới thiệu",
    "speaking.part1": "Phần 1",
    "speaking.part2": "Phần 2",
    "speaking.part3": "Phần 3",
    "speaking.done": "Kết thúc & Chấm",
    "speaking.mic": "Nhấn để nói",
    "speaking.listening": "Đang nghe…",
    "speaking.send": "Gửi",
    "speaking.type": "Nhập câu trả lời…",
    "speaking.scoring": "Đang chấm điểm…",
    "speaking.overall": "Band tổng",
    "speaking.fluency": "Lưu loát",
    "speaking.vocabulary": "Từ vựng",
    "speaking.grammar": "Ngữ pháp",
    "speaking.pronunciation": "Phát âm",
    "speaking.mistakes": "Lỗi & Chỉnh sửa",
    "speaking.better_vocab": "Từ vựng tốt hơn",
    "speaking.plan": "Kế hoạch cải thiện",
    "speaking.saved_vocab": "Đã lưu {n} từ mới vào từ vựng",
    "speaking.pick_topic": "Chọn chủ đề để bắt đầu",
    "speaking.random": "Chủ đề ngẫu nhiên",
    "speaking.limit": "Đã đạt giới hạn hôm nay (2/2). Nâng cấp Premium để không giới hạn.",
    "speaking.xp_earned": "+{n} XP nhờ dùng từ vựng mới!",
    "speaking.used_words": "Từ bạn đã dùng lại: {words}",
    "dash.xp": "Điểm XP",
    "dash.streak": "Chuỗi ngày",
    "dash.trend": "Xu hướng band",
    "dash.no_trend": "Hoàn thành vài bài để xem tiến bộ.",
    "dash.daily_left": "Còn {n}/2 bài miễn phí hôm nay",
    "dash.daily_unlimited": "Không giới hạn (Premium)",
    "history.title": "Lịch sử",
    "history.empty": "Chưa có bài nào.",
    "history.detail": "Chi tiết bài thi",
    "history.back": "Quay lại lịch sử",
    "vocab.title": "Từ vựng của tôi",
    "vocab.filter_all": "Tất cả",
    "vocab.filter_due": "Hôm nay",
    "vocab.flashcards": "Flashcards",
    "vocab.empty": "Chưa có từ nào. Hoàn thành bài nói để lưu từ hữu ích.",
    "vocab.know": "Đã thuộc",
    "vocab.dont": "Chưa thuộc",
    "vocab.done": "Tuyệt vời! Hết thẻ cho hôm nay.",
    "vocab.meaning": "Nghĩa",
    "vocab.example": "Ví dụ",
    "vocab.synonyms": "Từ đồng nghĩa",
    "vocab.tip": "Mẹo IELTS",
    "vocab.flip": "Nhấn để lật",
    "settings.title": "Cài đặt",
    "settings.language": "Ngôn ngữ",
    "settings.theme": "Giao diện",
    "settings.light": "Sáng",
    "settings.dark": "Tối",
    "settings.target": "Band mục tiêu",
    "settings.save": "Lưu",
    "settings.saved": "Đã lưu",
    "common.loading": "Đang tải…",
    "common.back": "Quay lại",
    "common.cancel": "Hủy",
    "common.start": "Bắt đầu",
    "common.error": "Đã có lỗi xảy ra",
  },
} as const;

type Key = keyof typeof dict["en"];

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "en" || stored === "vi") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: Key, vars?: Record<string, string | number>) => {
    let s = (dict[lang] as Record<string, string>)[k] ?? (dict.en as Record<string, string>)[k] ?? k;
    if (vars) for (const [kk, vv] of Object.entries(vars)) s = s.replace(`{${kk}}`, String(vv));
    return s;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}
