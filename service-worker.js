<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#080c14">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<title>MTTO Reinventariado</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
:root {
  --bg:#080c14; --surface:#0d1520; --surface2:#111d2e; --border:#1a3050;
  --accent:#00c9ff; --accent2:#0066ff; --accent3:#00ff88;
  --danger:#ff4060; --wa:#25D366;
  --text:#c8dff0; --text-dim:#4a6a88; --text-bright:#e8f4ff;
  --nav-h:64px; --safe-bottom:env(safe-area-inset-bottom,0px);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{height:100%}
body{
  background:var(--bg); color:var(--text); font-family:'Exo 2',sans-serif;
  min-height:100vh; min-height:-webkit-fill-available; overflow-x:hidden;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%,rgba(0,102,255,0.08) 0%,transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%,rgba(0,201,255,0.05) 0%,transparent 50%);
}
body::before{
  content:'';position:fixed;inset:0;
  background-image:linear-gradient(rgba(0,201,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,255,0.03) 1px,transparent 1px);
  background-size:40px 40px;pointer-events:none;z-index:0;
}
.app-shell{display:flex;flex-direction:column;min-height:100vh;min-height:-webkit-fill-available}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:calc(var(--nav-h) + var(--safe-bottom) + 16px);-webkit-overflow-scrolling:touch}
.container{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:16px 14px 8px}

/* HEADER */
header{text-align:center;padding:24px 0 20px;position:relative}
header::after{content:'';display:block;width:80px;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);margin:14px auto 0}
.logo-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(0,201,255,0.1),rgba(0,102,255,0.1));border:1px solid rgba(0,201,255,0.3);border-radius:4px;padding:5px 12px;font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:2px;margin-bottom:10px}
.logo-badge span{color:var(--accent3)}
h1{font-family:'Rajdhani',sans-serif;font-size:clamp(20px,6vw,40px);font-weight:700;color:var(--text-bright);letter-spacing:1px;line-height:1.15}
h1 em{font-style:normal;color:var(--accent);text-shadow:0 0 20px rgba(0,201,255,0.4)}
.subtitle{font-size:clamp(9px,2.5vw,12px);color:var(--text-dim);letter-spacing:2px;margin-top:6px;font-family:'Share Tech Mono',monospace}

/* BOTTOM NAV */
.bottom-nav{position:fixed;bottom:0;left:0;right:0;height:calc(var(--nav-h) + var(--safe-bottom));padding-bottom:var(--safe-bottom);background:rgba(13,21,32,0.97);border-top:1px solid var(--border);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);display:flex;align-items:stretch;z-index:200}
.nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:none;color:var(--text-dim);font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:600;letter-spacing:1px;cursor:pointer;transition:color 0.2s;padding:0 4px;position:relative}
.nav-btn svg{width:22px;height:22px;transition:transform 0.2s}
.nav-btn.active{color:var(--accent)}
.nav-btn.active svg{transform:scale(1.15);filter:drop-shadow(0 0 6px rgba(0,201,255,0.5))}
.nav-btn.active::after{content:'';position:absolute;top:0;left:20%;right:20%;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);border-radius:0 0 2px 2px}
.nav-btn:active{opacity:0.7}

/* PANEL */
.panel{display:none}
.panel.active{display:block;animation:fadeUp 0.25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* CARD */
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 16px;margin-bottom:14px;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(180deg,var(--accent),var(--accent2))}
.card-title{font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:600;color:var(--accent);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.card-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent)}

/* FORM */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-group.full{grid-column:1/-1}
label{font-size:10px;font-family:'Share Tech Mono',monospace;color:var(--text-dim);letter-spacing:1.5px;text-transform:uppercase}
input,textarea,select{background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text-bright);font-family:'Exo 2',sans-serif;font-size:15px;padding:12px 14px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;width:100%;-webkit-appearance:none;appearance:none}
input:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,201,255,0.08)}
input::placeholder,textarea::placeholder{color:var(--text-dim);opacity:0.6}
input.validated{border-color:var(--accent3);box-shadow:0 0 0 3px rgba(0,255,136,0.08)}

/* MAP SECTION */
.map-section{margin-top:4px}
.map-toggle-btn{
  display:flex;align-items:center;gap:8px;width:100%;
  background:var(--surface2);border:1px dashed rgba(0,201,255,0.3);
  border-radius:6px;padding:11px 14px;color:var(--text-dim);
  font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:1px;
  cursor:pointer;transition:all 0.2s;text-align:left;
}
.map-toggle-btn:hover,.map-toggle-btn:active{border-color:var(--accent);color:var(--accent);background:rgba(0,201,255,0.05)}
.map-toggle-btn svg{width:16px;height:16px;flex-shrink:0;transition:transform 0.3s}
.map-toggle-btn.open svg.chevron{transform:rotate(180deg)}

.map-wrapper{
  display:none;margin-top:10px;border-radius:8px;overflow:hidden;
  border:1px solid var(--border);position:relative;
}
.map-wrapper.open{display:block;animation:fadeUp 0.2s ease}

#map{height:280px;width:100%;background:#0d1520}

/* Leaflet dark override */
.leaflet-container{background:#0d1520}
.leaflet-tile-pane{filter:brightness(0.85) saturate(0.9) hue-rotate(180deg) invert(1)}
.leaflet-control-attribution{display:none!important}
.leaflet-control-zoom a{background:var(--surface)!important;color:var(--accent)!important;border-color:var(--border)!important}
.leaflet-control-zoom a:hover{background:var(--surface2)!important}

/* Custom pin marker */
.custom-pin{
  width:28px;height:28px;border-radius:50% 50% 50% 0;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  transform:rotate(-45deg);
  border:2px solid rgba(255,255,255,0.3);
  box-shadow:0 0 0 4px rgba(0,201,255,0.2),0 4px 12px rgba(0,0,0,0.5);
}
.custom-pin::after{
  content:'';position:absolute;width:10px;height:10px;
  background:#fff;border-radius:50%;top:50%;left:50%;
  transform:translate(-50%,-50%);
}

.map-controls{
  display:flex;gap:8px;padding:10px;
  background:var(--surface2);border-top:1px solid var(--border);
  flex-wrap:wrap;
}
.map-hint{
  font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--text-dim);
  letter-spacing:1px;padding:0 2px;display:flex;align-items:center;gap:6px;width:100%;
}
.map-hint svg{width:12px;height:12px;flex-shrink:0}

