// ===========================
// Auto Language Fixer (Final Version)
// ===========================

// English → Arabic keyboard mapping (with upper/lower support)
const englishToArabic = {
  'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ',
  'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'د',
  'a': 'ش', 's': 'س', 'd': 'ي', 'f': 'ب', 'g': 'ل', 'h': 'ا',
  'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ك', "'": 'ط',
  'z': 'ئ', 'x': 'ء', 'c': 'ؤ', 'v': 'ر', 'b': 'لا',
  'n': 'ى', 'm': 'ة', ',': 'و', '.': 'ز', '/': 'ظ',

  // Uppercase (Shift)
  'Q': 'َ', 'W': 'ً', 'E': 'ُ', 'R': 'ٌ', 'T': 'لإ', 'Y': 'إ',
  'U': '‘', 'I': '÷', 'O': '×', 'P': '؛', '{': '<', '}': '>',
  'A': 'ِ', 'S': 'ٍ', 'D': ']', 'F': '[', 'G': 'لأ', 'H': 'أ',
  'J': 'ـ', 'K': '،', 'L': '/', ':': ':', '"': '"',
  'Z': '~', 'X': 'ْ', 'C': '}', 'V': 'َ', 'B': 'لآ', 'N': 'آ', 'M': '’',
  '<': ',', '>': '.', '?': '؟'
};

// Build Arabic → English mapping automatically
const arabicToEnglish = Object.fromEntries(
  Object.entries(englishToArabic).map(([en, ar]) => [ar, en])
);

// Detect which language dominates in the text
function detectLanguage(text) {
  const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const englishCount = (text.match(/[A-Za-z]/g) || []).length;
  return arabicCount > englishCount ? 'arabic' : 'english';
}

// Convert each character using the mapping, preserve everything else
function convertText(text, toLang = 'arabic') {
  const map = toLang === 'arabic' ? englishToArabic : arabicToEnglish;
  let result = '';

  for (const ch of text) {
    result += map[ch] || ch;
  }

  return result;
}

// Handle shortcut: Ctrl + Shift + Space
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
    const active = document.activeElement;
    if (!active) return;

    const isEditable =
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'INPUT' ||
      active.isContentEditable;

    if (!isEditable) return;

    if (active.isContentEditable) {
      // Handle contentEditable elements
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString();
      if (!selectedText) return;

      const lang = detectLanguage(selectedText);
      const newText = lang === 'arabic'
        ? convertText(selectedText, 'english')
        : convertText(selectedText, 'arabic');

      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
    } else {
      // Handle input / textarea elements
      const start = active.selectionStart;
      const end = active.selectionEnd;

      if (start === end) return; // nothing selected

      const selectedText = active.value.substring(start, end);
      const lang = detectLanguage(selectedText);
      const newText = lang === 'arabic'
        ? convertText(selectedText, 'english')
        : convertText(selectedText, 'arabic');

      active.value =
        active.value.substring(0, start) + newText + active.value.substring(end);

      // Re-select the converted text
      active.setSelectionRange(start, start + newText.length);
    }

    e.preventDefault();
  }
});
