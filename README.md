# 🎯 Event Bingo

Aplicação web desenvolvida no âmbito da unidade curricular **Laboratório de Projeto em Engenharia Informática** na **UTAD**, em parceria com a empresa **BLIP**.

## 👥 Autores
- Mário Zoio | 77164  
- Miguel Pereira | 76833  
- Docente: Luís Filipe Leite Barbosa

---

## 📌 Descrição do Projeto

O **Event Bingo** é uma aplicação web interativa que substitui os números tradicionais do bingo por **acontecimentos desportivos**. O administrador cria cartões personalizados para cada evento (ex.: “Benfica vs Chelsea”) e os utilizadores podem comprar esses cartões e acompanhar os acontecimentos em tempo real.

Funcionalidade base:
- O administrador cria os cartões com acontecimentos desportivos.
- Os utilizadores compram cartões e acompanham o progresso.
- Os acontecimentos são marcados durante o evento pelo administrador.
- O sistema distribui os prémios automaticamente no final.

---

## 🎯 Objetivos

- Criar cartões de bingo personalizados com acontecimentos desportivos.
- Desenvolver um painel de administração completo.
- Permitir a compra e visualização de cartões por parte dos utilizadores.
- Automatizar a marcação de bingos e a distribuição de prémios.

---

## ✅ Funcionalidades Desenvolvidas

- Autenticação de utilizadores
- Painel de administrador:
  - Criação e edição de cartões
  - Marcação de acontecimentos
  - Depósito de saldo
- Compra de cartões pelos utilizadores
- Página de acompanhamento de cartões comprados
- Validação automática de cartões com prémios
- Atualização de saldo em tempo real via **WebSockets**
- Componente modular de visualização de cartões, reutilizado em várias partes da app

---

## 🧰 Tecnologias e Ferramentas

| Camada | Ferramentas |
|--------|-------------|
| **Frontend** | React.js, TypeScript, SCSS, Vite |
| **Backend** | Node.js, Express |
| **Persistência** | JSON / LowDB (simulação de BD) |
| **Tempo real** | WebSockets |
| **Controlo de versão** | Git + GitHub |

---

## 🏗️ Arquitetura do Projeto

- **Cliente (frontend):** React + Vite (SPA)
- **Servidor (backend):** Node.js + Express (REST API)
- **Base de dados simulada:** Ficheiro `db.json`
- **Comunicação:** WebSockets para atualizações de saldo

---

## 🔁 Metodologia

- Desenvolvimento **iterativo**
- Modularização de componentes
- Commits frequentes no GitHub
- Refatoração contínua e testes manuais

---

## ⚙️ Principais Desafios

- Implementação de **drag-and-drop** no editor de cartões
- Sincronização de saldo via **WebSockets**
- Design e reutilização do **componente de cartão**
- Criação de uma interface atrativa e clara para utilizadores e admin

---

## 🚀 Resultados Obtidos

- Projeto funcional e estável
- Sistema de bingo totalmente adaptado ao contexto desportivo
- Painel de administração eficaz
- Entrega automática de prémios com base em condições definidas

---

## 🔮 Melhorias Futuras

- Integração com **base de dados real** (ex.: PostgreSQL, MongoDB)
- Autenticação com **JWT**
- Sistema de **notificações**
- Interface mais responsiva e com **melhor UX**
- Criação de **testes automatizados**

---

## 📸 Exemplos Visuais

> ⚠️ [Incluir capturas de ecrã aqui]  
> Por exemplo: editor do cartão, página de compra, vista do utilizador

---

## 📦 Repositório

Todo o código-fonte está disponível em:  
🔗 [https://github.com/Miguel23lp/event-bingo](https://github.com/Miguel23lp/event-bingo)

---

## 📚 Licença

Este projeto foi desenvolvido exclusivamente para fins académicos.
