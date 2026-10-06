import React, { useState, useEffect } from 'react';
import { ProjectConfig, ToolCard, ServiceCard, TypographyLayer } from '../types';
import { X, Save, RotateCcw, Link2, FileUp, Palette, Phone, Mail, Type, Wrench, Plus, Trash2, ChevronUp, ChevronDown, ListChecks, LayoutGrid, CaseSensitive, KeyRound, Eye, EyeOff, SendHorizonal } from 'lucide-react';
import { DEFAULT_CONFIG, AVAILABLE_ICONS, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS, SYSTEM_FONTS } from '../data';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProjectConfig;
  onSave: (newConfig: ProjectConfig) => void;
}

type Tab = 'contacto' | 'herramientas' | 'servicios' | 'tarjetas' | 'urls' | 'estetica' | 'tipografia' | 'acceso' | 'smtp' | 'rgpd';

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [formData, setFormData] = useState<ProjectConfig>({ ...config });
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('contacto');

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...DEFAULT_CONFIG, ...config });
      setActiveTab('contacto');
    }
  }, [isOpen, config]);

  const handleChange = (key: keyof ProjectConfig, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const handleRestore = () => {
    if (window.confirm('¿Deseas restaurar todos los valores por defecto?')) {
      setFormData({ ...DEFAULT_CONFIG });
    }
  };

  // --- Tool cards helpers ---
  const tools: ToolCard[] = formData.customTools ?? DEFAULT_CONFIG.customTools!;

  const updateTool = (idx: number, key: keyof ToolCard, value: string) => {
    const updated = tools.map((t, i) => i === idx ? { ...t, [key]: value } : t);
    setFormData(prev => ({ ...prev, customTools: updated }));
  };

  const addTool = () => {
    const newTool: ToolCard = {
      id: generateId(),
      title: 'Nueva herramienta',
      description: 'Descripción de la herramienta.',
      url: 'https://',
      icon: 'Link',
      accessLabel: 'Abrir',
    };
    setFormData(prev => ({ ...prev, customTools: [...tools, newTool] }));
  };

  const removeTool = (idx: number) => {
    setFormData(prev => ({ ...prev, customTools: tools.filter((_, i) => i !== idx) }));
  };

  const moveTool = (idx: number, dir: -1 | 1) => {
    const arr = [...tools];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setFormData(prev => ({ ...prev, customTools: arr }));
  };

  // --- Services dropdown helpers ---
  const services: string[] = formData.customServices ?? DEFAULT_CONFIG.customServices!;

  const updateService = (idx: number, value: string) => {
    const updated = services.map((s, i) => i === idx ? value : s);
    setFormData(prev => ({ ...prev, customServices: updated }));
  };

  const addService = () => {
    setFormData(prev => ({ ...prev, customServices: [...services, 'Nuevo Servicio'] }));
  };

  const removeService = (idx: number) => {
    setFormData(prev => ({ ...prev, customServices: services.filter((_, i) => i !== idx) }));
  };

  // --- Service cards helpers ---
  const cards: ServiceCard[] = formData.serviceCards ?? DEFAULT_CONFIG.serviceCards!;

  const updateCard = (idx: number, key: keyof ServiceCard, value: string) => {
    const updated = cards.map((c, i) => i === idx ? { ...c, [key]: value } : c);
    setFormData(prev => ({ ...prev, serviceCards: updated }));
  };

  const addCard = () => {
    const newCard: ServiceCard = {
      id: generateId(),
      title: 'Nuevo Servicio',
      description: 'Descripción del servicio técnico ofrecido.',
      callToAction: 'Solicitar información',
      prefillService: 'Nuevo Servicio',
      prefillMessage: 'Hola, me gustaría obtener información sobre este servicio.',
    };
    setFormData(prev => ({ ...prev, serviceCards: [...cards, newCard] }));
  };

  const removeCard = (idx: number) => {
    setFormData(prev => ({ ...prev, serviceCards: cards.filter((_, i) => i !== idx) }));
  };

  const moveCard = (idx: number, dir: -1 | 1) => {
    const arr = [...cards];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setFormData(prev => ({ ...prev, serviceCards: arr }));
  };

  // --- SMTP helpers ---
  const smtp = formData.smtp ?? DEFAULT_CONFIG.smtp!;
  const updateSmtp = (key: keyof typeof smtp, value: string) => {
    setFormData(prev => ({
      ...prev,
      smtp: { ...(prev.smtp ?? DEFAULT_CONFIG.smtp!), [key]: value },
    }));
  };

  // --- Credentials helpers ---
  const [showPasses, setShowPasses] = useState<Record<string, boolean>>({});
  const togglePass = (key: string) => setShowPasses(prev => ({ ...prev, [key]: !prev[key] }));

  const creds = formData.credentials ?? DEFAULT_CONFIG.credentials!;
  const updateCred = (key: keyof typeof creds, value: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: { ...(prev.credentials ?? DEFAULT_CONFIG.credentials!), [key]: value },
    }));
  };

  // --- Typography helpers ---
  const typo = formData.typography ?? DEFAULT_CONFIG.typography!;

  const updateTypoLayer = (layer: 'heading' | 'body' | 'ui', key: keyof TypographyLayer, value: string) => {
    setFormData(prev => ({
      ...prev,
      typography: {
        ...(prev.typography ?? DEFAULT_CONFIG.typography!),
        [layer]: { ...(prev.typography?.[layer] ?? {}), [key]: value },
      },
    }));
  };

  const updateAccent = (value: string) => {
    setFormData(prev => ({
      ...prev,
      typography: { ...(prev.typography ?? DEFAULT_CONFIG.typography!), accentColor: value },
    }));
  };

  // Load Google Fonts for live preview inside the modal
  useEffect(() => {
    const families = [typo.heading?.family, typo.body?.family, typo.ui?.family]
      .filter((f): f is string => !!f && !SYSTEM_FONTS.has(f));
    [...new Set(families)].forEach(family => {
      const id = `gf-modal-${family.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [typo.heading?.family, typo.body?.family, typo.ui?.family]);

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'contacto', label: 'Contacto', icon: <Phone size={13} /> },
    { id: 'herramientas', label: 'Herramientas', icon: <Wrench size={13} /> },
    { id: 'servicios', label: 'Servicios', icon: <ListChecks size={13} /> },
    { id: 'tarjetas', label: 'Tarjetas', icon: <LayoutGrid size={13} /> },
    { id: 'urls', label: 'URLs', icon: <Link2 size={13} /> },
    { id: 'estetica', label: 'Estética', icon: <Palette size={13} /> },
    { id: 'tipografia', label: 'Tipografía', icon: <CaseSensitive size={13} /> },
    { id: 'acceso', label: 'Acceso', icon: <KeyRound size={13} /> },
    { id: 'smtp', label: 'Email SMTP', icon: <SendHorizonal size={13} /> },
    { id: 'rgpd', label: 'RGPD', icon: <Type size={13} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[93vh] bg-[#0b1329] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-gray-100 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800 bg-[#0d1630] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <Link2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Panel de Administración</h2>
              <p className="text-[10px] text-gray-400">Personaliza todos los elementos del portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 px-4 py-2 bg-[#0a1020] border-b border-gray-800 shrink-0 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 min-h-0">

            {/* TAB: CONTACTO */}
            {activeTab === 'contacto' && (
              <div className="space-y-5">
                <SectionHeader icon={<Phone size={14} />} title="Datos de Contacto del Hero" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Teléfono" hint="Se muestra en el botón 'Llamar'">
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.contactPhone ?? ''}
                      onChange={e => handleChange('contactPhone', e.target.value)}
                    />
                  </Field>
                  <Field label="Email de contacto" hint="Enlace mailto del hero">
                    <input
                      type="email"
                      className={inputCls}
                      value={formData.contactEmail ?? ''}
                      onChange={e => handleChange('contactEmail', e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Mensaje pre-escrito WhatsApp (URL-encoded)" hint="El texto que aparece en el chat al pulsar 'WhatsApp Directo'">
                  <input
                    type="text"
                    className={inputCls}
                    value={formData.contactWhatsappMsg ?? ''}
                    onChange={e => handleChange('contactWhatsappMsg', e.target.value)}
                  />
                </Field>

                <div className="border-t border-gray-900 pt-4">
                  <SectionHeader icon={<Mail size={14} />} title="Configuración del Formulario de Consulta" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nombre del destinatario" hint="Aparece en 'Estimado [nombre]'">
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.formRecipientName ?? ''}
                      onChange={e => handleChange('formRecipientName', e.target.value)}
                    />
                  </Field>
                  <Field label="Email principal de recepción" hint="A quién va dirigido el formulario">
                    <input
                      type="email"
                      className={inputCls}
                      value={formData.formRecipientEmail ?? ''}
                      onChange={e => handleChange('formRecipientEmail', e.target.value)}
                    />
                  </Field>
                  <Field label="Email BCC (copia oculta)" hint="Copia invisible del formulario">
                    <input
                      type="email"
                      className={inputCls}
                      value={formData.formBccEmail ?? ''}
                      onChange={e => handleChange('formBccEmail', e.target.value)}
                    />
                  </Field>
                </div>

                <div className="border-t border-gray-900 pt-4">
                  <SectionHeader icon={<Type size={14} />} title="Textos de la Cabecera (Hero)" />
                </div>

                <Field label="Subtítulo principal">
                  <input
                    type="text"
                    className={inputCls}
                    value={formData.heroSubtitle ?? ''}
                    onChange={e => handleChange('heroSubtitle', e.target.value)}
                  />
                </Field>
                <Field label="Descripción del hero">
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-none`}
                    value={formData.heroDescription ?? ''}
                    onChange={e => handleChange('heroDescription', e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* TAB: HERRAMIENTAS */}
            {activeTab === 'herramientas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <SectionHeader icon={<Wrench size={14} />} title={`Herramientas Técnicas (${tools.length})`} />
                  <button
                    type="button"
                    onClick={addTool}
                    className="flex items-center gap-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus size={13} /> Añadir herramienta
                  </button>
                </div>

                {tools.map((tool, idx) => (
                  <div key={tool.id} className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">#{idx + 1} — {tool.title}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveTool(idx, -1)} disabled={idx === 0} className={arrowBtn}>
                          <ChevronUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveTool(idx, 1)} disabled={idx === tools.length - 1} className={arrowBtn}>
                          <ChevronDown size={14} />
                        </button>
                        <button type="button" onClick={() => removeTool(idx)} className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Título">
                        <input
                          type="text"
                          className={inputSm}
                          value={tool.title}
                          onChange={e => updateTool(idx, 'title', e.target.value)}
                        />
                      </Field>
                      <Field label="Etiqueta de acceso">
                        <input
                          type="text"
                          className={inputSm}
                          value={tool.accessLabel ?? ''}
                          onChange={e => updateTool(idx, 'accessLabel', e.target.value)}
                        />
                      </Field>
                      <Field label="URL de destino" className="sm:col-span-2">
                        <input
                          type="url"
                          className={`${inputSm} font-mono`}
                          value={tool.url}
                          onChange={e => updateTool(idx, 'url', e.target.value)}
                        />
                      </Field>
                      <Field label="Descripción" className="sm:col-span-2">
                        <input
                          type="text"
                          className={inputSm}
                          value={tool.description}
                          onChange={e => updateTool(idx, 'description', e.target.value)}
                        />
                      </Field>
                      <Field label="Icono (nombre Lucide)" hint={`Opciones: ${AVAILABLE_ICONS.join(', ')}`}>
                        <select
                          className={inputSm}
                          value={tool.icon}
                          onChange={e => updateTool(idx, 'icon', e.target.value)}
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>
                ))}

                {tools.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-6">No hay herramientas. Pulsa "Añadir herramienta".</p>
                )}
              </div>
            )}

            {/* TAB: SERVICIOS (dropdown) */}
            {activeTab === 'servicios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <SectionHeader icon={<ListChecks size={14} />} title={`Opciones del Desplegable (${services.length})`} />
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center gap-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus size={13} /> Añadir servicio
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">Estas son las opciones que aparecen en el selector "Área o Tipo de Servicio" del formulario de contacto.</p>

                <div className="space-y-2">
                  {services.map((svc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono w-5 shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        className={`${inputSm} flex-1`}
                        value={svc}
                        onChange={e => updateService(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TARJETAS DE SERVICIOS */}
            {activeTab === 'tarjetas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <SectionHeader icon={<LayoutGrid size={14} />} title={`Tarjetas de Servicios (${cards.length})`} />
                  <button
                    type="button"
                    onClick={addCard}
                    className="flex items-center gap-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus size={13} /> Añadir tarjeta
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">Las tarjetas de "Especialidades" que aparecen en la sección central del portal.</p>

                {cards.map((card, idx) => (
                  <div key={card.id} className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">#{idx + 1} — {card.title}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveCard(idx, -1)} disabled={idx === 0} className={arrowBtn}>
                          <ChevronUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveCard(idx, 1)} disabled={idx === cards.length - 1} className={arrowBtn}>
                          <ChevronDown size={14} />
                        </button>
                        <button type="button" onClick={() => removeCard(idx)} className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Título">
                        <input
                          type="text"
                          className={inputSm}
                          value={card.title}
                          onChange={e => updateCard(idx, 'title', e.target.value)}
                        />
                      </Field>
                      <Field label="Texto del botón CTA">
                        <input
                          type="text"
                          className={inputSm}
                          value={card.callToAction}
                          onChange={e => updateCard(idx, 'callToAction', e.target.value)}
                        />
                      </Field>
                      <Field label="Descripción" className="sm:col-span-2">
                        <textarea
                          rows={2}
                          className={`${inputSm} resize-none`}
                          value={card.description}
                          onChange={e => updateCard(idx, 'description', e.target.value)}
                        />
                      </Field>
                      <Field label="Servicio del formulario (pre-selección)">
                        <input
                          type="text"
                          className={inputSm}
                          value={card.prefillService}
                          onChange={e => updateCard(idx, 'prefillService', e.target.value)}
                        />
                      </Field>
                      <Field label="Mensaje pre-escrito del formulario">
                        <input
                          type="text"
                          className={inputSm}
                          value={card.prefillMessage}
                          onChange={e => updateCard(idx, 'prefillMessage', e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: URLs */}
            {activeTab === 'urls' && (
              <div className="space-y-5">
                <SectionHeader icon={<FileUp size={14} />} title="Buzón Seguro (kDrive)" />
                <Field label="URL del kDrive" hint="Enlace al buzón encriptado de documentos">
                  <input
                    type="url"
                    className={`${inputCls} font-mono`}
                    value={formData.kDriveUrl}
                    onChange={e => handleChange('kDriveUrl', e.target.value)}
                  />
                </Field>

                <div className="border-t border-gray-900 pt-4">
                  <SectionHeader icon={<Link2 size={14} />} title="URLs heredadas (compatibilidad)" />
                  <p className="text-[11px] text-gray-400 mt-1">Estas URLs también se usan si la herramienta correspondiente no tiene URL configurada en la pestaña Herramientas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'externalGeovisorUrl' as const, label: 'Geovisor' },
                    { key: 'externalRutasUrl' as const, label: 'Gestor de rutas' },
                    { key: 'externalVisorUrbanisticoUrl' as const, label: 'Visor urbanístico' },
                    { key: 'externalNotasSimplesUrl' as const, label: 'Análisis registral' },
                  ].map(({ key, label }) => (
                    <Field key={key} label={label}>
                      <input
                        type="url"
                        className={`${inputSm} font-mono`}
                        value={formData[key] as string}
                        onChange={e => handleChange(key, e.target.value)}
                      />
                    </Field>
                  ))}
                  <Field label="Página web corporativa" className="md:col-span-2">
                    <input
                      type="url"
                      className={`${inputSm} font-mono`}
                      value={formData.externalAplicacionesUrl}
                      onChange={e => handleChange('externalAplicacionesUrl', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* TAB: ESTÉTICA */}
            {activeTab === 'estetica' && (
              <div className="space-y-5">
                <SectionHeader icon={<Palette size={14} />} title="Tema Visual" />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleChange('theme', t.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.theme === t.id || (!formData.theme && t.id === 'navy-gold')
                          ? `border-[${t.accent}] bg-[${t.accent}]/5`
                          : 'border-gray-800 hover:border-gray-700 bg-gray-950/20'
                      }`}
                      style={formData.theme === t.id ? { borderColor: t.accent, backgroundColor: `${t.accent}11` } : undefined}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-white truncate">{t.name}</span>
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.accent }}></span>
                      </div>
                      <div className="flex gap-1">
                        {t.colors.map((c, i) => (
                          <span key={i} className="h-3 w-3 rounded-sm border border-gray-700/30" style={{ backgroundColor: c }}></span>
                        ))}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1.5 leading-tight">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-900 pt-4">
                  <SectionHeader icon={<Type size={14} />} title="Logo personalizado" />
                </div>
                <Field label="URL del logotipo (PNG / JPG / SVG)" hint="Deja vacío para usar el monograma dorado por defecto">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="https://ejemplo.com/mi-logo.png"
                    value={formData.customLogoUrl ?? ''}
                    onChange={e => handleChange('customLogoUrl', e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* TAB: TIPOGRAFÍA */}
            {activeTab === 'tipografia' && (
              <div className="space-y-6">

                {/* Color de acento */}
                <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-3">
                  <SectionHeader icon={<Palette size={14} />} title="Color de Acento Global" />
                  <p className="text-[10px] text-gray-400">Sustituye el amarillo-dorado en botones, bordes, iconos y highlights de todo el portal.</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="h-9 w-16 rounded cursor-pointer border border-gray-700 bg-transparent"
                      value={typo.accentColor ?? '#eab308'}
                      onChange={e => updateAccent(e.target.value)}
                    />
                    <input
                      type="text"
                      className={`${inputSm} font-mono w-28`}
                      value={typo.accentColor ?? '#eab308'}
                      onChange={e => updateAccent(e.target.value)}
                    />
                    <div
                      className="h-9 w-9 rounded-lg border border-gray-700 shrink-0"
                      style={{ backgroundColor: typo.accentColor ?? '#eab308' }}
                    />
                    <span className="text-[11px] text-gray-400">Vista previa</span>
                  </div>
                </div>

                {/* Títulos */}
                <TypoLayerEditor
                  label="Títulos (h2, h3, encabezados de sección)"
                  layer={typo.heading ?? {}}
                  onChange={(key, val) => updateTypoLayer('heading', key, val)}
                  showWeight
                  previewText="Ingeniería Agrícola & Valoraciones"
                />

                {/* Cuerpo */}
                <TypoLayerEditor
                  label="Cuerpo / Descripciones (párrafos)"
                  layer={typo.body ?? {}}
                  onChange={(key, val) => updateTypoLayer('body', key, val)}
                  showWeight
                  previewText="Especialistas en tasaciones oficiales de fincas rústicas."
                />

                {/* UI */}
                <TypoLayerEditor
                  label="Interfaz (botones, etiquetas, navegación)"
                  layer={typo.ui ?? {}}
                  onChange={(key, val) => updateTypoLayer('ui', key, val)}
                  showWeight
                  previewText="Solicitar presupuesto · Acceso Privado · GEOTASALIA"
                />

              </div>
            )}

            {/* TAB: ACCESO */}
            {activeTab === 'acceso' && (
              <div className="space-y-5">
                <SectionHeader icon={<KeyRound size={14} />} title="Gestión de Credenciales de Acceso" />
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Cambia los usuarios y contraseñas del portal. Los cambios se guardan en el almacenamiento local del navegador.
                  <span className="text-yellow-500 font-semibold"> Guarda las nuevas credenciales antes de cerrar esta ventana.</span>
                </p>

                {/* Cliente */}
                <div className="bg-gray-950/50 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Cuenta de Cliente
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Usuario">
                      <input
                        type="text"
                        className={`${inputSm} font-mono`}
                        value={creds.clientUser}
                        onChange={e => updateCred('clientUser', e.target.value)}
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Contraseña">
                      <div className="flex gap-1">
                        <input
                          type={showPasses['clientPass'] ? 'text' : 'password'}
                          className={`${inputSm} font-mono flex-1`}
                          value={creds.clientPass}
                          onChange={e => updateCred('clientPass', e.target.value)}
                          autoComplete="new-password"
                        />
                        <button type="button" onClick={() => togglePass('clientPass')} className="px-2 text-gray-500 hover:text-gray-300 bg-gray-950/40 border border-gray-800 rounded-lg transition-colors">
                          {showPasses['clientPass'] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Admin */}
                <div className="bg-gray-950/50 border border-yellow-500/20 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span> Cuenta de Administrador
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Usuario">
                      <input
                        type="text"
                        className={`${inputSm} font-mono`}
                        value={creds.adminUser}
                        onChange={e => updateCred('adminUser', e.target.value)}
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Contraseña">
                      <div className="flex gap-1">
                        <input
                          type={showPasses['adminPass'] ? 'text' : 'password'}
                          className={`${inputSm} font-mono flex-1`}
                          value={creds.adminPass}
                          onChange={e => updateCred('adminPass', e.target.value)}
                          autoComplete="new-password"
                        />
                        <button type="button" onClick={() => togglePass('adminPass')} className="px-2 text-gray-500 hover:text-gray-300 bg-gray-950/40 border border-gray-800 rounded-lg transition-colors">
                          {showPasses['adminPass'] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Recovery email */}
                <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" /> Email de Recuperación
                  </h4>
                  <Field label="Email que recibe las solicitudes de acceso" hint="Cuando un usuario pulsa '¿Olvidaste tu contraseña?' se envía una notificación aquí">
                    <input
                      type="email"
                      className={`${inputSm} font-mono`}
                      value={creds.recoveryEmail}
                      onChange={e => updateCred('recoveryEmail', e.target.value)}
                    />
                  </Field>
                </div>

                <div className="p-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl text-[10px] text-gray-400 leading-relaxed">
                  <span className="text-yellow-500 font-semibold">Nota de seguridad:</span> Las credenciales se almacenan en el navegador. Para un entorno de producción con múltiples usuarios se recomienda implementar autenticación en el servidor.
                </div>
              </div>
            )}

            {/* TAB: SMTP */}
            {activeTab === 'smtp' && (
              <div className="space-y-5">
                <SectionHeader icon={<SendHorizonal size={14} />} title="Configuración del Servidor de Correo (SMTP)" />
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Estos datos se usan para enviar los formularios de consulta y las notificaciones de recuperación de acceso. Se guardan de forma segura en el servidor.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Servidor SMTP (host)" className="sm:col-span-2">
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      placeholder="mail.infomaniak.com"
                      value={smtp.host}
                      onChange={e => updateSmtp('host', e.target.value)}
                    />
                  </Field>

                  <Field label="Puerto">
                    <select
                      className={inputCls}
                      value={smtp.port}
                      onChange={e => updateSmtp('port', e.target.value)}
                    >
                      <option value="587">587 — STARTTLS (recomendado)</option>
                      <option value="465">465 — SSL/TLS</option>
                      <option value="25">25 — Sin cifrado</option>
                    </select>
                  </Field>

                  <Field label="Usuario / Email de envío">
                    <input
                      type="email"
                      className={`${inputCls} font-mono`}
                      placeholder="gestion@tudominio.es"
                      value={smtp.user}
                      onChange={e => updateSmtp('user', e.target.value)}
                      autoComplete="off"
                    />
                  </Field>

                  <Field label="Contraseña SMTP" className="sm:col-span-2">
                    <div className="flex gap-1">
                      <input
                        type={showPasses['smtpPass'] ? 'text' : 'password'}
                        className={`${inputCls} font-mono flex-1`}
                        placeholder="Contraseña del buzón de correo"
                        value={smtp.pass}
                        onChange={e => updateSmtp('pass', e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePass('smtpPass')}
                        className="px-3 text-gray-500 hover:text-gray-300 bg-gray-950/40 border border-gray-800 rounded-lg transition-colors"
                      >
                        {showPasses['smtpPass'] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Destinatario principal (To)" hint="Email que recibe los formularios de consulta">
                    <input
                      type="email"
                      className={`${inputCls} font-mono`}
                      placeholder="jorge.martinez@geotasalia.es"
                      value={smtp.to}
                      onChange={e => updateSmtp('to', e.target.value)}
                    />
                  </Field>

                  <Field label="Copia oculta (BCC)" hint="Email que recibe copia invisible de cada consulta">
                    <input
                      type="email"
                      className={`${inputCls} font-mono`}
                      placeholder="backup@ejemplo.com (opcional)"
                      value={smtp.bcc}
                      onChange={e => updateSmtp('bcc', e.target.value)}
                    />
                  </Field>
                </div>

                <div className="p-3 bg-gray-950/40 border border-gray-800 rounded-xl text-[10px] text-gray-400 leading-relaxed space-y-1">
                  <p><span className="text-gray-300 font-semibold">Infomaniak:</span> host <span className="font-mono text-yellow-500">mail.infomaniak.com</span>, puerto <span className="font-mono text-yellow-500">587</span></p>
                  <p><span className="text-gray-300 font-semibold">Gmail:</span> host <span className="font-mono text-yellow-500">smtp.gmail.com</span>, puerto <span className="font-mono text-yellow-500">587</span> (requiere contraseña de aplicación)</p>
                  <p><span className="text-gray-300 font-semibold">Outlook/Microsoft:</span> host <span className="font-mono text-yellow-500">smtp.office365.com</span>, puerto <span className="font-mono text-yellow-500">587</span></p>
                </div>
              </div>
            )}

            {/* TAB: RGPD */}
            {activeTab === 'rgpd' && (
              <div className="space-y-4">
                <SectionHeader icon={<Type size={14} />} title="Datos del Responsable del Tratamiento (RGPD)" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Responsable del Tratamiento">
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.rgpdResponsable ?? ''}
                      onChange={e => handleChange('rgpdResponsable', e.target.value)}
                    />
                  </Field>
                  <Field label="NIF / CIF del Responsable">
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.rgpdNif ?? ''}
                      onChange={e => handleChange('rgpdNif', e.target.value)}
                    />
                  </Field>
                  <Field label="Dirección Postal RGPD" className="md:col-span-2">
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.rgpdDireccion ?? ''}
                      onChange={e => handleChange('rgpdDireccion', e.target.value)}
                    />
                  </Field>
                  <Field label="Correo RGPD">
                    <input
                      type="email"
                      className={`${inputCls} font-mono`}
                      value={formData.rgpdEmail ?? ''}
                      onChange={e => handleChange('rgpdEmail', e.target.value)}
                    />
                  </Field>
                  <Field label="Email DPD / Gestión (Opcional)">
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.rgpdDpd ?? ''}
                      onChange={e => handleChange('rgpdDpd', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-800 bg-[#0d1630] shrink-0">
            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw size={13} /> Restaurar valores por defecto
            </button>
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={success}
                className="flex items-center gap-2 px-5 py-2 text-xs bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-[#0b1329] font-semibold rounded-lg transition-all shadow-lg shadow-yellow-500/10"
              >
                {success ? '¡Guardado!' : <><Save size={13} /> Guardar Cambios</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Small helpers ---

const inputCls = 'w-full px-3 py-2 bg-gray-950/60 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-colors';
const inputSm = 'w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-xs text-white outline-none focus:border-yellow-500/50 transition-colors';
const arrowBtn = 'p-1 text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors';

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
      {icon} {title}
    </h3>
  );
}

function Field({ label, hint, children, className }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <label className="block text-xs font-medium text-gray-300">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-gray-500">{hint}</p>}
    </div>
  );
}

function TypoLayerEditor({
  label, layer, onChange, showWeight, previewText,
}: {
  label: string;
  layer: TypographyLayer;
  onChange: (key: keyof TypographyLayer, value: string) => void;
  showWeight?: boolean;
  previewText: string;
}) {
  const family = layer.family ?? 'Inter';
  const size   = layer.size   ?? '14px';
  const color  = layer.color  ?? '#ffffff';
  const weight = layer.weight ?? '400';

  return (
    <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-4">
      <SectionHeader icon={<CaseSensitive size={14} />} title={label} />

      {/* Preview */}
      <div
        className="p-3 bg-[#060c1e] border border-gray-900 rounded-lg"
        style={{ fontFamily: `'${family}', sans-serif`, fontSize: size, color, fontWeight: weight }}
      >
        {previewText}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Font family */}
        <Field label="Tipografía">
          <div className="space-y-1.5">
            <select
              className={inputSm}
              value={family}
              onChange={e => onChange('family', e.target.value)}
            >
              {(['sans', 'serif', 'mono'] as const).map(cat => (
                <optgroup key={cat} label={cat === 'sans' ? 'Sans-serif' : cat === 'serif' ? 'Serif' : 'Monospace'}>
                  {FONT_FAMILIES.filter(f => f.category === cat).map(f => (
                    <option key={f.name} value={f.name}>{f.name}{f.google ? '' : ' (sistema)'}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </Field>

        {/* Size */}
        <Field label="Tamaño">
          <select
            className={inputSm}
            value={size}
            onChange={e => onChange('size', e.target.value)}
          >
            {FONT_SIZES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        {/* Color */}
        <Field label="Color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-8 w-12 rounded cursor-pointer border border-gray-700 bg-transparent shrink-0"
              value={color}
              onChange={e => onChange('color', e.target.value)}
            />
            <input
              type="text"
              className={`${inputSm} font-mono`}
              value={color}
              onChange={e => onChange('color', e.target.value)}
            />
          </div>
        </Field>

        {/* Weight */}
        {showWeight && (
          <Field label="Grosor (weight)">
            <select
              className={inputSm}
              value={weight}
              onChange={e => onChange('weight', e.target.value)}
            >
              {FONT_WEIGHTS.map(w => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </Field>
        )}
      </div>
    </div>
  );
}

const THEMES = [
  { id: 'navy-gold', name: 'Gabinete Oficial', accent: '#facc15', colors: ['#050b1e', '#0d1527', '#facc15'], desc: 'Slate y oro elegante corporativo.' },
  { id: 'emerald-warm', name: 'Rústico Agrícola', accent: '#10b981', colors: ['#021a11', '#042a1d', '#f97316'], desc: 'Verde monte y ámbar tradicional.' },
  { id: 'cyan-steel', name: 'Catastro Técnico', accent: '#00f2ff', colors: ['#080b11', '#111827', '#00f2ff'], desc: 'Cian y acero de alta tecnología.' },
  { id: 'minimal-light', name: 'Claro Técnico', accent: '#2563eb', colors: ['#f1f5f9', '#ffffff', '#2563eb'], desc: 'Limpio y claro para pleno día.' },
  { id: 'minimalista', name: 'Minimalista', accent: '#a3a3a3', colors: ['#fafafa', '#ffffff', '#171717'], desc: 'Ausencia de ruido, limpieza pura.' },
  { id: 'flat', name: 'Flat design', accent: '#0284c7', colors: ['#e0f2fe', '#ffffff', '#0284c7'], desc: 'Colores planos, sin degradados.' },
  { id: 'material', name: 'Material design', accent: '#6200ee', colors: ['#f5f5f5', '#ffffff', '#6200ee'], desc: 'Alineado a guías de Google.' },
  { id: 'esqueumorfica', name: 'Esqueumórfica', accent: '#8c2f00', colors: ['#f4efe6', '#eae0d5', '#8c2f00'], desc: 'Madera, pergamino y texturas.' },
  { id: 'retro', name: 'Retro / vintage', accent: '#a63a50', colors: ['#faf6ee', '#f0ebd8', '#a63a50'], desc: 'Crema nostálgico e imprenta.' },
  { id: 'brutalista', name: 'Brutalista', accent: '#ff0055', colors: ['#ffffff', '#fef08a', '#ff0055'], desc: 'Bordes gruesos y contraste rudo.' },
  { id: 'neumorfismo', name: 'Neumorfismo', accent: '#4a5568', colors: ['#e0e0e0', '#e0e0e0', '#4a5568'], desc: 'Relieves extruidos y sombras soft.' },
  { id: 'glassmorphism', name: 'Glassmorphism', accent: '#38bdf8', colors: ['#020617', '#0f172a', '#38bdf8'], desc: 'Cristal traslúcido y desenfoques.' },
  { id: 'dark-mode', name: 'Dark mode', accent: '#10b981', colors: ['#090d16', '#151c2c', '#10b981'], desc: 'Oscuro total con verde técnico.' },
  { id: 'cyberpunk', name: 'Cyberpunk', accent: '#00f6ff', colors: ['#03001e', '#120024', '#00f6ff'], desc: 'Neón electrizante de ciencia ficción.' },
  { id: 'organica', name: 'Orgánica / natural', accent: '#606c38', colors: ['#eef1ed', '#ffffff', '#606c38'], desc: 'Tierra, oliva y musgo natural.' },
  { id: 'editorial', name: 'Editorial', accent: '#722f37', colors: ['#fdfbf7', '#ffffff', '#722f37'], desc: 'Elegancia periodística y vino burdeos.' },
  { id: 'abstracta', name: 'Abstracta', accent: '#f97316', colors: ['#4f46e5', '#ffffff', '#f97316'], desc: 'Bloques artísticos y contraste coral.' },
  { id: 'geometrica', name: 'Geométrica', accent: '#f97316', colors: ['#0f172a', '#1e293b', '#f97316'], desc: 'Retícula de líneas y coordenadas exactas.' },
  { id: '3d', name: '3D', accent: '#ff00a0', colors: ['#1e1e38', '#2a2b4d', '#ff00a0'], desc: 'Altorelieve cromático y profundidad virtual.' },
];
