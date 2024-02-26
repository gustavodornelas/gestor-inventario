-- Active: 1703610585848@@localhost@3306@gestor_documentacao

DROP DATABASE gestor_documentacao;

CREATE DATABASE gestor_documentacao;

CREATE TABLE
    empresa (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        razao_social VARCHAR(50) NOT NULL,
        cnpj VARCHAR(15) NOT NULL,
        nome_fantasia VARCHAR(50),
        inscricao_estadual VARCHAR(15),
        inscricao_municipal VARCHAR(15)
    );

CREATE TABLE
    filial_empresa (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        razao_social VARCHAR(50) NOT NULL,
        cnpj VARCHAR(15) NOT NULL,
        nome_fantasia VARCHAR(50),
        id_empresa INT NOT NULL,
        inscricao_estadual VARCHAR(15),
        inscricao_municipal VARCHAR(15),
        cep VARCHAR(10),
        logradouro VARCHAR(30),
        numero_endereco VARCHAR(5),
        complemento VARCHAR(20),
        bairro VARCHAR(20),
        cidade VARCHAR(20),
        estado VARCHAR(20),
        telefone VARCHAR(12),
        email VARCHAR(30),

CONSTRAINT FK_id_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id)
);

CREATE TABLE
    contatos_empresa (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        id_empresa INT NOT NULL,
        id_filial INT,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(30),
        telefone VARCHAR(12),
        descricao VARCHAR(50),
        CONSTRAINT FK_id_empresa_2 FOREIGN KEY (id_empresa) REFERENCES empresa (id)
    )

CREATE TABLE
    colaborador (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        cpf VARCHAR(11) NOT NULL,
        cargo VARCHAR(30),
        setor VARCHAR(30),
        sexo VARCHAR(10),
        data_nascimento DATE,
        id_empresa INT,
        id_filial INT,
        telefone VARCHAR(12),
        ramal VARCHAR(12),
        data_integracao DATE NOT NULL,
        data_desligamento DATE,
        CONSTRAINT FK_id_filial FOREIGN KEY (id_filial) REFERENCES filial_empresa (id)
    );

CREATE TABLE
    equipamento (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        tipo_equipamento VARCHAR(30) NOT NULL,
        nome VARCHAR(50) NOT NULL,
        descricao VARCHAR(50),
        id_empresa INT,
        id_filial INT,
        id_colaborador INT,
        data_inicial_colaborador DATE,
        situacao VARCHAR(30),
        marca VARCHAR(30),
        modelo VARCHAR(30),
        numero_serie VARCHAR(30),
        metodo_aquisicao VARCHAR(30),
        data_aquisicao DATE,
        numero_nota_fiscal VARCHAR(30),
        fornecedor VARCHAR(30),
        contrato VARCHAR(30),
        valor_equipamento FLOAT,
        data_baixa DATE,
        motivo_baixa VARCHAR(30),
        sistema_operacional VARCHAR(30),
        disco_SSD VARCHAR(30),
        memoria VARCHAR(30),
        processador VARCHAR(30),
        CONSTRAINT FK_id_empresa_3 FOREIGN KEY (id_empresa) REFERENCES empresa (id),
        CONSTRAINT FK_id_filial_2 FOREIGN KEY (id_filial) REFERENCES filial_empresa (id),
        CONSTRAINT FK_id_colaborador FOREIGN KEY (id_colaborador) REFERENCES colaborador (id)
    );

CREATE TABLE
    usuario (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario VARCHAR(18) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        nome VARCHAR(50)
    );

CREATE TABLE
    tokens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        token VARCHAR(255) NOT NULL,
        id_usuario INT NOT NULL,
        CONSTRAINT FK_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id)
    );

INSERT INTO
    usuario (usuario, senha, nome)
VALUES (
        'master',
        '#*#!%)(!f5',
        'Master'
    )

ALTER TABLE filial_empresa ADD COLUMN nome_fantasia VARCHAR(50);