import swaggerJsdoc from 'swagger-jsdoc';
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema) => ({ content: { 'application/json': { schema } } });
const error = {
  description: 'Erro padronizado; requestId permite rastrear a ocorrência.',
  ...json(ref('Error')),
};
export const openapi = swaggerJsdoc({
  apis: [],
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'UniAcademy API',
      version: '1.0.0',
      description: 'Catálogo e solicitações experimentais. Solicitação não confirma reserva.',
    },
    servers: [{ url: '/' }],
    components: {
      schemas: {
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                requestId: { type: 'string' },
                details: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
        Plan: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'number' },
            duration_months: { type: 'integer' },
            payment_terms: { type: 'string' },
            benefits: { type: 'array', items: { type: 'string' } },
            is_featured: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Modality: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            image_url: { type: 'string' },
            schedule_summary: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            weekday: { type: 'integer', minimum: 1, maximum: 6 },
            modality_name: { type: 'string' },
            time_slot: { type: 'string' },
            instructor: { type: 'string' },
            room: { type: 'string' },
          },
        },
        TrialInput: {
          type: 'object',
          additionalProperties: false,
          required: ['client_name', 'phone', 'email', 'preferred_modality', 'consent'],
          properties: {
            client_name: { type: 'string', minLength: 3, maxLength: 120, example: 'Maria Silva' },
            phone: { type: 'string', pattern: '^(?:55)?\\d{10,11}$', example: '81999999999' },
            email: { type: 'string', format: 'email', example: 'maria@example.com' },
            preferred_modality: { type: 'string', example: 'Musculação' },
            consent: { type: 'boolean', enum: [true] },
          },
        },
        TrialResult: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            status: { type: 'string', enum: ['pending'] },
            whatsapp_url: { type: 'string', format: 'uri' },
          },
        },
        SiteData: {
          type: 'object',
          properties: {
            plans: { type: 'array', items: ref('Plan') },
            modalities: { type: 'array', items: ref('Modality') },
            schedules: { type: 'array', items: ref('Schedule') },
            contact: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                whatsapp_url: { type: 'string', nullable: true },
              },
            },
            demo: { type: 'boolean' },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok'] },
            database: { type: 'string', enum: ['connected'] },
          },
        },
      },
    },
    paths: {
      '/api/site-data': {
        get: {
          summary: 'Catálogo consolidado do site',
          responses: {
            200: {
              description: 'Planos, modalidades, horários e contato',
              ...json(ref('SiteData')),
            },
            400: error,
            500: error,
          },
        },
      },
      '/api/trial-request': {
        post: {
          summary: 'Registra interesse e gera link oficial wa.me',
          requestBody: { required: true, ...json(ref('TrialInput')) },
          responses: {
            201: {
              description: 'Solicitação persistida, pendente de confirmação',
              ...json(ref('TrialResult')),
            },
            400: error,
            429: error,
            500: error,
            503: error,
          },
        },
      },
      '/api/health': {
        get: {
          summary: 'Verifica API e conexão com MySQL',
          responses: {
            200: { description: 'API e banco disponíveis', ...json(ref('Health')) },
            400: error,
            500: error,
          },
        },
      },
    },
  },
});
