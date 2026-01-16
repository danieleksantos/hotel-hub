import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel-Hub API',
      version: '1.0.0',
      description: 'API para gestão hoteleira',
      contact: {
        name: 'Daniele Santos',
      },
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Servidor Local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [],
    paths: {
      // --- LOGIN ---
      '/login': {
        post: {
          summary: 'Autentica usuário e retorna Token',
          tags: ['Auth'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string', example: 'admin' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { type: 'object' },
                      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciais inválidas' },
          },
        },
      },
      
      // --- HOTÉIS ---
      '/hotels': {
        get: {
          summary: 'Lista todos os hotéis',
          tags: ['Hotels'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista recuperada',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-...' },
                        name: { type: 'string', example: 'Hotel Fasano' },
                        city: { type: 'string', example: 'São Paulo' },
                        stars: { type: 'integer', example: 5 },
                        total_rooms: { type: 'integer', example: 50 },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Não autorizado' },
          },
        },
        post: {
          summary: 'Cadastra um novo hotel',
          tags: ['Hotels'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'city', 'address', 'stars', 'total_rooms'],
                  properties: {
                    name: { type: 'string', example: 'Hotel Fasano' },
                    city: { type: 'string', example: 'São Paulo' },
                    address: { type: 'string', example: 'Rua Vitório Fasano, 88' },
                    stars: { type: 'integer', example: 5 },
                    description: { type: 'string', example: 'Hotel de luxo' },
                    total_rooms: { type: 'integer', example: 50 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Hotel criado com sucesso' },
            400: { description: 'Dados inválidos' },
            401: { description: 'Não autorizado' },
          },
        },
      },

      // --- RESERVAS (BOOKINGS) ---
      '/bookings': {
        post: {
          summary: 'Cria uma nova reserva',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  // responsible_name OBRIGATÓRIO
                  required: ['hotelId', 'startDate', 'endDate', 'responsible_name'],
                  properties: {
                    hotelId: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
                    startDate: { type: 'string', format: 'date', example: '2026-12-25' },
                    endDate: { type: 'string', format: 'date', example: '2026-12-31' },
                    responsible_name: { type: 'string', example: 'João da Silva' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Reserva criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Reserva confirmada!' },
                      booking: {
                         type: 'object',
                         properties: {
                           id: { type: 'string', format: 'uuid' },
                           hotel_id: { type: 'string', format: 'uuid' },
                           start_date: { type: 'string', format: 'date' },
                           end_date: { type: 'string', format: 'date' },
                           responsible_name: { type: 'string', example: 'João da Silva' },
                           created_at: { type: 'string', format: 'date-time' }
                         }
                      }
                    },
                  },
                },
              },
            },
            400: { description: 'Datas inválidas ou campos faltando' },
            404: { description: 'Hotel não encontrado' },
            409: { description: 'Conflito: Sem quartos disponíveis (Overbooking)' },
          },
        },
        get: {
          summary: 'Lista TODAS as reservas (Visão do Gestor)',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista geral de reservas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: '9b1deb4d-...' },
                        hotel_name: { type: 'string', example: 'Hotel Fasano' },
                        city: { type: 'string', example: 'São Paulo' },
                        start_date: { type: 'string', example: '2026-12-25' },
                        end_date: { type: 'string', example: '2026-12-31' },
                        responsible_name: { type: 'string', example: 'João da Silva' },
                        created_at: { type: 'string', example: '2026-01-16T18:30:00.000Z' }
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);