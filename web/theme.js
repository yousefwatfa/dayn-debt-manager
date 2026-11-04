(function () {
  try {
    var th = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var lang = localStorage.getItem('lang') || 'ar';
    document.documentElement.dataset.theme = th;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
