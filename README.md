# 🛍️ Loja da Thay — Catálogo Interativo Mobile

> Aplicativo mobile responsivo de catálogo de moda desenvolvido com **React Native (Expo)**, consumindo dados reais da API REST **DummyJSON** via **Axios**, com gerenciamento de estado global via **Redux Toolkit**.

---

## 📋 Sobre o Projeto

A **Loja da Thay** é um aplicativo de catálogo de produtos de moda que permite ao usuário navegar entre categorias masculinas e femininas, buscar produtos, visualizar detalhes completos, favoritar itens e gerenciar uma sacola de compras — tudo consumindo uma API externa em tempo real.

O app foi desenvolvido como trabalho acadêmico da disciplina de **Mobile Development**, aplicando conceitos de:
- Consumo de API REST externa com tratamento de erros e estados de carregamento
- Navegação intuitiva entre telas com **React Navigation** (Stack + Bottom Tabs)
- Boas práticas de estruturação de projetos React Native
- Separação entre lógica de negócio, estilização e renderização de componentes
- Gerenciamento de estado global com **Redux Toolkit**

---

## 🎯 Funcionalidades Implementadas

### 1. Tela de Login
- Validação de campos obrigatórios (e-mail e senha)
- Alertas de erro caso os campos estejam vazios
- Armazenamento do e-mail do usuário no estado global via **Redux Toolkit** (`userSlice`)
- Navegação automática para o catálogo após autenticação
- Design premium com logo, ícones e efeitos de sombra

### 2. Catálogo de Produtos com Tabs (Masculino / Feminino)
- **Aba Masculino**: lista produtos das categorias `mens-shirts`, `mens-shoes` e `mens-watches`
- **Aba Feminino**: lista produtos das categorias `womens-bags`, `womens-dresses`, `womens-jewellery`, `womens-shoes` e `womens-watches`
- Consumo de dados via **Axios** através do endpoint `https://dummyjson.com/products/category/{categoria}`
- **Busca funcional** integrada com a API (`/products/search?q=`) com debounce de 400ms
- **Filtros interativos**: Tudo, Mais Vendidos (por rating), Lançamentos (por ID) e Promoções (desconto ≥ 10%)
- Layout em **grid responsivo** que adapta o número de colunas conforme a largura da tela (2 a 5 colunas)
- Cards com imagem, badge de desconto, ícone de favorito, avaliação com estrela e preço com desconto riscado
- **ActivityIndicator** durante o carregamento dos dados
- Mensagem de estado vazio quando nenhum produto é encontrado na busca

### 3. Tela de Detalhes do Produto
- Exibição completa de **nome, marca, descrição, preço, desconto e imagens**
- Navegação com passagem de parâmetro de ID (endpoint: `https://dummyjson.com/products/{id}`)
- **Galeria de imagens** horizontal deslizável com indicador de pontos (dots)
- Seletor de tamanho interativo (P, M, G, GG)
- Badge de desconto e avaliação com estrela
- **Status de estoque** com indicador visual colorido (verde, amarelo ou vermelho)
- Cards informativos de **garantia**, **prazo de entrega** e **política de devolução**
- Seção de **avaliações** com avatar do revisor, estrelas e comentários traduzidos para pt-BR
- Botão de favoritar/desfavoritar na imagem do produto
- Botão **"Adicionar à Sacola"** que despacha a ação para o Redux e retorna à lista

### 4. Favoritos
- Sistema de favoritar/desfavoritar com ícone de coração nos cards
- Aba dedicada **Favoritos** com grid dos itens salvos
- Gerenciado pelo **Redux Toolkit** (`favoritesSlice`)
- Possibilidade de remover favoritos e navegar aos detalhes do produto

### 5. Sacola de Compras
- Carrinho funcional gerenciado pelo **Redux Toolkit** (`cartSlice`)
- Controles de quantidade (+/−) e botão de remover item
- Exibição de thumbnail, título, tamanho selecionado e preço
- Barra inferior com total de itens, valor total e botão **"Finalizar Compra"**
- Badge com contagem de itens no ícone da aba Sacola
- Estado vazio com mensagem ilustrativa

