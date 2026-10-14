import nodemailer from 'nodemailer';

type ContactPayload = {
  type?: unknown;
  name?: unknown;
  company?: unknown;
  phone?: unknown;
  email?: unknown;
  date?: unknown;
  period?: unknown;
  interest?: unknown;
  notes?: unknown;
  preferredTime?: unknown;
  website?: unknown;
  consent?: unknown;
};

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const attempts = new Map<string, number[]>();
const MAX_FIELD_LENGTH = 2_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{8,24}$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidField(value: unknown, maxLength: number): boolean {
  return value === undefined || (typeof value === 'string' && value.length <= maxLength);
}

function hasSameOrigin(request: ApiRequest): boolean {
  const originHeader = request.headers.origin;
  const refererHeader = request.headers.referer;
  const origin = typeof originHeader === 'string'
    ? originHeader
    : typeof refererHeader === 'string'
      ? refererHeader
      : '';
  if (!origin) return false;
  const host = request.headers['x-forwarded-host'] ?? request.headers.host;
  if (typeof host !== 'string') return false;
  try {
    const url = new URL(origin);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function isRateLimited(ip: string, now: number): boolean {
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 5) {
    attempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5_000) {
    for (const [key, values] of attempts) {
      if (values.every((time) => now - time >= 60_000)) attempts.delete(key);
    }
  }
  return false;
}

function jsonError(response: ApiResponse, status: number, error: string): void {
  response.status(status).json({ error });
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    jsonError(response, 405, 'Método não permitido.');
    return;
  }
  if (!hasSameOrigin(request)) {
    jsonError(response, 403, 'Origem da solicitação não permitida.');
    return;
  }
  const contentType = request.headers['content-type'];
  if (typeof contentType === 'string' && !contentType.toLowerCase().includes('application/json')) {
    jsonError(response, 415, 'Envie os dados do formulário em formato JSON.');
    return;
  }

  const lengthHeader = request.headers['content-length'];
  const contentLength = Number(Array.isArray(lengthHeader) ? lengthHeader[0] : lengthHeader ?? 0);
  if (contentLength > 16_384) {
    jsonError(response, 413, 'O formulário excede o tamanho permitido.');
    return;
  }
  const payload = request.body as ContactPayload | undefined;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    jsonError(response, 400, 'Não foi possível ler os dados enviados.');
    return;
  }
  if (text(payload.website)) {
    response.status(200).json({ message: 'Solicitação recebida.' });
    return;
  }

  const fieldLengths: Array<[unknown, number]> = [
    [payload.name, 120],
    [payload.company, 160],
    [payload.phone, 24],
    [payload.email, 254],
    [payload.date, 10],
    [payload.period, 40],
    [payload.interest, 240],
    [payload.notes, MAX_FIELD_LENGTH],
    [payload.preferredTime, 40],
  ];
  if (fieldLengths.some(([value, maxLength]) => !isValidField(value, maxLength))) {
    jsonError(response, 400, 'Um ou mais campos excedem o tamanho permitido ou têm formato inválido.');
    return;
  }

  const ipHeader = request.headers['x-forwarded-for'];
  const ip = typeof ipHeader === 'string'
    ? ipHeader.split(',')[0].trim()
    : request.socket?.remoteAddress ?? 'unknown';
  if (isRateLimited(ip, Date.now())) {
    jsonError(response, 429, 'Muitas tentativas. Aguarde um minuto e tente novamente.');
    return;
  }

  const type = payload.type;
  const name = text(payload.name);
  const phone = text(payload.phone);
  const consent = payload.consent === true;
  if (type !== 'demo' && type !== 'callback') {
    jsonError(response, 400, 'Tipo de solicitação inválido.');
    return;
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (name.length < 2 || !phonePattern.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15 || !consent) {
    jsonError(response, 400, 'Confira nome, telefone e autorização para tratar os dados do pedido.');
    return;
  }

  const company = text(payload.company);
  const email = text(payload.email);
  const date = text(payload.date);
  const period = text(payload.period);
  const interest = text(payload.interest);
  const notes = text(payload.notes);
  const preferredTime = text(payload.preferredTime);

  if (type === 'demo' && (!company || !emailPattern.test(email))) {
    jsonError(response, 400, 'Informe a empresa e um e-mail válido para solicitar a demonstração.');
    return;
  }
  if (date) {
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date < today) {
      jsonError(response, 400, 'A data informada não é válida.');
      return;
    }
  }
  const allowedPeriods = new Set(['', 'Manhã', 'Tarde']);
  if ((type === 'demo' && !allowedPeriods.has(period)) || (type === 'callback' && !allowedPeriods.has(preferredTime))) {
    jsonError(response, 400, 'O período escolhido não é válido.');
    return;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.CONTACT_TO ?? 'comercial@datatransp.com.br';
  if (!host || !Number.isInteger(port) || port < 1 || port > 65_535 || !user || !pass) {
    jsonError(response, 503, 'O envio de formulários ainda não está configurado. Fale conosco pelo WhatsApp ou telefone.');
    return;
  }

  const subject = type === 'demo' ? 'Pedido de demonstração do site' : 'Pedido de retorno do site';
  const lines = type === 'demo'
    ? [
        `Nome: ${name}`,
        `Empresa: ${company}`,
        `Telefone: ${phone}`,
        `E-mail: ${email}`,
        `Dia preferido: ${date || 'Não informado'}`,
        `Período: ${period || 'Não informado'}`,
        `Interesse: ${interest || 'Não informado'}`,
        `Observação: ${notes || 'Não informada'}`,
      ]
    : [
        `Nome: ${name}`,
        `Telefone: ${phone}`,
        `Melhor horário: ${preferredTime || 'Não informado'}`,
      ];

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transporter.sendMail({
      from: process.env.CONTACT_FROM ?? user,
      to: recipient,
      replyTo: type === 'demo' ? email : undefined,
      subject,
      text: [...lines, '', 'Consentimento para tratar o pedido: sim'].join('\n'),
    });
  } catch (error) {
    console.error('Contact email delivery failed:', error);
    jsonError(response, 502, 'Não foi possível enviar o pedido agora. Tente novamente ou use os canais diretos.');
    return;
  }

  response.status(200).json({ message: 'Pedido enviado. Nossa equipe recebeu sua solicitação.' });
}
