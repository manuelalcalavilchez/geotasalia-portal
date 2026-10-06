import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// SMTP — resolved at request time from portal_config.json, falling back to env vars
function getSmtpConfig() {
  let saved = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))?.smtp ?? {};
    }
  } catch (_) {}
  return {
    host: saved.host || process.env.SMTP_HOST || 'mail.infomaniak.com',
    port: parseInt(saved.port || process.env.SMTP_PORT || '587', 10),
    user: saved.user || process.env.SMTP_USER || '',
    pass: saved.pass || process.env.SMTP_PASS || '',
    to:   saved.to   || process.env.SMTP_TO   || '',
    bcc:  saved.bcc  || process.env.SMTP_BCC  || '',
  };
}

function createTransporter() {
  const { host, port, user, pass } = getSmtpConfig();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

// Enable JSON body parsing for API requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Paths
const distPath = path.join(__dirname, 'dist');

// Data directory — mounted as a Docker volume in production so files survive restarts
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'consultas.json');
const CONFIG_FILE = path.join(DATA_DIR, 'portal_config.json');

// Helper to read submissions
function readSubmissions() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading submissions file:', error);
    return [];
  }
}

// Helper to write submissions
function writeSubmissions(submissions) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing submissions file:', error);
    return false;
  }
}

// Middleware to authorize admin access
function adminAuthorize(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.headers['x-admin-token'];
  // Read admin password from saved config, fall back to default
  let adminPass = 'admin2026';
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      if (cfg?.credentials?.adminPass) adminPass = cfg.credentials.adminPass;
    }
  } catch (_) {}
  if (token === adminPass) {
    next();
  } else {
    res.status(401).json({ error: 'Acceso no autorizado. Se requieren credenciales de administración.' });
  }
}

// API Route: Send / Create a new contact inquiry
app.post('/api/contacto', async (req, res) => {
  try {
    const { name, email, phone, service, cadastralRef, message, rgpdAccepted, attachedFiles } = req.body;

    if (!name || !email || !phone || !service || !rgpdAccepted) {
      return res.status(400).json({ error: 'Faltan campos requeridos en la consulta.' });
    }

    const submissions = readSubmissions();
    const newSubmission = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      name,
      email,
      phone,
      service,
      cadastralRef: cadastralRef || '',
      message: message || '',
      rgpdAccepted,
      attachedFiles: attachedFiles || [],
      status: 'unread', // unread, read, archived
      createdAt: new Date().toISOString()
    };

    // Attempt to send email via SMTP
    const subject = `[GeoTasalia] Solicitud de Consulta Técnica: ${service}`;
    
    let filesListText = '';
    if (attachedFiles && attachedFiles.length > 0) {
      filesListText = `\nDOCUMENTACIÓN ADJUNTA PRESENTADA (${attachedFiles.length} archivos):\n` +
        attachedFiles.map(f => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n') + `\n`;
    }

    const bodyText = 
      `Estimado Jorge,\n\n` +
      `Se ha recibido una nueva consulta técnica desde el portal corporativo GeoTasalia:\n\n` +
      `-----------------------------------------\n` +
      `Nombre: ${name}\n` +
      `Email: ${email}\n` +
      `Teléfono: ${phone}\n` +
      `Servicio solicitado: ${service}\n` +
      `Ref. Catastral: ${cadastralRef || 'No aportada'}\n` +
      `${filesListText}` +
      `-----------------------------------------\n\n` +
      `Descripción de la Consulta:\n` +
      `"${message || 'Sin observaciones adicionales'}"\n\n` +
      `-----------------------------------------\n\n` +
      `✓ El cliente ha aceptado de forma expresa la política de protección de datos (RGPD) de GeoTasalia.\n\n` +
      `Un saludo,\n` +
      `Sistema de Soporte GeoTasalia`;

    try {
      const smtp = getSmtpConfig();
      await createTransporter().sendMail({
        from: `"GeoTasalia" <${smtp.user}>`,
        to: smtp.to,
        bcc: smtp.bcc || undefined,
        replyTo: email,
        subject: subject,
        text: bodyText,
      });
      console.log('Email sent successfully via SMTP');
    } catch (mailError) {
      console.error('Failed to send email via SMTP:', mailError);
      return res.status(500).json({
        error: 'No se pudo enviar el correo electrónico a través del servidor SMTP: ' + mailError.message,
        smtpError: true,
      });
    }

    submissions.push(newSubmission);
    if (writeSubmissions(submissions)) {
      res.status(201).json({ success: true, message: 'Consulta registrada y enviada correctamente por correo.', id: newSubmission.id });
    } else {
      res.status(500).json({ error: 'El correo fue enviado, pero hubo un error interno al guardar la consulta en el panel de control.' });
    }
  } catch (error) {
    console.error('Error in POST /api/contacto:', error);
    res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
  }
});

