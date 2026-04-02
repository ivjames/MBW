import express from 'express';
import { db, nowIso, slugify } from '../db.js';
import { createSession, requireAdmin, validateLogin } from '../adminAuth.js';

export const adminRouter = express.Router();

const ADMIN_COOKIE_NAME = 'dd_admin';
const ADMIN_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

function adminCookieOptions(req) {
  const isSecureRequest = req.secure || req.get('x-forwarded-proto') === 'https';
  const secure = process.env.NODE_ENV === 'production' && isSecureRequest;

  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE_MS,
    secure
  };
}

const esc = (v = '') =>
    String(v)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

function formatJsonText(value = '', fallback = '{}') {
  const source = String(value || fallback || '').trim();
  if (!source) return fallback;

  try {
    return JSON.stringify(JSON.parse(source), null, 2);
  } catch {
    return source;
  }
}

function normalizeAdminPageType(value = '') {
  const type = String(value || '').trim().toLowerCase();
  return type === 'article' ? 'article' : 'service';
}

// ─── DB-backed content page editor ─────────────────────────────────────────

const CONTENT_PAGE_SLUGS = new Set([
  'home',
  'contact',
  'build-from-scratch',
]);

const ARRAY_FIELD_TYPES = new Set([
  'ctas', 'metrics', 'chart-points', 'logos', 'services',
  'cases', 'pillars', 'process', 'timeline', 'methods',
  'nav-items', 'site-links', 'footer-columns'
]);

const REPEATER_SCHEMAS = {
  ctas: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'href', label: 'Href', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'ghost'] },
  ],
  metrics: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' },
    { key: 'trend', label: 'Trend', type: 'text' },
  ],
  'chart-points': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'value', label: 'Value', type: 'number' },
  ],
  logos: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'image', label: 'Image URL', type: 'text' },
    { key: 'href', label: 'Href', type: 'text' },
  ],
  services: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'href', label: 'Href', type: 'text' },
    { key: 'icon', label: 'Icon (FA class)', type: 'text' },
    { key: 'copy', label: 'Copy', type: 'textarea' },
    { key: 'detail', label: 'Detail', type: 'textarea' },
    { key: 'tokens', label: 'Tokens (comma-separated)', type: 'tokens' },
  ],
  cases: [
    { key: 'badge', label: 'Badge', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'image', label: 'Image URL', type: 'text' },
    { key: 'stats', label: 'Stats JSON [{value,label}]', type: 'json' },
  ],
  pillars: [
    { key: 'icon', label: 'Icon (FA class)', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'copy', label: 'Copy', type: 'textarea' },
    { key: 'tokens', label: 'Tokens (comma-separated)', type: 'tokens' },
  ],
  process: [
    { key: 'step', label: 'Step', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'copy', label: 'Copy', type: 'textarea' },
  ],
  timeline: [
    { key: 'step', label: 'Step', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'copy', label: 'Copy', type: 'textarea' },
  ],
  methods: [
    { key: 'icon', label: 'Icon (FA class)', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'copy', label: 'Copy', type: 'text' },
  ],
  'nav-items': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'href', label: 'Href', type: 'text' },
    { key: 'page', label: 'Page Key', type: 'text' },
    { key: 'children', label: 'Children JSON [{label,href,page}]', type: 'json' },
  ],
  'site-links': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'href', label: 'Href', type: 'text' },
    { key: 'page', label: 'Page Key', type: 'text' },
  ],
  'footer-columns': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'links', label: 'Links JSON [{label,href}]', type: 'json' },
  ],
};

const SITE_SETTINGS_SCHEMA = {
  sections: [
    {
      title: 'Company', fields: [
        { path: 'company.name', label: 'Name', type: 'text' },
        { path: 'company.email', label: 'Email', type: 'text' },
        { path: 'company.phone', label: 'Phone', type: 'text' },
        { path: 'company.supportPhone', label: 'Support Phone', type: 'text' },
        { path: 'company.addressLines', label: 'Address Lines', type: 'strings', hint: 'One per line' },
      ]
    },
    {
      title: 'Navigation', fields: [
        { path: 'nav', label: 'Primary Navigation', type: 'nav-items' },
        { path: 'servicePills', label: 'Service Pills', type: 'site-links' },
      ]
    },
    {
      title: 'Footer', fields: [
        { path: 'footer.tagline', label: 'Tagline', type: 'textarea' },
        { path: 'footer.columns', label: 'Footer Columns', type: 'footer-columns' },
      ]
    },
  ]
};

