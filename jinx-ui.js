
/**
 * SuperJinX Core UI & Config Generator
 * Custom build for @Nivexia
 */

(function () {
  'use strict';

  // --- تنظیمات و تعاریف نام کانفیگ‌ها ---
  const CONFIG_NAMES = {
    DIAMOND: "💎 𝗗𝗶𝗮𝗺𝗼𝗻𝗱",
    AMSTERDAM_1: "🇳🇱 𝐀𝐦𝐬𝐭𝐞𝐫𝐝𝐚𝐦",
    NATIONAL: "ویژه نت ملی 📣",
    AMSTERDAM_2: "🇳🇱 𝐀𝐦𝐬𝐭𝐞𝐫𝐝𝐚𝐦 𝟐",
    NOTICE: "● ‼️ اگر قطع شدی، لینکت رو آپدیت کن ‼️"
  };

  // دریافت هاست و دامنه فعال
  function getHost() {
    return window.location.hostname || window.location.host || 'localhost';
  }

  // تولید UUID استاندارد v4
  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // تولید آرایه ۵ کانفیگ اختصاصی
  function buildVlessConfigs(uuid, customHost) {
    const host = customHost || getHost();
    const wsPath = encodeURIComponent(`/stream/${uuid}?ed=2560`);

    return [
      // ۱. کانفیگ دایموند
      `vless://${uuid}@${host}:443?encryption=none&security=tls&type=ws&host=${host}&path=${wsPath}&fp=chrome&sni=${host}#${encodeURIComponent(CONFIG_NAMES.DIAMOND)}`,

      // ۲. کانفیگ آمستردام ۱
      `vless://${uuid}@${host}:443?encryption=none&security=tls&type=ws&host=${host}&path=${wsPath}&fp=firefox&sni=${host}#${encodeURIComponent(CONFIG_NAMES.AMSTERDAM_1)}`,

      // ۳. ویژه نت ملی
      `vless://${uuid}@${host}:443?encryption=none&security=tls&type=ws&host=${host}&path=${wsPath}&alpn=http%2F1.1&fp=safari&sni=${host}#${encodeURIComponent(CONFIG_NAMES.NATIONAL)}`,

      // ۴. کانفیگ آمستردام ۲
      `vless://${uuid}@${host}:443?encryption=none&security=tls&type=ws&host=${host}&path=${wsPath}&fp=chrome&alpn=h2,http%2F1.1&sni=${host}#${encodeURIComponent(CONFIG_NAMES.AMSTERDAM_2)}`,

      // ۵. کانفیگ هشدار آپدیت سابسکریپشن (دامی / غیرقابل اتصال برای ویتوری)
      `vless://00000000-0000-0000-0000-000000000000@127.0.0.1:1080?encryption=none&security=none&type=tcp#${encodeURIComponent(CONFIG_NAMES.NOTICE)}`
    ];
  }

  // اعلان کپی شدن متن در حافظه
  function showToast(message) {
    let toast = document.getElementById('jinx-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jinx-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(16, 185, 129, 0.95);
        color: #fff;
        padding: 10px 22px;
        border-radius: 30px;
        font-size: 0.88rem;
        font-family: inherit;
        z-index: 99999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2000);
  }

  // کپی متن به کلیپ‌بورد
  function copyToClipboard(text, successMsg = 'کپی شد!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast(successMsg));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        showToast(successMsg);
      } catch (err) {
        showToast('خطا در کپی');
      }
      document.body.removeChild(textarea);
    }
  }

  // ساخت و نمایش پنجره پاپ‌آپ (Modal) نمایش کانفیگ‌ها
  function showConfigsModal(uuid, username) {
    const host = getHost();
    const configs = buildVlessConfigs(uuid, host);
    const subUrl = `${window.location.protocol}//${host}/sub.html?token=${uuid}`;

    let modal = document.getElementById('jinx-custom-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'jinx-custom-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.75);
        display: flex; justify-content: center; align-items: center;
        z-index: 9999; padding: 15px; direction: rtl;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 20px; color: #f9fafb;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 16px;">
          <h3 style="font-size: 1.05rem; margin: 0; color: #38bdf8;">کانفیگ‌های کاربر: ${username || 'VIP'}</h3>
          <button id="jinx-close-modal" style="background: transparent; border: none; color: #9ca3af; font-size: 1.4rem; cursor: pointer;">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          <button id="jinx-btn-copy-all" style="background: #4f46e5; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: bold; cursor: pointer;">
            📋 کپی یکجای تمام کانفیگ‌ها
          </button>
          <button id="jinx-btn-copy-sub" style="background: rgba(255,255,255,0.06); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 10px; border-radius: 10px; font-weight: bold; cursor: pointer;">
            🔗 کپی لینک سابسکریپشن
          </button>
        </div>

        <div style="font-size: 0.8rem; color: #9ca3af; margin-bottom: 8px;">کانفیگ‌های اختصاصی:</div>
        <div style="display: flex; flex-direction: column; gap: 8px;" id="jinx-configs-list">
          ${configs.map((cfg, idx) => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem;">${decodeURIComponent(cfg.split('#')[1])}</span>
              <button class="jinx-copy-single" data-cfg="${cfg}" style="background: #1f2937; border: 1px solid #374151; color: #e5e7eb; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.78rem;">کپی</button>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 16px; font-size: 0.78rem; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
          Powered by <a href="https://t.me/Nivexia" target="_blank" style="color: #38bdf8; text-decoration: none;">@Nivexia</a>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    // رویداد دکمه‌های داخل مدال
    document.getElementById('jinx-close-modal').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('jinx-btn-copy-all').onclick = () => { copyToClipboard(configs.join('\n'), 'همه کانفیگ‌ها کپی شدند!'); };
    document.getElementById('jinx-btn-copy-sub').onclick = () => { copyToClipboard(subUrl, 'لینک سابسکریپشن کپی شد!'); };

    modal.querySelectorAll('.jinx-copy-single').forEach(btn => {
      btn.onclick = () => { copyToClipboard(btn.getAttribute('data-cfg'), 'کانفیگ کپی شد!'); };
    });
  }

  // مقداردهی و اتصال به فرم‌ها و دکمه‌های پنل
  document.addEventListener('DOMContentLoaded', () => {
    // هوک کردن دکمه‌های ساخت کاربر یا مشاهده کانفیگ موجود
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a');
      if (!target) return;

      // اگر دکمه مربوط به دریافت کانفیگ یا کیوآرکد بود
      if (target.innerText.includes('کانفیگ') || target.innerText.includes('QR') || target.classList.contains('get-config') || target.id === 'create-btn') {
        const row = target.closest('tr') || target.closest('.user-card');
        let uuid = target.getAttribute('data-uuid');
        let username = 'کاربر VIP';

        if (row) {
          const uuidElem = row.querySelector('.uuid, [data-uuid]');
          if (uuidElem) uuid = uuidElem.getAttribute('data-uuid') || uuidElem.innerText.trim();
          const nameElem = row.querySelector('.username, .name');
          if (nameElem) username = nameElem.innerText.trim();
        }

        if (!uuid) {
          const inputUuid = document.querySelector('input[name="uuid"], #user-uuid');
          uuid = inputUuid ? inputUuid.value.trim() : generateUUID();
        }

        const inputUser = document.querySelector('input[name="username"], #user-name');
        if (inputUser && inputUser.value.trim()) username = inputUser.value.trim();

        // باز کردن مدال کانفیگ‌های جدید
        showConfigsModal(uuid, username);
      }
    });
  });

  // اکسپورت توابع به پنجره سراسری جهت سازگاری کامل
  window.generateVless = buildVlessConfigs;
  window.showCustomModal = showConfigsModal;
  window.copyText = copyToClipboard;
})();
