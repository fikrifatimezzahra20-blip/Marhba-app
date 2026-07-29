export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Marhba Backend API",
    version: "1.0.0",
    description: "Interactive API documentation for Marhba backend service featuring JWT access and refresh token authentication.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your Bearer accessToken obtained from /register or /login",
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "SecretPassword123!",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "SecretPassword123!",
          },
        },
      },
      RefreshTokenInput: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      RefreshTokenResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Logged out successfully" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Invalid credentials" },
          code: { type: "string", example: "TOKEN_EXPIRED" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Validation error or email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login with existing credentials",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/refresh-token": {
      post: {
        summary: "Refresh Access Token using Refresh Token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Token refreshed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RefreshTokenResponse" },
              },
            },
          },
          "401": {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "Logout user and revoke refresh token",
        tags: ["Authentication"],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get current authenticated user profile",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer access token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