const PAGE_SCHEMAS = {
  home: {
    sections: [
      {
        title: 'Hero', fields: [
          { path: 'hero.eyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'hero.title', label: 'Title', type: 'html', hint: 'Supports inline HTML' },
          { path: 'hero.lead', label: 'Lead', type: 'textarea' },
          { path: 'hero.image', label: 'Hero Image URL', type: 'text' },
          { path: 'hero.quote.text', label: 'Quote Text', type: 'textarea' },
          { path: 'hero.quote.author', label: 'Quote Author', type: 'text' },
          { path: 'hero.ctas', label: 'CTAs', type: 'ctas' },
          { path: 'hero.proof', label: 'Proof Points', type: 'strings', hint: 'One per line' },
          { path: 'hero.metrics', label: 'Metrics', type: 'metrics' },
          { path: 'hero.chart.label', label: 'Chart Label', type: 'text' },
          { path: 'hero.chart.points', label: 'Chart Data Points', type: 'chart-points' },
        ]
      },
      {
        title: 'Services', fields: [
          { path: 'services', label: 'Service Cards', type: 'services' },
        ]
      },
      {
        title: 'Logos', fields: [
          { path: 'logos', label: 'Logo Band', type: 'logos' },
        ]
      },
      {
        title: 'Cases', fields: [
          { path: 'cases', label: 'Case Studies', type: 'cases' },
        ]
      },
      {
        title: 'System', fields: [
          { path: 'system.title', label: 'Title', type: 'text' },
          { path: 'system.lead', label: 'Lead', type: 'textarea' },
          { path: 'system.pillars', label: 'Pillars', type: 'pillars' },
          { path: 'system.process', label: 'Process Steps', type: 'process' },
        ]
      },
      {
        title: 'Testimonial', fields: [
          { path: 'testimonial.quote', label: 'Quote', type: 'textarea' },
          { path: 'testimonial.author', label: 'Author', type: 'text' },
        ]
      },
      {
        title: 'Build Story', fields: [
          { path: 'buildStory.eyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'buildStory.title', label: 'Title', type: 'text' },
          { path: 'buildStory.lead', label: 'Lead', type: 'textarea' },
          { path: 'buildStory.panelEyebrow', label: 'Panel Eyebrow', type: 'text' },
          { path: 'buildStory.panelTitle', label: 'Panel Title', type: 'text' },
          { path: 'buildStory.panelBody', label: 'Panel Body', type: 'textarea' },
          { path: 'buildStory.linkLabel', label: 'Link Label', type: 'text' },
          { path: 'buildStory.linkHref', label: 'Link Href', type: 'text' },
        ]
      },
      {
        title: 'CTA', fields: [
          { path: 'cta.title', label: 'Title', type: 'text' },
          { path: 'cta.body', label: 'Body', type: 'textarea' },
          { path: 'cta.actions', label: 'Actions', type: 'ctas' },
        ]
      },
    ]
  },

  contact: {
    sections: [
      {
        title: 'Hero', fields: [
          { path: 'hero.eyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'hero.title', label: 'Title', type: 'text' },
          { path: 'hero.lead', label: 'Lead', type: 'textarea' },
        ]
      },
      {
        title: 'Contact Methods', fields: [
          { path: 'methods', label: 'Methods', type: 'methods' },
        ]
      },
      {
        title: 'Image', fields: [
          { path: 'image', label: 'Image URL', type: 'text' },
        ]
      },
    ]
  },

  'build-from-scratch': {
    sections: [
      {
        title: 'Hero', fields: [
          { path: 'hero.eyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'hero.title', label: 'Title', type: 'text' },
          { path: 'hero.lead', label: 'Lead', type: 'textarea' },
          { path: 'hero.image', label: 'Image URL', type: 'text' },
          { path: 'hero.meta', label: 'Meta Points', type: 'strings', hint: 'One per line' },
          { path: 'hero.actions', label: 'Actions', type: 'ctas' },
        ]
      },
      {
        title: 'Reasons Section', fields: [
          { path: 'reasonsEyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'reasonsTitle', label: 'Title', type: 'text' },
          { path: 'reasonsLead', label: 'Lead', type: 'textarea' },
          { path: 'reasons', label: 'Reasons', type: 'pillars' },
        ]
      },
      {
        title: 'Timeline Section', fields: [
          { path: 'timelineEyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'timelineTitle', label: 'Title', type: 'text' },
          { path: 'timelineLead', label: 'Lead', type: 'textarea' },
          { path: 'timeline', label: 'Steps', type: 'timeline' },
        ]
      },
      {
        title: 'CTA', fields: [
          { path: 'cta.eyebrow', label: 'Eyebrow', type: 'text' },
          { path: 'cta.title', label: 'Title', type: 'text' },
          { path: 'cta.body', label: 'Body', type: 'textarea' },
          { path: 'cta.actions', label: 'Actions', type: 'ctas' },
        ]
      },
    ]
  },
};

function getPath(obj, dotPath) {
  return dotPath.split('.').reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
}

function setPath(obj, dotPath, value) {
  const keys = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function titleFromContentPage(slug, data) {
  if (slug === 'home') return 'Home';
  const heroTitle = String(data?.hero?.title || '').trim();
  if (heroTitle) return heroTitle.replace(/<[^>]+>/g, '').trim();
  return String(slug || '')
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function upsertContentPageMirrorRow(slug, data) {
  const now = nowIso();
  const title = titleFromContentPage(slug, data);
  const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);

  if (existing) {
    db.prepare(`
      UPDATE pages
      SET title = ?, updated_at = ?
      WHERE id = ?
    `).run(title, now, existing.id);
    return;
  }

  db.prepare(`
    INSERT INTO pages (slug, title, page_type, status, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug,
    title,
    'standard',
    'published',
    title,
    '',
    now,
    now
  );
}

function loadContentPagePayload(slug) {
  const row = db.prepare('SELECT payload_json FROM content_pages WHERE slug = ?').get(slug);
  if (!row) return {};
  try {
    const parsed = JSON.parse(row.payload_json || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveContentPagePayload(slug, data) {
  const now = nowIso();
  const payload = JSON.stringify(data || {}, null, 4);
  const existing = db.prepare('SELECT id FROM content_pages WHERE slug = ?').get(slug);

  if (existing) {
    db.prepare('UPDATE content_pages SET payload_json = ?, updated_at = ? WHERE id = ?')
      .run(payload, now, existing.id);
    return;
  }

  db.prepare('INSERT INTO content_pages (slug, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?)')
    .run(slug, payload, now, now);
}

function loadSiteSettings() {
  const row = db.prepare('SELECT payload_json FROM site_settings WHERE setting_key = ?').get('default');
  if (!row) return {};
  try {
    const parsed = JSON.parse(row.payload_json || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveSiteSettings(data) {
  const now = nowIso();
  const payload = JSON.stringify(data || {}, null, 4);
  const row = db.prepare('SELECT id FROM site_settings WHERE setting_key = ?').get('default');

  if (row) {
    db.prepare('UPDATE site_settings SET payload_json = ?, updated_at = ? WHERE id = ?')
      .run(payload, now, row.id);
    return;
  }

  db.prepare('INSERT INTO site_settings (setting_key, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?)')
    .run('default', payload, now, now);
}

function safeEmbedJson(val) {
  return JSON.stringify(val)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function blockEditorHtml(contentJson, fieldName) {
  let blocks = [];
  try { blocks = JSON.parse(contentJson || '[]'); } catch { blocks = []; }
  if (!Array.isArray(blocks)) blocks = [];
  const uid = fieldName.replace(/\W/g, '_');
  const blocksEmbedded = safeEmbedJson(blocks);
  return `<div class="form-field form-field-full">
  <span class="form-label">Content Blocks</span>
  <div class="block-editor" id="be_${uid}">
    <div class="be-list" id="be_list_${uid}"></div>
    <div class="be-toolbar">
      <span class="be-toolbar-label">Add:</span>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="paragraph">Paragraph</button>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="heading">Heading</button>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="subheading">Subheading</button>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="quote">Quote</button>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="list">List</button>
      <button type="button" class="btn be-add" data-beid="${uid}" data-type="image">Image</button>
    </div>
    <textarea name="${esc(fieldName)}" id="be_hidden_${uid}" hidden></textarea>
  </div>
</div>
<script>
!function(){var UID='${uid}';
var list=document.getElementById('be_list_'+UID);
var hidden=document.getElementById('be_hidden_'+UID);
var blocks=${blocksEmbedded};
function ce(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fieldHtml(b){
  if(b.type==='paragraph'||b.type==='heading'||b.type==='subheading'||b.type==='quote'){
    return '<label class="form-field form-field-full"><span class="form-label">Text</span><textarea class="be-inp textarea-compact" data-key="text">'+ce(b.text||'')+'</textarea></label>';
  }
  if(b.type==='list'){
    return '<label class="form-field form-field-full"><span class="form-label">Items (one per line)</span><textarea class="be-inp textarea-compact" data-key="items">'+ce((b.items||[]).join('\\n'))+'</textarea></label>';
  }
  if(b.type==='image'){
    return '<label class="form-field form-field-full"><span class="form-label">Image URL</span><input class="be-inp" data-key="src" value="'+ce(b.src||'')+'" /></label>'+
           '<label class="form-field"><span class="form-label">Alt text</span><input class="be-inp" data-key="alt" value="'+ce(b.alt||'')+'" /></label>'+
           '<label class="form-field"><span class="form-label">Caption</span><input class="be-inp" data-key="caption" value="'+ce(b.caption||'')+'" /></label>';
  }
  return '';
}
function mkBlock(type){return type==='list'?{type:type,items:[]}:type==='image'?{type:type,src:'',alt:'',caption:''}:{type:type,text:''};}
function sync(){hidden.value=JSON.stringify(blocks);}
function render(){
  list.innerHTML='';
  blocks.forEach(function(b,i){
    var el=document.createElement('div');
    el.className='be-block';el.dataset.idx=i;
    el.innerHTML='<div class="be-block-header"><span class="be-block-type">'+b.type+'</span><div class="actions">'+
      (i>0?'<button type="button" class="btn be-mv" data-d="-1">&#8593;</button>':'')+
      (i<blocks.length-1?'<button type="button" class="btn be-mv" data-d="1">&#8595;</button>':'')+
      '<button type="button" class="btn btn-danger be-rm">&#x2715;</button></div></div>'+
      '<div class="form-grid" style="gap:8px">'+fieldHtml(b)+'</div>';
    list.appendChild(el);
  });
  sync();
}
list.addEventListener('input',function(e){
  var el=e.target.closest('.be-block');if(!el)return;
  var i=+el.dataset.idx;var k=e.target.dataset.key;if(!k)return;
  blocks[i][k]=k==='items'?e.target.value.split('\\n'):e.target.value;
  sync();
});
list.addEventListener('click',function(e){
  var el=e.target.closest('.be-block');if(!el)return;
  var i=+el.dataset.idx;
  if(e.target.classList.contains('be-rm')){blocks.splice(i,1);render();}
  else if(e.target.classList.contains('be-mv')){
    var d=+e.target.dataset.d;var j=i+d;
    if(j>=0&&j<blocks.length){var t=blocks[i];blocks[i]=blocks[j];blocks[j]=t;render();}
  }
});
document.querySelectorAll('.be-add[data-beid="'+UID+'"]').forEach(function(btn){
  btn.addEventListener('click',function(){blocks.push(mkBlock(btn.dataset.type));render();});
});
render();
}();
</script>`;
}

function repeaterHtml(field, items, itemSchema) {
  const uid = field.path.replace(/\W/g, '_');
  if (!Array.isArray(items)) items = [];
  const itemsEmbedded = safeEmbedJson(items);
  const schemaEmbedded = safeEmbedJson(itemSchema);
  return `<div class="form-field form-field-full">
  <div class="repeater-header">
    <span class="form-label">${esc(field.label)}</span>
    <button type="button" class="btn btn-primary" id="rp_add_${uid}">+ Add</button>
  </div>
  <div class="rp-list" id="rp_list_${uid}"></div>
  <input type="hidden" name="${esc(field.path)}" id="rp_hidden_${uid}" />
</div>
<script>
!function(){
var UID='${uid}';
var list=document.getElementById('rp_list_'+UID);
var hidden=document.getElementById('rp_hidden_'+UID);
var schema=${schemaEmbedded};
var items=${itemsEmbedded};
function ce(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function disp(v,t){if(t==='tokens')return Array.isArray(v)?v.join(', '):String(v||'');if(t==='json')return typeof v==='string'?v:JSON.stringify(v,null,2);return String(v==null?'':v);}
function parse(v,t){if(t==='tokens')return v.split(',').map(function(s){return s.trim();}).filter(Boolean);if(t==='json'){try{return JSON.parse(v);}catch(e){return v;}}if(t==='number')return Number(v)||0;return v;}
function itemLabel(item){return item.title||item.name||item.label||'';}
function renderItem(item,idx){
  var fields='';
  schema.forEach(function(f){
    var v=item[f.key];var d=disp(v,f.type);
    if(f.type==='select'){
      var opts=(f.options||[]).map(function(o){return '<option value="'+ce(o)+'"'+(o===v?' selected':'')+'>'+ce(o)+'</option>';}).join('');
      fields+='<label class="form-field"><span class="form-label">'+ce(f.label)+'</span><select class="rp-inp" data-key="'+f.key+'" data-ftype="'+f.type+'">'+opts+'</select></label>';
    } else if(f.type==='textarea'||f.type==='json'){
      fields+='<label class="form-field form-field-full"><span class="form-label">'+ce(f.label)+'</span><textarea class="rp-inp textarea-compact" data-key="'+f.key+'" data-ftype="'+f.type+'">'+ce(d)+'</textarea></label>';
    } else {
      fields+='<label class="form-field"><span class="form-label">'+ce(f.label)+'</span><input class="rp-inp" data-key="'+f.key+'" data-ftype="'+f.type+'" value="'+ce(d)+'" /></label>';
    }
  });
  var el=document.createElement('div');
  el.className='rp-item';el.dataset.idx=idx;
  el.innerHTML='<div class="rp-item-header"><span class="rp-item-label">'+(itemLabel(item)||'Item '+(idx+1))+'</span><div class="actions">'+
    (idx>0?'<button type="button" class="btn rp-mv" data-d="-1">&#8593;</button>':'')+
    (idx<items.length-1?'<button type="button" class="btn rp-mv" data-d="1">&#8595;</button>':'')+
    '<button type="button" class="btn btn-danger rp-rm">&#x2715;</button></div></div>'+
    '<div class="rp-fields">'+fields+'</div>';
  return el;
}
function sync(){hidden.value=JSON.stringify(items);}
function render(){
  list.innerHTML='';
  items.forEach(function(item,idx){list.appendChild(renderItem(item,idx));});
  sync();
}
list.addEventListener('input',function(e){
  var el=e.target.closest('.rp-item');if(!el)return;
  var i=+el.dataset.idx;var k=e.target.dataset.key;var ft=e.target.dataset.ftype;if(!k)return;
  items[i][k]=parse(e.target.value,ft);sync();
});
list.addEventListener('change',function(e){
  var el=e.target.closest('.rp-item');if(!el)return;
  var i=+el.dataset.idx;var k=e.target.dataset.key;var ft=e.target.dataset.ftype;if(!k)return;
  items[i][k]=parse(e.target.value,ft);sync();
});
list.addEventListener('click',function(e){
  var el=e.target.closest('.rp-item');if(!el)return;
  var i=+el.dataset.idx;
  if(e.target.classList.contains('rp-rm')){items.splice(i,1);render();}
  else if(e.target.classList.contains('rp-mv')){
    var d=+e.target.dataset.d;var j=i+d;
    if(j>=0&&j<items.length){var t=items[i];items[i]=items[j];items[j]=t;render();}
  }
});
document.getElementById('rp_add_'+UID).addEventListener('click',function(){
  var ni={};
  schema.forEach(function(f){if(f.type==='tokens'||f.type==='json')ni[f.key]=[];else if(f.type==='number')ni[f.key]=0;else ni[f.key]='';});
  items.push(ni);render();
});
render();
}();
</script>`;
}

function renderFormField(field, data) {
  const raw = getPath(data, field.path);
  const value = raw ?? '';

  if (field.type === 'text') {
    return `<label class="form-field">
      <span class="form-label">${esc(field.label)}</span>
      <input name="${esc(field.path)}" value="${esc(String(value))}" />
    </label>`;
  }

  if (field.type === 'html' || field.type === 'textarea') {
    const hint = field.hint ? ` <span class="muted" style="font-size:11px">(${esc(field.hint)})</span>` : '';
    return `<label class="form-field form-field-full">
      <span class="form-label">${esc(field.label)}${hint}</span>
      <textarea class="textarea-compact" name="${esc(field.path)}">${esc(String(value))}</textarea>
    </label>`;
  }

  if (field.type === 'strings') {
    const hint = field.hint ? ` <span class="muted" style="font-size:11px">(${esc(field.hint)})</span>` : '';
    const display = Array.isArray(value) ? value.join('\n') : String(value);
    return `<label class="form-field form-field-full">
      <span class="form-label">${esc(field.label)}${hint}</span>
      <textarea class="textarea-compact" name="${esc(field.path)}">${esc(display)}</textarea>
    </label>`;
  }

  const schema = REPEATER_SCHEMAS[field.type];
  if (schema) {
    return repeaterHtml(field, Array.isArray(value) ? value : [], schema);
  }

  return `<label class="form-field">
    <span class="form-label">${esc(field.label)}</span>
    <input name="${esc(field.path)}" value="${esc(JSON.stringify(value) || '')}" />
  </label>`;
}

function renderPageContentForm(slug, data) {
  const schema = PAGE_SCHEMAS[slug];
  if (!schema) return '<p class="muted">No schema defined for this page.</p>';

  const sectionsHtml = schema.sections.map(s => `<details class="content-section" open>
    <summary class="content-section-summary">${esc(s.title)}</summary>
    <div class="content-section-body">
      <div class="form-grid">
        ${s.fields.map(f => renderFormField(f, data)).join('')}
      </div>
    </div>
  </details>`).join('');

  return `<form class="stack" method="post" action="/admin/content/${esc(slug)}">
    ${sectionsHtml}
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
    </div>
  </form>`;
}

function renderSiteSettingsForm(data) {
  const sectionsHtml = SITE_SETTINGS_SCHEMA.sections.map(s => `<details class="content-section" open>
    <summary class="content-section-summary">${esc(s.title)}</summary>
    <div class="content-section-body">
      <div class="form-grid">
        ${s.fields.map(f => renderFormField(f, data)).join('')}
      </div>
    </div>
  </details>`).join('');

  return `<form class="stack" method="post" action="/admin/site">
    ${sectionsHtml}
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
    </div>
  </form>`;
}

function page(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<style>
:root{--bg:#090b10;--surface:#111722;--line:#263043;--text:#edf2ff;--muted:#9bacce;--accent:#f7e30b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}.wrap{max-width:1200px;margin:0 auto;padding:24px}.grid{display:grid;grid-template-columns:240px 1fr;gap:24px}
.sidebar,.panel,.card{background:rgba(17,23,34,.94);border:1px solid var(--line);border-radius:22px}.sidebar{padding:16px;height:fit-content}.panel,.card{padding:18px}
.stack{display:flex;flex-direction:column;gap:14px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:22px}
.btn,button{padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);cursor:pointer}
.btn-primary{background:var(--accent);color:#111;border-color:rgba(247,227,11,.45);font-weight:800}
.btn-danger{background:#f03d3d;color:#fff;border-color:rgba(240,61,61,.55);font-weight:700}
.btn-danger:hover,.btn-danger:focus-visible{background:#d93434}
input,textarea,select{width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:#0d121a;color:var(--text)}
textarea{min-height:220px;resize:vertical;font-family:ui-monospace,SFMono-Regular,monospace}.table{width:100%;border-collapse:collapse}
.textarea-compact{min-height:96px}
.table th,.table td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.table th{color:var(--muted);font-size:12px;text-transform:uppercase}
.muted{color:var(--muted)}.actions{display:flex;gap:10px;flex-wrap:wrap}.h1{margin:0;font-size:34px;letter-spacing:-.05em}
.form-field{display:flex;flex-direction:column;gap:6px}
.form-label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.form-field-full{grid-column:1 / -1}
.dashboard-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.tool-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.kpi-value{font-size:28px;font-weight:800;line-height:1}
.kpi-label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.kpi-meta{font-size:12px;color:var(--muted)}
.tool-card h3{margin:0 0 6px 0;font-size:18px}
.tool-card p{margin:0;color:var(--muted)}
.tool-card .actions{margin-top:10px}
.dashboard-link{display:flex;flex-direction:column;gap:8px;cursor:pointer;transition:border-color .16s ease, transform .16s ease, box-shadow .16s ease}
.dashboard-link:hover,.dashboard-link:focus-visible{border-color:rgba(247,227,11,.45);transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.22)}
.link-hint{font-size:12px;color:var(--muted)}
@media (max-width:1100px){.dashboard-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.tool-grid{grid-template-columns:1fr}}
@media (max-width:900px){.grid{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}}
/* Block editor */
.block-editor{border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px}.be-list{display:flex;flex-direction:column;gap:8px}
.be-toolbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding-top:10px;border-top:1px solid var(--line)}
.be-toolbar-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-right:4px}
.be-block{background:#080c12;border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}
.be-block-header{display:flex;justify-content:space-between;align-items:center}
.be-block-type{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);font-weight:700}
/* Repeater */
.repeater-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.rp-list{display:flex;flex-direction:column;gap:8px}
.rp-item{background:#080c12;border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}
.rp-item-header{display:flex;justify-content:space-between;align-items:center}
.rp-item-label{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}
.rp-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
/* Content sections */
.content-section{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:rgba(17,23,34,.5)}
.content-section-summary{padding:12px 16px;cursor:pointer;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em;list-style:none;display:flex;justify-content:space-between;align-items:center;user-select:none}
.content-section-summary::-webkit-details-marker{display:none}
.content-section-summary::after{content:'▾';color:var(--muted)}
details[open] .content-section-summary::after{content:'▴'}
.content-section-body{padding:16px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:12px}
</style>

</head>
<body><div class="wrap">${body}</div></body></html>`;
}

function shell(title, content) {
    return page(
        title,
        `<div class="top">
      <div>
        <h1 class="h1">Buzzworthy Admin</h1>
        <div class="muted">SQLite-backed admin for posts and helpdesk content</div>
      </div>
      <div class="actions">
        <a class="btn" href="/">Public Site</a>
        <a class="btn" href="/admin/logout">Logout</a>
      </div>
    </div>
    <div class="grid">
      <aside class="sidebar stack">
        <a class="btn" href="/admin">Overview</a>
        <a class="btn" href="/admin/site">Site Settings</a>
        <a class="btn" href="/admin/content">Content Pages</a>
        <a class="btn" href="/admin/mailbox">Mailbox</a>
        <a class="btn" href="/admin/pages">Service Pages</a>
        <a class="btn" href="/admin/works">Portfolio Works</a>
        <a class="btn" href="/admin/posts">Blog Posts</a>
        <a class="btn" href="/admin/topics">Help Topics</a>
        <a class="btn" href="/admin/articles">Help Articles</a>
      </aside>
      <main class="panel stack">${content}</main>
    </div>`
    );
}

function workForm(row = {}) {
  return `<form class="stack" method="post" action="${row.id ? `/admin/works/${row.id}` : '/admin/works'}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Title</span><input name="title" placeholder="Title" value="${esc(row.title || '')}" /></label>
      <label class="form-field"><span class="form-label">Slug</span><input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" /></label>
      <label class="form-field"><span class="form-label">Category</span><input name="category" placeholder="Category" value="${esc(row.category || '')}" /></label>
      <label class="form-field"><span class="form-label">Hero Image URL</span><input name="hero_image" placeholder="Hero image URL" value="${esc(row.hero_image || '')}" /></label>
      <label class="form-field"><span class="form-label">Status</span><select name="status">
        <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>Draft</option>
        <option value="published" ${row.status === 'published' ? 'selected' : ''}>Published</option>
      </select></label>
      <label class="form-field form-field-full"><span class="form-label">Summary</span><textarea class="textarea-compact" name="summary" placeholder="Summary">${esc(row.summary || '')}</textarea></label>
      <label class="form-field form-field-full"><span class="form-label">Metrics JSON</span><textarea class="textarea-compact" name="metrics_json">${esc(formatJsonText(row.metrics_json, '[]'))}</textarea></label>
      ${blockEditorHtml(row.content_json || '[{"type":"paragraph","text":"Project summary"}]', 'content_json')}
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${row.id ? `<a class="btn btn-danger" href="/admin/works/${row.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/login', (_req, res) => {
    res.send(page('Admin Login', `
    <div class="card" style="max-width:420px;margin:8vh auto 0">
      <h1 class="h1">Admin Login</h1>
      <form class="stack" method="post" action="/admin/login">
        <label class="form-field">
          <span class="form-label">Username</span>
          <input name="username" placeholder="Username" />
        </label>
        <label class="form-field">
          <span class="form-label">Password</span>
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button class="btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  `));
});

adminRouter.post('/login', (req, res) => {
    const { username = '', password = '' } = req.body || {};
    if (!validateLogin(username, password)) {
        return res.status(401).send(page('Admin Login', `
      <div class="card" style="max-width:420px;margin:8vh auto 0">
        <div class="muted">Invalid credentials.</div>
      </div>
    `));
    }

  res.cookie(ADMIN_COOKIE_NAME, createSession(username), adminCookieOptions(req));

    res.redirect('/admin');
});

adminRouter.get('/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax'
  });
    res.redirect('/admin/login');
});

adminRouter.use(requireAdmin);

adminRouter.get('/', (_req, res) => {
  const pages = db.prepare("SELECT COUNT(*) count FROM pages WHERE page_type NOT IN ('standard', 'landing')").get().count;
  const works = db.prepare('SELECT COUNT(*) count FROM works').get().count;
    const posts = db.prepare('SELECT COUNT(*) count FROM posts').get().count;
    const topics = db.prepare('SELECT COUNT(*) count FROM helpdesk_topics').get().count;
    const articles = db.prepare('SELECT COUNT(*) count FROM helpdesk_articles').get().count;
  const mailbox = db.prepare('SELECT COUNT(*) count FROM contact_messages').get().count;

  const unreadMailbox = db.prepare("SELECT COUNT(*) count FROM contact_messages WHERE status = 'new'").get().count;
  const publishedWorks = db.prepare("SELECT COUNT(*) count FROM works WHERE status = 'published'").get().count;
  const publishedPosts = db.prepare("SELECT COUNT(*) count FROM posts WHERE status = 'published'").get().count;
  const publishedArticles = db.prepare("SELECT COUNT(*) count FROM helpdesk_articles WHERE status = 'published'").get().count;

    res.send(shell('Overview', `
    <div class="top" style="margin:0">
      <h2>Dashboard</h2>
      <div class="muted">Content operations overview and publishing tools</div>
    </div>

    <div class="dashboard-grid">
      <a class="card stack dashboard-link" href="/admin/mailbox">
        <div class="kpi-label">Mailbox</div>
        <div class="kpi-value">${mailbox}</div>
        <div class="kpi-meta">${unreadMailbox} unread</div>
        <div class="link-hint">Open Mailbox</div>
      </a>
      <a class="card stack dashboard-link" href="/admin/pages">
        <div class="kpi-label">Service Pages</div>
        <div class="kpi-value">${pages}</div>
        <div class="kpi-meta">Structured page records</div>
        <div class="link-hint">Manage Service Pages</div>
      </a>
      <a class="card stack dashboard-link" href="/admin/works">
        <div class="kpi-label">Portfolio Works</div>
        <div class="kpi-value">${works}</div>
        <div class="kpi-meta">${publishedWorks} published</div>
        <div class="link-hint">Manage Works</div>
      </a>
      <a class="card stack dashboard-link" href="/admin/articles">
        <div class="kpi-label">Blog + Helpdesk</div>
        <div class="kpi-value">${posts + topics + articles}</div>
        <div class="kpi-meta">${publishedPosts + publishedArticles} published items</div>
        <div class="link-hint">Manage Help Articles</div>
      </a>
    </div>

    <div class="tool-grid">
      <a class="card tool-card stack dashboard-link" href="/admin/mailbox">
        <h3>Mailbox</h3>
        <p>Review contact submissions captured from the site form.</p>
        <div class="link-hint">Open Mailbox</div>
      </a>

      <a class="card tool-card stack dashboard-link" href="/admin/pages">
        <h3>Service Pages</h3>
        <p>Manage services and related structured page sections.</p>
        <div class="link-hint">Manage Service Pages</div>
      </a>

      <a class="card tool-card stack dashboard-link" href="/admin/works">
        <h3>Portfolio Works</h3>
        <p>Create and publish case studies shown in your works gallery.</p>
        <div class="link-hint">Manage Works</div>
      </a>

      <a class="card tool-card stack dashboard-link" href="/admin/posts">
        <h3>Blog Posts</h3>
        <p>Write, edit, and publish blog content.</p>
        <div class="link-hint">Manage Posts</div>
      </a>

      <a class="card tool-card stack dashboard-link" href="/admin/topics">
        <h3>Help Topics</h3>
        <p>Define helpdesk categories for article grouping.</p>
        <div class="link-hint">Manage Topics</div>
      </a>

      <a class="card tool-card stack dashboard-link" href="/admin/articles">
        <h3>Help Articles</h3>
        <p>Maintain support articles and publication status.</p>
        <div class="link-hint">Manage Articles</div>
      </a>
    </div>
  `));
});

function postForm(row = {}) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/posts/${row.id}` : '/admin/posts'}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Title</span><input name="title" placeholder="Title" value="${esc(row.title || '')}" /></label>
      <label class="form-field"><span class="form-label">Slug</span><input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" /></label>
      <label class="form-field"><span class="form-label">Cover Image URL</span><input name="cover_image" placeholder="Cover image URL" value="${esc(row.cover_image || '')}" /></label>
      <label class="form-field"><span class="form-label">Author</span><input name="author" placeholder="Author" value="${esc(row.author || 'Buzzworthy')}" /></label>
      <label class="form-field"><span class="form-label">Status</span><select name="status">
        <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>Draft</option>
        <option value="published" ${row.status === 'published' ? 'selected' : ''}>Published</option>
      </select></label>
      <label class="form-field form-field-full"><span class="form-label">Excerpt</span><textarea class="textarea-compact" name="excerpt" placeholder="Excerpt">${esc(row.excerpt || '')}</textarea></label>
      ${blockEditorHtml(row.content_json || '[{"type":"paragraph","text":"Body copy"}]', 'content_json')}
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${row.id ? `<a class="btn btn-danger" href="/admin/posts/${row.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

function pageForm(row = {}) {
  return `<form class="stack" method="post" action="${row.id ? `/admin/pages/${row.id}` : '/admin/pages'}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Title</span><input name="title" placeholder="Title" value="${esc(row.title || '')}" /></label>
      <label class="form-field"><span class="form-label">Slug</span><input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" /></label>
      <label class="form-field"><span class="form-label">Page Type</span><select name="page_type">
        <option value="service" ${row.page_type === 'service' ? 'selected' : ''}>service</option>
        <option value="article" ${row.page_type === 'article' ? 'selected' : ''}>article</option>
      </select></label>
      <label class="form-field"><span class="form-label">Status</span><select name="status">
        <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>Draft</option>
        <option value="published" ${row.status === 'published' ? 'selected' : ''}>Published</option>
      </select></label>
      <label class="form-field"><span class="form-label">SEO Title</span><input name="seo_title" placeholder="SEO title" value="${esc(row.seo_title || '')}" /></label>
      <label class="form-field form-field-full"><span class="form-label">SEO Description</span><textarea class="textarea-compact" name="seo_description" placeholder="SEO description">${esc(row.seo_description || '')}</textarea></label>
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${row.id ? `<a class="btn btn-danger" href="/admin/pages/${row.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

function sectionForm(section = {}, pageId) {
  return `<form class="stack" method="post" action="${section.id ? `/admin/sections/${section.id}` : `/admin/pages/${pageId}/sections`}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Section Type</span><select name="section_type">
        <option value="pageHero" ${section.section_type === 'pageHero' ? 'selected' : ''}>pageHero</option>
        <option value="sectionHeader" ${section.section_type === 'sectionHeader' ? 'selected' : ''}>sectionHeader</option>
        <option value="featureGrid" ${section.section_type === 'featureGrid' ? 'selected' : ''}>featureGrid</option>
        <option value="processGrid" ${section.section_type === 'processGrid' ? 'selected' : ''}>processGrid</option>
        <option value="ctaPanel" ${section.section_type === 'ctaPanel' ? 'selected' : ''}>ctaPanel</option>
        <option value="articleBody" ${section.section_type === 'articleBody' ? 'selected' : ''}>articleBody</option>
        <option value="gallery" ${section.section_type === 'gallery' ? 'selected' : ''}>gallery</option>
        <option value="logoBand" ${section.section_type === 'logoBand' ? 'selected' : ''}>logoBand</option>
      </select></label>
      <label class="form-field"><span class="form-label">Sort Order</span><input name="sort_order" type="number" value="${esc(section.sort_order ?? 0)}" /></label>
      <label class="form-field form-field-full"><span class="form-label">Props JSON</span><textarea name="props_json">${esc(formatJsonText(section.props_json, '{}'))}</textarea></label>
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${section.id ? `<a class="btn btn-danger" href="/admin/sections/${section.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/posts', (_req, res) => {
    const rows = db.prepare(`
    SELECT * FROM posts
    ORDER BY datetime(COALESCE(published_at, updated_at)) DESC
  `).all();

    res.send(shell('Posts', `
    <div class="top" style="margin:0">
      <h2>Posts</h2>
      <a class="btn-primary" href="/admin/posts/new">New Post</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Status</th><th>Slug</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.excerpt || '')}</div></td>
            <td>${esc(r.status)}</td>
            <td>${esc(r.slug)}</td>
            <td class="actions"><a class="btn" href="/admin/posts/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/posts/new', (_req, res) =>
    res.send(shell('New Post', `<h2>New Post</h2>${postForm({ status: 'draft' })}`))
);

adminRouter.get('/posts/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Post', `<h2>Edit Post</h2>${postForm(row)}`));
});

adminRouter.post('/posts', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, author, status, published_at,
      content_json, created_at, updated_at
    ) VALUES (
      @slug, @title, @excerpt, @cover_image, @author, @status, @published_at,
      @content_json, @created_at, @updated_at
    )
  `).run({
        slug: slugify(req.body.slug || title),
        title,
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || '',
    author: req.body.author || 'Buzzworthy',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        content_json: req.body.content_json || '[]',
        created_at: now,
        updated_at: now
    });

    res.redirect('/admin/posts');
});

adminRouter.post('/posts/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE posts
    SET slug=@slug, title=@title, excerpt=@excerpt, cover_image=@cover_image,
        author=@author, status=@status, published_at=@published_at,
        content_json=@content_json, updated_at=@updated_at
    WHERE id=@id
  `).run({
        id: req.params.id,
        slug: slugify(req.body.slug || title),
        title,
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || '',
    author: req.body.author || 'Buzzworthy',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        content_json: req.body.content_json || '[]',
        updated_at: now
    });

    res.redirect('/admin/posts');
});

adminRouter.get('/posts/:id/delete', (req, res) => {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.redirect('/admin/posts');
});

function topicForm(row = {}) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/topics/${row.id}` : '/admin/topics'}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Title</span><input name="title" placeholder="Title" value="${esc(row.title || '')}" /></label>
      <label class="form-field"><span class="form-label">Slug</span><input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" /></label>
      <label class="form-field"><span class="form-label">Sort Order</span><input name="sort_order" type="number" value="${esc(row.sort_order ?? 0)}" /></label>
      <label class="form-field form-field-full"><span class="form-label">Description</span><textarea name="description" placeholder="Description">${esc(row.description || '')}</textarea></label>
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${row.id ? `<a class="btn btn-danger" href="/admin/topics/${row.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/topics', (_req, res) => {
    const rows = db.prepare(`
    SELECT t.*, COUNT(a.id) article_count
    FROM helpdesk_topics t
    LEFT JOIN helpdesk_articles a ON a.topic_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.title ASC
  `).all();

    res.send(shell('Topics', `
    <div class="top" style="margin:0">
      <h2>Topics</h2>
      <a class="btn-primary" href="/admin/topics/new">New Topic</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Slug</th><th>Articles</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.description || '')}</div></td>
            <td>${esc(r.slug)}</td>
            <td>${r.article_count}</td>
            <td><a class="btn" href="/admin/topics/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/topics/new', (_req, res) =>
    res.send(shell('New Topic', `<h2>New Topic</h2>${topicForm({ sort_order: 0 })}`))
);

adminRouter.get('/topics/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM helpdesk_topics WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Topic', `<h2>Edit Topic</h2>${topicForm(row)}`));
});

adminRouter.post('/topics', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO helpdesk_topics (slug, title, description, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        slugify(req.body.slug || title),
        title,
        req.body.description || '',
        Number(req.body.sort_order || 0),
        now,
        now
    );

    res.redirect('/admin/topics');
});

adminRouter.post('/topics/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE helpdesk_topics
    SET slug=?, title=?, description=?, sort_order=?, updated_at=?
    WHERE id=?
  `).run(
        slugify(req.body.slug || title),
        title,
        req.body.description || '',
        Number(req.body.sort_order || 0),
        now,
        req.params.id
    );

    res.redirect('/admin/topics');
});

adminRouter.get('/topics/:id/delete', (req, res) => {
    db.prepare('DELETE FROM helpdesk_topics WHERE id = ?').run(req.params.id);
    res.redirect('/admin/topics');
});

function articleForm(row = {}, topics = []) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/articles/${row.id}` : '/admin/articles'}">
    <div class="form-grid">
      <label class="form-field"><span class="form-label">Title</span><input name="title" placeholder="Title" value="${esc(row.title || '')}" /></label>
      <label class="form-field"><span class="form-label">Slug</span><input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" /></label>
      <label class="form-field"><span class="form-label">Topic</span><select name="topic_id">
        <option value="">Select topic</option>
        ${topics.map(t => `<option value="${t.id}" ${String(row.topic_id || '') === String(t.id) ? 'selected' : ''}>${esc(t.title)}</option>`).join('')}
      </select></label>
      <label class="form-field"><span class="form-label">Status</span><select name="status">
        <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>Draft</option>
        <option value="published" ${row.status === 'published' ? 'selected' : ''}>Published</option>
      </select></label>
      <label class="form-field form-field-full"><span class="form-label">Excerpt</span><textarea class="textarea-compact" name="excerpt" placeholder="Excerpt">${esc(row.excerpt || '')}</textarea></label>
      <label class="form-field form-field-full"><span class="form-label">Tags JSON</span><textarea class="textarea-compact" name="tags_json">${esc(formatJsonText(row.tags_json, '[]'))}</textarea></label>
      ${blockEditorHtml(row.content_json || '[{"type":"paragraph","text":"Help article body"}]', 'content_json')}
    </div>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      <button type="button" class="btn" onclick="history.back()">Cancel</button>
      ${row.id ? `<a class="btn btn-danger" href="/admin/articles/${row.id}/delete" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/articles', (_req, res) => {
    const rows = db.prepare(`
    SELECT a.*, t.title topic_title
    FROM helpdesk_articles a
    LEFT JOIN helpdesk_topics t ON t.id = a.topic_id
    ORDER BY datetime(COALESCE(a.published_at, a.updated_at)) DESC
  `).all();

    res.send(shell('Articles', `
    <div class="top" style="margin:0">
      <h2>Articles</h2>
      <a class="btn-primary" href="/admin/articles/new">New Article</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Topic</th><th>Status</th><th>Slug</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.excerpt || '')}</div></td>
            <td>${esc(r.topic_title || '')}</td>
            <td>${esc(r.status)}</td>
            <td>${esc(r.slug)}</td>
            <td><a class="btn" href="/admin/articles/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/articles/new', (_req, res) => {
    const topics = db.prepare('SELECT * FROM helpdesk_topics ORDER BY sort_order ASC, title ASC').all();
    res.send(shell('New Article', `<h2>New Article</h2>${articleForm({ status: 'draft' }, topics)}`));
});

