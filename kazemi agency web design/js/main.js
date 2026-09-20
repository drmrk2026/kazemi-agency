// ---------- mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ---------- scroll reveal (used sparingly, once per page) ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  // ---------- footer year ----------
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  initChatbot();
});

// =========================================================================
// AI chat widget (client-side FAQ assistant — wire to a real model via your
// own backend proxy; see comment near KB below).
// =========================================================================
function initChatbot(){
  const toggleBtn = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  if (!toggleBtn || !panel) return;
  const body = panel.querySelector('.chat-body');
  const input = panel.querySelector('input');
  const sendBtn = panel.querySelector('.chat-input-row button');
  const closeBtn = panel.querySelector('.chat-head button');

  toggleBtn.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  const KB = [
    { k: ['price','pricing','cost','how much'], a: "Website packages start at $100 (Starter), $200 (Business) and $300 (Premium). The yearly SEO & content package is $1,200/year. Full breakdown is on the Shop page." },
    { k: ['payment','pay','crypto','bitcoin','usdt'], a: "We accept payment in crypto only — USDT, BTC and ETH. You'll get a wallet address and QR code at checkout on the product page." },
    { k: ['seo','content'], a: "The SEO & Content package ($1,200/year) covers keyword-targeted articles, on-page SEO and monthly reporting, published on your site every month." },
    { k: ['login','sign up','account','register'], a: "You can sign in with Google, GitHub or Apple ID from the Login page — no separate password to remember." },
    { k: ['portfolio','work','example'], a: "Take a look at the Portfolio page for recent corporate site builds." },
    { k: ['contact','talk','human','support'], a: "Tell me what you need here, or start an order from the Shop page and we'll follow up from your dashboard." },
    { k: ['time','how long','delivery'], a: "Starter sites ship in about 5 business days, Business in 8, and Premium in 12–14, depending on content readiness." },
  ];
  function reply(text){
    const t = text.toLowerCase();
    const hit = KB.find(row => row.k.some(kw => t.includes(kw)));
    return hit ? hit.a : "I can help with pricing, packages, payment and login questions. Try asking about one of those, or browse the Shop page for full package details.";
  }
  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function handleSend(){
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    input.value = '';
    setTimeout(() => addMsg(reply(val), 'bot'), 350);
  }
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
  panel.querySelectorAll('.chat-suggest button').forEach(b => {
    b.addEventListener('click', () => { input.value = b.textContent; handleSend(); });
  });
}
