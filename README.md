#  Token Manager Server
 O Token Manager Server e um serviço de geração de tokens .
## End Points
| Rotas|Método| Parâmetros | Descrição  |
| -------|----|------------ | ------------------- |
|  /generate-token | POST |  payload | Faz a criação de de tokens  | 
|  /validate-token | GET |  access_token  | Faz validação do token | 
|  /refresh-token | POST |  refresh_token , payload | Faz o refresh do token | 

# token_server
