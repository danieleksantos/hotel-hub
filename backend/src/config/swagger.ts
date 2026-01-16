import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel-Hub API',
      version: '1.0.0',
      description: 'API para gestão hoteleira',
    },
    servers: [
      { url: 'http://localhost:3000' },
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
    paths: {
      '/login': {
        post: {
          summary: 'Autentica usuário',
          tags: ['Auth'],
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
              description: 'Sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          username: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Não autorizado' },
          },
        },
      },
    },
  },

  apis: [], 
};

export const swaggerSpec = swaggerJsdoc(options);