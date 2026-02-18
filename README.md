# Desmanche Cigano

Site institucional em HTML, CSS e JavaScript estático.

## Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) (ou use o login com GitHub).
2. **Opção A – Pelo painel da Vercel**
   - Acesse [vercel.com/new](https://vercel.com/new).
   - Importe o repositório Git deste projeto (conecte GitHub/GitLab/Bitbucket).
   - A Vercel detecta que é um projeto estático; não é necessário definir comando de build.
   - Clique em **Deploy**.

3. **Opção B – Pela Vercel CLI**
   - Instale: `npm i -g vercel`
   - Na pasta do projeto: `vercel`
   - Siga as perguntas (login, nome do projeto, etc.).
   - Para produção: `vercel --prod`

O site ficará disponível em um endereço como `seu-projeto.vercel.app`.

## Estrutura

- `index.html` – página principal
- `styles.css` – estilos (incluindo responsivo)
- `script.js` – comportamento (ex.: menu, interações)
- `vercel.json` – configuração de deploy na Vercel

## Responsividade

O layout se adapta a:
- Desktop (> 900px)
- Tablet (≈ 700px–900px)
- Celular (≈ 480px–700px)
- Telas pequenas (< 480px)

Botões e links principais têm área de toque de pelo menos 44px em dispositivos touch.
