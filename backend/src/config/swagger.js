
import swaggerJsdoc from 'swagger-jsdoc';

const ref = (name) => ({
  $ref: `#/components/schemas/${name}`,
});

const json = (schema) => ({
  content: {
    'application/json': { schema },
  },
});

const error = {
  description: 'Erro padronizado. O requestId permite rastrear a ocorrência.',
  ...json(ref('Error')),
};

export const openapi = swaggerJsdoc({
  apis: [],
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'UniAcademy API',
      version: '1.1.0',
      description:
        'API para consulta de planos, modalidades, horários e cadastro de solicitações de aulas experimentais. O cadastro não confirma uma reserva.',
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
                details: {
                  type: 'array',
                  items: { type: 'object' },
                },
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
            benefits: {
              type: 'array',
              items: { type: 'string' },
            },
            is_featured: { type: 'boolean' },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
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
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Schedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            weekday: {
              type: 'integer',
              minimum: 1,
              maximum: 6,
            },
            modality_name: { type: 'string' },
            time_slot: { type: 'string' },
            instructor: { type: 'string' },
            room: { type: 'string' },
          },
        },

        TrialInput: {
          type: 'object',
          additionalProperties: false,
          required: [
            'client_name',
            'phone',
            'email',
            'preferred_modality',
            'consent',
          ],
          properties: {
            client_name: {
              type: 'string',
              minLength: 3,
              maxLength: 120,
              example: 'Maria Silva',
            },
            phone: {
              type: 'string',
              pattern: '^(?:55)?\\d{10,11}$',
              example: '81999999999',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@example.com',
            },
            preferred_modality: {
              type: 'string',
              example: 'Musculação',
            },
            consent: {
              type: 'boolean',
              enum: [true],
            },
          },
        },

        TrialResult: {
          type: 'object',
          required: ['id', 'status', 'message'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            status: {
              type: 'string',
              enum: ['pending'],
              example: 'pending',
            },
            message: {
              type: 'string',
              example: 'Solicitação cadastrada com sucesso!',
            },
          },
        },

        SiteData: {
          type: 'object',
          properties: {
            plans: {
              type: 'array',
              items: ref('Plan'),
            },
            modalities: {
              type: 'array',
              items: ref('Modality'),
            },
            schedules: {
              type: 'array',
              items: ref('Schedule'),
            },
            contact: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                whatsapp_url: {
                  type: 'string',
                  nullable: true,
                },
              },
            },
            demo: { type: 'boolean' },
          },
        },

        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok'],
            },
            database: {
              type: 'string',
              enum: ['connected'],
            },
          },
        },
      },
    },

    paths: {
      '/api/site-data': {
        get: {
          summary: 'Consulta planos, modalidades e horários',
          responses: {
            200: {
              description: 'Dados disponíveis da academia',
              ...json(ref('SiteData')),
            },
            400: error,
            500: error,
            503: error,
          },
        },
      },

      '/api/trial-request': {
        post: {
          summary: 'Cadastra solicitação de aula experimental',
          description:
            'Valida os dados e armazena a solicitação no MySQL. Não exige WhatsApp nem Instagram. A solicitação permanece pendente de confirmação.',
          requestBody: {
            required: true,
            ...json(ref('TrialInput')),
          },
          responses: {
            201: {
              description:
                'Solicitação armazenada com sucesso no banco de dados',
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
          summary: 'Verifica a API e a conexão com o MySQL',
          responses: {
            200: {
              description: 'API e banco disponíveis',
              ...json(ref('Health')),
            },
            500: error,
            503: error,
          },
        },
      },
    },
  },
});
