const $ = id => document.getElementById(id);
const users   = ()  => JSON.parse(localStorage.getItem('users') || '[]');
const save    = u   => localStorage.setItem('users', JSON.stringify(u));
const emailOk = e   => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Trocar aba
function go(tab) {
  ['login', 'reg'].forEach(t => {
    $('s-' + t).classList.toggle('on', t === tab);
    document.querySelectorAll('.tab')[t === 'login' ? 0 : 1].classList.toggle('on', t === tab);
  });
}

// Mostrar erro no campo
function err(id, msg) {
  $(id).classList.add('err');
  $('e-' + id).textContent = msg;
  $('e-' + id).classList.add('on');
  return false;
}

// Limpar erro do campo
function clear(id) {
  $(id).classList.remove('err', 'ok');
  $('e-' + id).classList.remove('on');
}

// Notificação flutuante
function toast(msg, type) {
  const t = $('toast');
  t.textContent = (type === 'ok' ? '✅ ' : '❌ ') + msg;
  t.className = 'on ' + type;
  setTimeout(() => t.className = '', 3000);
}

// Força da senha
function strength() {
  const v    = $('r-pass').value;
  const wrap = $('bar-wrap');
  const fill = $('bar-fill');
  const lbl  = $('bar-label');

  if (!v) { wrap.classList.remove('on'); return; }
  wrap.classList.add('on');

  const score = [v.length >= 6, v.length >= 10, /[A-Z]/.test(v), /\d/.test(v), /\W/.test(v)].filter(Boolean).length;
  const lvl = [
    ['20%',  '#f76', 'Muito fraca'],
    ['40%',  '#fa0', 'Fraca'],
    ['60%',  '#ff0', 'Razoável'],
    ['80%',  '#9d0', 'Boa'],
    ['100%', '#4cb', 'Forte 💪'],
  ][score - 1] || ['0%', '#f76', ''];

  fill.style.cssText  = `width:${lvl[0]}; background:${lvl[1]}`;
  lbl.style.color     = lvl[1];
  lbl.textContent     = lvl[2];
}

// Login
function login() {
  const e = $('l-email').value.trim();
  const p = $('l-pass').value;
  clear('l-email'); clear('l-pass');

  if (!e || !emailOk(e)) return err('l-email', e ? 'E-mail inválido' : 'Informe o e-mail');
  if (!p)                return err('l-pass',  'Informe a senha');

  const u = users().find(u => u.e === e && u.p === p);
  if (!u) { err('l-email', 'E-mail ou senha incorretos'); return err('l-pass', ' '); }

  $('l-email').classList.add('ok');
  $('l-pass').classList.add('ok');
  toast(`Bem-vindo(a), ${u.n}! 🎉`, 'ok');
}

// Cadastro
function register() {
  const n  = $('r-name').value.trim();
  const e  = $('r-email').value.trim();
  const p  = $('r-pass').value;
  const p2 = $('r-pass2').value;
  ['r-name', 'r-email', 'r-pass', 'r-pass2'].forEach(clear);

  if (!n)                return err('r-name',  'Informe seu nome');
  if (!e || !emailOk(e)) return err('r-email', e ? 'E-mail inválido' : 'Informe o e-mail');
  if (p.length < 6)      return err('r-pass',  'Mínimo 6 caracteres');
  if (p !== p2)          return err('r-pass2', 'Senhas não coincidem');

  const list = users();
  if (list.find(u => u.e === e)) return err('r-email', 'E-mail já cadastrado');

  list.push({ n, e, p, at: Date.now() });
  save(list);
  toast('Conta criada com sucesso! 🎉', 'ok');

  ['r-name', 'r-email', 'r-pass', 'r-pass2'].forEach(id => $(id).value = '');
  $('bar-wrap').classList.remove('on');
  setTimeout(() => go('login'), 1200);
}