// API Route: Get portal config
app.get('/api/config', (req, res) => {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return res.json(null); // No config saved yet — client will use defaults
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).json({ error: 'Error al leer la configuración.' });
  }
});

// API Route: Save portal config (Admin Only)
app.post('/api/config', adminAuthorize, (req, res) => {
  try {
    const config = req.body;
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'Configuración inválida.' });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving config file:', error);
    res.status(500).json({ error: 'Error al guardar la configuración.' });
  }
});

// API Route: Password recovery notification
app.post('/api/recover', async (req, res) => {
  try {
    const { requestEmail, adminEmail, portalName } = req.body;

    if (!requestEmail || !adminEmail) {
      return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const bodyText =
      `Estimado administrador,\n\n` +
      `Un usuario ha solicitado recuperar sus credenciales de acceso al portal ${portalName || 'GeoTasalia'}.\n\n` +
      `Email del solicitante: ${requestEmail}\n` +
      `Fecha y hora: ${new Date().toLocaleString('es-ES')}\n\n` +
      `Por favor, contacta con este usuario para facilitarle sus credenciales de acceso.\n\n` +
      `Sistema de Soporte ${portalName || 'GeoTasalia'}`;

    const smtp = getSmtpConfig();
    await createTransporter().sendMail({
      from: `"${portalName || 'GeoTasalia'}" <${smtp.user}>`,
      to: adminEmail,
      replyTo: requestEmail,
      subject: `[${portalName || 'GeoTasalia'}] Solicitud de recuperación de acceso`,
      text: bodyText,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/recover:', error);
    res.status(500).json({ error: 'No se pudo enviar el correo de recuperación: ' + error.message });
  }
});

// API Route: Retrieve all contact inquiries (Admin Only)
app.get('/api/consultas', adminAuthorize, (req, res) => {
  const submissions = readSubmissions();
  // Return sorted from newest to oldest
  submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(submissions);
});

// API Route: Toggle read status of a consultation (Admin Only)
app.put('/api/consultas/:id/read', adminAuthorize, (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'read' or 'unread'
  
  const submissions = readSubmissions();
  const index = submissions.findIndex(item => item.id === id);
  
  if (index !== -1) {
    submissions[index].status = status === 'unread' ? 'unread' : 'read';
    writeSubmissions(submissions);
    res.json({ success: true, updated: submissions[index] });
  } else {
    res.status(404).json({ error: 'Consulta no encontrada.' });
  }
});

// API Route: Delete an inquiry (Admin Only)
app.delete('/api/consultas/:id', adminAuthorize, (req, res) => {
  const { id } = req.params;
  const submissions = readSubmissions();
  const filtered = submissions.filter(item => item.id !== id);
  
  if (submissions.length !== filtered.length) {
    writeSubmissions(filtered);
    res.json({ success: true, message: 'Consulta eliminada correctamente.' });
  } else {
    res.status(404).json({ error: 'Consulta no encontrada.' });
  }
});

// Serve static assets or use Vite middleware
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  // Serve transformed index.html for all client-side routes in dev mode
  app.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  // Serve static assets from dist folder
  app.use(express.static(distPath));

  // Fallback all other requests to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
