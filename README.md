# شركة سودي العالمية للاستثمار | SUDI Global

موقع الشركة الرسمي على GitHub Pages - تم تحديثه وتطويره باستخدام Bootstrap 5 مع دعم كامل للغة العربية (RTL).

## 📋 نظرة عامة

هذا هو الموقع الإلكتروني الرسمي لشركة سودي العالمية للاستثمار، شركة سودانية متخصصة في:
- الطاقة الشمسية والطاقة المتجددة
- التجارة الدولية (استيراد وتصدير)
- الاستشارات المالية والمحاسبية
- الحلول الرقمية وتطوير البرمجيات
- التسويق الرقمي والعلاقات العامة
- تطوير وهندسة الشركات

## 🚀 التغييرات الحديثة

تم تحديث الموقع بالكامل في يناير 2024 ليشمل:

### التحديثات التقنية
- ✅ استخدام **Bootstrap 5.3.2** مع دعم RTL الأصلي
- ✅ تصميم متجاوب بالكامل (Mobile-First)
- ✅ دعم كامل للغة العربية واتجاه RTL
- ✅ تحسينات في إمكانية الوصول (Accessibility)
- ✅ استخدام عناصر HTML5 الدلالية (Semantic HTML)
- ✅ تحسين SEO مع Meta Tags كاملة

### المحتوى المضاف
- 📄 **index.html**: الصفحة الرئيسية المحدثة بالكامل
- 📄 **projects.html**: صفحة عرض المشاريع بتصميم جديد
- 🎨 **css/style.css**: ملف CSS مخصص مع متغيرات الألوان ودعم RTL
- 📝 **README.md**: هذا الملف (وثائق المشروع)

### الميزات الجديدة
1. **رأس الصفحة (Header)**:
   - شعار الشركة
   - قائمة تنقل واضحة
   - متجاوب على جميع الشاشات

2. **قسم البطل (Hero Section)**:
   - عنوان رئيسي وفرعي
   - دعوة لاتخاذ إجراء (CTA)
   - إحصائيات الشركة

3. **قسم الخدمات**:
   - 6 بطاقات للخدمات الرئيسية
   - تصميم موحد وجذاب
   - أيقونات Bootstrap Icons

4. **قسم المشاريع**:
   - عرض شبكي للمشاريع
   - صور مع نص بديل
   - روابط لصفحة المشاريع الكاملة

5. **قسم التواصل**:
   - نموذج اتصال تفاعلي
   - معلومات التواصل
   - روابط وسائل التواصل الاجتماعي
   - تعليمات تكامل الـ Backend

6. **تذييل الصفحة (Footer)**:
   - معلومات حقوق النشر
   - روابط التنقل السريع

7. **زر واتساب عائم**:
   - زر ثابت للتواصل السريع
   - متوافق مع RTL

## 🖥️ معاينة الموقع محلياً

### الطريقة 1: Live Server (موصى بها)
إذا كنت تستخدم Visual Studio Code:

```bash
# 1. افتح المشروع في VS Code
# 2. ثبت إضافة Live Server
# 3. انقر بزر الماوس الأيمن على index.html
# 4. اختر "Open with Live Server"
```

### الطريقة 2: Python HTTP Server
```bash
# انتقل إلى مجلد المشروع
cd /path/to/sudicorp.github.io

# Python 3
python -m http.server 8000

# افتح المتصفح على: http://localhost:8000
```

### الطريقة 3: Node.js HTTP Server
```bash
# ثبت http-server عالمياً
npm install -g http-server

# شغل السيرفر
http-server -p 8000

# افتح المتصفح على: http://localhost:8000
```

### الطريقة 4: GitHub Pages
الموقع منشور مباشرة على:
- **الرابط الأساسي**: https://sudicorp.com
- **رابط GitHub Pages**: https://sudi-global.github.io/sudicorp.github.io/

## 🔗 ربط نموذج الاتصال بالـ Backend

### نظرة عامة
يحتوي نموذج الاتصال حالياً على تكامل مع واتساب لتسهيل التواصل الفوري. لربطه بـ backend مخصص:

### الخطوة 1: إعداد الـ Backend
في مستودع `SUDI-global/sudi-backend`، أضف endpoint للتعامل مع نموذج الاتصال:

```javascript
// مثال: Express.js endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, service, message } = req.body;
    
    // التحقق من صحة البيانات
    if (!name || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }
    
    // حفظ في قاعدة البيانات
    await ContactForm.create({
      name,
      phone,
      service,
      message,
      createdAt: new Date()
    });
    
    // إرسال إشعار بريد إلكتروني (اختياري)
    // await sendEmailNotification({ name, phone, service, message });
    
    res.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});
```

### الخطوة 2: تحديث الـ Frontend
في ملف `index.html`، قم بتحديث JavaScript الخاص بالنموذج:

```javascript
// ابحث عن form submission handler في نهاية index.html
// واستبدله بالكود التالي:

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  event.stopPropagation();
  
  if (form.checkValidity()) {
    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };
    
    try {
      const response = await fetch('https://api.sudicorp.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        document.getElementById('formFeedback').innerHTML = 
          '<div class="alert alert-success">تم إرسال رسالتك بنجاح!</div>';
        form.reset();
      } else {
        document.getElementById('formFeedback').innerHTML = 
          '<div class="alert alert-danger">' + result.message + '</div>';
      }
    } catch (error) {
      document.getElementById('formFeedback').innerHTML = 
        '<div class="alert alert-danger">حدث خطأ في الإرسال</div>';
    }
  }
  
  form.classList.add('was-validated');
});
```

