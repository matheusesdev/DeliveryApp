# 🍔 DeliveryApp - Aplicativo de Delivery de Alimentos

Um aplicativo completo de delivery de alimentos desenvolvido com React Native e Expo, oferecendo uma experiência moderna e intuitiva para pedidos online.

## 📱 Sobre o Projeto

O **DeliveryApp** é uma solução completa de delivery que permite aos usuários:
- Navegar por um catálogo de produtos
- Adicionar itens ao carrinho com personalização
- Gerenciar endereços de entrega
- Gerenciar formas de pagamento
- Finalizar pedidos
- Acompanhar histórico de pedidos
- Personalizar configurações do perfil

## 🎨 Design e Identidade Visual

O aplicativo utiliza uma paleta de cores cuidadosamente selecionada:
- **Background**: `#f2e9dd` (creme/bege claro) - proporcionando uma experiência visual suave
- **Primário**: `#d6a05b` (dourado/bronze) - usado em headers e elementos de destaque
- **Texto Principal**: `#1a1309` (marrom escuro) - garantindo boa legibilidade
- **Texto Secundário**: `#6b655c` (cinza acastanhado) - para informações complementares
- **Cards**: `#ffffff` (branco) - criando contraste e organização visual

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo** (SDK 54.0.20)
- **React Navigation** (Bottom Tabs + Native Stack)
- **Context API** para gerenciamento de estado
- **@expo/vector-icons** (Ionicons) para ícones
- **react-native-gesture-handler** para navegação fluida

## 📂 Estrutura do Projeto

```
DeliveryApp/
├── App.js                          # Componente raiz com providers e navegação
├── app.json                        # Configurações do Expo
├── eas.json                        # Configurações do EAS Build
├── package.json                    # Dependências do projeto
├── assets/                         # Imagens e recursos estáticos
└── src/
    ├── context/                    # Gerenciamento de estado global
    │   ├── CartContext.js          # Contexto do carrinho de compras
    │   ├── AddressContext.js       # Contexto de endereços
    │   ├── OrderContext.js         # Contexto de pedidos
    │   └── PaymentContext.js       # Contexto de pagamentos
    └── screens/                    # Telas do aplicativo
        ├── HomeScreen.js           # Tela principal com produtos
        ├── DetailsScreen.js        # Detalhes do produto
        ├── SearchScreen.js         # Busca de produtos
        ├── CartScreen.js           # Carrinho de compras
        ├── CheckoutScreen.js       # Finalização do pedido
        ├── ProfileScreen.js        # Perfil do usuário
        ├── AddressesScreen.js      # Gerenciamento de endereços
        ├── OrderHistoryScreen.js   # Histórico de pedidos
        └── PaymentMethodsScreen.js # Gerenciamento de pagamentos
```

## 🧩 Componentes Principais

### 📱 **App.js**
Componente raiz que configura toda a estrutura do aplicativo:

- **Providers**: Envolve o app com múltiplos contextos (Cart, Address, Order, Payment)
- **Navegação**: Configura três stacks principais:
  - `HomeStack`: Tela inicial, busca e detalhes
  - `CartStack`: Carrinho e checkout
  - `ProfileStack`: Perfil, endereços, histórico e pagamentos
- **Tab Navigator**: Navegação inferior com 4 abas principais
- **Theme**: Define o tema global do aplicativo

```javascript
// Estrutura de Providers (de dentro para fora)
<CartProvider>
  <AddressProvider>
    <OrderProvider>
      <PaymentProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </PaymentProvider>
    </OrderProvider>
  </AddressProvider>
</CartProvider>
```

## 📄 Telas (Screens)

### 🏠 **HomeScreen.js**
**Funcionalidade**: Tela principal exibindo o catálogo de produtos

**Características**:
- Exibe produtos em cards com imagem, nome, descrição e preço
- Navegação para `DetailsScreen` ao tocar em um produto
- Layout em duas colunas usando `FlatList`
- Dados mockados de produtos de delivery (hambúrgueres, pizzas, bebidas, sobremesas)

