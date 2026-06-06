(function(){
  'use strict';

  const html = document.documentElement;
  const body = document.body;

  // Theme
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){html.setAttribute('data-theme',savedTheme)}
  if(themeToggle){
    themeToggle.addEventListener('click',function(){
      const cur = html.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme',next);
      localStorage.setItem('theme',next);
    });
  }

  // Language
  const langToggle = document.getElementById('langToggle');
  const nameEl = document.getElementById('name');
  const phoneEl = document.getElementById('phone');
  const emailEl = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const messageEl = document.getElementById('message');
  function setPlaceholders(){
    if(body.classList.contains('show-en')){
      if(nameEl)nameEl.placeholder='Your Full Name';
      if(phoneEl)phoneEl.placeholder='Your Phone Number';
      if(emailEl)emailEl.placeholder='Your Email Address';
      if(messageEl)messageEl.placeholder='Enter your message...';
    } else if(body.classList.contains('show-ar')){
      if(nameEl)nameEl.placeholder='اسمك الكامل';
      if(phoneEl)phoneEl.placeholder='رقم هاتفك';
      if(emailEl)emailEl.placeholder='بريدك الإلكتروني';
      if(messageEl)messageEl.placeholder='أكتب رسالتك...';
    } else {
      if(nameEl)nameEl.placeholder='Adınız Soyadınız';
      if(phoneEl)phoneEl.placeholder='Telefon numaranız';
      if(emailEl)emailEl.placeholder='E-posta adresiniz';
      if(messageEl)messageEl.placeholder='Mesajınızı yazınız...';
    }
  }
  function setSubjectOptions(){
    if(!subjectEl)return;
    var lang = body.classList.contains('show-en')?'en':body.classList.contains('show-ar')?'ar':'tr';
    Array.from(subjectEl.options).forEach(function(opt){
      if(opt.getAttribute('data-'+lang)){opt.textContent=opt.getAttribute('data-'+lang)}
    });
  }
  const savedLang = localStorage.getItem('lang');
  if(savedLang === 'en'){body.classList.add('show-en')}
  if(savedLang === 'ar'){body.classList.add('show-ar');document.documentElement.setAttribute('dir','rtl')}
  setPlaceholders();setSubjectOptions();
  if(langToggle){
    langToggle.addEventListener('click',function(){
      if(body.classList.contains('show-en')){
        body.classList.remove('show-en');
        body.classList.add('show-ar');
        document.documentElement.setAttribute('dir','rtl');
        localStorage.setItem('lang','ar');
        langToggle.textContent = 'AR / TR / EN';
      } else if(body.classList.contains('show-ar')){
        body.classList.remove('show-ar');
        document.documentElement.setAttribute('dir','ltr');
        localStorage.setItem('lang','tr');
        langToggle.textContent = 'TR / EN / AR';
      } else {
        body.classList.add('show-en');
        localStorage.setItem('lang','en');
        langToggle.textContent = 'EN / AR / TR';
      }
  setPlaceholders();setSubjectOptions();
    });
  }
  // Update toggle button text on load
  if(savedLang === 'en'){langToggle.textContent = 'EN / AR / TR'}
  else if(savedLang === 'ar'){langToggle.textContent = 'AR / TR / EN'}

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if(menuBtn && navLinks){
    menuBtn.addEventListener('click',function(){
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',open);
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      });
    });
    document.addEventListener('click',function(e){
      if(!e.target.closest('nav') && navLinks.classList.contains('open')){
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      }
    });
  }

  // Scroll animations
  const observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.fade-up,.fade-in').forEach(function(el){
    observer.observe(el);
  });

  // Form - validation & mail client
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const phoneInput = document.getElementById('phone');
  if(phoneInput){
    phoneInput.addEventListener('input',function(){
      this.value = this.value.replace(/[^0-9]/g,'');
    });
  }
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      const isEn = body.classList.contains('show-en');
      const isAr = body.classList.contains('show-ar');
      function t(tr,en,ar){return isAr ? ar : (isEn ? en : tr)}
      var errors = [];
      if(!name){errors.push(t('Ad Soyad gereklidir.','Full name is required.','الاسم الكامل مطلوب'))}
      if(!email){errors.push(t('E-posta gereklidir.','Email is required.','البريد الإلكتروني مطلوب'))}
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){errors.push(t('Geçerli bir e-posta adresi giriniz (ornek@domain.com).','Please enter a valid email address (e.g. name@domain.com).','يرجى إدخال بريد إلكتروني صحيح (مثال@domain.com)'))}
      if(phone && !/^[0-9]{10,11}$/.test(phone)){errors.push(t('Geçerli bir telefon numarası giriniz (sadece rakam, 10-11 hane).','Please enter a valid phone number (digits only, 10-11 digits).','يرجى إدخال رقم هاتف صحيح (أرقام فقط، 10-11 خانة)'))}
      if(!phone){errors.push(t('Telefon numarası gereklidir.','Phone number is required.','رقم الهاتف مطلوب'))}
      if(!subject){errors.push(t('Lütfen bir konu seçiniz.','Please select a subject.','يرجى اختيار موضوع'))}
      if(!message){errors.push(t('Mesaj gereklidir.','Message is required.','الرسالة مطلوبة'))}
      if(errors.length > 0){
        formStatus.className = 'form-status error';
        formStatus.innerHTML = errors.join('<br>');
        formStatus.style.display = 'block';
        return;
      }
      formStatus.style.display = 'none';
      const mailtoSubject = encodeURIComponent('[' + subject + '] ' + name + ' - Web Sitesi İletişim');
      const mailtoBody = encodeURIComponent(
        'Ad Soyad / Name: ' + name + '\n' +
        'E-Posta / Email: ' + email + '\n' +
        'Telefon / Phone: ' + phone + '\n' +
        'Konu / Subject: ' + subject + '\n\n' +
        'Mesaj / Message:\n' + message
      );
      window.location.href = 'mailto:av.lutficancetin@gmail.com?subject=' + mailtoSubject + '&body=' + mailtoBody;
      formStatus.className = 'form-status success';
      formStatus.textContent = t('E-posta istemciniz açıldı. Göndermek için e-postayı iletin.','Your email client has been opened. Please send the email to complete.','تم فتح بريدك الإلكتروني. يرجى إرسال البريد لإكمال الإجراء');
      formStatus.style.display = 'block';
      submitBtn.disabled = true;
      setTimeout(function(){
        submitBtn.disabled = false;
        form.reset();
        formStatus.style.display = 'none';
      }, 5000);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
})();