.coords-display{
  background:var(--surface);border:1px solid var(--border);border-radius:6px;
  padding:10px 12px;margin:8px 10px 0;
  font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-dim);
  display:flex;align-items:center;justify-content:space-between;gap:8px;
}
.coords-display.has-coords{border-color:rgba(0,201,255,0.3);color:var(--accent)}
.coords-val{font-size:12px;color:var(--text-bright);flex:1;word-break:break-all}
.plus-code-display{
  background:var(--surface);border:1px solid rgba(0,255,136,0.25);border-radius:6px;
  padding:10px 12px;margin:6px 10px 10px;
  font-family:'Share Tech Mono',monospace;
  display:none;
}
.plus-code-display.show{display:block}
.plus-code-label{font-size:9px;color:var(--accent3);letter-spacing:2px;margin-bottom:4px}
.plus-code-val{font-size:14px;color:var(--text-bright);font-weight:700;letter-spacing:1px}

/* VALIDATE BUTTON */
.btn-validate{
  display:flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,201,255,0.15));
  border:1px solid rgba(0,255,136,0.4);
  color:var(--accent3);border-radius:6px;padding:10px 14px;
  font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;
  cursor:pointer;transition:all 0.2s;text-transform:uppercase;white-space:nowrap;
}
.btn-validate svg{width:14px;height:14px;flex-shrink:0}
.btn-validate:active{background:rgba(0,255,136,0.2);transform:scale(0.97)}
.btn-validate.validated{background:rgba(0,255,136,0.2);border-color:var(--accent3);box-shadow:0 0 12px rgba(0,255,136,0.15)}