**Dados do Produto**:
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  image: string (URL),
  category: string,
  ingredients: array
}
```

---

### 🔍 **SearchScreen.js**
**Funcionalidade**: Busca em tempo real de produtos

**Características**:
- Campo de busca com ícone de lupa
- Filtragem por:
  - Nome do produto
  - Categoria
  - Ingredientes
- Busca case-insensitive
- Resultados atualizados em tempo real usando `useMemo`
- Mensagem quando nenhum resultado é encontrado
- Navegação para `DetailsScreen` ao selecionar um produto

**Lógica de Busca**:
```javascript
const filteredProducts = useMemo(() => {
  if (!searchQuery.trim()) return PRODUCTS;
  
  return PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.ingredients.some(ing => 
      ing.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
}, [searchQuery]);
```

---

### 📝 **DetailsScreen.js**
**Funcionalidade**: Exibição detalhada de um produto

**Características**:
- Imagem grande do produto
- Nome, descrição e preço
- Lista de ingredientes com ícones
- Seletor de quantidade (+/-)
- Campo de observações personalizadas
- Botão "Adicionar ao Pedido" que:
  - Adiciona o item ao carrinho via `CartContext`
  - Mostra confirmação visual
  - Retorna à tela anterior

**Dados Adicionados ao Carrinho**:
```javascript
{
  id: string (único por item),
  productId: string,
  name: string,
  price: number,
  quantity: number,
  observations: string,
  image: string
}
```

---

### 🛒 **CartScreen.js**
**Funcionalidade**: Visualização e gerenciamento do carrinho

**Características**:
- Lista de itens adicionados com:
  - Imagem miniatura
  - Nome e quantidade
  - Observações (se houver)
  - Preço total por item
  - Botão de remoção
- Resumo do pedido:
  - Subtotal
  - Taxa de entrega
  - Total geral
- Mensagem de carrinho vazio com ilustração
- Botão "Finalizar Pedido" que navega para `CheckoutScreen`

**Funções do CartContext Utilizadas**:
- `cartItems`: Lista de itens
- `removeFromCart(id)`: Remove item
- `getCartTotal()`: Calcula total

---

### ✅ **CheckoutScreen.js**
**Funcionalidade**: Finalização do pedido com seleção de endereço e pagamento

**Características**:
- **Seleção de Endereço**:
  - Exibe endereço padrão automaticamente
  - Modal para escolher outro endereço
  - Validação de endereço selecionado
  
- **Seleção de Forma de Pagamento**:
  - Integrado com `PaymentContext`
  - Exibe método padrão automaticamente
  - Lista todos os cartões salvos e métodos fixos (PIX, dinheiro)
  - Formatação de cartões: "Visa •••• 1234"
  - Ícones dinâmicos por tipo de pagamento
  
- **Resumo do Pedido**:
  - Lista de itens com quantidades
  - Subtotal, taxa de entrega e total
  
- **Finalização**:
  - Validação de endereço e pagamento
  - Criação do pedido via `OrderContext`
  - Limpeza do carrinho
  - Navegação automática para histórico de pedidos

**Fluxo de Finalização**:
```javascript
1. Usuário revisa itens do carrinho
2. Seleciona endereço de entrega
3. Seleciona forma de pagamento
4. Confirma o pedido
5. Pedido é salvo no histórico
6. Carrinho é limpo
7. Redirecionamento para OrderHistoryScreen
```

---

### 👤 **ProfileScreen.js**
**Funcionalidade**: Dashboard do perfil do usuário

**Características**:
- **Informações do Usuário** (mockadas):
  - Avatar circular
  - Nome completo
  - Email
  - Telefone
  - Endereço resumido
  
- **Opções do Menu**:
  - ✏️ Editar Perfil (em desenvolvimento)
  - 📦 Histórico de Pedidos → `OrderHistoryScreen`
  - 💳 Formas de Pagamento → `PaymentMethodsScreen`
  - 📍 Meus Endereços → `AddressesScreen`
  - 💬 Suporte (alert com WhatsApp)
  
- **Configurações**:
  - Switch para notificações
  - Switch para ofertas e promoções
  - Botão de logout

**Navegação**:
Todas as opções usam `navigation.navigate()` para telas dentro do `ProfileStack`.

---

### 📍 **AddressesScreen.js**
**Funcionalidade**: Gerenciamento completo de endereços de entrega

**Características**:
- **Listagem de Endereços**:
  - Cards com todas as informações
  - Badge "Padrão" no endereço principal
  - Ícones de edição e exclusão
  
- **Adicionar Novo Endereço**:
  - FAB (Floating Action Button) no canto inferior direito
  - Modal com formulário completo
  
- **Editar Endereço**:
  - Modal pré-preenchido com dados atuais
  - Atualização via `updateAddress()`
  
- **Remover Endereço**:
  - Confirmação antes de excluir
  - Não permite remover o endereço padrão
  
- **Definir como Padrão**:
  - Botão em cada card
  - Atualização instantânea do badge

**Campos do Formulário**:
```javascript
{
  id: string,
  label: string,        // Ex: "Casa", "Trabalho"
  street: string,       // Rua e número
  complement: string,   // Apartamento, bloco, etc.
  neighborhood: string, // Bairro
  city: string,         // Cidade
  state: string,        // Estado (UF)
  zipCode: string,      // CEP
  isDefault: boolean    // Endereço padrão
}
```

**Validações**:
- Todos os campos obrigatórios exceto complemento
- CEP com máscara (00000-000)

---

### 📦 **OrderHistoryScreen.js**
**Funcionalidade**: Histórico completo de pedidos realizados

**Características**:
- **Listagem de Pedidos**:
  - Cards com:
    - Número do pedido
    - Data e hora formatadas
    - Status com cores dinâmicas
    - Total do pedido
  - Ordenação: mais recentes primeiro
  
- **Status Possíveis**:
  - 🟡 **Pendente**: Aguardando confirmação
  - 🔵 **Preparando**: Em preparação
  - 🟣 **A Caminho**: Saiu para entrega
  - 🟢 **Entregue**: Pedido concluído
  - 🔴 **Cancelado**: Pedido cancelado
  
- **Detalhes do Pedido**:
  - Modal com informações completas:
    - Lista de itens com quantidades
    - Endereço de entrega
    - Forma de pagamento
    - Subtotal, taxa e total
    - Histórico de status
  
- **Ações**:
  - Botão "Pedir Novamente" (apenas para pedidos entregues)
  - Adiciona todos os itens ao carrinho
  - Navega para o carrinho

**Helpers do OrderContext**:
```javascript
formatOrderDate(date)    // "10/11/2025"
formatOrderTime(date)    // "14:30"
getStatusLabel(status)   // Texto do status
getStatusColor(status)   // Cor do badge
```

---

### 💳 **PaymentMethodsScreen.js**
**Funcionalidade**: Gerenciamento de formas de pagamento

**Características**:
- **Listagem de Cartões**:
  - Cards com:
    - Ícone da bandeira
    - Número mascarado (•••• 1234)
    - Nome do titular
    - Validade
    - Badge "Padrão"
    - Badge "EXPIRADO" (se aplicável)
  - Ícones de edição e exclusão
  
- **Adicionar Cartão**:
  - FAB no canto inferior direito
  - Modal com formulário completo
  
- **Validações**:
  - **Número do Cartão**: 13-19 dígitos
  - **Detecção de Bandeira**: Automática (Visa, Mastercard, AmEx, Elo)
  - **Data de Validade**: Formato MM/AA, não pode estar vencida
  - **CVV**: 3 dígitos (4 para AmEx)
  - **Nome**: Somente letras e espaços
  
- **Tipos de Cartão**:
  - Crédito
  - Débito
  
- **Métodos Fixos**:
  - 💰 PIX
  - 💵 Dinheiro
  - Não podem ser editados ou removidos

**Detecção de Bandeira**:
```javascript
Visa:       começam com 4
Mastercard: começam com 51-55 ou 2221-2720
AmEx:       começam com 34 ou 37
Elo:        começam com 636368, 438935, 504175, etc.
```

**Formatação**:
- Número do cartão: `0000 0000 0000 0000`
- Validade: `MM/AA`
- Mascaramento: `•••• 1234` (últimos 4 dígitos)

---

## 🗂️ Contextos (Context API)

### 🛒 **CartContext.js**
**Responsabilidade**: Gerenciar o carrinho de compras

**Estado**:
```javascript
{
  cartItems: [
    {
      id: string,
      productId: string,
      name: string,
      price: number,
      quantity: number,
      observations: string,
      image: string
    }
  ]
}
```

**Funções Exportadas**:
- `addToCart(item)`: Adiciona item ao carrinho
- `removeFromCart(id)`: Remove item do carrinho
- `clearCart()`: Limpa todo o carrinho
- `getCartTotal()`: Calcula valor total
- `cartItems`: Array de itens

**Hook Personalizado**:
```javascript
const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();
```

---

### 📍 **AddressContext.js**
**Responsabilidade**: Gerenciar endereços de entrega

**Estado**:
```javascript
{
  addresses: [
    {
      id: string,
      label: string,
      street: string,
      complement: string,
      neighborhood: string,
      city: string,
      state: string,
      zipCode: string,
      isDefault: boolean
    }
  ]
}
```

**Funções Exportadas**:
- `addAddress(address)`: Adiciona novo endereço
- `updateAddress(id, updatedData)`: Atualiza endereço existente
- `removeAddress(id)`: Remove endereço (exceto padrão)
- `setDefaultAddress(id)`: Define endereço padrão
- `addresses`: Array de endereços
- `defaultAddress`: Endereço marcado como padrão

**Dados Iniciais**:
Vem com 2 endereços mockados (Casa e Trabalho).

---

### 📦 **OrderContext.js**
**Responsabilidade**: Gerenciar histórico de pedidos

**Estado**:
```javascript
{
  orders: [
    {
      id: string,
      orderNumber: string,
      date: Date,
      status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled',
      items: array,
      address: object,
      paymentMethod: string,
      subtotal: number,
      deliveryFee: number,
      total: number
    }
  ]
}
```

**Funções Exportadas**:
- `addOrder(order)`: Adiciona novo pedido
- `updateOrderStatus(id, status)`: Atualiza status do pedido
- `cancelOrder(id)`: Cancela pedido
- `reorder(orderId)`: Adiciona itens de um pedido antigo ao carrinho
- `orders`: Array de pedidos

**Helpers**:
- `formatOrderDate(date)`: Formata data (DD/MM/YYYY)
- `formatOrderTime(date)`: Formata hora (HH:MM)
- `getStatusLabel(status)`: Retorna texto do status
- `getStatusColor(status)`: Retorna cor para cada status

**Dados Iniciais**:
Vem com 3 pedidos mockados com diferentes status.

---

### 💳 **PaymentContext.js**
**Responsabilidade**: Gerenciar formas de pagamento

**Estado**:
```javascript
{
  paymentMethods: [
    {
      id: string,
      type: 'card',
      cardNumber: string,
      cardHolderName: string,
      expiryDate: string,
      cvv: string,
      brand: 'visa' | 'mastercard' | 'amex' | 'elo',
      cardType: 'credit' | 'debit',
      isDefault: boolean
    }
  ]
}
```

**Métodos Fixos**:
```javascript
[
  { id: 'pix', type: 'pix', name: 'PIX', icon: 'qr-code' },
  { id: 'money', type: 'money', name: 'Dinheiro', icon: 'cash' }
]
```

**Funções Exportadas**:
- `addPaymentMethod(method)`: Adiciona novo cartão
- `updatePaymentMethod(id, data)`: Atualiza cartão
- `removePaymentMethod(id)`: Remove cartão
- `setDefaultPaymentMethod(id)`: Define método padrão
- `paymentMethods`: Cartões salvos
- `allMethods`: Cartões + métodos fixos
- `defaultMethod`: Método padrão

**Helpers**:
- `formatCardNumber(number)`: Formata número do cartão
- `getCardBrandIcon(brand)`: Retorna ícone da bandeira
- `isCardExpired(expiryDate)`: Verifica se está vencido

**Dados Iniciais**:
Vem com 2 cartões mockados.

---

## 🚀 Melhorias Recentemente Implementadas

### ✨ **1. Sistema de Busca Avançado**
- ✅ Busca em tempo real
- ✅ Filtros múltiplos (nome, categoria, ingredientes)
- ✅ Interface intuitiva com feedback visual
- ✅ Performance otimizada com `useMemo`

### ✨ **2. Gerenciamento de Endereços**
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Sistema de endereço padrão
- ✅ Validação de campos
- ✅ Integração com checkout
- ✅ Modal para adicionar/editar

### ✨ **3. Histórico de Pedidos**
- ✅ Listagem de todos os pedidos
- ✅ Sistema de status com 5 estados
- ✅ Detalhes completos em modal
- ✅ Função "Pedir Novamente"
- ✅ Formatação de data e hora
- ✅ Cores dinâmicas por status

### ✨ **4. Gerenciamento de Pagamentos**
- ✅ Adicionar e gerenciar múltiplos cartões
- ✅ Detecção automática de bandeira
- ✅ Validação completa (número, CVV, validade)
- ✅ Verificação de cartão expirado
- ✅ Métodos fixos (PIX e dinheiro)
- ✅ Sistema de método padrão
- ✅ Formatação e mascaramento de dados sensíveis
- ✅ Integração completa com checkout

### ✨ **5. Fluxo de Checkout Completo**
- ✅ Seleção de endereço de entrega
- ✅ Seleção de forma de pagamento
- ✅ Validações antes de finalizar
- ✅ Salvamento automático no histórico
- ✅ Limpeza do carrinho após confirmação
- ✅ Navegação inteligente pós-pedido

---

## 📊 Fluxo de Navegação

```
TabNavigator (Bottom Tabs)
│
├── 🏠 Home Tab (HomeStack)
│   ├── HomeScreen (Inicial)
│   ├── DetailsScreen
│   └── SearchScreen
│
├── 🛒 Carrinho Tab (CartStack)
│   ├── CartScreen
│   └── CheckoutScreen
│
├── 🔍 Busca Tab
│   └── SearchScreen
│
└── 👤 Perfil Tab (ProfileStack)
    ├── ProfileScreen (Inicial)
    ├── AddressesScreen
    ├── OrderHistoryScreen
    └── PaymentMethodsScreen
```

---

## 🎯 Funcionalidades Principais

### Para o Usuário Final:
✅ Navegação intuitiva com tabs inferiores  
✅ Catálogo de produtos com imagens  
✅ Busca avançada de produtos  
✅ Carrinho com personalização (quantidade e observações)  
✅ Múltiplos endereços de entrega  
✅ Múltiplas formas de pagamento  
✅ Checkout seguro e validado  
✅ Histórico completo de pedidos  
✅ Acompanhamento de status  
✅ Função "Pedir Novamente"  
✅ Gerenciamento de perfil  

### Para Desenvolvedores:
✅ Código modular e organizado  
✅ Context API para estado global  
✅ Componentes reutilizáveis  
✅ Validações robustas  
✅ Comentários explicativos  
✅ Padrões de nomenclatura consistentes  
✅ Fácil manutenção e escalabilidade  

---

## 🔧 Como Executar o Projeto

### Pré-requisitos:
- Node.js instalado
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo Expo Go no celular (Android/iOS)

### Instalação:

```bash
# Clone o repositório
git clone https://github.com/matheusesdev/DeliveryApp.git

# Entre na pasta do projeto
cd DeliveryApp

# Instale as dependências
npm install

# Inicie o servidor Expo
npx expo start
```

### Executando:

1. Após executar `npx expo start`, um QR code aparecerá no terminal
2. Abra o app **Expo Go** no seu celular
3. Escaneie o QR code
4. O aplicativo será carregado no seu dispositivo

---

## 🎨 Padrões de Código

### Nomenclatura:
- **Componentes**: PascalCase (`HomeScreen.js`)
- **Funções**: camelCase (`addToCart`)
- **Constantes**: UPPER_SNAKE_CASE (`PRODUCTS`, `DELIVERY_FEE`)
- **Contextos**: PascalCase + Context (`CartContext`)

### Estrutura de Componente:
```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ComponentName({ navigation }) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Funções
  const handleAction = () => {
    // lógica
  };
  
  // 3. Render
  return (
    <View style={styles.container}>
      <Text>Content</Text>
    </View>
  );
}

