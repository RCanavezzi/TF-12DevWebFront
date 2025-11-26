export default {
    "/api/users": {
        get: {
            summary: "Listar usuários",
            tags: ["Usuários"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 100 },
                    description: "Número máximo de registros"
                },
                {
                    name: "offset",
                    in: "query",
                    schema: { type: "integer", default: 0 },
                    description: "Deslocamento para paginação"
                },
                {
                    name: "orderBy",

                    in: "query",
                    schema: {
                        type: "string",
                        default: "id,asc",
                        enum: ["id,asc", "id,desc", "created_at,asc", "created_at,desc", "updated_at,asc", "updated_at,desc"],
                    },
                    description: "Campo e direção de ordenação"
                }
            ],
            responses: {
                200: {
                    description: "Lista de usuários"
                },
                400: {
                    description: "Erro de validação (limit excedido)"
                }
            }
        },
        post: {
            summary: "Inserir usuário",
            tags: ["Usuários"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["nome"],
                            properties: {
                                nome: { type: "string" },
                                esta_ativo: { type: "boolean", default: true }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Criado com sucesso" },
                400: { description: "Campo nome obrigatório" }
            }
        }
    },
    "/api/users/{id}": {
        get: {
            summary: "Obter usuário por ID",
            tags: ["Usuários"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Usuário encontrado" },
                404: { description: "Não encontrado" }
            }
        },
        put: {
            summary: "Atualizar usuário",
            tags: ["Usuários"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                nome: { type: "string" },
                                esta_ativo: { type: "boolean" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Atualizado com sucesso" },
                400: { description: "Nenhum campo informado" },
                404: { description: "Usuário não encontrado" }
            }
        },
        delete: {
            summary: "Remover usuário",
            tags: ["Usuários"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                204: { description: "Removido com sucesso" },
                404: { description: "Usuário não encontrado" }
            }
        }
    },
    "/api/users/{id}/photo": {
        "post": {
            "summary": "Upload de imagem de perfil",
            "description": "Faz o upload de uma imagem de perfil para um usuário específico. A imagem será salva no servidor e o campo `foto` do usuário será atualizado no banco de dados. Apenas arquivos com extensões permitidas serão aceitos.",
            "tags": ["Usuários"],
            "parameters": [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Arquivo de imagem a ser enviado"
                                }
                            },
                            "required": ["image"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Imagem enviada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": {
                                        "type": "string",
                                        "example": "Imagem enviada com sucesso"
                                    },
                                    "imagem": {
                                        "type": "string",
                                        "description": "Nome do arquivo salvo no servidor",
                                        "example": "1678901234567_image.png"
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Extensão de arquivo não permitida",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "error": {
                                        "type": "string",
                                        "example": "Extensão de arquivo não permitida. Permitidos: .png, .jpg, .jpeg, .webp, .gif, .svg"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Usuário não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "error": {
                                        "type": "string",
                                        "example": "Usuário não encontrado"
                                    }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro ao mover o arquivo ou atualizar o banco de dados",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "error": {
                                        "type": "string",
                                        "example": "Erro ao salvar a imagem no servidor"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};