### 6. Perfil do Usuário
- Avatar com iniciais do e-mail do usuário
- Exibição do e-mail salvo no Redux e status de membro
- Painel de estatísticas (Favoritos, Na Sacola, Pedidos)
- Menu de opções com ícones coloridos (Pedidos, Favoritos, Sacola, Endereços, Pagamento, Notificações)
- Informações do app (versão)
- Botão de **Logout** que limpa todos os dados do Redux e redireciona para a tela de login

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React Native** | 0.81.5 | Framework principal para desenvolvimento mobile multiplataforma |
| **Expo** | ~54.0 | Plataforma de desenvolvimento, build e execução |
| **Axios** | ^1.13.6 | Biblioteca para requisições HTTP à API REST |
| **Redux Toolkit** | ^2.11.2 | Gerenciamento de estado global (login, carrinho, favoritos) |
| **React Navigation** | v7 | Navegação entre telas (Stack Navigator + Bottom Tabs) |
| **TypeScript** | ~5.9.2 | Tipagem estática para maior segurança e manutenibilidade |
| **Ionicons** | via @expo/vector-icons | Biblioteca de ícones vetoriais |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) (incluso com o Node.js)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd catalogo-mobile

# 2. Instale todas as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start
```

### Opções de Execução
| Opção | Comando | Observação |
|---|---|---|
| **Web** | Pressione `w` no terminal | Acesso em `http://localhost:8081` |
| **Android** | Pressione `a` no terminal | Requer emulador Android ou app Expo Go |
| **iOS** | Pressione `i` no terminal | Requer simulador (somente macOS) |

---

## 📁 Estrutura do Projeto

```
catalogo-mobile/
├── App.tsx                              # Componente raiz — define Stack Navigator (Login → Tabs → Details)
│
├── src/
│   ├── components/
│   │   └── ProductList.tsx              # Componente reutilizável de listagem com busca, filtros e grid
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx              # Tela de login com validação e Redux dispatch
│   │   ├── DetailsScreen.tsx            # Tela de detalhes com galeria, reviews e ação de carrinho
│   │   ├── CartScreen.tsx               # Tela da sacola com controle de quantidade e checkout
│   │   ├── FavoritesScreen.tsx          # Tela de favoritos em grid responsivo
│   │   └── ProfileScreen.tsx            # Tela de perfil com stats, menu e logout
│   │
│   ├── routes/
│   │   └── TabRoutes.tsx                # Navegação por abas: Masculino | Feminino | Favoritos | Sacola | Perfil
│   │
│   ├── services/
│   │   └── api.ts                       # Instância do Axios configurada com baseURL da DummyJSON
│   │
│   └── store/
│       ├── index.ts                     # Configuração central da Store (combina os 3 reducers)
│       ├── userSlice.ts                 # Slice do usuário — ações: loginUser, logoutUser
│       ├── cartSlice.ts                 # Slice do carrinho — ações: addToCart, removeFromCart, updateQuantity, clearCart
│       └── favoritesSlice.ts            # Slice dos favoritos — ações: toggleFavorite, clearFavorites
│
├── package.json                         # Dependências e scripts do projeto
└── tsconfig.json                        # Configuração do TypeScript
```

---

## 🔗 API Consumida

O aplicativo consome a API pública **DummyJSON** (`https://dummyjson.com`):

| Endpoint | Método | Descrição |
|---|---|---|
| `/products/category/{categoria}` | GET | Lista de produtos por categoria (ex: `mens-shirts`) |
| `/products/search?q={termo}` | GET | Busca de produtos por texto |
| `/products/{id}` | GET | Detalhes completos de um produto (imagens, reviews, estoque, etc.) |

### Categorias Utilizadas
- **Masculino**: `mens-shirts`, `mens-shoes`, `mens-watches`
- **Feminino**: `womens-bags`, `womens-dresses`, `womens-jewellery`, `womens-shoes`, `womens-watches`

---

## 📱 Screenshots

### Tela de Login
Interface com logo, campos de e-mail e senha com ícones, e botão de acesso com design premium.

![Tela de Login](docs/screenshots/01_login.png)

### Catálogo — Aba Masculino
Grid responsivo com camisas, sapatos e relógios masculinos. Cada card exibe imagem, badge de desconto, avaliação e preço.

![Aba Masculino](docs/screenshots/02_masculino.png)

### Catálogo — Aba Feminino
Grid responsivo com bolsas, vestidos, joias, sapatos e relógios femininos.

![Aba Feminino](docs/screenshots/03_feminino.png)

### Detalhes do Produto
Galeria de imagens, informações de preço e desconto, seletor de tamanho, reviews em português e informações de garantia/entrega.

![Detalhes do Produto](docs/screenshots/04_detalhes.png)

### Perfil do Usuário
Avatar com iniciais, e-mail do usuário, estatísticas de uso, menu de configurações e botão de logout.

![Perfil do Usuário](docs/screenshots/06_perfil.png)

---

## 👤 Autora

Desenvolvido por **Thay** como trabalho acadêmico da disciplina de **Mobile Development**.