// 4. Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## 📈 Possíveis Melhorias Futuras

### 🎯 Próximas Features:
- [ ] Edição completa de dados do perfil
- [ ] Modo escuro (Dark Mode)
- [ ] Integração com API real
- [ ] Autenticação de usuários
- [ ] Chat de suporte / WhatsApp
- [ ] Notificações push
- [ ] Sistema de avaliação de produtos
- [ ] Cupons de desconto
- [ ] Programa de fidelidade
- [ ] Rastreamento de entrega em tempo real

### 🔧 Melhorias Técnicas:
- [ ] Persistência de dados (AsyncStorage)
- [ ] Integração com gateway de pagamento
- [ ] Testes unitários e E2E
- [ ] Animações avançadas
- [ ] Otimização de imagens
- [ ] Lazy loading de componentes
- [ ] Internacionalização (i18n)

---

## 📦 Scripts Disponíveis

- `npm start` – Inicia o Expo Dev Tools
- `npm run android` – Build/run Android (dev build)
- `npm run ios` – Build/run iOS (somente macOS)
- `npm run web` – Executa no navegador

---

## 🚀 Deploy

### OTA/Preview com EAS Update:
```bash
# 1. Fazer login na conta Expo
npx eas login

# 2. Associar o projeto
npx eas init

# 3. Publicar update
npx eas update --branch preview --message "primeira release"

# 4. Compartilhe o link do update que aparece no terminal
```

### Build para Lojas (APK/AAB/IPA):
```bash
# Android
npx eas build --platform android

# iOS
npx eas build --platform ios

# Acompanhe o link no terminal e baixe o artefato
```

### Web (Estático):
```bash
# Exportar para pasta dist/
npx expo export --platform web

# Publique em Vercel/Netlify/GitHub Pages apontando para dist/
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

---

## 📝 Licença

Este projeto é um exemplo educacional e está disponível para uso livre.

---

## 👨‍💻 Desenvolvedor

**Matheus Espírito Santo**  
GitHub: [@matheusesdev](https://github.com/matheusesdev)

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando React Native e Expo.

---

**Última atualização**: Novembro de 2025  
**Versão**: 1.0.0