adminRouter.get('/articles/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM helpdesk_articles WHERE id = ?').get(req.params.id);
    const topics = db.prepare('SELECT * FROM helpdesk_topics ORDER BY sort_order ASC, title ASC').all();
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Article', `<h2>Edit Article</h2>${articleForm(row, topics)}`));
});

adminRouter.post('/articles', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO helpdesk_articles (
      slug, topic_id, title, excerpt, status, published_at,
      tags_json, content_json, created_at, updated_at
    ) VALUES (
      @slug, @topic_id, @title, @excerpt, @status, @published_at,
      @tags_json, @content_json, @created_at, @updated_at
    )
  `).run({
        slug: slugify(req.body.slug || title),
        topic_id: req.body.topic_id ? Number(req.body.topic_id) : null,
        title,
        excerpt: req.body.excerpt || '',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        tags_json: req.body.tags_json || '[]',
        content_json: req.body.content_json || '[]',
        created_at: now,
        updated_at: now
    });

    res.redirect('/admin/articles');
});

adminRouter.post('/articles/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE helpdesk_articles
    SET slug=@slug, topic_id=@topic_id, title=@title, excerpt=@excerpt,
        status=@status, published_at=@published_at, tags_json=@tags_json,
        content_json=@content_json, updated_at=@updated_at
    WHERE id=@id
  `).run({
        id: req.params.id,
        slug: slugify(req.body.slug || title),
        topic_id: req.body.topic_id ? Number(req.body.topic_id) : null,
        title,
        excerpt: req.body.excerpt || '',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        tags_json: req.body.tags_json || '[]',
        content_json: req.body.content_json || '[]',
        updated_at: now
    });

    res.redirect('/admin/articles');
});