### الخطوة 3: تفعيل CORS
تأكد من تفعيل CORS في الـ backend:

```javascript
// مثال: Express.js CORS setup
const cors = require('cors');

app.use(cors({
  origin: ['https://sudicorp.com', 'https://sudi-global.github.io'],
  methods: ['POST'],
  credentials: true
}));
```

### الخطوة 4: أمان إضافي
```javascript
// 1. استخدام CSRF Protection
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// 2. Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5 // 5 طلبات كحد أقصى
});
app.use('/api/contact', limiter);

// 3. Input Validation
const { body, validationResult } = require('express-validator');
app.post('/api/contact', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('phone').matches(/^\+?[0-9\s\-()]+$/),
  body('message').trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  // ... handler code
});
```

### خيار بديل: استخدام Formspree
إذا كنت تفضل حل جاهز:

1. سجل في https://formspree.io
2. أنشئ نموذج جديد
3. احصل على Form ID
4. حدث form action في index.html:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## 📁 هيكل الملفات

```
sudicorp.github.io/
├── index.html              # الصفحة الرئيسية (Bootstrap 5)
├── projects.html           # صفحة المشاريع (Bootstrap 5)
├── css/
│   ├── style.css          # ملف CSS المخصص الجديد
│   └── styles.css         # ملف CSS القديم (محفوظ)
├── js/
│   └── main.js            # ملفات JavaScript القديمة
├── assets/
│   ├── logo.png           # شعار الشركة
│   └── project*.jpg       # صور المشاريع
├── CNAME                  # إعدادات النطاق المخصص
├── robots.txt             # إعدادات محركات البحث
├── sitemap.xml            # خريطة الموقع
├── favicon.ico            # أيقونة الموقع
├── README.md              # هذا الملف
├── index-old.html         # نسخة احتياطية من الصفحة القديمة
└── projects-old.html      # نسخة احتياطية من صفحة المشاريع القديمة
```

## 🎨 الألوان والتصميم

### ألوان العلامة التجارية
```css
--bs-primary: #0b2d4d      /* الأزرق الداكن */
--bs-secondary: #c9a24a    /* الذهبي */
--primary-dark: #08243d    /* أزرق داكن جداً */
--accent-gold: #c9a24a     /* ذهبي فاتح */
```

### الخطوط
- **الخط الأساسي**: Cairo (Google Fonts)
- **الخط الثانوي**: Tajawal (Google Fonts)

## ♿ إمكانية الوصول

- ✅ استخدام عناصر HTML5 الدلالية
- ✅ نص بديل (alt) لجميع الصور
- ✅ ARIA labels للعناصر التفاعلية
- ✅ دعم التنقل بلوحة المفاتيح
- ✅ تباين ألوان مناسب
- ✅ روابط تخطي للمحتوى الرئيسي

## 📱 الاستجابة

الموقع متجاوب بالكامل ويعمل على:
- 📱 الهواتف المحمولة (320px+)
- 📱 الأجهزة اللوحية (768px+)
- 💻 الحواسيب المحمولة (992px+)
- 🖥️ الشاشات الكبيرة (1200px+)

## 🔮 تحسينات مستقبلية

### المرحلة التالية
1. **التحليلات والقياسات**:
   - إضافة Google Analytics
   - إضافة Facebook Pixel
   - تتبع أحداث النماذج

2. **تحسين الأداء**:
   - ضغط الصور وتحسينها
   - استخدام WebP للصور
   - تفعيل Lazy Loading للصور
   - تصغير ملفات CSS و JavaScript

3. **تعدد اللغات (i18n)**:
   - إضافة نسخة إنجليزية
   - إضافة مبدل اللغة
   - استخدام i18next أو مكتبة مشابهة

4. **ميزات إضافية**:
   - نظام إدارة محتوى (CMS)
   - مدونة تقنية
   - منطقة عملاء
   - دردشة مباشرة

5. **تحسينات تقنية**:
   - Service Worker للعمل بدون اتصال
   - Progressive Web App (PWA)
   - تحسين Core Web Vitals
   - إضافة Sitemap ديناميكي

## 🤝 المساهمة

لتحديث أو تحسين الموقع:

```bash
# 1. استنسخ المستودع
git clone https://github.com/SUDI-global/sudicorp.github.io.git

# 2. أنشئ فرع جديد
git checkout -b feature/your-feature-name

# 3. قم بالتعديلات المطلوبة

# 4. أرسل التغييرات
git add .
git commit -m "وصف التغييرات"
git push origin feature/your-feature-name

# 5. افتح Pull Request
```

## 📞 التواصل

- 🌐 **الموقع**: https://sudicorp.com
- 📧 **البريد**: sudi@sudicorp.com
- 📱 **الهاتف**: +249 12 576 9999
- 💬 **واتساب**: https://wa.me/249125769999

### وسائل التواصل الاجتماعي
- Facebook: https://facebook.com/sudifoods
- Instagram: https://instagram.com/sudifoods
- Twitter: https://twitter.com/sudicorp
- LinkedIn: https://linkedin.com/company/sudicorp
- YouTube: https://youtube.com/@sudicorp
- GitHub: https://github.com/sudicorp

## 📄 الترخيص

© 2024 شركة سودي العالمية للاستثمار. جميع الحقوق محفوظة.

---

**ملاحظة**: هذا المشروع يستخدم Bootstrap 5.3.2 عبر CDN ولا يحتاج إلى خطوة build. جميع الملفات ثابتة ويمكن نشرها مباشرة على أي خادم ويب أو GitHub Pages.
