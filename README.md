# Aplicação gerenciador de contatos
- Essa aplicação tem como objetivo controlar o acesso local de usuários e após logado permite cadastrar e gerenciar contatos

# Iniciar aplicação
- Execute `npm install` para baixar as dependências do projeto.
- Registre a variavel de ambiente `VITE_GOOGLE_MAPS_API_KEY` com a API KEY gerada no google, lembre-se de dar permissão para uso do "google maps api" e "places api" diretamente no site `https://console.cloud.google.com`
- Execute `npm run dev` para iniciar a aplicação com o vite (Utilizado vite para tornar o desenvolvimento mais rapido).

# Uso
- Faça o cadastro de seu usuário e em seguida realize login, após isso já pode cadastrar seus contatos.

# Integrações
- Via CEP - Utilizado integração com Via Cep para busca de dados pelo CEP
- Google Maps - Utilizado biblioteca de integracao para mostrar o mapa e autocomplete