.btn-gps{
  display:flex;align-items:center;gap:8px;
  background:rgba(0,102,255,0.15);border:1px solid rgba(0,102,255,0.4);
  color:var(--accent);border-radius:6px;padding:10px 14px;
  font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;
  cursor:pointer;transition:all 0.2s;text-transform:uppercase;white-space:nowrap;
}
.btn-gps svg{width:14px;height:14px;flex-shrink:0}
.btn-gps:active{background:rgba(0,102,255,0.25)}
.btn-gps.loading svg{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* VALIDATED BADGE */
.validated-badge{
  display:none;align-items:center;gap:6px;
  background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);
  border-radius:4px;padding:6px 10px;margin-top:8px;
  font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent3);letter-spacing:1px;
}
.validated-badge.show{display:flex}
.validated-badge svg{width:12px;height:12px}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 20px;border-radius:7px;border:none;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:600;letter-spacing:1px;cursor:pointer;transition:all 0.18s;text-transform:uppercase;white-space:nowrap;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.btn:active{transform:scale(0.96)}
.btn svg{width:16px;height:16px;flex-shrink:0}
.btn-primary{background:linear-gradient(135deg,#00c9ff,#0066ff);color:#fff;box-shadow:0 4px 18px rgba(0,102,255,0.3)}
.btn-success{background:linear-gradient(135deg,#00ff88,#00c9ff);color:#080c14;box-shadow:0 4px 18px rgba(0,255,136,0.2)}
.btn-outline{background:transparent;color:var(--accent);border:1px solid rgba(0,201,255,0.4)}
.btn-outline:active{background:rgba(0,201,255,0.08)}
.btn-whatsapp{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 4px 18px rgba(37,211,102,0.3)}
.btn-full{width:100%}
.btn-row{display:flex;flex-direction:column;gap:10px;margin-top:18px}

/* PREVIEW */
.preview-editable{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:16px;font-family:'Share Tech Mono',monospace;font-size:13px;line-height:1.85;color:var(--text-bright);resize:none;min-height:300px;outline:none;transition:border-color 0.2s;-webkit-overflow-scrolling:touch}
.preview-editable:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,201,255,0.08)}

/* TOAST */
.toast{position:fixed;bottom:calc(var(--nav-h) + var(--safe-bottom) + 12px);left:50%;transform:translateX(-50%) translateY(20px);opacity:0;background:linear-gradient(135deg,rgba(0,255,136,0.92),rgba(0,201,255,0.92));color:#080c14;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;padding:9px 22px;border-radius:20px;z-index:999;transition:opacity 0.25s,transform 0.25s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:500;align-items:flex-end;justify-content:center;padding:0}
.modal-overlay.show{display:flex;animation:fadeIn 0.2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border:1px solid rgba(37,211,102,0.25);border-bottom:none;border-radius:18px 18px 0 0;padding:20px 18px calc(20px + var(--safe-bottom));width:100%;max-width:520px;box-shadow:0 -8px 40px rgba(0,0,0,0.5);animation:slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 16px}
.modal-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.wa-icon{width:42px;height:42px;background:linear-gradient(135deg,#25D366,#128C7E);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.modal-title{font-family:'Rajdhani',sans-serif;font-size:19px;font-weight:700;color:var(--text-bright)}
.modal-sub{font-size:11px;color:var(--text-dim);margin-top:2px}
.chat-options{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.chat-option{display:flex;align-items:center;gap:12px;padding:13px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all 0.2s;color:var(--text);font-family:'Exo 2',sans-serif;font-size:14px;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.chat-option:active{background:rgba(37,211,102,0.05)}
.chat-option.selected{border-color:#25D366;background:rgba(37,211,102,0.07);color:#25D366}
.chat-avatar{width:36px;height:36px;background:linear-gradient(135deg,#1a3050,#0d1520);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid var(--border);flex-shrink:0}
.modal-number-label{font-size:10px;color:var(--text-dim);display:block;margin-bottom:6px;font-family:'Share Tech Mono',monospace;letter-spacing:1px}
.modal-actions{display:flex;gap:10px;margin-top:16px}
.btn-cancel{flex:1;padding:13px;background:transparent;border:1px solid var(--border);color:var(--text-dim);border-radius:7px;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:1px;transition:all 0.2s;touch-action:manipulation}
.btn-cancel:active{border-color:var(--danger);color:var(--danger)}

/* TABLE */
.table-header-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.count-badge{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-dim);background:var(--surface2);border:1px solid var(--border);padding:4px 12px;border-radius:20px}
.count-badge span{color:var(--accent);font-weight:bold}
.table-actions{display:flex;gap:8px;flex-wrap:wrap}
.table-wrap{overflow-x:auto;border-radius:8px;border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:12px}
thead tr{background:linear-gradient(135deg,rgba(0,201,255,0.07),rgba(0,102,255,0.07))}
th{padding:10px 12px;text-align:left;font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--accent);letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:9px 12px;border-bottom:1px solid rgba(26,48,80,0.5);color:var(--text);font-family:'Share Tech Mono',monospace;font-size:11px;vertical-align:middle}
tr:hover td{background:rgba(0,201,255,0.03)}
tr:last-child td{border-bottom:none}
.badge{display:inline-block;padding:2px 7px;border-radius:3px;font-size:9px;letter-spacing:1px;font-weight:600}
.badge-green{background:rgba(0,255,136,0.1);color:var(--accent3);border:1px solid rgba(0,255,136,0.2)}
.btn-del{background:transparent;border:1px solid rgba(255,64,96,0.3);color:var(--danger);border-radius:4px;padding:4px 9px;font-size:11px;cursor:pointer;transition:all 0.2s;font-family:'Rajdhani',sans-serif;font-weight:600;touch-action:manipulation}
.btn-del:active{background:rgba(255,64,96,0.1)}
.record-cards{display:none;flex-direction:column;gap:10px}
.rec-card{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;position:relative}
.rec-card-name{font-size:15px;font-weight:600;color:var(--text-bright);font-family:'Exo 2',sans-serif;margin-bottom:8px}
.rec-card-fields{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.rec-field{display:flex;flex-direction:column;gap:2px}
.rec-field-label{font-size:8px;color:var(--text-dim);font-family:'Share Tech Mono',monospace;letter-spacing:1.5px;text-transform:uppercase}
.rec-field-value{font-size:11px;color:var(--text);font-family:'Share Tech Mono',monospace;word-break:break-all}
.rec-field-value.qr{color:var(--accent3)}
.rec-card-footer{display:flex;justify-content:flex-end;margin-top:10px;padding-top:8px;border-top:1px solid rgba(26,48,80,0.4)}
.date-group-header{padding:8px 12px;background:rgba(0,201,255,0.05);border-bottom:1px solid var(--border);font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:2px}
.empty-state{text-align:center;padding:40px 20px;color:var(--text-dim)}
.empty-state .icon{font-size:40px;margin-bottom:10px;opacity:0.4}
.empty-state p{font-size:12px;font-family:'Share Tech Mono',monospace;letter-spacing:1px}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* ── RESPONSIVE ── */
@media(max-width:480px){
  .container{padding:12px 10px 8px}
  header{padding:16px 0 14px}
  h1{font-size:20px;letter-spacing:0.5px}
  .subtitle{font-size:8px;letter-spacing:1px}
  .logo-badge{font-size:9px;padding:4px 10px}
  .card{padding:14px 12px;border-radius:8px}
  .card-title{font-size:10px;letter-spacing:2px;margin-bottom:12px}
  .form-grid{grid-template-columns:1fr;gap:10px}
  .form-group.full{grid-column:1}
  label{font-size:9px}
  input,textarea{font-size:16px;padding:13px 12px}
  .btn{font-size:14px;padding:14px 16px}
  .btn svg{width:15px;height:15px}
  .btn-row{gap:8px;margin-top:14px}
  .preview-editable{font-size:12px;min-height:260px;padding:13px}
  .table-wrap{display:none}
  .record-cards{display:flex}
  .table-actions{width:100%}
  .table-actions .btn{font-size:12px;padding:10px 12px}
  .modal{padding:16px 14px calc(16px + var(--safe-bottom));border-radius:16px 16px 0 0}
  .modal-title{font-size:17px}
  .chat-option{padding:12px}
  .modal-actions{flex-direction:column}
  .btn-cancel{padding:12px}
  .count-badge{font-size:10px}
  .table-header-row{flex-direction:column}
  .table-actions{justify-content:stretch}
  .table-actions .btn{flex:1;font-size:11px;padding:10px 8px}
  #map{height:240px}
  .map-controls{flex-direction:column}
  .btn-validate,.btn-gps{width:100%;justify-content:center}
}
@media(min-width:481px) and (max-width:640px){
  .form-grid{grid-template-columns:1fr 1fr}
  .form-group.full{grid-column:1/-1}
  input,textarea{font-size:16px}
  .table-wrap{display:none}
  .record-cards{display:flex}
}
@media(min-width:641px) and (max-width:900px){
  .form-grid{grid-template-columns:1fr 1fr}
  .form-group.full{grid-column:1/-1}
  .btn-row{flex-direction:row;flex-wrap:wrap}
  .table-wrap{display:block}
  .record-cards{display:none}
  th{font-size:8px;padding:8px 9px}
  td{font-size:10px;padding:8px 9px}
}
@media(min-width:901px){
  .container{padding:20px 24px 10px}
  header{padding:32px 0 24px}
  .form-grid{grid-template-columns:repeat(3,1fr)}
  .form-group.full{grid-column:1/-1}
  .card{padding:24px 22px}
  .btn-row{flex-direction:row;flex-wrap:wrap;align-items:center}
  .btn-full{width:auto}
  .table-wrap{display:block}
  .record-cards{display:none}
  .bottom-nav{max-width:480px;left:50%;transform:translateX(-50%)}
  .modal-overlay{align-items:center}
  .modal{border-radius:14px;border:1px solid rgba(37,211,102,0.25);max-width:460px;animation:fadeIn 0.2s;padding:24px}
  .modal-handle{display:none}
  #map{height:320px}
}
</style>
</head>
<body>
<div class="app-shell">
  <div class="scroll-area">
    <div class="container">

      <header>
        <div class="logo-badge">⚡ <span>SISTEMA MTTO</span> · v2.1</div>
        <h1>SCRIPT <em>REINVENTARIADO</em><br>Y ETIQUETADO MTTO</h1>
        <p class="subtitle">// GESTIÓN DE INVENTARIO · CAMPO · REGISTRO</p>
      </header>

      <!-- ── FORMULARIO ── -->
      <div id="tab-form" class="panel active">
        <div class="card">
          <div class="card-title">📋 Datos de Registro</div>
          <div class="form-grid">
            <div class="form-group full">
              <label>— Nombre —</label>
              <input type="text" id="f-nombre" placeholder="EVAN JOSHUA QUIROGA HOLGUIN" autocomplete="off" autocapitalize="words">
            </div>
            <div class="form-group">
              <label>Brazo</label>
              <input type="text" id="f-brazo" placeholder="LAGO_ESCONDIDO_GDL 0/5/8" autocomplete="off">
            </div>
            <div class="form-group">
              <label>QR Nuevo</label>
              <input type="text" id="f-qr-nuevo" placeholder="TP910890" autocomplete="off" autocapitalize="characters">
            </div>
            <div class="form-group">
              <label>QR Viejo</label>
              <input type="text" id="f-qr-viejo" placeholder="TP154255" autocomplete="off" autocapitalize="characters">
            </div>

            <!-- COORDENADAS CON MAPA -->
            <div class="form-group full">
              <label>Coordenadas</label>
              <input type="text" id="f-coords" placeholder="Selecciona en el mapa o escribe manualmente" autocomplete="off" oninput="onCoordsInput()">
              <div class="validated-badge" id="validated-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                COORDENADAS VALIDADAS — CÓDIGO PLUS GENERADO
              </div>

              <!-- Mapa toggle -->
              <div class="map-section">
                <button class="map-toggle-btn" id="map-toggle-btn" onclick="toggleMap()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span id="map-toggle-label">ABRIR MAPA INTERACTIVO</span>
                  <svg class="chevron" style="margin-left:auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>

                <div class="map-wrapper" id="map-wrapper">
                  <div id="map"></div>
                  <div class="coords-display" id="coords-display">
                    <svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                    <span class="coords-val" id="coords-val-display">Toca el mapa para colocar el pin</span>
                  </div>
                  <div class="plus-code-display" id="plus-code-box">
                    <div class="plus-code-label">📍 CÓDIGO PLUS GENERADO</div>
                    <div class="plus-code-val" id="plus-code-val">—</div>
                  </div>
                  <div class="map-controls">
                    <div class="map-hint">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Toca o arrastra el pin para ajustar la ubicación exacta
                    </div>
                    <button class="btn-gps" id="btn-gps" onclick="useMyLocation()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                      MI UBICACIÓN
                    </button>
                    <button class="btn-validate" id="btn-validate" onclick="validateCoords()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      VALIDAR COORDENADAS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Fecha</label>
              <input type="text" id="f-fecha" placeholder="6/05/2026" autocomplete="off">
            </div>
            <div class="form-group">
              <label>Capacidad</label>
              <input type="text" id="f-capacidad" placeholder="1/16" autocomplete="off">
            </div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary btn-full" onclick="generatePreview()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><polyline points="9 11 12 14 22 4"/></svg>
              GENERAR SCRIPT
            </button>
            <button class="btn btn-outline btn-full" onclick="clearForm()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
              LIMPIAR
            </button>
          </div>
        </div>
      </div>

      <!-- ── SCRIPT ── -->
      <div id="tab-preview" class="panel">
        <div class="card">
          <div class="card-title">📄 Script Generado — Editable</div>
          <textarea class="preview-editable" id="preview-text" spellcheck="false"
            placeholder="Completa el formulario y presiona GENERAR SCRIPT..."></textarea>
          <div class="btn-row">
            <button class="btn btn-outline btn-full" onclick="copyText()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              COPIAR TEXTO
            </button>
            <button class="btn btn-whatsapp btn-full" onclick="showWAModal()">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ENVIAR POR WHATSAPP
            </button>
            <button class="btn btn-success btn-full" onclick="saveToTable()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              GUARDAR EN TABLA
            </button>
          </div>
        </div>
      </div>

      <!-- ── TABLA ── -->
      <div id="tab-excel" class="panel">
        <div class="card">
          <div class="table-header-row">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <div class="card-title" style="margin-bottom:0">📊 Registros</div>
              <div class="count-badge">Total: <span id="record-count">0</span></div>
            </div>
            <div class="table-actions">
              <button class="btn btn-outline" onclick="switchTab('form')" style="padding:9px 13px;font-size:12px">
                <svg style="width:13px;height:13px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                NUEVO
              </button>
              <button class="btn btn-success" onclick="downloadExcel()" style="padding:9px 13px;font-size:12px">
                <svg style="width:13px;height:13px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                EXCEL
              </button>
            </div>
          </div>
          <div class="table-wrap" id="desktop-table-container">
            <div class="empty-state"><div class="icon">📋</div><p>// SIN REGISTROS</p></div>
          </div>
          <div class="record-cards" id="mobile-cards-container">
            <div class="empty-state"><div class="icon">📋</div><p>// SIN REGISTROS</p></div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- BOTTOM NAV -->
  <nav class="bottom-nav">
    <button class="nav-btn active" id="nav-form" onclick="switchTab('form')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h5M8 16h3"/></svg>
      FORMULARIO
    </button>
    <button class="nav-btn" id="nav-preview" onclick="switchTab('preview')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
      SCRIPT
    </button>
    <button class="nav-btn" id="nav-excel" onclick="switchTab('excel')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
      TABLA
    </button>
  </nav>
</div>

<!-- WHATSAPP MODAL -->
<div class="modal-overlay" id="wa-modal">
  <div class="modal">
    <div class="modal-handle"></div>
    <div class="modal-header">
      <div class="wa-icon">📱</div>
      <div>
        <div class="modal-title">Enviar por WhatsApp</div>
        <div class="modal-sub">Selecciona el destino del mensaje</div>
      </div>
    </div>
    <div class="chat-options">
      <div class="chat-option" onclick="selectChat(this,'personal')">
        <div class="chat-avatar">👤</div>
        <div><div style="font-weight:600;font-size:14px">Número personal</div><div style="font-size:11px;color:var(--text-dim);margin-top:2px">Contacto directo</div></div>
        <div style="margin-left:auto;font-size:18px;color:var(--text-dim)">›</div>
      </div>
      <div class="chat-option" onclick="selectChat(this,'grupo')">
        <div class="chat-avatar">👥</div>
        <div><div style="font-weight:600;font-size:14px">Grupo de WhatsApp</div><div style="font-size:11px;color:var(--text-dim);margin-top:2px">Número del admin del grupo</div></div>
        <div style="margin-left:auto;font-size:18px;color:var(--text-dim)">›</div>
      </div>
    </div>
    <div>
      <span class="modal-number-label">NÚMERO (código país + número, sin + ni espacios)</span>
      <input type="tel" id="wa-number" placeholder="Ej: 523312345678" inputmode="numeric" style="font-size:16px">
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeWAModal()">CANCELAR</button>
      <button class="btn btn-whatsapp" style="flex:2" onclick="sendWhatsApp()">
        ENVIAR
        <svg style="width:16px;height:16px;margin-left:4px" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
</div>

<div class="toast" id="toast">✓ Listo</div>

<script>
// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let records = [];
try { records = JSON.parse(localStorage.getItem('mtto_records') || '[]'); } catch(e){}

let mapInstance = null;
let mapMarker   = null;
let mapOpen     = false;
let selectedLat = null;
let selectedLng = null;
let plusCodeValidated = '';

// ═══════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════
function switchTab(tab) {
  ['form','preview','excel'].forEach(t => {
    document.getElementById('tab-'+t).classList.toggle('active', t===tab);
    document.getElementById('nav-'+t).classList.toggle('active', t===tab);
  });
  if (tab==='excel') renderAll();
  if (tab==='form' && mapOpen && mapInstance) {
    setTimeout(()=>{ mapInstance.invalidateSize(); }, 100);
  }
}

// ═══════════════════════════════════════════════
// MAP
// ═══════════════════════════════════════════════
function toggleMap() {
  const wrapper = document.getElementById('map-wrapper');
  const btn     = document.getElementById('map-toggle-btn');
  const label   = document.getElementById('map-toggle-label');
  mapOpen = !mapOpen;
  wrapper.classList.toggle('open', mapOpen);
  btn.classList.toggle('open', mapOpen);
  label.textContent = mapOpen ? 'CERRAR MAPA' : 'ABRIR MAPA INTERACTIVO';

  if (mapOpen && !mapInstance) {
    initMap();
  } else if (mapOpen && mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 100);
  }
}

function initMap() {
  // Default center: Guadalajara, México
  const defaultLat = 20.6597, defaultLng = -103.3496;

  mapInstance = L.map('map', {
    center: [defaultLat, defaultLng],
    zoom: 14,
    zoomControl: true,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(mapInstance);

  // Custom pin icon
  const pinIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:linear-gradient(135deg,#00c9ff,#0066ff);
      transform:rotate(-45deg);
      border:2px solid rgba(255,255,255,0.5);
      box-shadow:0 0 0 4px rgba(0,201,255,0.25),0 4px 14px rgba(0,0,0,0.6);
      position:relative;
    ">
      <div style="
        position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;
        top:50%;left:50%;transform:translate(-50%,-50%);
      "></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });

  // Click on map → place/move marker
  mapInstance.on('click', function(e) {
    placeMarker(e.latlng.lat, e.latlng.lng, pinIcon);
  });

  // If coords already in field, try to parse and center
  const existing = document.getElementById('f-coords').value.trim();
  if (existing) {
    tryParseCoordsToMap(existing, pinIcon);
  }

  setTimeout(() => mapInstance.invalidateSize(), 150);
}

function placeMarker(lat, lng, icon) {
  selectedLat = lat;
  selectedLng = lng;

  if (!icon) {
    icon = mapMarker ? mapMarker.options.icon : createDefaultIcon();
  }

  if (mapMarker) {
    mapMarker.setLatLng([lat, lng]);
  } else {
    mapMarker = L.marker([lat, lng], { icon: icon, draggable: true }).addTo(mapInstance);
    mapMarker.on('dragend', function(e) {
      const pos = e.target.getLatLng();
      placeMarker(pos.lat, pos.lng);
    });
  }

  updateCoordsDisplay(lat, lng);
}

function createDefaultIcon() {
  return L.divIcon({
    className:'',
    html:`<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#00c9ff,#0066ff);transform:rotate(-45deg);border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 0 4px rgba(0,201,255,0.25),0 4px 14px rgba(0,0,0,0.6);position:relative"><div style="position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)"></div></div>`,
    iconSize:[28,28], iconAnchor:[14,28]
  });
}

function updateCoordsDisplay(lat, lng) {
  const dispEl  = document.getElementById('coords-display');
  const dispVal = document.getElementById('coords-val-display');
  const plusBox = document.getElementById('plus-code-box');
  const plusVal = document.getElementById('plus-code-val');

  dispEl.classList.add('has-coords');

  const plusCode = latLngToPlusCode(lat, lng);
  dispVal.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  plusVal.textContent  = plusCode;
  plusBox.classList.add('show');

  // Auto-fill the field with Plus Code
  document.getElementById('f-coords').value = plusCode;
  plusCodeValidated = '';
  document.getElementById('validated-badge').classList.remove('show');
  document.getElementById('btn-validate').classList.remove('validated');
}

function tryParseCoordsToMap(text, icon) {
  // Try decimal lat,lng
  const m = text.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (m) {
    const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      mapInstance.setView([lat, lng], 16);
      placeMarker(lat, lng, icon || createDefaultIcon());
    }
  }
}

function useMyLocation() {
  const btn = document.getElementById('btn-gps');
  if (!navigator.geolocation) { showToast('⚠️ GPS no disponible en este dispositivo'); return; }
  btn.classList.add('loading');
  btn.querySelector('svg').style.animation = 'spin 1s linear infinite';
  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.classList.remove('loading');
      btn.querySelector('svg').style.animation = '';
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      if (!mapOpen) toggleMap();
      setTimeout(() => {
        mapInstance.setView([lat, lng], 17);
        placeMarker(lat, lng, createDefaultIcon());
        showToast('✓ Ubicación GPS obtenida');
      }, 300);
    },
    err => {
      btn.classList.remove('loading');
      btn.querySelector('svg').style.animation = '';
      showToast('⚠️ No se pudo obtener el GPS. Activa los permisos.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function validateCoords() {
  const val = document.getElementById('f-coords').value.trim();
  if (!val) { showToast('⚠️ No hay coordenadas para validar'); return; }

  const btn = document.getElementById('btn-validate');
  const badge = document.getElementById('validated-badge');
  const coordInput = document.getElementById('f-coords');

  // If we have a selected point on map, use that Plus Code
  if (selectedLat !== null && selectedLng !== null) {
    const plus = latLngToPlusCode(selectedLat, selectedLng);
    coordInput.value = plus;
    plusCodeValidated = plus;
    coordInput.classList.add('validated');
    btn.classList.add('validated');
    badge.classList.add('show');
    document.getElementById('plus-code-val').textContent = plus;
    document.getElementById('plus-code-box').classList.add('show');
    showToast('✓ Coordenadas validadas: ' + plus);
    return;
  }

  // Try to parse typed text as lat,lng
  const m = val.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (m) {
    const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const plus = latLngToPlusCode(lat, lng);
      coordInput.value = plus;
      plusCodeValidated = plus;
      selectedLat = lat; selectedLng = lng;
      coordInput.classList.add('validated');
      btn.classList.add('validated');
      badge.classList.add('show');
      if (!mapOpen) toggleMap();
      setTimeout(() => {
        mapInstance.setView([lat, lng], 16);
        placeMarker(lat, lng, createDefaultIcon());
      }, 300);
      document.getElementById('plus-code-val').textContent = plus;
      document.getElementById('plus-code-box').classList.add('show');
      showToast('✓ Validado: ' + plus);
      return;
    }
  }

  // If it's already a Plus Code format, accept it
  if (/^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,}/i.test(val.replace(/\s.*/, ''))) {
    plusCodeValidated = val;
    coordInput.classList.add('validated');
    btn.classList.add('validated');
    badge.classList.add('show');
    showToast('✓ Código Plus validado');
    return;
  }

  showToast('⚠️ Usa el mapa o escribe lat, lng (ej: 20.659, -103.349)');
}

function onCoordsInput() {
  // Reset validation when user types manually
  plusCodeValidated = '';
  document.getElementById('f-coords').classList.remove('validated');
  document.getElementById('btn-validate').classList.remove('validated');
  document.getElementById('validated-badge').classList.remove('show');
}

// ═══════════════════════════════════════════════
// PLUS CODE ALGORITHM (Open Location Code)
// ═══════════════════════════════════════════════
function latLngToPlusCode(lat, lng, codeLength) {
  codeLength = codeLength || 10;
  const ALPHABET = '23456789CFGHJMPQRVWX';
  const BASE = 20;
  const PAIR_LENGTH = 10;
  const GRID_SIZE = 4;

  // Clip lat/lng
  lat = Math.min(90, Math.max(-90, lat));
  lng = ((lng + 180) % 360) - 180;
  if (lng < -180) lng += 360;

  lat += 90;
  lng += 180;

  let code = '';
  let latVal = lat * Math.pow(20, 3);
  let lngVal = lng * Math.pow(20, 3);

  // Pair encoding (first 10 chars = 5 pairs)
  for (let i = 0; i < PAIR_LENGTH / 2; i++) {
    let latD = Math.floor(latVal / Math.pow(20, 2 - i));
    let lngD = Math.floor(lngVal / Math.pow(20, 2 - i));
    latD = latD % 20;
    lngD = lngD % 20;
    code += ALPHABET[latD] + ALPHABET[lngD];
    if (i === 0 && code.length < 8) {
      // nothing
    }
  }

  // Rebuild properly using standard algorithm
  code = encodePlusCode(lat - 90, lng - 180, codeLength);
  return code;
}

function encodePlusCode(lat, lng, codeLen) {
  const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
  const ENCODING_BASE = CODE_ALPHABET.length; // 20
  const SEPARATOR = '+';
  const SEPARATOR_POSITION = 8;
  const PADDING_CHARACTER = '0';
  const LAT_MAX = 90, LNG_MAX = 180;
  const PAIR_CODE_LENGTH = 10;
  const GRID_CODE_LENGTH = 5;
  const GRID_ROWS = 5, GRID_COLS = 4;

  codeLen = codeLen || 10;

  // Clip coordinates
  lat = Math.min(LAT_MAX - 1e-10, lat);
  lng = ((lng + 180) % 360) - 180;
  if (lng < -LNG_MAX) lng += 360;

  // Encode
  let latVal = (lat + LAT_MAX) * 1e10 + 0.5 | 0;
  let lngVal = (lng + LNG_MAX) * 1e10 + 0.5 | 0;

  let code = '';

  // Extra grid refinement (chars 11+)
  if (codeLen > PAIR_CODE_LENGTH) {
    for (let i = 0; i < GRID_CODE_LENGTH; i++) {
      const latDigit = Math.floor(latVal / 200000) % GRID_ROWS;
      const lngDigit = Math.floor(lngVal / 250000) % GRID_COLS;
      const ndx = latDigit * GRID_COLS + lngDigit;
      code = CODE_ALPHABET[ndx] + code;
      latVal = Math.floor(latVal * GRID_ROWS) % 1000000000;
      lngVal = Math.floor(lngVal * GRID_COLS) % 1000000000;
    }
    latVal = Math.floor((lat + LAT_MAX) * 1e10 + 0.5);
    lngVal = Math.floor((lng + LNG_MAX) * 1e10 + 0.5);
  }

  // Pair encoding
  let pairCode = '';
  let divisor = Math.pow(ENCODING_BASE, 3);
  for (let i = 0; i < PAIR_CODE_LENGTH / 2; i++) {
    const latNdx = Math.floor(latVal / divisor) % ENCODING_BASE;
    const lngNdx = Math.floor(lngVal / divisor) % ENCODING_BASE;
    pairCode += CODE_ALPHABET[latNdx] + CODE_ALPHABET[lngNdx];
    divisor /= ENCODING_BASE;
  }

  code = pairCode + code;

  // Insert separator
  if (code.length < SEPARATOR_POSITION) {
    code = code.padEnd(SEPARATOR_POSITION, PADDING_CHARACTER);
  }
  code = code.slice(0, SEPARATOR_POSITION) + SEPARATOR + code.slice(SEPARATOR_POSITION);

  // Trim to requested length (account for separator)
  const finalLen = codeLen <= SEPARATOR_POSITION ? SEPARATOR_POSITION + 1 : codeLen + 1;
  return code.slice(0, finalLen);
}

// ═══════════════════════════════════════════════
// GENERATE SCRIPT
// ═══════════════════════════════════════════════
function generatePreview() {
  const g = id => document.getElementById(id).value.trim();
  const nombre    = g('f-nombre');
  const brazo     = g('f-brazo');
  const qrNuevo   = g('f-qr-nuevo');
  const qrViejo   = g('f-qr-viejo');
  const coords    = g('f-coords') || (selectedLat ? latLngToPlusCode(selectedLat, selectedLng) : '');
  const fecha     = g('f-fecha') || getToday();
  const capacidad = g('f-capacidad');

  if (!nombre) { showToast('⚠️ El NOMBRE es requerido'); return; }

  document.getElementById('preview-text').value =
`*SCRIPT REINVENTARIADO Y ETIQUETADO MTTO*
*-NOMBRE-*
${nombre}
*BRAZO*
${brazo||'—'}
*QR Nuevo*
${qrNuevo||'—'}
*QR Viejo*
${qrViejo||'—'}
*COORDENADAS*
${coords||'—'}
*FECHA*
${fecha}
*CAPACIDAD*
${capacidad||'—'}`;

  switchTab('preview');
}

function getToday() {
  const d = new Date();
  return `${d.getDate()}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function clearForm() {
  ['f-nombre','f-brazo','f-qr-nuevo','f-qr-viejo','f-coords','f-fecha','f-capacidad']
    .forEach(id => { document.getElementById(id).value=''; document.getElementById(id).classList && document.getElementById(id).classList.remove('validated'); });
  selectedLat = selectedLng = null;
  plusCodeValidated = '';
  document.getElementById('validated-badge').classList.remove('show');
  document.getElementById('btn-validate').classList.remove('validated');
  document.getElementById('plus-code-box').classList.remove('show');
  document.getElementById('coords-val-display').textContent = 'Toca el mapa para colocar el pin';
  document.getElementById('coords-display').classList.remove('has-coords');
  if (mapMarker && mapInstance) { mapInstance.removeLayer(mapMarker); mapMarker = null; }
  document.getElementById('f-nombre').focus();
}

// ═══════════════════════════════════════════════
// COPY
// ═══════════════════════════════════════════════
function copyText() {
  const text = document.getElementById('preview-text').value;
  if (!text) { showToast('⚠️ No hay texto para copiar'); return; }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(()=>showToast('✓ Copiado'));
  } else {
    const ta = document.getElementById('preview-text');
    ta.select(); document.execCommand('copy');
    showToast('✓ Copiado');
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 2600);
}

// ═══════════════════════════════════════════════
// WHATSAPP
// ═══════════════════════════════════════════════
function showWAModal() {
  const text = document.getElementById('preview-text').value;
  if (!text.trim()) { showToast('⚠️ Primero genera el script'); return; }
  document.getElementById('wa-modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeWAModal() {
  document.getElementById('wa-modal').classList.remove('show');
  document.body.style.overflow = '';
  document.querySelectorAll('.chat-option').forEach(o=>o.classList.remove('selected'));
}
function selectChat(el) {
  document.querySelectorAll('.chat-option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('wa-number').focus();
}
function sendWhatsApp() {
  const number = document.getElementById('wa-number').value.replace(/\D/g,'');
  if (!number) { showToast('⚠️ Ingresa un número'); return; }
  const text = encodeURIComponent(document.getElementById('preview-text').value);
  window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  closeWAModal();
  showToast('✓ Abriendo WhatsApp...');
}
document.getElementById('wa-modal').addEventListener('click', e=>{
  if (e.target===e.currentTarget) closeWAModal();
});

// ═══════════════════════════════════════════════
// SAVE / TABLE
// ═══════════════════════════════════════════════
function saveToTable() {
  const text = document.getElementById('preview-text').value;
  let rec = {};
  if (text.trim()) {
    rec = parseScript(text);
  } else {
    const g = id=>document.getElementById(id).value.trim();
    rec = { nombre:g('f-nombre'),brazo:g('f-brazo'),qrNuevo:g('f-qr-nuevo'),qrViejo:g('f-qr-viejo'),coords:g('f-coords'),fecha:g('f-fecha')||getToday(),capacidad:g('f-capacidad') };
  }
  if (!rec.nombre || rec.nombre==='—') { showToast('⚠️ Sin datos para guardar'); return; }
  rec.id = Date.now();
  records.push(rec);
  saveRecords();
  renderAll();
  showToast('✓ Guardado en tabla');
  switchTab('excel');
}

function parseScript(text) {
  const lines = text.split('\n').map(l=>l.trim());
  const after = label => {
    const i = lines.findIndex(l=>l.includes(label));
    return i!==-1 && lines[i+1] ? lines[i+1].replace(/\*/g,'').trim() : '—';
  };
  return { nombre:after('-NOMBRE-'),brazo:after('BRAZO'),qrNuevo:after('QR Nuevo'),qrViejo:after('QR Viejo'),coords:after('COORDENADAS'),fecha:after('FECHA'),capacidad:after('CAPACIDAD') };
}

function saveRecords() {
  try { localStorage.setItem('mtto_records', JSON.stringify(records)); } catch(e){}
}

function deleteRecord(id) {
  if (!confirm('¿Eliminar este registro?')) return;
  records = records.filter(r=>r.id!==id);
  saveRecords(); renderAll();
  showToast('✓ Eliminado');
}

// ═══════════════════════════════════════════════
// RENDER TABLE
// ═══════════════════════════════════════════════
function groupByDate(recs) {
  const g={};
  recs.forEach(r=>{ const d=r.fecha||'—'; if(!g[d]) g[d]=[]; g[d].push(r); });
  return g;
}
function sortedDates(g) {
  return Object.keys(g).sort((a,b)=>{
    const pa=a.split('/'),pb=b.split('/');
    return new Date(pb[2],pb[1]-1,pb[0]) - new Date(pa[2],pa[1]-1,pa[0]);
  });
}
function esc(s){ return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):'—'; }

function renderAll() {
  document.getElementById('record-count').textContent = records.length;
  const dtc = document.getElementById('desktop-table-container');
  const mcc = document.getElementById('mobile-cards-container');
  if (records.length===0) {
    const empty=`<div class="empty-state"><div class="icon">📋</div><p>// SIN REGISTROS</p></div>`;
    dtc.innerHTML=empty; mcc.innerHTML=empty; return;
  }
  const groups=groupByDate(records), dates=sortedDates(groups);
  let dt='';
  dates.forEach(date=>{
    dt+=`<div class="date-group-header">📅 FECHA: ${date} — ${groups[date].length} registro(s)</div>
    <table><thead><tr><th>#</th><th>Nombre</th><th>Brazo</th><th>QR Nuevo</th><th>QR Viejo</th><th>Coords</th><th>Cap.</th><th>—</th></tr></thead><tbody>`;
    groups[date].forEach((r,i)=>{
      dt+=`<tr><td><span class="badge badge-green">${i+1}</span></td>
        <td style="color:var(--text-bright);font-weight:600;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.nombre)}</td>
        <td>${esc(r.brazo)}</td><td style="color:var(--accent3)">${esc(r.qrNuevo)}</td><td>${esc(r.qrViejo)}</td>
        <td style="max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.coords)}</td>
        <td>${esc(r.capacidad)}</td><td><button class="btn-del" onclick="deleteRecord(${r.id})">✕</button></td></tr>`;
    });
    dt+='</tbody></table>';
  });
  dtc.innerHTML=dt;
  let mc='';
  dates.forEach(date=>{
    mc+=`<div class="date-group-header">📅 ${date} — ${groups[date].length} registro(s)</div>`;
    groups[date].forEach((r)=>{
      mc+=`<div class="rec-card">
        <div class="rec-card-name">${esc(r.nombre)}</div>
        <div class="rec-card-fields">
          <div class="rec-field"><span class="rec-field-label">Brazo</span><span class="rec-field-value">${esc(r.brazo)}</span></div>
          <div class="rec-field"><span class="rec-field-label">Capacidad</span><span class="rec-field-value">${esc(r.capacidad)}</span></div>
          <div class="rec-field"><span class="rec-field-label">QR Nuevo</span><span class="rec-field-value qr">${esc(r.qrNuevo)}</span></div>
          <div class="rec-field"><span class="rec-field-label">QR Viejo</span><span class="rec-field-value">${esc(r.qrViejo)}</span></div>
          <div class="rec-field" style="grid-column:1/-1"><span class="rec-field-label">Coordenadas</span><span class="rec-field-value">${esc(r.coords)}</span></div>
        </div>
        <div class="rec-card-footer"><button class="btn-del" onclick="deleteRecord(${r.id})">✕ BORRAR</button></div>
      </div>`;
    });
  });
  mcc.innerHTML=mc;
}

// ═══════════════════════════════════════════════
// EXCEL
// ═══════════════════════════════════════════════
function downloadExcel() {
  if (!records.length) { showToast('⚠️ Sin registros'); return; }
  const wb = XLSX.utils.book_new();
  const headers=['#','Nombre','Brazo','QR Nuevo','QR Viejo','Coordenadas','Fecha','Capacidad'];
  const rows=[headers,...records.map((r,i)=>[i+1,r.nombre,r.brazo,r.qrNuevo,r.qrViejo,r.coords,r.fecha,r.capacidad])];
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:4},{wch:30},{wch:22},{wch:12},{wch:12},{wch:40},{wch:12},{wch:10}];
  XLSX.utils.book_append_sheet(wb,ws,'Todos los Registros');
  const groups=groupByDate(records);
  Object.entries(groups).forEach(([date,recs])=>{
    const sr=[headers,...recs.map((r,i)=>[i+1,r.nombre,r.brazo,r.qrNuevo,r.qrViejo,r.coords,r.fecha,r.capacidad])];
    const ws2=XLSX.utils.aoa_to_sheet(sr);
    ws2['!cols']=[{wch:4},{wch:30},{wch:22},{wch:12},{wch:12},{wch:40},{wch:12},{wch:10}];
    XLSX.utils.book_append_sheet(wb,ws2,date.replace(/\//g,'-').substring(0,28));
  });
  const n=new Date();
  XLSX.writeFile(wb,`MTTO_Inventario_${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}.xlsx`);
  showToast('✓ Excel descargado');
}

// INIT
document.getElementById('record-count').textContent = records.length;

// ═══════════════════════════════════════════════
// SERVICE WORKER REGISTRATION (PWA)
// ═══════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

// PWA Install prompt
let deferredPrompt;
const installBanner = document.createElement('div');
installBanner.id = 'install-banner';
installBanner.innerHTML = `
  <div style="display:flex;align-items:center;gap:12px;flex:1">
    <span style="font-size:20px">📲</span>
    <div>
      <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:#e8f4ff">Instalar App MTTO</div>
      <div style="font-size:10px;color:#4a6a88;font-family:'Share Tech Mono',monospace">Acceso rápido desde tu pantalla</div>
    </div>
  </div>
  <button id="install-btn" style="background:linear-gradient(135deg,#00c9ff,#0066ff);color:#fff;border:none;border-radius:6px;padding:9px 16px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;cursor:pointer;white-space:nowrap">INSTALAR</button>
  <button id="install-dismiss" style="background:transparent;border:none;color:#4a6a88;font-size:22px;cursor:pointer;padding:0 4px;line-height:1">&#215;</button>
`;
installBanner.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(13,21,32,0.97);border-bottom:1px solid rgba(0,201,255,0.25);backdrop-filter:blur(16px);padding:12px 16px;align-items:center;gap:10px;';
document.body.appendChild(installBanner);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.style.display = 'flex';
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'install-btn') {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(({ outcome }) => {
      if (outcome === 'accepted') showToast('✓ App instalada');
      deferredPrompt = null;
      installBanner.style.display = 'none';
    });
  }
  if (e.target && e.target.id === 'install-dismiss') {
    installBanner.style.display = 'none';
  }
});

window.addEventListener('appinstalled', () => {
  installBanner.style.display = 'none';
  showToast('✓ App instalada correctamente');
});
</script>
</body>
</html>
