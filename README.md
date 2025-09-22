Claro\! Aqui está um `README.md` completo e bem estruturado para o seu projeto, explicando sua arquitetura, funcionalidades e como executá-lo.

-----

# Carol Modas - E-commerce & Painel Administrativo

Este é o repositório completo do site **Carol Modas**, um e-commerce de moda feminina com um painel administrativo integrado para gerenciamento de produtos. O projeto foi construído com HTML, CSS e JavaScript puro (ES6 Modules), utilizando um backend leve em Node.js/Express para as funcionalidades do painel.

## 📜 Índice

  * [✨ Funcionalidades](https://www.google.com/search?q=%23-funcionalidades)
  * [🛠️ Tecnologias Utilizadas](https://www.google.com/search?q=%23%EF%B8%8F-tecnologias-utilizadas)
  * [📂 Estrutura do Projeto](https://www.google.com/search?q=%23-estrutura-do-projeto)
  * [🚀 Como Executar Localmente](https://www.google.com/search?q=%23-como-executar-localmente)
  * [⚙️ Como Funciona](https://www.google.com/search?q=%23%EF%B8%8F-como-funciona)
  * [☁️ Deploy](https://www.google.com/search?q=%23%EF%B8%8F-deploy)

-----

## ✨ Funcionalidades

O projeto é dividido em duas partes principais: o site público e o painel administrativo.

### 🛍️ Site Público (E-commerce)

  * **Página Inicial Dinâmica:** Apresenta um carrossel de banners, categorias em destaque e uma vitrine com os principais produtos.
  * **Listagem de Produtos:** Página dedicada a todos os produtos, com funcionalidades de:
      * **Filtro** por categoria.
      * **Ordenação** por preço, popularidade e data.
      * **Paginação** para uma navegação fluida.
  * **Página de Detalhes do Produto:**
      * Galeria de imagens com thumbnail e imagem principal interativa.
      * Seleção de **cor** e **tamanho**.
      * Seletor de **quantidade**.
      * Descrição formatada (suporta negrito e listas).
  * **Carrinho de Compras:**
      * Painel lateral para visualizar os itens adicionados.
      * Adicionar, remover e atualizar a quantidade de itens.
      * Cálculo do subtotal e total do pedido.
  * **Checkout via WhatsApp:** Finaliza o pedido gerando uma mensagem formatada e pronta para ser enviada pelo WhatsApp.
  * **Design Responsivo:** Totalmente adaptado para funcionar perfeitamente em desktops, tablets e celulares.

### 🔐 Painel Administrativo (`/admin`)

  * **Interface Moderna:** Um painel de controle intuitivo para gerenciar todo o catálogo de produtos.
  * **CRUD Completo de Produtos:**
      * **Criar:** Adicionar novos produtos através de um formulário completo.
      * **Ler:** Visualizar todos os produtos cadastrados em um layout de cards.
      * **Atualizar:** Editar qualquer informação de um produto existente.
      * **Excluir:** Remover produtos permanentemente.
  * **Upload de Imagens:** Sistema de upload de imagens integrado, que salva os arquivos no servidor e associa o caminho ao produto.
  * **Gerenciamento de Status:** Ative ou desative produtos para que eles apareçam ou não no site público.
  * **Campos Dinâmicos:** Adicione múltiplas imagens, cores e tamanhos de forma flexível no formulário.
  * **Publicação em "Um Clique":** As alterações são salvas em cache e só são aplicadas ao site público ao clicar em "Publicar Alterações", que sobrescreve o arquivo de "banco de dados".
  * **Notificações (Toasts):** Feedback visual para todas as ações (salvar, excluir, publicar, etc.).

-----

## 🛠️ Tecnologias Utilizadas

  * **Frontend:**
      * HTML5
      * CSS3 (com `@import` para modularização)
      * JavaScript (ES6 Modules)
  * **Backend (Apenas para o Admin):**
      * [Node.js](https://nodejs.org/)
      * [Express.js](https://expressjs.com/pt-br/)
  * **Dependências Node.js:**
      * `cors`: Para permitir a comunicação entre o frontend e o backend.
      * `multer`: Para gerenciar o upload de arquivos de imagem.

-----

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para separar claramente as responsabilidades.

```
/
├── admin/               # Contém os arquivos exclusivos do painel administrativo
│   ├── admin.css
│   ├── admin.js
│   └── index.html
├── assets/              # Todos os assets estáticos do site público
│   ├── css/
│   │   ├── components/  # CSS modularizado por componente (_header.css, _cart.css, etc.)
│   │   └── styles.css   # Arquivo principal que importa todos os outros
│   ├── images/
│   │   ├── products/    # Onde as imagens dos produtos são salvas
│   │   └── ...
│   └── js/
│       ├── pages/       # Lógica JS específica de cada página (home.js, products.js)
│       ├── utils/       # Funções utilitárias (modais, formatação)
│       ├── _database.js # "Banco de dados" em formato de módulo JS
│       ├── _shoppingCart.js # Módulo que gerencia o carrinho
│       └── ...
├── index.html           # Página inicial
├── produtos.html        # Página de listagem de produtos
├── detalhe-produto.html # Template para a página de detalhes
├── server.js            # Servidor Node.js que alimenta a API do painel admin
├── package.json         # Dependências do servidor
└── vercel.json          # Configuração de reescrita de URL para deploy
```

-----

## 🚀 Como Executar Localmente

Para rodar este projeto em sua máquina local, siga os passos abaixo.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/Carol-Modas.git
    ```

2.  **Navegue até a pasta do projeto:**

    ```bash
    cd Carol-Modas
    ```

3.  **Instale as dependências do servidor:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor:**

    ```bash
    node server.js
    ```

5.  **Acesse o projeto no seu navegador:**

      * **Site Principal:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
      * **Painel Administrativo:** [http://localhost:3000/admin](https://www.google.com/search?q=http://localhost:3000/admin)

-----

## ⚙️ Como Funciona

Este projeto utiliza uma abordagem "database-less" (sem banco de dados tradicional) para simplificar o desenvolvimento e o deploy.

### Fluxo de Dados

1.  **Banco de Dados Simulado:** O arquivo `assets/js/_database.js` atua como um banco de dados. Ele exporta um array de objetos `productsData`, que contém todas as informações dos produtos.
2.  **Site Público:** As páginas do site (`index.html`, `produtos.html`, etc.) importam o `productsData` diretamente como um módulo JavaScript para renderizar os produtos. Isso torna o carregamento extremamente rápido, pois não há chamadas a uma API externa.
3.  **Painel Administrativo:**
      * Ao carregar, o painel faz uma chamada `GET` para a API interna (`/api/products`) no `server.js`.
      * O servidor lê o arquivo `_database.js` e retorna os dados como JSON.
      * O administrador pode adicionar, editar ou excluir produtos. Todas essas alterações são mantidas em uma variável local (cache) no navegador.
      * Quando o administrador clica em **"Publicar Alterações"**, o painel envia todo o array de produtos atualizado via `POST` para `/api/products`.
      * O `server.js` recebe esses dados, formata-os como código JavaScript e **sobrescreve completamente** o arquivo `_database.js`.
      * Na próxima vez que um usuário carregar o site público, ele já receberá o `_database.js` atualizado.

### Reescrita de URL

Para criar URLs amigáveis para os produtos (ex: `/produto/blusa-canelada-rosa`), o `server.js` (para ambiente local) e o `vercel.json` (para produção) contêm uma regra de "rewrite". Qualquer requisição para `/produto/*` é internamente redirecionada para a página `detalhe-produto.html`, que então usa o JavaScript para ler o "slug" da URL e exibir o produto correto.

-----