adminRouter.get('/articles/:id/delete', (req, res) => {
    db.prepare('DELETE FROM helpdesk_articles WHERE id = ?').run(req.params.id);
    res.redirect('/admin/articles');
});

adminRouter.get('/pages', (_req, res) => {
  const rows = db.prepare(`
    SELECT *
    FROM pages
    WHERE page_type NOT IN ('standard', 'landing')
    ORDER BY updated_at DESC
  `).all();

  res.send(shell('Pages', `
    <div class="top" style="margin:0">
      <h2>Pages</h2>
      <a class="btn-primary" href="/admin/pages/new">New Page</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Slug</th><th>Type</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong></td>
            <td>${esc(r.slug)}</td>
            <td>${esc(r.page_type)}</td>
            <td>${esc(r.status)}</td>
            <td><a class="btn" href="/admin/pages/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/pages/:id', (req, res) => {
  const row = db.prepare("SELECT * FROM pages WHERE id = ? AND page_type NOT IN ('standard', 'landing')").get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  const sections = db.prepare(`
    SELECT *
    FROM page_sections
    WHERE page_id = ?
    ORDER BY sort_order ASC, id ASC
  `).all(req.params.id);

  res.send(shell('Edit Page', `
    <h2>Edit Page</h2>
    ${pageForm(row)}
    <div class="top" style="margin:1rem 0 0">
      <h3>Sections</h3>
      <a class="btn-primary" href="/admin/pages/${row.id}/sections/new">Add Section</a>
    </div>
    <table class="table">
      <thead><tr><th>Type</th><th>Sort</th><th>Props</th><th></th></tr></thead>
      <tbody>
        ${sections.map(s => `
          <tr>
            <td>${esc(s.section_type)}</td>
            <td>${s.sort_order}</td>
            <td><code>${esc(s.props_json.slice(0, 140))}</code></td>
            <td><a class="btn" href="/admin/sections/${s.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.post('/pages', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();
  const pageType = normalizeAdminPageType(req.body.page_type);

  db.prepare(`
    INSERT INTO pages (slug, title, page_type, status, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slugify(req.body.slug || title),
    title,
    pageType,
    req.body.status || 'draft',
    req.body.seo_title || '',
    req.body.seo_description || '',
    now,
    now
  );

  res.redirect('/admin/pages');
});

adminRouter.post('/pages/:id', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();
  const pageType = normalizeAdminPageType(req.body.page_type);

  db.prepare(`
    UPDATE pages
    SET slug=?, title=?, page_type=?, status=?, seo_title=?, seo_description=?, updated_at=?
    WHERE id=?
  `).run(
    slugify(req.body.slug || title),
    title,
    pageType,
    req.body.status || 'draft',
    req.body.seo_title || '',
    req.body.seo_description || '',
    now,
    req.params.id
  );

  res.redirect(`/admin/pages/${req.params.id}`);
});

adminRouter.get('/pages/:id/delete', (req, res) => {
  db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/pages');
});

adminRouter.get('/pages/:id/sections/new', (req, res) => {
  res.send(shell('New Section', `<h2>New Section</h2>${sectionForm({ sort_order: 0 }, req.params.id)}`));
});

adminRouter.post('/pages/:id/sections', (req, res) => {
  const now = nowIso();

  db.prepare(`
    INSERT INTO page_sections (page_id, section_type, sort_order, props_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    req.params.id,
    req.body.section_type || 'sectionHeader',
    Number(req.body.sort_order || 0),
    req.body.props_json || '{}',
    now,
    now
  );

  res.redirect(`/admin/pages/${req.params.id}`);
});

adminRouter.get('/sections/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  res.send(shell('Edit Section', `<h2>Edit Section</h2>${sectionForm(row, row.page_id)}`));
});

adminRouter.post('/sections/:id', (req, res) => {
  const now = nowIso();
  const row = db.prepare('SELECT page_id FROM page_sections WHERE id = ?').get(req.params.id);

  db.prepare(`
    UPDATE page_sections
    SET section_type=?, sort_order=?, props_json=?, updated_at=?
    WHERE id=?
  `).run(
    req.body.section_type || 'sectionHeader',
    Number(req.body.sort_order || 0),
    req.body.props_json || '{}',
    now,
    req.params.id
  );

  res.redirect(`/admin/pages/${row.page_id}`);
});

adminRouter.get('/sections/:id/delete', (req, res) => {
  const row = db.prepare('SELECT page_id FROM page_sections WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM page_sections WHERE id = ?').run(req.params.id);
  res.redirect(`/admin/pages/${row.page_id}`);
});

adminRouter.get('/works', (_req, res) => {
  const rows = db.prepare(`
    SELECT *
    FROM works
    ORDER BY datetime(updated_at) DESC
  `).all();

  res.send(shell('Works', `
    <div class="top" style="margin:0">
      <h2>Works</h2>
      <a class="btn-primary" href="/admin/works/new">New Work Item</a>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Status</th>
          <th>Slug</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>
              <strong>${esc(r.title)}</strong>
              <div class="muted">${esc(r.summary || '')}</div>
            </td>
            <td>${esc(r.category || '')}</td>
            <td>${esc(r.status || '')}</td>
            <td>${esc(r.slug || '')}</td>
            <td><a class="btn" href="/admin/works/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/works/new', (_req, res) => {
  res.send(shell('New Work Item', `<h2>New Work Item</h2>${workForm({ status: 'draft' })}`));
});

adminRouter.get('/works/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM works WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  res.send(shell('Edit Work Item', `<h2>Edit Work Item</h2>${workForm(row)}`));
});

adminRouter.post('/works', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();

  db.prepare(`
    INSERT INTO works (
      slug, title, category, summary, hero_image, metrics_json, content_json, status, created_at, updated_at
    ) VALUES (
      @slug, @title, @category, @summary, @hero_image, @metrics_json, @content_json, @status, @created_at, @updated_at
    )
  `).run({
    slug: slugify(req.body.slug || title),
    title,
    category: req.body.category || '',
    summary: req.body.summary || '',
    hero_image: req.body.hero_image || '',
    metrics_json: req.body.metrics_json || '[]',
    content_json: req.body.content_json || '[]',
    status: req.body.status || 'draft',
    created_at: now,
    updated_at: now
  });

  res.redirect('/admin/works');
});

adminRouter.post('/works/:id', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();

  db.prepare(`
    UPDATE works
    SET slug=@slug,
        title=@title,
        category=@category,
        summary=@summary,
        hero_image=@hero_image,
        metrics_json=@metrics_json,
        content_json=@content_json,
        status=@status,
        updated_at=@updated_at
    WHERE id=@id
  `).run({
    id: req.params.id,
    slug: slugify(req.body.slug || title),
    title,
    category: req.body.category || '',
    summary: req.body.summary || '',
    hero_image: req.body.hero_image || '',
    metrics_json: req.body.metrics_json || '[]',
    content_json: req.body.content_json || '[]',
    status: req.body.status || 'draft',
    updated_at: now
  });

  res.redirect('/admin/works');
});

adminRouter.get('/works/:id/delete', (req, res) => {
  db.prepare('DELETE FROM works WHERE id = ?').run(req.params.id);
  res.redirect('/admin/works');
});

adminRouter.get('/mailbox', (_req, res) => {
  const rows = db.prepare(`
    SELECT id, name, email, service, budget, status, created_at,
           substr(message, 1, 140) AS preview
    FROM contact_messages
    ORDER BY datetime(created_at) DESC, id DESC
  `).all();

  res.send(shell('Mailbox', `
    <div class="top" style="margin:0">
      <h2>Mailbox</h2>
      <div class="muted">Contact form submissions stored in SQLite</div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>From</th>
          <th>Service</th>
          <th>Status</th>
          <th>Submitted</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>
              <strong>${esc(r.name || '(no name)')}</strong>
              <div class="muted">${esc(r.email || '')}</div>
              <div class="muted">${esc(r.preview || '')}</div>
            </td>
            <td>${esc(r.service || '-')}</td>
            <td>${esc(r.status || 'new')}</td>
            <td>${esc(r.created_at || '')}</td>
            <td><a class="btn" href="/admin/mailbox/${r.id}">Open</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/mailbox/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  if (row.status === 'new') {
    db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run('read', req.params.id);
    row.status = 'read';
  }

  res.send(shell('Mailbox Message', `
    <div class="top" style="margin:0">
      <h2>Message #${row.id}</h2>
      <div class="actions">
        <a class="btn" href="/admin/mailbox">Back to Mailbox</a>
        <a class="btn" href="/admin/mailbox/${row.id}/delete">Delete</a>
      </div>
    </div>
    <div class="card stack">
      <div><strong>From:</strong> ${esc(row.name || '-')} &lt;${esc(row.email || '-')}&gt;</div>
      <div><strong>Company:</strong> ${esc(row.company || '-')}</div>
      <div><strong>Phone:</strong> ${esc(row.phone || '-')}</div>
      <div><strong>Service:</strong> ${esc(row.service || '-')}</div>
      <div><strong>Budget:</strong> ${esc(row.budget || '-')}</div>
      <div><strong>Status:</strong> ${esc(row.status || 'new')}</div>
      <div><strong>Submitted:</strong> ${esc(row.created_at || '')}</div>
      <div><strong>IP:</strong> ${esc(row.ip_address || '-')}</div>
      <div><strong>User-Agent:</strong> ${esc(row.user_agent || '-')}</div>
      <div>
        <strong>Message</strong>
        <pre style="margin:8px 0 0;padding:12px;border:1px solid var(--line);border-radius:14px;background:#0d121a;white-space:pre-wrap">${esc(row.message || '')}</pre>
      </div>
    </div>
  `));
});

adminRouter.get('/mailbox/:id/delete', (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/mailbox');
});

adminRouter.get('/site', (_req, res) => {
  const data = loadSiteSettings();
  res.send(shell('Site Settings', `
    <div class="top" style="margin:0">
      <h2>Site Settings</h2>
      <div class="muted">Editable site-wide company, navigation, and footer data</div>
    </div>
    ${renderSiteSettingsForm(data)}
  `));
});

adminRouter.post('/site', (req, res) => {
  const current = loadSiteSettings();
  for (const section of SITE_SETTINGS_SCHEMA.sections) {
    for (const field of section.fields) {
      const raw = req.body[field.path];
      if (raw === undefined) continue;
      let value;
      if (field.type === 'strings') {
        value = String(raw || '').split('\n').map(s => s.trim()).filter(Boolean);
      } else if (ARRAY_FIELD_TYPES.has(field.type)) {
        try { value = JSON.parse(raw || '[]'); } catch { value = []; }
      } else {
        value = String(raw || '');
      }
      setPath(current, field.path, value);
    }
  }
  saveSiteSettings(current);
  res.redirect('/admin/site');
});

// ─── Content page editor routes ─────────────────────────────────────────────

adminRouter.get('/content', (_req, res) => {
  const rows = [...CONTENT_PAGE_SLUGS].map(slug => ({ slug }));
  res.send(shell('Content Pages', `
    <div class="top" style="margin:0">
      <h2>Content Pages</h2>
      <div class="muted">Edit JSON-driven page content stored in SQLite</div>
    </div>
    <table class="table">
      <thead><tr><th>Page</th><th>Source</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td><strong>${esc(r.slug)}</strong></td>
          <td><code>content_pages.payload_json</code></td>
          <td><a class="btn" href="/admin/content/${esc(r.slug)}">Edit</a></td>
        </tr>`).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/content/:slug', (req, res) => {
  const { slug } = req.params;
  if (!CONTENT_PAGE_SLUGS.has(slug)) return res.status(404).send('Not found');
  const data = loadContentPagePayload(slug);
  res.send(shell(`Content: ${slug}`, `
    <div class="top" style="margin:0">
      <h2>${esc(slug)}</h2>
      <div class="muted">SQLite table: content_pages</div>
    </div>
    ${renderPageContentForm(slug, data)}
  `));
});

adminRouter.post('/content/:slug', (req, res) => {
  const { slug } = req.params;
  if (!CONTENT_PAGE_SLUGS.has(slug)) return res.status(404).send('Not found');
  const current = loadContentPagePayload(slug);
  const schema = PAGE_SCHEMAS[slug];
  for (const section of schema.sections) {
    for (const field of section.fields) {
      const raw = req.body[field.path];
      if (raw === undefined) continue;
      let value;
      if (field.type === 'strings') {
        value = String(raw || '').split('\n').map(s => s.trim()).filter(Boolean);
      } else if (ARRAY_FIELD_TYPES.has(field.type)) {
        try { value = JSON.parse(raw || '[]'); } catch { value = []; }
      } else {
        value = String(raw || '');
      }
      setPath(current, field.path, value);
    }
  }
  saveContentPagePayload(slug, current);
  upsertContentPageMirrorRow(slug, current);
  res.redirect(`/admin/content/${slug}`);
});
